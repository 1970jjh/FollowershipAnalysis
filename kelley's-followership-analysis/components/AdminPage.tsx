import React, { useState, useEffect } from 'react';
import { getAllPDFRecords, deletePDFRecord, PDFRecord } from '../services/pdfStorageService';
import { Button } from './Button';

interface AdminPageProps {
  onBack: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [records, setRecords] = useState<PDFRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPDFRecords();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'PDF 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record: PDFRecord) => {
    if (!record.id) return;
    if (!confirm(`${record.userName}님의 리포트를 삭제하시겠습니까?`)) return;

    try {
      setDeletingId(record.id);
      await deletePDFRecord(record.id, record.fileName);
      setRecords(prev => prev.filter(r => r.id !== record.id));
    } catch (err: any) {
      alert('삭제 실패: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 통계 계산
  const stats = {
    total: records.length,
    byType: records.reduce((acc, r) => {
      acc[r.followershipType] = (acc[r.followershipType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCompany: records.reduce((acc, r) => {
      acc[r.company] = (acc[r.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-2 border-black rounded-xl p-6 mb-6 shadow-brutal">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black text-gray-900">📊 관리자 대시보드</h1>
            <Button variant="secondary" onClick={onBack}>
              ← 메인으로
            </Button>
          </div>
          <p className="text-gray-600">팔로워십 진단 결과 PDF를 관리합니다.</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
            <p className="text-sm text-blue-600 font-bold">총 진단 수</p>
            <p className="text-3xl font-black text-blue-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
            <p className="text-sm text-green-600 font-bold">회사별</p>
            <div className="text-sm mt-1">
              {Object.entries(stats.byCompany).slice(0, 3).map(([company, count]) => (
                <span key={company} className="inline-block mr-2 bg-green-100 px-2 py-1 rounded text-green-800">
                  {company}: {count}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
            <p className="text-sm text-purple-600 font-bold">유형별</p>
            <div className="text-sm mt-1">
              {Object.entries(stats.byType).map(([type, count]) => (
                <span key={type} className="inline-block mr-2 bg-purple-100 px-2 py-1 rounded text-purple-800">
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button onClick={loadRecords} disabled={loading}>
            🔄 새로고침
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-black border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p>로딩 중...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white border-2 border-gray-300 rounded-xl p-12 text-center">
            <p className="text-gray-500 text-lg">아직 저장된 PDF가 없습니다.</p>
          </div>
        ) : (
          /* Records Table */
          <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-brutal">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-black">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">이름</th>
                    <th className="px-4 py-3 text-left font-bold">회사</th>
                    <th className="px-4 py-3 text-left font-bold">유형</th>
                    <th className="px-4 py-3 text-center font-bold">점수 (A/B)</th>
                    <th className="px-4 py-3 text-left font-bold">날짜</th>
                    <th className="px-4 py-3 text-center font-bold">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{record.userName}</td>
                      <td className="px-4 py-3">{record.company}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                          {record.followershipType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        {record.scoreA} / {record.scoreB}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <a
                            href={record.downloadURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-500 text-white rounded font-bold text-sm hover:bg-green-600 transition-colors"
                          >
                            📥 다운로드
                          </a>
                          <button
                            onClick={() => handleDelete(record)}
                            disabled={deletingId === record.id}
                            className="px-3 py-1 bg-red-500 text-white rounded font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {deletingId === record.id ? '삭제 중...' : '🗑️ 삭제'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          @JJ Creative 교육연구소 - 관리자 페이지
        </p>
      </div>
    </div>
  );
};

import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { storage, db } from './firebaseConfig';

export interface PDFRecord {
  id?: string;
  fileName: string;
  userName: string;
  company: string;
  followershipType: string;
  scoreA: number;
  scoreB: number;
  downloadURL: string;
  createdAt: Date;
}

// PDF를 Firebase Storage에 업로드하고 Firestore에 메타데이터 저장
export const uploadPDFToStorage = async (
  pdfBlob: Blob,
  userName: string,
  company: string,
  followershipType: string,
  scoreA: number,
  scoreB: number
): Promise<string> => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `팔로워십_진단결과_${company}_${userName}_${timestamp}.pdf`;
    const storageRef = ref(storage, `followership-reports/${fileName}`);

    // PDF 업로드
    await uploadBytes(storageRef, pdfBlob, {
      contentType: 'application/pdf'
    });

    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(storageRef);

    // Firestore에 메타데이터 저장
    await addDoc(collection(db, 'pdfReports'), {
      fileName,
      userName,
      company,
      followershipType,
      scoreA,
      scoreB,
      downloadURL,
      createdAt: new Date()
    });

    return downloadURL;
  } catch (error) {
    console.error('PDF 업로드 오류:', error);
    throw error;
  }
};

// 모든 PDF 레코드 가져오기 (관리자용)
export const getAllPDFRecords = async (): Promise<PDFRecord[]> => {
  try {
    const q = query(collection(db, 'pdfReports'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as PDFRecord[];
  } catch (error) {
    console.error('PDF 레코드 조회 오류:', error);
    throw error;
  }
};

// PDF 레코드 삭제 (관리자용)
export const deletePDFRecord = async (recordId: string, fileName: string): Promise<void> => {
  try {
    // Storage에서 파일 삭제
    const storageRef = ref(storage, `followership-reports/${fileName}`);
    await deleteObject(storageRef);

    // Firestore에서 레코드 삭제
    await deleteDoc(doc(db, 'pdfReports', recordId));
  } catch (error) {
    console.error('PDF 삭제 오류:', error);
    throw error;
  }
};

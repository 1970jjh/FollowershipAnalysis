import React, { useState, useEffect, useRef } from 'react';
import { ALL_QUESTIONS, FOLLOWERSHIP_TYPES } from './constants';
import { UserInfo, FollowershipType, AnalysisResult } from './types';
import { analyzeFollowershipWithGemini } from './services/geminiService';
import { QuestionCard } from './components/QuestionCard';
import { Button } from './components/Button';
import { ResultChart } from './components/ResultChart';

enum Step {
  INTRO = 'INTRO',
  USER_INFO = 'USER_INFO',
  QUESTIONS = 'QUESTIONS',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.INTRO);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', company: '' });
  const [answers, setAnswers] = useState<number[]>(new Array(20).fill(0));
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.company) {
      setStep(Step.QUESTIONS);
      scrollToTop();
    }
  };

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Logic (based on center point 30):
  // Pragmatic: A 20-40, B 20-40 (center zone)
  // Exemplary: A > 30, B > 30 (excluding pragmatic)
  // Alienated: A <= 30, B > 30
  // Conformist: A > 30, B <= 30
  // Passive: A <= 30, B <= 30
  const calculateType = (scoreA: number, scoreB: number): FollowershipType => {
    // 실무형: 중앙 영역 (20-40, 20-40)
    if (scoreA >= 20 && scoreA <= 40 && scoreB >= 20 && scoreB <= 40) {
      return FOLLOWERSHIP_TYPES.PRAGMATIC;
    }
    // 주도형: 고참여 + 고비판적 사고 (A > 30, B > 30, 실무형 제외)
    if (scoreA > 30 && scoreB > 30) {
      return FOLLOWERSHIP_TYPES.EXEMPLARY;
    }
    // 소외형: 저참여 + 고비판적 사고 (A <= 30, B > 30)
    if (scoreA <= 30 && scoreB > 30) {
      return FOLLOWERSHIP_TYPES.ALIENATED;
    }
    // 순응형: 고참여 + 저비판적 사고 (A > 30, B <= 30)
    if (scoreA > 30 && scoreB <= 30) {
      return FOLLOWERSHIP_TYPES.CONFORMIST;
    }
    // 수동형: 저참여 + 저비판적 사고
    return FOLLOWERSHIP_TYPES.PASSIVE;
  };

  const handleAnalysis = async () => {
    // Validate all answered
    if (answers.some(a => a === 0)) {
      alert("모든 문항에 답변해주세요.");
      return;
    }

    setStep(Step.ANALYZING);

    try {
      // Split answers
      const answersA = answers.slice(0, 10);
      const answersB = answers.slice(10, 20);
      
      const scoreA = answersA.reduce((a, b) => a + b, 0);
      const scoreB = answersB.reduce((a, b) => a + b, 0);
      
      const type = calculateType(scoreA, scoreB);

      const reportHTML = await analyzeFollowershipWithGemini(userInfo, scoreA, scoreB, type, answersA, answersB);

      setResult({
        type,
        scoreA,
        scoreB,
        reportHTML,
        answersA,
        answersB
      });
      setStep(Step.RESULT);
      scrollToTop();

    } catch (e: any) {
      setErrorMsg(e.message || "분석 중 오류가 발생했습니다.");
      setStep(Step.ERROR);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Progress calculation
  const answeredCount = answers.filter(a => a > 0).length;
  const progress = (answeredCount / 20) * 100;

  return (
    <div className="min-h-screen pb-10 font-sans text-gray-900 bg-[#f0f0f0] print:bg-white" ref={topRef}>
      {/* Header - Glassmorphism (hidden in print) */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-4 border-black px-4 py-3 flex justify-between items-center shadow-sm no-print print:hidden">
        <h1 className="text-xl font-display font-black tracking-tight text-brutal-blue">
          KELLEY'S<span className="text-black">FOLLOWERSHIP</span>
        </h1>
        {step === Step.QUESTIONS && (
          <div className="text-xs font-bold font-mono border border-black px-2 py-1 bg-white">
            {answeredCount}/20
          </div>
        )}
      </header>

      {/* Print Only Header */}
      <div className="hidden print:block print:mb-8 text-center border-b-2 border-black pb-4">
        <h1 className="text-3xl font-display font-black text-brutal-blue">
          KELLEY'S FOLLOWERSHIP REPORT
        </h1>
        <p className="text-sm text-gray-500 mt-2">Personalized Analysis powered by AI</p>
      </div>

      <main className="max-w-md mx-auto px-4 py-8 print:max-w-none print:px-0">
        {step === Step.INTRO && (
          <div className="flex flex-col gap-6 animate-fade-in-up no-print">
            <div className="bg-white border-2 border-black shadow-brutal p-6 rounded-xl">
              <h2 className="text-3xl font-display font-black mb-4 leading-none">
                어떤 유형의<br/>팔로워인가요?
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                켈리(Kelley)의 모델을 기반으로 당신의 팔로워십 스타일을 진단하고, 
                <span className="font-bold bg-yellow-200 px-1 mx-1 border border-black">AI 맞춤형 리포트</span>를 제공합니다.
              </p>
              <div className="space-y-2 font-mono text-sm border-t-2 border-black pt-4">
                <p>⏱ 소요시간: 약 3분</p>
                <p>📝 문항수: 20문항</p>
              </div>
            </div>
            
            <Button fullWidth onClick={() => setStep(Step.USER_INFO)}>
              진단 시작하기 →
            </Button>
          </div>
        )}

        {step === Step.USER_INFO && (
          <form onSubmit={handleUserInfoSubmit} className="flex flex-col gap-6 no-print">
            <div className="bg-white border-2 border-black shadow-brutal p-6 rounded-xl">
              <h2 className="text-2xl font-display font-bold mb-6">기본 정보</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-2">회사명</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 border-2 border-black rounded bg-brutal-bg focus:outline-none focus:ring-2 focus:ring-brutal-blue focus:bg-white transition-colors"
                    placeholder="예: 에쓰오일"
                    value={userInfo.company}
                    onChange={(e) => setUserInfo({...userInfo, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">성명</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 border-2 border-black rounded bg-brutal-bg focus:outline-none focus:ring-2 focus:ring-brutal-blue focus:bg-white transition-colors"
                    placeholder="예: 홍길동"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth>
              다음 단계 →
            </Button>
            <button 
              type="button" 
              onClick={() => setStep(Step.INTRO)}
              className="text-center underline font-bold text-gray-500"
            >
              뒤로 가기
            </button>
          </form>
        )}

        {step === Step.QUESTIONS && (
          <div className="flex flex-col gap-4 no-print">
            <div className="bg-blue-100 border-2 border-black p-4 mb-2 rounded-lg">
              <h3 className="font-bold text-lg mb-1">Part A. 능동적 참여</h3>
              <p className="text-sm">얼마나 주도적으로 업무에 참여하시나요?</p>
            </div>
            
            {ALL_QUESTIONS.slice(0, 10).map((q, idx) => (
              <QuestionCard 
                key={q.id} 
                question={q} 
                index={idx} 
                value={answers[idx]} 
                onChange={(val) => handleAnswerChange(idx, val)} 
              />
            ))}

            <div className="bg-yellow-100 border-2 border-black p-4 my-2 rounded-lg">
              <h3 className="font-bold text-lg mb-1">Part B. 독립적 사고</h3>
              <p className="text-sm">얼마나 비판적이고 독립적으로 사고하시나요?</p>
            </div>

            {ALL_QUESTIONS.slice(10, 20).map((q, idx) => (
              <QuestionCard 
                key={q.id} 
                question={q} 
                index={idx + 10} 
                value={answers[idx + 10]} 
                onChange={(val) => handleAnswerChange(idx + 10, val)} 
              />
            ))}

            <div className="sticky bottom-4 z-40">
              <Button 
                fullWidth 
                onClick={handleAnalysis}
                className="shadow-brutal-lg"
              >
                결과 분석하기 ✨
              </Button>
            </div>
          </div>
        )}

        {step === Step.ANALYZING && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm no-print">
            <div className="w-16 h-16 border-4 border-black border-t-brutal-blue rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-display font-black mb-2 animate-pulse">ANALYZING...</h2>
            <p className="text-center max-w-xs px-4 font-medium">
              AI가 {userInfo.name}님의 데이터를 바탕으로<br/>심층 리포트를 작성 중입니다.
            </p>
          </div>
        )}

        {step === Step.RESULT && result && (
          <div className="space-y-8 animate-fade-in-up print:space-y-6">
            
            {/* User Info Block for Print */}
            <div className="hidden print:flex flex-row justify-between bg-gray-50 p-4 border-2 border-black rounded mb-4">
               <div>
                  <span className="font-bold text-gray-500 block text-xs uppercase">Name</span>
                  <span className="font-bold text-lg">{userInfo.name}</span>
               </div>
               <div>
                  <span className="font-bold text-gray-500 block text-xs uppercase">Company</span>
                  <span className="font-bold text-lg">{userInfo.company}</span>
               </div>
               <div>
                  <span className="font-bold text-gray-500 block text-xs uppercase">Type</span>
                  <span className="font-bold text-lg text-brutal-blue">{result.type.name}</span>
               </div>
               <div>
                  <span className="font-bold text-gray-500 block text-xs uppercase">Date</span>
                  <span className="font-bold text-lg">{new Date().toLocaleDateString()}</span>
               </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white border-2 border-black shadow-brutal p-6 rounded-xl relative overflow-hidden print:shadow-none print:border-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 print:hidden"></div>
              
              <div className="relative z-10 text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">YOUR TYPE</p>
                <h2 className="text-4xl font-display font-black text-brutal-blue mb-1">
                  {result.type.name}
                </h2>
                <p className="font-mono text-lg font-bold text-gray-400 mb-6">
                  {result.type.english}
                </p>
                
                <div className="flex justify-center gap-4 text-sm font-bold">
                  <div className="bg-gray-100 px-3 py-2 rounded border border-black print:bg-white">
                    참여도: <span className="text-brutal-blue text-lg">{result.scoreA}</span>
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded border border-black print:bg-white">
                    비판적사고: <span className="text-brutal-blue text-lg">{result.scoreB}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="print:break-inside-avoid">
               <ResultChart scoreA={result.scoreA} scoreB={result.scoreB} />
            </div>

            {/* AI Report */}
            <div className="bg-white border-2 border-black shadow-brutal p-6 sm:p-8 rounded-xl print:shadow-none print:border-none print:p-0">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-black/10 print:hidden">
                <span className="text-2xl">🤖</span>
                <h3 className="text-xl font-bold !m-0 text-black">AI Analysis Report</h3>
              </div>
              
              <div 
                dangerouslySetInnerHTML={{ __html: result.reportHTML }} 
                className="report-content"
              />
            </div>

            <div className="flex flex-col gap-3 no-print">
              <Button fullWidth onClick={handlePrint}>
                📄 리포트 인쇄 / PDF 저장
              </Button>
              <Button variant="secondary" fullWidth onClick={() => {
                setStep(Step.INTRO);
                setAnswers(new Array(20).fill(0));
                setResult(null);
              }}>
                🔄 처음으로 돌아가기
              </Button>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-8 mb-12 no-print">
              @JJ Creative 교육연구소
            </p>
          </div>
        )}

        {step === Step.ERROR && (
          <div className="bg-red-50 border-2 border-brutal-red p-6 rounded-xl text-center no-print">
            <h3 className="text-xl font-bold text-brutal-red mb-2">오류가 발생했습니다</h3>
            <p className="mb-6">{errorMsg}</p>
            <Button variant="secondary" onClick={() => setStep(Step.QUESTIONS)}>
              다시 시도하기
            </Button>
          </div>
        )}
      </main>
      
      {/* Progress Bar (Visible only in Questions) */}
      {step === Step.QUESTIONS && (
        <div className="fixed top-[60px] left-0 w-full h-1.5 bg-gray-200 z-40 no-print">
          <div 
            className="h-full bg-brutal-blue transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default App;
import { GoogleGenAI } from "@google/genai";
import { UserInfo, FollowershipType } from '../types';
import { QUESTIONS_A, QUESTIONS_B } from '../constants';

export const analyzeFollowershipWithGemini = async (
  userInfo: UserInfo,
  scoreA: number,
  scoreB: number,
  type: FollowershipType,
  answersA: number[],
  answersB: number[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please check your environment configuration.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Formatting answers for the prompt
    const formattedAnswersA = answersA.map((score, idx) => `${idx + 1}. ${QUESTIONS_A[idx].text}: ${score}점`).join('\n');
    const formattedAnswersB = answersB.map((score, idx) => `${idx + 1}. ${QUESTIONS_B[idx].text}: ${score}점`).join('\n');

    const prompt = `당신은 조직 심리학과 리더십 전문가입니다. 켈리(Robert E. Kelley)의 팔로워십 이론을 기반으로 ${userInfo.name}님을 위한 퍼스널 브랜딩 리포트를 작성합니다.

**진단 대상자 정보:**
- 이름: ${userInfo.name}
- 회사: ${userInfo.company}
- 진단일: ${new Date().toLocaleDateString('ko-KR')}

**진단 점수:**
- 능동적 참여 (A): ${scoreA}점 / 50점
- 독립적/비판적 사고 (B): ${scoreB}점 / 50점
- 진단 유형: ${type.name} (${type.english}) 팔로워

**상세 응답 데이터:**
[능동적 참여 문항 (A)]
${formattedAnswersA}

[독립적/비판적 사고 문항 (B)]
${formattedAnswersB}

**작성 지침:**
1. 가독성을 최우선으로 고려하세요.
2. HTML 태그에 Tailwind CSS 클래스를 직접 적용하세요.
3. 중요한 키워드는 볼드체, 색상 등을 사용하여 강조해주세요.
4. **절대로 <table> 태그를 사용하지 마세요.** 모든 내용은 <p>, <ul>, <li> 태그만 사용하세요.
5. 역량 개발 계획은 반드시 단순한 번호 리스트(<ol><li>)로 작성하세요. 복잡한 레이아웃 금지.

**HTML 출력 형식 (반드시 이 구조를 따르세요):**

<div class="space-y-6 text-gray-800">

  <!-- 섹션 1: 유형 분석 -->
  <div class="bg-white p-5 rounded-xl border-2 border-black">
    <h3 class="text-lg font-black text-blue-700 flex items-center gap-2 mb-3">
      <span>🧐</span> 유형별 특징 분석
    </h3>
    <p class="text-base font-bold text-gray-900 border-l-4 border-blue-500 pl-3 mb-3">
      "${userInfo.name}님은 <span class="text-blue-600">${type.name}</span>의 전형적인 특징을 보이고 있습니다."
    </p>
    <p class="text-sm leading-relaxed text-gray-700 mb-2"><!-- 분석 내용 문단 1 --></p>
    <p class="text-sm leading-relaxed text-gray-700"><!-- 분석 내용 문단 2 --></p>
  </div>

  <!-- 섹션 2: 강점 -->
  <div class="bg-green-50 p-5 rounded-xl border-2 border-green-600">
    <h3 class="text-lg font-black text-green-800 flex items-center gap-2 mb-3">
      <span>💪</span> 당신의 핵심 강점
    </h3>
    <ul class="space-y-2 text-sm">
      <li class="flex items-start gap-2">
        <span class="text-green-600 font-bold">✔</span>
        <span><strong>키워드:</strong> 설명</span>
      </li>
      <!-- 강점 5개 -->
    </ul>
  </div>

  <!-- 섹션 3: 개선 영역 -->
  <div class="bg-red-50 p-5 rounded-xl border-2 border-red-400">
    <h3 class="text-lg font-black text-red-800 flex items-center gap-2 mb-3">
      <span>🔧</span> 개선이 필요한 영역
    </h3>
    <ul class="space-y-2 text-sm">
      <li class="flex items-start gap-2">
        <span class="text-red-500 font-bold">⚠</span>
        <span>개선점 설명</span>
      </li>
      <!-- 개선점 4개 -->
    </ul>
  </div>

  <!-- 섹션 4: 역량 개발 계획 (단순 리스트만 사용!) -->
  <div class="bg-white p-5 rounded-xl border-2 border-black">
    <h3 class="text-lg font-black text-purple-700 flex items-center gap-2 mb-3">
      <span>🚀</span> 역량 개발 계획
    </h3>
    <div class="bg-purple-50 p-3 rounded-lg mb-4">
      <p class="font-bold text-purple-900 text-sm">💡 One Point Advice</p>
      <p class="text-purple-800 text-sm mt-1"><!-- 핵심 조언 한 문장 --></p>
    </div>
    <ul class="space-y-3 text-sm">
      <li><strong class="text-purple-700">3개월 내:</strong> <!-- 구체적 행동 한 문장 --></li>
      <li><strong class="text-purple-700">6개월 내:</strong> <!-- 구체적 행동 한 문장 --></li>
      <li><strong class="text-purple-700">1년 내:</strong> <!-- 구체적 행동 한 문장 --></li>
    </ul>
  </div>

  <!-- 섹션 5: 종합 평가 -->
  <div class="bg-yellow-50 p-5 rounded-xl border-2 border-yellow-400">
    <h3 class="text-lg font-black text-yellow-800 flex items-center gap-2 mb-3">
      <span>🎓</span> 종합 평가
    </h3>
    <p class="text-sm leading-relaxed text-gray-800"><!-- 종합 평가 2-3문장 --></p>
  </div>

</div>`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let reportText = response.text || "리포트를 생성할 수 없습니다.";
    
    // Cleanup markdown code blocks if present
    reportText = reportText.replace(/```html/g, '').replace(/```/g, '');

    return reportText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
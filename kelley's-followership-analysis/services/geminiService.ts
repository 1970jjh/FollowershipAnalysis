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
1.  가독성을 최우선으로 고려하세요.
2.  HTML 태그에 Tailwind CSS 클래스를 직접 적용하여 시각적으로 아름다운 리포트를 만들어주세요.
3.  중요한 키워드는 볼드체, 형광펜 효과, 색상 등을 사용하여 강조해주세요.
4.  문단은 적절히 나누고, 줄바꿈을 통해 여백을 주세요.

**HTML 출력 형식 (반드시 이 구조와 클래스를 사용하여 스타일링된 HTML만 출력하세요):**

<div class="space-y-8 text-gray-800">

  <!-- 섹션 1: 유형 분석 -->
  <div class="bg-white p-6 rounded-xl border-2 border-black shadow-sm">
    <h3 class="text-xl font-black text-blue-700 flex items-center gap-2 mb-4">
      <span class="text-2xl">🧐</span> 유형별 특징 분석
    </h3>
    <div class="space-y-4 leading-relaxed text-gray-700">
      <p class="text-lg font-bold text-gray-900 border-l-4 border-blue-500 pl-3">
        "${userInfo.name}님은 <span class="text-blue-600">${type.name}</span>의 전형적인 특징을 보이고 있습니다."
      </p>
      <p>
        <!-- 특징 분석 내용 (문단 1) -->
      </p>
      <p>
        <!-- 특징 분석 내용 (문단 2) -->
      </p>
    </div>
  </div>

  <!-- 섹션 2: 강점 -->
  <div class="bg-green-50 p-6 rounded-xl border-2 border-green-600 shadow-brutal-sm">
    <h3 class="text-xl font-black text-green-800 flex items-center gap-2 mb-4">
      <span class="text-2xl">💪</span> 당신의 핵심 강점
    </h3>
    <ul class="space-y-3">
      <li class="flex items-start gap-2">
        <span class="text-green-600 mt-1 font-bold">✔</span>
        <span><strong class="text-green-900">키워드:</strong> 구체적인 설명...</span>
      </li>
      <!-- 강점 리스트 5~7개 -->
    </ul>
  </div>

  <!-- 섹션 3: 개선 영역 -->
  <div class="bg-red-50 p-6 rounded-xl border-2 border-red-400 shadow-brutal-sm">
    <h3 class="text-xl font-black text-red-800 flex items-center gap-2 mb-4">
      <span class="text-2xl">🔧</span> 개선이 필요한 영역
    </h3>
    <ul class="space-y-3">
      <li class="flex items-start gap-2">
        <span class="text-red-500 mt-1 font-bold">⚠</span>
        <span>구체적인 개선점 설명...</span>
      </li>
      <!-- 개선점 리스트 4~6개 -->
    </ul>
  </div>

  <!-- 섹션 4: 개발 계획 -->
  <div class="bg-white p-6 rounded-xl border-2 border-black">
    <h3 class="text-xl font-black text-purple-700 flex items-center gap-2 mb-4">
      <span class="text-2xl">🚀</span> 역량 개발 & 실행 계획
    </h3>
    <div class="mb-6 bg-purple-50 p-4 rounded-lg">
      <p class="font-bold text-purple-900 mb-2">💡 One Point Advice</p>
      <p class="text-purple-800"><!-- 핵심 조언 --></p>
    </div>
    <ol class="list-decimal list-inside space-y-3 font-medium text-gray-700">
      <li><span class="text-black">3개월 내:</span> <!-- 구체적 행동 --></li>
      <li><span class="text-black">6개월 내:</span> <!-- 구체적 행동 --></li>
      <li><span class="text-black">1년 내:</span> <!-- 구체적 행동 --></li>
      <!-- 추가 계획 -->
    </ol>
  </div>

  <!-- 섹션 5: 종합 평가 -->
  <div class="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-400">
    <h3 class="text-xl font-black text-yellow-800 flex items-center gap-2 mb-4">
      <span class="text-2xl">🎓</span> 종합 평가
    </h3>
    <div class="leading-relaxed text-gray-800 space-y-3">
      <!-- 종합 평가 내용 (따뜻하고 격려하는 톤) -->
    </div>
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
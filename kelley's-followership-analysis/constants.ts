import { Question } from './types';

export const QUESTIONS_A: Question[] = [
  { id: 1, text: "주어진 역할이나 상사의 지시에 온전히 따르는 것이 1순위이다", type: 'A' },
  { id: 2, text: "상사의 공로가 되는 것은 알지만 조직에 공헌을 수 있는 일이라면 최선을 다한다", type: 'A' },
  { id: 3, text: "자신의 업무 이외의 일이라도 상사의 요청은 할 수 있는 한 받아들인다", type: 'A' },
  { id: 4, text: "다른 사람이 경원시하는 성가신 일이라고 해도 상사의 지시라면 원칙적으로 받아들인다", type: 'A' },
  { id: 5, text: "상사와 의견이 다를 때는 최종적으로 자신을 숙이고 상사에게 맞춘다", type: 'A' },
  { id: 6, text: "회사가 요구하는 인재상이나 상사가 기대하는 행동이 무엇인지 숙고한다", type: 'A' },
  { id: 7, text: "직장 전체에서 결정한 방침은 적극적으로 받아들이고 행동한다", type: 'A' },
  { id: 8, text: "직장에서 의견 대립 등 마찰이 발생하면 직장의 화합을 위해 나서서 노력한다", type: 'A' },
  { id: 9, text: "설령 상사에게 문제가 있다 하더라도 더 나은 관계를 위해 노력한다", type: 'A' },
  { id: 10, text: "세세한 부분까지 일을 처리하여 상사의 업무가 줄어드는 것이 이상적이라고 생각한다", type: 'A' }
];

export const QUESTIONS_B: Question[] = [
  { id: 11, text: "상사에게 지시를 받으면 그 지시가 적절한지 따져 본다", type: 'B' },
  { id: 12, text: "상사가 판단을 망설일 때는 다른 각도에서 의견을 제시하고, 조언한다", type: 'B' },
  { id: 13, text: "상사가 업무에 대해 시정 명령을 내리면, 자신의 의견을 전하며 최선의 선택 방법을 모색한다", type: 'B' },
  { id: 14, text: "상사의 움직임을 두루 살피고, 마음에 걸리는 점이 있으면 의견을 이야기 한다", type: 'B' },
  { id: 15, text: "업무 방식이나 조직 문화에 대해서 아이디어나 개선점을 제안한다", type: 'B' },
  { id: 16, text: "상사에게 조언을 들으면, 들은 내용을 바탕으로 나름대로 생각하고 나서 수용한다", type: 'B' },
  { id: 17, text: "상사가 무모하거나 잘못된 방향으로 일을 진행하는 것처럼 보이면, 솔직한 나의 생각을 전한다", type: 'B' },
  { id: 18, text: "조직이 어려운 상황에 처해진 상사에게 의존하지 않고 스스로 돌파구를 열기 위해 노력한다", type: 'B' },
  { id: 19, text: "자기 신념과 가치관에 따라 일하고 있는지 생각한다", type: 'B' },
  { id: 20, text: "자신의 내부 평가가 하락할 위험성이 있다하더라도, 옳다고 판단한 일은 관철 시키려 한다", type: 'B' }
];

export const ALL_QUESTIONS = [...QUESTIONS_A, ...QUESTIONS_B];

export const FOLLOWERSHIP_TYPES = {
  PRAGMATIC: { name: '실무형', english: 'Pragmatic', color: '#22c55e' }, // Green
  EXEMPLARY: { name: '주도형', english: 'Exemplary', color: '#3b82f6' }, // Blue (Renamed from 모범형)
  ALIENATED: { name: '소외형', english: 'Alienated', color: '#374151' }, // Dark Gray
  CONFORMIST: { name: '순응형', english: 'Conformist', color: '#eab308' }, // Yellow
  PASSIVE: { name: '수동형', english: 'Passive', color: '#ef4444' } // Red
};
import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  value: number;
  onChange: (val: number) => void;
  index: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, value, onChange, index }) => {
  return (
    <div className="mb-6 p-5 bg-white border-2 border-black shadow-brutal rounded-lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white font-bold rounded-full border-2 border-black">
          {index + 1}
        </div>
        <p className="font-medium text-lg text-gray-900 leading-snug pt-0.5">
          {question.text}
        </p>
      </div>
      
      <div className="flex justify-between gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => onChange(score)}
            className={`
              flex-1 h-12 sm:h-14 rounded-md border-2 border-black font-bold text-lg transition-all
              ${value === score 
                ? 'bg-brutal-blue text-white shadow-brutal-sm translate-y-[-2px]' 
                : 'bg-white text-black hover:bg-gray-100'
              }
            `}
            aria-label={`Score ${score}`}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2 px-1 text-xs font-bold text-gray-500 uppercase tracking-tighter">
        <span>전혀<br/>아니다</span>
        <span className="text-right">매우<br/>그렇다</span>
      </div>
    </div>
  );
};
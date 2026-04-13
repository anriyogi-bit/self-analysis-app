'use client';

import { Question } from '@/types';

interface SelectInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function SelectInput({ question, value, onChange }: SelectInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-gray-800 font-medium">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.hint && (
        <p className="text-sm text-gray-500">{question.hint}</p>
      )}
      <div className="space-y-2">
        {question.options?.map((option) => (
          <label
            key={option.value}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              value === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

'use client';

import { Question } from '@/types';

interface MultiSelectInputProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelectInput({ question, value, onChange }: MultiSelectInputProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-800 font-medium">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.hint && (
        <p className="text-sm text-gray-500">{question.hint}</p>
      )}
      <p className="text-sm text-gray-500">複数選択可</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {question.options?.map((option) => (
          <label
            key={option.value}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              value.includes(option.value)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              value={option.value}
              checked={value.includes(option.value)}
              onChange={() => toggleOption(option.value)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

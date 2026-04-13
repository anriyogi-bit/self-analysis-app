'use client';

import { Question } from '@/types';

interface TextInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ question, value, onChange }: TextInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-gray-800 font-medium">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.hint && (
        <p className="text-sm text-gray-500">{question.hint}</p>
      )}
      <textarea
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
        rows={3}
        placeholder={question.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

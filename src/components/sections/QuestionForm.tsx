'use client';

import { Question } from '@/types';
import { TextInput } from '@/components/forms/TextInput';
import { SelectInput } from '@/components/forms/SelectInput';
import { MultiSelectInput } from '@/components/forms/MultiSelectInput';
import { FileInput } from '@/components/forms/FileInput';

interface QuestionFormProps {
  question: Question;
  sessionId: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export function QuestionForm({ question, sessionId, value, onChange }: QuestionFormProps) {
  switch (question.type) {
    case 'text':
      return (
        <TextInput
          question={question}
          value={value as string}
          onChange={onChange}
        />
      );
    case 'select':
      return (
        <SelectInput
          question={question}
          value={value as string}
          onChange={onChange}
        />
      );
    case 'multiSelect':
      return (
        <MultiSelectInput
          question={question}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      );
    case 'file':
      return (
        <FileInput
          question={question}
          sessionId={sessionId}
          value={value as string}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

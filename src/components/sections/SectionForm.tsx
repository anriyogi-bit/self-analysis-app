'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/types';
import { QuestionForm } from './QuestionForm';
import { Button } from '@/components/ui/Button';

interface SectionFormProps {
  section: Section;
  sessionId: string;
  initialResponses: Record<string, string | string[]>;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  onComplete: () => void;
}

export function SectionForm({
  section,
  sessionId,
  initialResponses,
  onNext,
  onBack,
  isFirst,
  isLast,
  onComplete,
}: SectionFormProps) {
  const [responses, setResponses] = useState<Record<string, string | string[]>>(initialResponses);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setResponses(initialResponses);
  }, [initialResponses]);

  const handleChange = (questionId: string, value: string | string[]) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const saveResponses = async () => {
    setSaving(true);
    try {
      await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          section: section.id,
          responses,
        }),
      });
    } catch (error) {
      console.error('Failed to save responses:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await saveResponses();
    if (isLast) {
      onComplete();
    } else {
      onNext();
    }
  };

  const handleBack = async () => {
    await saveResponses();
    onBack();
  };

  return (
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{section.name}</h2>
        {section.description && (
          <p className="mt-2 text-gray-600">{section.description}</p>
        )}
        {section.optional && (
          <p className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
            このセクションは任意回答です
          </p>
        )}
      </div>

      <div className="space-y-8">
        {section.questions.map((question) => (
          <QuestionForm
            key={question.id}
            question={question}
            sessionId={sessionId}
            value={responses[question.id] || (question.type === 'multiSelect' ? [] : '')}
            onChange={(value) => handleChange(question.id, value)}
          />
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t">
        {!isFirst ? (
          <Button variant="outline" onClick={handleBack} disabled={saving}>
            前へ
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={handleNext} loading={saving}>
          {isLast ? '完了して分析へ' : '次へ'}
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { sections } from '@/lib/questions';
import { Question } from '@/types';

export default function QuestionnairePage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [allResponses, setAllResponses] = useState<Record<string, Record<string, string | string[]>>>({});
  const [loading, setLoading] = useState(true);

  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const questionsBeforeCurrentSection = sections
    .slice(0, currentSection)
    .reduce((acc, s) => acc + s.questions.length, 0);
  const currentQuestionNumber = questionsBeforeCurrentSection + currentQuestion + 1;
  const progress = (currentQuestionNumber / totalQuestions) * 100;

  const section = sections[currentSection];
  const question = section?.questions[currentQuestion];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await fetch(`/api/sessions?id=${sessionId}`);
        if (!sessionRes.ok) {
          router.push('/');
          return;
        }

        const responsesRes = await fetch(`/api/responses?sessionId=${sessionId}`);
        if (responsesRes.ok) {
          const responses = await responsesRes.json();
          setAllResponses(responses);

          // 最後に回答した質問の次から再開
          let lastSection = 0;
          let lastQuestion = 0;

          for (let sIdx = 0; sIdx < sections.length; sIdx++) {
            const sec = sections[sIdx];
            const sectionResponses = responses[sec.id] || {};

            for (let qIdx = 0; qIdx < sec.questions.length; qIdx++) {
              const q = sec.questions[qIdx];
              const answer = sectionResponses[q.id];

              if (answer !== undefined && answer !== '' &&
                  !(Array.isArray(answer) && answer.length === 0)) {
                // この質問は回答済み、次の質問へ
                if (qIdx < sec.questions.length - 1) {
                  lastSection = sIdx;
                  lastQuestion = qIdx + 1;
                } else if (sIdx < sections.length - 1) {
                  lastSection = sIdx + 1;
                  lastQuestion = 0;
                } else {
                  // 全部回答済み
                  lastSection = sections.length - 1;
                  lastQuestion = sections[sections.length - 1].questions.length - 1;
                }
              }
            }
          }

          setCurrentSection(lastSection);
          setCurrentQuestion(lastQuestion);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, router]);

  const saveResponse = useCallback(async (sectionId: string, questionId: string, value: string | string[]) => {
    setAllResponses((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: value,
      },
    }));

    await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        section: sectionId,
        responses: { [questionId]: value },
      }),
    });

    // 氏名を入力したらセッション名も更新
    if (questionId === 'name' && typeof value === 'string' && value.trim()) {
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, name: value.trim() }),
      });
    }
  }, [sessionId]);

  const goNext = async () => {
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < sections.length - 1) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setCurrentQuestion(0);
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, currentSection: nextSection }),
      });
    } else {
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, status: 'completed' }),
      });
      router.push(`/analysis/${sessionId}`);
    }
  };

  const goPrev = async () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      setCurrentQuestion(sections[prevSection].questions.length - 1);
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, currentSection: prevSection }),
      });
    }
  };

  const getCurrentValue = () => {
    return allResponses[section?.id]?.[question?.id] || (question?.type === 'multiSelect' ? [] : '');
  };

  const handleSelect = async (value: string) => {
    await saveResponse(section.id, question.id, value);
    setTimeout(goNext, 300);
  };

  const handleMultiSelect = async (value: string) => {
    const current = (getCurrentValue() as string[]) || [];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    await saveResponse(section.id, question.id, newValue);
  };

  const handleTextChange = (value: string) => {
    setAllResponses((prev) => ({
      ...prev,
      [section.id]: {
        ...prev[section.id],
        [question.id]: value,
      },
    }));
  };

  const handleTextBlur = async () => {
    const value = getCurrentValue();
    if (value) {
      await saveResponse(section.id, question.id, value as string);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-stone-300 border-t-stone-600 mx-auto mb-4" />
          <p className="text-stone-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-stone-200">
        <div
          className="h-full bg-stone-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header className="pt-8 pb-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-stone-400 hover:text-stone-600 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            終了
          </button>
          <div className="text-stone-400 text-sm">
            {currentQuestionNumber} / {totalQuestions}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">
          {/* Section indicator */}
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-stone-200 text-stone-600 text-xs rounded-full">
              {section.name}
            </span>
          </div>

          {/* Question */}
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-medium text-stone-800 leading-relaxed">
              {question.text}
            </h2>
            {question.hint && (
              <p className="mt-3 text-stone-400 text-sm">{question.hint}</p>
            )}
          </div>

          {/* Answer area */}
          <div className="space-y-3">
            {question.type === 'text' && (
              <div>
                <textarea
                  className="w-full px-5 py-4 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent resize-none"
                  rows={4}
                  placeholder={question.placeholder || '回答を入力してください...'}
                  value={getCurrentValue() as string}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onBlur={handleTextBlur}
                />
                <button
                  onClick={goNext}
                  className="mt-4 w-full py-4 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700"
                >
                  次へ
                </button>
              </div>
            )}

            {question.type === 'select' && (
              <div className="space-y-2">
                {question.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                      getCurrentValue() === option.value
                        ? 'bg-stone-800 text-white'
                        : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'multiSelect' && (
              <div>
                <div className="grid grid-cols-2 gap-2">
                  {question.options?.map((option) => {
                    const isSelected = (getCurrentValue() as string[]).includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleMultiSelect(option.value)}
                        className={`p-3 rounded-xl text-left text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-stone-800 text-white'
                            : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={goNext}
                  className="mt-4 w-full py-4 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700"
                >
                  次へ
                </button>
              </div>
            )}

            {question.type === 'file' && (
              <FileUploadQuestion
                question={question}
                sessionId={sessionId}
                value={getCurrentValue() as string}
                onSave={(value) => saveResponse(section.id, question.id, value)}
                onNext={goNext}
              />
            )}
          </div>
        </div>
      </main>

      {/* Navigation */}
      <footer className="pb-8 px-6">
        <div className="max-w-xl mx-auto flex justify-center">
          <button
            onClick={goPrev}
            disabled={currentSection === 0 && currentQuestion === 0}
            className="px-4 py-2 text-stone-400 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </button>
        </div>
      </footer>
    </div>
  );
}

function FileUploadQuestion({
  question,
  sessionId,
  value,
  onSave,
  onNext,
}: {
  question: Question;
  sessionId: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  onNext: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);
      formData.append('fileType', question.id.replace('_file', ''));

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        await onSave(data.storagePath);
        setFileName(file.name);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className={`block w-full p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
        value
          ? 'border-stone-400 bg-stone-100'
          : 'border-stone-300 bg-white hover:border-stone-400'
      }`}>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
          onChange={handleUpload}
        />
        <div className="text-center">
          {uploading ? (
            <div className="flex items-center justify-center gap-3 text-stone-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              アップロード中...
            </div>
          ) : value ? (
            <>
              <svg className="w-10 h-10 text-stone-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-stone-600 font-medium">アップロード完了</p>
              <p className="text-stone-400 text-sm mt-1">{fileName}</p>
            </>
          ) : (
            <>
              <svg className="w-10 h-10 text-stone-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-stone-600 font-medium">クリックしてファイルを選択</p>
              <p className="text-stone-400 text-sm mt-1">PDF、画像、テキストファイル</p>
            </>
          )}
        </div>
      </label>
      <button
        onClick={onNext}
        className="mt-4 w-full py-4 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700"
      >
        {value ? '次へ' : 'スキップ'}
      </button>
    </div>
  );
}

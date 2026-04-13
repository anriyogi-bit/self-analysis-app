'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sections } from '@/lib/questions';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [showResume, setShowResume] = useState(false);
  const [error, setError] = useState('');

  const startNew = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      router.push(`/questionnaire/${data.id}`);
    } catch (err) {
      console.error('Failed to create session:', err);
      setLoading(false);
    }
  };

  const resumeSession = async () => {
    if (!resumeName.trim()) {
      setError('名前を入力してください');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/sessions?name=${encodeURIComponent(resumeName.trim())}`);
      const data = await response.json();
      if (data.exists && data.session) {
        router.push(`/questionnaire/${data.session.id}`);
      } else {
        setError('その名前のデータが見つかりません');
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to find session:', err);
      setError('エラーが発生しました');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      resumeSession();
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="max-w-md mx-auto text-center w-full">
          <h1 className="text-4xl md:text-5xl font-light text-stone-800 mb-6 tracking-tight">
            自己分析ツール
          </h1>
          <p className="text-lg text-stone-500 mb-12 leading-relaxed">
            質問に答えて、あなたの本質を発見しましょう。
          </p>

          <div className="space-y-4">
            <button
              onClick={startNew}
              disabled={loading}
              className="w-full py-4 text-lg font-medium text-white bg-stone-800 rounded-xl hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '読み込み中...' : '新しく始める'}
            </button>

            {!showResume ? (
              <button
                onClick={() => setShowResume(true)}
                className="w-full py-4 text-lg font-medium text-stone-600 bg-white border border-stone-300 rounded-xl hover:bg-stone-50"
              >
                続きから再開
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="氏名を入力"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-5 py-4 text-lg bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 text-center"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResume(false)}
                    className="flex-1 py-3 text-stone-500 bg-stone-100 rounded-xl hover:bg-stone-200"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={resumeSession}
                    disabled={loading}
                    className="flex-1 py-3 text-white bg-stone-800 rounded-xl hover:bg-stone-700 disabled:opacity-50"
                  >
                    再開
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-8 text-stone-400 text-sm">
            所要時間：約30〜60分
          </p>
        </div>
      </section>

      {/* Sections overview */}
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-light text-center text-stone-800 mb-12">
            質問セクション
          </h2>

          <div className="space-y-3">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-stone-800">
                    {section.name}
                  </h3>
                </div>
                {section.optional && (
                  <span className="text-xs text-stone-400 bg-stone-200 px-2 py-1 rounded">
                    任意
                  </span>
                )}
                <span className="text-xs text-stone-400">
                  {section.questions.length}問
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-stone-100">
        <div className="max-w-4xl mx-auto px-6 text-center text-stone-400 text-sm">
          &copy; 2026 自己分析ツール
        </div>
      </footer>
    </div>
  );
}

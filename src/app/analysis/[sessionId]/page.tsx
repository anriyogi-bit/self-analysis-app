'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AnalysisContent } from '@/types';

const ANALYSIS_LABELS: { key: keyof AnalysisContent; label: string; number: string }[] = [
  { key: 'originalTraits', label: '私の本来の資質', number: '01' },
  { key: 'adaptedTraits', label: '環境適応で強化された特性', number: '02' },
  { key: 'topStrengths', label: '上位資質から見える主武器', number: '03' },
  { key: 'middleStrengths', label: '中位資質から見える補助的な力', number: '04' },
  { key: 'bottomStrengths', label: '下位資質から見える苦手領域', number: '05' },
  { key: 'bottomStrengthsImpact', label: '下位資質の影響', number: '06' },
  { key: 'loveSkills', label: '愛情や承認を得るために伸びた能力', number: '07' },
  { key: 'defenseReactions', label: '身につけた防衛反応', number: '08' },
  { key: 'stressPatterns', label: 'ストレス時の暴走パターン', number: '09' },
  { key: 'workStrengths', label: '仕事で活きやすい強み', number: '10' },
  { key: 'misunderstandings', label: '誤解されやすい点', number: '11' },
  { key: 'reactionsToRelease', label: '手放してもよい反応', number: '12' },
  { key: 'newReactionsToGrow', label: '今後育てるとよい反応', number: '13' },
  { key: 'userManual', label: '取扱説明書', number: '14' },
  { key: 'redefinitionMessage', label: '自分への再定義メッセージ', number: '15' },
];

export default function AnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [analysis, setAnalysis] = useState<AnalysisContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`/api/analyze?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
        }
      } catch (err) {
        console.error('Failed to fetch analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [sessionId]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!res.ok) {
        throw new Error('分析に失敗しました');
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setAnalyzing(false);
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

  if (!analysis) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-stone-200 rounded-full flex items-center justify-center mb-8">
            <svg className="w-10 h-10 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-2xl font-light text-stone-800 mb-4">
            分析の準備ができました
          </h1>
          <p className="text-stone-500 mb-8 leading-relaxed">
            回答をもとに、AIが15の観点から
            <br />
            あなたを深く分析します
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="w-full py-4 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                分析中...（1〜2分）
              </span>
            ) : (
              '分析を開始'
            )}
          </button>

          <div className="mt-6 flex justify-center gap-6 text-sm">
            <button
              onClick={() => router.push(`/questionnaire/${sessionId}`)}
              className="text-stone-400 hover:text-stone-600"
            >
              回答を編集
            </button>
            <button
              onClick={() => router.push('/')}
              className="text-stone-400 hover:text-stone-600"
            >
              トップに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="py-6 px-6 bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-stone-400 hover:text-stone-600 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            トップ
          </button>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="px-4 py-2 text-sm text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200 disabled:opacity-50"
          >
            {analyzing ? '分析中...' : '再分析'}
          </button>
        </div>
      </header>

      {/* Title */}
      <section className="py-12 px-6 bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-light text-stone-800 mb-2">
            分析結果
          </h1>
          <p className="text-stone-500">
            15の観点からあなたを分析しました
          </p>
        </div>
      </section>

      {/* Results */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {ANALYSIS_LABELS.map(({ key, label, number }) => (
            <div
              key={key}
              className="bg-white rounded-2xl p-8 border border-stone-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl font-light text-stone-300">
                  {number}
                </span>
                <h2 className="text-lg font-medium text-stone-800 pt-1">
                  {label}
                </h2>
              </div>
              <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                {analysis[key]}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push(`/questionnaire/${sessionId}`)}
            className="px-8 py-4 text-stone-600 font-medium rounded-xl border border-stone-300 hover:bg-stone-100"
          >
            回答を編集
          </button>
          <button
            onClick={() => {
              const text = ANALYSIS_LABELS.map(({ key, label, number }) =>
                `## ${number}. ${label}\n\n${analysis[key]}`
              ).join('\n\n---\n\n');
              navigator.clipboard.writeText(text);
              alert('クリップボードにコピーしました');
            }}
            className="px-8 py-4 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700"
          >
            結果をコピー
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 text-center text-stone-400 text-sm">
          &copy; 2026 自己分析ツール
        </div>
      </footer>
    </div>
  );
}

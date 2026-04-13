'use client';

import { useState, useRef } from 'react';
import { Question } from '@/types';

interface FileInputProps {
  question: Question;
  sessionId: string;
  value: string; // storage path
  onChange: (value: string) => void;
}

export function FileInput({ question, sessionId, value, onChange }: FileInputProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);
      formData.append('fileType', question.id.replace('_file', ''));

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const data = await response.json();
      onChange(data.storagePath);
      setFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setUploading(false);
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

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          value ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        {value ? (
          <div className="space-y-2">
            <div className="text-green-600 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              アップロード完了
            </div>
            <p className="text-sm text-gray-600">{fileName}</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-sm text-blue-600 hover:underline"
            >
              別のファイルを選択
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                アップロード中...
              </div>
            ) : (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-blue-600 hover:underline font-medium"
                >
                  ファイルを選択
                </button>
                <p className="text-sm text-gray-500">PDF、画像、テキストファイル対応</p>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

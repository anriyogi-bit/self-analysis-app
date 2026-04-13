// 質問タイプ
export type QuestionType = 'text' | 'select' | 'multiSelect' | 'file';

// 選択肢
export interface Option {
  value: string;
  label: string;
}

// 質問
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
}

// セクション
export interface Section {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  optional?: boolean;
}

// 回答
export interface Response {
  id?: string;
  session_id: string;
  section: string;
  question_id: string;
  answer: string | string[];
  created_at?: string;
}

// セッション
export interface Session {
  id: string;
  created_at: string;
  status: 'in_progress' | 'completed' | 'analyzed';
  current_section: number;
}

// アップロードファイル
export interface UploadedFile {
  id: string;
  session_id: string;
  file_type: 'clifton' | 'mbti' | 'other';
  file_name: string;
  storage_path: string;
  extracted_text?: string;
  created_at: string;
}

// 分析結果
export interface AnalysisResult {
  id: string;
  session_id: string;
  analysis_json: AnalysisContent;
  created_at: string;
}

// 分析内容（15観点）
export interface AnalysisContent {
  originalTraits: string;           // 1. 本来の資質
  adaptedTraits: string;            // 2. 環境適応で強化された特性
  topStrengths: string;             // 3. 上位資質から見える主武器
  middleStrengths: string;          // 4. 中位資質から見える補助的な力
  bottomStrengths: string;          // 5. 下位資質から見える苦手領域
  bottomStrengthsImpact: string;    // 6. 下位資質の影響
  loveSkills: string;               // 7. 愛情や承認を得るために伸びた能力
  defenseReactions: string;         // 8. 安全を確保するために身につけた防衛反応
  stressPatterns: string;           // 9. ストレス時の暴走パターン
  workStrengths: string;            // 10. 仕事で強みとして活きやすい点
  misunderstandings: string;        // 11. 対人関係で誤解されやすい点
  reactionsToRelease: string;       // 12. 今は手放してもよい反応
  newReactionsToGrow: string;       // 13. 今後育てるとよい新しい反応
  userManual: string;               // 14. 会社共有用の取扱説明書
  redefinitionMessage: string;      // 15. 自分への再定義メッセージ
}

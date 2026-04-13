import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisContent } from '@/types';

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable not configured');
  }
  return new GoogleGenerativeAI(apiKey);
}

const ANALYSIS_PROMPT = `以下は私の自己理解データです。
診断ファイルの内容、質問票の回答、現在の仕事上の特徴をもとに、断定ではなく仮説として丁寧に深く分析してください。

重要な前提：
- CliftonStrengths は上位資質だけでなく、34資質全順位を前提に分析してください
- 上位資質・中位資質・下位資質を分けて解釈してください
- 下位資質は単なる弱みではなく、自然には取りにくい反応・価値観・疲れやすい領域として扱ってください
- MBTIは表面的なタイプ説明で終わらせず、出自や適応とどう関係しているかを見てください
- やさしいが甘すぎず、具体的に書いてください

以下の15観点でJSON形式で整理してください。必ず有効なJSONのみを出力してください（説明文なし）：

{
  "originalTraits": "私の本来の資質（段落形式で具体的に）",
  "adaptedTraits": "環境適応で強化された特性（段落形式で具体的に）",
  "topStrengths": "CliftonStrengths上位資質から見える主武器（段落形式で具体的に）",
  "middleStrengths": "CliftonStrengths中位資質から見える補助的な力（段落形式で具体的に）",
  "bottomStrengths": "CliftonStrengths下位資質から見える、自然には取りにくい反応・価値観・苦手領域（段落形式で具体的に）",
  "bottomStrengthsImpact": "下位資質が仕事や対人でどう影響しやすいか（段落形式で具体的に）",
  "loveSkills": "愛情や承認を得るために伸びた能力（段落形式で具体的に）",
  "defenseReactions": "安全を確保するために身につけた防衛反応（段落形式で具体的に）",
  "stressPatterns": "ストレス時の暴走パターン（段落形式で具体的に）",
  "workStrengths": "仕事で強みとして活きやすい点（段落形式で具体的に）",
  "misunderstandings": "対人関係で誤解されやすい点（段落形式で具体的に）",
  "reactionsToRelease": "今は手放してもよい反応（段落形式で具体的に）",
  "newReactionsToGrow": "今後育てるとよい新しい反応（段落形式で具体的に）",
  "userManual": "会社共有用に要約するとしたらどんな取扱説明書になるか（段落形式で具体的に）",
  "redefinitionMessage": "自分への再定義メッセージ（段落形式で具体的に）"
}`;

export async function analyzeResponses(
  responses: Record<string, Record<string, string | string[]>>,
  diagnosisTexts: string[]
): Promise<AnalysisContent> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const userContent = `
${ANALYSIS_PROMPT}

---

## 質問票の回答

\`\`\`json
${JSON.stringify(responses, null, 2)}
\`\`\`

## 診断ファイルの内容

${diagnosisTexts.length > 0 ? diagnosisTexts.map((text, i) => `### ファイル ${i + 1}\n${text}`).join('\n\n') : '（診断ファイルなし）'}
`;

  const result = await model.generateContent(userContent);
  const response = result.response;
  const text = response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonMatch[0]) as AnalysisContent;
}

'use client';

import { useRouter } from 'next/navigation';
import { AnalysisContent } from '@/types';

const SAMPLE_ANALYSIS: AnalysisContent = {
  originalTraits: `あなたの本来の資質は「深い思考力」と「人への共感」が軸にあります。物事の本質を見抜く力と、相手の感情を自然と感じ取る感受性を持っています。

一人で静かに考える時間を必要とし、表面的な会話よりも意味のある深い対話を好みます。また、正義感が強く、理不尽なことに対して黙っていられない誠実さがあります。`,

  adaptedTraits: `環境への適応として「先回りして動く」「空気を読む」能力が強化されました。これは幼少期に家庭の緊張感を和らげるために身につけた反応と考えられます。

また、「自分がしっかりしなければ」という意識から、責任感と自立心が過剰に発達しています。これらは本来の資質ではなく、環境への適応反応として獲得されたものです。`,

  topStrengths: `【戦略性】複数のシナリオを瞬時に描き、最適な道筋を見出す力。問題解決において「こうなったらこうする」という複数のプランを常に持っています。

【内省】自分の思考や感情を深く掘り下げる力。自己理解が深く、なぜそう感じるのかを言語化できます。

【学習欲】新しい知識やスキルを習得するプロセス自体に喜びを感じます。専門性を深めることにモチベーションを感じます。`,

  middleStrengths: `【共感性】中位にあることで、相手の感情を理解しつつも、巻き込まれすぎないバランスを保てます。

【責任感】引き受けたことは最後までやり遂げますが、必要に応じて他者に委ねることもできます。

【親密性】深い関係を築く力はありますが、広く浅い人間関係も状況に応じて構築できます。`,

  bottomStrengths: `【社交性】大人数の場で積極的に人脈を広げることには自然とエネルギーを感じにくいです。これは弱みではなく、少人数での深い関係を好む特性の裏返しです。

【指令性】強い口調で人を動かすことは自然な反応ではありません。説得や合意形成を通じて人を動かすスタイルを取ります。

【競争性】他者との競争よりも、自分自身の成長や基準との比較に関心が向きます。`,

  bottomStrengthsImpact: `下位資質の影響として、以下の場面でストレスを感じやすい傾向があります：

・大人数の懇親会やネットワーキングイベント
・即座に強いリーダーシップを求められる場面
・数字で他者と比較される評価制度

これらは「苦手」というより「自然には取りにくい反応」です。必要に応じて発揮することはできますが、長時間続くと疲弊します。`,

  loveSkills: `「役に立つ存在でいること」で愛情や承認を得てきたパターンがあります。そのため、以下の能力が発達しました：

・相手のニーズを先読みして動く力
・問題を解決して感謝される経験を積む力
・「頼りになる人」としてのポジションを確立する力

これらは確かに強みですが、「役に立たなくても存在していていい」という感覚が薄くなるリスクがあります。`,

  defenseReactions: `安全を確保するために身につけた主な防衛反応：

【過剰な自立】人に頼る前に自分で何とかしようとする。弱みを見せることへの抵抗感。

【先回り】問題が起きる前に察知して対処する。これにより「想定外」への不安が強い。

【感情の抑制】ネガティブな感情を表に出さず、論理で処理しようとする。`,

  stressPatterns: `ストレスが強くなると以下のパターンが出やすくなります：

・一人で抱え込み、限界まで頑張ってしまう
・「もっとちゃんとやらないと」という自己批判が強まる
・人との距離を取り、殻にこもる
・睡眠や食事が乱れる

特に「期待に応えられていない」と感じた時にこのパターンが顕著になります。`,

  workStrengths: `仕事で特に活きる強み：

・複雑な問題を構造化して解決策を導く力
・深い専門性を築き、その領域で信頼される力
・一人ひとりに寄り添った丁寧なコミュニケーション
・長期的な視点での戦略立案
・粘り強く最後までやり遂げる姿勢`,

  misunderstandings: `対人関係で誤解されやすい点：

・「クール」「とっつきにくい」→ 実際は深く考えているだけで、関心がないわけではない
・「完璧主義」→ 高い基準を持っているが、他者にそれを強要しているわけではない
・「一人が好き」→ 一人の時間は必要だが、深い繋がりは大切にしている

初対面では距離を感じられやすいですが、関係が深まると印象が変わることが多いです。`,

  reactionsToRelease: `今は手放してもよい反応：

・「自分がやらなければ」という過剰な責任感
・弱みを見せることへの恐れ
・「役に立たない自分には価値がない」という思い込み
・完璧でなければいけないというプレッシャー

これらは過去には必要な防衛でしたが、今の環境では手放しても大丈夫です。`,

  newReactionsToGrow: `今後育てるとよい新しい反応：

・「助けて」と言う練習
・60%の出来でも一旦出してフィードバックを受ける姿勢
・感情を言葉にして伝える習慣
・「何もしない時間」を罪悪感なく過ごす力
・自分の限界を認め、断る勇気`,

  userManual: `【取扱説明書】

■ 最高のパフォーマンスを引き出すには
・深く考える時間と静かな環境を確保する
・「なぜ」の背景や目的を共有する
・長期的な成長機会を提示する

■ 注意が必要な状況
・急かされる環境や即断を求められる場面
・大人数での表面的な交流が続く時
・「とにかくやって」と理由なく指示される時

■ 効果的なコミュニケーション
・1on1でじっくり話す機会を設ける
・考える時間を与えてから意見を求める
・抽象的な指示より具体的な期待を伝える`,

  redefinitionMessage: `あなたへの再定義メッセージ：

あなたは「役に立つから価値がある」のではありません。
あなたは存在しているだけで、すでに十分です。

幼い頃から周囲の空気を読み、自分を後回しにしてきたあなたへ。
もう「しっかりしなければ」と自分を追い込まなくていい。

弱さを見せることは、信頼の証です。
助けを求めることは、相手を信じている証拠です。

これからは、自分のために時間を使っていい。
完璧でなくても、愛される価値がある。

あなたの深い思考力と共感性は、世界を少しずつ良くしています。
それを知っておいてください。`,
};

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

export default function DemoPage() {
  const router = useRouter();

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
          <span className="text-sm text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
            サンプル結果
          </span>
        </div>
      </header>

      {/* Title */}
      <section className="py-12 px-6 bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-light text-stone-800 mb-2">
            分析結果サンプル
          </h1>
          <p className="text-stone-500">
            実際の分析結果はこのような形式で表示されます
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
                {SAMPLE_ANALYSIS[key]}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-12 py-4 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700"
          >
            自分の分析を始める
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

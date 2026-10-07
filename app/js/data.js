// 初期データ。画像が未完成のものは emoji を代わりに出す（img: null）。
// AGY の新規画像が届いたら img にパスを入れるだけで差し替わる。

export const DEFAULT_EMOTIONS = [
  { id: 'ureshii', name: 'うれしい', img: 'images/kao/ureshii.webp', emoji: '😊' },
  { id: 'kanashii', name: 'かなしい', img: 'images/kao/kanashii.webp', emoji: '😢' },
  { id: 'okotte', name: 'おこっている', img: 'images/kao/okotte.webp', emoji: '😡' },
  { id: 'kowai', name: 'こわい', img: 'images/kao/kowai.webp', emoji: '😨' },
];

// 設定画面のアイコン候補
export const ICON_CHOICES = [
  { img: 'images/kao/ureshii.webp', emoji: '😊' },
  { img: 'images/kao/kanashii.webp', emoji: '😢' },
  { img: 'images/kao/okotte.webp', emoji: '😡' },
  { img: 'images/kao/kowai.webp', emoji: '😨' },
  ...['😊', '😢', '😡', '😟', '😨', '😲', '😳', '🤔', '😐', '🥰', '😴', '🤩'].map((e) => ({ img: null, emoji: e })),
];

export const MIN_EMOTIONS = 2;
export const MAX_EMOTIONS = 4;

// 気持ちカードの色（並び順で決まる）
export const CARD_COLORS = ['#FFE07A', '#9CC4FF', '#FF9C8F', '#D3BFF5'];

export const DEFAULT_LINES = [
  'おはよう', 'ありがとう', 'ごめんなさい', 'だいじょうぶ？', 'ほんとう？',
  'いいよ', 'いやです', 'またね', 'できた！', 'しらない',
];

// 場面＝「だれかが セリフを いっている ところ」。
// 同じセリフを ちがう きもちで いう場面を 2まいずつ 組にして、となりに ならべる（おはよう／いいよ／ごめんなさい／いやです）。
// situation は絵の説明（ちいさく出す）、line は吹き出しに大きく出すセリフ。
// img: null は新規作成待ち（IMAGE_SPEC 4.2）。絵文字は絵の中身を示すだけで、気持ちの答えにならないものにする
export const DEFAULT_SCENES = [
  { id: 'ba_01', title: 'プレゼント', situation: 'プレゼントを もらって', line: 'ありがとう', img: 'images/ba/ba_01_present.webp' },
  { id: 'ba_02', title: 'あさ', situation: 'ともだちに あって', line: 'おはよう', img: 'images/ba/ba_02_futari.webp' },
  { id: 'ba_11', title: 'あさ ②', situation: 'げんきが ない あさに', line: 'おはよう', img: null, emoji: '🏫' },
  { id: 'ba_13', title: 'あそぼう', situation: '「あそぼう」と いわれて', line: 'いいよ', img: null, emoji: '⚽' },
  { id: 'ba_14', title: 'けしゴム', situation: 'けしゴムを かってに つかわれて', line: 'いいよ', img: null, emoji: '✏️' },
  { id: 'ba_15', title: 'つみき', situation: 'ともだちの つみきを たおして', line: 'ごめんなさい', img: null, emoji: '🧱' },
  { id: 'ba_16', title: 'せんせいと', situation: 'せんせいに いわれて', line: 'ごめんなさい', img: null, emoji: '🏫' },
  // ba_12・ba_17 は いかのおすし素材の線画を仮置き。クレイ版（IMAGE_SPEC 4.3）が届いたら差し替える
  { id: 'ba_12', title: 'しらない ひと', situation: 'しらない ひとに こえを かけられて', line: 'いやです', img: 'images/ba/ba_12_kotowaru.webp' },
  { id: 'ba_18', title: 'ボール', situation: 'ボールを とられそうに なって', line: 'いやです', img: null, emoji: '🏀' },
  { id: 'ba_03', title: 'できた', situation: 'もんだいが とけて', line: 'わかった！', img: 'images/ba/ba_03_hirameki.webp' },
  { id: 'ba_04', title: 'おもちゃ', situation: 'おもちゃが こわれて', line: 'こわれちゃった', img: 'images/ba/ba_04_omocha.webp' },
  { id: 'ba_08', title: 'びっくり', situation: 'ともだちの はなしを きいて', line: 'ほんとう？', img: 'images/ba/ba_08_bikkuri.webp' },
  { id: 'ba_17', title: 'おおごえ', situation: 'しらない ひとに ついて こられて', line: 'たすけて！', img: 'images/ba/ba_17_tasukete.webp' },
  { id: 'ba_19', title: 'おわかれ', situation: 'ともだちが ひっこす ひに', line: 'またね', img: null, emoji: '🚚' },
];

// 初期データ。画像が未完成のものは emoji を代わりに出す（img: null）。
// AGY の新規画像が届いたら img にパスを入れるだけで差し替わる。

export const DEFAULT_EMOTIONS = [
  { id: 'ureshii', name: 'うれしい', img: 'images/kao/ureshii.webp', emoji: '😊' },
  { id: 'kanashii', name: 'かなしい', img: 'images/kao/kanashii.webp', emoji: '😢' },
  { id: 'okotte', name: 'おこっている', img: 'images/kao/okotte.webp', emoji: '😡' },
  { id: 'komatte', name: 'こまっている', img: null, emoji: '😟' }, // 新規作成待ち（kao_komatte）
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
export const CARD_COLORS = ['#FFE07A', '#9CC4FF', '#FF9C8F', '#B9E58C'];

export const DEFAULT_LINES = [
  'おはよう', 'ありがとう', 'ごめんなさい', 'だいじょうぶ？', 'ほんとう？',
  'いいよ', 'いやです', 'またね', 'できた！', 'しらない',
];

export const DEFAULT_SCENES = [
  { id: 'ba_01', title: 'プレゼント', question: 'プレゼントを もらった こは どんな きもち？', img: 'images/ba/ba_01_present.webp' },
  { id: 'ba_02', title: 'ふたりで', question: 'ふたりは どんな きもち？', img: 'images/ba/ba_02_futari.webp' },
  { id: 'ba_03', title: 'ひらめいた', question: 'この こは どんな きもち？', img: 'images/ba/ba_03_hirameki.webp' },
  { id: 'ba_04', title: 'おもちゃ', question: 'おもちゃが こわれた こは どんな きもち？', img: 'images/ba/ba_04_omocha.webp' },
  { id: 'ba_05', title: 'かんがえる', question: 'この こは どんな きもち？', img: 'images/ba/ba_05_kangaeru.webp' },
  { id: 'ba_06', title: 'べんきょう', question: 'ライオンさんは どんな きもち？', img: 'images/ba/ba_06_lion.webp' },
  { id: 'ba_07', title: 'よる', question: 'この こは どんな きもち？', img: 'images/ba/ba_07_yoru.webp' },
  { id: 'ba_08', title: 'おどろく', question: 'この こは どんな きもち？', img: 'images/ba/ba_08_bikkuri.webp' },
  // 以下は新規作成待ち（IMAGE_SPEC 4.2）
  { id: 'ba_11', title: 'アイス', question: 'アイスを おとした こは どんな きもち？', img: null, emoji: '🍦' },
  { id: 'ba_12', title: 'ならぶ', question: 'ならんで いた こは どんな きもち？', img: null, emoji: '🍛' },
  { id: 'ba_13', title: 'やすみじかん', question: 'この こは どんな きもち？', img: null, emoji: '🪑' },
  { id: 'ba_14', title: 'つみき', question: 'つみきを たおされた こは どんな きもち？', img: null, emoji: '🧱' },
  { id: 'ba_15', title: 'ボール', question: 'ボールを とられた こは どんな きもち？', img: null, emoji: '⚽' },
  { id: 'ba_16', title: 'ころんだ', question: 'みて いる こは どんな きもち？', img: null, emoji: '🩹' },
];

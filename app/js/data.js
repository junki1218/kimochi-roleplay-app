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

// 場面＝「だれかが セリフを いっている ところ」。
// 同じセリフを ちがう きもちで いう場面を 2まいずつ 組にしている（おはよう／ありがとう／いいよ／ごめんなさい）。
// situation は絵の説明（ちいさく出す）、line は吹き出しに大きく出すセリフ。
export const DEFAULT_SCENES = [
  { id: 'ba_01', title: 'プレゼント', situation: 'プレゼントを もらって', line: 'ありがとう', img: 'images/ba/ba_01_present.webp' },
  { id: 'ba_02', title: 'あさ', situation: 'ともだちに あって', line: 'おはよう', img: 'images/ba/ba_02_futari.webp' },
  { id: 'ba_03', title: 'できた', situation: 'もんだいが とけて', line: 'わかった！', img: 'images/ba/ba_03_hirameki.webp' },
  { id: 'ba_04', title: 'おもちゃ', situation: 'おもちゃが こわれて', line: 'こわれちゃった', img: 'images/ba/ba_04_omocha.webp' },
  { id: 'ba_08', title: 'びっくり', situation: 'ともだちの はなしを きいて', line: 'ほんとう？', img: 'images/ba/ba_08_bikkuri.webp' },
  // 以下は新規作成待ち（IMAGE_SPEC 4.2）。絵文字は絵の中身を示すだけで、気持ちの答えにならないものにする
  { id: 'ba_11', title: 'あさ ②', situation: 'げんきが ない あさに', line: 'おはよう', img: null, emoji: '🏫' },
  { id: 'ba_12', title: 'きゅうしょく', situation: 'にがてな ものを もらって', line: 'ありがとう', img: null, emoji: '🥦' },
  { id: 'ba_13', title: 'あそぼう', situation: '「あそぼう」と いわれて', line: 'いいよ', img: null, emoji: '⚽' },
  { id: 'ba_14', title: 'けしゴム', situation: 'けしゴムを かってに つかわれて', line: 'いいよ', img: null, emoji: '✏️' },
  { id: 'ba_15', title: 'つみき', situation: 'ともだちの つみきを たおして', line: 'ごめんなさい', img: null, emoji: '🧱' },
  { id: 'ba_16', title: 'せんせいと', situation: 'せんせいに いわれて', line: 'ごめんなさい', img: null, emoji: '🏫' },
  { id: 'ba_17', title: 'ころんだ', situation: 'ともだちが ころんで', line: 'だいじょうぶ？', img: null, emoji: '🩹' },
  { id: 'ba_18', title: 'ボール', situation: 'ボールを とられそうに なって', line: 'いやです', img: null, emoji: '🏀' },
  { id: 'ba_19', title: 'おわかれ', situation: 'ともだちが ひっこす ひに', line: 'またね', img: null, emoji: '🚚' },
];

# きもちを つたえよう（叩き台）

特別支援学校（知的）中学部「人との関わり・コミュニケーション」の授業アプリ。
仕様は [.agent_flow/SPEC.md](.agent_flow/SPEC.md)、画像の発注は [.agent_flow/IMAGE_SPEC.md](.agent_flow/IMAGE_SPEC.md)。

## 動かす

ビルド不要。`app/` をそのまま配信すれば動く。

```bash
python -m http.server 8930 --directory app
```

http://localhost:8930 を開く（Claude Code からは `preview_start({name:"kimochi-app"})`）。

## フォルダ

```
app/
  index.html  style.css  sw.js  manifest.webmanifest
  js/data.js    初期データ（気持ち・ことば・場面）
  js/store.js   保存（設定=localStorage／追加した場面=IndexedDB／JSON 入出力）
  js/app.js     画面と操作
  images/kao/   気持ちカード
  images/ba/    場面イラスト
  images/start_bg.webp  スタート画面の背景（ClayAnimation/school_homeroom.png）
```

## 画像の差し替え（AGY の新規画像が届いたら）

`js/data.js` で `img: null` になっている所が絵文字の仮置き。
画像を `images/kao/` か `images/ba/` に WebP で置き、`img` にパスを入れる。
あわせて `sw.js` の `SHELL` に足し、`CACHE` の版（いまは `kimochi-v4`）を上げる。

| 仮置き | 差し替える画像（IMAGE_SPEC の id） |
|---|---|
| あさ ②「おはよう」 | ba_11 |
| あそぼう「いいよ」 | ba_13 |
| けしゴム「いいよ」 | ba_14 |
| つみき「ごめんなさい」 | ba_15 |
| せんせいと「ごめんなさい」 | ba_16 |
| しらない ひと「いやです」（いまは線画の仮置き） | ba_12 |
| ボール「いやです」 | ba_18 |
| おおごえ「たすけて！」（いまは線画の仮置き） | ba_17 |
| おわかれ「またね」 | ba_19 |

（びっくり・はずかしいは、届いたら `ICON_CHOICES` に足す）

# 作業指示書 TASK-001

- 宛先: Antigravity (AGY)
- 発行: Claude Code (クロコ) 2026-10-07T19:45:03+09:00
- 周回: r1

## タスク
画風見本（場面2枚＋気持ちカード1枚）

## やること
- `IMAGE_SPEC.md` の1章（何に使う画像か）と2章（共通スタイル）を読む
- 3章の既存素材（とくに `clay_gift_child.png` `clay_sad_child.png` `clay_emoji_*.png`）を開いて、画風をつかむ
- 4章で担当が **TASK-001** の3枚を作る: `kao_komatte`（こまっている）／`ba_11`（アイス）／`ba_12`（割り込み）
- 一覧シートには、新規3枚と3章の既存素材を並べる（画風がそろっているかをユーザーが判断するため）
- Google ドライブへのコピーは IMAGE_SPEC 5章のとおり
- 完了したら止まる。**ユーザーが画風を承認するまで TASK-002 に進まない**

## 参照
- 仕様: `.agent_flow/SPEC.md`
- **画像仕様（正本）: `.agent_flow/IMAGE_SPEC.md`**
- 画風の参考: Google ドライブ `マイドライブ/04_素材ライブラリ/画像材料/ClayAnimation/`（IMAGE_SPEC 3章のファイル。見るだけで書き込まない）

## 完了条件(これを満たさないと受け入れ検査で落ちる)
- IMAGE_SPEC.md 4章のうち担当 TASK-001 の3枚（kao_komatte / ba_11 / ba_12）がそろう
- 2章の共通スタイルを満たし、既存のクレイ素材と画風がそろう
- 既存素材も並べた一覧シート verify_TASK-001.png を出す
- ユーザーの画風承認を得るまで TASK-002 に着手しない

## 規約(必ず守る)
- パスはすべてプロジェクトルートからの相対パス・`/` 区切り。
- 生成アセットは `.agent_flow/assets/asset_TASK-001_<name>.<ext>` に置き、
  `.agent_flow/ASSET_MANIFEST.json` に追記する。
- `TASK_BOARD.json` は編集しない。
- 完了したら次の2つを書き出す:
  - `.agent_flow/handoffs/done_TASK-001.json`
  - `.agent_flow/logs/log_TASK-001_agy.md`
- 完了できないときは `status` を `BLOCKED` にして理由をログに書く。

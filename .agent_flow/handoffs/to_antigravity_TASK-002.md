# 作業指示書 TASK-002

- 宛先: Antigravity (AGY)
- 発行: Claude Code (クロコ) 2026-10-07T19:45:03+09:00
- 周回: r1（2026-10-07 改訂：場面を「セリフを言っている場面」に変更）

## タスク
残りの新規画像（場面7枚＋気持ちカード2枚）

## やること
- **TASK-001 の画風がユーザーに承認されてから着手する**
- 4章で担当が **TASK-002** の9枚を作る: `kao_bikkuri`／`kao_hazukashii`／`ba_13`〜`ba_19`
- 組になる2枚（いいよ-A/B・ごめんなさい-A/B）は、並べて気持ちの違いが一目で分かるように描く
- TASK-001 で承認された見本を参照画像として使い、画風をそろえる
- 一覧シートには、新規9枚と TASK-001 の3枚、3章の既存素材を並べる。組になる2枚は隣どうしに置く
- Google ドライブへのコピーは IMAGE_SPEC 5章のとおり

## 参照
- 仕様: `.agent_flow/SPEC.md`
- **画像仕様（正本）: `.agent_flow/IMAGE_SPEC.md`**
- 画風の参考: Google ドライブ `マイドライブ/04_素材ライブラリ/画像材料/ClayAnimation/`（IMAGE_SPEC 3章のファイル。見るだけで書き込まない）

## 完了条件(これを満たさないと受け入れ検査で落ちる)
- IMAGE_SPEC.md 4章のうち担当 TASK-002 の9枚（kao_bikkuri / kao_hazukashii / ba_13〜ba_19）がそろう
- TASK-001 で承認された画風にそろえる
- 一覧シート verify_TASK-002.png を出す

## 規約(必ず守る)
- パスはすべてプロジェクトルートからの相対パス・`/` 区切り。
- 生成アセットは `.agent_flow/assets/asset_TASK-002_<name>.<ext>` に置き、
  `.agent_flow/ASSET_MANIFEST.json` に追記する。
- `TASK_BOARD.json` は編集しない。
- 完了したら次の2つを書き出す:
  - `.agent_flow/handoffs/done_TASK-002.json`
  - `.agent_flow/logs/log_TASK-002_agy.md`
- 完了できないときは `status` を `BLOCKED` にして理由をログに書く。

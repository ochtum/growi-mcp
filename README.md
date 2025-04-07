# Growi MCP Server

このMCP (Model Context Protocol) サーバーは、Claude DesktopがGrowiと対話するためのインターフェースを提供します。Growiのページを一覧表示、読み取り、作成、更新、検索するための機能を実装しています。

## 機能

* **ページ一覧の取得**: Growiのページを一覧表示
* **ページ内容の取得**: 特定のページの内容を取得
* **ページの作成**: 新しいページを作成
* **ページの更新**: 既存のページを更新
* **ページの検索**: キーワードでページを検索

## インストール

### ローカルでの実行（推奨）

```bash
# リポジトリをクローン
git clone https://github.com/cer12u/growi-mcp.git
cd growi-mcp

# 依存関係をインストール
npm install

# ビルド
npm run build
```

### Claude Desktopでの設定

`claude_desktop_config.json`に以下を追加（ローカル実行）:

```json
{
  "mcpServers": {
    "growi": {
      "command": "node",
      "args": ["/path/to/growi-mcp/dist/index.js"],
      "env": {
        "GROWI_API_URL": "https://your-growi-instance.com",
        "GROWI_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

`/path/to/growi-mcp`は実際のリポジトリのパスに置き換えてください。

### その他のインストール方法

```bash
# GitHubリポジトリから直接インストール
npm install -g github:cer12u/growi-mcp
```

この場合のClaude Desktop設定:

```json
{
  "mcpServers": {
    "growi": {
      "command": "npx",
      "args": ["-y", "github:cer12u/growi-mcp"],
      "env": {
        "GROWI_API_URL": "https://your-growi-instance.com",
        "GROWI_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

## セットアップ

### Growi APIトークンの取得

1. Growiの管理画面にログイン
2. 「管理」→「API設定」に移動
3. 新しいAPIトークンを作成（適切な権限を付与）

## 使用例

### ページ一覧の取得
```
"growi_list_pagesで、すべてのページを一覧表示して"
"growi_list_pagesで、パス「/docs」以下のページを一覧表示して"
```

### ページ内容の取得
```
"growi_get_pageで、パス「/home」のページを読み取って"
```

### ページの作成
```
"growi_create_pageで、パス「/新しいページ」、内容「これは新しいページです。」のページを作成して"
```

### ページの更新
```
"growi_update_pageで、パス「/home」のページの内容を「更新された内容です。」に更新して"
```

### ページの検索
```
"growi_search_pagesで、「Growi」というキーワードを含むページを検索して"
```

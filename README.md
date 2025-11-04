
# Vercel KV オンライン三目並べ

このプロジェクトは、Vercel Functions と Vercel KV を使用して構築された、リアルタイムで対戦可能な三目並べゲームです。Reactなどのフロントエンドフレームワークや、Viteなどのビルドツールを一切使用せずに作成されています。

## 実行・デプロイ手順

### 1. ローカルでの準備

まず、プロジェクトのファイルが正しいフォルダ構造になっていることを確認します。

```
vercel-tictactoe/      <-- プロジェクトのルートディレクトリ
├── index.html         <-- フロントエンドのHTMLファイル
├── package.json       <-- 依存関係を定義するファイル
├── README.md          <-- このファイル
└── api/               <-- Vercel Functions用のディレクトリ
    └── game/
        ├── create.mjs
        ├── state.mjs
        └── move.mjs
```

### 2. GitHubにリポジトリを作成してプッシュ

次に、このプロジェクトをGitHubにアップロードします。

1.  **Gitリポジトリの初期化:**
    プロジェクトのルートディレクトリ（`vercel-tictactoe/`）でターミナルを開き、以下のコマンドを実行します。
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **GitHubで新しいリポジトリを作成:**
    [GitHub](https://github.com/new)にアクセスし、新しいリポジトリを作成します。リポジトリ名は任意です（例: `vercel-tictactoe-kv`）。"Public" または "Private" を選択し、リポジトリを作成します。

3.  **ローカルリポジトリをGitHubにプッシュ:**
    GitHubリポジトリのページに表示されるコマンドを参考に、以下のコマンドを実行します。`<YOUR_USERNAME>` と `<YOUR_REPOSITORY_NAME>` はご自身のものに置き換えてください。

    ```bash
    git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
    git branch -M main
    git push -u origin main
    ```

### 3. Vercelにデプロイ

1.  **Vercelにログインし、プロジェクトをインポート:**
    [Vercelダッシュボード](https://vercel.com/dashboard)にアクセスし、「Add New...」->「Project」を選択します。
    先ほどプッシュしたGitHubリポジトリを見つけて、「Import」をクリックします。

2.  **ビルド設定の確認:**
    Vercelは自動的にプロジェクトを分析します。「Framework Preset」が **`Other`** または **`Static`** と表示されていることを確認してください。
    **重要な点:** 「Build and Output Settings」を開き、**`Build Command` が空欄であること**を確認してください。このプロジェクトにはビルド手順が不要なため、何も入力する必要はありません。

3.  **Vercel KV データベースを作成・接続:**
    デプロイする前に、データベースを接続する必要があります。
    -   「Environment Variables」のセクションはスキップします（KVを接続すると自動で設定されます）。
    -   「Deploy」ボタンを押す前に、ページ上部のナビゲーションから「**Storage**」タブをクリックします。
    -   「KV (New)」を選択し、「Create Database」をクリックします。
    -   リージョンを選択し（どこでも構いません）、データベース名を入力します（例: `tictactoe-db`）。
    -   「Create」ボタンを押すと、データベースが作成されます。「**Connect Project**」画面が表示されたら、現在設定中のプロジェクト（`vercel-tictactoe`など）を選択し、「**Connect**」をクリックします。
    -   これで、必要な環境変数（`KV_URL`, `KV_REST_API_URL`など）が自動的にプロジェクトに設定されます。

4.  **デプロイ:**
    「Projects」タブに戻り、先ほど設定したプロジェクトのページを開きます。「Deployments」タブに移動し、最新のコミットがビルドされ、デプロイが開始されているはずです。もし開始されていなければ、手動で再デプロイしてください。
    数分待つと、デプロイが完了し、本番URLが発行されます。

### 4. 遊び方

1.  **ゲームの開始:**
    デプロイが完了したら、Vercelが提供するURL（例: `https://...vercel.app`）にアクセスします。
    「新しいゲームを開始する」ボタンをクリックします。

2.  **対戦相手の招待:**
    ボタンをクリックすると、ページがリロードされ、URLに `?gameId=...` というパラメータが追加されます。
    画面に表示されている「ゲームID (相手に共有)」ボックス内の **URL全体をコピー** してください。
    コピーしたURLを対戦相手に送り、相手がそのURLにアクセスします。

3.  **対戦開始:**
    -   最初にゲームを作成した人（URLに `gameId` がなかった人）が**プレイヤーX**です。
    -   共有されたURLで参加した人が**プレイヤーO**です。
    -   2人が揃うと、ゲームが自動的に開始されます。自分の番が来たら、盤面のマスをクリックして手を進めてください。

これで、リアルタイムでオンライン三目並べを楽しむことができます！

# AGENTS.md

本文件規範此儲存庫（`my-spa-tools`）的開發慣例，供 AI Agent 與維護者遵循。修改本專案前請先閱讀本檔。

## 專案概述

`my-spa-tools` 是一組**免建置、無後端**的單頁網頁工具集合。每個工具都是一個獨立的靜態 HTML 檔（多數內含 CSS 與 JavaScript；`agent-yaml-maker` 另外拆分 `app.js` 與 `styles.css`）。沒有 `package.json`、沒有打包流程、沒有測試框架，所有邏輯在瀏覽器端執行。

## 目錄結構

```text
my-spa-tools/
├─ index.html                    入口大廳（分類卡片、搜尋、連結使用手冊）
├─ README.md                     使用者操作手冊
├─ AGENTS.md                     本文件（開發慣例）
├─ agent/agent-yaml-maker/       Agent YAML Maker
├─ finance/                      金融試算
│  ├─ lcr-mapping-calc/
│  ├─ nsfr-mapping-calc/
│  └─ basel-creditrisk-calc/
├─ sql/                          SQL 工具（每個工具一個子資料夾）
│  ├─ sql-catalog/  sql-compare/  oracle-sql-formatter/
│  ├─ sql-pii-cleaner/  sql-lineage-analyzer/
├─ docs/                         文書與簡報
│  ├─ project-gantt/  card-presenter/  docuformatter/
└─ design/                       設計工具
   └─ palette-lore/
```

分類層固定為五類：`agent/`、`finance/`、`sql/`、`docs/`、`design/`。每個工具自成一層子資料夾，HTML 檔名沿用工具原名。**所有工具頁面都位於根目錄下兩層**（`<類別>/<工具>/<檔名>.html`）。

## 強制規則

### 1. 每個工具頁面都必須有「回入口」功能

**每一個工具頁面（`<類別>/<工具>/` 下的 HTML）都必須包含一個固定顯示的「回入口」按鈕，連回根目錄的入口大廳 `index.html`。**

- 連結路徑固定為 `../../index.html`（因為工具頁面都在根目錄下兩層）。
- 若日後將工具放到不同深度，請同步調整相對路徑層數。
- 入口大廳本身（根目錄 `index.html`）**不需要**此按鈕。
- 樣式需自我包含（inline `<style>`），不可依賴 CDN，也不可依賴該工具自身的 CSS 或 JS。
- 必須放在 `</body>` 之前，並使用固定的 id `hf-home-entry`。

**標準片段（請原樣複製到每個工具頁面的 `</body>` 之前）：**

```html
<!-- 返回工具入口大廳（規範見 AGENTS.md） -->
<a id="hf-home-entry" href="../../index.html" title="返回工具入口大廳" aria-label="返回工具入口大廳">← 回入口</a>
<style>
  #hf-home-entry{position:fixed;left:14px;bottom:14px;z-index:2147483000;display:inline-flex;align-items:center;gap:6px;
    font:600 13px/1 "Segoe UI","Microsoft JhengHei","Noto Sans TC",system-ui,sans-serif;color:#fff;
    background:rgba(34,41,52,.86);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);
    padding:9px 13px;border-radius:999px;text-decoration:none;border:1px solid rgba(255,255,255,.2);
    box-shadow:0 6px 18px rgba(0,0,0,.28);transition:transform .15s,background .15s}
  #hf-home-entry:hover{background:rgba(34,41,52,1);transform:translateY(-2px)}
  #hf-home-entry:active{transform:translateY(0)}
  @media print{#hf-home-entry{display:none}}
</style>
```

放置位置固定為左下角（`left:14px;bottom:14px`），以避開多數工具右下角的 toast 通知與置中的工具列。若新工具的版面在左下角有固定元件，請改用其他角落，但**仍須維持一致的 id 與視覺樣式**。

### 2. 新增工具時同步更新入口大廳

新增或移除工具時，必須同步更新根目錄 `index.html`：

- 在對應分類區塊新增／移除一張 `.card`。
- 卡片需具備 `href`（相對路徑）、圖示、名稱、一句話用途、`離線可用` 或 `需 CDN` 標籤，以及 `data-title`／`data-tags`（供搜尋使用）。
- 分類區塊錨點與篩選 chip 的 `data-category`／`data-filter` 值需保持一致。

### 3. 新增工具時同步更新 README

在 `README.md` 的「工具總覽」表格與對應章節新增該工具的入口連結與操作說明，並更新「快速開始」清單。

## 命名與分類慣例

- 資料夾名稱一律使用小寫 kebab-case，並對齊工具語意（例如 `oracle-sql-formatter`）。
- 工具放在 `agent/`、`finance/`、`sql/`、`docs/` 四類之一。
- HTML 入口檔名沿用工具既有名稱，不隨資料夾改名。
- 單一工具的說明請併入根目錄 `README.md`，**不要**在各工具子資料夾內另建 README。

## 技術慣例

- 純 HTML5／CSS3／原生 JavaScript，維持零建置、可直接以 `file://` 或靜態伺服器開啟。
- 需要外部函式庫時，以 CDN 載入（例如 Tailwind CSS、Chart.js、js-yaml、JSZip、docx.js），並在 README 標示該工具「需 CDN」。
- 檔案一律使用 **UTF-8（無 BOM）** 與 **LF** 換行；此規則由根目錄的 `.gitattributes`（`* text=auto eol=lf`）強制，請勿在提交時改成 CRLF。
- 涉及本機檔案的資料處理須在瀏覽器端完成，不得新增後端或上傳流程。
- 資料保存方式依工具既有設計（IndexedDB／`localStorage`／頁面記憶體），並在 README 說明。

## 驗證清單

修改後請至少確認：

1. 以 `python -m http.server 8080` 於專案根目錄啟動，從入口大廳逐一點開 13 個工具卡片，連結皆可達。
2. 每個工具頁面左下角都顯示「← 回入口」按鈕，且點擊後回到入口大廳。
3. `README.md` 與 `index.html` 的所有相對連結皆指向存在的檔案。
4. 檔案編碼為 UTF-8（無 BOM）、換行為 LF。
5. 執行 `git diff --check` 無空白錯誤。

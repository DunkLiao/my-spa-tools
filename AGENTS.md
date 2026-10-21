# AGENTS.md

本文件規範此儲存庫（`my-spa-tools`）的開發慣例，供 AI Agent 與維護者遵循。修改本專案前請先閱讀本檔。

## 專案概述

`my-spa-tools` 是一組**免建置、無後端**的單頁網頁工具集合。每個工具都是一個獨立的靜態 HTML 檔（多數內含 CSS 與 JavaScript；`agent-yaml-maker` 另外拆分 `app.js` 與 `styles.css`，`screenshot-ocr-kb` 另含 `download_ocr_engine.bat` 作為 OCR 引擎檔下載輔助）。沒有 `package.json`、沒有打包流程、沒有測試框架，所有邏輯在瀏覽器端執行。

## 目錄結構

```text
my-spa-tools/
├─ index.html                    入口大廳（分類卡片、搜尋、連結使用手冊）
├─ README.md                     使用者操作手冊
├─ AGENTS.md                     本文件（開發慣例）
├─ agent/                        AI Agent
│  ├─ agent-yaml-maker/          Agent YAML Maker
│  └─ prompt-studio/             Prompt Studio 結構化提示詞工作台
├─ finance/                      金融試算
│  ├─ lcr-mapping-calc/
│  ├─ nsfr-mapping-calc/
│  ├─ basel-creditrisk-calc/
│  ├─ large-exposure-analyzer/
│  ├─ fixed-width-telegram-parser/
│  ├─ bank-error-code-resolver/
│  ├─ chinese-amount-uppercase/  金融金額中文大寫轉換器
│  ├─ reconciliation-analyzer/   雙邊資料對帳與平帳差額探索器（鍵值配對、容差與稽核底稿）
│  ├─ credit-card-fraud-sandbox/  信用卡防阻詐騙異常模式沙盒（案件情境注入、規則引擎與風險評分）
│  ├─ debt-restructuring-calculator/ 消金逾期戶還款協議試算（債權整理、協商方案、核決層級與協議草稿）
│  ├─ credit-report-parser/      聯徵與財報速讀解析器（風險訊號、DBR、循環使用率與財務比率）
│  ├─ audit-finding-kb/          稽核缺失知識庫（全文檢索、儀表板、報表、批次匯入與備份）
│  └─ audit-sampling-studio/     稽核抽樣工作站（母體匯入、品質檢核、排除軌跡與可重現抽樣）
├─ sql/                          SQL 工具（每個工具一個子資料夾）
│  ├─ sql-catalog/  sql-compare/  oracle-sql-formatter/
│  ├─ sql-pii-cleaner/  sql-lineage-analyzer/
│  ├─ sql-lab/                    SQL Lab 離線 SQL 測試工具（沙箱、匯入與測試案例）
│  └─ schema-studio/             Schema Studio SQL 欄位映射與 DDL 產生器
├─ data/                         資料工具
│  ├─ matrix-pivot/              表格矩陣轉置與格式轉換器
│  ├─ csv-cleaner/               CSV 格式清理器（含 Big5／CP950 讀寫）
│  ├─ api-mock-studio/           API Mock 與 cURL 格式轉換工作室
│  ├─ data-quality-audit/        資料品質稽核中心（CSV／Excel 匯入、欄位剖析與規則檢核）
│  ├─ data-relationship-explorer/ 資料關聯探索器（主外鍵推測、ER 圖與路徑／影響分析）
│  ├─ excel-formula-map/         Excel 公式地圖（公式解析、依賴圖、熱區、循環與風險掃描）
│  ├─ pdf-table-rescue/          PDF 表格救援站（PDF 表格框選、欄線校正、OCR 與批次匯出）
│  ├─ pq-debugger/               PQ Debugger Power Query M 除錯工具（12 條規則、流程圖與修正）
│  └─ screenshot-ocr-kb/         截圖 OCR 知識庫（Tesseract OCR、集合與操作流程；含 download_ocr_engine.bat）
├─ docs/                         文書與簡報
│  ├─ project-gantt/  card-presenter/  docuformatter/  text-scrubber/
│  ├─ word-counter/              文件字數與閱讀時間統計
│  ├─ wbs-gantt/                 WBS 甘特排程器
│  ├─ project-tracker/           專案時程暨處理流程紀錄系統（事件、流程紀錄、附件與提醒）
│  ├─ scratchpad/                離線速記便箋
│  ├─ meeting-burn-rate/         會議燃燒成本看板（即時人力成本與產出評估卡）
│  ├─ spec-diff/                 SpecDiff 規格書比對工具（版本比對與審查標註）
│  ├─ folder-tree-architect/     FolderTree Architect 路徑轉樹狀結構（含註解、忽略規則與多格式輸出）
│  ├─ lottery-ticket-manager/    園遊會摸彩券管理工具（期別、人員、券號與報表匯出）
│  ├─ decision-sandbox/          決策沙盤推演系統（多準則計分、TOPSIS、情境與蒙地卡羅模擬、決議快照）
│  └─ zen-typewriter-editor/     Zen Typewriter 打字機心流編輯器（打字機聲效、Markdown 預覽與文稿庫）
├─ design/                       設計工具
│  ├─ bento-grid-studio/         Bento Studio 版型產生器（拖曳縮放、10 種主題與 Tailwind／CSS／JSON 匯出）
│  ├─ design-debt-analyzer/      設計債務分析器（Figma／CSS／Tokens 匯入、Debt Score、整併建議與趨勢）
│  ├─ design-decision-explainer/ 設計決策解釋器（設計稿元素分析、三種語氣決策卡、風險與 Q&A、DOCX／PDF）
│  ├─ palette-lore/
│  ├─ semantic-color-tokenizer/  Semantic Color Tokenizer 語意化色彩與 Token 產生器
│  └─ status-badge-workshop/     UI 狀態徽章與標籤合成器（形態／幾何／配色／動態、WCAG 與多格式程式碼）
└─ diagram/                      流程與圖表建模
   ├─ stateflow/                 StateFlow 動態狀態機與業務流程拓撲模擬器
   └─ vba-dependency-explorer/   VBA Dependency Explorer 依賴關係分析與視覺化
```

分類層固定為七類：`agent/`、`finance/`、`sql/`、`data/`、`docs/`、`design/`、`diagram/`。每個工具自成一層子資料夾，HTML 檔名沿用工具原名。**所有工具頁面都位於根目錄下兩層**（`<類別>/<工具>/<檔名>.html`）。

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
- 工具放在 `agent/`、`finance/`、`sql/`、`data/`、`docs/`、`design/`、`diagram/` 七類之一。
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

1. 以 `python -m http.server 8080` 於專案根目錄啟動，從入口大廳逐一點開 53 個工具卡片，連結皆可達。
2. 每個工具頁面左下角都顯示「← 回入口」按鈕，且點擊後回到入口大廳。
3. `README.md` 與 `index.html` 的所有相對連結皆指向存在的檔案。
4. 檔案編碼為 UTF-8（無 BOM）、換行為 LF。
5. 執行 `git diff --check` 無空白錯誤。

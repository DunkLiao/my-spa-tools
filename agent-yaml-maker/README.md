# 🌿 Agent YAML Maker

> **專為 AI Agent 狀態機持久化與跨 Session 接力移交設計的純前端可視化產生器**
> 
> *以慢活、清晰、從容的節奏，構建標準化 `progress.yaml` 看板與 `handoff.yaml` 移交工單。*

[![Pure Frontend](https://img.shields.io/badge/Architecture-100%25%20Pure%20Frontend-486e4b?style=flat-square)](file:///D:/VIbeCoding/agent-yaml-maker/index.html)
[![Zero Dependency](https://img.shields.io/badge/Runtime-Zero%20Build%20%2F%20No%20Node-7d7160?style=flat-square)](file:///D:/VIbeCoding/agent-yaml-maker/index.html)
[![Storage](https://img.shields.io/badge/Storage-IndexedDB%20v2-bc8348?style=flat-square)](file:///D:/VIbeCoding/agent-yaml-maker/index.html)
[![Aesthetic](https://img.shields.io/badge/Aesthetic-Slow%20Living%20Linen-5d8660?style=flat-square)](file:///D:/VIbeCoding/agent-yaml-maker/styles.css)
[![Responsive](https://img.shields.io/badge/RWD-Mobile%20%26%20Desktop%20Ready-556681?style=flat-square)](file:///D:/VIbeCoding/agent-yaml-maker/index.html)

---

## 📖 為什麼需要 Agent YAML Maker？

在引導自主編程代理（如 Claude Code, Gemini CLI, Cursor, AutoGPT, Devv 等）執行長時任務（Long-horizon Tasks）時，開發者普遍面臨兩大核心痛點：

1. **Context 遺忘與幻覺失憶 (Context Compaction)**：對話輪次增加後，先前的決策、架構共識與進度容易被遺忘或推翻。
2. **多 Agent 協同交接斷層 (Hand-off Disconnect)**：不同角色（架構師 ➔ 開發者 ➔ 審查員）換班接力時，缺乏標準化的接力棒協議，導致重複施工或破壞既有邊界。

**Agent YAML Maker** 提供雙軌標準 YAML 產生與維護工具：
- 📋 **`progress.yaml`**：長任務進度狀態機與里程碑檢查清單（Checklist），保證 Agent「斷點續作、永不迷航」。
- 🤝 **`handoff.yaml`**：跨 Session 或跨 Agent 移交協議工單，固化技術決策紅線、優先級行動目標與不可違背之約束。

---

## ✨ 核心特色與亮點

### 🌾 1. 慢活自然美學風格 (Slow Living Organic Aesthetic)
- **溫潤大地色系**：以未漂白米白棉麻（`#faf8f5`）、質樸陶土細邊框（`#e7e0d3`）與深焙咖啡炭黑（`#191612`）取代冷硬高科技刺眼藍黑，兼具生活感與高專注度。
- **植感鼠尾草綠 (Sage Green)**：以草木綠（`#486e4b`）作為主焦點與主要按鈕色，傳遞生機、條理與平心靜氣的任務推進體驗。
- **現代人文排版**：整合 Google Fonts（`Plus Jakarta Sans` 與 `Noto Sans TC`），閱讀如翻閱日系實體手帳般舒適。

### ☀️ 2. 預設淺色模式與深淺切換 (Light / Dark Theme)
- **預設淺色模式**：首次載入呈現乾淨自然的棉麻紙質介面。
- **自適應深色模式**：提供低刺激、深邃夜幕的沉浸暗色主題。
- **持久化記憶防閃爍**：透過 `localStorage` 記憶主題偏好，在 `<head>` 最前端預先載入，重整分頁絕不跳動閃爍。

### 📱 3. 極致 RWD 響應式適配與雙重視圖
- **桌機大螢幕**：左欄可視化表單即時填寫，右欄黏性（Sticky）即時預覽 YAML 程式碼窗，附帶精確行數與檔案大小統計。
- **手機端極速切換**：在小螢幕（`< lg`）下自動提供 **「📝 編輯表單」** 與 **「👁️ 即時預覽」** 分頁切換鈕，解決手機端單欄過長頻繁滑動的問題。
- **自適應按鈕標籤**：頂部工具按鈕在行動端智慧縮減文字，保持導覽列精簡整齊。

### 🗃️ 4. IndexedDB 本機持久化引擎 (IndexedDB v2)
- **即時防抖自動存檔 (Auto-save)**：鍵盤鍵入即自動同步至 IndexedDB `drafts` 資料表，即使瀏覽器意外崩潰或誤按 F5 重整，重新進入自動完美還原！
- **歷史快照版本庫 (Snapshots Archive)**：支援手動將當前進度命名封存為快照，附帶備註說明、依型態篩選（`progress` / `handoff` / `bundle`）、一鍵還原回編輯器或單檔下載。

### 📁 5. 範本庫全功能 CRUD 管理 (Template CRUD)
- **➕ 建立 (Create)**：一鍵將當前編輯器畫面儲存為專屬自訂範本，或建立全新空白模板。
- **📖 讀取與切換 (Read)**：下拉選單自動以分組顯示「✨ 系統內建範本」與「📁 自訂範本庫」，提供視覺化管理中心。
- **✏️ 更新 (Update)**：支援修改範本名稱/說明，更提供 **「以當前畫面覆寫」** 快速更新範本內容。
- **🗑️ 刪除 (Delete)**：一鍵安全清理過期或不再需要的自訂範本。
- **📋 複製 (Duplicate)**：支援將官方 4 大內建範本（軟體開發、數據 ETL、資安合規、空白模板）一鍵複製為自訂複本以供自定義。

### 🛠️ 6. 資料庫維護中心 (備份匯出 / 還原匯入 / 出廠重設)
- **📥 匯出資料庫備份**：一鍵將所有自訂範本、歷史快照與工作草稿打包匯出為帶時間戳記的 `.json` 備份檔。
- **📤 匯入資料庫還原**：支援選取備份檔案或貼上 JSON，提供「合併匯入 (Merge)」與「覆寫還原 (Overwrite)」雙模式。
- **⚠️ 出廠重設 (Factory Reset)**：一鍵清空所有本機資料庫內容，迅速還原至初始出廠預設狀態。

### 📦 7. 多樣化匯出與反向解析
- **反向解析現有檔案**：可將本機現有的 `.yaml` 檔案拖入或貼上，系統自動識別是 `progress` 還是 `handoff`，並自動切換分頁還原表單控制項。
- **多管道導出**：
  - 📋 一鍵複製至剪貼簿（附狀態氣泡提示）。
  - 💾 單檔 `.yaml` 下載。
  - 📦 **JSZip 一鍵打包**：同時將 `progress.yaml` 與 `handoff.yaml` 壓縮打包下載為 `.zip`。

---

## 🚀 快速開始

### 方式一：直接雙擊開啟（推薦）
本專案為 **100% 純前端單頁應用程式 (Zero-build SPA)**：
- 直接在檔案總管中雙擊 [`index.html`](file:///D:/VIbeCoding/agent-yaml-maker/index.html) 或拖拉至任一現代瀏覽器（Chrome, Edge, Safari, Firefox）即可直接使用。
- 無須安裝 Node.js、Python、npm 或任何後端伺服器！

### 方式二：本機靜態伺服器（選用）
若習慣透過本機 HTTP 伺服器開啟：
```bash
# 使用 Python 內建伺服器
python -m http.server 8080

# 或使用 npx
npx serve .
```
於瀏覽器開啟 `http://localhost:8080` 即可。

---

## 📂 專案檔案結構

專案目錄位於：`D:\VIbeCoding\agent-yaml-maker`

```text
agent-yaml-maker/
├── index.html        # 主介面入口 (HTML5, Tailwind CDN, 慢活配色設定, 雙欄 RWD 佈局, Modals)
├── app.js            # 核心邏輯 (狀態機、IndexedDB v2 引擎、範本 CRUD、YAML 序列化與解析、JSZip)
├── styles.css        # 慢活樣式表 (慢活變數、棉麻膠囊捲軸、紙質懸停動效、草木綠焦點外框)
└── README.md         # 專案說明文件與規範標準手冊
```

---

## 📖 規格標準手冊 (Specification & Schema)

### 1. `progress.yaml` 欄位規範
長時自主任務狀態機標準骨架，記錄目前整體進程、里程碑執行清單與阻塞問題：

```yaml
project: "agent-yaml-maker"               # 專案唯一識別名稱
status: "in_progress"                    # pending | in_progress | paused | completed | failed
current_phase: "phase_2_core_development"# 當前階段識別名稱
updated_at: "2026-09-26T12:00:00.000Z"   # ISO-8601 時間戳記

milestones:                              # 階層式里程碑清單
  - id: 1
    name: "核心支付閘道串接"
    status: "in_progress"                # pending | in_progress | completed | blocked
    completed_at: ""                     # 完成時自動填入 ISO 時間戳記
    tasks:                               # 具體子任務 Checklist
      - task: "撰寫 Webhook 簽名驗證"
        status: "completed"              # pending | in_progress | completed | blocked
      - task: "實作冪等性交易快取"
        status: "in_progress"

artifacts:                               # 關鍵產出檔案清單
  - path: "src/services/payment.py"
    description: "支付主處理器與回調驗證邏輯"

blockers:                                # 阻礙與風險清單
  - issue: "第三方測試沙盒網路偶發逾時"
    severity: "medium"                   # low | medium | high | critical
    status: "investigating"              # investigating | blocked | resolved
```

### 2. `handoff.yaml` 欄位規範
多 Agent 協同（如 Planner ➔ Coder ➔ Reviewer）或 Session Context 換班接力之移交協議工單：

```yaml
handoff_id: "handoff-20260926-7f8a9b"    # 唯一交接單號
timestamp: "2026-09-26T12:00:00.000Z"    # 交接時間戳記
from_agent: "ArchitectAgent"             # 交付方角色
to_agent: "BackendDeveloperAgent"        # 接收方角色
reason: "系統架構審查完畢，交接進入編碼實作階段"

summary_of_work:                         # 已完成之關鍵工作條列
  - "完成系統架構設計與 API 規格草擬"
  - "定義資料庫 Schema 與安全存取邊界"

key_decisions:                           # 關鍵架構決策（防止後續 Agent 擅自推翻或重做）
  - "採用非同步事件隊列處理高並發 Webhook"
  - "敏感參數一律由 Vault 動態注入，禁止寫入環境設定檔"

next_steps:                              # 接手者優先執行清單
  - priority: 1                          # 數字越小優先度越高 (1~10)
    action: "依據 payment_spec.md 實作支付 Webhook 接收端點"
    target_files:                        # 目標關聯修改檔案
      - "src/webhooks/signature.py"
      - "src/webhooks/router.py"

constraints_and_notes:                   # 邊界約束與注意事項
  - "必須維持向前相容性，不可修改既有交易欄位型態"
  - "單元測試覆蓋率需高於 85%"
```

---

## 🤖 提示詞整合範例 (Prompt Integration)

您可以直接在給 AI Agent 的 Prompt 中要求遵循本規範：

```markdown
每次對話或任務執行前後，請嚴格遵守專案狀態機規範：
1. 讀取根目錄下的 `progress.yaml` 確認當前階段與 Milestone Checklist。
2. 任務執行完畢時，更新 `progress.yaml` 中的 tasks 狀態與 artifacts。
3. 若需切換 Session 或移交給下一位 Agent，請生成或更新 `handoff.yaml`，固定關鍵決策並列出接手者的 next_steps。
```

---

## 🛠️ 技術棧與相容性

- **核心架構**：原生 Vanilla JavaScript (ES6+)，模組化無打包依賴。
- **介面樣式**：Tailwind CSS (CDN) + 慢活自然風格客製色票體系。
- **本機儲存**：HTML5 IndexedDB API（資料庫名：`AgentYamlMakerDB`，版本 2）。
- **外部輕量相依（均由高可用 CDN 載入）**：
  - [js-yaml (v4.1.0)](https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js)：YAML 高效解析與序列化。
  - [JSZip (v3.10.1)](https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js)：純前端檔案打包為 `.zip`。
- **瀏覽器相容性**：Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari 等現代瀏覽器皆完美相容支援。

---

## 📄 開源許可證

本專案採用 [MIT License](https://opensource.org/licenses/MIT) 開源許可。可自由商用、客製與二次分發。

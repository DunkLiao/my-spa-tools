/**
 * Agent YAML Maker - Application Logic
 * Supports progress.yaml & handoff.yaml template generation, dynamic editing,
 * real-time YAML preview, reverse parsing, and export/ZIP packaging.
 */

// --- Presets Definition ---
const PRESETS = {
  software_dev: {
    progress: {
      project: "e-commerce-payment-gateway",
      status: "in_progress",
      current_phase: "phase_2_core_development",
      updated_at: new Date().toISOString(),
      milestones: [
        {
          id: 1,
          name: "架構設計與規格定義",
          status: "completed",
          completed_at: "2026-09-25T10:00:00Z",
          tasks: [
            { task: "撰寫付款 API 規格文件 (OpenAPI 3.0)", status: "completed" },
            { task: "設計 Idempotency 重複請求防護機制", status: "completed" }
          ]
        },
        {
          id: 2,
          name: "第三方金流 SDK 串接",
          status: "in_progress",
          completed_at: "",
          tasks: [
            { task: "信用卡與 Apple Pay 交易路由實作", status: "completed" },
            { task: "Webhook 異步回調與簽名校驗模組", status: "in_progress" },
            { task: "交易逾時重試與死信隊列 (DLQ) 機制", status: "pending" }
          ]
        },
        {
          id: 3,
          name: "整合測試與壓力測試",
          status: "pending",
          completed_at: "",
          tasks: [
            { task: "Mock 金流伺服器端點單元測試", status: "pending" },
            { task: "高併發 1000 TPS 壓測與熔斷機制驗證", status: "pending" }
          ]
        }
      ],
      artifacts: [
        { path: "docs/api/payment-spec.yaml", description: "金流 API 規格說明書" },
        { path: "src/services/payment_service.py", description: "核心付款服務邏輯" }
      ],
      blockers: [
        { issue: "第三方沙盒測試環境連線偶發性 504 逾時", severity: "medium", status: "investigating" }
      ]
    },
    handoff: {
      handoff_id: "handoff-payment-dev-001",
      timestamp: new Date().toISOString(),
      from_agent: "ArchitectAgent",
      to_agent: "BackendDeveloperAgent",
      reason: "系統架構與 API 介面規格制定完成，交接進入核心金流模組編碼實作",
      summary_of_work: [
        "完成金流服務整體架構拓撲與資料庫 Schema 審查",
        "定義 Idempotency-Key 與分散式交易重試標準流程",
        "建立基礎專案目錄骨架與環境設定檔"
      ],
      key_decisions: [
        "使用 Redis 作為分散式冪等鍵 (Idempotency Key) 暫存區，TTL 設定為 24 小時",
        "所有外部第三方 Webhook 回調均需進行 HMAC-SHA256 簽名嚴格校驗",
        "採用非同步事件驅動架構處理後續通知與帳務對帳"
      ],
      next_steps: [
        {
          priority: 1,
          action: "實作 Webhook 簽名驗證與非同步處理器",
          target_files: ["src/webhooks/signature_verifier.py", "src/webhooks/handler.py"]
        },
        {
          priority: 2,
          action: "實作付款交易失敗後的指數退避重試邏輯",
          target_files: ["src/services/retry_policy.py"]
        },
        {
          priority: 3,
          action: "編寫針對 Mock Server 的整合測試套件",
          target_files: ["tests/test_payment_integration.py"]
        }
      ],
      constraints_and_notes: [
        "嚴禁在任何日誌中記錄明文卡號 (PAN) 或 CVV/CVC 機密資訊，必須做遮蔽掩碼",
        "需符合 PCI-DSS Level 1 規範安全約束",
        "所有資料庫交易操作務必使用隔離級別 Read Committed 以上"
      ]
    }
  },
  data_etl: {
    progress: {
      project: "customer-churn-etl-pipeline",
      status: "in_progress",
      current_phase: "phase_1_feature_engineering",
      updated_at: new Date().toISOString(),
      milestones: [
        {
          id: 1,
          name: "原始日誌與交易資料清洗",
          status: "completed",
          completed_at: "2026-09-24T18:00:00Z",
          tasks: [
            { task: "從 S3 Data Lake 擷取近 12 個月用戶行為事件", status: "completed" },
            { task: "處理缺失值與異常極端數據排除", status: "completed" }
          ]
        },
        {
          id: 2,
          name: "客戶流失特徵工程建置",
          status: "in_progress",
          completed_at: "",
          tasks: [
            { task: "計算 RFM (最近性、頻率、金額) 指標矩陣", status: "completed" },
            { task: "聚合近 30 天登入活躍度下降率與客訴標記", status: "in_progress" },
            { task: "特徵標準化與多重共線性篩選 (VIF < 5)", status: "pending" }
          ]
        },
        {
          id: 3,
          name: "模型特徵存儲庫 (Feature Store) 註冊",
          status: "pending",
          completed_at: "",
          tasks: [
            { task: "註冊特徵定義至 Feast 特徵庫", status: "pending" },
            { task: "建立每日定時增量更新排程 (Airflow DAG)", status: "pending" }
          ]
        }
      ],
      artifacts: [
        { path: "pipelines/clean_user_events.py", description: "資料清洗 Spark 批次作業腳本" },
        { path: "data/features/rfm_matrix.parquet", description: "產出的 RFM 特徵矩陣樣本" }
      ],
      blockers: []
    },
    handoff: {
      handoff_id: "handoff-etl-002",
      timestamp: new Date().toISOString(),
      from_agent: "DataEngineerAgent",
      to_agent: "MLScientistAgent",
      reason: "資料前處理與特徵管線已完成驗證，交接特徵矩陣以進行流失預測模型訓練",
      summary_of_work: [
        "清洗過濾逾 500 萬筆原始使用者行為與交易日誌",
        "完成 RFM 指標及 24 項衍生特徵計算並驗證分佈一致性",
        "產出 Parquet 格式基準特徵集"
      ],
      key_decisions: [
        "離群值採用 IQR 1.5 倍標準進行分位數縮尾 (Winsorization) 處理",
        "特徵集資料格式統一採用 Apache Parquet，啟用 Snappy 壓縮以維持讀取效能"
      ],
      next_steps: [
        {
          priority: 1,
          action: "載入 rfm_matrix.parquet 進行 LightGBM 與 XGBoost 基準模型訓練",
          target_files: ["notebooks/01_baseline_model.ipynb", "src/models/trainer.py"]
        },
        {
          priority: 2,
          action: "評估 ROC-AUC 與 PR-AUC 指標，針對少數流失類別進行 SMOTE 採樣實驗",
          target_files: ["src/models/evaluator.py"]
        }
      ],
      constraints_and_notes: [
        "特徵欄位含有使用者地理資訊，訓練模型前應避免引入偏見特徵",
        "測試集時間切分點嚴格限定為最近 2 個月，防範未來資訊洩漏 (Data Leakage)"
      ]
    }
  },
  spec_doc: {
    progress: {
      project: "enterprise-security-governance-spec",
      status: "in_progress",
      current_phase: "phase_2_chapter_drafting",
      updated_at: new Date().toISOString(),
      milestones: [
        {
          id: 1,
          name: "法規架構對齊與目錄大綱擬定",
          status: "completed",
          completed_at: "2026-09-23T14:30:00Z",
          tasks: [
            { task: "對齊 ISO 27001:2022 控制項標準", status: "completed" },
            { task: "制定專案章節大綱與各部門權責矩陣 (RACI)", status: "completed" }
          ]
        },
        {
          id: 2,
          name: "核心安全控管章節初稿撰寫",
          status: "in_progress",
          completed_at: "",
          tasks: [
            { task: "存取控制與最小特權原則 (Least Privilege) 章節", status: "completed" },
            { task: "資料加密與金鑰生命週期管理規範", status: "in_progress" },
            { task: "資安事件通報與緊急應變處置 SOP", status: "pending" }
          ]
        },
        {
          id: 3,
          name: "內部合規初審與同儕覆盤",
          status: "pending",
          completed_at: "",
          tasks: [
            { task: "法遵團隊與資安委員會跨部門審閱", status: "pending" },
            { task: "修訂初稿並產出正式 v1.0 簽核版本", status: "pending" }
          ]
        }
      ],
      artifacts: [
        { path: "specs/security_governance_v0.8.md", description: "安全治理規範草案" },
        { path: "specs/raci_matrix.xlsx", description: "權責分工對應表" }
      ],
      blockers: []
    },
    handoff: {
      handoff_id: "handoff-spec-003",
      timestamp: new Date().toISOString(),
      from_agent: "SecurityArchitectAgent",
      to_agent: "ComplianceReviewerAgent",
      reason: "核心章節初稿已編撰完成，交接合規審查團隊進行條款審閱與實務對齊",
      summary_of_work: [
        "依據 ISO 27001 與 NIST CSF 架構完成前五章控制項規範草擬",
        "明確定義特權帳號 (PAM) 存取雙重授權機制與審計日誌保存 1 年規定"
      ],
      key_decisions: [
        "強制所有正式環境資料庫連線必須走雙向 TLS (mTLS) 與短期臨時憑證",
        "靜態資料 (Data at Rest) 一律強制 AES-256 加密，金鑰每年定期輪替 (Rotation)"
      ],
      next_steps: [
        {
          priority: 1,
          action: "逐條審查 security_governance_v0.8.md 中第 4 章加密控管項目之合規性",
          target_files: ["specs/security_governance_v0.8.md"]
        },
        {
          priority: 2,
          action: "標記需要法務部門進一步確認的條款並提出意見註解",
          target_files: ["specs/review_notes.md"]
        }
      ],
      constraints_and_notes: [
        "修訂時請以批註模式或 Git PR 形式提出，保留原始論述背景",
        "審查時限為 3 個工作天，預計於下週三前召開覆審會議"
      ]
    }
  },
  blank: {
    progress: {
      project: "my-agent-task",
      status: "in_progress",
      current_phase: "phase_1_initialization",
      updated_at: new Date().toISOString(),
      milestones: [
        {
          id: 1,
          name: "初始里程碑",
          status: "in_progress",
          completed_at: "",
          tasks: [
            { task: "首要待辦事項", status: "in_progress" }
          ]
        }
      ],
      artifacts: [
        { path: "src/main.py", description: "主程式進入點" }
      ],
      blockers: []
    },
    handoff: {
      handoff_id: "handoff-" + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString(),
      from_agent: "Agent_Alpha",
      to_agent: "Agent_Beta",
      reason: "階段任務完成交接",
      summary_of_work: [
        "完成第一階段規劃與基礎架構建立"
      ],
      key_decisions: [
        "採模組化設計以利後續擴展"
      ],
      next_steps: [
        {
          priority: 1,
          action: "接手執行第二階段任務",
          target_files: ["src/main.py"]
        }
      ],
      constraints_and_notes: [
        "遵守專案既有規範"
      ]
    }
  }
};

// --- App State ---
const state = {
  currentTab: "progress", // 'progress' | 'handoff'
  selectedPreset: "software_dev",
  progress: JSON.parse(JSON.stringify(PRESETS.software_dev.progress)),
  handoff: JSON.parse(JSON.stringify(PRESETS.software_dev.handoff))
};

// --- Helper Functions ---
function getISOTimestamp() {
  return new Date().toISOString();
}

function generateId(prefix = "handoff") {
  const rand = Math.random().toString(36).substring(2, 8);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${prefix}-${dateStr}-${rand}`;
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-message");
  const iconEl = document.getElementById("toast-icon");
  
  if (!toast || !msgEl) return;
  
  msgEl.textContent = message;
  
  if (type === "success") {
    toast.className = "fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl bg-emerald-600 text-white font-medium border border-emerald-500/20 show";
    if (iconEl) iconEl.innerHTML = `<svg class="w-5 h-5 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
  } else if (type === "error") {
    toast.className = "fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl bg-rose-600 text-white font-medium border border-rose-500/20 show";
    if (iconEl) iconEl.innerHTML = `<svg class="w-5 h-5 text-rose-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
  } else {
    toast.className = "fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl bg-blue-600 text-white font-medium border border-blue-500/20 show";
    if (iconEl) iconEl.innerHTML = `<svg class="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  }

  setTimeout(() => {
    toast.className = toast.className.replace("show", "hide");
  }, 3000);
}

// --- Theme Switcher (Dark / Light Mode - 預設淺色) ---
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("agent_yaml_theme", isDark ? "dark" : "light");
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains("dark");
  const sunDesk = document.getElementById("theme-sun-icon");
  const moonDesk = document.getElementById("theme-moon-icon");
  const sunMob = document.getElementById("theme-sun-icon-mobile");
  const moonMob = document.getElementById("theme-moon-icon-mobile");
  const label = document.getElementById("theme-label");

  if (isDark) {
    if (sunDesk) sunDesk.classList.remove("hidden");
    if (moonDesk) moonDesk.classList.add("hidden");
    if (sunMob) sunMob.classList.remove("hidden");
    if (moonMob) moonMob.classList.add("hidden");
    if (label) label.textContent = "淺色模式";
  } else {
    if (sunDesk) sunDesk.classList.add("hidden");
    if (moonDesk) moonDesk.classList.remove("hidden");
    if (sunMob) sunMob.classList.add("hidden");
    if (moonMob) moonMob.classList.remove("hidden");
    if (label) label.textContent = "深色模式";
  }
}

// --- Mobile View Switcher (Form vs YAML Preview) ---
function setMobileView(view) {
  const formCol = document.getElementById("form-column");
  const prevCol = document.getElementById("preview-column");
  const btnForm = document.getElementById("btn-mobile-form");
  const btnPrev = document.getElementById("btn-mobile-preview");

  if (view === "preview") {
    if (formCol) {
      formCol.classList.add("hidden");
      formCol.classList.remove("space-y-4");
    }
    if (prevCol) {
      prevCol.classList.remove("hidden");
    }
    if (btnForm) {
      btnForm.className = "px-2.5 py-1 rounded font-medium text-slate-500 dark:text-slate-400 transition-all text-xs";
    }
    if (btnPrev) {
      btnPrev.className = "px-2.5 py-1 rounded font-medium bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm transition-all text-xs";
    }
  } else {
    if (formCol) {
      formCol.classList.remove("hidden");
      formCol.classList.add("space-y-4");
    }
    if (prevCol) {
      prevCol.classList.add("hidden");
      prevCol.classList.add("lg:block");
    }
    if (btnForm) {
      btnForm.className = "px-2.5 py-1 rounded font-medium bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm transition-all text-xs";
    }
    if (btnPrev) {
      btnPrev.className = "px-2.5 py-1 rounded font-medium text-slate-500 dark:text-slate-400 transition-all text-xs";
    }
  }
}

// Simple fallback YAML dump if jsyaml fails or is offline
function dumpYamlFallback(obj, indent = 0) {
  const pad = " ".repeat(indent);
  let yaml = "";

  if (Array.isArray(obj)) {
    if (obj.length === 0) return pad + "[]\n";
    for (const item of obj) {
      if (typeof item === "object" && item !== null) {
        yaml += `${pad}- \n${dumpYamlFallback(item, indent + 2)}`;
      } else {
        yaml += `${pad}- ${JSON.stringify(item)}\n`;
      }
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const [key, val] of Object.entries(obj)) {
      if (val === undefined) continue;
      if (Array.isArray(val)) {
        if (val.length === 0) {
          yaml += `${pad}${key}: []\n`;
        } else {
          yaml += `${pad}${key}:\n${dumpYamlFallback(val, indent + 2)}`;
        }
      } else if (typeof val === "object" && val !== null) {
        yaml += `${pad}${key}:\n${dumpYamlFallback(val, indent + 2)}`;
      } else if (typeof val === "string") {
        if (val.includes("\n")) {
          yaml += `${pad}${key}: |\n${val.split("\n").map(l => pad + "  " + l).join("\n")}\n`;
        } else if (val === "" || val.includes(":") || val.includes("#") || val.includes("'") || val.includes('"')) {
          yaml += `${pad}${key}: "${val.replace(/"/g, '\\"')}"\n`;
        } else {
          yaml += `${pad}${key}: ${val}\n`;
        }
      } else {
        yaml += `${pad}${key}: ${val}\n`;
      }
    }
  } else {
    yaml += `${pad}${obj}\n`;
  }
  return yaml;
}

function dumpYAML(data) {
  if (typeof jsyaml !== "undefined" && jsyaml.dump) {
    try {
      return jsyaml.dump(data, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
      });
    } catch (e) {
      console.warn("jsyaml.dump failed, using fallback:", e);
      return dumpYamlFallback(data);
    }
  }
  return dumpYamlFallback(data);
}

function parseYAML(yamlString) {
  if (typeof jsyaml !== "undefined" && jsyaml.load) {
    return jsyaml.load(yamlString);
  }
  throw new Error("js-yaml 解析庫未載入，無法解析 YAML");
}

// --- YAML Live Rendering & Stats ---
function updateYamlPreview() {
  const currentData = state.currentTab === "progress" ? state.progress : state.handoff;
  const currentFilename = state.currentTab === "progress" ? "progress.yaml" : "handoff.yaml";
  
  const yamlContent = dumpYAML(currentData);
  
  const previewCodeEl = document.getElementById("yaml-preview-code");
  const filenameEl = document.getElementById("preview-filename");
  const statsEl = document.getElementById("preview-stats");
  
  if (filenameEl) filenameEl.textContent = currentFilename;
  if (previewCodeEl) {
    previewCodeEl.textContent = yamlContent;
  }
  
  if (statsEl) {
    const lines = yamlContent.split("\n").length;
    const bytes = new Blob([yamlContent]).size;
    const kb = (bytes / 1024).toFixed(1);
    statsEl.textContent = `${lines} 行 | ${bytes} bytes (${kb} KB)`;
  }

  // 自動觸發 IndexedDB 儲存草稿
  if (typeof scheduleAutoSaveToIndexedDB === "function") {
    scheduleAutoSaveToIndexedDB();
  }
}

// --- DOM Form Rendering: Progress Form ---
function renderProgressForm() {
  const container = document.getElementById("form-content-area");
  if (!container) return;

  const p = state.progress;

  container.innerHTML = `
    <div class="space-y-6">
      <!-- 基本資訊區塊 -->
      <div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            專案全域狀態 (Project Metadata)
          </h3>
          <span class="text-xs text-slate-500 dark:text-slate-400">定義任務基本識別與整體進程</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">專案名稱 (project)</label>
            <input type="text" id="prog-project" value="${escapeHtml(p.project || '')}"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="例如：agent-yaml-maker">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">總體狀態 (status)</label>
            <select id="prog-status"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
              <option value="pending" ${p.status === 'pending' ? 'selected' : ''}>pending (未開始)</option>
              <option value="in_progress" ${p.status === 'in_progress' ? 'selected' : ''}>in_progress (進行中)</option>
              <option value="paused" ${p.status === 'paused' ? 'selected' : ''}>paused (暫停中)</option>
              <option value="completed" ${p.status === 'completed' ? 'selected' : ''}>completed (已完成)</option>
              <option value="failed" ${p.status === 'failed' ? 'selected' : ''}>failed (失敗/終止)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">當前階段 (current_phase)</label>
            <input type="text" id="prog-phase" value="${escapeHtml(p.current_phase || '')}"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="例如：phase_2_core_development">
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-medium text-slate-700 dark:text-slate-300">更新時間戳記 (updated_at)</label>
              <button type="button" onclick="setNowTimestamp('prog-updated_at')"
                class="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline">帶入當前時間</button>
            </div>
            <input type="text" id="prog-updated_at" value="${escapeHtml(p.updated_at || '')}"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono text-xs">
          </div>
        </div>
      </div>

      <!-- 里程碑清單 (Milestones) -->
      <div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              階層式里程碑與子任務 (Milestones & Tasks)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">拆解專案的大目標與每個階段具體執行的 Checklist</p>
          </div>
          <button type="button" onclick="addMilestone()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            新增里程碑
          </button>
        </div>

        <div id="milestones-container" class="space-y-4">
          ${renderMilestonesList(p.milestones || [])}
        </div>
      </div>

      <!-- 產出工件 (Artifacts) -->
      <div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              重要產出工件 (Artifacts)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">記錄產生的規格、代碼、報告或資料檔路徑</p>
          </div>
          <button type="button" onclick="addArtifact()"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-300 dark:border-transparent transition-colors">
            + 新增工件
          </button>
        </div>

        <div id="artifacts-container" class="space-y-2.5">
          ${renderArtifactsList(p.artifacts || [])}
        </div>
      </div>

      <!-- 阻礙與問題 (Blockers) -->
      <div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              阻礙與問題 (Blockers & Issues)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">標記當前卡關事項、風險等級與排查狀態</p>
          </div>
          <button type="button" onclick="addBlocker()"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-300 dark:border-transparent transition-colors">
            + 標記問題
          </button>
        </div>

        <div id="blockers-container" class="space-y-2.5">
          ${renderBlockersList(p.blockers || [])}
        </div>
      </div>
    </div>
  `;

  bindProgressInputEvents();
}

function renderMilestonesList(milestones) {
  if (milestones.length === 0) {
    return `<div class="text-center py-6 text-slate-500 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">尚無里程碑，請點擊上方按鈕新增</div>`;
  }

  return milestones.map((m, mIdx) => `
    <div class="bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/90 rounded-xl p-3.5 sm:p-4 interactive-card shadow-sm" data-m-idx="${mIdx}">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0">
            ${mIdx + 1}
          </span>
          <input type="text" value="${escapeHtml(m.name || '')}"
            oninput="handleMilestoneNameChange(${mIdx}, this.value)"
            class="w-full sm:w-64 md:w-80 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="里程碑名稱，例如：核心付款閘道串接">
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <select onchange="handleMilestoneStatusChange(${mIdx}, this.value)"
            class="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200">
            <option value="pending" ${m.status === 'pending' ? 'selected' : ''}>pending (等待中)</option>
            <option value="in_progress" ${m.status === 'in_progress' ? 'selected' : ''}>in_progress (執行中)</option>
            <option value="completed" ${m.status === 'completed' ? 'selected' : ''}>completed (已達成)</option>
            <option value="blocked" ${m.status === 'blocked' ? 'selected' : ''}>blocked (卡關)</option>
          </select>
          <button type="button" onclick="removeMilestone(${mIdx})"
            class="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors" title="刪除里程碑">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>

      <!-- 子任務區塊 (Checklist) -->
      <div class="pl-2 sm:pl-4 space-y-2">
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>子任務清單 (Tasks)</span>
          <button type="button" onclick="addSubtask(${mIdx})"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium text-xs">+ 新增任務</button>
        </div>
        
        <div class="space-y-1.5" id="tasks-list-${mIdx}">
          ${(m.tasks || []).map((t, tIdx) => `
            <div class="flex items-center gap-2 bg-white dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <input type="text" value="${escapeHtml(t.task || '')}"
                oninput="handleTaskTitleChange(${mIdx}, ${tIdx}, this.value)"
                class="flex-1 bg-transparent border-0 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 p-0"
                placeholder="任務描述，例如：撰寫 Webhook 簽名驗證">
              <select onchange="handleTaskStatusChange(${mIdx}, ${tIdx}, this.value)"
                class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-300">
                <option value="pending" ${t.status === 'pending' ? 'selected' : ''}>pending</option>
                <option value="in_progress" ${t.status === 'in_progress' ? 'selected' : ''}>in_progress</option>
                <option value="completed" ${t.status === 'completed' ? 'selected' : ''}>completed</option>
                <option value="blocked" ${t.status === 'blocked' ? 'selected' : ''}>blocked</option>
              </select>
              <button type="button" onclick="removeSubtask(${mIdx}, ${tIdx})"
                class="text-slate-400 hover:text-rose-500 p-0.5 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function renderArtifactsList(artifacts) {
  if (artifacts.length === 0) {
    return `<div class="text-center py-4 text-slate-500 text-xs border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">尚無工件記錄，點擊上方按鈕新增</div>`;
  }

  return artifacts.map((art, idx) => `
    <div class="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80">
      <input type="text" value="${escapeHtml(art.path || '')}"
        oninput="handleArtifactChange(${idx}, 'path', this.value)"
        class="w-full sm:w-1/2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
        placeholder="檔案路徑，如：src/services/payment.py">
      <input type="text" value="${escapeHtml(art.description || '')}"
        oninput="handleArtifactChange(${idx}, 'description', this.value)"
        class="w-full sm:w-1/2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-800 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500"
        placeholder="工件描述說明">
      <button type="button" onclick="removeArtifact(${idx})"
        class="text-slate-400 hover:text-rose-500 p-1 shrink-0 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  `).join('');
}

function renderBlockersList(blockers) {
  if (blockers.length === 0) {
    return `<div class="text-center py-4 text-slate-500 text-xs border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">目前無任何卡關或問題 (Blocker-Free)</div>`;
  }

  return blockers.map((b, idx) => `
    <div class="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/40">
      <input type="text" value="${escapeHtml(b.issue || '')}"
        oninput="handleBlockerChange(${idx}, 'issue', this.value)"
        class="w-full sm:flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
        placeholder="阻礙描述">
      <select onchange="handleBlockerChange(${idx}, 'severity', this.value)"
        class="w-full sm:w-28 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-300">
        <option value="low" ${b.severity === 'low' ? 'selected' : ''}>low (低)</option>
        <option value="medium" ${b.severity === 'medium' ? 'selected' : ''}>medium (中)</option>
        <option value="high" ${b.severity === 'high' ? 'selected' : ''}>high (高)</option>
        <option value="critical" ${b.severity === 'critical' ? 'selected' : ''}>critical (緊急)</option>
      </select>
      <select onchange="handleBlockerChange(${idx}, 'status', this.value)"
        class="w-full sm:w-32 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-300">
        <option value="investigating" ${b.status === 'investigating' ? 'selected' : ''}>排查中</option>
        <option value="blocked" ${b.status === 'blocked' ? 'selected' : ''}>等待外部</option>
        <option value="resolved" ${b.status === 'resolved' ? 'selected' : ''}>已解除</option>
      </select>
      <button type="button" onclick="removeBlocker(${idx})"
        class="text-slate-400 hover:text-rose-500 p-1 shrink-0 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  `).join('');
}

function bindProgressInputEvents() {
  const projInput = document.getElementById("prog-project");
  const statusSelect = document.getElementById("prog-status");
  const phaseInput = document.getElementById("prog-phase");
  const updatedInput = document.getElementById("prog-updated_at");

  if (projInput) projInput.addEventListener("input", (e) => {
    state.progress.project = e.target.value;
    updateYamlPreview();
  });
  if (statusSelect) statusSelect.addEventListener("change", (e) => {
    state.progress.status = e.target.value;
    updateYamlPreview();
  });
  if (phaseInput) phaseInput.addEventListener("input", (e) => {
    state.progress.current_phase = e.target.value;
    updateYamlPreview();
  });
  if (updatedInput) updatedInput.addEventListener("input", (e) => {
    state.progress.updated_at = e.target.value;
    updateYamlPreview();
  });
}

// Progress Event Handlers
function handleMilestoneNameChange(mIdx, val) {
  state.progress.milestones[mIdx].name = val;
  updateYamlPreview();
}

function handleMilestoneStatusChange(mIdx, val) {
  state.progress.milestones[mIdx].status = val;
  if (val === "completed" && !state.progress.milestones[mIdx].completed_at) {
    state.progress.milestones[mIdx].completed_at = getISOTimestamp();
  }
  updateYamlPreview();
}

function handleTaskTitleChange(mIdx, tIdx, val) {
  state.progress.milestones[mIdx].tasks[tIdx].task = val;
  updateYamlPreview();
}

function handleTaskStatusChange(mIdx, tIdx, val) {
  state.progress.milestones[mIdx].tasks[tIdx].status = val;
  updateYamlPreview();
}

function addMilestone() {
  const nextId = (state.progress.milestones.length || 0) + 1;
  state.progress.milestones.push({
    id: nextId,
    name: "新里程碑 " + nextId,
    status: "in_progress",
    completed_at: "",
    tasks: [{ task: "子任務 1", status: "pending" }]
  });
  renderProgressForm();
  updateYamlPreview();
}

function removeMilestone(mIdx) {
  state.progress.milestones.splice(mIdx, 1);
  state.progress.milestones.forEach((m, idx) => m.id = idx + 1);
  renderProgressForm();
  updateYamlPreview();
}

function addSubtask(mIdx) {
  if (!state.progress.milestones[mIdx].tasks) {
    state.progress.milestones[mIdx].tasks = [];
  }
  state.progress.milestones[mIdx].tasks.push({
    task: "新任務項目",
    status: "pending"
  });
  renderProgressForm();
  updateYamlPreview();
}

function removeSubtask(mIdx, tIdx) {
  state.progress.milestones[mIdx].tasks.splice(tIdx, 1);
  renderProgressForm();
  updateYamlPreview();
}

function addArtifact() {
  if (!state.progress.artifacts) state.progress.artifacts = [];
  state.progress.artifacts.push({
    path: "docs/new-artifact.md",
    description: "工件簡介說明"
  });
  renderProgressForm();
  updateYamlPreview();
}

function handleArtifactChange(idx, field, val) {
  state.progress.artifacts[idx][field] = val;
  updateYamlPreview();
}

function removeArtifact(idx) {
  state.progress.artifacts.splice(idx, 1);
  renderProgressForm();
  updateYamlPreview();
}

function addBlocker() {
  if (!state.progress.blockers) state.progress.blockers = [];
  state.progress.blockers.push({
    issue: "描述碰到的阻礙問題",
    severity: "medium",
    status: "investigating"
  });
  renderProgressForm();
  updateYamlPreview();
}

function handleBlockerChange(idx, field, val) {
  state.progress.blockers[idx][field] = val;
  updateYamlPreview();
}

function removeBlocker(idx) {
  state.progress.blockers.splice(idx, 1);
  renderProgressForm();
  updateYamlPreview();
}

// --- DOM Form Rendering: Handoff Form ---
function renderHandoffForm() {
  const container = document.getElementById("form-content-area");
  if (!container) return;

  const h = state.handoff;

  container.innerHTML = `
    <div class="space-y-6">
      <!-- 基本識別與交接背景 -->
      <div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            交接識別與角色 (Hand-off Metadata)
          </h3>
          <span class="text-xs text-slate-500 dark:text-slate-400">定義交接雙方與觸發時機</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-medium text-slate-700 dark:text-slate-300">交接單號 (handoff_id)</label>
              <button type="button" onclick="generateHandoffId()"
                class="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline">隨機生成</button>
            </div>
            <input type="text" id="hand-id" value="${escapeHtml(h.handoff_id || '')}"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono text-xs">
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-medium text-slate-700 dark:text-slate-300">交接時間 (timestamp)</label>
              <button type="button" onclick="setNowTimestamp('hand-timestamp')"
                class="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline">帶入當前時間</button>
            </div>
            <input type="text" id="hand-timestamp" value="${escapeHtml(h.timestamp || '')}"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono text-xs">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">交付方角色 (from_agent)</label>
            <input type="text" id="hand-from" value="${escapeHtml(h.from_agent || '')}"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              placeholder="例如：ArchitectAgent / Planner">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">接收方角色 (to_agent)</label>
            <input type="text" id="hand-to" value="${escapeHtml(h.to_agent || '')}"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              placeholder="例如：BackendDeveloperAgent / Reviewer">
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">交接原因與觸發條件 (reason)</label>
            <input type="text" id="hand-reason" value="${escapeHtml(h.reason || '')}"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              placeholder="例如：系統架構審查完畢，交接進入編碼實作階段">
          </div>
        </div>
      </div>

      <!-- 工作摘要與產出 (Summary of Work) -->
      <div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              已完成工作摘要 (Summary of Work)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">條列式濃縮此 Session 已完成的關鍵任務</p>
          </div>
          <button type="button" onclick="addHandoffSummary()"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-300 dark:border-transparent transition-colors">
            + 新增摘要
          </button>
        </div>

        <div id="hand-summaries" class="space-y-2">
          ${renderStringList(h.summary_of_work || [], 'summary')}
        </div>
      </div>

      <!-- 關鍵決策與架構規範 (Key Decisions) -->
      <div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              核心技術決策 (Key Decisions Made)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">固定架構基準，防止後續接手的 Agent 擅自推翻或重做</p>
          </div>
          <button type="button" onclick="addHandoffDecision()"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-300 dark:border-transparent transition-colors">
            + 新增決策
          </button>
        </div>

        <div id="hand-decisions" class="space-y-2">
          ${renderStringList(h.key_decisions || [], 'decision')}
        </div>
      </div>

      <!-- 下一步行動清單 (Next Steps) -->
      <div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <svg class="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
              接手者下一步行動清單 (Next Steps)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">明確標記優先級、具體行動與預期修改的目標檔案</p>
          </div>
          <button type="button" onclick="addHandoffNextStep()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
            + 新增下一步
          </button>
        </div>

        <div id="hand-nextsteps" class="space-y-3">
          ${renderNextStepsList(h.next_steps || [])}
        </div>
      </div>

      <!-- 約束條件與特別提醒 (Constraints & Notes) -->
      <div class="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              邊界約束與注意事項 (Constraints & Notes)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">資安、效能、相容性等不可違背的紅線與備註</p>
          </div>
          <button type="button" onclick="addHandoffConstraint()"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-300 dark:border-transparent transition-colors">
            + 新增約束
          </button>
        </div>

        <div id="hand-constraints" class="space-y-2">
          ${renderStringList(h.constraints_and_notes || [], 'constraint')}
        </div>
      </div>
    </div>
  `;

  bindHandoffInputEvents();
}

function renderStringList(items, type) {
  if (items.length === 0) {
    return `<div class="text-center py-3 text-slate-500 text-xs border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">尚無項目，請點擊上方按鈕新增</div>`;
  }

  return items.map((item, idx) => `
    <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700/70">
      <span class="text-slate-400 dark:text-slate-500 text-xs shrink-0 select-none">•</span>
      <input type="text" value="${escapeHtml(item)}"
        oninput="handleStringItemChange('${type}', ${idx}, this.value)"
        class="flex-1 bg-transparent border-0 text-xs text-slate-800 dark:text-slate-200 focus:ring-0 p-0 placeholder-slate-400 dark:placeholder-slate-500"
        placeholder="請輸入內容...">
      <button type="button" onclick="removeStringItem('${type}', ${idx})"
        class="text-slate-400 hover:text-rose-500 p-0.5 transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  `).join('');
}

function renderNextStepsList(steps) {
  if (steps.length === 0) {
    return `<div class="text-center py-4 text-slate-500 text-xs border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">尚無下一步清單，請點擊上方按鈕新增</div>`;
  }

  return steps.map((s, idx) => `
    <div class="bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 interactive-card">
      <div class="flex items-center justify-between gap-2 mb-2">
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-600 dark:text-slate-400 font-medium">優先級 (priority):</label>
          <input type="number" min="1" max="10" value="${s.priority || (idx + 1)}"
            oninput="handleNextStepPriorityChange(${idx}, this.value)"
            class="w-16 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-100 font-mono text-center">
        </div>
        <button type="button" onclick="removeNextStep(${idx})"
          class="text-slate-400 hover:text-rose-500 p-1 transition-colors" title="刪除此項">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>

      <div class="space-y-2">
        <div>
          <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">具體行動描述 (action):</label>
          <input type="text" value="${escapeHtml(s.action || '')}"
            oninput="handleNextStepActionChange(${idx}, this.value)"
            class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="例如：實作 Webhook 簽名驗證與非同步處理器">
        </div>

        <div>
          <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">目標關聯檔案 (target_files，逗號分隔):</label>
          <input type="text" value="${escapeHtml((s.target_files || []).join(', '))}"
            oninput="handleNextStepFilesChange(${idx}, this.value)"
            class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-blue-600 dark:text-blue-300 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="例如：src/webhooks/signature.py, src/handler.py">
        </div>
      </div>
    </div>
  `).join('');
}

function bindHandoffInputEvents() {
  const idInput = document.getElementById("hand-id");
  const tsInput = document.getElementById("hand-timestamp");
  const fromInput = document.getElementById("hand-from");
  const toInput = document.getElementById("hand-to");
  const reasonInput = document.getElementById("hand-reason");

  if (idInput) idInput.addEventListener("input", (e) => {
    state.handoff.handoff_id = e.target.value;
    updateYamlPreview();
  });
  if (tsInput) tsInput.addEventListener("input", (e) => {
    state.handoff.timestamp = e.target.value;
    updateYamlPreview();
  });
  if (fromInput) fromInput.addEventListener("input", (e) => {
    state.handoff.from_agent = e.target.value;
    updateYamlPreview();
  });
  if (toInput) toInput.addEventListener("input", (e) => {
    state.handoff.to_agent = e.target.value;
    updateYamlPreview();
  });
  if (reasonInput) reasonInput.addEventListener("input", (e) => {
    state.handoff.reason = e.target.value;
    updateYamlPreview();
  });
}

// Handoff Handlers
function generateHandoffId() {
  const newId = generateId();
  state.handoff.handoff_id = newId;
  const input = document.getElementById("hand-id");
  if (input) input.value = newId;
  updateYamlPreview();
  showToast(`已生成交接單號: ${newId}`);
}

function handleStringItemChange(type, idx, val) {
  if (type === 'summary') state.handoff.summary_of_work[idx] = val;
  else if (type === 'decision') state.handoff.key_decisions[idx] = val;
  else if (type === 'constraint') state.handoff.constraints_and_notes[idx] = val;
  updateYamlPreview();
}

function removeStringItem(type, idx) {
  if (type === 'summary') state.handoff.summary_of_work.splice(idx, 1);
  else if (type === 'decision') state.handoff.key_decisions.splice(idx, 1);
  else if (type === 'constraint') state.handoff.constraints_and_notes.splice(idx, 1);
  renderHandoffForm();
  updateYamlPreview();
}

function addHandoffSummary() {
  if (!state.handoff.summary_of_work) state.handoff.summary_of_work = [];
  state.handoff.summary_of_work.push("新完成的工作項目描述");
  renderHandoffForm();
  updateYamlPreview();
}

function addHandoffDecision() {
  if (!state.handoff.key_decisions) state.handoff.key_decisions = [];
  state.handoff.key_decisions.push("新確定的關鍵架構決策或技術選型");
  renderHandoffForm();
  updateYamlPreview();
}

function addHandoffConstraint() {
  if (!state.handoff.constraints_and_notes) state.handoff.constraints_and_notes = [];
  state.handoff.constraints_and_notes.push("新標記的邊界約束、資安限制或環境要求");
  renderHandoffForm();
  updateYamlPreview();
}

function addHandoffNextStep() {
  if (!state.handoff.next_steps) state.handoff.next_steps = [];
  const nextPriority = state.handoff.next_steps.length + 1;
  state.handoff.next_steps.push({
    priority: nextPriority,
    action: "下一步應執行的具體行動說明",
    target_files: ["src/target_file.py"]
  });
  renderHandoffForm();
  updateYamlPreview();
}

function removeNextStep(idx) {
  state.handoff.next_steps.splice(idx, 1);
  renderHandoffForm();
  updateYamlPreview();
}

function handleNextStepPriorityChange(idx, val) {
  state.handoff.next_steps[idx].priority = parseInt(val, 10) || 1;
  updateYamlPreview();
}

function handleNextStepActionChange(idx, val) {
  state.handoff.next_steps[idx].action = val;
  updateYamlPreview();
}

function handleNextStepFilesChange(idx, val) {
  state.handoff.next_steps[idx].target_files = val
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  updateYamlPreview();
}

// --- Global Utilities ---
function setNowTimestamp(inputId) {
  const now = getISOTimestamp();
  const input = document.getElementById(inputId);
  if (input) {
    input.value = now;
    if (inputId === "prog-updated_at") state.progress.updated_at = now;
    if (inputId === "hand-timestamp") state.handoff.timestamp = now;
    updateYamlPreview();
    showToast("已填入當前 ISO 時間戳記");
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- Tab Switching ---
function switchTab(tab) {
  if (state.currentTab === tab) return;
  state.currentTab = tab;

  const tabProg = document.getElementById("tab-progress");
  const tabHand = document.getElementById("tab-handoff");

  if (tab === "progress") {
    if (tabProg) tabProg.className = "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 transition-colors";
    if (tabHand) tabHand.className = "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-b-2 border-transparent transition-colors";
    renderProgressForm();
  } else {
    if (tabHand) tabHand.className = "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 transition-colors";
    if (tabProg) tabProg.className = "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-b-2 border-transparent transition-colors";
    renderHandoffForm();
  }

  updateYamlPreview();
}

// --- Preset Selection ---
function applyPreset(presetKey) {
  if (!PRESETS[presetKey]) return;
  state.selectedPreset = presetKey;
  state.progress = JSON.parse(JSON.stringify(PRESETS[presetKey].progress));
  state.handoff = JSON.parse(JSON.stringify(PRESETS[presetKey].handoff));

  // Refresh timestamps to now
  const now = getISOTimestamp();
  if (state.progress.updated_at) state.progress.updated_at = now;
  if (state.handoff.timestamp) state.handoff.timestamp = now;

  if (state.currentTab === "progress") {
    renderProgressForm();
  } else {
    renderHandoffForm();
  }

  updateYamlPreview();
  showToast(`已載入範本：「${getPresetDisplayName(presetKey)}」`);
}

function getPresetDisplayName(key) {
  switch (key) {
    case 'software_dev': return '軟體開發迭代 (Software Dev)';
    case 'data_etl': return '數據分析與 ETL (Data Analytics)';
    case 'spec_doc': return '規格與安全文檔 (Spec & Governance)';
    case 'blank': return '空白模板 (Blank Template)';
    default: return key;
  }
}

// --- Copy & Download Actions ---
function copyYamlToClipboard() {
  const currentData = state.currentTab === "progress" ? state.progress : state.handoff;
  const yamlContent = dumpYAML(currentData);

  navigator.clipboard.writeText(yamlContent).then(() => {
    showToast("已成功複製 YAML 到剪貼簿！");
  }).catch(err => {
    console.error("Clipboard copy failed:", err);
    // Fallback using textarea
    const ta = document.createElement("textarea");
    ta.value = yamlContent;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("已複製 YAML 到剪貼簿");
  });
}

function downloadCurrentYaml() {
  const filename = state.currentTab === "progress" ? "progress.yaml" : "handoff.yaml";
  const currentData = state.currentTab === "progress" ? state.progress : state.handoff;
  const content = dumpYAML(currentData);

  downloadTextFile(filename, content);
  showToast(`已下載 ${filename}`);
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/yaml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export both progress.yaml and handoff.yaml as a ZIP archive
function exportZipBundle() {
  if (typeof JSZip === "undefined") {
    showToast("JSZip 壓縮庫尚未就緒，請使用個別下載", "error");
    return;
  }

  const zip = new JSZip();
  const progressContent = dumpYAML(state.progress);
  const handoffContent = dumpYAML(state.handoff);

  zip.file("progress.yaml", progressContent);
  zip.file("handoff.yaml", handoffContent);

  // Also include a helpful README inside the zip
  const readmeContent = `# Agent State Bundle
Generated by Agent YAML Maker at ${new Date().toISOString()}

Included Files:
- progress.yaml : 長任務全域進度與狀態看板 (Tasks, Milestones, Artifacts)
- handoff.yaml  : 代理交接接力棒工單 (Context, Decisions, Next Steps)

Usage:
Place these files in your agent working directory or pass them to your Autonomous Agent session.
`;
  zip.file("README.md", readmeContent);

  zip.generateAsync({ type: "blob" }).then(content => {
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent-yaml-bundle-${Date.now().toString().slice(-6)}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("已完成打包並下載 ZIP 檔案！");
  }).catch(err => {
    console.error("ZIP creation failed:", err);
    showToast("打包 ZIP 失敗: " + err.message, "error");
  });
}

// --- Reverse YAML Parsing & Import Modal ---
function openImportModal() {
  const modal = document.getElementById("import-modal");
  const textarea = document.getElementById("import-yaml-text");
  if (modal) {
    modal.classList.remove("hidden");
    if (textarea) textarea.value = "";
  }
}

function closeImportModal() {
  const modal = document.getElementById("import-modal");
  if (modal) modal.classList.add("hidden");
}

function handleImportFileSelect(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const content = evt.target.result;
    const textarea = document.getElementById("import-yaml-text");
    if (textarea) textarea.value = content;
  };
  reader.readAsText(file);
}

function executeImportYaml() {
  const textarea = document.getElementById("import-yaml-text");
  if (!textarea || !textarea.value.trim()) {
    showToast("請先貼上或選擇 YAML 檔案內容", "error");
    return;
  }

  try {
    const parsed = parseYAML(textarea.value);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("YAML 解析結果非有效物件");
    }

    // Auto-detect type
    let detectedType = "";
    if (parsed.milestones !== undefined || parsed.current_phase !== undefined) {
      detectedType = "progress";
    } else if (parsed.handoff_id !== undefined || parsed.from_agent !== undefined || parsed.key_decisions !== undefined) {
      detectedType = "handoff";
    } else {
      // Default to current tab
      detectedType = state.currentTab;
    }

    if (detectedType === "progress") {
      state.progress = {
        project: parsed.project || "imported-project",
        status: parsed.status || "in_progress",
        current_phase: parsed.current_phase || "",
        updated_at: parsed.updated_at || getISOTimestamp(),
        milestones: Array.isArray(parsed.milestones) ? parsed.milestones : [],
        artifacts: Array.isArray(parsed.artifacts) ? parsed.artifacts : [],
        blockers: Array.isArray(parsed.blockers) ? parsed.blockers : []
      };
      switchTab("progress");
      renderProgressForm();
      showToast("已成功載入並套用至 progress.yaml 表單！");
    } else {
      state.handoff = {
        handoff_id: parsed.handoff_id || generateId(),
        timestamp: parsed.timestamp || getISOTimestamp(),
        from_agent: parsed.from_agent || "Agent_From",
        to_agent: parsed.to_agent || "Agent_To",
        reason: parsed.reason || "",
        summary_of_work: Array.isArray(parsed.summary_of_work) ? parsed.summary_of_work : [],
        key_decisions: Array.isArray(parsed.key_decisions) ? parsed.key_decisions : [],
        next_steps: Array.isArray(parsed.next_steps) ? parsed.next_steps : [],
        constraints_and_notes: Array.isArray(parsed.constraints_and_notes) ? parsed.constraints_and_notes : []
      };
      switchTab("handoff");
      renderHandoffForm();
      showToast("已成功載入並套用至 handoff.yaml 表單！");
    }

    updateYamlPreview();
    closeImportModal();
  } catch (err) {
    console.error("Import failed:", err);
    showToast("YAML 解析失敗: " + err.message, "error");
  }
}

// ==========================================
// --- IndexedDB Persistence Subsystem ---
// ==========================================

const DB_NAME = "AgentYamlMakerDB";
const DB_VERSION = 2;
const STORE_DRAFTS = "drafts";
const STORE_SNAPSHOTS = "snapshots";
const STORE_TEMPLATES = "templates";

let dbInstance = null;
let autoSaveTimer = null;
let currentFilterType = "all";

/**
 * 初始化 IndexedDB 並建立 Object Stores
 */
function initIndexedDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn("IndexedDB not supported by this browser.");
      updateDbStatus(false, "瀏覽器不支援 IndexedDB");
      return resolve(null);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function(e) {
      const db = e.target.result;

      // 1. drafts store: 儲存當前工作草稿 (key: 'active_session')
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
        db.createObjectStore(STORE_DRAFTS, { keyPath: "id" });
      }

      // 2. snapshots store: 儲存使用者手動保存的歷史版本/快照庫
      if (!db.objectStoreNames.contains(STORE_SNAPSHOTS)) {
        const snapStore = db.createObjectStore(STORE_SNAPSHOTS, { keyPath: "id", autoIncrement: true });
        snapStore.createIndex("type", "type", { unique: false });
        snapStore.createIndex("createdAt", "createdAt", { unique: false });
      }

      // 3. templates store: 儲存自訂範本 (CRUD)
      if (!db.objectStoreNames.contains(STORE_TEMPLATES)) {
        const tplStore = db.createObjectStore(STORE_TEMPLATES, { keyPath: "id", autoIncrement: true });
        tplStore.createIndex("name", "name", { unique: false });
        tplStore.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };

    request.onsuccess = function(e) {
      dbInstance = e.target.result;
      updateDbStatus(true, "IndexedDB 已連線 (即時自動存檔)");
      updateSnapshotCountBadge();
      refreshCustomPresetsDropdown();
      resolve(dbInstance);
    };

    request.onerror = function(e) {
      console.error("IndexedDB open error:", e.target.error);
      updateDbStatus(false, "IndexedDB 連線失敗");
      reject(e.target.error);
    };
  });
}

function updateDbStatus(isOnline, text) {
  const dot = document.getElementById("db-status-dot");
  const label = document.getElementById("db-status-text");
  if (dot) {
    dot.className = isOnline 
      ? "inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
      : "inline-block w-2 h-2 rounded-full bg-rose-500";
  }
  if (label) {
    label.textContent = text;
  }
}

/**
 * 自動防抖儲存當前工作草稿至 IndexedDB
 */
function scheduleAutoSaveToIndexedDB() {
  if (!dbInstance) return;

  clearTimeout(autoSaveTimer);
  const label = document.getElementById("db-status-text");
  if (label) label.textContent = "自動存檔中...";

  autoSaveTimer = setTimeout(() => {
    saveActiveDraftToDB()
      .then(() => {
        const timeStr = new Date().toLocaleTimeString();
        if (label) label.textContent = `IndexedDB 已同步 (${timeStr})`;
      })
      .catch(err => {
        console.warn("Auto save failed:", err);
      });
  }, 400);
}

function saveActiveDraftToDB() {
  return new Promise((resolve, reject) => {
    if (!dbInstance) return resolve();

    const tx = dbInstance.transaction([STORE_DRAFTS], "readwrite");
    const store = tx.objectStore(STORE_DRAFTS);

    const draftRecord = {
      id: "active_session",
      currentTab: state.currentTab,
      selectedPreset: state.selectedPreset,
      progress: state.progress,
      handoff: state.handoff,
      savedAt: new Date().toISOString()
    };

    const req = store.put(draftRecord);
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject(e.target.error);
  });
}

/**
 * 啟動時從 IndexedDB 還原未完成草稿
 */
function restoreActiveDraftFromDB() {
  return new Promise((resolve) => {
    if (!dbInstance) return resolve(false);

    const tx = dbInstance.transaction([STORE_DRAFTS], "readonly");
    const store = tx.objectStore(STORE_DRAFTS);
    const req = store.get("active_session");

    req.onsuccess = function(e) {
      const draft = e.target.result;
      if (draft && (draft.progress || draft.handoff)) {
        if (draft.progress) state.progress = draft.progress;
        if (draft.handoff) state.handoff = draft.handoff;
        if (draft.selectedPreset) {
          state.selectedPreset = draft.selectedPreset;
          const selector = document.getElementById("preset-selector");
          if (selector) selector.value = draft.selectedPreset;
        }
        if (draft.currentTab) {
          state.currentTab = draft.currentTab;
        }
        return resolve(true);
      }
      resolve(false);
    };

    req.onerror = function() {
      resolve(false);
    };
  });
}

/**
 * 歷史快照管理 (Save, List, Load, Delete, Clear)
 */
function openSaveSnapshotModal() {
  const modal = document.getElementById("save-snapshot-modal");
  const nameInput = document.getElementById("snap-name-input");
  const typeSelect = document.getElementById("snap-type-select");
  const notesInput = document.getElementById("snap-notes-input");

  if (!modal) return;

  // 預填預設名稱
  if (nameInput) {
    if (state.currentTab === "progress") {
      nameInput.value = `${state.progress.project || "project"}-${new Date().toLocaleTimeString().replace(/:/g, '')}`;
    } else {
      nameInput.value = `${state.handoff.handoff_id || "handoff"}`;
    }
  }

  if (typeSelect) {
    typeSelect.value = state.currentTab; // 預設當前分頁
  }

  if (notesInput) notesInput.value = "";

  modal.classList.remove("hidden");
}

function closeSaveSnapshotModal() {
  const modal = document.getElementById("save-snapshot-modal");
  if (modal) modal.classList.add("hidden");
}

function executeSaveSnapshot() {
  if (!dbInstance) {
    showToast("IndexedDB 尚未就緒", "error");
    return;
  }

  const nameInput = document.getElementById("snap-name-input");
  const typeSelect = document.getElementById("snap-type-select");
  const notesInput = document.getElementById("snap-notes-input");

  const snapName = (nameInput && nameInput.value.trim()) || "未命名快照";
  const snapType = (typeSelect && typeSelect.value) || state.currentTab;
  const snapNotes = (notesInput && notesInput.value.trim()) || "";

  let snapshotData = null;
  let yamlPreview = "";

  if (snapType === "progress") {
    snapshotData = JSON.parse(JSON.stringify(state.progress));
    yamlPreview = dumpYAML(snapshotData);
  } else if (snapType === "handoff") {
    snapshotData = JSON.parse(JSON.stringify(state.handoff));
    yamlPreview = dumpYAML(snapshotData);
  } else {
    // bundle
    snapshotData = {
      progress: JSON.parse(JSON.stringify(state.progress)),
      handoff: JSON.parse(JSON.stringify(state.handoff))
    };
    yamlPreview = `# progress.yaml\n${dumpYAML(snapshotData.progress)}\n---\n# handoff.yaml\n${dumpYAML(snapshotData.handoff)}`;
  }

  const record = {
    name: snapName,
    type: snapType,
    notes: snapNotes,
    data: snapshotData,
    yamlPreview: yamlPreview,
    createdAt: new Date().toISOString()
  };

  const tx = dbInstance.transaction([STORE_SNAPSHOTS], "readwrite");
  const store = tx.objectStore(STORE_SNAPSHOTS);
  const req = store.add(record);

  req.onsuccess = function() {
    showToast(`已儲存快照至 IndexedDB:「${snapName}」`);
    updateSnapshotCountBadge();
    closeSaveSnapshotModal();
  };

  req.onerror = function(err) {
    console.error("Save snapshot failed:", err);
    showToast("儲存快照失敗", "error");
  };
}

function updateSnapshotCountBadge() {
  if (!dbInstance) return;
  const countEl = document.getElementById("snapshot-count");
  if (!countEl) return;

  const tx = dbInstance.transaction([STORE_SNAPSHOTS], "readonly");
  const store = tx.objectStore(STORE_SNAPSHOTS);
  const req = store.count();

  req.onsuccess = function(e) {
    countEl.textContent = e.target.result || 0;
  };
}

function openSnapshotModal() {
  const modal = document.getElementById("snapshot-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  filterSnapshots(currentFilterType || "all");
}

function closeSnapshotModal() {
  const modal = document.getElementById("snapshot-modal");
  if (modal) modal.classList.add("hidden");
}

function filterSnapshots(type) {
  currentFilterType = type;

  // 更新篩選標籤外觀
  ["all", "progress", "handoff", "bundle"].forEach(t => {
    const btn = document.getElementById(`filter-${t}`);
    if (btn) {
      if (t === type) {
        btn.className = "px-2 py-0.5 rounded bg-blue-600 text-white font-medium";
      } else {
        btn.className = "px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700";
      }
    }
  });

  renderSnapshotsList();
}

function renderSnapshotsList() {
  const container = document.getElementById("snapshots-list-container");
  if (!container) return;

  if (!dbInstance) {
    container.innerHTML = `<div class="text-center py-8 text-slate-500 text-xs">IndexedDB 資料庫未連線</div>`;
    return;
  }

  const tx = dbInstance.transaction([STORE_SNAPSHOTS], "readonly");
  const store = tx.objectStore(STORE_SNAPSHOTS);
  const req = store.getAll();

  req.onsuccess = function(e) {
    let list = e.target.result || [];
    
    // 依 id 倒序排序（越新的排越前）
    list.sort((a, b) => (b.id || 0) - (a.id || 0));

    if (currentFilterType !== "all") {
      list = list.filter(item => item.type === currentFilterType);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-300 dark:border-slate-700/80 rounded-xl space-y-2">
          <svg class="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          <p>尚無任何儲存的快照紀錄</p>
          <p class="text-[11px] text-slate-400 dark:text-slate-600">點擊頂部「存為快照」可將當前專案或交接單存入 IndexedDB</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => {
      const typeBadge = item.type === "progress" 
        ? `<span class="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 rounded">progress.yaml</span>`
        : item.type === "handoff"
        ? `<span class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60 rounded">handoff.yaml</span>`
        : `<span class="px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border border-purple-200 dark:border-purple-700/60 rounded">bundle (打包)</span>`;

      const timeStr = new Date(item.createdAt).toLocaleString();

      return `
        <div class="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 interactive-card shadow-sm space-y-2.5">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              ${typeBadge}
              <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">${escapeHtml(item.name)}</h4>
            </div>
            <span class="text-[11px] text-slate-400 dark:text-slate-500 font-mono">${timeStr}</span>
          </div>

          ${item.notes ? `<p class="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/40 p-2 rounded border border-slate-200 dark:border-slate-800">${escapeHtml(item.notes)}</p>` : ''}

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onclick="loadSnapshot(${item.id})"
              class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded transition-colors shadow-sm">
              載入至編輯器
            </button>
            <button type="button" onclick="downloadSnapshot(${item.id})"
              class="px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 transition-colors">
              下載檔案
            </button>
            <button type="button" onclick="deleteSnapshot(${item.id})"
              class="px-2 py-1 text-slate-400 hover:text-rose-500 text-xs transition-colors">
              刪除
            </button>
          </div>
        </div>
      `;
    }).join("");
  };
}

function loadSnapshot(id) {
  if (!dbInstance) return;

  const tx = dbInstance.transaction([STORE_SNAPSHOTS], "readonly");
  const store = tx.objectStore(STORE_SNAPSHOTS);
  const req = store.get(id);

  req.onsuccess = function(e) {
    const item = e.target.result;
    if (!item) return;

    if (item.type === "progress") {
      state.progress = JSON.parse(JSON.stringify(item.data));
      switchTab("progress");
      renderProgressForm();
    } else if (item.type === "handoff") {
      state.handoff = JSON.parse(JSON.stringify(item.data));
      switchTab("handoff");
      renderHandoffForm();
    } else if (item.type === "bundle") {
      if (item.data.progress) state.progress = JSON.parse(JSON.stringify(item.data.progress));
      if (item.data.handoff) state.handoff = JSON.parse(JSON.stringify(item.data.handoff));
      if (state.currentTab === "progress") renderProgressForm();
      else renderHandoffForm();
    }

    updateYamlPreview();
    scheduleAutoSaveToIndexedDB();
    closeSnapshotModal();
    showToast(`已載入快照：「${item.name}」`);
  };
}

function downloadSnapshot(id) {
  if (!dbInstance) return;

  const tx = dbInstance.transaction([STORE_SNAPSHOTS], "readonly");
  const store = tx.objectStore(STORE_SNAPSHOTS);
  const req = store.get(id);

  req.onsuccess = function(e) {
    const item = e.target.result;
    if (!item) return;

    if (item.type === "bundle") {
      if (typeof JSZip === "undefined") {
        showToast("JSZip 未載入，無法打包", "error");
        return;
      }
      const zip = new JSZip();
      zip.file("progress.yaml", dumpYAML(item.data.progress));
      zip.file("handoff.yaml", dumpYAML(item.data.handoff));
      zip.generateAsync({ type: "blob" }).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${item.name}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } else {
      const filename = item.type === "progress" ? "progress.yaml" : "handoff.yaml";
      downloadTextFile(filename, dumpYAML(item.data));
    }
  };
}

function deleteSnapshot(id) {
  if (!confirm("確定要刪除這筆快照嗎？")) return;
  if (!dbInstance) return;

  const tx = dbInstance.transaction([STORE_SNAPSHOTS], "readwrite");
  const store = tx.objectStore(STORE_SNAPSHOTS);
  const req = store.delete(id);

  req.onsuccess = function() {
    showToast("已刪除該筆快照");
    updateSnapshotCountBadge();
    renderSnapshotsList();
  };
}

function clearAllSnapshots() {
  if (!confirm("⚠️ 警告：確定要清空 IndexedDB 中的所有歷史快照嗎？此操作不可復原。")) return;
  if (!dbInstance) return;

  const tx = dbInstance.transaction([STORE_SNAPSHOTS], "readwrite");
  const store = tx.objectStore(STORE_SNAPSHOTS);
  const req = store.clear();

  req.onsuccess = function() {
    showToast("已清空所有歷史快照！");
    updateSnapshotCountBadge();
    renderSnapshotsList();
  };
}

// ==========================================
// --- Template CRUD Subsystem (範本管理) ---
// ==========================================

/**
 * 從 IndexedDB 取得所有自訂範本清單
 */
function getCustomTemplatesFromDB() {
  return new Promise((resolve) => {
    if (!dbInstance) return resolve([]);
    try {
      const tx = dbInstance.transaction([STORE_TEMPLATES], "readonly");
      const store = tx.objectStore(STORE_TEMPLATES);
      const req = store.getAll();
      req.onsuccess = (e) => {
        const list = e.target.result || [];
        list.sort((a, b) => (b.id || 0) - (a.id || 0));
        resolve(list);
      };
      req.onerror = () => resolve([]);
    } catch (e) {
      console.warn("getCustomTemplatesFromDB error:", e);
      resolve([]);
    }
  });
}

/**
 * 刷新頂部下拉選單的自訂範本清單
 */
function refreshCustomPresetsDropdown() {
  const optgroup = document.getElementById("custom-presets-optgroup");
  if (!optgroup) return;

  getCustomTemplatesFromDB().then((customTemplates) => {
    if (customTemplates.length === 0) {
      optgroup.innerHTML = `<option value="" disabled class="text-slate-400 dark:text-slate-500">(尚無自訂範本，可點擊右側 + 建立)</option>`;
    } else {
      optgroup.innerHTML = customTemplates.map(tpl => `
        <option value="custom_${tpl.id}" ${state.selectedPreset === 'custom_' + tpl.id ? 'selected' : ''} class="text-amber-700 dark:text-amber-200">
          ⭐ ${escapeHtml(tpl.name)}
        </option>
      `).join("");
    }
  });
}

/**
 * 下拉選單切換分流 (內建範本 vs. 自訂範本)
 */
function handlePresetSelection(val) {
  if (!val) return;
  if (val.startsWith("custom_")) {
    const id = parseInt(val.replace("custom_", ""), 10);
    loadCustomTemplate(id);
  } else {
    applyPreset(val);
  }
}

/**
 * 載入指定自訂範本至編輯器
 */
function loadCustomTemplate(id) {
  if (!dbInstance) return;
  const tx = dbInstance.transaction([STORE_TEMPLATES], "readonly");
  const store = tx.objectStore(STORE_TEMPLATES);
  const req = store.get(id);

  req.onsuccess = function(e) {
    const tpl = e.target.result;
    if (!tpl) {
      showToast("找不到該自訂範本", "error");
      return;
    }

    state.selectedPreset = "custom_" + id;
    if (tpl.progress) state.progress = JSON.parse(JSON.stringify(tpl.progress));
    if (tpl.handoff) state.handoff = JSON.parse(JSON.stringify(tpl.handoff));

    // 更新時間戳記至當前
    const now = getISOTimestamp();
    if (state.progress.updated_at) state.progress.updated_at = now;
    if (state.handoff.timestamp) state.handoff.timestamp = now;

    if (state.currentTab === "progress") {
      renderProgressForm();
    } else {
      renderHandoffForm();
    }

    updateYamlPreview();
    scheduleAutoSaveToIndexedDB();

    const selector = document.getElementById("preset-selector");
    if (selector) selector.value = "custom_" + id;

    showToast(`已套用自訂範本：「${tpl.name}」`);
  };
}

/**
 * 開啟建立範本彈窗 (Create)
 */
function openCreateTemplateModal() {
  const modal = document.getElementById("template-form-modal");
  const titleEl = document.getElementById("tpl-modal-title");
  const idInput = document.getElementById("tpl-edit-id");
  const nameInput = document.getElementById("tpl-name-input");
  const descInput = document.getElementById("tpl-desc-input");
  const sourceGroup = document.getElementById("tpl-source-group");

  if (!modal) return;

  if (titleEl) titleEl.innerHTML = `<svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> 建立新自訂範本`;
  if (idInput) idInput.value = "";
  if (nameInput) {
    const baseName = state.progress.project || "自訂範本";
    nameInput.value = `${baseName}-${new Date().toLocaleTimeString().replace(/:/g, '')}`;
  }
  if (descInput) descInput.value = "";
  if (sourceGroup) sourceGroup.classList.remove("hidden");

  modal.classList.remove("hidden");
}

/**
 * 開啟編輯範本中繼資料彈窗 (Update Metadata)
 */
function openEditTemplateModal(id) {
  if (!dbInstance) return;
  const tx = dbInstance.transaction([STORE_TEMPLATES], "readonly");
  const store = tx.objectStore(STORE_TEMPLATES);
  const req = store.get(id);

  req.onsuccess = function(e) {
    const tpl = e.target.result;
    if (!tpl) return;

    const modal = document.getElementById("template-form-modal");
    const titleEl = document.getElementById("tpl-modal-title");
    const idInput = document.getElementById("tpl-edit-id");
    const nameInput = document.getElementById("tpl-name-input");
    const descInput = document.getElementById("tpl-desc-input");
    const sourceGroup = document.getElementById("tpl-source-group");

    if (titleEl) titleEl.innerHTML = `<svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> 編輯範本資訊`;
    if (idInput) idInput.value = tpl.id;
    if (nameInput) nameInput.value = tpl.name || "";
    if (descInput) descInput.value = tpl.description || "";
    if (sourceGroup) sourceGroup.classList.add("hidden"); // 編輯名稱時不改結構

    if (modal) modal.classList.remove("hidden");
  };
}

function closeTemplateFormModal() {
  const modal = document.getElementById("template-form-modal");
  if (modal) modal.classList.add("hidden");
}

/**
 * 儲存範本 (Create 或 Update)
 */
function saveTemplateForm() {
  if (!dbInstance) {
    showToast("IndexedDB 尚未就緒", "error");
    return;
  }

  const nameInput = document.getElementById("tpl-name-input");
  const descInput = document.getElementById("tpl-desc-input");
  const idInput = document.getElementById("tpl-edit-id");
  const sourceSelect = document.getElementById("tpl-source-select");

  const name = nameInput ? nameInput.value.trim() : "";
  const desc = descInput ? descInput.value.trim() : "";
  const editId = idInput ? idInput.value : "";

  if (!name) {
    showToast("請輸入範本名稱", "error");
    if (nameInput) nameInput.focus();
    return;
  }

  const now = new Date().toISOString();

  if (editId) {
    // 編輯現有範本名稱/說明 (Update)
    const id = parseInt(editId, 10);
    const tx = dbInstance.transaction([STORE_TEMPLATES], "readwrite");
    const store = tx.objectStore(STORE_TEMPLATES);
    const getReq = store.get(id);

    getReq.onsuccess = function(e) {
      const tpl = e.target.result;
      if (!tpl) return;
      tpl.name = name;
      tpl.description = desc;
      tpl.updatedAt = now;

      const putReq = store.put(tpl);
      putReq.onsuccess = function() {
        showToast(`已更新範本資訊：「${name}」`);
        closeTemplateFormModal();
        refreshCustomPresetsDropdown();
        renderTemplateManagerList();
      };
    };
  } else {
    // 新增範本 (Create)
    const source = sourceSelect ? sourceSelect.value : "current";
    let progressData = null;
    let handoffData = null;

    if (source === "current") {
      progressData = JSON.parse(JSON.stringify(state.progress));
      handoffData = JSON.parse(JSON.stringify(state.handoff));
    } else {
      progressData = JSON.parse(JSON.stringify(PRESETS.blank.progress));
      handoffData = JSON.parse(JSON.stringify(PRESETS.blank.handoff));
    }

    const newTpl = {
      name: name,
      description: desc,
      progress: progressData,
      handoff: handoffData,
      createdAt: now,
      updatedAt: now
    };

    const tx = dbInstance.transaction([STORE_TEMPLATES], "readwrite");
    const store = tx.objectStore(STORE_TEMPLATES);
    const addReq = store.add(newTpl);

    addReq.onsuccess = function(e) {
      const newId = e.target.result;
      showToast(`已成功建立自訂範本：「${name}」`);
      closeTemplateFormModal();
      refreshCustomPresetsDropdown();
      renderTemplateManagerList();

      // 自動選取新建立的自訂範本
      state.selectedPreset = "custom_" + newId;
      const selector = document.getElementById("preset-selector");
      if (selector) selector.value = "custom_" + newId;
    };
  }
}

/**
 * 以當前編輯器內容覆寫更新範本 (Update Content)
 */
function overwriteTemplateWithCurrentState(id) {
  if (!confirm("確定要將當前編輯器中的進度看板與代理交接內容，覆寫存入此自訂範本嗎？")) return;
  if (!dbInstance) return;

  const tx = dbInstance.transaction([STORE_TEMPLATES], "readwrite");
  const store = tx.objectStore(STORE_TEMPLATES);
  const getReq = store.get(id);

  getReq.onsuccess = function(e) {
    const tpl = e.target.result;
    if (!tpl) return;

    tpl.progress = JSON.parse(JSON.stringify(state.progress));
    tpl.handoff = JSON.parse(JSON.stringify(state.handoff));
    tpl.updatedAt = new Date().toISOString();

    const putReq = store.put(tpl);
    putReq.onsuccess = function() {
      showToast(`已成功覆寫更新範本：「${tpl.name}」！`);
      renderTemplateManagerList();
    };
  };
}

/**
 * 將系統內建範本另存為自訂複本 (Duplicate)
 */
function duplicateBuiltinAsCustom(builtinKey) {
  if (!PRESETS[builtinKey] || !dbInstance) return;

  const displayName = getPresetDisplayName(builtinKey);
  const copyName = `${displayName} (自訂複本)`;
  const now = new Date().toISOString();

  const newTpl = {
    name: copyName,
    description: `從內建「${displayName}」複製而來的自訂範本，可自由編輯修改與維護。`,
    progress: JSON.parse(JSON.stringify(PRESETS[builtinKey].progress)),
    handoff: JSON.parse(JSON.stringify(PRESETS[builtinKey].handoff)),
    createdAt: now,
    updatedAt: now
  };

  const tx = dbInstance.transaction([STORE_TEMPLATES], "readwrite");
  const store = tx.objectStore(STORE_TEMPLATES);
  const req = store.add(newTpl);

  req.onsuccess = function() {
    showToast(`已建立複本自訂範本：「${copyName}」`);
    refreshCustomPresetsDropdown();
    renderTemplateManagerList();
  };
}

/**
 * 刪除自訂範本 (Delete)
 */
function deleteCustomTemplate(id) {
  if (!confirm("確定要刪除此自訂範本嗎？刪除後無法復原。")) return;
  if (!dbInstance) return;

  const tx = dbInstance.transaction([STORE_TEMPLATES], "readwrite");
  const store = tx.objectStore(STORE_TEMPLATES);
  const req = store.delete(id);

  req.onsuccess = function() {
    showToast("已刪除該自訂範本");

    // 如果目前剛好選到這個被刪除的自訂範本，重置回軟體開發範本
    if (state.selectedPreset === "custom_" + id) {
      applyPreset("software_dev");
      const selector = document.getElementById("preset-selector");
      if (selector) selector.value = "software_dev";
    }

    refreshCustomPresetsDropdown();
    renderTemplateManagerList();
  };
}

/**
 * 範本管理中心 Modal (Manage CRUD Modal)
 */
function openTemplateManagerModal() {
  const modal = document.getElementById("template-manager-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderTemplateManagerList();
}

function closeTemplateManagerModal() {
  const modal = document.getElementById("template-manager-modal");
  if (modal) modal.classList.add("hidden");
}

/**
 * 渲染範本管理清單 (自訂與內建)
 */
function renderTemplateManagerList() {
  const customContainer = document.getElementById("custom-templates-list");
  const builtinContainer = document.getElementById("builtin-templates-list");
  const countBadge = document.getElementById("custom-tpl-count");

  // 1. 渲染自訂範本清單
  getCustomTemplatesFromDB().then((list) => {
    if (countBadge) countBadge.textContent = list.length;

    if (!customContainer) return;

    if (list.length === 0) {
      customContainer.innerHTML = `
        <div class="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-300 dark:border-slate-700/80 rounded-xl space-y-2">
          <p>目前尚無自訂範本</p>
          <button type="button" onclick="openCreateTemplateModal()" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
            點此立即將當前編輯內容另存為新範本
          </button>
        </div>
      `;
    } else {
      customContainer.innerHTML = list.map(tpl => {
        const timeStr = new Date(tpl.updatedAt || tpl.createdAt).toLocaleString();
        const milestoneCount = (tpl.progress && tpl.progress.milestones) ? tpl.progress.milestones.length : 0;
        const nextStepsCount = (tpl.handoff && tpl.handoff.next_steps) ? tpl.handoff.next_steps.length : 0;

        return `
          <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 interactive-card shadow-sm space-y-2.5">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 rounded">自訂範本</span>
                <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100">${escapeHtml(tpl.name)}</h4>
              </div>
              <span class="text-[11px] text-slate-400 dark:text-slate-500 font-mono">${timeStr}</span>
            </div>

            ${tpl.description ? `<p class="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/40 p-2 rounded border border-slate-200 dark:border-slate-800/60">${escapeHtml(tpl.description)}</p>` : ''}

            <div class="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span>進度里程碑: <strong class="text-slate-700 dark:text-slate-200">${milestoneCount}</strong> 個</span>
              <span>•</span>
              <span>交接下一步: <strong class="text-slate-700 dark:text-slate-200">${nextStepsCount}</strong> 項</span>
            </div>

            <div class="flex flex-wrap items-center justify-end gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onclick="applyCustomTemplateFromManager(${tpl.id})"
                class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded transition-colors shadow-sm">
                套用此範本
              </button>
              <button type="button" onclick="overwriteTemplateWithCurrentState(${tpl.id})"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 transition-colors"
                title="以當前編輯器內容覆寫">
                以當前畫面覆寫
              </button>
              <button type="button" onclick="openEditTemplateModal(${tpl.id})"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded border border-slate-300 dark:border-slate-700 transition-colors">
                編輯資訊
              </button>
              <button type="button" onclick="deleteCustomTemplate(${tpl.id})"
                class="px-2 py-1 text-slate-400 hover:text-rose-500 text-xs transition-colors">
                刪除
              </button>
            </div>
          </div>
        `;
      }).join("");
    }
  });

  // 2. 渲染內建範本清單
  if (builtinContainer) {
    const builtins = [
      { key: "software_dev", name: "軟體開發迭代 (Software Dev)", desc: "包含付款 API 規格、金流 SDK 串接、Webhook 簽名與整合壓測工作流。" },
      { key: "data_etl", name: "數據分析與 ETL (Data Analytics)", desc: "包含 S3 湖倉日誌清洗、RFM 特徵工程、特徵庫註冊與 ML 模型交接。" },
      { key: "spec_doc", name: "規格與安全文檔 (Spec & Governance)", desc: "包含 ISO 27001 法規對齊、資安治理章節草擬與法遵跨部門審閱。" },
      { key: "blank", name: "空白模板 (Blank Template)", desc: "乾淨精簡的初始骨架，適合從零開始自定義進度看板與交接工單。" }
    ];

    builtinContainer.innerHTML = builtins.map(b => `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/90 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-1.5 py-0.2 text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 rounded">內建</span>
            <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">${b.name}</span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">${b.desc}</p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button type="button" onclick="applyBuiltinFromManager('${b.key}')"
            class="px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 transition-colors">
            套用
          </button>
          <button type="button" onclick="duplicateBuiltinAsCustom('${b.key}')"
            class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-200 text-xs font-medium rounded border border-amber-200 dark:border-amber-700/50 transition-colors flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            複製為自訂
          </button>
        </div>
      </div>
    `).join("");
  }
}

function applyCustomTemplateFromManager(id) {
  loadCustomTemplate(id);
  closeTemplateManagerModal();
}

function applyBuiltinFromManager(key) {
  applyPreset(key);
  const selector = document.getElementById("preset-selector");
  if (selector) selector.value = key;
  closeTemplateManagerModal();
}

// ==========================================
// --- Database Backup, Restore & Reset ---
// ==========================================

function openDbToolsModal() {
  const modal = document.getElementById("db-tools-modal");
  if (!modal) return;

  // 更新統計數據
  if (dbInstance) {
    getCustomTemplatesFromDB().then(tpls => {
      const tplEl = document.getElementById("db-stat-tpl");
      if (tplEl) tplEl.textContent = tpls.length;
    });

    const tx = dbInstance.transaction([STORE_SNAPSHOTS], "readonly");
    const snapStore = tx.objectStore(STORE_SNAPSHOTS);
    const snapReq = snapStore.count();
    snapReq.onsuccess = (e) => {
      const snapEl = document.getElementById("db-stat-snap");
      if (snapEl) snapEl.textContent = e.target.result || 0;
    };
  }

  const textInput = document.getElementById("import-db-text");
  if (textInput) textInput.value = "";
  const fileInput = document.getElementById("db-backup-file-input");
  if (fileInput) fileInput.value = "";

  modal.classList.remove("hidden");
}

function closeDbToolsModal() {
  const modal = document.getElementById("db-tools-modal");
  if (modal) modal.classList.add("hidden");
}

/**
 * 匯出完整 IndexedDB 備份檔 (JSON)
 */
function exportDatabaseBackup() {
  if (!dbInstance) {
    showToast("IndexedDB 尚未就緒", "error");
    return;
  }

  const tx = dbInstance.transaction([STORE_TEMPLATES, STORE_SNAPSHOTS, STORE_DRAFTS], "readonly");
  const tplStore = tx.objectStore(STORE_TEMPLATES);
  const snapStore = tx.objectStore(STORE_SNAPSHOTS);
  const draftStore = tx.objectStore(STORE_DRAFTS);

  const tplReq = tplStore.getAll();
  const snapReq = snapStore.getAll();
  const draftReq = draftStore.getAll();

  let templates = [];
  let snapshots = [];
  let drafts = [];

  tplReq.onsuccess = (e) => templates = e.target.result || [];
  snapReq.onsuccess = (e) => snapshots = e.target.result || [];
  draftReq.onsuccess = (e) => drafts = e.target.result || [];

  tx.oncomplete = () => {
    const backupData = {
      meta: {
        app: "agent-yaml-maker",
        version: "2.0.0",
        exportedAt: new Date().toISOString(),
        counts: {
          templates: templates.length,
          snapshots: snapshots.length,
          drafts: drafts.length
        }
      },
      templates: templates,
      snapshots: snapshots,
      drafts: drafts
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const timestampStr = new Date().toISOString().slice(0, 19).replace(/[-:]/g, "").replace("T", "-");
    const filename = `agent-yaml-db-backup-${timestampStr}.json`;

    downloadTextFile(filename, jsonStr);
    showToast(`已成功匯出資料庫備份檔 (${templates.length} 範本, ${snapshots.length} 快照)`);
  };

  tx.onerror = (e) => {
    console.error("Export backup failed:", e);
    showToast("資料庫匯出失敗", "error");
  };
}

/**
 * 選擇備份檔案時讀取內容至 Textarea
 */
function handleDbBackupFileSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const textInput = document.getElementById("import-db-text");
    if (textInput) textInput.value = e.target.result;
  };
  reader.readAsText(file);
}

/**
 * 執行資料庫匯入 (支援 merge 合併 或 overwrite 覆寫)
 */
function executeDatabaseImport() {
  if (!dbInstance) {
    showToast("IndexedDB 尚未就緒", "error");
    return;
  }

  const textInput = document.getElementById("import-db-text");
  const rawText = textInput ? textInput.value.trim() : "";

  if (!rawText) {
    showToast("請先選擇或貼上備份 JSON 檔案內容", "error");
    return;
  }

  let backup = null;
  try {
    backup = JSON.parse(rawText);
  } catch (err) {
    showToast("JSON 語法解析失敗，請確認檔案格式", "error");
    return;
  }

  if (!backup || typeof backup !== "object") {
    showToast("無效的資料庫備份格式", "error");
    return;
  }

  const modeRadios = document.getElementsByName("db-import-mode");
  let mode = "merge";
  for (const r of modeRadios) {
    if (r.checked) mode = r.value;
  }

  if (mode === "overwrite") {
    if (!confirm("⚠️ 警告：您選擇了「覆寫還原」，此操作將清空目前資料庫中的所有自訂範本與歷史快照！\n確定要覆寫還原嗎？")) {
      return;
    }
  }

  const tx = dbInstance.transaction([STORE_TEMPLATES, STORE_SNAPSHOTS, STORE_DRAFTS], "readwrite");
  const tplStore = tx.objectStore(STORE_TEMPLATES);
  const snapStore = tx.objectStore(STORE_SNAPSHOTS);
  const draftStore = tx.objectStore(STORE_DRAFTS);

  if (mode === "overwrite") {
    tplStore.clear();
    snapStore.clear();
    draftStore.clear();
  }

  // 1. 匯入範本 (Templates)
  const incomingTemplates = Array.isArray(backup.templates) ? backup.templates : [];
  incomingTemplates.forEach(tpl => {
    const record = {
      name: tpl.name || "匯入範本",
      description: tpl.description || "",
      progress: tpl.progress,
      handoff: tpl.handoff,
      createdAt: tpl.createdAt || new Date().toISOString(),
      updatedAt: tpl.updatedAt || new Date().toISOString()
    };
    if (mode === "overwrite" && tpl.id) {
      record.id = tpl.id;
      tplStore.put(record);
    } else {
      tplStore.add(record);
    }
  });

  // 2. 匯入快照 (Snapshots)
  const incomingSnapshots = Array.isArray(backup.snapshots) ? backup.snapshots : [];
  incomingSnapshots.forEach(snap => {
    const record = {
      name: snap.name || "匯入快照",
      type: snap.type || "progress",
      notes: snap.notes || "",
      data: snap.data,
      yamlPreview: snap.yamlPreview || "",
      createdAt: snap.createdAt || new Date().toISOString()
    };
    if (mode === "overwrite" && snap.id) {
      record.id = snap.id;
      snapStore.put(record);
    } else {
      snapStore.add(record);
    }
  });

  // 3. 匯入草稿 (Drafts)
  if (Array.isArray(backup.drafts) && backup.drafts.length > 0) {
    const draft = backup.drafts.find(d => d.id === "active_session") || backup.drafts[0];
    if (draft) {
      draftStore.put(draft);
      if (draft.progress) state.progress = draft.progress;
      if (draft.handoff) state.handoff = draft.handoff;
      if (draft.selectedPreset) state.selectedPreset = draft.selectedPreset;
    }
  }

  tx.oncomplete = () => {
    showToast(`資料庫還原成功！(匯入 ${incomingTemplates.length} 範本, ${incomingSnapshots.length} 快照)`);
    refreshCustomPresetsDropdown();
    updateSnapshotCountBadge();

    // 更新當前頁面表單與預覽
    if (state.currentTab === "progress") {
      renderProgressForm();
    } else {
      renderHandoffForm();
    }
    updateYamlPreview();

    closeDbToolsModal();
  };

  tx.onerror = (e) => {
    console.error("Import failed:", e);
    showToast("資料庫匯入寫入失敗: " + e.target.error, "error");
  };
}

/**
 * 重設資料庫為預設值 (Factory Reset)
 */
function resetDatabaseToDefaults() {
  const promptConfirm = confirm("⚠️ 危險警告：確定要將 IndexedDB 重設為出廠初始狀態嗎？\n此操作將永久清除所有自訂範本、歷史快照與未保存草稿！");
  if (!promptConfirm) return;

  if (!dbInstance) return;

  const tx = dbInstance.transaction([STORE_TEMPLATES, STORE_SNAPSHOTS, STORE_DRAFTS], "readwrite");
  tx.objectStore(STORE_TEMPLATES).clear();
  tx.objectStore(STORE_SNAPSHOTS).clear();
  tx.objectStore(STORE_DRAFTS).clear();

  tx.oncomplete = () => {
    // 重設記憶體狀態
    state.selectedPreset = "software_dev";
    state.currentTab = "progress";
    state.progress = JSON.parse(JSON.stringify(PRESETS.software_dev.progress));
    state.handoff = JSON.parse(JSON.stringify(PRESETS.software_dev.handoff));

    const selector = document.getElementById("preset-selector");
    if (selector) selector.value = "software_dev";

    renderProgressForm();
    updateYamlPreview();
    refreshCustomPresetsDropdown();
    updateSnapshotCountBadge();

    showToast("資料庫已完成重設為出廠預設值！");
    closeDbToolsModal();
  };

  tx.onerror = (e) => {
    console.error("Reset failed:", e);
    showToast("資料庫重設失敗", "error");
  };
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  updateThemeIcon();
  initIndexedDB()
    .then(() => restoreActiveDraftFromDB())
    .then((hasDraft) => {
      if (hasDraft) {
        if (state.currentTab === "progress") {
          renderProgressForm();
        } else {
          switchTab(state.currentTab);
        }
        showToast("已從 IndexedDB 還原上次編輯中的草稿");
      } else {
        renderProgressForm();
      }
      updateYamlPreview();
      refreshCustomPresetsDropdown();
    })
    .catch((err) => {
      console.warn("IndexedDB initialization error, fallback to memory:", err);
      renderProgressForm();
      updateYamlPreview();
    });
});



/**
 * Dedicated Standalone Offline HTML Generators for Physics Simulations (Grade 10, 11, 12)
 * 100% self-contained single-file HTML, zero internet required, zero external CDNs.
 */

/**
 * Sinh mã HTML hoàn chỉnh cho Thí nghiệm:
 * "Điện tích dịch chuyển trong Điện trường đều & Thế năng điện" (Bài 19 SGK Vật lí 11)
 */
export function generatePotentialEnergyStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mô phỏng Thế năng điện & Công của lực điện trường (Offline Lab - Vật lí 11)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background-color: #080d1a; color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; }
    header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 14px 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo-badge { background: #38bdf8; color: #0f172a; font-weight: 800; font-size: 13px; padding: 4px 10px; border-radius: 8px; }
    .title-h1 { font-size: 16px; font-weight: 700; color: #fff; }
    .title-sub { font-size: 12px; color: #94a3b8; }
    .status-tag { background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; }

    .main-container { display: flex; flex: 1; flex-direction: column; max-width: 1320px; width: 100%; margin: 0 auto; padding: 15px; gap: 15px; }

    /* Navigation Tabs */
    .tabs-nav { display: flex; gap: 8px; flex-wrap: wrap; background: #0f172a; padding: 6px; border-radius: 12px; border: 1px solid #1e293b; }
    .tab-btn { background: transparent; border: none; color: #94a3b8; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
    .tab-btn:hover { color: #fff; background: #1e293b; }
    .tab-btn.active { background: #0284c7; color: #fff; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4); }

    /* Layout Stage */
    .lab-stage { display: grid; grid-template-columns: 1fr; gap: 15px; }
    @media (min-width: 1024px) {
      .lab-stage { grid-template-columns: 1.45fr 1fr; }
    }

    .canvas-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 15px; display: flex; flex-direction: column; gap: 12px; }
    .canvas-layout { display: flex; gap: 12px; align-items: stretch; }
    .canvas-box { flex: 1; background: #030712; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; position: relative; min-height: 440px; display: flex; justify-content: center; align-items: center; }
    canvas { display: block; width: 100%; height: 100%; cursor: crosshair; }

    /* Vertical toolbar */
    .vertical-toolbar { display: flex; flex-direction: column; gap: 8px; background: #1e293b; padding: 8px; border-radius: 12px; border: 1px solid #334155; justify-content: center; width: 56px; }
    .v-btn { background: #0f172a; border: 1px solid #334155; color: #e2e8f0; width: 40px; height: 40px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; transition: all 0.15s; }
    .v-btn:hover { background: #38bdf8; color: #0f172a; font-weight: bold; }
    .v-btn.primary { background: #10b981; color: #fff; border-color: #059669; }

    /* Dashboard card */
    .dashboard-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 15px; display: flex; flex-direction: column; gap: 14px; }
    .card-title { font-size: 12px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: space-between; }

    /* Energy bars */
    .energy-bar-wrap { display: flex; flex-direction: column; gap: 8px; }
    .bar-row { display: flex; flex-direction: column; gap: 3px; }
    .bar-label { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; }
    .bar-track { height: 12px; background: #1e293b; border-radius: 6px; overflow: hidden; position: relative; border: 1px solid #334155; }
    .bar-fill { height: 100%; transition: width 0.05s ease-out; }
    .fill-work { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .fill-potM { background: linear-gradient(90deg, #0284c7, #38bdf8); }
    .fill-potN { background: linear-gradient(90deg, #6366f1, #818cf8); }

    /* Pedagogical Switch */
    .pedagogy-toggle { background: #1e1b4b; border: 1px solid #6366f1; border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; }
    .pedagogy-text { font-size: 11px; }
    .pedagogy-text strong { color: #a5b4fc; display: block; font-size: 12px; margin-bottom: 2px; }
    .switch-ui { position: relative; display: inline-block; width: 44px; height: 24px; }
    .switch-ui input { opacity: 0; width: 0; height: 0; }
    .slider-ui { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .3s; border-radius: 24px; }
    .slider-ui:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
    input:checked + .slider-ui { background-color: #6366f1; }
    input:checked + .slider-ui:before { transform: translateX(20px); }

    /* Controls grid */
    .controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .ctrl-item { background: #030712; padding: 8px 12px; border-radius: 10px; border: 1px solid #1e293b; }
    .ctrl-item label { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; margin-bottom: 4px; font-weight: 500; }
    .ctrl-item input[type="range"] { width: 100%; accent-color: #38bdf8; }

    /* Path selector buttons */
    .path-btn-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
    .path-btn { padding: 6px 8px; font-size: 11px; font-weight: 600; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #94a3b8; cursor: pointer; text-align: left; }
    .path-btn.active { background: #0284c7; color: white; border-color: #0284c7; }

    /* Calculation challenge panel */
    .calc-box { background: #030712; border: 1px solid #334155; border-radius: 12px; padding: 12px; font-size: 11px; }
    .calc-row { display: flex; gap: 8px; margin-top: 6px; }
    .calc-input { flex: 1; background: #1e293b; border: 1px solid #475569; color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 12px; }
    .calc-btn { background: #6366f1; border: none; color: white; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; }

    /* Tables */
    .table-box { display: none; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; padding: 20px; }
    .table-box.active { display: block; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; text-align: center; }
    th, td { border: 1px solid #334155; padding: 6px 8px; }
    th { background: #1e293b; color: #38bdf8; font-weight: 600; }
    tr:nth-child(even) { background: #090d16; }

    footer { text-align: center; font-size: 11px; color: #64748b; padding: 15px; border-top: 1px solid #1e293b; margin-top: 20px; }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <span class="logo-badge">VẬT LÍ 11</span>
      <div>
        <div class="title-h1">Bài 19: Thế năng điện & Công của lực điện trong Điện trường đều</div>
        <div class="title-sub">Bản chạy Độc lập (Offline Standalone) • Chuẩn Công văn 5512 & GDPT 2018</div>
      </div>
    </div>
    <div class="status-tag">
      <span>●</span> CHẠY OFFLINE 100% KHÔNG CẦN INTERNET
    </div>
  </header>

  <div class="main-container">
    <!-- Tabs Nav -->
    <div class="tabs-nav">
      <button class="tab-btn active" onclick="switchTab('sim-tab')">⚡ Thí nghiệm Điện trường & Công A = q·E·d</button>
      <button class="tab-btn" onclick="switchTab('table-tab')">📝 Bảng số liệu thực nghiệm & Xuất CSV</button>
      <button class="tab-btn" onclick="switchTab('quiz-tab')">🎯 Luyện tập trắc nghiệm năng lực (Bài 19)</button>
    </div>

    <!-- TAB 1: MAIN SIMULATION -->
    <div id="sim-tab" class="lab-stage">
      <div class="canvas-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <span style="font-size:12px; font-weight:bold; color:#cbd5e1;">🎯 Kéo thả điểm M và N hoặc chọn đường đi mẫu bên phải</span>
          <span id="coord-readout" style="font-size:11px; color:#34d399; font-family:monospace; font-weight:bold;">Hình chiếu d = +5.00 cm | U = +125.0 V</span>
        </div>

        <!-- Top Trajectory Switcher (Đường chéo MN vs Đường gấp khúc MPN - M, N cố định) -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; background:#030712; border:1px solid #1e293b; padding:8px 12px; border-radius:10px;">
          <div style="font-size:12px; font-weight:bold; color:#fbbf24; display:flex; align-items:center; gap:6px;">
            <span>📐 Quỹ đạo dịch chuyển:</span>
            <span style="font-size:11px; color:#94a3b8; font-weight:normal;">(Điểm M, N giữ cố định cùng vị trí)</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button id="top-btn-inclined" onclick="setPresetPath('inclined')" style="padding:6px 12px; border-radius:8px; font-size:11px; font-weight:bold; border:1px solid #f59e0b; background:#f59e0b; color:#0f172a; cursor:pointer; transition:all 0.15s;">
              ⚡ Quỹ đạo chéo thẳng MN
            </button>
            <button id="top-btn-zigzag" onclick="setPresetPath('zigzag')" style="padding:6px 12px; border-radius:8px; font-size:11px; font-weight:bold; border:1px solid #334155; background:#0f172a; color:#94a3b8; cursor:pointer; transition:all 0.15s;">
              📐 Quỹ đạo gấp khúc MPN
            </button>
          </div>
        </div>

        <div class="canvas-layout">
          <div class="canvas-box">
            <canvas id="electricCanvas" width="600" height="460"></canvas>
          </div>

          <!-- Vertical Toolbar Alongside Canvas -->
          <div class="vertical-toolbar">
            <button id="btnPlay" class="v-btn primary" title="Chạy / Tạm dừng hạt q" onclick="togglePlay()">
              <span id="playIcon">▶</span>
              <span id="playText" style="font-size:9px;">Chạy</span>
            </button>
            <button class="v-btn" title="Đặt lại vị trí điểm M" onclick="resetCharge()">
              <span>↺</span>
              <span style="font-size:9px;">Lại</span>
            </button>
            <button class="v-btn" title="Ghi 1 dòng dữ liệu vào bảng" onclick="recordDataRow()">
              <span>💾</span>
              <span style="font-size:9px;">Ghi</span>
            </button>
            <div style="font-size:9px; text-align:center; color:#94a3b8; margin-top:4px;">Tốc độ</div>
            <button class="v-btn" style="height:26px;" onclick="setSpeed(0.1)">0.1x</button>
            <button class="v-btn" style="height:26px; font-weight:bold; color:#38bdf8;" onclick="setSpeed(0.2)">0.2x</button>
            <button class="v-btn" style="height:26px;" onclick="setSpeed(0.5)">0.5x</button>
          </div>
        </div>

        <!-- Path presets -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:11px; color:#94a3b8; font-weight:600;">DẠNG ĐƯỜNG DỊCH CHUYỂN (KHẢO SÁT TÍNH CHẤT TRƯỜNG THẾ):</span>
          <div class="path-btn-grid">
            <button id="p-along" class="path-btn" onclick="setPresetPath('along')">1. Cùng chiều E (α = 0°, d = s &gt; 0)</button>
            <button id="p-opposite" class="path-btn" onclick="setPresetPath('opposite')">2. Ngược chiều E (α = 180°, d = -s &lt; 0)</button>
            <button id="p-inclined" class="path-btn active" onclick="setPresetPath('inclined')" style="border-color:#fbbf24; font-weight:bold;">⚡ 3. Quỹ đạo chéo thẳng MN (Đường thẳng trực tiếp)</button>
            <button id="p-perp" class="path-btn" onclick="setPresetPath('perp')">4. Vuông góc E (α = 90°, d = 0, A = 0)</button>
            <button id="p-zigzag" class="path-btn" onclick="setPresetPath('zigzag')" style="grid-column: span 2; border-color:#38bdf8; font-weight:bold;">📐 5. Quỹ đạo gấp khúc MPN (M → P → N: M và N cố định)</button>
          </div>
        </div>
      </div>

      <!-- Right Dashboard Card -->
      <div class="dashboard-card">
        <!-- Pedagogical Switch -->
        <div class="pedagogy-toggle" style="background:#1e1b4b; border:1px solid #6366f1; border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
          <div class="pedagogy-text">
            <strong style="color:#a5b4fc; font-size:12px;">CÔNG TẮC SƯ PHẠM: ẨN / HIỆN TỪNG SỐ LIỆU</strong>
            <span style="color:#cbd5e1; font-size:10.5px;">Bấm trực tiếp vào từng số liệu để ẩn/hiện hoặc dùng nút bên phải</span>
          </div>
          <button id="btnToggleAll" onclick="toggleAllItems()" style="padding:6px 12px; border-radius:8px; font-size:11px; font-weight:bold; background:#4f46e5; border:1px solid #818cf8; color:#fff; cursor:pointer; transition:all 0.2s;">
            Ẩn tất cả 🔒
          </button>
        </div>

        <!-- Live Metrics & Energy Card with individual toggles -->
        <div class="energy-bar-wrap">
          <div class="card-title">
            <span>BẢNG NĂNG LƯỢNG & CÔNG (BẤM VÀO SỐ ĐỂ ẨN/HIỆN RIÊNG)</span>
            <span id="energy-numeric-state" style="font-size:10px; color:#10b981; font-weight:bold;">Tùy chỉnh riêng từng mục</span>
          </div>

          <!-- 1. Work A -->
          <div class="bar-row">
            <div class="bar-label">
              <span style="color:#fbbf24;">1. Công lực điện: A = q·E·d</span>
              <button id="btn-toggle-work" onclick="toggleItem('work')" title="Bấm để ẩn hoặc hiện riêng Công A" style="background:rgba(251,191,36,0.1); border:1px dashed #fbbf24; color:#fbbf24; cursor:pointer; font-family:monospace; font-weight:bold; font-size:11px; padding:3px 8px; border-radius:6px; display:flex; align-items:center; gap:5px;">
                <span id="val-work">+0.250 mJ</span>
                <span id="icon-work">👁️</span>
              </button>
            </div>
            <div class="bar-track">
              <div id="bar-work" class="bar-fill fill-work" style="width: 50%;"></div>
            </div>
          </div>

          <!-- 2. W_tM -->
          <div class="bar-row">
            <div class="bar-label">
              <span style="color:#38bdf8;">2. Thế năng tại đầu M: W_tM = q·E·d_M</span>
              <button id="btn-toggle-potM" onclick="toggleItem('potM')" title="Bấm để ẩn hoặc hiện riêng W_tM" style="background:rgba(56,189,248,0.1); border:1px dashed #38bdf8; color:#38bdf8; cursor:pointer; font-family:monospace; font-weight:bold; font-size:11px; padding:3px 8px; border-radius:6px; display:flex; align-items:center; gap:5px;">
                <span id="val-potM">+0.389 mJ</span>
                <span id="icon-potM">👁️</span>
              </button>
            </div>
            <div class="bar-track">
              <div id="bar-potM" class="bar-fill fill-potM" style="width: 78%;"></div>
            </div>
          </div>

          <!-- 3. W_tN -->
          <div class="bar-row">
            <div class="bar-label">
              <span style="color:#818cf8;">3. Thế năng tại cuối N: W_tN = q·E·d_N</span>
              <button id="btn-toggle-potN" onclick="toggleItem('potN')" title="Bấm để ẩn hoặc hiện riêng W_tN" style="background:rgba(129,140,248,0.1); border:1px dashed #818cf8; color:#818cf8; cursor:pointer; font-family:monospace; font-weight:bold; font-size:11px; padding:3px 8px; border-radius:6px; display:flex; align-items:center; gap:5px;">
                <span id="val-potN">+0.139 mJ</span>
                <span id="icon-potN">👁️</span>
              </button>
            </div>
            <div class="bar-track">
              <div id="bar-potN" class="bar-fill fill-potN" style="width: 28%;"></div>
            </div>
          </div>

          <!-- 4. Voltage U -->
          <div style="background:#030712; padding:8px 12px; border-radius:8px; border:1px solid #1e293b; font-size:11px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:#38bdf8; font-weight:600;">4. Hiệu điện thế: U = V_M - V_N = E·d</span>
            <button id="btn-toggle-voltage" onclick="toggleItem('voltage')" title="Bấm để ẩn hoặc hiện riêng Hiệu điện thế U" style="background:rgba(56,189,248,0.1); border:1px dashed #38bdf8; color:#38bdf8; cursor:pointer; font-family:monospace; font-weight:bold; font-size:11px; padding:3px 8px; border-radius:6px; display:flex; align-items:center; gap:5px;">
              <span id="val-voltage">+125.0 V</span>
              <span id="icon-voltage">👁️</span>
            </button>
          </div>

          <!-- 5. Delta Wt -->
          <div style="background:#030712; padding:8px 12px; border-radius:8px; border:1px solid #1e293b; font-size:11px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:#34d399; font-weight:bold;">5. Độ giảm thế năng: ΔW_t = W_tM - W_tN</span>
            <button id="btn-toggle-deltaWt" onclick="toggleItem('deltaWt')" title="Bấm để ẩn hoặc hiện riêng Độ giảm thế năng ΔWt" style="background:rgba(52,211,153,0.1); border:1px dashed #10b981; color:#34d399; cursor:pointer; font-family:monospace; font-weight:bold; font-size:11px; padding:3px 8px; border-radius:6px; display:flex; align-items:center; gap:5px;">
              <span id="val-deltaWt">+0.250 mJ (= A)</span>
              <span id="icon-deltaWt">👁️</span>
            </button>
          </div>

          <!-- Theorem Validation Badge -->
          <div style="background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:8px; padding:6px 12px; font-size:11px; color:#34d399; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
            <span>✓ Định lí thế năng: A_MN = W_tM - W_tN</span>
            <span style="background:#10b981; color:#022c22; font-size:9px; padding:2px 6px; border-radius:4px;">KHỚP TUYỆT ĐỐI</span>
          </div>
        </div>

        <!-- Controls grid -->
        <div class="controls-grid">
          <div class="ctrl-item">
            <label><span>Điện lượng q:</span><span id="label-q">+2.0 μC</span></label>
            <input type="range" id="inputQ" min="-5" max="5" step="0.5" value="2" oninput="updateParams()">
          </div>
          <div class="ctrl-item">
            <label><span>Điện trường E:</span><span id="label-E">2500 V/m</span></label>
            <input type="range" id="inputE" min="500" max="5000" step="100" value="2500" oninput="updateParams()">
          </div>
          <div class="ctrl-item" style="grid-column: span 2; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.35); padding: 8px; border-radius: 8px;">
            <label style="display:flex; justify-content:space-between; color:#34d399; font-weight:bold;">
              <span>📏 Hình chiếu d dọc theo đường sức E:</span>
              <span id="label-d" style="font-family:monospace; font-size:12px;">+5.0 cm</span>
            </label>
            <input type="range" id="inputD" min="-6.0" max="7.0" step="0.5" value="5.0" oninput="updateDDirect(this.value)">
            <div style="display:flex; justify-content:space-between; font-size:9px; color:#94a3b8; margin-top:2px;">
              <span>-6 cm (Ngược E: A &lt; 0)</span>
              <span>0 cm (Vuông góc E: A = 0)</span>
              <span>+7 cm (Cùng E: A &gt; 0)</span>
            </div>
            <div style="font-size:10px; color:#cbd5e1; margin-top:4px; border-top:1px dashed #334155; padding-top:4px; display:flex; justify-content:space-between;">
              <span>Hệ số kiểm nghiệm:</span>
              <span style="color:#fbbf24; font-weight:bold; font-family:monospace;">A / d = q·E = <span id="label-ratio-qd">0.050</span> mJ/cm (Hằng số!)</span>
            </div>
          </div>
        </div>

        <!-- Nút kiểm nghiệm thực nghiệm sự phụ thuộc A vào d -->
        <div style="margin-top:2px;">
          <button class="calc-btn" style="background:linear-gradient(135deg, #059669, #0284c7); width:100%; padding:9px 12px; font-weight:bold; font-size:11px; display:flex; justify-content:space-between; align-items:center;" onclick="runExperimentVaryD()">
            <span>🔬 NẠP CHUỖI KIỂM NGHIỆM: CÔNG A PHỤ THUỘC VÀO HÌNH CHIẾU d</span>
            <span style="background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px; font-size:10px;">A ∝ d</span>
          </button>
        </div>

        <!-- Challenge box -->
        <div class="calc-box">
          <strong style="color:#a5b4fc;">✍️ Học sinh tự tính toán & Kiểm tra kết quả:</strong>
          <p style="color:#94a3b8; margin:4px 0;">Tính công của lực điện A = q·E·d = ? (milliJoule - mJ)</p>
          <div class="calc-row">
            <input type="number" id="userCalcInput" class="calc-input" placeholder="Nhập kết quả A (mJ)..." step="0.001">
            <button class="calc-btn" onclick="checkUserCalc()">Kiểm tra</button>
          </div>
          <div id="calcFeedback" style="margin-top:6px; font-weight:600;"></div>
        </div>
      </div>
    </div>

    <!-- TAB 2: DATA TABLE -->
    <div id="table-tab" class="table-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <h3 style="color:#38bdf8;">📝 Bảng số liệu thực nghiệm (Kiểm chứng A = q·E·d = W_tM - W_tN)</h3>
        <div style="display:flex; gap:8px;">
          <button class="calc-btn" style="background:#10b981;" onclick="recordDataRow()">+ Ghi dòng hiện tại</button>
          <button class="calc-btn" style="background:#0284c7;" onclick="exportTableToCSV()">📥 Xuất file CSV cho Excel</button>
          <button class="calc-btn" style="background:#ef4444;" onclick="clearTable()">Xóa bảng</button>
        </div>
      </div>
      <div style="overflow-x:auto;">
        <table id="dataTable">
          <thead>
            <tr>
              <th>Lần đo</th>
              <th>q (μC)</th>
              <th>E (V/m)</th>
              <th>s (cm)</th>
              <th>Góc α (°)</th>
              <th>d (cm)</th>
              <th>W_tM (mJ)</th>
              <th>W_tN (mJ)</th>
              <th>ΔW_t (mJ)</th>
              <th>Công A (mJ)</th>
              <th>Nhận xét</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: QUIZ -->
    <div id="quiz-tab" class="table-box">
      <h3 style="color:#38bdf8; margin-bottom:12px;">🎯 Câu hỏi Trắc nghiệm Năng lực Khoa học (Bài 19: Thế năng điện)</h3>
      <div id="quizContainer" style="display:flex; flex-direction:column; gap:14px;"></div>
    </div>
  </div>

  <footer>
    Mô phỏng Vật lí Offline 100% • Bài 19: Thế năng điện • Bộ môn Vật lí THPT • Chuẩn CV 5512 & GDPT 2018
  </footer>

  <script>
    // Physics variables
    let q = 2.0; // microCoulombs (10^-6 C)
    let E = 2500; // V/m
    let s_cm = 7.0; // cm
    let alpha_deg = 45; // deg
    let preset = 'inclined';
    let showValues = true;
    let isRunning = false;
    let simSpeed = 0.2;
    let progress = 0; // 0 to 1

    // Canvas & Geometry
    const canvas = document.getElementById('electricCanvas');
    const ctx = canvas.getContext('2d');
    const plateTopY = 50;
    const plateBottomY = 410;
    const plateDistanceM = 0.10; // 10 cm between plates
    const pixelsPerMeter = (plateBottomY - plateTopY) / plateDistanceM; // 3600 px/m -> 36 px/cm

    let isDraggingM = false;
    let isDraggingN = false;

    // Default coordinates for M and N (Shared endpoints so MN and MPN have identical A)
    let posM = { x: 180, y: 130 };
    let posN = { x: 360, y: 310 };
    let posP = { x: 180, y: 310 }; // Intermediate point P: directly below M along E (same y as N)

    function calculateGeometry() {
      // Ensure P tracks M and N accurately
      posP.x = posM.x;
      posP.y = posN.y;

      const dx_cm = (posN.x - posM.x) / 36;
      const dy_cm = (posN.y - posM.y) / 36; // in vertical field, dy is projection d along E!
      const actual_s_cm = Math.hypot(dx_cm, dy_cm);
      const d_cm = dy_cm; // E points downwards from top (+) to bottom (-)
      const calculatedAlphaDeg = Math.round(Math.abs(Math.atan2(dx_cm, dy_cm)) * 180 / Math.PI);

      // Distances from negative plate (Mốc W_t = 0 tại bản âm)
      const dM_cm = (plateBottomY - posM.y) / 36;
      const dN_cm = (plateBottomY - posN.y) / 36;

      // Convert units accurately:
      // q is in μC -> multiply by 1e-6 to get Coulombs
      const q_C = q * 1e-6;
      const d_m = d_cm * 0.01;
      const dM_m = dM_cm * 0.01;
      const dN_m = dN_cm * 0.01;

      // Work along direct path MN: A = q * E * d (Joules -> milliJoules: mJ = J * 1000)
      const A_Joules = q_C * E * d_m;
      const A_mJ = A_Joules * 1000;

      const WM_Joules = q_C * E * dM_m;
      const WM_mJ = WM_Joules * 1000;

      const WN_Joules = q_C * E * dN_m;
      const WN_mJ = WN_Joules * 1000;

      const deltaWt_mJ = WM_mJ - WN_mJ;

      // Voltage drop U = VM - VN = E * d
      const U_V = E * d_m;

      // Segment work for broken path M -> P -> N:
      const A_MP_mJ = A_mJ;
      const A_PN_mJ = 0;
      const A_MPN_mJ = A_MP_mJ + A_PN_mJ; // Identical to A_mJ!

      return {
        s_cm: actual_s_cm,
        d_cm: d_cm,
        alpha_deg: calculatedAlphaDeg,
        dM_cm: dM_cm,
        dN_cm: dN_cm,
        A_mJ: A_mJ,
        A_MP_mJ: A_MP_mJ,
        A_PN_mJ: A_PN_mJ,
        A_MPN_mJ: A_MPN_mJ,
        WM_mJ: WM_mJ,
        WN_mJ: WN_mJ,
        deltaWt_mJ: deltaWt_mJ,
        U_V: U_V
      };
    }

    function updateParams() {
      q = parseFloat(document.getElementById('inputQ').value);
      E = parseFloat(document.getElementById('inputE').value);

      document.getElementById('label-q').innerText = (q > 0 ? '+' : '') + q.toFixed(1) + ' μC';
      document.getElementById('label-E').innerText = E.toFixed(0) + ' V/m';

      const curD_cm = (posN.y - posM.y) / 36;
      const inputD = document.getElementById('inputD');
      if (inputD) inputD.value = curD_cm.toFixed(1);
      const labelD = document.getElementById('label-d');
      if (labelD) labelD.innerText = (curD_cm >= 0 ? '+' : '') + curD_cm.toFixed(1) + ' cm';
      const labelRatio = document.getElementById('label-ratio-qd');
      if (labelRatio) labelRatio.innerText = ((q * 1e-6) * E * 0.01 * 1000).toFixed(3);
    }

    function updateDDirect(val) {
      const newD_cm = parseFloat(val);
      const dy = newD_cm * 36;
      posN.y = posM.y + dy;
      posP.x = posM.x;
      posP.y = posN.y;
      const dx = posN.x - posM.x;
      s_cm = Math.hypot(dx / 36, newD_cm);
      alpha_deg = Math.round(Math.abs(Math.atan2(dx / 36, newD_cm)) * 180 / Math.PI);

      const labelD = document.getElementById('label-d');
      if (labelD) labelD.innerText = (newD_cm >= 0 ? '+' : '') + newD_cm.toFixed(1) + ' cm';
      resetCharge();
    }

    function runExperimentVaryD() {
      const testD = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 0.0, -2.0];
      clearTable();
      testD.forEach(function(dVal) {
        const d_m = dVal * 0.01;
        const A_mJ = (q * 1e-6) * E * d_m * 1000;
        const dM_cm = (plateBottomY - posM.y) / 36;
        const dN_cm = dM_cm - dVal;
        const WM_mJ = (q * 1e-6) * E * (dM_cm * 0.01) * 1000;
        const WN_mJ = (q * 1e-6) * E * (dN_cm * 0.01) * 1000;
        rowCount++;
        const ratio = dVal !== 0 ? (A_mJ / dVal).toFixed(3) : 'q·E = 0.050';
        const row = {
          id: rowCount,
          q: (q > 0 ? '+' : '') + q.toFixed(1),
          E: E,
          s: Math.abs(dVal).toFixed(1),
          alpha: dVal >= 0 ? 0 : 180,
          d: (dVal >= 0 ? '+' : '') + dVal.toFixed(2),
          WM: (WM_mJ >= 0 ? '+' : '') + WM_mJ.toFixed(3),
          WN: (WN_mJ >= 0 ? '+' : '') + WN_mJ.toFixed(3),
          deltaWt: (A_mJ >= 0 ? '+' : '') + A_mJ.toFixed(3),
          A: (A_mJ >= 0 ? '+' : '') + A_mJ.toFixed(3),
          note: dVal === 0 ? 'd = 0 ⇒ A = 0 (Vuông góc đường sức)' : ('A/d = ' + ratio + ' mJ/cm = const ⇒ A tỉ lệ thuận với d!')
        };
        tableData.push(row);
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + row.id + '</td><td>' + row.q + '</td><td>' + row.E + '</td><td>' + row.s + '</td><td>' + row.alpha + '°</td><td style="color:#34d399; font-weight:bold;">' + row.d + '</td><td style="color:#38bdf8;">' + row.WM + '</td><td style="color:#818cf8;">' + row.WN + '</td><td style="color:#34d399;">' + row.deltaWt + '</td><td style="color:#fbbf24; font-weight:bold;">' + row.A + '</td><td style="font-size:10px; color:#cbd5e1;">' + row.note + '</td>';
        document.getElementById('tableBody').appendChild(tr);
      });
      // Switch tab to table
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      const tbBtn = document.querySelectorAll('.tab-btn')[1];
      if (tbBtn) tbBtn.classList.add('active');
      document.getElementById('sim-tab').style.display = 'none';
      document.getElementById('table-tab').classList.add('active');
      document.getElementById('quiz-tab').classList.remove('active');
    }

    function setPresetPath(type) {
      preset = type;
      document.querySelectorAll('.path-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = document.getElementById('p-' + type);
      if (activeBtn) activeBtn.classList.add('active');

      const topInc = document.getElementById('top-btn-inclined');
      const topZig = document.getElementById('top-btn-zigzag');
      if (topInc && topZig) {
        if (type === 'inclined') {
          topInc.style.background = '#f59e0b';
          topInc.style.borderColor = '#f59e0b';
          topInc.style.color = '#0f172a';
          topZig.style.background = '#0f172a';
          topZig.style.borderColor = '#334155';
          topZig.style.color = '#94a3b8';
        } else if (type === 'zigzag') {
          topZig.style.background = '#0284c7';
          topZig.style.borderColor = '#38bdf8';
          topZig.style.color = '#ffffff';
          topInc.style.background = '#0f172a';
          topInc.style.borderColor = '#334155';
          topInc.style.color = '#94a3b8';
        } else {
          topInc.style.background = '#0f172a';
          topInc.style.borderColor = '#334155';
          topInc.style.color = '#94a3b8';
          topZig.style.background = '#0f172a';
          topZig.style.borderColor = '#334155';
          topZig.style.color = '#94a3b8';
        }
      }

      if (type === 'along') {
        posM = { x: 220, y: 120 };
        alpha_deg = 0;
        s_cm = 6.0;
        posN = { x: 220, y: 120 + 6.0 * 36 };
      } else if (type === 'opposite') {
        alpha_deg = 180;
        s_cm = 6.0;
        posM = { x: 220, y: 340 };
        posN = { x: 220, y: 340 - 6.0 * 36 };
      } else if (type === 'inclined') {
        // Direct diagonal path MN (Shared endpoints with MPN)
        posM = { x: 180, y: 130 };
        alpha_deg = 45;
        s_cm = 7.07;
        posN = { x: 360, y: 310 }; // dy = 180px = 5.0cm, dx = 180px = 5.0cm
      } else if (type === 'perp') {
        posM = { x: 180, y: 220 };
        alpha_deg = 90;
        s_cm = 6.0;
        posN = { x: 180 + 6.0 * 36, y: 220 };
      } else if (type === 'zigzag') {
        // Broken path M -> P -> N: EXACT SAME M AND N AS INCLINED PATH!
        posM = { x: 180, y: 130 };
        posN = { x: 360, y: 310 };
        alpha_deg = 45;
        s_cm = 7.07;
      }
      posP = { x: posM.x, y: posN.y };
      const curD = (posN.y - posM.y) / 36;
      const inputD = document.getElementById('inputD');
      if (inputD) inputD.value = curD.toFixed(1);
      const labelD = document.getElementById('label-d');
      if (labelD) labelD.innerText = (curD >= 0 ? '+' : '') + curD.toFixed(1) + ' cm';
      resetCharge();
    }

    // Animation loop
    let lastTime = 0;
    function animLoop(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.04);
      lastTime = timestamp;

      if (isRunning) {
        progress += dt * simSpeed;
        if (progress >= 1.0) {
          progress = 1.0;
          isRunning = false;
          document.getElementById('playText').innerText = 'Chạy';
          document.getElementById('playIcon').innerText = '▶';
        }
      }

      drawScene();
      updateDashboard();
      requestAnimationFrame(animLoop);
    }
    requestAnimationFrame(animLoop);

    function drawScene() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // 1. Draw Plates
      // Top Plate (+): Rose/Pink/Salmon (Chuẩn hình SGK Vật lí 11)
      ctx.fillStyle = '#be123c';
      ctx.fillRect(40, plateTopY - 14, W - 80, 14);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, plateTopY - 14, W - 80, 14);
      ctx.fillStyle = '#ffe4e6';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('+ + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +', 55, plateTopY - 3);

      // Bottom Plate (-): Sky/Blue (Mốc W_t = 0)
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(40, plateBottomY, W - 80, 14);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, plateBottomY, W - 80, 14);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillText('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', 55, plateBottomY + 11);

      ctx.fillStyle = '#fca5a5';
      ctx.font = '10px sans-serif';
      ctx.fillText('Bản dương (+) • V = U = ' + Math.round(E * plateDistanceM) + ' V', 50, plateTopY - 18);
      ctx.fillStyle = '#7dd3fc';
      ctx.fillText('Bản âm (-) • Chọn mốc thế năng W_t = 0 (V = 0)', 50, plateBottomY + 26);

      // 2. Electric Field Lines (Vertical downwards)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.2;
      const numLines = 9;
      const lineStep = (W - 140) / (numLines - 1);
      for (let i = 0; i < numLines; i++) {
        const lx = 70 + i * lineStep;
        ctx.beginPath();
        ctx.moveTo(lx, plateTopY);
        ctx.lineTo(lx, plateBottomY);
        ctx.stroke();

        // Arrowhead in middle
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.moveTo(lx, 230);
        ctx.lineTo(lx - 4, 220);
        ctx.lineTo(lx + 4, 220);
        ctx.closePath();
        ctx.fill();
      }

      // E vector legend
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('→', W - 60, 220);
      ctx.fillText('E = ' + E + ' V/m', W - 110, 235);

      // 3. Equipotential Lines (horizontal dashed)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.setLineDash([5, 5]);
      for (let y = plateTopY + 60; y < plateBottomY; y += 60) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(W - 40, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 4. Trajectory Paths (SGK Vật lí 11 Bài 19)
      // Direct diagonal path MN (always visible as dashed guideline)
      ctx.strokeStyle = (preset === 'inclined' ? '#fbbf24' : 'rgba(251, 191, 36, 0.45)');
      ctx.lineWidth = (preset === 'inclined' ? 2.5 : 1.5);
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(posM.x, posM.y);
      ctx.lineTo(posN.x, posN.y);
      ctx.stroke();

      // Broken path M -> P -> N (Segment 1 along E, Segment 2 perp to E)
      ctx.strokeStyle = (preset === 'zigzag' ? '#38bdf8' : 'rgba(56, 189, 248, 0.45)');
      ctx.lineWidth = (preset === 'zigzag' ? 2.5 : 1.5);
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(posM.x, posM.y);
      ctx.lineTo(posP.x, posP.y);
      ctx.lineTo(posN.x, posN.y);
      ctx.stroke();

      // Point P marker (Directly under M along E)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(posP.x, posP.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('P', posP.x - 16, posP.y + 12);

      // 5. Projection line d (along E vertical)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      const projX = Math.min(posM.x, posN.x, posP.x) - 30;
      ctx.beginPath();
      ctx.moveTo(projX, posM.y);
      ctx.lineTo(projX, posN.y);
      ctx.stroke();

      // Projection dashed connectors
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(projX, posM.y);
      ctx.lineTo(posM.x, posM.y);
      ctx.moveTo(projX, posN.y);
      ctx.lineTo(posN.x, posN.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const geom = calculateGeometry();
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('d = ' + (geom.d_cm >= 0 ? '+' : '') + geom.d_cm.toFixed(2) + ' cm', projX - 65, (posM.y + posN.y) / 2);

      // Points M and N markers
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(posM.x, posM.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('M', posM.x - 18, posM.y + 4);

      ctx.fillStyle = '#818cf8';
      ctx.beginPath();
      ctx.arc(posN.x, posN.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillText('N', posN.x + 10, posN.y + 4);

      // 6. Current particle position along path
      let curX, curY;
      if (preset === 'zigzag') {
        if (progress < 0.5) {
          const t = progress / 0.5;
          curX = posM.x + (posP.x - posM.x) * t;
          curY = posM.y + (posP.y - posM.y) * t;
        } else {
          const t = (progress - 0.5) / 0.5;
          curX = posP.x + (posN.x - posP.x) * t;
          curY = posP.y + (posN.y - posP.y) * t;
        }
      } else {
        curX = posM.x + (posN.x - posM.x) * progress;
        curY = posM.y + (posN.y - posM.y) * progress;
      }

      // Draw charge particle
      const isPos = q > 0;
      const chargeR = 12;
      const grad = ctx.createRadialGradient(curX - 3, curY - 3, 2, curX, curY, chargeR);
      if (isPos) {
        grad.addColorStop(0, '#fca5a5');
        grad.addColorStop(1, '#ef4444');
      } else {
        grad.addColorStop(0, '#93c5fd');
        grad.addColorStop(1, '#2563eb');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(curX, curY, chargeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isPos ? '+q' : '-q', curX, curY);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      // Electric force vector F = q*E
      const forceMag = Math.min(Math.abs(q) * 12, 50);
      const forceDir = isPos ? 1 : -1; // +q along E (down), -q opposite E (up)
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(curX, curY + forceDir * forceMag);
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('F', curX + 14, curY + forceDir * forceMag / 2);
    }

    // Individual visibility states for energy parameters
    const visibleItems = {
      work: true,
      potM: true,
      potN: true,
      voltage: true,
      deltaWt: true
    };

    function toggleItem(key) {
      if (visibleItems.hasOwnProperty(key)) {
        visibleItems[key] = !visibleItems[key];
        updateDashboard();
        updateMasterButtonState();
      }
    }

    function toggleAllItems() {
      const anyHidden = Object.values(visibleItems).some(function(v) { return !v; });
      const targetState = anyHidden;
      for (const k in visibleItems) {
        visibleItems[k] = targetState;
      }
      updateDashboard();
      updateMasterButtonState();
    }

    function updateMasterButtonState() {
      const allVisible = Object.values(visibleItems).every(function(v) { return v; });
      const btn = document.getElementById('btnToggleAll');
      if (btn) {
        btn.innerText = allVisible ? 'Ẩn tất cả 🔒' : 'Hiện tất cả 👁️';
        btn.style.background = allVisible ? '#4f46e5' : '#059669';
      }
      const st = document.getElementById('energy-numeric-state');
      if (st) {
        const anyHidden = Object.values(visibleItems).some(function(v) { return !v; });
        st.innerText = anyHidden ? 'Đang ẩn một số mục' : 'Đang hiện toàn bộ số liệu';
        st.style.color = anyHidden ? '#f59e0b' : '#10b981';
      }
    }

    function updateDashboard() {
      const geom = calculateGeometry();

      const coordEl = document.getElementById('coord-readout');
      if (coordEl) {
        coordEl.innerText = 'Hình chiếu d = ' + (geom.d_cm >= 0 ? '+' : '') + geom.d_cm.toFixed(2) + ' cm | U = ' + (geom.U_V >= 0 ? '+' : '') + geom.U_V.toFixed(1) + ' V';
      }

      const maxScale = Math.max(Math.abs(geom.WM_mJ), Math.abs(geom.A_mJ), 0.5) * 1.2;

      // 1. Work A
      const elWork = document.getElementById('val-work');
      const iconWork = document.getElementById('icon-work');
      const barWork = document.getElementById('bar-work');
      if (visibleItems.work) {
        elWork.innerText = (geom.A_mJ >= 0 ? '+' : '') + geom.A_mJ.toFixed(3) + ' mJ';
        elWork.style.color = '#fbbf24';
        if (iconWork) iconWork.innerText = '👁️';
        if (barWork) barWork.style.width = Math.min((Math.abs(geom.A_mJ) / maxScale) * 100, 100) + '%';
      } else {
        elWork.innerText = '🔒 [Ẩn - Bấm xem]';
        elWork.style.color = '#f59e0b';
        if (iconWork) iconWork.innerText = '🔒';
        if (barWork) barWork.style.width = '0%';
      }

      // 2. W_tM
      const elPotM = document.getElementById('val-potM');
      const iconPotM = document.getElementById('icon-potM');
      const barPotM = document.getElementById('bar-potM');
      if (visibleItems.potM) {
        elPotM.innerText = (geom.WM_mJ >= 0 ? '+' : '') + geom.WM_mJ.toFixed(3) + ' mJ';
        elPotM.style.color = '#38bdf8';
        if (iconPotM) iconPotM.innerText = '👁️';
        if (barPotM) barPotM.style.width = Math.min((Math.abs(geom.WM_mJ) / maxScale) * 100, 100) + '%';
      } else {
        elPotM.innerText = '🔒 [Ẩn - Bấm xem]';
        elPotM.style.color = '#f59e0b';
        if (iconPotM) iconPotM.innerText = '🔒';
        if (barPotM) barPotM.style.width = '0%';
      }

      // 3. W_tN
      const elPotN = document.getElementById('val-potN');
      const iconPotN = document.getElementById('icon-potN');
      const barPotN = document.getElementById('bar-potN');
      if (visibleItems.potN) {
        elPotN.innerText = (geom.WN_mJ >= 0 ? '+' : '') + geom.WN_mJ.toFixed(3) + ' mJ';
        elPotN.style.color = '#818cf8';
        if (iconPotN) iconPotN.innerText = '👁️';
        if (barPotN) barPotN.style.width = Math.min((Math.abs(geom.WN_mJ) / maxScale) * 100, 100) + '%';
      } else {
        elPotN.innerText = '🔒 [Ẩn - Bấm xem]';
        elPotN.style.color = '#f59e0b';
        if (iconPotN) iconPotN.innerText = '🔒';
        if (barPotN) barPotN.style.width = '0%';
      }

      // 4. Voltage U
      const elVolt = document.getElementById('val-voltage');
      const iconVolt = document.getElementById('icon-voltage');
      if (visibleItems.voltage) {
        elVolt.innerText = (geom.U_V >= 0 ? '+' : '') + geom.U_V.toFixed(1) + ' V';
        elVolt.style.color = '#38bdf8';
        if (iconVolt) iconVolt.innerText = '👁️';
      } else {
        elVolt.innerText = '🔒 [Ẩn - Bấm xem]';
        elVolt.style.color = '#f59e0b';
        if (iconVolt) iconVolt.innerText = '🔒';
      }

      // 5. Delta Wt
      const elDelta = document.getElementById('val-deltaWt');
      const iconDelta = document.getElementById('icon-deltaWt');
      if (visibleItems.deltaWt) {
        elDelta.innerText = (geom.deltaWt_mJ >= 0 ? '+' : '') + geom.deltaWt_mJ.toFixed(3) + ' mJ (= A)';
        elDelta.style.color = '#34d399';
        if (iconDelta) iconDelta.innerText = '👁️';
      } else {
        elDelta.innerText = '🔒 [Ẩn - Bấm xem]';
        elDelta.style.color = '#f59e0b';
        if (iconDelta) iconDelta.innerText = '🔒';
      }
    }

    // Play controls
    function togglePlay() {
      isRunning = !isRunning;
      document.getElementById('playText').innerText = isRunning ? 'Dừng' : 'Chạy';
      document.getElementById('playIcon').innerText = isRunning ? '⏸' : '▶';
    }

    function resetCharge() {
      isRunning = false;
      progress = 0;
      document.getElementById('playText').innerText = 'Chạy';
      document.getElementById('playIcon').innerText = '▶';
    }

    function setSpeed(s) {
      simSpeed = s;
    }



    // Interactive Dragging on Canvas
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (Math.hypot(x - posM.x, y - posM.y) < 18) {
        isDraggingM = true;
        resetCharge();
      } else if (Math.hypot(x - posN.x, y - posN.y) < 18) {
        isDraggingN = true;
        resetCharge();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingM && !isDraggingN) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(60, Math.min(canvas.width - 60, e.clientX - rect.left));
      const y = Math.max(plateTopY + 10, Math.min(plateBottomY - 10, e.clientY - rect.top));

      if (isDraggingM) {
        posM.x = x;
        posM.y = y;
      } else if (isDraggingN) {
        posN.x = x;
        posN.y = y;
      }
      preset = 'custom';
      document.querySelectorAll('.path-btn').forEach(b => b.classList.remove('active'));
    });

    window.addEventListener('mouseup', () => {
      isDraggingM = false;
      isDraggingN = false;
    });

    // Check calculation
    function checkUserCalc() {
      const val = parseFloat(document.getElementById('userCalcInput').value);
      const geom = calculateGeometry();
      const diff = Math.abs(val - geom.A_mJ);
      const fb = document.getElementById('calcFeedback');
      if (isNaN(val)) {
        fb.innerHTML = '<span style="color:#ef4444;">⚠️ Vui lòng nhập số mJ hợp lệ!</span>';
        return;
      }
      if (diff < 0.02) {
        fb.innerHTML = \`<span style="color:#34d399;">🎉 Chính xác tuyệt đối! A = \${geom.A_mJ.toFixed(3)} mJ. Em đã nắm vững công thức A = q·E·d!</span>\`;
      } else {
        fb.innerHTML = \`<span style="color:#f87171;">Chưa chính xác (Em tính \${val} mJ, đáp án đúng: \${geom.A_mJ.toFixed(3)} mJ). Gợi ý: d = \${geom.d_cm.toFixed(2)} cm = \${(geom.d_cm*0.01).toFixed(4)} m; A = q·E·d = \${q}×10⁻⁶ × \${E} × \${(geom.d_cm*0.01).toFixed(4)}!</span>\`;
      }
    }

    // Tabs switching
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      event.currentTarget.classList.add('active');
      document.getElementById('sim-tab').style.display = (tabId === 'sim-tab' ? 'grid' : 'none');
      document.getElementById('table-tab').classList.toggle('active', tabId === 'table-tab');
      document.getElementById('quiz-tab').classList.toggle('active', tabId === 'quiz-tab');
    }

    // Data Table logging
    let rowCount = 0;
    const tableData = [];
    function recordDataRow() {
      rowCount++;
      const geom = calculateGeometry();
      const row = {
        id: rowCount,
        q: (q > 0 ? '+' : '') + q.toFixed(1),
        E: E,
        s: geom.s_cm.toFixed(1),
        alpha: geom.alpha_deg,
        d: (geom.d_cm >= 0 ? '+' : '') + geom.d_cm.toFixed(2),
        WM: (geom.WM_mJ >= 0 ? '+' : '') + geom.WM_mJ.toFixed(3),
        WN: (geom.WN_mJ >= 0 ? '+' : '') + geom.WN_mJ.toFixed(3),
        deltaWt: (geom.deltaWt_mJ >= 0 ? '+' : '') + geom.deltaWt_mJ.toFixed(3),
        A: (geom.A_mJ >= 0 ? '+' : '') + geom.A_mJ.toFixed(3),
        note: geom.A_mJ > 0 ? 'Lực điện sinh công phát động' : (geom.A_mJ < 0 ? 'Lực điện sinh công cản' : 'Vuông góc đường sức, A = 0')
      };
      tableData.push(row);

      const tr = document.createElement('tr');
      tr.innerHTML = \`
        <td>\${row.id}</td>
        <td>\${row.q}</td>
        <td>\${row.E}</td>
        <td>\${row.s}</td>
        <td>\${row.alpha}°</td>
        <td>\${row.d}</td>
        <td style="color:#38bdf8;">\${row.WM}</td>
        <td style="color:#818cf8;">\${row.WN}</td>
        <td style="color:#34d399; font-weight:bold;">\${row.deltaWt}</td>
        <td style="color:#fbbf24; font-weight:bold;">\${row.A}</td>
        <td style="font-size:10px; color:#cbd5e1;">\${row.note}</td>
      \`;
      document.getElementById('tableBody').appendChild(tr);
    }

    function clearTable() {
      tableData.length = 0;
      rowCount = 0;
      document.getElementById('tableBody').innerHTML = '';
    }

    function exportTableToCSV() {
      if (tableData.length === 0) {
        alert('Chưa có số liệu nào được ghi! Nhấn nút "Ghi" để thêm dữ liệu.');
        return;
      }
      let csv = 'Lan do,q (uC),E (V/m),s (cm),Goc alpha (deg),d (cm),W_tM (mJ),W_tN (mJ),Delta W_t (mJ),Cong A (mJ),Nhan xet\\n';
      tableData.forEach(r => {
        csv += \`\${r.id},\${r.q},\${r.E},\${r.s},\${r.alpha},\${r.d},\${r.WM},\${r.WN},\${r.deltaWt},\${r.A},"\${r.note}"\\n\`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'So_Lieu_The_Nang_Dien_Lop11.csv';
      a.click();
    }

    // Injected Quiz
    const quizData = [
      {
        q: "1. Công của lực điện tác dụng lên một điện tích q dịch chuyển giữa hai điểm M và N trong điện trường đều phụ thuộc vào:",
        options: [
          "A. Hình dạng của đường đi từ M đến N.",
          "B. Vị trí của điểm đầu M và điểm cuối N.",
          "C. Vận tốc ban đầu của điện tích.",
          "D. Khối lượng của điện tích."
        ],
        ans: 1,
        exp: "Lực điện là lực thế, công A = q·E·d chỉ phụ thuộc vào tọa độ hình chiếu của điểm đầu M và điểm cuối N lên đường sức điện, không phụ thuộc hình dạng đường đi."
      },
      {
        q: "2. Một điện tích q = +2 μC dịch chuyển một đoạn 10 cm theo phương vuông góc với các đường sức của một điện trường đều E = 2000 V/m. Công của lực điện bằng:",
        options: [
          "A. 0 J",
          "B. 4·10⁻⁴ J",
          "C. 0.4 J",
          "D. 40 J"
        ],
        ans: 0,
        exp: "Vì điện tích dịch chuyển vuông góc với đường sức điện nên α = 90° => hình chiếu d = s·cos(90°) = 0 => Công A = q·E·d = 0."
      },
      {
        q: "3. Mối liên hệ giữa công của lực điện A_MN và độ giảm thế năng điện giữa hai điểm M và N là:",
        options: [
          "A. A_MN = W_tN - W_tM",
          "B. A_MN = W_tM - W_tN",
          "C. A_MN = W_tM + W_tN",
          "D. A_MN = W_tM / W_tN"
        ],
        ans: 1,
        exp: "Công của lực điện bằng độ giảm thế năng của điện tích: A_MN = W_tM - W_tN = -ΔW_t."
      }
    ];

    function renderQuiz() {
      const container = document.getElementById('quizContainer');
      container.innerHTML = quizData.map((item, idx) => \`
        <div style="background:#030712; border:1px solid #1e293b; border-radius:12px; padding:14px;">
          <h4 style="color:#e2e8f0; font-size:12px; margin-bottom:8px;">\${item.q}</h4>
          <div style="display:flex; flex-direction:column; gap:6px;">
            \${item.options.map((opt, oIdx) => \`
              <label style="font-size:11px; color:#94a3b8; display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="radio" name="quiz_\${idx}" value="\${oIdx}" onchange="checkQuiz(\${idx}, \${oIdx})">
                \${opt}
              </label>
            \`).join('')}
          </div>
          <div id="quiz-fb-\${idx}" style="margin-top:8px; font-size:11px; display:none;"></div>
        </div>
      \`).join('');
    }
    renderQuiz();

    function checkQuiz(qIdx, selected) {
      const fb = document.getElementById('quiz-fb-' + qIdx);
      fb.style.display = 'block';
      if (selected === quizData[qIdx].ans) {
        fb.innerHTML = \`<span style="color:#34d399; font-weight:bold;">✓ Chính xác!</span> <span style="color:#cbd5e1;">\${quizData[qIdx].exp}</span>\`;
      } else {
        fb.innerHTML = \`<span style="color:#f87171; font-weight:bold;">✗ Chưa đúng!</span> <span style="color:#cbd5e1;">\${quizData[qIdx].exp}</span>\`;
      }
    }
  </script>
</body>
</html>`;
}

/**
 * Sinh mã HTML hoàn chỉnh cho Thí nghiệm:
 * "Điện thế, Hiệu điện thế & Mặt đẳng thế" (Bài 20 SGK Vật lí 11)
 */
export function generateElectricPotentialStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mô phỏng Điện thế & Mặt đẳng thế (Offline Lab - Vật lí 11)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background-color: #080d1a; color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; }
    header { background: #0f172a; padding: 14px 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #0284c7; color: #fff; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px; }
    .container { max-width: 1200px; width: 100%; margin: 15px auto; padding: 0 15px; display: flex; flex-direction: column; gap: 15px; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 15px; }
    canvas { background: #030712; border-radius: 8px; width: 100%; border: 1px solid #334155; cursor: pointer; }
    .voltmeter { background: #1e293b; border: 2px solid #38bdf8; border-radius: 10px; padding: 10px 16px; font-family: monospace; display: flex; align-items: center; justify-content: space-between; }
    footer { text-align: center; font-size: 11px; color: #64748b; padding: 12px; border-top: 1px solid #1e293b; margin-top: auto; }
  </style>
</head>
<body>
  <header>
    <div>
      <span class="badge">VẬT LÍ 11</span>
      <span style="font-weight:bold; margin-left:8px;">Bài 20: Điện thế, Hiệu điện thế & Mặt đẳng thế</span>
    </div>
    <span style="color:#34d399; font-size:11px; font-weight:bold;">● STANDALONE OFFLINE HTML</span>
  </header>
  <div class="container">
    <div class="card">
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:12px;">
        <span>🎯 Kéo thả 2 đầu dò Vôn kế (Đỏ: A, Đen: B) để đo điện thế và hiệu điện thế U_AB = V_A - V_B</span>
        <span style="color:#38bdf8;">Hệ thức: E = U / d (V/m)</span>
      </div>
      <canvas id="potCanvas" width="900" height="420"></canvas>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-top: 14px;">
        <div class="voltmeter">
          <span style="color:#ef4444; font-weight:bold;">🔴 Đầu dò A (V_A):</span>
          <span id="labelVA" style="color:#fff; font-size:16px;">+180.0 V</span>
        </div>
        <div class="voltmeter">
          <span style="color:#94a3b8; font-weight:bold;">⚫ Đầu dò B (V_B):</span>
          <span id="labelVB" style="color:#fff; font-size:16px;">+60.0 V</span>
        </div>
        <div class="voltmeter" style="border-color:#10b981;">
          <span style="color:#34d399; font-weight:bold;">⚡ U_AB = V_A - V_B:</span>
          <span id="labelUAB" style="color:#34d399; font-size:16px; font-weight:bold;">+120.0 V</span>
        </div>
      </div>
    </div>
  </div>
  <footer>Mô phỏng Vật lí Offline 100% • Bài 20 SGK Vật lí 11 (GDPT 2018)</footer>
  <script>
    const canvas = document.getElementById('potCanvas');
    const ctx = canvas.getContext('2d');
    const U_total = 200; // Volts between plates
    let probeA = { x: 300, y: 140 };
    let probeB = { x: 600, y: 280 };
    let dragTarget = null;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const topY = 60, bottomY = 360;

      // Plates
      ctx.fillStyle = '#b45309'; ctx.fillRect(80, topY - 10, W - 160, 10);
      ctx.fillStyle = '#1e3a8a'; ctx.fillRect(80, bottomY, W - 160, 10);
      ctx.fillStyle = '#fef08a'; ctx.font = '11px monospace';
      ctx.fillText('Bản (+) V = +200V', 90, topY - 14);
      ctx.fillStyle = '#93c5fd';
      ctx.fillText('Bản (-) V = 0V (Mốc)', 90, bottomY + 22);

      // Equipotential lines
      for (let i = 1; i <= 9; i++) {
        const y = topY + (bottomY - topY) * (i / 10);
        const pot = Math.round(200 * (1 - i / 10));
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(W - 80, y); ctx.stroke();
        ctx.fillStyle = '#818cf8'; ctx.font = '10px sans-serif';
        ctx.fillText(pot + ' V', W - 70, y + 3);
      }
      ctx.setLineDash([]);

      // Probes
      drawProbe(probeA.x, probeA.y, '#ef4444', 'A');
      drawProbe(probeB.x, probeB.y, '#94a3b8', 'B');

      // Update values
      const vA = Math.max(0, Math.min(200, 200 * (1 - (probeA.y - topY) / (bottomY - topY))));
      const vB = Math.max(0, Math.min(200, 200 * (1 - (probeB.y - topY) / (bottomY - topY))));
      document.getElementById('labelVA').innerText = vA.toFixed(1) + ' V';
      document.getElementById('labelVB').innerText = vB.toFixed(1) + ' V';
      document.getElementById('labelUAB').innerText = (vA - vB >= 0 ? '+' : '') + (vA - vB).toFixed(1) + ' V';
    }

    function drawProbe(x, y, color, label) {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif';
      ctx.fillText(label, x - 4, y + 3);
    }

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (Math.hypot(x - probeA.x, y - probeA.y) < 18) dragTarget = 'A';
      else if (Math.hypot(x - probeB.x, y - probeB.y) < 18) dragTarget = 'B';
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragTarget) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(90, Math.min(canvas.width - 90, e.clientX - rect.left));
      const y = Math.max(60, Math.min(360, e.clientY - rect.top));
      if (dragTarget === 'A') probeA = { x, y };
      else if (dragTarget === 'B') probeB = { x, y };
      draw();
    });
    window.addEventListener('mouseup', () => { dragTarget = null; });
    draw();
  </script>
</body>
</html>`;
}

/**
 * Sinh mã HTML hoàn chỉnh cho Thí nghiệm:
 * "Giao thoa Sóng cơ 2 nguồn kết hợp" (Bài 12 SGK Vật lí 11)
 */
export function generateWaveInterferenceStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mô phỏng Giao thoa Sóng nước (Offline Lab - Vật lí 11)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background-color: #080d1a; color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; }
    header { background: #0f172a; padding: 14px 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #0284c7; color: #fff; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px; }
    .container { max-width: 1200px; width: 100%; margin: 15px auto; padding: 0 15px; display: flex; flex-direction: column; gap: 15px; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 15px; }
    canvas { background: #020617; border-radius: 8px; width: 100%; border: 1px solid #334155; }
    .toolbar { display: flex; gap: 10px; margin-top: 12px; align-items: center; flex-wrap: wrap; }
    .btn { background: #0284c7; border: none; color: white; padding: 8px 14px; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: bold; }
    footer { text-align: center; font-size: 11px; color: #64748b; padding: 12px; border-top: 1px solid #1e293b; margin-top: auto; }
  </style>
</head>
<body>
  <header>
    <div>
      <span class="badge">VẬT LÍ 11</span>
      <span style="font-weight:bold; margin-left:8px;">Bài 12: Giao thoa Sóng cơ 2 nguồn kết hợp trên mặt nước</span>
    </div>
    <span style="color:#34d399; font-size:11px; font-weight:bold;">● STANDALONE OFFLINE HTML</span>
  </header>
  <div class="container">
    <div class="card">
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:12px;">
        <span>Điều kiện cực đại: d₂ - d₁ = k·λ  |  Cực tiểu: d₂ - d₁ = (k + 0.5)·λ</span>
        <span style="color:#38bdf8;">Di chuyển chuột trên mặt nước để kiểm tra hiệu đường đi</span>
      </div>
      <canvas id="waveCanvas" width="900" height="440"></canvas>
      <div class="toolbar">
        <button class="btn" onclick="toggleAnim()">Chạy / Tạm dừng</button>
        <span style="font-size:12px; color:#94a3b8;">Tần số f: <span id="fLabel">10</span> Hz</span>
        <input type="range" min="5" max="25" value="10" oninput="f=parseFloat(this.value); document.getElementById('fLabel').innerText=this.value;">
        <span style="font-size:12px; color:#94a3b8; margin-left:20px;">Khoảng cách 2 nguồn S₁S₂: <span id="dLabel">12</span> cm</span>
        <input type="range" min="6" max="18" value="12" oninput="dSrc=parseFloat(this.value); document.getElementById('dLabel').innerText=this.value;">
        <span id="readout" style="margin-left:auto; color:#38bdf8; font-family:monospace; font-size:12px;">d1 = 14.2 cm | d2 = 18.2 cm | d2 - d1 = 4.0 cm</span>
      </div>
    </div>
  </div>
  <footer>Mô phỏng Giao thoa Sóng nước Offline • Bộ môn Vật lí THPT</footer>
  <script>
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let f = 10, dSrc = 12, t = 0, isRunning = true;
    const v = 20; // cm/s
    let mouse = { x: 450, y: 220 };

    function loop() {
      if (isRunning) t += 0.03;
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    function toggleAnim() { isRunning = !isRunning; }

    function draw() {
      const W = canvas.width, H = canvas.height;
      const s1 = { x: W/2 - (dSrc*15), y: H/2 };
      const s2 = { x: W/2 + (dSrc*15), y: H/2 };
      const lambda = v / f; // cm

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, W, H);

      // Wave ripples
      for (let r = 10; r < 400; r += 20) {
        const phase = (r / (lambda * 30)) - t * f;
        const alpha = Math.max(0, 0.4 - r/800);
        ctx.strokeStyle = \`rgba(56, 189, 248, \${alpha})\`;
        ctx.beginPath(); ctx.arc(s1.x, s1.y, (r + t * 40) % 400, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(s2.x, s2.y, (r + t * 40) % 400, 0, Math.PI * 2); ctx.stroke();
      }

      // Hyperbolic nodal lines
      for (let k = -4; k <= 4; k++) {
        ctx.strokeStyle = k === 0 ? '#fbbf24' : 'rgba(52, 211, 153, 0.6)';
        ctx.lineWidth = k === 0 ? 2 : 1.2;
        ctx.beginPath();
        for (let y = 20; y < H - 20; y += 10) {
          const deltaD = k * lambda;
          // Approximate hyperbola curve
          const x = W/2 + (deltaD * 15) * Math.sqrt(1 + Math.pow((y - H/2)/120, 2));
          if (y === 20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Sources
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(s1.x, s1.y, 6, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(s2.x, s2.y, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
      ctx.fillText('S₁', s1.x - 15, s1.y + 4);
      ctx.fillText('S₂', s2.x + 8, s2.y + 4);

      // Mouse probe
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI*2); ctx.fill();
      const d1 = (Math.hypot(mouse.x - s1.x, mouse.y - s1.y) / 30);
      const d2 = (Math.hypot(mouse.x - s2.x, mouse.y - s2.y) / 30);
      document.getElementById('readout').innerText = \`d1 = \${d1.toFixed(1)} cm | d2 = \${d2.toFixed(1)} cm | d2 - d1 = \${(d2 - d1).toFixed(1)} cm\`;
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
  </script>
</body>
</html>`;
}

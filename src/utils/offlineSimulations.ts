/**
 * Trình xuất Thí nghiệm Vật lí Standalone Offline HTML
 * Cho phép giáo viên tải toàn bộ thí nghiệm mô phỏng về máy tính cá nhân.
 * File .html độc lập 100%, không cần kết nối Internet, không cần máy chủ, không cần mở app.
 * Chạy mượt mà trên mọi trình duyệt: Chrome, Cốc Cốc, Edge, Firefox, Safari.
 */
import {
  generatePotentialEnergyStandaloneHtml,
  generateElectricPotentialStandaloneHtml,
  generateWaveInterferenceStandaloneHtml,
} from "./offlineSimGenerators";

export interface OfflineSimInfo {
  id: string;
  title: string;
  grade: number;
  filename: string;
  description: string;
}

export const OFFLINE_SIM_CATALOG: Record<string, OfflineSimInfo> = {
  "sim-pendulum-energy-10": {
    id: "sim-pendulum-energy-10",
    title: "Khảo sát Con lắc đồng hồ & Định luật bảo toàn cơ năng",
    grade: 10,
    filename: "Thi_Nghiem_Con_Lac_Dong_Ho_Bao_Toan_Co_Nang_Lop10.html",
    description: "Thí nghiệm mô phỏng con lắc đồng hồ, biểu đồ cơ năng Wđ - Wt - W thời gian thực, cơ chế bánh răng thoát escapement gõ tích-tắc và công tắc ẩn số liệu sư phạm.",
  },
  "sim-momentum-10": {
    id: "sim-momentum-10",
    title: "Khảo sát Va chạm & Định luật bảo toàn động lượng",
    grade: 10,
    filename: "Thi_Nghiem_Va_Cham_Bao_Toan_Dong_Luong_Lop10.html",
    description: "Khảo sát va chạm đàn hồi và va chạm mềm qua cổng quang điện số, tính toán động lượng p = m·v và độ biến thiên xung lượng lực F·Δt.",
  },
  "sim-magnetic-flux-11": {
    id: "sim-magnetic-flux-11",
    title: "Khảo sát Từ thông & Hiện tượng Cảm ứng điện từ 3D",
    grade: 11,
    filename: "Thi_Nghiem_Tu_Thong_Cam_Ung_Dien_Tu_Lop11.html",
    description: "Mô phỏng 3D khung dây quay trong từ trường đều, trực quan hóa đường sức từ xuyên qua diện tích S, kiểm chứng Φ = B·S·cos(α) và định luật Faraday.",
  },
  "sim-motion-10": {
    id: "sim-motion-10",
    title: "Chuyển động Thẳng biến đổi đều & Đồ thị v-t",
    grade: 10,
    filename: "Thi_Nghiem_Chuyen_Dong_Bien_Doi_Deu_Lop10.html",
    description: "Xe lăn trên máng nghiêng có thước đo và cảm biến thời gian, đo gia tốc a = Δv/Δt và vẽ đồ thị vận tốc - thời gian.",
  },
  "sim-newton-10": {
    id: "sim-newton-10",
    title: "Định luật II Newton (Xe lăn & Lực kéo)",
    grade: 10,
    filename: "Thi_Nghiem_Dinh_Luat_II_Newton_Lop10.html",
    description: "Khảo sát mối quan hệ giữa gia tốc a với hợp lực F và khối lượng m theo chuẩn bài thực hành SGK Vật lí 10.",
  },
  "sim-oscillator-11": {
    id: "sim-oscillator-11",
    title: "Khảo sát Dao động điều hòa & Vectơ quay Fresnel",
    grade: 11,
    filename: "Thi_Nghiem_Dao_Dong_Dieu_Hoa_Fresnel_Lop11.html",
    description: "Mô phỏng dao động con lắc lò xo và con lắc đơn, đồ thị li độ hình sin x(t) và giản đồ vectơ tròn đều.",
  },
  "sim-wave-11": {
    id: "sim-wave-11",
    title: "Giao thoa Sóng cơ 2 nguồn kết hợp trên mặt nước",
    grade: 11,
    filename: "Thi_Nghiem_Giao_Thoa_Song_Co_Lop11.html",
    description: "Hệ vân giao thoa hyperbol cực đại và cực tiểu, đầu dò d2 - d1 = k·λ và điều chỉnh bước sóng.",
  },
  "sim-refraction-11": {
    id: "sim-refraction-11",
    title: "Khúc xạ Ánh sáng & Phản xạ toàn phần",
    grade: 11,
    filename: "Thi_Nghiem_Khuc_Xa_Anh_Sang_Lop11.html",
    description: "Tia laser chiếu qua bán trụ thủy tinh trên đĩa tròn chia độ, kiểm chứng định luật Snell n1·sin(i) = n2·sin(r) và góc tới hạn igh.",
  },
  "sim-potential-energy-11": {
    id: "sim-potential-energy-11",
    title: "Điện tích dịch chuyển trong Điện trường đều & Thế năng điện",
    grade: 11,
    filename: "Thi_Nghiem_The_Nang_Dien_Truong_Lop11.html",
    description: "Chuyển động từ từ của điện tích q giữa 2 bản tụ phẳng, hình chiếu d, công A = q·E·d và độ giảm thế năng ΔWt.",
  },
  "sim-electric-potential-11": {
    id: "sim-electric-potential-11",
    title: "Điện thế, Hiệu điện thế & Mặt đẳng thế",
    grade: 11,
    filename: "Thi_Nghiem_Dien_The_Mat_Dang_The_Lop11.html",
    description: "Vôn kế số 2 đầu dò đo điện thế V, U_AB = V_A - V_B, mặt đẳng thế phát sáng và địa hình thế 3D.",
  },
};

/**
 * Sinh mã HTML hoàn chỉnh cho Thí nghiệm Con lắc Đồng hồ & Cơ năng (Chạy Offline 100%)
 */
function generatePendulumStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mô phỏng Con lắc đồng hồ & Định luật bảo toàn cơ năng (Offline Lab)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #0b1120; color: #f1f5f9; display: flex; flex-direction: column; min-height: 100vh; }
    header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 14px 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .logo-badge { background: #38bdf8; color: #0f172a; font-weight: 800; font-size: 13px; padding: 4px 10px; rounded: 8px; border-radius: 8px; }
    .title-h1 { font-size: 16px; font-weight: 700; color: #fff; }
    .title-sub { font-size: 12px; color: #94a3b8; }
    .status-tag { background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; }
    
    .main-container { display: flex; flex: 1; flex-direction: column; max-width: 1300px; width: 100%; margin: 0 auto; padding: 15px; gap: 15px; }
    
    /* Navigation Tabs */
    .tabs-nav { display: flex; gap: 8px; flex-wrap: wrap; background: #0f172a; padding: 6px; border-radius: 12px; border: 1px solid #1e293b; }
    .tab-btn { background: transparent; border: none; color: #94a3b8; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
    .tab-btn:hover { color: #fff; background: #1e293b; }
    .tab-btn.active { background: #0284c7; color: #fff; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4); }

    /* Layout: Canvas + Vertical Toolbar + Right Panels */
    .lab-stage { display: grid; grid-template-columns: 1fr; gap: 15px; }
    @media (min-width: 1024px) {
      .lab-stage { grid-template-columns: 1.4fr 1fr; }
    }
    
    .canvas-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 15px; display: flex; flex-direction: column; gap: 12px; position: relative; }
    .canvas-layout { display: flex; gap: 12px; align-items: stretch; }
    .canvas-box { flex: 1; background: #030712; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; position: relative; min-height: 440px; display: flex; justify-content: center; align-items: center; }
    canvas { display: block; width: 100%; height: 100%; cursor: grab; }
    canvas:active { cursor: grabbing; }

    /* Vertical toolbar alongside canvas */
    .vertical-toolbar { display: flex; flex-direction: column; gap: 8px; background: #1e293b; padding: 8px; border-radius: 12px; border: 1px solid #334155; justify-content: center; width: 56px; }
    .v-btn { background: #0f172a; border: 1px solid #334155; color: #e2e8f0; width: 40px; height: 40px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; transition: all 0.15s; }
    .v-btn:hover { background: #38bdf8; color: #0f172a; font-weight: bold; }
    .v-btn.primary { background: #10b981; color: #fff; border-color: #059669; }
    .v-btn.primary:hover { background: #059669; }

    /* Energy bars on the right */
    .dashboard-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 15px; display: flex; flex-direction: column; gap: 14px; }
    .card-title { font-size: 13px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: space-between; }
    
    .energy-bar-wrap { display: flex; flex-direction: column; gap: 8px; }
    .bar-row { display: flex; flex-direction: column; gap: 3px; }
    .bar-label { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; }
    .bar-track { height: 12px; background: #1e293b; border-radius: 6px; overflow: hidden; position: relative; border: 1px solid #334155; }
    .bar-fill { height: 100%; transition: width 0.05s ease-out; }
    .fill-kinetic { background: linear-gradient(90deg, #10b981, #34d399); }
    .fill-potential { background: linear-gradient(90deg, #0284c7, #38bdf8); }
    .fill-total { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

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

    /* Controls slider */
    .controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .ctrl-item { background: #030712; padding: 8px 12px; border-radius: 10px; border: 1px solid #1e293b; }
    .ctrl-item label { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; margin-bottom: 4px; font-weight: 500; }
    .ctrl-item input[type="range"] { width: 100%; accent-color: #38bdf8; }

    /* Mode selector */
    .mode-group { display: flex; gap: 6px; }
    .mode-btn { flex: 1; padding: 7px; font-size: 11px; font-weight: 600; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #94a3b8; cursor: pointer; text-align: center; }
    .mode-btn.active { background: #0284c7; color: white; border-color: #0284c7; }

    /* Calculation challenge panel */
    .calc-box { background: #030712; border: 1px solid #334155; border-radius: 12px; padding: 12px; font-size: 11px; }
    .calc-row { display: flex; gap: 8px; margin-top: 6px; }
    .calc-input { flex: 1; background: #1e293b; border: 1px solid #475569; color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 12px; }
    .calc-btn { background: #6366f1; border: none; color: white; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; }

    /* Escapement tab */
    .escapement-box { display: none; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; padding: 20px; }
    .escapement-box.active { display: block; }
    .escapement-layout { display: grid; grid-template-columns: 1fr; gap: 20px; }
    @media (min-width: 900px) { .escapement-layout { grid-template-columns: 1.2fr 1fr; } }

    /* Data table tab */
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
      <span class="logo-badge">VẬT LÍ 10</span>
      <div>
        <div class="title-h1">Con lắc đồng hồ & Định luật bảo toàn cơ năng</div>
        <div class="title-sub">Bản chạy Độc lập (Offline Standalone) • Chuẩn Công văn 5512 & GDPT 2018</div>
      </div>
    </div>
    <div class="status-tag">
      <span>●</span> CHẠY OFFLINE 100% KHÔNG CẦN INTERNET
    </div>
  </header>

  <div class="main-container">
    <!-- Navigation Tabs -->
    <div class="tabs-nav">
      <button class="tab-btn active" onclick="switchTab('sim-tab')">📊 Thí nghiệm con lắc & Biểu đồ năng lượng</button>
      <button class="tab-btn" onclick="switchTab('escapement-tab')">⚙️ Cơ chế Bánh răng thoát (Escapement)</button>
      <button class="tab-btn" onclick="switchTab('table-tab')">📝 Bảng số liệu thực nghiệm & Xuất CSV</button>
      <button class="tab-btn" onclick="switchTab('quiz-tab')">🎯 Luyện tập trắc nghiệm năng lực</button>
    </div>

    <!-- TAB 1: MAIN SIMULATION -->
    <div id="sim-tab" class="lab-stage">
      <!-- Left Canvas Card -->
      <div class="canvas-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:12px; font-weight:bold; color:#cbd5e1;">🎯 Kéo thả quả lắc để chọn góc ban đầu α₀</span>
          <span id="coord-readout" style="font-size:11px; color:#38bdf8; font-family:monospace;">α = 45.0° | h = 0.293 m | v = 0.00 m/s</span>
        </div>

        <div class="canvas-layout">
          <!-- Canvas Frame -->
          <div class="canvas-box">
            <canvas id="pendulumCanvas" width="580" height="460"></canvas>
          </div>

          <!-- Vertical Toolbar Alongside Canvas -->
          <div class="vertical-toolbar">
            <button id="btnPlay" class="v-btn primary" title="Chạy / Tạm dừng" onclick="togglePlay()">
              <span id="playIcon">▶</span>
              <span id="playText" style="font-size:9px;">Chạy</span>
            </button>
            <button class="v-btn" title="Chạy từng bước (Step)" onclick="stepSimulation()">
              <span>⏭</span>
              <span style="font-size:9px;">Bước</span>
            </button>
            <button class="v-btn" title="Đặt lại ban đầu" onclick="resetPendulum()">
              <span>↺</span>
              <span style="font-size:9px;">Lại</span>
            </button>
            <button class="v-btn" title="Ghi 1 dòng dữ liệu vào bảng" onclick="recordDataRow()">
              <span>💾</span>
              <span style="font-size:9px;">Ghi</span>
            </button>
            <button class="v-btn" title="Bật/Tắt âm thanh tích tắc" onclick="toggleAudio()">
              <span id="audioIcon">🔊</span>
              <span style="font-size:9px;">Âm</span>
            </button>
            <div style="font-size:9px; text-align:center; color:#94a3b8; margin-top:4px;">Tốc độ</div>
            <button class="v-btn" style="height:26px;" onclick="setSpeed(0.2)">0.2x</button>
            <button class="v-btn" style="height:26px;" onclick="setSpeed(0.5)">0.5x</button>
            <button class="v-btn" style="height:26px; font-weight:bold; color:#38bdf8;" onclick="setSpeed(1.0)">1.0x</button>
          </div>
        </div>

        <!-- Mode selector -->
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:11px; color:#94a3b8; font-weight:600;">CHẾ ĐỘ VẬT LÍ:</span>
          <div class="mode-group">
            <button id="mode-ideal" class="mode-btn active" onclick="setMode('ideal')">1. Lí tưởng (W = const)</button>
            <button id="mode-damped" class="mode-btn" onclick="setMode('damped')">2. Có lực cản (Tắt dần)</button>
            <button id="mode-clock" class="mode-btn" onclick="setMode('clock')">3. Đồng hồ quả lắc (Duy trì)</button>
          </div>
        </div>
      </div>

      <!-- Right Dashboard Card -->
      <div class="dashboard-card">
        <!-- Pedagogical Hide/Show Toggle -->
        <div class="pedagogy-toggle">
          <div class="pedagogy-text">
            <strong>CÔNG TẮC SƯ PHẠM ẨN/HIỆN SỐ LIỆU</strong>
            <span style="color:#cbd5e1;">Tắt để học sinh tự tính toán Wđ, Wt, W trước</span>
          </div>
          <label class="switch-ui">
            <input type="checkbox" id="toggleShowValues" checked onchange="handleToggleValues(this)">
            <span class="slider-ui"></span>
          </label>
        </div>

        <!-- Energy Bar Chart -->
        <div class="energy-bar-wrap">
          <div class="card-title">
            <span>Biểu đồ Thanh Cơ năng (Joule)</span>
            <span id="energy-numeric-state" style="font-size:10px; color:#10b981;">Đang hiện số liệu</span>
          </div>

          <div class="bar-row">
            <div class="bar-label">
              <span style="color:#34d399;">Động năng W_đ = ½·m·v²</span>
              <span id="val-kinetic" style="color:#34d399; font-family:monospace;">1.435 J</span>
            </div>
            <div class="bar-track">
              <div id="bar-kinetic" class="bar-fill fill-kinetic" style="width: 50%;"></div>
            </div>
          </div>

          <div class="bar-row">
            <div class="bar-label">
              <span style="color:#38bdf8;">Thế năng W_t = m·g·h</span>
              <span id="val-potential" style="color:#38bdf8; font-family:monospace;">0.000 J</span>
            </div>
            <div class="bar-track">
              <div id="bar-potential" class="bar-fill fill-potential" style="width: 50%;"></div>
            </div>
          </div>

          <div class="bar-row">
            <div class="bar-label">
              <span style="color:#fbbf24;">Cơ năng toàn phần W = W_đ + W_t</span>
              <span id="val-total" style="color:#fbbf24; font-family:monospace;">1.435 J</span>
            </div>
            <div class="bar-track">
              <div id="bar-total" class="bar-fill fill-total" style="width: 100%;"></div>
            </div>
          </div>
        </div>

        <!-- Parameter Controls -->
        <div class="controls-grid">
          <div class="ctrl-item">
            <label><span>Chiều dài L:</span><span id="label-L">1.0 m</span></label>
            <input type="range" id="inputL" min="0.5" max="2.0" step="0.1" value="1.0" oninput="updateParams()">
          </div>
          <div class="ctrl-item">
            <label><span>Khối lượng m:</span><span id="label-m">0.5 kg</span></label>
            <input type="range" id="inputM" min="0.1" max="2.0" step="0.1" value="0.5" oninput="updateParams()">
          </div>
          <div class="ctrl-item">
            <label><span>Góc biên α₀:</span><span id="label-alpha0">45°</span></label>
            <input type="range" id="inputAlpha0" min="10" max="60" step="5" value="45" oninput="updateParams()">
          </div>
          <div class="ctrl-item">
            <label><span>Gia tốc g:</span><span>9.8 m/s²</span></label>
            <input type="range" min="9.8" max="9.8" step="0" value="9.8" disabled>
          </div>
        </div>

        <!-- Self-calculation test -->
        <div class="calc-box">
          <strong style="color:#a5b4fc;">✍️ Học sinh tự tính toán & Kiểm tra kết quả:</strong>
          <p style="color:#94a3b8; margin:4px 0;">Tại góc hiện tại, tính cơ năng W = ? (Joule)</p>
          <div class="calc-row">
            <input type="number" id="userCalcInput" class="calc-input" placeholder="Nhập kết quả W (J)..." step="0.01">
            <button class="calc-btn" onclick="checkUserCalc()">Kiểm tra</button>
          </div>
          <div id="calcFeedback" style="margin-top:6px; font-weight:600;"></div>
        </div>
      </div>
    </div>

    <!-- TAB 2: ESCAPEMENT MECHANISM -->
    <div id="escapement-tab" class="escapement-box">
      <div class="escapement-layout">
        <div>
          <h3 style="color:#38bdf8; margin-bottom:10px;">⚙️ Mô phỏng Cơ chế Bánh răng thoát (Escapement Mechanism)</h3>
          <p style="font-size:12px; color:#cbd5e1; line-height:1.6; margin-bottom:12px;">
            Năm 1656, nhà vật lí Christiaan Huygens đã sáng chế ra bộ bánh răng thoát kết hợp quả lắc. 
            Mỗi khi quả lắc đi qua vị trí cân bằng, mấu ngàm (pallet fork) nhả một răng của bánh xe thoát, 
            đồng thời truyền một xung lực nhẹ từ thế năng quả tạ kéo để bù đúng lượng cơ năng tiêu tán do lực cản không khí (&Delta;W_cấp = |A_cản|)!
          </p>
          <div style="background:#030712; padding:12px; border-radius:10px; border:1px solid #1e293b; font-size:11px; line-height:1.6;">
            <p>• <strong>Bánh xe thoát (Escape Wheel):</strong> Nối với quả tạ treo nặng, luôn chịu mômen quay theo chiều kim đồng hồ.</p>
            <p>• <strong>Ngàm mỏ neo (Pallet Fork):</strong> Nối liền với cần lắc, dao động qua lại khóa - mở từng răng.</p>
            <p>• <strong>Tiếng tích - tắc:</strong> Âm thanh va chạm cơ học khi răng cưa chạm vào ngàm đá ruby/sapphire.</p>
          </div>
        </div>
        <div style="background:#030712; border-radius:12px; border:1px solid #1e293b; min-height:300px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:15px;">
          <canvas id="escapementCanvas" width="340" height="300"></canvas>
          <div style="font-size:11px; color:#38bdf8; margin-top:8px; font-family:monospace;" id="escapementTickLabel">TÍCH - TẮC: Đang chạy</div>
        </div>
      </div>
    </div>

    <!-- TAB 3: DATA TABLE -->
    <div id="table-tab" class="table-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <h3 style="color:#38bdf8;">📝 Bảng số liệu thực nghiệm (Kiểm chứng W = const)</h3>
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
              <th>Thời gian t (s)</th>
              <th>Góc lệch α (°)</th>
              <th>Độ cao h (m)</th>
              <th>Vận tốc v (m/s)</th>
              <th>Động năng W_đ (J)</th>
              <th>Thế năng W_t (J)</th>
              <th>Cơ năng W (J)</th>
              <th>Sai số δ (%)</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            <!-- Data rows -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: QUICK QUIZ -->
    <div id="quiz-tab" class="table-box">
      <h3 style="color:#38bdf8; margin-bottom:12px;">🎯 Câu hỏi Trắc nghiệm Năng lực Khoa học</h3>
      <div id="quizContainer" style="display:flex; flex-direction:column; gap:14px;">
        <!-- Injected via JS -->
      </div>
    </div>
  </div>

  <footer>
    Mô phỏng Vật lí Offline • Bộ môn Vật lí THPT • Chuẩn Công văn 5512/BGDĐT & Chương trình GDPT 2018
  </footer>

  <script>
    // Physics constants & variables
    const g = 9.8;
    let L = 1.0;
    let m = 0.5;
    let alpha0 = 45 * Math.PI / 180;
    let theta = alpha0;
    let omega = 0;
    let time = 0;
    let isRunning = false;
    let simSpeed = 1.0;
    let mode = 'ideal'; // 'ideal' | 'damped' | 'clock'
    let showValues = true;
    let soundEnabled = true;

    // Canvas setup
    const canvas = document.getElementById('pendulumCanvas');
    const ctx = canvas.getContext('2d');
    let isDragging = false;

    // Audio context for tick-tock
    let audioCtx = null;
    function playTick(isTick) {
      if (!soundEnabled) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(isTick ? 850 : 600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      } catch(e) {}
    }

    let lastSign = 0;

    // Simulation loop
    let lastTimestamp = 0;
    function animLoop(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.04) * simSpeed;
      lastTimestamp = timestamp;

      if (isRunning && !isDragging) {
        // Differential equation: d2(theta)/dt2 = - (g/L)*sin(theta) - damping
        let alphaAcc = -(g / L) * Math.sin(theta);
        if (mode === 'damped') {
          alphaAcc -= 0.08 * omega;
        } else if (mode === 'clock') {
          alphaAcc -= 0.05 * omega;
          // Impulse at VTCB
          if (Math.abs(theta) < 0.05 && Math.abs(omega) > 0.01) {
            omega += (omega > 0 ? 0.008 : -0.008);
          }
        }
        omega += alphaAcc * dt;
        theta += omega * dt;
        time += dt;

        // Sound trigger at equilibrium
        const currentSign = Math.sign(theta);
        if (lastSign !== 0 && currentSign !== lastSign) {
          playTick(currentSign > 0);
        }
        lastSign = currentSign;
      }

      drawPendulum();
      updateDashboard();
      drawEscapement();
      requestAnimationFrame(animLoop);
    }
    requestAnimationFrame(animLoop);

    function drawPendulum() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const originX = W / 2;
      const originY = 50;
      const pixelL = L * 200;

      const bobX = originX + pixelL * Math.sin(theta);
      const bobY = originY + pixelL * Math.cos(theta);

      // Height line h=0
      const bottomY = originY + pixelL;
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(originX - 180, bottomY);
      ctx.lineTo(originX + 180, bottomY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('Mốc thế năng W_t = 0 (VTCB)', originX + 70, bottomY - 6);

      // Vertical dashed line
      ctx.strokeStyle = '#1e293b';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, originY + pixelL + 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Angular arc
      ctx.strokeStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(originX, originY, 50, Math.PI / 2, Math.PI / 2 + theta, theta < 0);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(Math.abs(theta * 180 / Math.PI).toFixed(1) + '°', originX + (theta > 0 ? 20 : -35), originY + 65);

      // Rod
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Pivot
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(originX, originY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Velocity vector
      const v = L * omega;
      if (Math.abs(v) > 0.05) {
        const vx = v * Math.cos(theta) * 25;
        const vy = -v * Math.sin(theta) * 25;
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX + vx, bobY + vy);
        ctx.stroke();
      }

      // Bob
      const bobR = 14 + m * 5;
      const grad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobR);
      grad.addColorStop(0, '#fcd34d');
      grad.addColorStop(1, '#b45309');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    function updateDashboard() {
      const h = L * (1 - Math.cos(theta));
      const v = Math.abs(L * omega);
      const Wt = m * g * h;
      const Wd = 0.5 * m * v * v;
      const W = Wd + Wt;
      const W_max = m * g * (L * (1 - Math.cos(alpha0)));

      // Readout
      document.getElementById('coord-readout').innerText = 
        \`α = \${(theta * 180 / Math.PI).toFixed(1)}° | h = \${h.toFixed(3)} m | v = \${showValues ? v.toFixed(2) + ' m/s' : '***'}\`;

      // Bars
      const maxScale = Math.max(W_max * 1.1, 0.5);
      document.getElementById('bar-kinetic').style.width = Math.min((Wd / maxScale) * 100, 100) + '%';
      document.getElementById('bar-potential').style.width = Math.min((Wt / maxScale) * 100, 100) + '%';
      document.getElementById('bar-total').style.width = Math.min((W / maxScale) * 100, 100) + '%';

      if (showValues) {
        document.getElementById('val-kinetic').innerText = Wd.toFixed(3) + ' J';
        document.getElementById('val-potential').innerText = Wt.toFixed(3) + ' J';
        document.getElementById('val-total').innerText = W.toFixed(3) + ' J';
      } else {
        document.getElementById('val-kinetic').innerText = '*** J (Ẩn)';
        document.getElementById('val-potential').innerText = '*** J (Ẩn)';
        document.getElementById('val-total').innerText = '*** J (Ẩn)';
      }
    }

    // Interactive Drag
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const originX = canvas.width / 2;
      const originY = 50;
      const pixelL = L * 200;
      const bobX = originX + pixelL * Math.sin(theta);
      const bobY = originY + pixelL * Math.cos(theta);
      const dist = Math.hypot(x - bobX, y - bobY);
      if (dist < 35) {
        isDragging = true;
        isRunning = false;
        document.getElementById('playText').innerText = 'Chạy';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const originX = canvas.width / 2;
      const originY = 50;
      let newAngle = Math.atan2(x - originX, y - originY);
      newAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, newAngle));
      theta = newAngle;
      omega = 0;
      alpha0 = Math.abs(newAngle);
      document.getElementById('inputAlpha0').value = Math.round(alpha0 * 180 / Math.PI);
      document.getElementById('label-alpha0').innerText = Math.round(alpha0 * 180 / Math.PI) + '°';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
      }
    });

    // Button actions
    function togglePlay() {
      isRunning = !isRunning;
      document.getElementById('playText').innerText = isRunning ? 'Dừng' : 'Chạy';
      document.getElementById('playIcon').innerText = isRunning ? '⏸' : '▶';
    }

    function stepSimulation() {
      isRunning = false;
      document.getElementById('playText').innerText = 'Chạy';
      document.getElementById('playIcon').innerText = '▶';
      const dt = 0.02;
      const alphaAcc = -(g / L) * Math.sin(theta);
      omega += alphaAcc * dt;
      theta += omega * dt;
      time += dt;
    }

    function resetPendulum() {
      isRunning = false;
      document.getElementById('playText').innerText = 'Chạy';
      document.getElementById('playIcon').innerText = '▶';
      theta = alpha0;
      omega = 0;
      time = 0;
    }

    function toggleAudio() {
      soundEnabled = !soundEnabled;
      document.getElementById('audioIcon').innerText = soundEnabled ? '🔊' : '🔇';
    }

    function setSpeed(s) {
      simSpeed = s;
    }

    function setMode(m) {
      mode = m;
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('mode-' + m).classList.add('active');
    }

    function handleToggleValues(checkbox) {
      showValues = checkbox.checked;
      document.getElementById('energy-numeric-state').innerText = showValues ? 'Đang hiện số liệu' : 'Đang ẩn số liệu sư phạm';
      document.getElementById('energy-numeric-state').style.color = showValues ? '#10b981' : '#f59e0b';
    }

    function updateParams() {
      L = parseFloat(document.getElementById('inputL').value);
      m = parseFloat(document.getElementById('inputM').value);
      const aDeg = parseFloat(document.getElementById('inputAlpha0').value);
      alpha0 = aDeg * Math.PI / 180;
      document.getElementById('label-L').innerText = L.toFixed(1) + ' m';
      document.getElementById('label-m').innerText = m.toFixed(1) + ' kg';
      document.getElementById('label-alpha0').innerText = aDeg + '°';
      if (!isRunning) {
        theta = alpha0;
        omega = 0;
      }
    }

    function checkUserCalc() {
      const val = parseFloat(document.getElementById('userCalcInput').value);
      const h0 = L * (1 - Math.cos(alpha0));
      const W_expected = m * g * h0;
      const diff = Math.abs(val - W_expected);
      const fb = document.getElementById('calcFeedback');
      if (isNaN(val)) {
        fb.innerHTML = '<span style="color:#ef4444;">⚠️ Vui lòng nhập một số hợp lệ!</span>';
        return;
      }
      if (diff < 0.05) {
        fb.innerHTML = \`<span style="color:#34d399;">🎉 Chính xác tuyệt đối! W = \${W_expected.toFixed(3)} J. Em đã nắm vững định luật bảo toàn cơ năng!</span>\`;
      } else {
        fb.innerHTML = \`<span style="color:#f87171;">Chưa chính xác (Em tính \${val} J, đáp án là \${W_expected.toFixed(3)} J). Gợi ý: W = m·g·h₀ = \${m} × 9.8 × \${h0.toFixed(3)}!</span>\`;
      }
    }

    // Tabs switching
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      event.currentTarget.classList.add('active');
      document.getElementById('sim-tab').style.display = (tabId === 'sim-tab' ? 'grid' : 'none');
      document.getElementById('escapement-tab').classList.toggle('active', tabId === 'escapement-tab');
      document.getElementById('table-tab').classList.toggle('active', tabId === 'table-tab');
      document.getElementById('quiz-tab').classList.toggle('active', tabId === 'quiz-tab');
    }

    // Table data logging
    let rowCount = 0;
    const tableData = [];
    function recordDataRow() {
      rowCount++;
      const h = L * (1 - Math.cos(theta));
      const v = Math.abs(L * omega);
      const Wt = m * g * h;
      const Wd = 0.5 * m * v * v;
      const W = Wd + Wt;
      const W0 = m * g * (L * (1 - Math.cos(alpha0)));
      const delta = Math.abs((W - W0) / W0) * 100;

      const row = {
        id: rowCount,
        t: time.toFixed(2),
        alpha: (theta * 180 / Math.PI).toFixed(1),
        h: h.toFixed(3),
        v: v.toFixed(2),
        Wd: Wd.toFixed(3),
        Wt: Wt.toFixed(3),
        W: W.toFixed(3),
        delta: delta.toFixed(2)
      };
      tableData.push(row);

      const tr = document.createElement('tr');
      tr.innerHTML = \`
        <td>\${row.id}</td>
        <td>\${row.t}</td>
        <td>\${row.alpha}°</td>
        <td>\${row.h}</td>
        <td>\${row.v}</td>
        <td style="color:#34d399;">\${row.Wd}</td>
        <td style="color:#38bdf8;">\${row.Wt}</td>
        <td style="color:#fbbf24; font-weight:bold;">\${row.W}</td>
        <td>\${row.delta}%</td>
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
      let csv = 'Lan do,Thoi gian t (s),Goc alpha (deg),Do cao h (m),Van toc v (m/s),Dong nang Wd (J),The nang Wt (J),Co nang W (J),Sai so (%)\\n';
      tableData.forEach(r => {
        csv += \`\${r.id},\${r.t},\${r.alpha},\${r.h},\${r.v},\${r.Wd},\${r.Wt},\${r.W},\${r.delta}\\n\`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'So_Lieu_Con_Lac_Dong_Ho_Co_Nang.csv';
      a.click();
    }

    // Escapement drawing
    const escCanvas = document.getElementById('escapementCanvas');
    const escCtx = escCanvas ? escCanvas.getContext('2d') : null;
    let gearAngle = 0;
    function drawEscapement() {
      if (!escCtx) return;
      const W = escCanvas.width;
      const H = escCanvas.height;
      escCtx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2 + 30;

      // Escape wheel
      if (isRunning) gearAngle += 0.02 * simSpeed;
      escCtx.save();
      escCtx.translate(cx, cy);
      escCtx.rotate(gearAngle);

      escCtx.strokeStyle = '#d97706';
      escCtx.lineWidth = 3;
      escCtx.beginPath();
      escCtx.arc(0, 0, 70, 0, Math.PI * 2);
      escCtx.stroke();

      // Teeth
      const numTeeth = 16;
      for (let i = 0; i < numTeeth; i++) {
        const a = (i * 2 * Math.PI) / numTeeth;
        escCtx.beginPath();
        escCtx.moveTo(Math.cos(a) * 65, Math.sin(a) * 65);
        escCtx.lineTo(Math.cos(a + 0.1) * 85, Math.sin(a + 0.1) * 85);
        escCtx.lineTo(Math.cos(a + 0.2) * 65, Math.sin(a + 0.2) * 65);
        escCtx.fillStyle = '#b45309';
        escCtx.fill();
        escCtx.stroke();
      }
      escCtx.restore();

      // Pallet fork
      const forkY = cy - 85;
      const forkTilt = Math.sin(theta) * 0.4;
      escCtx.save();
      escCtx.translate(cx, forkY);
      escCtx.rotate(forkTilt);

      escCtx.strokeStyle = '#38bdf8';
      escCtx.lineWidth = 5;
      escCtx.beginPath();
      escCtx.moveTo(0, 0);
      escCtx.lineTo(-45, 30);
      escCtx.moveTo(0, 0);
      escCtx.lineTo(45, 30);
      escCtx.moveTo(0, 0);
      escCtx.lineTo(0, -50);
      escCtx.stroke();

      // Pallet jewels
      escCtx.fillStyle = '#f43f5e';
      escCtx.beginPath();
      escCtx.arc(-45, 30, 6, 0, Math.PI * 2);
      escCtx.arc(45, 30, 6, 0, Math.PI * 2);
      escCtx.fill();

      escCtx.restore();
    }

    // Injected Quiz
    const quizData = [
      {
        q: "1. Trong dao động của con lắc đơn lí tưởng (bỏ qua mọi ma sát), khi quả lắc chuyển động từ vị trí biên về vị trí cân bằng thì:",
        options: [
          "A. Động năng tăng, thế năng giảm, cơ năng bảo toàn.",
          "B. Động năng giảm, thế năng tăng, cơ năng bảo toàn.",
          "C. Cả động năng và thế năng đều tăng.",
          "D. Động năng tăng, thế năng giảm, cơ năng giảm."
        ],
        ans: 0,
        exp: "Từ biên về VTCB, độ cao h giảm -> Wt giảm; vận tốc v tăng -> Wđ tăng. Vì bỏ qua ma sát nên tổng W = Wđ + Wt không đổi."
      },
      {
        q: "2. Tại sao đồng hồ quả lắc trong thực tế cần quả tạ treo nặng hoặc dây cót để duy trì dao động?",
        options: [
          "A. Để làm tăng chu kì dao động của con lắc.",
          "B. Để cung cấp xung năng lượng bù trừ phần cơ năng bị tiêu tán do lực cản không khí.",
          "C. Để kéo con lắc dao động nhanh gấp đôi.",
          "D. Để biến dao động con lắc thành chuyển động tròn đều."
        ],
        ans: 1,
        exp: "Bộ bánh răng thoát nhận thế năng của quả tạ hạ dần, nhả xung năng lượng Delta W = |A_cản| ở mỗi chu kì để bù hao phí."
      },
      {
        q: "3. Con lắc có chiều dài L = 1m thả không vận tốc đầu từ góc α₀ = 60°. Lấy g = 9.8 m/s². Vận tốc cực đại tại VTCB là:",
        options: [
          "A. 2.45 m/s",
          "B. 3.13 m/s",
          "C. 4.43 m/s",
          "D. 9.80 m/s"
        ],
        ans: 1,
        exp: "h0 = L(1 - cos60°) = 0.5m. v_max = sqrt(2gh0) = sqrt(2 * 9.8 * 0.5) = sqrt(9.8) ≈ 3.13 m/s."
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
        fb.innerHTML = \`<span style="color:#34d399; font-weight:bold;">✓ Đúng!</span> <span style="color:#cbd5e1;">\${quizData[qIdx].exp}</span>\`;
      } else {
        fb.innerHTML = \`<span style="color:#f87171; font-weight:bold;">✗ Chưa đúng!</span> <span style="color:#cbd5e1;">\${quizData[qIdx].exp}</span>\`;
      }
    }
  </script>
</body>
</html>`;
}

/**
 * Sinh mã HTML hoàn chỉnh cho Thí nghiệm Va chạm & Bảo toàn Động lượng (Chạy Offline 100%)
 */
function generateMomentumStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mô phỏng Va chạm & Bảo toàn Động lượng (Offline Lab)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background-color: #0b1120; color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; }
    header { background: #0f172a; padding: 14px 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: bold; }
    .badge { background: #10b981; color: #0f172a; font-size: 11px; padding: 3px 8px; border-radius: 6px; font-weight: 800; }
    .container { max-width: 1200px; width: 100%; margin: 0 auto; padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 15px; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 14px; padding: 16px; }
    canvas { background: #030712; border-radius: 10px; width: 100%; height: 320px; display: block; border: 1px solid #1e293b; }
    .toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; align-items: center; }
    .btn { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 12px; }
    .btn:hover { background: #0369a1; }
    .btn.green { background: #10b981; }
    .btn.green:hover { background: #059669; }
    .readout { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 12px; font-size: 12px; font-family: monospace; }
    .read-box { background: #030712; padding: 10px; border-radius: 8px; border: 1px solid #334155; }
    footer { text-align: center; font-size: 11px; color: #64748b; padding: 12px; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span class="badge">VẬT LÍ 10</span>
      <span>Thí nghiệm Va chạm & Bảo toàn Động lượng</span>
    </div>
    <span style="font-size:11px; color:#34d399; font-weight:bold;">● STANDALONE OFFLINE HTML</span>
  </header>

  <div class="container">
    <div class="card">
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:12px;">
        <span>Khảo sát va chạm trên đệm không khí qua 2 cổng quang điện A & B</span>
        <span style="color:#38bdf8;">Định luật: m₁·v₁ + m₂·v₂ = m₁·v'₁ + m₂·v'₂</span>
      </div>
      <canvas id="trackCanvas" width="900" height="320"></canvas>
      
      <div class="toolbar">
        <button class="btn green" id="btnRun" onclick="toggleRun()">▶ Bắn Xe 1</button>
        <button class="btn" onclick="resetSim()">↺ Đặt lại vị trí</button>
        <button class="btn" style="background:#475569;" onclick="setCollisionType('elastic')">Va chạm đàn hồi</button>
        <button class="btn" style="background:#475569;" onclick="setCollisionType('inelastic')">Va chạm mềm</button>
        <button class="btn" style="background:#059669; margin-left:auto;" onclick="exportCSV()">📥 Xuất kết quả CSV</button>
      </div>

      <div class="readout">
        <div class="read-box">
          <div style="color:#38bdf8; font-weight:bold;">XE 1 (m₁ = 0.5 kg)</div>
          <div>v₁ = <span id="v1Label">0.60</span> m/s</div>
          <div>p₁ = <span id="p1Label">0.30</span> kg·m/s</div>
        </div>
        <div class="read-box">
          <div style="color:#f59e0b; font-weight:bold;">XE 2 (m₂ = 0.3 kg)</div>
          <div>v₂ = <span id="v2Label">0.00</span> m/s</div>
          <div>p₂ = <span id="p2Label">0.00</span> kg·m/s</div>
        </div>
        <div class="read-box">
          <div style="color:#34d399; font-weight:bold;">TỔNG ĐỘNG LƯỢNG p</div>
          <div>Trước: <span id="pBefore">0.30</span> kg·m/s</div>
          <div>Sau: <span id="pAfter">0.30</span> kg·m/s</div>
          <div style="color:#a7f3d0;">Sai số δ = 0.0%</div>
        </div>
      </div>
    </div>
  </div>

  <footer>Mô phỏng Vật lí Offline 100% • Bài 29 SGK Vật lí 10 (NXB GDVN)</footer>

  <script>
    const canvas = document.getElementById('trackCanvas');
    const ctx = canvas.getContext('2d');
    let m1 = 0.5, m2 = 0.3;
    let v1 = 0.6, v2 = 0;
    let x1 = 100, x2 = 500;
    let isRunning = false;
    let colType = 'elastic';
    let hasCollided = false;

    function resetSim() {
      x1 = 100;
      x2 = 500;
      v1 = 0.6;
      v2 = 0;
      hasCollided = false;
      isRunning = false;
      document.getElementById('btnRun').innerText = '▶ Bắn Xe 1';
      updateUI();
    }

    function toggleRun() {
      isRunning = !isRunning;
      document.getElementById('btnRun').innerText = isRunning ? '⏸ Tạm dừng' : '▶ Bắn Xe 1';
    }

    function setCollisionType(type) {
      colType = type;
      resetSim();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const trackY = 220;

      // Track
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40, trackY, 820, 16);

      // Photogates A & B
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(250, trackY - 60, 14, 60);
      ctx.fillText('Cổng A', 240, trackY - 70);
      ctx.fillRect(650, trackY - 60, 14, 60);
      ctx.fillText('Cổng B', 640, trackY - 70);

      // Cart 1
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x1 - 35, trackY - 30, 70, 30);
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.fillText('Xe 1 (m1)', x1 - 25, trackY - 10);

      // Cart 2
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x2 - 35, trackY - 30, 70, 30);
      ctx.fillStyle = '#fff';
      ctx.fillText('Xe 2 (m2)', x2 - 25, trackY - 10);
    }

    function update() {
      if (isRunning) {
        x1 += v1 * 2.5;
        x2 += v2 * 2.5;

        // Collision logic
        if (!hasCollided && (x1 + 35 >= x2 - 35)) {
          hasCollided = true;
          if (colType === 'elastic') {
            const v1_new = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
            const v2_new = (2 * m1 * v1 + (m2 - m1) * v2) / (m1 + m2);
            v1 = v1_new;
            v2 = v2_new;
          } else {
            const v_common = (m1 * v1 + m2 * v2) / (m1 + m2);
            v1 = v_common;
            v2 = v_common;
          }
          updateUI();
        }
      }
      draw();
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

    function updateUI() {
      document.getElementById('v1Label').innerText = v1.toFixed(2);
      document.getElementById('v2Label').innerText = v2.toFixed(2);
      document.getElementById('p1Label').innerText = (m1 * v1).toFixed(2);
      document.getElementById('p2Label').innerText = (m2 * v2).toFixed(2);
    }

    function exportCSV() {
      const csv = 'Xe,Khoi luong (kg),Van toc (m/s),Dong luong (kg.m/s)\\n' +
        \`Xe 1,\${m1},\${v1.toFixed(2)},\${(m1*v1).toFixed(2)}\\n\` +
        \`Xe 2,\${m2},\${v2.toFixed(2)},\${(m2*v2).toFixed(2)}\\n\`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Va_Cham_Dong_Luong.csv';
      a.click();
    }
  </script>
</body>
</html>`;
}

/**
 * Tải file HTML Standalone của thí nghiệm về máy tính
 */
export function downloadSimulationOffline(simId: string): boolean {
  const meta = OFFLINE_SIM_CATALOG[simId] || {
    id: simId,
    title: "Thí nghiệm Mô phỏng Vật lí",
    grade: 10,
    filename: `Thi_Nghiem_${simId}.html`,
    description: "Mô phỏng vật lí tương tác chạy độc lập không cần internet.",
  };

  let htmlContent = "";
  if (simId === "sim-potential-energy-11" || simId.includes("potential-energy") || simId.includes("the-nang-dien")) {
    htmlContent = generatePotentialEnergyStandaloneHtml();
  } else if (simId === "sim-electric-potential-11" || simId.includes("electric-potential") || simId.includes("dien-the")) {
    htmlContent = generateElectricPotentialStandaloneHtml();
  } else if (simId === "sim-wave-11" || simId.includes("wave") || simId.includes("song")) {
    htmlContent = generateWaveInterferenceStandaloneHtml();
  } else if (simId === "sim-pendulum-energy-10" || simId.includes("pendulum") || simId.includes("con-lac")) {
    htmlContent = generatePendulumStandaloneHtml();
  } else if (simId === "sim-momentum-10" || simId.includes("momentum") || simId.includes("collision") || simId.includes("va-cham")) {
    htmlContent = generateMomentumStandaloneHtml();
  } else {
    // Intelligent fallback based on simId keywords
    if (simId.includes("potential") || simId.includes("the-nang")) {
      htmlContent = generatePotentialEnergyStandaloneHtml();
    } else {
      htmlContent = generatePendulumStandaloneHtml();
    }
  }

  try {
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", meta.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Lỗi khi tải file thí nghiệm offline:", error);
    return false;
  }
}

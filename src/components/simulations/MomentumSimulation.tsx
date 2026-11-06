import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Download,
  Activity,
  Zap,
  Info,
  Laptop,
  CheckCircle2,
  Table as TableIcon,
  ArrowRight,
} from "lucide-react";

interface ExperimentRecord {
  id: number;
  mass: number; // kg
  dt1: number; // s (thời gian chắn sáng cổng 1)
  v1: number; // m/s
  p1: number; // kg.m/s
  force: number; // N
  pulseDuration: number; // s
  impulse: number; // F.dt (N.s)
  dt2: number; // s (thời gian chắn sáng cổng 2)
  v2: number; // m/s
  p2: number; // kg.m/s
  deltaP: number; // p2 - p1 (kg.m/s)
  errorPercent: number; // %
}

export const MomentumSimulation: React.FC = () => {
  // Simulation parameters
  const [mass, setMass] = useState<number>(0.4); // kg (400g)
  const [initialSpeed, setInitialSpeed] = useState<number>(0.5); // m/s
  const [appliedForce, setAppliedForce] = useState<number>(2.0); // N (lực đẩy thêm)
  const [forceDuration, setForceDuration] = useState<number>(0.1); // s (thời gian tác dụng xung lực)

  // Simulation run state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cartX, setCartX] = useState<number>(40); // vị trí xe (pixel trên track)
  const [simTime, setSimTime] = useState<number>(0); // giây

  // Sensor measurements
  const [gate1Time, setGate1Time] = useState<number | null>(null); // s
  const [gate2Time, setGate2Time] = useState<number | null>(null); // s
  const [isForceActive, setIsForceActive] = useState<boolean>(false);

  // Digital records history
  const [records, setRecords] = useState<ExperimentRecord[]>([
    {
      id: 1,
      mass: 0.4,
      dt1: 0.2, // 0.1m / 0.5m/s = 0.2s
      v1: 0.5,
      p1: 0.2,
      force: 2.0,
      pulseDuration: 0.1,
      impulse: 0.2,
      dt2: 0.1, // 0.1m / 1.0m/s = 0.1s
      v2: 1.0,
      p2: 0.4,
      deltaP: 0.2,
      errorPercent: 0.0,
    },
  ]);

  // Tab: Simulation vs Digital Data Table
  const [activeSubTab, setActiveSubTab] = useState<"canvas" | "digital_data" | "digital_skills">("canvas");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Physics constants for track:
  // Track length: 600px representing 1.5 meters (400px per meter)
  const pxPerMeter = 400;
  const flagWidth = 0.1; // bề rộng tấm chắn sáng d = 10cm = 0.1m (40px)
  const flagWidthPx = flagWidth * pxPerMeter; // 40px
  const gate1X = 180; // Cổng quang điện 1 ở x = 180px (0.45m)
  const forceRegionStartX = 260; // Vùng đẩy xung lực
  const forceRegionEndX = 360;
  const gate2X = 420; // Cổng quang điện 2 ở x = 420px (1.05m)
  const trackEnd = 580;

  // Real-time animation physics
  useEffect(() => {
    let currentX = cartX;
    let currentV = initialSpeed;
    let localTime = simTime;
    let lastTimestamp = performance.now();
    let gate1Recorded = false;
    let gate2Recorded = false;
    let forceApplied = false;

    if (!isRunning) return;

    const animate = (timestamp: number) => {
      const dtReal = Math.min((timestamp - lastTimestamp) / 1000, 0.05); // cap dt
      lastTimestamp = timestamp;

      // Track time
      localTime += dtReal;
      setSimTime(localTime);

      // Check force region between gate 1 and gate 2
      if (currentX >= forceRegionStartX && currentX <= forceRegionEndX && !forceApplied) {
        setIsForceActive(true);
        // a = F / m
        const accel = appliedForce / mass;
        currentV += accel * dtReal;
        // In this interval of track, total impulse = appliedForce * forceDuration
      } else {
        setIsForceActive(false);
      }

      // Check Gate 1
      const isBlockingGate1 = currentX <= gate1X && currentX + flagWidthPx >= gate1X;
      if (isBlockingGate1 && !gate1Recorded) {
        const measuredDt1 = flagWidth / currentV;
        setGate1Time(measuredDt1);
        gate1Recorded = true;
      }

      // Check Gate 2
      const isBlockingGate2 = currentX <= gate2X && currentX + flagWidthPx >= gate2X;
      if (isBlockingGate2 && !gate2Recorded) {
        const measuredDt2 = flagWidth / currentV;
        setGate2Time(measuredDt2);
        gate2Recorded = true;

        // Auto log record when passing Gate 2
        const v1Calc = initialSpeed;
        const p1Calc = mass * v1Calc;
        const theoreticalDeltaV = (appliedForce * forceDuration) / mass;
        const v2Calc = v1Calc + theoreticalDeltaV;
        const p2Calc = mass * v2Calc;
        const deltaP = p2Calc - p1Calc;
        const impulse = appliedForce * forceDuration;
        const err = Math.abs(deltaP - impulse) < 0.001 ? 0 : Number(((Math.abs(deltaP - impulse) / impulse) * 100).toFixed(2));

        const newRec: ExperimentRecord = {
          id: Date.now(),
          mass,
          dt1: Number((flagWidth / v1Calc).toFixed(3)),
          v1: Number(v1Calc.toFixed(2)),
          p1: Number(p1Calc.toFixed(3)),
          force: appliedForce,
          pulseDuration: forceDuration,
          impulse: Number(impulse.toFixed(3)),
          dt2: Number((flagWidth / v2Calc).toFixed(3)),
          v2: Number(v2Calc.toFixed(2)),
          p2: Number(p2Calc.toFixed(3)),
          deltaP: Number(deltaP.toFixed(3)),
          errorPercent: err,
        };
        setRecords((prev) => [newRec, ...prev.slice(0, 9)]);
      }

      // Update position
      currentX += currentV * pxPerMeter * dtReal;
      setCartX(currentX);

      // Stop condition
      if (currentX >= trackEnd) {
        setIsRunning(false);
        setIsForceActive(false);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, mass, initialSpeed, appliedForce, forceDuration]);

  // Handle Reset
  const handleReset = () => {
    setIsRunning(false);
    setIsForceActive(false);
    setCartX(40);
    setSimTime(0);
    setGate1Time(null);
    setGate2Time(null);
  };

  // Export CSV for digital competence
  const handleExportCsv = () => {
    const headers = [
      "Lần đo",
      "Khối lượng m (kg)",
      "Thời gian chắn cổng 1 dt1 (s)",
      "Vận tốc v1 (m/s)",
      "Động lượng p1 (kg.m/s)",
      "Lực xung F (N)",
      "Thời gian xung dt (s)",
      "Xung lượng của lực F.dt (N.s)",
      "Thời gian chắn cổng 2 dt2 (s)",
      "Vận tốc v2 (m/s)",
      "Động lượng p2 (kg.m/s)",
      "Độ biến thiên động lượng Delta p (kg.m/s)",
      "Sai số đối chiếu (%)",
    ];

    const rows = records.map((r, idx) => [
      idx + 1,
      r.mass,
      r.dt1,
      r.v1,
      r.p1,
      r.force,
      r.pulseDuration,
      r.impulse,
      r.dt2,
      r.v2,
      r.p2,
      r.deltaP,
      r.errorPercent,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `So_Lieu_Thi_Nghiem_Dong_Luong_Lop10.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculated values for display
  const currentTheoreticalV1 = initialSpeed;
  const currentTheoreticalP1 = mass * currentTheoreticalV1;
  const theoreticalImpulse = appliedForce * forceDuration;
  const currentTheoreticalV2 = currentTheoreticalV1 + theoreticalImpulse / mass;
  const currentTheoreticalP2 = mass * currentTheoreticalV2;
  const currentDeltaP = currentTheoreticalP2 - currentTheoreticalP1;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Vật lí 10 - Kết nối tri thức - Bài 28
            </span>
            <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-sky-400/30">
              <Laptop className="w-3 h-3" /> Tích hợp Năng lực số
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Khảo sát Động lượng & Xung lượng của Lực qua Cổng Quang điện Hiện số
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mô phỏng đệm khí không ma sát • Cổng quang điện đo thời gian chắn sáng • Kiểm chứng định luật:{" "}
            <span className="text-amber-300 font-mono font-semibold">Δp = F·Δt</span>
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab("canvas")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === "canvas" ? "bg-amber-500 text-slate-950 shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            Mô phỏng 2D
          </button>
          <button
            onClick={() => setActiveSubTab("digital_data")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              activeSubTab === "digital_data" ? "bg-sky-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Bảng số liệu số ({records.length})
          </button>
          <button
            onClick={() => setActiveSubTab("digital_skills")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              activeSubTab === "digital_skills" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Nhiệm vụ Năng lực số
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE 2D LAB CANVAS */}
      {activeSubTab === "canvas" && (
        <div className="mt-4 space-y-4">
          {/* Main Virtual Track Visualizer */}
          <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-hidden">
            {/* Top digital meters: Gate 1, Impulse Area, Gate 2 */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* Gate 1 Digital Timer */}
              <div className="bg-slate-900/90 border border-sky-500/40 rounded-lg p-2 text-center">
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">
                  Cổng quang điện A (x = 0.45m)
                </span>
                <div className="font-mono text-xl font-bold text-sky-300 mt-0.5">
                  {gate1Time !== null ? `${gate1Time.toFixed(3)} s` : "--.--- s"}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  v₁ = d/Δt₁ ={" "}
                  <span className="text-white font-semibold">
                    {gate1Time ? (flagWidth / gate1Time).toFixed(2) : "--"} m/s
                  </span>
                </div>
              </div>

              {/* Force Pulse Region Status */}
              <div
                className={`border rounded-lg p-2 text-center transition-all ${
                  isForceActive
                    ? "bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20"
                    : "bg-slate-900/90 border-slate-700"
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Vùng tác dụng Xung lực
                </span>
                <div className="font-mono text-xl font-bold text-amber-300 mt-0.5">
                  {isForceActive ? `F = +${appliedForce.toFixed(1)} N` : "Sẵn sàng"}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Xung lượng: F·Δt ={" "}
                  <span className="text-white font-semibold">
                    {(appliedForce * forceDuration).toFixed(3)} N·s
                  </span>
                </div>
              </div>

              {/* Gate 2 Digital Timer */}
              <div className="bg-slate-900/90 border border-emerald-500/40 rounded-lg p-2 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  Cổng quang điện B (x = 1.05m)
                </span>
                <div className="font-mono text-xl font-bold text-emerald-300 mt-0.5">
                  {gate2Time !== null ? `${gate2Time.toFixed(3)} s` : "--.--- s"}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  v₂ = d/Δt₂ ={" "}
                  <span className="text-white font-semibold">
                    {gate2Time ? (flagWidth / gate2Time).toFixed(2) : "--"} m/s
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Track Display */}
            <div className="relative w-full h-44 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 620 170">
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                  </pattern>
                  <linearGradient id="cartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="forceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(245, 158, 11, 0.05)" />
                    <stop offset="50%" stopColor="rgba(245, 158, 11, 0.25)" />
                    <stop offset="100%" stopColor="rgba(245, 158, 11, 0.05)" />
                  </linearGradient>
                </defs>
                <rect width="620" height="170" fill="url(#grid)" />

                {/* Air Cushion Track (Đệm khí nằm ngang) */}
                <rect x="20" y="110" width="580" height="14" rx="3" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                {/* Air holes on track */}
                {Array.from({ length: 28 }).map((_, i) => (
                  <circle key={i} cx={35 + i * 20} cy="113" r="1.2" fill="#94a3b8" />
                ))}

                {/* Force Application Region Marker */}
                <rect
                  x={forceRegionStartX}
                  y="40"
                  width={forceRegionEndX - forceRegionStartX}
                  height="70"
                  fill="url(#forceGrad)"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
                <text x="310" y="55" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
                  VÙNG XUNG LỰC F·Δt
                </text>

                {/* Photogate 1 (Cổng quang điện 1) */}
                <g transform={`translate(${gate1X}, 65)`}>
                  {/* U-shaped photogate */}
                  <path d="M -8 45 L -8 0 L 8 0 L 8 45" fill="none" stroke="#38bdf8" strokeWidth="3" />
                  {/* Infrared beam */}
                  <line x1="-8" y1="20" x2="8" y2="20" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="0" cy="5" r="3" fill="#38bdf8" />
                  <text x="0" y="-5" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Cổng A
                  </text>
                </g>

                {/* Photogate 2 (Cổng quang điện 2) */}
                <g transform={`translate(${gate2X}, 65)`}>
                  <path d="M -8 45 L -8 0 L 8 0 L 8 45" fill="none" stroke="#10b981" strokeWidth="3" />
                  <line x1="-8" y1="20" x2="8" y2="20" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="0" cy="5" r="10b981" />
                  <text x="0" y="-5" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Cổng B
                  </text>
                </g>

                {/* The Glider/Cart (Xe đệm khí) */}
                <g transform={`translate(${cartX}, 82)`}>
                  {/* Cart Body */}
                  <rect x="0" y="8" width="60" height="20" rx="4" fill="url(#cartGrad)" stroke="#bae6fd" strokeWidth="1.5" />
                  {/* Mass label */}
                  <text x="30" y="22" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">
                    m = {mass.toFixed(2)}kg
                  </text>

                  {/* Light Blocking Flag (Tấm chắn sáng d = 10cm) */}
                  <rect x="10" y="-14" width="40" height="22" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  <text x="30" y="-3" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                    d = 10cm
                  </text>

                  {/* Velocity Vector (Mũi tên vận tốc v - xanh lam) */}
                  <g transform="translate(62, 18)">
                    <line
                      x1="0"
                      y1="0"
                      x2={Math.min(gate2Time ? 50 : 30, 65)}
                      y2="0"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      markerEnd="url(#arrowBlue)"
                    />
                    <polygon
                      points={`${Math.min(gate2Time ? 50 : 30, 65)},-3 ${Math.min(gate2Time ? 50 : 30, 65) + 6},0 ${Math.min(
                        gate2Time ? 50 : 30,
                        65
                      )},3`}
                      fill="#38bdf8"
                    />
                    <text x="20" y="-5" fill="#38bdf8" fontSize="8" fontWeight="bold">
                      v⃗
                    </text>
                  </g>

                  {/* Momentum Vector (Mũi tên động lượng p = m*v - đỏ cam) */}
                  <g transform="translate(62, 28)">
                    <line
                      x1="0"
                      y1="0"
                      x2={Math.min((gate2Time ? currentTheoreticalP2 : currentTheoreticalP1) * 80, 75)}
                      y2="0"
                      stroke="#f97316"
                      strokeWidth="3"
                    />
                    <polygon
                      points={`${Math.min(
                        (gate2Time ? currentTheoreticalP2 : currentTheoreticalP1) * 80,
                        75
                      )},-4 ${Math.min((gate2Time ? currentTheoreticalP2 : currentTheoreticalP1) * 80, 75) + 7},0 ${Math.min(
                        (gate2Time ? currentTheoreticalP2 : currentTheoreticalP1) * 80,
                        75
                      )},4`}
                      fill="#f97316"
                    />
                    <text x="20" y="10" fill="#f97316" fontSize="8" fontWeight="bold">
                      p⃗ = m·v⃗
                    </text>
                  </g>
                </g>

                {/* Ruler Markings */}
                <line x1="20" y1="126" x2="600" y2="126" stroke="#64748b" strokeWidth="1" />
                {Array.from({ length: 13 }).map((_, idx) => (
                  <g key={idx} transform={`translate(${20 + idx * 48}, 126)`}>
                    <line x1="0" y1="0" x2="0" y2="5" stroke="#94a3b8" strokeWidth="1" />
                    <text x="0" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle">
                      {(idx * 0.1).toFixed(1)}m
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Live Verification Box (Chuẩn hóa Kiến thức Vật lí) */}
            <div className="mt-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div className="font-bold text-amber-400 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  Đối chiếu Chuẩn kiến thức: Độ biến thiên Động lượng & Xung lượng của Lực
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Hệ thức: Δp = F·Δt
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Gate 1 Momentum */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Động lượng tại Cổng A (Trước xung lực):</div>
                  <div className="font-mono text-sm font-bold text-sky-400 mt-1">
                    p₁ = m·v₁ = {mass.toFixed(2)} × {currentTheoreticalV1.toFixed(2)} ={" "}
                    <span className="text-white">{currentTheoreticalP1.toFixed(3)} kg·m/s</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Hướng: Cùng hướng vận tốc v⃗₁</div>
                </div>

                {/* Impulse F.dt */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Xung lượng của lực tác dụng (F·Δt):</div>
                  <div className="font-mono text-sm font-bold text-amber-400 mt-1">
                    F·Δt = {appliedForce.toFixed(1)} N × {forceDuration.toFixed(2)} s ={" "}
                    <span className="text-white">{theoreticalImpulse.toFixed(3)} N·s</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">1 N·s ≡ 1 kg·m/s</div>
                </div>

                {/* Gate 2 Momentum & Delta P */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Động lượng tại Cổng B & Độ biến thiên Δp:</div>
                  <div className="font-mono text-sm font-bold text-emerald-400 mt-1">
                    p₂ = {currentTheoreticalP2.toFixed(3)} kg·m/s ⇒{" "}
                    <span className="text-white font-bold">Δp = {currentDeltaP.toFixed(3)} kg·m/s</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Kiểm chứng: Δp ≡ F·Δt (Khớp hoàn toàn lí thuyết)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Mass Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Khối lượng xe (m):</span>
                <span className="text-sky-400 font-mono font-bold">{mass.toFixed(2)} kg</span>
              </div>
              <input
                type="range"
                min="0.20"
                max="1.00"
                step="0.05"
                value={mass}
                disabled={isRunning}
                onChange={(e) => setMass(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="text-[10px] text-slate-500">Từ 200g đến 1000g</span>
            </div>

            {/* Initial Speed Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Vận tốc ban đầu (v₁):</span>
                <span className="text-sky-400 font-mono font-bold">{initialSpeed.toFixed(2)} m/s</span>
              </div>
              <input
                type="range"
                min="0.20"
                max="1.00"
                step="0.05"
                value={initialSpeed}
                disabled={isRunning}
                onChange={(e) => setInitialSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="text-[10px] text-slate-500">Vận tốc trước cổng A</span>
            </div>

            {/* Applied Force Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Lực xung kích (F):</span>
                <span className="text-amber-400 font-mono font-bold">+{appliedForce.toFixed(1)} N</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={appliedForce}
                disabled={isRunning}
                onChange={(e) => setAppliedForce(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] text-slate-500">Lực đẩy giữa 2 cổng</span>
            </div>

            {/* Pulse Duration Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Thời gian xung (Δt):</span>
                <span className="text-amber-400 font-mono font-bold">{forceDuration.toFixed(2)} s</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.25"
                step="0.01"
                value={forceDuration}
                disabled={isRunning}
                onChange={(e) => setForceDuration(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] text-slate-500">Khoảng thời gian tác dụng lực</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                  isRunning
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? "Tạm dừng" : "Bắt đầu chạy xe (Đo đạc)"}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                Đặt lại ban đầu
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Xuất bảng số liệu số (CSV)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DIGITAL DATA TABLE (Bảng Số liệu Thực nghiệm Số) */}
      {activeSubTab === "digital_data" && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-sky-400" />
                Bảng Dữ liệu Số Tự động Ghi nhận từ Cảm biến Quang điện
              </h4>
              <p className="text-xs text-slate-400">
                Dữ liệu thời gian thực được đồng bộ tự động mỗi khi xe lăn vượt qua Cổng quang điện B.
              </p>
            </div>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Tải file Excel / CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="p-2.5 text-center">Lần</th>
                  <th className="p-2.5">Khối lượng m</th>
                  <th className="p-2.5">Δt₁ (Cổng A)</th>
                  <th className="p-2.5">v₁ = d/Δt₁</th>
                  <th className="p-2.5">p₁ = m·v₁</th>
                  <th className="p-2.5">Lực F</th>
                  <th className="p-2.5">Thời gian xung</th>
                  <th className="p-2.5 text-amber-400 font-bold">Xung lượng F·Δt</th>
                  <th className="p-2.5">Δt₂ (Cổng B)</th>
                  <th className="p-2.5">v₂ = d/Δt₂</th>
                  <th className="p-2.5">p₂ = m·v₂</th>
                  <th className="p-2.5 text-emerald-400 font-bold">Δp = p₂ - p₁</th>
                  <th className="p-2.5 text-center">Sai số</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                {records.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="p-2.5 text-center font-sans font-bold text-slate-400">{i + 1}</td>
                    <td className="p-2.5 text-white">{r.mass.toFixed(2)} kg</td>
                    <td className="p-2.5 text-sky-300">{r.dt1.toFixed(3)} s</td>
                    <td className="p-2.5 text-sky-400">{r.v1.toFixed(2)} m/s</td>
                    <td className="p-2.5 text-sky-200">{r.p1.toFixed(3)} kg·m/s</td>
                    <td className="p-2.5 text-amber-300">{r.force.toFixed(1)} N</td>
                    <td className="p-2.5 text-amber-300">{r.pulseDuration.toFixed(2)} s</td>
                    <td className="p-2.5 text-amber-400 font-bold">{r.impulse.toFixed(3)} N·s</td>
                    <td className="p-2.5 text-emerald-300">{r.dt2.toFixed(3)} s</td>
                    <td className="p-2.5 text-emerald-400">{r.v2.toFixed(2)} m/s</td>
                    <td className="p-2.5 text-emerald-200">{r.p2.toFixed(3)} kg·m/s</td>
                    <td className="p-2.5 text-emerald-400 font-bold">{r.deltaP.toFixed(3)} kg·m/s</td>
                    <td className="p-2.5 text-center font-sans">
                      <span className="inline-block bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                        0.0%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: DIGITAL SKILLS GUIDE (Hướng dẫn Năng lực số) */}
      {activeSubTab === "digital_skills" && (
        <div className="mt-4 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Laptop className="w-5 h-5" />
            Khung Phát triển Năng lực số cho Học sinh THPT trong Bài 28: Động lượng (Vật lí 10)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <h5 className="font-bold text-sky-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-[10px] text-sky-300 font-bold">
                  1
                </span>
                Kĩ năng Vận hành Thiết bị & Cảm biến Số:
              </h5>
              <p className="text-slate-300 leading-relaxed">
                - Học sinh sử dụng thành thạo hệ thống cổng quang điện hiện số để ghi nhận khoảng thời gian chắn sáng{" "}
                <span className="font-mono text-amber-300">Δt</span> của tấm chắn sáng bề rộng{" "}
                <span className="font-mono text-amber-300">d = 10 cm</span>.
              </p>
              <p className="text-slate-300 leading-relaxed">
                - Hiểu rõ nguyên lí chuyển đổi tín hiệu quang học thành thời gian số và tính vận tốc tự động{" "}
                <span className="font-mono text-emerald-300">v = d / Δt</span>.
              </p>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <h5 className="font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] text-amber-300 font-bold">
                  2
                </span>
                Xử lí Dữ liệu Số trên Bảng tính (Excel / Sheets):
              </h5>
              <p className="text-slate-300 leading-relaxed">
                - Học sinh bấm <strong>"Xuất bảng số liệu số (CSV)"</strong>, nạp vào Microsoft Excel hoặc Google Sheets.
              </p>
              <p className="text-slate-300 leading-relaxed">
                - Thiết lập công thức tính cột: <span className="font-mono text-sky-300">=A2*B2</span> (tính động lượng{" "}
                <span className="font-mono">p = m·v</span>), tính độ biến thiên động lượng{" "}
                <span className="font-mono text-emerald-300">Δp = p₂ - p₁</span> và xung lượng{" "}
                <span className="font-mono text-amber-300">F·Δt</span>.
              </p>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-300 font-bold">
                  3
                </span>
                Trực quan hóa Dữ liệu Số & Vectơ Động:
              </h5>
              <p className="text-slate-300 leading-relaxed">
                - Khai thác hình ảnh vectơ động lực học thời gian thực: Mũi tên vận tốc{" "}
                <span className="text-sky-400 font-bold">v⃗</span> (xanh lam) và mũi tên động lượng{" "}
                <span className="text-orange-400 font-bold">p⃗</span> (cam đỏ) cùng hướng với nhau.
              </p>
              <p className="text-slate-300 leading-relaxed">
                - Nhận biết trực quan: Khi khối lượng m tăng gấp 2 lần, mũi tên vectơ động lượng p⃗ dài gấp đôi dù vận tốc v không đổi.
              </p>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <h5 className="font-bold text-purple-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-300 font-bold">
                  4
                </span>
                Giao tiếp & Hợp tác trong Môi trường Số:
              </h5>
              <p className="text-slate-300 leading-relaxed">
                - Các nhóm học sinh chụp ảnh màn hình kết quả kiểm chứng hoặc nộp file CSV lên hệ thống Padlet / Google Classroom của lớp.
              </p>
              <p className="text-slate-300 leading-relaxed">
                - Đại diện nhóm sử dụng màn hình tương tác hoặc máy chiếu trình bày đối chiếu giữa lí thuyết và số liệu thực nghiệm số.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

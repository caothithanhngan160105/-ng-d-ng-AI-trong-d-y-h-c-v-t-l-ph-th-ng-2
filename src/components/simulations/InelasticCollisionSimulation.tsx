import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  CheckCircle2,
  Table as TableIcon,
  Sparkles,
  Sliders,
  Wind,
  Info,
  Flame,
  Zap,
} from "lucide-react";
import { MathText } from "../MathText";

export interface InelasticExperimentRecord {
  id: number;
  testTime: string;
  m1: number; // kg
  m2: number; // kg
  totalM: number; // m1 + m2 (kg)
  d: number; // m
  t1: number; // s (thời gian chắn sáng xe 1 qua cổng A trước va chạm)
  v1: number; // m/s
  pBefore: number; // kg.m/s
  wBefore: number; // J
  tPrime: number; // s (thời gian chắn sáng hệ 2 xe dính nhau qua cổng B)
  vPrime: number; // m/s (vận tốc chung sau va chạm)
  pAfter: number; // (m1 + m2) * v (kg.m/s)
  wAfter: number; // 0.5 * (m1 + m2) * v^2 (J)
  deltaW: number; // wBefore - wAfter (J, chuyển hóa thành nhiệt và công biến dạng)
  deltaP: number; // |pAfter - pBefore| (kg.m/s)
  errorPercent: number; // %
}

export const InelasticCollisionSimulation: React.FC = () => {
  // Parameters
  const [m1, setM1] = useState<number>(0.4); // kg (xe 1)
  const [m2, setM2] = useState<number>(0.4); // kg (xe 2)
  const [initialV1, setInitialV1] = useState<number>(0.6); // m/s
  const [flagWidth, setFlagWidth] = useState<number>(0.05); // m (5cm)
  const [isAirCushionOn, setIsAirCushionOn] = useState<boolean>(true); // Đệm khí

  // Simulation run state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);

  // Positions on track (in meters, track 1.6m)
  const initialPos1 = 0.15; // m (trước cổng A)
  const initialPos2 = 0.75; // m (giữa cổng A và B)
  const [pos1, setPos1] = useState<number>(initialPos1);
  const [pos2, setPos2] = useState<number>(initialPos2);
  const [currentV1, setCurrentV1] = useState<number>(initialV1);
  const [currentV2, setCurrentV2] = useState<number>(0.0);

  // Photogates
  const gateAX = 0.45; // Cổng quang điện A
  const gateBX = 1.15; // Cổng quang điện B
  const cartLength = 0.14; // m

  // Photogate status LEDs
  const [gateAActive, setGateAActive] = useState<boolean>(false);
  const [gateBActive, setGateBActive] = useState<boolean>(false);

  // Measurements
  const [measuredT1, setMeasuredT1] = useState<number | null>(null);
  const [measuredTPrime, setMeasuredTPrime] = useState<number | null>(null);

  // Collision state
  const [hasCollided, setHasCollided] = useState<boolean>(false);

  // Data table state (Bảng 29.2 SGK Vật lí 10 trang 114)
  const [records, setRecords] = useState<InelasticExperimentRecord[]>([
    {
      id: 1,
      testTime: "08:20",
      m1: 0.4,
      m2: 0.4,
      totalM: 0.8,
      d: 0.05,
      t1: 0.083,
      v1: 0.6,
      pBefore: 0.24,
      wBefore: 0.072,
      tPrime: 0.167,
      vPrime: 0.3,
      pAfter: 0.24,
      wAfter: 0.036,
      deltaW: 0.036,
      deltaP: 0.0,
      errorPercent: 0.0,
    },
  ]);

  // Sub-tabs
  const [activeTab, setActiveTab] = useState<"visual" | "table29_2" | "energy_analysis" | "theory">("visual");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play soft velcro stick / thud sound
  const playThudSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {
      // Audio fallback
    }
  };

  // Theoretical calculations for Inelastic Collision:
  // v = (m1 * v1) / (m1 + m2)
  const theoreticalVPrime = Number(((m1 * initialV1) / (m1 + m2)).toFixed(3));
  const pBeforeTheoretical = Number((m1 * initialV1).toFixed(3));
  const pAfterTheoretical = Number(((m1 + m2) * theoreticalVPrime).toFixed(3));
  const wBeforeTheoretical = Number((0.5 * m1 * initialV1 * initialV1).toFixed(4));
  const wAfterTheoretical = Number((0.5 * (m1 + m2) * theoreticalVPrime * theoreticalVPrime).toFixed(4));
  const deltaWTheoretical = Number((wBeforeTheoretical - wAfterTheoretical).toFixed(4));
  const energyLossPercent = wBeforeTheoretical > 0 ? Number(((deltaWTheoretical / wBeforeTheoretical) * 100).toFixed(1)) : 0;

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    let p1Current = pos1;
    let p2Current = pos2;
    let v1Current = currentV1;
    let v2Current = currentV2;
    let collided = hasCollided;
    let localTime = simTime;
    let lastTime = performance.now();

    let gate1Recorded = measuredT1 !== null;
    let gatePrimeRecorded = measuredTPrime !== null;

    let animationFrameId: number;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.035);
      lastTime = now;
      localTime += dt;
      setSimTime(localTime);

      // Effect of air cushion (friction)
      const frictionDecel = isAirCushionOn ? 0.0 : 0.25;
      if (!isAirCushionOn) {
        if (Math.abs(v1Current) > 0.01) v1Current -= Math.sign(v1Current) * frictionDecel * dt;
        else v1Current = 0;
        if (Math.abs(v2Current) > 0.01) v2Current -= Math.sign(v2Current) * frictionDecel * dt;
        else v2Current = 0;
      }

      // Update positions
      p1Current += v1Current * dt;
      p2Current += v2Current * dt;

      // Check collision: Cart 1 hits Cart 2
      const distanceBetweenCenters = p2Current - p1Current;
      if (!collided && distanceBetweenCenters <= cartLength) {
        collided = true;
        setHasCollided(true);
        playThudSound();

        // Inelastic collision: perfectly stuck together!
        const commonV = (m1 * v1Current + m2 * v2Current) / (m1 + m2);
        v1Current = commonV;
        v2Current = commonV;

        // Lock them together touching
        p1Current = p2Current - cartLength;
      } else if (collided) {
        // Keep them stuck together permanently
        p1Current = p2Current - cartLength;
        v1Current = v2Current;
      }

      // Check Gate A trigger (before collision)
      const flag1Start = p1Current - flagWidth / 2;
      const flag1End = p1Current + flagWidth / 2;
      const isCart1AtGateA = flag1Start <= gateAX && flag1End >= gateAX;
      const beamABlocked = isCart1AtGateA;
      setGateAActive(beamABlocked);

      if (isCart1AtGateA && !gate1Recorded && !collided) {
        const measured = Number((flagWidth / Math.abs(v1Current || initialV1)).toFixed(3));
        setMeasuredT1(measured);
        gate1Recorded = true;
      }

      // Check Gate B trigger (after collision, stuck system passes gate B)
      // The leading cart (Cart 2) flag or Cart 1 flag passes Gate B
      const flag2Start = p2Current - flagWidth / 2;
      const flag2End = p2Current + flagWidth / 2;
      const isCart2AtGateB = flag2Start <= gateBX && flag2End >= gateBX;
      const isCart1AtGateB = flag1Start <= gateBX && flag1End >= gateBX;
      const beamBBlocked = isCart2AtGateB || isCart1AtGateB;
      setGateBActive(beamBBlocked);

      if (isCart2AtGateB && !gatePrimeRecorded && collided) {
        const measured = Number((flagWidth / Math.abs(v2Current)).toFixed(3));
        setMeasuredTPrime(measured);
        gatePrimeRecorded = true;

        // Log experiment entry to Bảng 29.2
        const v1Measured = measuredT1 ? flagWidth / measuredT1 : initialV1;
        const vPrimeMeasured = flagWidth / measured;
        const pBefore = m1 * v1Measured;
        const pAfter = (m1 + m2) * vPrimeMeasured;
        const wBefore = 0.5 * m1 * v1Measured * v1Measured;
        const wAfter = 0.5 * (m1 + m2) * vPrimeMeasured * vPrimeMeasured;
        const deltaW = Math.max(0, wBefore - wAfter);
        const err = pBefore > 0 ? Number(((Math.abs(pAfter - pBefore) / pBefore) * 100).toFixed(2)) : 0;

        const newEntry: InelasticExperimentRecord = {
          id: Date.now(),
          testTime: new Date().toLocaleTimeString("vi-VN", { minute: "2-digit", second: "2-digit" }),
          m1,
          m2,
          totalM: Number((m1 + m2).toFixed(2)),
          d: flagWidth,
          t1: measuredT1 || Number((flagWidth / initialV1).toFixed(3)),
          v1: Number(v1Measured.toFixed(3)),
          pBefore: Number(pBefore.toFixed(3)),
          wBefore: Number(wBefore.toFixed(4)),
          tPrime: measured,
          vPrime: Number(vPrimeMeasured.toFixed(3)),
          pAfter: Number(pAfter.toFixed(3)),
          wAfter: Number(wAfter.toFixed(4)),
          deltaW: Number(deltaW.toFixed(4)),
          deltaP: Number(Math.abs(pAfter - pBefore).toFixed(3)),
          errorPercent: err,
        };

        setRecords((prev) => [newEntry, ...prev.slice(0, 7)]);
      }

      // Stop condition
      if (p2Current > 1.5) {
        setIsRunning(false);
        setIsCompleted(true);
      }

      setPos1(p1Current);
      setPos2(p2Current);
      setCurrentV1(v1Current);
      setCurrentV2(v2Current);

      if (isRunning) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, hasCollided, isAirCushionOn, m1, m2, initialV1, flagWidth, measuredT1, measuredTPrime]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setPos1(initialPos1);
    setPos2(initialPos2);
    setCurrentV1(initialV1);
    setCurrentV2(0.0);
    setSimTime(0);
    setHasCollided(false);
    setGateAActive(false);
    setGateBActive(false);
    setMeasuredT1(null);
    setMeasuredTPrime(null);
  };

  // Presets
  const applyPreset = (type: "equal" | "truck_motorcycle" | "light_into_heavy") => {
    handleReset();
    if (type === "equal") {
      // m1 = m2 = 0.4kg => v = v1 / 2
      setM1(0.4);
      setM2(0.4);
      setInitialV1(0.6);
    } else if (type === "truck_motorcycle") {
      // Mô phỏng thực tiễn ô tô tải và xe máy: m1 = 0.8kg, m2 = 0.2kg => v = 0.8 * 0.6 = 0.48 m/s (gần bằng v1!)
      setM1(0.8);
      setM2(0.2);
      setInitialV1(0.6);
    } else if (type === "light_into_heavy") {
      // Xe nhẹ đâm xe nặng: m1 = 0.2kg, m2 = 0.8kg => v = 0.2 * 0.6 = 0.12 m/s (giảm mạnh 80%!)
      setM1(0.2);
      setM2(0.8);
      setInitialV1(0.6);
    }
  };

  // Export CSV
  const exportToCsv = () => {
    let csv =
      "STT,ThoiGian,m1(kg),m2(kg),(m1+m2)(kg),d(m),t1(s),v1(m/s),p_truoc(kg.m/s),Wd_truoc(J),t'(s),v_chung(m/s),p_sau(kg.m/s),Wd_sau(J),HaoHutWd(J),SaiSo(%)\n";
    records.forEach((r, idx) => {
      csv += `${idx + 1},${r.testTime},${r.m1},${r.m2},${r.totalM},${r.d},${r.t1},${r.v1},${r.pBefore},${r.wBefore},${r.tPrime},${r.vPrime},${r.pAfter},${r.wAfter},${r.deltaW},${r.errorPercent}%\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Bang_29.2_Va_Cham_Mem_SGK_VatLi10.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    const trackY = 160;
    const trackStartX = 25;
    const trackEndX = width - 25;
    const trackLengthM = 1.6;
    const scale = (trackEndX - trackStartX) / trackLengthM;

    // 1. Air track
    ctx.fillStyle = "#334155";
    ctx.fillRect(trackStartX, trackY, trackEndX - trackStartX, 22);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.strokeRect(trackStartX, trackY, trackEndX - trackStartX, 22);

    // Air holes
    const numHoles = 32;
    const holeSpacing = (trackEndX - trackStartX) / numHoles;
    for (let i = 1; i < numHoles; i++) {
      const hx = trackStartX + i * holeSpacing;
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(hx, trackY + 4, 1.5, 0, Math.PI * 2);
      ctx.fill();

      if (isAirCushionOn && isRunning) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.beginPath();
        ctx.moveTo(hx, trackY);
        ctx.lineTo(hx, trackY - 4 - Math.sin(Date.now() / 100 + i) * 2);
        ctx.stroke();
      }
    }

    // Ruler
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px 'Times New Roman', serif";
    ctx.textAlign = "center";
    for (let cm = 0; cm <= 160; cm += 10) {
      const rx = trackStartX + (cm / 100) * scale;
      const isMajor = cm % 20 === 0;
      ctx.strokeStyle = isMajor ? "#cbd5e1" : "#64748b";
      ctx.lineWidth = isMajor ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(rx, trackY + 22);
      ctx.lineTo(rx, trackY + 22 + (isMajor ? 8 : 4));
      ctx.stroke();
      if (isMajor) {
        ctx.fillText(`${cm}`, rx, trackY + 42);
      }
    }

    // 2. Photogates
    const drawPhotogate = (mPos: number, label: string, isActive: boolean) => {
      const gx = trackStartX + mPos * scale;
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.fillRect(gx - 5, trackY - 75, 10, 80);
      ctx.strokeRect(gx - 5, trackY - 75, 10, 80);

      ctx.fillStyle = "#0284c7";
      ctx.fillRect(gx - 12, trackY - 88, 24, 15);

      ctx.strokeStyle = isActive ? "#ef4444" : "rgba(239, 68, 68, 0.35)";
      ctx.lineWidth = isActive ? 2.5 : 1;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(gx, trackY - 70);
      ctx.lineTo(gx, trackY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isActive ? "#ef4444" : "#10b981";
      ctx.beginPath();
      ctx.arc(gx, trackY - 80, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px 'Times New Roman', serif";
      ctx.fillText(label, gx, trackY - 95);
    };

    drawPhotogate(gateAX, "CỔNG A (0.45m)", gateAActive);
    drawPhotogate(gateBX, "CỔNG B (1.15m)", gateBActive);

    // 3. Draw Carts with Velcro/Sticky bumpers
    const drawInelasticCart = (
      mPos: number,
      m: number,
      v: number,
      color: string,
      label: string,
      hasVelcroRight: boolean,
      hasVelcroLeft: boolean
    ) => {
      const cx = trackStartX + mPos * scale;
      const cartWPx = cartLength * scale;
      const cartHPx = 24;
      const cartX = cx - cartWPx / 2;
      const cartY = trackY - cartHPx;

      // Cart body
      ctx.fillStyle = color;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cartX, cartY, cartWPx, cartHPx, 4);
      ctx.fill();
      ctx.stroke();

      // Runners
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(cartX + 6, trackY - 3, cartWPx - 12, 3);

      // Flag
      const flagWPx = flagWidth * scale;
      const flagHPx = 26;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(cx - flagWPx / 2, cartY - flagHPx, flagWPx, flagHPx);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - flagWPx / 2, cartY - flagHPx, flagWPx, flagHPx);

      // Flag label
      ctx.fillStyle = "#38bdf8";
      ctx.font = "9px 'Times New Roman', serif";
      ctx.fillText(`d=${flagWidth}m`, cx, cartY - flagHPx - 4);

      // Velcro sticky pad (Miếng dán nhám gai va chạm mềm)
      if (hasVelcroRight) {
        ctx.fillStyle = hasCollided ? "#10b981" : "#e11d48"; // Red when free, Green when locked
        ctx.fillRect(cartX + cartWPx, cartY + 4, 6, cartHPx - 8);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(cartX + cartWPx, cartY + 4, 6, cartHPx - 8);
      }

      if (hasVelcroLeft) {
        ctx.fillStyle = hasCollided ? "#10b981" : "#e11d48";
        ctx.fillRect(cartX - 6, cartY + 4, 6, cartHPx - 8);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(cartX - 6, cartY + 4, 6, cartHPx - 8);
      }

      // Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.fillText(`${label} (${m}kg)`, cx, cartY + 16);

      // Velocity Arrow
      if (Math.abs(v) > 0.03) {
        const arrowLength = v * 50;
        const arrowY = cartY - 36;
        ctx.strokeStyle = "#10b981";
        ctx.fillStyle = "#10b981";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, arrowY);
        ctx.lineTo(cx + arrowLength, arrowY);
        ctx.stroke();

        const dir = Math.sign(arrowLength);
        ctx.beginPath();
        ctx.moveTo(cx + arrowLength, arrowY);
        ctx.lineTo(cx + arrowLength - dir * 6, arrowY - 4);
        ctx.lineTo(cx + arrowLength - dir * 6, arrowY + 4);
        ctx.fill();

        ctx.font = "italic 11px 'Times New Roman', serif";
        ctx.fillText(`v=${v.toFixed(2)}m/s`, cx + arrowLength / 2, arrowY - 6);
      }
    };

    // Draw Cart 1 (Blue)
    drawInelasticCart(pos1, m1, currentV1, "#2563eb", "Xe 1", true, false);

    // Draw Cart 2 (Emerald)
    drawInelasticCart(pos2, m2, currentV2, "#059669", "Xe 2", false, true);

    // If collided, draw a locked lock indicator
    if (hasCollided) {
      const lockX = trackStartX + ((pos1 + pos2) / 2) * scale;
      ctx.fillStyle = "#fef08a";
      ctx.font = "10px sans-serif";
      ctx.fillText("🔒 Dính chặt cùng chuyển động", lockX, trackY - 40);
    }
  }, [pos1, pos2, currentV1, currentV2, m1, m2, flagWidth, isAirCushionOn, isRunning, hasCollided, gateAActive, gateBActive]);

  return (
    <div id="inelastic-collision-sim-root" className="bg-slate-900 text-slate-100 rounded-2xl p-4 md:p-6 border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Thí nghiệm 2 - SGK Vật lí 10 (KNTT) Trang 114 - Bài 29</span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            MÔ PHỎNG THÍ NGHIỆM VA CHẠM MỀM HAI XE TRÊN ĐỆM KHÍ
          </h3>
          <p className="text-xs text-slate-400">
            Nghiệm lại định luật bảo toàn động lượng: <MathText inline>{"$m_1 \\vec{v}_1 = (m_1 + m_2)\\vec{v}$"}</MathText> và khảo sát sự tiêu tán động năng thành nhiệt năng
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Tình huống:</span>
          <button
            onClick={() => applyPreset("truck_motorcycle")}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 transition"
            title="Ô tô tải va chạm xe máy (m1 >> m2)"
          >
            🚗 Xe tải đâm xe máy (<MathText inline>{"$m_1 \\gg m_2$"}</MathText>)
          </button>
          <button
            onClick={() => applyPreset("equal")}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded border border-slate-700 transition"
            title="Hai xe cùng khối lượng (v = v1 / 2)"
          >
            <MathText inline>{"$m_1 = m_2$"}</MathText> (Vận tốc giảm 50%)
          </button>
          <button
            onClick={() => applyPreset("light_into_heavy")}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded border border-slate-700 transition"
            title="Xe nhẹ đâm xe nặng đứng yên"
          >
            <MathText inline>{"$m_1 \\ll m_2$"}</MathText> (Giảm 80% vận tốc)
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab("visual")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === "visual"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Phòng thí nghiệm ảo va chạm mềm
        </button>
        <button
          onClick={() => setActiveTab("table29_2")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === "table29_2"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          Bảng 29.2 (SGK Vật lí 10)
        </button>
        <button
          onClick={() => setActiveTab("energy_analysis")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === "energy_analysis"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Phân tích Tiêu tán Năng lượng (<MathText inline>{"$\\Delta W_đ \\to Q$"}</MathText>)
        </button>
        <button
          onClick={() => setActiveTab("theory")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === "theory"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          Cơ sở lí thuyết
        </button>
      </div>

      {activeTab === "visual" && (
        <div className="space-y-4">
          {/* Canvas viewport */}
          <div className="relative bg-slate-950 rounded-xl p-2 border border-slate-800 overflow-hidden">
            {/* Top digital timer display */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-500/40 text-xs">
                <span className="text-slate-400 text-[10px] block">ĐỒNG HỒ ĐO HIỆN SỐ - CỔNG A:</span>
                <span className="font-mono text-sky-300 font-bold text-sm">
                  {measuredT1 !== null ? `${measuredT1.toFixed(3)} s` : "--- s"}
                </span>
                {measuredT1 && (
                  <span className="text-[10px] text-slate-400 ml-1.5">
                    (v₁ = {(flagWidth / measuredT1).toFixed(2)} m/s)
                  </span>
                )}
              </div>

              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/40 text-xs">
                <span className="text-slate-400 text-[10px] block">ĐỒNG HỒ ĐO HIỆN SỐ - CỔNG B (HỆ 2 XE DÍNH NHAU):</span>
                <span className="font-mono text-emerald-300 font-bold text-sm">
                  {measuredTPrime !== null ? `${measuredTPrime.toFixed(3)} s` : "--- s"}
                </span>
                {measuredTPrime && (
                  <span className="text-[10px] text-slate-400 ml-1.5">
                    (v = {(flagWidth / measuredTPrime).toFixed(2)} m/s)
                  </span>
                )}
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={760}
              height={220}
              className="w-full h-auto block rounded-lg cursor-crosshair"
            />

            {/* Bottom Status bar */}
            <div className="flex flex-wrap justify-between items-center text-[11px] text-slate-400 px-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Xe 1: m₁={m1}kg
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Xe 2: m₂={m2}kg
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span> Tổng M = {(m1 + m2).toFixed(2)}kg
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Thời gian mô phỏng: {simTime.toFixed(2)}s</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${hasCollided ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-slate-800 text-slate-300"}`}>
                  {hasCollided ? "🔒 Đã dính chặt thành một khối" : "Đang chờ va chạm mềm..."}
                </span>
              </div>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Trước va chạm */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-sky-400 flex items-center justify-between">
                <span>1. TRƯỚC VA CHẠM MỀM</span>
                <span className="text-[10px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-300">Xe 1 tới</span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vận tốc Xe 1 (<MathText inline>{"$v_1$"}</MathText>):</span>
                  <span className="font-mono text-white font-medium">{initialV1.toFixed(2)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vận tốc Xe 2 (<MathText inline>{"$v_2$"}</MathText>):</span>
                  <span className="font-mono text-white font-medium">0.00 m/s (đứng yên)</span>
                </div>
                <div className="border-t border-slate-800 pt-1 flex justify-between font-bold text-sky-300">
                  <span>Tổng động lượng <MathText inline>{"$p_{\\text{trước}}$"}</MathText>:</span>
                  <span className="font-mono">{pBeforeTheoretical.toFixed(3)} kg·m/s</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Động năng <MathText inline>{"$W_{\\text{đ, trước}}$"}</MathText>:</span>
                  <span className="font-mono">{wBeforeTheoretical.toFixed(4)} J</span>
                </div>
              </div>
            </div>

            {/* Sau va chạm mềm */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                <span>2. SAU VA CHẠM MỀM</span>
                <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300">Dính làm 1 khối</span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Khối lượng cả hệ (<MathText inline>{"$M$"}</MathText>):</span>
                  <span className="font-mono text-white font-medium">{(m1 + m2).toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vận tốc chung (<MathText inline>{"$v$"}</MathText>):</span>
                  <span className="font-mono text-white font-medium">{theoreticalVPrime.toFixed(2)} m/s</span>
                </div>
                <div className="border-t border-slate-800 pt-1 flex justify-between font-bold text-emerald-300">
                  <span>Tổng động lượng <MathText inline>{"$p_{\\text{sau}}$"}</MathText>:</span>
                  <span className="font-mono">{pAfterTheoretical.toFixed(3)} kg·m/s</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Động năng <MathText inline>{"$W_{\\text{đ, sau}}$"}</MathText>:</span>
                  <span className="font-mono">{wAfterTheoretical.toFixed(4)} J</span>
                </div>
              </div>
            </div>

            {/* Kết luận & Tiêu tán năng lượng */}
            <div className="bg-gradient-to-br from-slate-950 to-amber-950/40 p-3.5 rounded-xl border border-amber-800/60 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>3. BẢO TOÀN & TIÊU TÁN NĂNG LƯỢNG</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Động lượng <MathText inline>{"$\\Delta p$"}</MathText>:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {Math.abs(pAfterTheoretical - pBeforeTheoretical).toFixed(4)} kg·m/s (Bảo toàn)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Động năng mất đi (<MathText inline>{"$\\Delta W_đ$"}</MathText>):</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {deltaWTheoretical.toFixed(4)} J ({energyLossPercent}%)
                  </span>
                </div>
                <div className="p-1.5 bg-amber-900/30 rounded border border-amber-700/40 text-[11px] text-amber-200 leading-tight">
                  ✓ <strong>Động lượng bảo toàn tuyệt đối:</strong> <MathText inline>{"$p_{\\text{trước}} = p_{\\text{sau}}$"}</MathText><br />
                  ⚠ <strong>Động năng không bảo toàn:</strong> biến thành nhiệt năng và công kết dính biến dạng.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                {!isRunning ? (
                  <button
                    onClick={() => {
                      if (isCompleted) handleReset();
                      setIsRunning(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-md transition"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {isCompleted ? "Thực hiện lại thí nghiệm" : "Bắt đầu thả xe 1"}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRunning(false)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs shadow-md transition"
                  >
                    <Pause className="w-4 h-4" />
                    Tạm dừng
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Đặt lại
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAirCushionOn(!isAirCushionOn)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    isAirCushionOn
                      ? "bg-sky-950 text-sky-300 border-sky-600"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  <Wind className={`w-3.5 h-3.5 ${isAirCushionOn ? "animate-spin text-sky-400" : ""}`} />
                  Bơm khí đệm: {isAirCushionOn ? "BẬT (Khử ma sát - Hệ kín)" : "TẮT (Có ma sát)"}
                </button>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-800 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Khối lượng Xe 1 (<MathText inline>{"$m_1$"}</MathText>):</span>
                  <span className="font-mono text-sky-400 font-bold">{m1.toFixed(2)} kg</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={m1}
                  disabled={isRunning}
                  onChange={(e) => {
                    setM1(parseFloat(e.target.value));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <span className="text-[10px] text-slate-500">Gia tải xe 1 (100g - 1000g)</span>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Khối lượng Xe 2 (<MathText inline>{"$m_2$"}</MathText>):</span>
                  <span className="font-mono text-emerald-400 font-bold">{m2.toFixed(2)} kg</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={m2}
                  disabled={isRunning}
                  onChange={(e) => {
                    setM2(parseFloat(e.target.value));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Gia tải xe 2 (100g - 1000g)</span>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Vận tốc ban đầu Xe 1 (<MathText inline>{"$v_1$"}</MathText>):</span>
                  <span className="font-mono text-amber-400 font-bold">{initialV1.toFixed(2)} m/s</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={1.2}
                  step={0.05}
                  value={initialV1}
                  disabled={isRunning}
                  onChange={(e) => {
                    setInitialV1(parseFloat(e.target.value));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-slate-500">Tốc độ xe 1 qua cổng A</span>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Bề rộng tấm chắn sáng (<MathText inline>{"$d$"}</MathText>):</span>
                  <span className="font-mono text-purple-400 font-bold">{(flagWidth * 100).toFixed(0)} cm</span>
                </div>
                <input
                  type="range"
                  min={0.02}
                  max={0.1}
                  step={0.01}
                  value={flagWidth}
                  disabled={isRunning}
                  onChange={(e) => {
                    setFlagWidth(parseFloat(e.target.value));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-[10px] text-slate-500">Chuẩn SGK: d = 0,05m (5cm)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Bảng 29.2 SGK */}
      {activeTab === "table29_2" && (
        <div className="space-y-3 bg-slate-950/90 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TableIcon className="w-4 h-4 text-emerald-400" />
                BẢNG 29.2. KẾT QUẢ THÍ NGHIỆM VA CHẠM MỀM GIỮA HAI XE TRƯỢT
              </h4>
              <p className="text-xs text-slate-400">
                (Theo sách giáo khoa Vật lí 10 - Kết nối tri thức với cuộc sống, trang 114)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportToCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                Xuất file Excel / CSV
              </button>
              <button
                onClick={() => setRecords([])}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition"
              >
                Xóa bảng
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-200 border-collapse border border-slate-800">
              <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] tracking-wider">
                <tr>
                  <th rowSpan={2} className="border border-slate-800 p-2 text-center">Lần</th>
                  <th colSpan={3} className="border border-slate-800 p-2 text-center bg-blue-950/40">Khối lượng (kg)</th>
                  <th colSpan={4} className="border border-slate-800 p-2 text-center bg-sky-950/40">Trước va chạm (Xe 1)</th>
                  <th colSpan={3} className="border border-slate-800 p-2 text-center bg-emerald-950/40">Sau va chạm (Hệ 2 xe dính nhau)</th>
                  <th rowSpan={2} className="border border-slate-800 p-2 text-center bg-amber-950/60">
                    Hao hụt <MathText inline>{"$\\Delta W_đ$"}</MathText> (J)
                  </th>
                  <th rowSpan={2} className="border border-slate-800 p-2 text-center bg-emerald-950/60">
                    Sai số <MathText inline>{"$\\delta$"}</MathText> (%)
                  </th>
                </tr>
                <tr>
                  <th className="border border-slate-800 p-1.5 text-center">m₁</th>
                  <th className="border border-slate-800 p-1.5 text-center">m₂</th>
                  <th className="border border-slate-800 p-1.5 text-center font-bold">m₁+m₂</th>
                  <th className="border border-slate-800 p-1.5 text-center">t₁ (s)</th>
                  <th className="border border-slate-800 p-1.5 text-center">v₁ (m/s)</th>
                  <th className="border border-slate-800 p-1.5 text-center font-bold text-sky-400">p_trước (kg·m/s)</th>
                  <th className="border border-slate-800 p-1.5 text-center">Wđ_trước (J)</th>
                  <th className="border border-slate-800 p-1.5 text-center">t' (s)</th>
                  <th className="border border-slate-800 p-1.5 text-center">v (m/s)</th>
                  <th className="border border-slate-800 p-1.5 text-center font-bold text-emerald-400">p_sau (kg·m/s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center p-6 text-slate-500">
                      Chưa có số liệu thực nghiệm. Hãy chuyển sang tab mô phỏng và nhấn "Bắt đầu thả xe 1".
                    </td>
                  </tr>
                ) : (
                  records.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-900/60 font-mono">
                      <td className="border border-slate-800 p-2 text-center font-sans font-bold">{idx + 1}</td>
                      <td className="border border-slate-800 p-2 text-center">{r.m1}</td>
                      <td className="border border-slate-800 p-2 text-center">{r.m2}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-purple-300">{r.totalM}</td>
                      <td className="border border-slate-800 p-2 text-center text-sky-300">{r.t1}</td>
                      <td className="border border-slate-800 p-2 text-center">{r.v1}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-sky-400">{r.pBefore}</td>
                      <td className="border border-slate-800 p-2 text-center text-slate-400">{r.wBefore}</td>
                      <td className="border border-slate-800 p-2 text-center text-emerald-300">{r.tPrime}</td>
                      <td className="border border-slate-800 p-2 text-center">{r.vPrime}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-emerald-400">{r.pAfter}</td>
                      <td className="border border-slate-800 p-2 text-center text-amber-300">{r.deltaW}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-emerald-400">
                        {r.errorPercent}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-emerald-400">★ Kết luận rút ra từ Bảng 29.2:</p>
            <p>
              1. Trong va chạm mềm, tổng động lượng của hệ trước va chạm và sau va chạm bằng nhau: <MathText inline>{"$m_1 v_1 = (m_1 + m_2)v$"}</MathText>. Định luật bảo toàn động lượng hoàn toàn được nghiệm đúng!
            </p>
            <p>
              2. Động năng của hệ sau va chạm luôn nhỏ hơn trước va chạm (<MathText inline>{"$W_{\\text{đ, sau}} < W_{\\text{đ, trước}}$"}</MathText>). Phần động năng tiêu tán chuyển thành nhiệt năng làm nóng các vật và công làm dính biến dạng hai xe.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Phân tích năng lượng tiêu tán */}
      {activeTab === "energy_analysis" && (
        <div className="space-y-4 bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Flame className="w-4 h-4 text-amber-400" />
            PHÂN TÍCH TIÊU TÁN NĂNG LƯỢNG TRONG VA CHẠM MỀM (THEO BÀI 29 SGK KNTT)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Energy bar visualizer */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Biểu đồ phân phối năng lượng:</span>
                <span className="text-[11px] text-slate-400 font-mono">Tổng ban đầu: {wBeforeTheoretical.toFixed(4)} J</span>
              </div>

              {/* Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-emerald-400">Động năng còn lại (<MathText inline>{"$W_{\\text{đ, sau}}$"}</MathText>):</span>
                  <span className="font-mono">{wAfterTheoretical.toFixed(4)} J ({(100 - energyLossPercent).toFixed(1)}%)</span>
                </div>
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${100 - energyLossPercent}%` }}
                    className="h-full bg-emerald-500 transition-all duration-300"
                  />
                  <div
                    style={{ width: `${energyLossPercent}%` }}
                    className="h-full bg-amber-500 transition-all duration-300"
                  />
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-amber-400">Nhiệt năng & Công biến dạng kết dính (<MathText inline>{"$Q = \\Delta W_đ$"}</MathText>):</span>
                  <span className="font-mono">{deltaWTheoretical.toFixed(4)} J ({energyLossPercent}%)</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-[11px]">
                <p className="text-slate-400">Tỉ số động năng sau và trước va chạm:</p>
                <div className="font-mono text-sky-300">
                  <MathText inline>{"$\\frac{W_{\\text{đ, sau}}}{W_{\\text{đ, trước}}} = \\frac{m_1}{m_1 + m_2}$"}</MathText>
                  {" = "}
                  <span className="text-white font-bold">{((m1 / (m1 + m2)) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Practical insight: Vụ va chạm ô tô tải và xe máy */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Giải thích tình huống thực tế (Xe tải và xe máy):</span>
              </div>
              <p className="text-justify leading-relaxed">
                Khi ô tô tải (<MathText inline>{"$m_1 \\approx 10.000\\text{ kg}$"}</MathText>) va chạm với xe máy (<MathText inline>{"$m_2 \\approx 100\\text{ kg}$"}</MathText>):
              </p>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 space-y-1 font-mono text-[11px]">
                <p><MathText inline>{"$v = \\frac{m_1}{m_1 + m_2} v_1 = \\frac{10.000}{10.100} v_1 \\approx 0,99 \\cdot v_1$"}</MathText></p>
              </div>
              <p className="text-slate-300 leading-relaxed text-justify">
                Vận tốc của xe tải gần như không thay đổi, trong khi xe máy bị cuốn theo và thay đổi vận tốc đột ngột từ <MathText inline>{"$0$"}</MathText> lên gần bằng <MathText inline>{"$v_1$"}</MathText>! Điều này giải thích chính xác hiện tượng mâu thuẫn nhận thức xuất phát trong Bài 29!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Cơ sở lí thuyết */}
      {activeTab === "theory" && (
        <div className="space-y-3 bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 text-emerald-400" />
            CƠ SỞ VẬT LÍ CỦA THÍ NGHIỆM VA CHẠM MỀM (SGK TRANG 114)
          </h4>

          <div className="space-y-2">
            <p className="font-bold text-emerald-400">1. Khái niệm va chạm mềm:</p>
            <p className="text-justify pl-3">
              Va chạm mềm là loại va chạm mà sau khi va chạm, hai vật dính chặt vào nhau và cùng chuyển động với một vận tốc chung <MathText inline>{"$\\vec{v}$"}</MathText>.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-sky-400">2. Định luật bảo toàn động lượng:</p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono space-y-1.5 pl-4">
              <p><MathText inline>{"$m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = (m_1 + m_2)\\vec{v}$"}</MathText></p>
              <p>Khi vật 2 ban đầu đứng yên (<MathText inline>{"$\\vec{v}_2 = \\vec{0}$"}</MathText>):</p>
              <p><MathText inline>{"$\\vec{v} = \\frac{m_1}{m_1 + m_2} \\vec{v}_1$"}</MathText></p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-amber-400">3. Độ biến thiên động năng:</p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono space-y-1.5 pl-4">
              <p><MathText inline>{"$W_{\\text{đ, sau}} = \\frac{1}{2}(m_1 + m_2) v^2 = \\frac{m_1}{m_1 + m_2} W_{\\text{đ, trước}} < W_{\\text{đ, trước}}$"}</MathText></p>
              <p><MathText inline>{"$\\Delta W_đ = W_{\\text{đ, trước}} - W_{\\text{đ, sau}} = \\frac{1}{2}\\frac{m_1 m_2}{m_1 + m_2} v_1^2 > 0$"}</MathText></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

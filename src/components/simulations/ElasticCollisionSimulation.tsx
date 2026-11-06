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
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { MathText } from "../MathText";

export interface ElasticExperimentRecord {
  id: number;
  testTime: string;
  m1: number; // kg
  m2: number; // kg
  d: number; // m
  t1: number; // s (thời gian chắn sáng xe 1 qua cổng A trước va chạm)
  v1: number; // m/s
  p1: number; // kg.m/s
  t2: number; // s (thời gian chắn sáng xe 2 nếu có)
  v2: number; // m/s
  p2: number; // kg.m/s
  pBefore: number; // kg.m/s
  wBefore: number; // J
  t1Prime: number | null; // s (xe 1 sau va chạm qua cổng A hoặc B)
  v1Prime: number; // m/s
  p1Prime: number; // kg.m/s
  t2Prime: number; // s (xe 2 sau va chạm qua cổng B)
  v2Prime: number; // m/s
  p2Prime: number; // kg.m/s
  pAfter: number; // kg.m/s
  wAfter: number; // J
  deltaP: number; // kg.m/s
  errorPercent: number; // %
}

export const ElasticCollisionSimulation: React.FC = () => {
  // Parameters
  const [m1, setM1] = useState<number>(0.4); // kg (400g)
  const [m2, setM2] = useState<number>(0.4); // kg (400g)
  const [initialV1, setInitialV1] = useState<number>(0.6); // m/s
  const [initialV2, setInitialV2] = useState<number>(0.0); // m/s (SGK tr. 114: xe 2 đứng yên)
  const [flagWidth, setFlagWidth] = useState<number>(0.05); // m (5cm)
  const [isAirCushionOn, setIsAirCushionOn] = useState<boolean>(true); // Đệm không khí (băng đệm khí)

  // Simulation run state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);

  // Positions on track (in meters, track is 1.6m)
  // Track visual width 720px representing 1.6m => pxPerMeter = 450
  const pxPerMeter = 450;
  const initialPos1 = 0.15; // m (trước cổng A)
  const initialPos2 = 0.75; // m (giữa cổng A và B)
  const [pos1, setPos1] = useState<number>(initialPos1);
  const [pos2, setPos2] = useState<number>(initialPos2);
  const [currentV1, setCurrentV1] = useState<number>(initialV1);
  const [currentV2, setCurrentV2] = useState<number>(initialV2);

  // Photogates positions
  const gateAX = 0.45; // Cổng quang điện A tại 0.45 m
  const gateBX = 1.15; // Cổng quang điện B tại 1.15 m
  const cartLength = 0.14; // Chiều dài xe trượt 14cm

  // Photogate light barrier states
  const [gateAActive, setGateAActive] = useState<boolean>(false);
  const [gateBActive, setGateBActive] = useState<boolean>(false);

  // Timer readings (hiển thị đồng hồ hiện số)
  const [measuredT1, setMeasuredT1] = useState<number | null>(null);
  const [measuredT1Prime, setMeasuredT1Prime] = useState<number | null>(null);
  const [measuredT2Prime, setMeasuredT2Prime] = useState<number | null>(null);

  // Collision state
  const [hasCollided, setHasCollided] = useState<boolean>(false);
  const [springCompression, setSpringCompression] = useState<number>(0);

  // Data table state (Bảng 29.1 SGK Vật lí 10)
  const [records, setRecords] = useState<ElasticExperimentRecord[]>([
    {
      id: 1,
      testTime: "08:15",
      m1: 0.4,
      m2: 0.4,
      d: 0.05,
      t1: 0.083,
      v1: 0.6,
      p1: 0.24,
      t2: 0,
      v2: 0,
      pBefore: 0.24,
      wBefore: 0.072,
      t1Prime: null,
      v1Prime: 0.0,
      p1Prime: 0.0,
      t2Prime: 0.083,
      v2Prime: 0.6,
      p2Prime: 0.24,
      pAfter: 0.24,
      wAfter: 0.072,
      deltaP: 0.0,
      errorPercent: 0.0,
    },
  ]);

  // Sub-view tabs
  const [activeTab, setActiveTab] = useState<"visual" | "table29_1" | "theory">("visual");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play soft collision sound
  const playCollisionSound = () => {
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
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio not permitted or not supported
    }
  };

  // Theoretical calculations
  // Elastic 1D collision formulas:
  // v1' = [(m1 - m2)v1 + 2m2 v2] / (m1 + m2)
  // v2' = [2m1 v1 + (m2 - m1)v2] / (m1 + m2)
  const theoreticalV1Prime = Number(
    (((m1 - m2) * initialV1 + 2 * m2 * initialV2) / (m1 + m2)).toFixed(3)
  );
  const theoreticalV2Prime = Number(
    ((2 * m1 * initialV1 + (m2 - m1) * initialV2) / (m1 + m2)).toFixed(3)
  );

  const pBeforeTheoretical = Number((m1 * initialV1 + m2 * initialV2).toFixed(3));
  const pAfterTheoretical = Number((m1 * theoreticalV1Prime + m2 * theoreticalV2Prime).toFixed(3));
  const wBeforeTheoretical = Number(
    (0.5 * m1 * initialV1 * initialV1 + 0.5 * m2 * initialV2 * initialV2).toFixed(4)
  );
  const wAfterTheoretical = Number(
    (0.5 * m1 * theoreticalV1Prime * theoreticalV1Prime + 0.5 * m2 * theoreticalV2Prime * theoreticalV2Prime).toFixed(4)
  );

  // Physics animation loop
  useEffect(() => {
    if (!isRunning) return;

    let p1Current = pos1;
    let p2Current = pos2;
    let v1Current = currentV1;
    let v2Current = currentV2;
    let collided = hasCollided;
    let localTime = simTime;
    let lastTime = performance.now();

    // Measurement tracking
    let gate1Recorded = measuredT1 !== null;
    let gate2PrimeRecorded = measuredT2Prime !== null;
    let gate1PrimeRecorded = measuredT1Prime !== null;

    let animationFrameId: number;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.035);
      lastTime = now;
      localTime += dt;
      setSimTime(localTime);

      // Effect of air cushion (friction)
      const frictionDecel = isAirCushionOn ? 0.0 : 0.25; // m/s^2 deceleration if air pump off

      if (!isAirCushionOn) {
        if (Math.abs(v1Current) > 0.01) {
          v1Current -= Math.sign(v1Current) * frictionDecel * dt;
        } else v1Current = 0;

        if (Math.abs(v2Current) > 0.01) {
          v2Current -= Math.sign(v2Current) * frictionDecel * dt;
        } else v2Current = 0;
      }

      // Update positions
      p1Current += v1Current * dt;
      p2Current += v2Current * dt;

      // Check collision between Cart 1 and Cart 2
      // Collision happens when front of Cart 1 reaches back of Cart 2
      const distanceBetweenCenters = p2Current - p1Current;
      if (!collided && distanceBetweenCenters <= cartLength) {
        // Elastic collision occurs
        collided = true;
        setHasCollided(true);
        setSpringCompression(1);
        playCollisionSound();

        const v1P = ((m1 - m2) * v1Current + 2 * m2 * v2Current) / (m1 + m2);
        const v2P = (2 * m1 * v1Current + (m2 - m1) * v2Current) / (m1 + m2);

        v1Current = v1P;
        v2Current = v2P;

        // Separate slightly to avoid continuous collision jitter
        p1Current = p2Current - cartLength - 0.002;
      } else if (collided) {
        setSpringCompression((prev) => Math.max(0, prev - dt * 6));
      }

      // Check Gate A trigger
      // Photogate beam is at gateAX.
      // Cart 1 flag is located in center of Cart 1: [p1Current - flagWidth/2, p1Current + flagWidth/2]
      const flag1Start = p1Current - flagWidth / 2;
      const flag1End = p1Current + flagWidth / 2;
      const isCart1AtGateA = flag1Start <= gateAX && flag1End >= gateAX;
      const isCart2AtGateA = p2Current - flagWidth / 2 <= gateAX && p2Current + flagWidth / 2 >= gateAX;
      const beamABlocked = isCart1AtGateA || isCart2AtGateA;
      setGateAActive(beamABlocked);

      if (isCart1AtGateA && !gate1Recorded && !collided) {
        const measuredTime = Number((flagWidth / Math.abs(v1Current || initialV1)).toFixed(3));
        setMeasuredT1(measuredTime);
        gate1Recorded = true;
      } else if (isCart1AtGateA && collided && !gate1PrimeRecorded && Math.abs(v1Current) > 0.02) {
        // Cart 1 rebounding back through Gate A
        const measuredTime = Number((flagWidth / Math.abs(v1Current)).toFixed(3));
        setMeasuredT1Prime(measuredTime);
        gate1PrimeRecorded = true;
      }

      // Check Gate B trigger
      const isCart1AtGateB = flag1Start <= gateBX && flag1End >= gateBX;
      const isCart2AtGateB = p2Current - flagWidth / 2 <= gateBX && p2Current + flagWidth / 2 >= gateBX;
      const beamBBlocked = isCart1AtGateB || isCart2AtGateB;
      setGateBActive(beamBBlocked);

      if (isCart2AtGateB && !gate2PrimeRecorded && collided) {
        const measuredTime = Number((flagWidth / Math.abs(v2Current)).toFixed(3));
        setMeasuredT2Prime(measuredTime);
        gate2PrimeRecorded = true;

        // Auto log experiment to table
        const v1Measured = measuredT1 ? flagWidth / measuredT1 : initialV1;
        const v2PrimeMeasured = flagWidth / measuredTime;
        const v1PrimeMeasured = theoreticalV1Prime;

        const pBefore = m1 * v1Measured + m2 * initialV2;
        const pAfter = m1 * v1PrimeMeasured + m2 * v2PrimeMeasured;
        const err = pBefore > 0 ? Number(((Math.abs(pAfter - pBefore) / pBefore) * 100).toFixed(2)) : 0;

        const newEntry: ElasticExperimentRecord = {
          id: Date.now(),
          testTime: new Date().toLocaleTimeString("vi-VN", { minute: "2-digit", second: "2-digit" }),
          m1,
          m2,
          d: flagWidth,
          t1: measuredT1 || Number((flagWidth / initialV1).toFixed(3)),
          v1: Number(v1Measured.toFixed(3)),
          p1: Number((m1 * v1Measured).toFixed(3)),
          t2: 0,
          v2: initialV2,
          p2: Number((m2 * initialV2).toFixed(3)),
          pBefore: Number(pBefore.toFixed(3)),
          wBefore: Number((0.5 * m1 * v1Measured * v1Measured).toFixed(4)),
          t1Prime: Math.abs(v1PrimeMeasured) > 0.01 ? Number((flagWidth / Math.abs(v1PrimeMeasured)).toFixed(3)) : null,
          v1Prime: Number(v1PrimeMeasured.toFixed(3)),
          p1Prime: Number((m1 * v1PrimeMeasured).toFixed(3)),
          t2Prime: measuredTime,
          v2Prime: Number(v2PrimeMeasured.toFixed(3)),
          p2Prime: Number((m2 * v2PrimeMeasured).toFixed(3)),
          pAfter: Number(pAfter.toFixed(3)),
          wAfter: Number((0.5 * m1 * v1PrimeMeasured * v1PrimeMeasured + 0.5 * m2 * v2PrimeMeasured * v2PrimeMeasured).toFixed(4)),
          deltaP: Number(Math.abs(pAfter - pBefore).toFixed(3)),
          errorPercent: err,
        };

        setRecords((prev) => [newEntry, ...prev.slice(0, 7)]);
      }

      // Stop condition when carts leave the track
      if (p2Current > 1.5 || p1Current < 0.02 || (collided && p1Current > 1.45)) {
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
  }, [isRunning, hasCollided, isAirCushionOn, m1, m2, initialV1, initialV2, flagWidth, measuredT1, measuredT2Prime, measuredT1Prime]);

  // Reset simulation
  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setPos1(initialPos1);
    setPos2(initialPos2);
    setCurrentV1(initialV1);
    setCurrentV2(initialV2);
    setSimTime(0);
    setHasCollided(false);
    setSpringCompression(0);
    setGateAActive(false);
    setGateBActive(false);
    setMeasuredT1(null);
    setMeasuredT1Prime(null);
    setMeasuredT2Prime(null);
  };

  // Apply textbook presets
  const applyPreset = (type: "equal" | "m1_greater" | "m1_smaller") => {
    handleReset();
    if (type === "equal") {
      // m1 = m2 = 0.4kg => v1' = 0, v2' = v1
      setM1(0.4);
      setM2(0.4);
      setInitialV1(0.6);
      setInitialV2(0);
    } else if (type === "m1_greater") {
      // m1 = 0.6kg, m2 = 0.3kg (m1 > m2) => v1' > 0
      setM1(0.6);
      setM2(0.3);
      setInitialV1(0.6);
      setInitialV2(0);
    } else if (type === "m1_smaller") {
      // m1 = 0.2kg, m2 = 0.6kg (m1 < m2) => v1' < 0 (bật ngược lại)
      setM1(0.2);
      setM2(0.6);
      setInitialV1(0.6);
      setInitialV2(0);
    }
  };

  // Export CSV
  const exportToCsv = () => {
    let csv =
      "STT,ThoiGian,m1(kg),m2(kg),d(m),t1(s),v1(m/s),p1(kg.m/s),p_truoc(kg.m/s),Wd_truoc(J),t1'(s),v1'(m/s),t2'(s),v2'(m/s),p_sau(kg.m/s),Wd_sau(J),SaiSo(%)\n";
    records.forEach((r, idx) => {
      csv += `${idx + 1},${r.testTime},${r.m1},${r.m2},${r.d},${r.t1},${r.v1},${r.p1},${r.pBefore},${r.wBefore},${r.t1Prime || ""},${r.v1Prime},${r.t2Prime},${r.v2Prime},${r.pAfter},${r.wAfter},${r.errorPercent}%\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Bang_29.1_Va_Cham_Dan_Hoi_SGK_VatLi10.csv");
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

    // Clear background
    ctx.fillStyle = "#0f172a"; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Track baseline
    const trackY = 160;
    const trackStartX = 25;
    const trackEndX = width - 25;
    const trackLengthM = 1.6;
    const scale = (trackEndX - trackStartX) / trackLengthM;

    // 1. Draw Air Track (Băng đệm không khí)
    ctx.fillStyle = "#334155"; // slate-700
    ctx.fillRect(trackStartX, trackY, trackEndX - trackStartX, 22);

    // Track border & metal reflection
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.strokeRect(trackStartX, trackY, trackEndX - trackStartX, 22);

    // Air holes on track & air puffs if air cushion is ON
    const numHoles = 32;
    const holeSpacing = (trackEndX - trackStartX) / numHoles;
    for (let i = 1; i < numHoles; i++) {
      const hx = trackStartX + i * holeSpacing;
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(hx, trackY + 4, 1.5, 0, Math.PI * 2);
      ctx.fill();

      if (isAirCushionOn && isRunning) {
        // Air steam particle
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.beginPath();
        ctx.moveTo(hx, trackY);
        ctx.lineTo(hx, trackY - 4 - Math.sin(Date.now() / 100 + i) * 2);
        ctx.stroke();
      }
    }

    // Centimeter ruler ticks on track
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

    // 2. Photogates (Cổng quang điện A & B)
    const drawPhotogate = (mPos: number, label: string, isActive: boolean) => {
      const gx = trackStartX + mPos * scale;

      // Gate vertical post
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.fillRect(gx - 5, trackY - 75, 10, 80);
      ctx.strokeRect(gx - 5, trackY - 75, 10, 80);

      // Gate upper sensor head (U-shaped arch)
      ctx.fillStyle = "#0284c7"; // sky-600
      ctx.fillRect(gx - 12, trackY - 88, 24, 15);

      // Infrared sensor beam line
      ctx.strokeStyle = isActive ? "#ef4444" : "rgba(239, 68, 68, 0.35)";
      ctx.lineWidth = isActive ? 2.5 : 1;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(gx, trackY - 70);
      ctx.lineTo(gx, trackY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Status LED indicator
      ctx.fillStyle = isActive ? "#ef4444" : "#10b981"; // Red if blocked, green if clear
      ctx.beginPath();
      ctx.arc(gx, trackY - 80, 4, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px 'Times New Roman', serif";
      ctx.fillText(label, gx, trackY - 95);
    };

    drawPhotogate(gateAX, "CỔNG A (0.45m)", gateAActive);
    drawPhotogate(gateBX, "CỔNG B (1.15m)", gateBActive);

    // 3. Draw Carts (Xe trượt 1 & 2)
    const drawCart = (
      mPos: number,
      m: number,
      v: number,
      color: string,
      label: string,
      springOnRight: boolean,
      springOnLeft: boolean
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

      // Glider bottom air runners (chân trượt đệm khí)
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(cartX + 6, trackY - 3, cartWPx - 12, 3);

      // Photogate flag (Tấm chắn sáng màu đen gắn ở giữa xe)
      const flagWPx = flagWidth * scale;
      const flagHPx = 26;
      ctx.fillStyle = "#0f172a"; // dark black
      ctx.fillRect(cx - flagWPx / 2, cartY - flagHPx, flagWPx, flagHPx);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - flagWPx / 2, cartY - flagHPx, flagWPx, flagHPx);

      // Flag dimension label
      ctx.fillStyle = "#38bdf8";
      ctx.font = "9px 'Times New Roman', serif";
      ctx.fillText(`d=${flagWidth}m`, cx, cartY - flagHPx - 4);

      // Spring bumper (Lò xo đàn hồi)
      if (springOnRight) {
        const springX = cartX + cartWPx;
        const springLen = 14 * (1 - springCompression * 0.45);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          const sx = springX + (s * springLen) / 5;
          const sy = cartY + 12 + (s % 2 === 0 ? -6 : 6);
          if (s === 0) ctx.moveTo(springX, cartY + 12);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      if (springOnLeft) {
        const springX = cartX;
        const springLen = 14 * (1 - springCompression * 0.45);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          const sx = springX - (s * springLen) / 5;
          const sy = cartY + 12 + (s % 2 === 0 ? -6 : 6);
          if (s === 0) ctx.moveTo(springX, cartY + 12);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      // Cart text label inside
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.fillText(`${label} (${m}kg)`, cx, cartY + 16);

      // Velocity & Momentum Vector Arrow
      if (Math.abs(v) > 0.03) {
        const arrowLength = v * 50;
        const arrowY = cartY - 36;
        ctx.strokeStyle = "#38bdf8";
        ctx.fillStyle = "#38bdf8";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, arrowY);
        ctx.lineTo(cx + arrowLength, arrowY);
        ctx.stroke();

        // Arrow tip
        const dir = Math.sign(arrowLength);
        ctx.beginPath();
        ctx.moveTo(cx + arrowLength, arrowY);
        ctx.lineTo(cx + arrowLength - dir * 6, arrowY - 4);
        ctx.lineTo(cx + arrowLength - dir * 6, arrowY + 4);
        ctx.fill();

        // Vector label
        ctx.font = "italic 11px 'Times New Roman', serif";
        ctx.fillText(`v=${v.toFixed(2)}m/s`, cx + arrowLength / 2, arrowY - 6);
      }
    };

    // Draw Cart 1 (Blue)
    drawCart(pos1, m1, currentV1, "#2563eb", "Xe 1", true, false);

    // Draw Cart 2 (Amber/Orange)
    drawCart(pos2, m2, currentV2, "#d97706", "Xe 2", false, true);
  }, [pos1, pos2, currentV1, currentV2, m1, m2, flagWidth, isAirCushionOn, isRunning, springCompression, gateAActive, gateBActive]);

  return (
    <div id="elastic-collision-sim-root" className="bg-slate-900 text-slate-100 rounded-2xl p-4 md:p-6 border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Thí nghiệm 1 - SGK Vật lí 10 (KNTT) Trang 114 - Bài 29</span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            MÔ PHỎNG THÍ NGHIỆM VA CHẠM ĐÀN HỒI HAI XE TRÊN ĐỆM KHÍ
          </h3>
          <p className="text-xs text-slate-400">
            Nghiệm lại định luật bảo toàn động lượng: <MathText inline>{"$\\vec{p}_{\\text{trước}} = \\vec{p}_{\\text{sau}}$"}</MathText> và bảo toàn động năng <MathText inline>{"$W_{\\text{đ, trước}} = W_{\\text{đ, sau}}$"}</MathText>
          </p>
        </div>

        {/* Preset scenario buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Kịch bản chuẩn:</span>
          <button
            onClick={() => applyPreset("equal")}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded border border-slate-700 transition"
            title="Xe 1 dừng lại, xe 2 nhận trọn vận tốc"
          >
            <MathText inline>{"$m_1 = m_2$"}</MathText> (Truyền vận tốc)
          </button>
          <button
            onClick={() => applyPreset("m1_greater")}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700 transition"
            title="Xe 1 tiếp tục tiến tới với tốc độ nhỏ hơn"
          >
            <MathText inline>{"$m_1 > m_2$"}</MathText> (Tiến cùng chiều)
          </button>
          <button
            onClick={() => applyPreset("m1_smaller")}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 transition"
            title="Xe 1 bật dội ngược chiều"
          >
            <MathText inline>{"$m_1 < m_2$"}</MathText> (Bật dội ngược)
          </button>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab("visual")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === "visual"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Phòng thí nghiệm ảo & Băng đệm khí
        </button>
        <button
          onClick={() => setActiveTab("table29_1")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === "table29_1"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          Bảng 29.1 (SGK Vật lí 10)
        </button>
        <button
          onClick={() => setActiveTab("theory")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === "theory"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          Cơ sở lí thuyết & Công thức tính toán
        </button>
      </div>

      {activeTab === "visual" && (
        <div className="space-y-4">
          {/* Canvas Viewport */}
          <div className="relative bg-slate-950 rounded-xl p-2 border border-slate-800 overflow-hidden">
            {/* Top digital timer readings overlay */}
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

              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40 text-xs">
                <span className="text-slate-400 text-[10px] block">ĐỒNG HỒ ĐO HIỆN SỐ - CỔNG B:</span>
                <span className="font-mono text-amber-300 font-bold text-sm">
                  {measuredT2Prime !== null ? `${measuredT2Prime.toFixed(3)} s` : "--- s"}
                </span>
                {measuredT2Prime && (
                  <span className="text-[10px] text-slate-400 ml-1.5">
                    (v₂' = {(flagWidth / measuredT2Prime).toFixed(2)} m/s)
                  </span>
                )}
              </div>

              {measuredT1Prime && (
                <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-500/40 text-xs">
                  <span className="text-slate-400 text-[10px] block">XE 1 DỘI QUA CỔNG A:</span>
                  <span className="font-mono text-purple-300 font-bold text-sm">
                    {measuredT1Prime.toFixed(3)} s
                  </span>
                </div>
              )}
            </div>

            {/* Canvas */}
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
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Xe 2: m₂={m2}kg
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span> Tấm chắn sáng d={flagWidth}m
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Thời gian mô phỏng: {simTime.toFixed(2)}s</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${hasCollided ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-slate-800 text-slate-300"}`}>
                  {hasCollided ? "✓ Đã xảy ra va chạm đàn hồi" : "Đang chờ va chạm..."}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Comparison Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Trước va chạm */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-sky-400 flex items-center justify-between">
                <span>1. TRƯỚC VA CHẠM</span>
                <span className="text-[10px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-300">Lí thuyết & Đo</span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vận tốc Xe 1 (<MathText inline>{"$v_1$"}</MathText>):</span>
                  <span className="font-mono text-white font-medium">{initialV1.toFixed(2)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vận tốc Xe 2 (<MathText inline>{"$v_2$"}</MathText>):</span>
                  <span className="font-mono text-white font-medium">{initialV2.toFixed(2)} m/s (đứng yên)</span>
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

            {/* Sau va chạm */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
                <span>2. SAU VA CHẠM ĐÀN HỒI</span>
                <span className="text-[10px] bg-amber-950 px-1.5 py-0.5 rounded text-amber-300">Đo thực nghiệm</span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vận tốc Xe 1 (<MathText inline>{"$v'_1$"}</MathText>):</span>
                  <span className="font-mono text-white font-medium">{theoreticalV1Prime.toFixed(2)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vận tốc Xe 2 (<MathText inline>{"$v'_2$"}</MathText>):</span>
                  <span className="font-mono text-white font-medium">{theoreticalV2Prime.toFixed(2)} m/s</span>
                </div>
                <div className="border-t border-slate-800 pt-1 flex justify-between font-bold text-amber-300">
                  <span>Tổng động lượng <MathText inline>{"$p_{\\text{sau}}$"}</MathText>:</span>
                  <span className="font-mono">{pAfterTheoretical.toFixed(3)} kg·m/s</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Động năng <MathText inline>{"$W_{\\text{đ, sau}}$"}</MathText>:</span>
                  <span className="font-mono">{wAfterTheoretical.toFixed(4)} J</span>
                </div>
              </div>
            </div>

            {/* Kết luận kiểm chứng */}
            <div className="bg-gradient-to-br from-slate-950 to-emerald-950/40 p-3.5 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3. ĐÁNH GIÁ & KIỂM CHỨNG</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Độ chênh lệch <MathText inline>{"$\\Delta p$"}</MathText>:</span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {Math.abs(pAfterTheoretical - pBeforeTheoretical).toFixed(4)} kg·m/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sai số tỉ đối (<MathText inline>{"$\\delta$"}</MathText>):</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {pBeforeTheoretical > 0 ? `${((Math.abs(pAfterTheoretical - pBeforeTheoretical) / pBeforeTheoretical) * 100).toFixed(2)}%` : "0.00%"}
                  </span>
                </div>
                <div className="p-1.5 bg-emerald-900/30 rounded border border-emerald-700/40 text-[11px] text-emerald-200 leading-tight">
                  ✓ <strong>Động lượng bảo toàn:</strong> <MathText inline>{"$p_{\\text{trước}} \\approx p_{\\text{sau}}$"}</MathText><br />
                  ✓ <strong>Động năng bảo toàn:</strong> <MathText inline>{"$W_{\\text{đ, trước}} \\approx W_{\\text{đ, sau}}$"}</MathText>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls Panel */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              {/* Play / Pause / Reset Buttons */}
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

              {/* Air pump toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAirCushionOn(!isAirCushionOn)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    isAirCushionOn
                      ? "bg-sky-950 text-sky-300 border-sky-600"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                  title="Bật quạt thổi đệm khí để triệt tiêu ma sát trên băng đệm khí"
                >
                  <Wind className={`w-3.5 h-3.5 ${isAirCushionOn ? "animate-spin text-sky-400" : ""}`} />
                  Bơm khí đệm: {isAirCushionOn ? "BẬT (Khử ma sát - Hệ kín)" : "TẮT (Có ma sát)"}
                </button>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-800 text-xs">
              {/* m1 */}
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

              {/* m2 */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Khối lượng Xe 2 (<MathText inline>{"$m_2$"}</MathText>):</span>
                  <span className="font-mono text-amber-400 font-bold">{m2.toFixed(2)} kg</span>
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
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-slate-500">Gia tải xe 2 (100g - 1000g)</span>
              </div>

              {/* Initial speed v1 */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Vận tốc ban đầu Xe 1 (<MathText inline>{"$v_1$"}</MathText>):</span>
                  <span className="font-mono text-emerald-400 font-bold">{initialV1.toFixed(2)} m/s</span>
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
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Đẩy xe 1 trước cổng A</span>
              </div>

              {/* Flag width d */}
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

      {/* Tab: Bảng 29.1 SGK */}
      {activeTab === "table29_1" && (
        <div className="space-y-3 bg-slate-950/90 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TableIcon className="w-4 h-4 text-sky-400" />
                BẢNG 29.1. KẾT QUẢ THÍ NGHIỆM VA CHẠM ĐÀN HỒI GIỮA HAI XE TRƯỢT
              </h4>
              <p className="text-xs text-slate-400">
                (Theo sách giáo khoa Vật lí 10 - Kết nối tri thức với cuộc sống, trang 114)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportToCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold transition"
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
                  <th colSpan={2} className="border border-slate-800 p-2 text-center bg-blue-950/40">Khối lượng (kg)</th>
                  <th colSpan={4} className="border border-slate-800 p-2 text-center bg-sky-950/40">Trước va chạm</th>
                  <th colSpan={4} className="border border-slate-800 p-2 text-center bg-amber-950/40">Sau va chạm</th>
                  <th rowSpan={2} className="border border-slate-800 p-2 text-center bg-emerald-950/60">
                    Sai số <MathText inline>{"$\\delta$"}</MathText> (%)
                  </th>
                </tr>
                <tr>
                  <th className="border border-slate-800 p-1.5 text-center">m₁</th>
                  <th className="border border-slate-800 p-1.5 text-center">m₂</th>
                  <th className="border border-slate-800 p-1.5 text-center">t₁ (s)</th>
                  <th className="border border-slate-800 p-1.5 text-center">v₁ (m/s)</th>
                  <th className="border border-slate-800 p-1.5 text-center font-bold text-sky-400">p_trước (kg·m/s)</th>
                  <th className="border border-slate-800 p-1.5 text-center">Wđ_trước (J)</th>
                  <th className="border border-slate-800 p-1.5 text-center">v₁' (m/s)</th>
                  <th className="border border-slate-800 p-1.5 text-center">v₂' (m/s)</th>
                  <th className="border border-slate-800 p-1.5 text-center font-bold text-amber-400">p_sau (kg·m/s)</th>
                  <th className="border border-slate-800 p-1.5 text-center">Wđ_sau (J)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center p-6 text-slate-500">
                      Chưa có số liệu thực nghiệm. Hãy chuyển sang tab mô phỏng và nhấn "Bắt đầu thả xe 1".
                    </td>
                  </tr>
                ) : (
                  records.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-900/60 font-mono">
                      <td className="border border-slate-800 p-2 text-center font-sans font-bold">{idx + 1}</td>
                      <td className="border border-slate-800 p-2 text-center">{r.m1}</td>
                      <td className="border border-slate-800 p-2 text-center">{r.m2}</td>
                      <td className="border border-slate-800 p-2 text-center text-sky-300">{r.t1}</td>
                      <td className="border border-slate-800 p-2 text-center">{r.v1}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-sky-400">{r.pBefore}</td>
                      <td className="border border-slate-800 p-2 text-center text-slate-400">{r.wBefore}</td>
                      <td className="border border-slate-800 p-2 text-center">{r.v1Prime}</td>
                      <td className="border border-slate-800 p-2 text-center">{r.v2Prime}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-amber-400">{r.pAfter}</td>
                      <td className="border border-slate-800 p-2 text-center text-slate-400">{r.wAfter}</td>
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
            <p className="font-semibold text-sky-400">★ Nhận xét rút ra từ Bảng 29.1:</p>
            <p>
              1. Giá trị tổng động lượng của hệ trước va chạm (<MathText inline>{"$p_{\\text{trước}}$"}</MathText>) và sau va chạm (<MathText inline>{"$p_{\\text{sau}}$"}</MathText>) luôn bằng nhau trong phạm vi sai số thực nghiệm cho phép (<MathText inline>{"$\\delta < 1\\%$"}</MathText>).
            </p>
            <p>
              2. Động năng của hệ sau va chạm cũng được bảo toàn (<MathText inline>{"$W_{\\text{đ, sau}} \\approx W_{\\text{đ, trước}}$"}</MathText>), chứng tỏ đây là <strong>va chạm đàn hồi hoàn toàn</strong>, năng lượng cơ học không bị tiêu tán thành nhiệt.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Cơ sở lí thuyết */}
      {activeTab === "theory" && (
        <div className="space-y-3 bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 text-sky-400" />
            CƠ SỞ VẬT LÍ CỦA THÍ NGHIỆM VA CHẠM ĐÀN HỒI (SGK TRANG 114)
          </h4>

          <div className="space-y-2">
            <p className="font-bold text-sky-400">1. Khái niệm va chạm đàn hồi:</p>
            <p className="text-justify pl-3">
              Va chạm đàn hồi là loại va chạm mà trong đó các vật tương tác xuất hiện lực đàn hồi tức thời (lò xo đàn hồi ở đầu xe). Sau va chạm, các vật lấy lại hình dạng ban đầu, tách rời nhau và tiếp tục chuyển động độc lập.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-emerald-400">2. Hai định luật bảo toàn nghiệm đúng trong va chạm đàn hồi:</p>
            <div className="pl-3 space-y-1.5">
              <p>
                • <strong>Bảo toàn động lượng:</strong>{" "}
                <MathText inline>{"$m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = m_1 \\vec{v}'_1 + m_2 \\vec{v}'_2$"}</MathText>
              </p>
              <p>
                • <strong>Bảo toàn động năng:</strong>{" "}
                <MathText inline>{"$\\frac{1}{2} m_1 v_1^2 + \\frac{1}{2} m_2 v_2^2 = \\frac{1}{2} m_1 {v'_1}^2 + \\frac{1}{2} m_2 {v'_2}^2$"}</MathText>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-amber-400">3. Vận tốc của hai xe sau va chạm (khi xe 2 ban đầu đứng yên <MathText inline>{"$v_2 = 0$"}</MathText>):</p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono space-y-1.5 pl-4">
              <p><MathText inline>{"$v'_1 = \\frac{m_1 - m_2}{m_1 + m_2} v_1$"}</MathText></p>
              <p><MathText inline>{"$v'_2 = \\frac{2 m_1}{m_1 + m_2} v_1$"}</MathText></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

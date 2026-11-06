import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Waves } from "lucide-react";

export const HarmonicOscillatorSimulation: React.FC = () => {
  const [amplitude, setAmplitude] = useState<number>(5); // cm
  const [omega, setOmega] = useState<number>(2.0); // rad/s
  const [phase0, setPhase0] = useState<number>(0); // rad
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [oscillatorType, setOscillatorType] = useState<"spring" | "pendulum">("spring");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // x = A cos(omega * t + phi0)
  const currentPhase = omega * time + phase0;
  const currentX = amplitude * Math.cos(currentPhase);
  const currentV = -amplitude * omega * Math.sin(currentPhase);
  const currentA = -amplitude * omega * omega * Math.cos(currentPhase);
  const period = (2 * Math.PI) / omega;
  const frequency = 1 / period;

  const handleReset = () => {
    setTime(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Left side: Physical system (Spring or Pendulum)
    const physX = 140;
    const physY = 110;

    if (oscillatorType === "spring") {
      // Wall anchor
      ctx.fillStyle = "#475569";
      ctx.fillRect(20, physY - 30, 10, 60);

      // Center equilibrium mark
      const eqX = physX;
      ctx.strokeStyle = "#475569";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(eqX, physY - 40);
      ctx.lineTo(eqX, physY + 40);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px sans-serif";
      ctx.fillText("VTCB (x=0)", eqX - 20, physY + 50);

      // Mass block position (scaled: 1cm = 8px)
      const blockX = eqX + currentX * 8;

      // Draw spring (zigzag line)
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(30, physY);
      const coils = 12;
      const springLen = blockX - 25 - 30;
      for (let i = 1; i <= coils; i++) {
        const segX = 30 + (i / coils) * springLen;
        const segY = physY + (i % 2 === 0 ? -12 : 12);
        ctx.lineTo(segX, segY);
      }
      ctx.lineTo(blockX - 25, physY);
      ctx.stroke();

      // Draw mass block
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.roundRect(blockX - 25, physY - 20, 50, 40, 4);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("m", blockX - 4, physY + 4);
    } else {
      // Simple pendulum
      const pivotX = 140;
      const pivotY = 30;
      const pendLen = 100;
      // Angle theta ~ x / pendLen
      const theta = (currentX / 5) * 0.35; // rad
      const bobX = pivotX + pendLen * Math.sin(theta);
      const bobY = pivotY + pendLen * Math.cos(theta);

      // Pivot
      ctx.fillStyle = "#64748b";
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
      ctx.fill();

      // String
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Bob
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(bobX, bobY, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // Middle area: Fresnel Rotating Vector Circle
    const circleX = 320;
    const circleY = 110;
    const radius = 55;

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Axes of circle
    ctx.beginPath();
    ctx.moveTo(circleX - radius - 15, circleY);
    ctx.lineTo(circleX + radius + 15, circleY);
    ctx.moveTo(circleX, circleY - radius - 10);
    ctx.lineTo(circleX, circleY + radius + 10);
    ctx.stroke();

    // Rotating vector OM (length proportional to A)
    const vecEndX = circleX + radius * Math.cos(-currentPhase);
    const vecEndY = circleY + radius * Math.sin(-currentPhase);

    ctx.strokeStyle = "#f59e0b"; // amber-500
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(circleX, circleY);
    ctx.lineTo(vecEndX, vecEndY);
    ctx.stroke();

    // Projection point on Ox
    ctx.strokeStyle = "#ec4899"; // pink dashed projection
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(vecEndX, vecEndY);
    ctx.lineTo(vecEndX, circleY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.arc(vecEndX, circleY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f59e0b";
    ctx.font = "9px sans-serif";
    ctx.fillText("Vectơ A", vecEndX + 4, vecEndY - 4);
    ctx.fillText("x(t)", vecEndX - 8, circleY + 14);

    // Right side: Real-time x(t) Sine wave graph
    const gw = 220;
    const gh = 120;
    const gx = 430;
    const gy = 50;

    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeStyle = "#475569";
    ctx.strokeRect(gx, gy, gw, gh);

    // Coordinate axes
    const axisY = gy + gh / 2;
    ctx.strokeStyle = "#64748b";
    ctx.beginPath();
    ctx.moveTo(gx, axisY);
    ctx.lineTo(gx + gw - 5, axisY); // t axis
    ctx.moveTo(gx + 20, gy);
    ctx.lineTo(gx + 20, gy + gh); // x axis
    ctx.stroke();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "9px sans-serif";
    ctx.fillText("+A", gx + 4, gy + 15);
    ctx.fillText("0", gx + 8, axisY - 3);
    ctx.fillText("-A", gx + 4, gy + gh - 8);
    ctx.fillText("t", gx + gw - 12, axisY - 4);

    // Draw continuous sine wave
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const tWindow = 4.0; // 4 seconds window
    for (let px = 20; px < gw - 10; px++) {
      const tVal = time - (gw - 10 - px) * (tWindow / (gw - 30));
      const phaseVal = omega * tVal + phase0;
      const xVal = amplitude * Math.cos(phaseVal);
      const py = axisY - (xVal / 6) * (gh / 2 - 10);
      if (px === 20) ctx.moveTo(gx + px, py);
      else ctx.lineTo(gx + px, py);
    }
    ctx.stroke();

    // Red dot for current instant
    const currPy = axisY - (currentX / 6) * (gh / 2 - 10);
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(gx + gw - 10, currPy, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [time, currentX, currentPhase, amplitude, omega, phase0, oscillatorType]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setTime((prev) => prev + delta);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning]);

  return (
    <div id="oscillator-simulation-container" className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-lg font-bold text-sky-400 flex items-center gap-2">
            <Waves className="w-5 h-5 text-sky-400" />
            Mô phỏng: Dao động điều hòa & Vectơ quay (Lớp 11)
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Mối liên hệ giữa dao động điều hòa x(t) = A cos(ωt + φ) và chuyển động tròn đều
          </p>
        </div>

        {/* Readouts */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">Chu kì T:</span>
          <span className="text-amber-400 font-bold text-sm">{period.toFixed(2)} s</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Tần số f:</span>
          <span className="text-emerald-400 font-bold text-sm">{frequency.toFixed(2)} Hz</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Li độ x:</span>
          <span className="text-sky-400 font-bold text-sm">{currentX.toFixed(2)} cm</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={680}
          height={220}
          className="w-full h-auto block"
        />
      </div>

      {/* Type switch & sliders */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
        {/* Oscillator type selector */}
        <div className="bg-slate-800/50 p-2.5 rounded-lg flex flex-col justify-center">
          <span className="text-[11px] text-slate-300 font-medium mb-1.5">Hệ dao động:</span>
          <div className="flex rounded-md overflow-hidden bg-slate-900 border border-slate-700">
            <button
              onClick={() => setOscillatorType("spring")}
              className={`flex-1 py-1 text-xs font-semibold ${
                oscillatorType === "spring" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Lò xo
            </button>
            <button
              onClick={() => setOscillatorType("pendulum")}
              className={`flex-1 py-1 text-xs font-semibold ${
                oscillatorType === "pendulum" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Con lắc đơn
            </button>
          </div>
        </div>

        {/* Amplitude slider */}
        <div className="bg-slate-800/50 p-2.5 rounded-lg">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Biên độ A:</span>
            <span className="text-sky-400 font-mono font-bold">{amplitude} cm</span>
          </div>
          <input
            type="range"
            min="2"
            max="6"
            step="0.5"
            value={amplitude}
            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Omega slider */}
        <div className="bg-slate-800/50 p-2.5 rounded-lg">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Tần số góc ω:</span>
            <span className="text-amber-400 font-mono font-bold">{omega.toFixed(1)} rad/s</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.5"
            value={omega}
            onChange={(e) => setOmega(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-semibold text-xs transition-all shadow-md ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                : "bg-sky-500 hover:bg-sky-600 text-white"
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Tạm dừng" : "Tiếp tục"}
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Đặt lại thời gian về 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Physics Equations Quick Card */}
      <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Li độ x(t):</span>
          <span className="text-sky-400 font-bold">x = {amplitude}·cos({omega}t)</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Vận tốc tức thời v:</span>
          <span className="text-emerald-400 font-bold">{currentV.toFixed(1)} cm/s</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Gia tốc tức thời a:</span>
          <span className="text-pink-400 font-bold">{currentA.toFixed(1)} cm/s²</span>
        </div>
      </div>
    </div>
  );
};

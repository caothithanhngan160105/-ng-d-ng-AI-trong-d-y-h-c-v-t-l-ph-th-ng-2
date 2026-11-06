import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Activity } from "lucide-react";

export const MotionSimulation: React.FC = () => {
  const [v0, setV0] = useState<number>(2.0); // m/s
  const [a, setA] = useState<number>(1.5); // m/s²
  const [time, setTime] = useState<number>(0); // s
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ t: number; v: number; x: number }>>([
    { t: 0, v: 2.0, x: 0 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Current calculations
  const currentV = v0 + a * time;
  const currentX = v0 * time + 0.5 * a * time * time;

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setHistory([{ t: 0, v: v0, x: 0 }]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Draw track
    const trackY = 160;
    ctx.fillStyle = "#334155";
    ctx.fillRect(20, trackY, width - 40, 8);

    // Draw meter ticks on track
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px sans-serif";
    for (let m = 0; m <= 25; m += 2) {
      const px = 40 + m * ((width - 80) / 25);
      ctx.fillRect(px, trackY - 6, 2, 6);
      ctx.fillText(`${m}m`, px - 8, trackY + 22);
    }

    // Calculate car position (clamped to track length 25m)
    const trackLength = 25; // meters
    const scale = (width - 100) / trackLength;
    const carX = Math.min(width - 60, Math.max(40, 40 + currentX * scale));

    // Draw car
    ctx.fillStyle = "#38bdf8"; // cyan-400
    ctx.beginPath();
    ctx.roundRect(carX - 25, trackY - 28, 50, 24, [4, 4, 0, 0]);
    ctx.fill();

    // Car window
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(carX - 12, trackY - 24, 24, 10);

    // Car wheels
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.arc(carX - 14, trackY - 4, 6, 0, Math.PI * 2);
    ctx.arc(carX + 14, trackY - 4, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw velocity vector arrow
    if (Math.abs(currentV) > 0.1) {
      const arrowLen = Math.min(80, Math.max(-80, currentV * 8));
      ctx.strokeStyle = "#10b981"; // emerald
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(carX, trackY - 35);
      ctx.lineTo(carX + arrowLen, trackY - 35);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      const headDir = arrowLen > 0 ? 1 : -1;
      ctx.moveTo(carX + arrowLen, trackY - 35);
      ctx.lineTo(carX + arrowLen - 6 * headDir, trackY - 40);
      ctx.lineTo(carX + arrowLen - 6 * headDir, trackY - 30);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(`v = ${currentV.toFixed(1)} m/s`, carX - 15, trackY - 44);
    }

    // Draw real-time v(t) graph in mini canvas area
    const graphX = 30;
    const graphY = 20;
    const graphW = 160;
    const graphH = 90;

    // Graph panel bg
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.fillRect(graphX, graphY, graphW, graphH);
    ctx.strokeRect(graphX, graphY, graphW, graphH);

    // Graph axes
    ctx.strokeStyle = "#64748b";
    ctx.beginPath();
    ctx.moveTo(graphX + 20, graphY + graphH - 15);
    ctx.lineTo(graphX + graphW - 10, graphY + graphH - 15); // t axis
    ctx.moveTo(graphX + 20, graphY + graphH - 15);
    ctx.lineTo(graphX + 20, graphY + 10); // v axis
    ctx.stroke();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "9px sans-serif";
    ctx.fillText("v (m/s)", graphX + 5, graphY + 10);
    ctx.fillText("t (s)", graphX + graphW - 20, graphY + graphH - 4);

    // Plot points
    if (history.length > 1) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      history.forEach((pt, idx) => {
        const px = graphX + 20 + (pt.t / 6) * (graphW - 35);
        const py = graphY + graphH - 15 - (pt.v / 15) * (graphH - 25);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  }, [time, currentV, currentX, history]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setTime((prev) => {
        const next = prev + delta;
        if (next >= 6.0) {
          setIsRunning(false);
          return 6.0;
        }

        const v = v0 + a * next;
        const x = v0 * next + 0.5 * a * next * next;

        // Record history every ~0.2s
        setHistory((prevHist) => {
          const lastRecorded = prevHist[prevHist.length - 1];
          if (!lastRecorded || next - lastRecorded.t >= 0.25) {
            return [...prevHist, { t: Number(next.toFixed(2)), v: Number(v.toFixed(2)), x: Number(x.toFixed(2)) }];
          }
          return prevHist;
        });

        return next;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, v0, a]);

  return (
    <div id="motion-simulation-container" className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-lg font-bold text-sky-400 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" />
            Mô phỏng: Chuyển động thẳng biến đổi đều (Lớp 10)
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Khảo sát định luật vận tốc v(t) = v0 + at và đồ thị vận tốc - thời gian
          </p>
        </div>

        {/* Digital Clock Readouts */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">Thời gian:</span>
          <span className="text-amber-400 font-bold text-sm">{time.toFixed(2)}s</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Vận tốc:</span>
          <span className="text-emerald-400 font-bold text-sm">{currentV.toFixed(2)} m/s</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Độ dời:</span>
          <span className="text-cyan-400 font-bold text-sm">{currentX.toFixed(2)} m</span>
        </div>
      </div>

      {/* Canvas viewport */}
      <div className="relative w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={680}
          height={210}
          className="w-full h-auto block"
        />
      </div>

      {/* Controls & sliders */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
        {/* V0 slider */}
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Vận tốc đầu v₀:</span>
            <span className="text-sky-400 font-mono font-bold">{v0.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={v0}
            disabled={isRunning}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setV0(val);
              handleReset();
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Gia tốc a slider */}
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Gia tốc a:</span>
            <span className="text-emerald-400 font-mono font-bold">
              {a > 0 ? `+${a.toFixed(1)}` : a.toFixed(1)} m/s²
            </span>
          </div>
          <input
            type="range"
            min="-1.0"
            max="3.0"
            step="0.5"
            value={a}
            disabled={isRunning}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setA(val);
              handleReset();
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 justify-end">
          <button
            id="btn-play-pause-motion"
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all shadow-md ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                : "bg-sky-500 hover:bg-sky-600 text-white"
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Tạm dừng" : "Bắt đầu chạy"}
          </button>

          <button
            id="btn-reset-motion"
            onClick={handleReset}
            title="Đặt lại trạng thái ban đầu"
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Numerical Data Table for Teachers and Students */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Bảng số liệu thời gian thực (Thu thập vào Phiếu học tập số 1):
        </span>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-1.5 px-3">Thời gian t (s)</th>
                <th className="py-1.5 px-3">Vận tốc v (m/s)</th>
                <th className="py-1.5 px-3">Tọa độ x (m)</th>
                <th className="py-1.5 px-3">Tỉ số Δv / Δt (m/s²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.slice(0, 6).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-1 px-3 text-amber-400">{item.t.toFixed(1)}</td>
                  <td className="py-1 px-3 text-emerald-400">{item.v.toFixed(2)}</td>
                  <td className="py-1 px-3 text-cyan-400">{item.x.toFixed(2)}</td>
                  <td className="py-1 px-3 text-slate-400">
                    {idx === 0 ? "-" : a.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

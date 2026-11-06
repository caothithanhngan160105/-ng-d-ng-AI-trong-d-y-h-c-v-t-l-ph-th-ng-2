import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Compass } from "lucide-react";

export const WaveInterferenceSimulation: React.FC = () => {
  const [lambda, setLambda] = useState<number>(30); // px (wavelength)
  const [sourceDist, setSourceDist] = useState<number>(140); // px (distance between S1 and S2)
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [probePos, setProbePos] = useState<{ x: number; y: number }>({ x: 260, y: 110 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Sources coords
  const s1 = { x: 340 - sourceDist / 2, y: 110 };
  const s2 = { x: 340 + sourceDist / 2, y: 110 };

  // Calculate distances for probe point M
  const d1 = Math.hypot(probePos.x - s1.x, probePos.y - s1.y);
  const d2 = Math.hypot(probePos.x - s2.x, probePos.y - s2.y);
  const deltaD = Math.abs(d2 - d1);
  const kRatio = deltaD / lambda;

  // Determine if probe is near max or min
  const isNearMax = Math.abs(kRatio - Math.round(kRatio)) < 0.12;
  const isNearMin = Math.abs(kRatio - (Math.floor(kRatio) + 0.5)) < 0.12;

  // Render wave field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fast image buffer creation for 2D wave ripples
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const omega = 4.0; // wave speed
    const step = 2; // pixel block for high frame rate 60fps

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const r1 = Math.hypot(x - s1.x, y - s1.y);
        const r2 = Math.hypot(x - s2.x, y - s2.y);

        // Two spherical waves
        const a1 = Math.cos((2 * Math.PI * r1) / lambda - omega * time);
        const a2 = Math.cos((2 * Math.PI * r2) / lambda - omega * time);
        const total = (a1 + a2) / 2; // range [-1, 1]

        // Color mapped: positive = cyan/blue, negative = deep indigo/slate
        const intensity = Math.floor((total + 1) * 127);
        const r = Math.floor(intensity * 0.1);
        const g = Math.floor(intensity * 0.7);
        const b = Math.floor(intensity * 0.95);

        // Fill step x step block
        for (let dy = 0; dy < step && y + dy < height; dy++) {
          for (let dx = 0; dx < step && x + dx < width; dx++) {
            const index = ((y + dy) * width + (x + dx)) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw Source 1 (S1)
    ctx.fillStyle = "#f59e0b"; // amber
    ctx.beginPath();
    ctx.arc(s1.x, s1.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("S₁", s1.x - 8, s1.y - 10);

    // Draw Source 2 (S2)
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(s2.x, s2.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("S₂", s2.x - 4, s2.y - 10);

    // Draw Central Maximum line (Trung trực S1S2)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(340, 0);
    ctx.lineTo(340, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw lines from S1 and S2 to Probe Point M
    ctx.strokeStyle = "#ef4444"; // red
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(s1.x, s1.y);
    ctx.lineTo(probePos.x, probePos.y);
    ctx.stroke();

    ctx.strokeStyle = "#3b82f6"; // blue
    ctx.beginPath();
    ctx.moveTo(s2.x, s2.y);
    ctx.lineTo(probePos.x, probePos.y);
    ctx.stroke();

    // Probe Point M
    ctx.fillStyle = "#ec4899"; // pink
    ctx.beginPath();
    ctx.arc(probePos.x, probePos.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("Điểm M", probePos.x + 10, probePos.y + 4);
  }, [time, lambda, sourceDist, probePos]);

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

  // Click on canvas to move Probe M
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setProbePos({ x, y });
  };

  return (
    <div id="wave-simulation-container" className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-lg font-bold text-sky-400 flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400" />
            Mô phỏng: Giao thoa Sóng cơ 2 nguồn kết hợp (Lớp 11)
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Nhấp chuột lên mặt nước để di chuyển điểm M; kiểm chứng điều kiện d₂ - d₁ = k·λ
          </p>
        </div>

        {/* Readouts */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">d₁ (S₁M):</span>
          <span className="text-rose-400 font-bold">{d1.toFixed(1)} px</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">d₂ (S₂M):</span>
          <span className="text-blue-400 font-bold">{d2.toFixed(1)} px</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">|d₂ - d₁|:</span>
          <span className="text-amber-400 font-bold">{deltaD.toFixed(1)} px</span>
          <span className="text-slate-600">({(deltaD / lambda).toFixed(2)} λ)</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950 cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={680}
          height={220}
          onClick={handleCanvasClick}
          className="w-full h-auto block"
        />
        {/* Dynamic status badge at probe M */}
        <div className="absolute top-2 right-2 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded text-xs">
          {isNearMax ? (
            <span className="text-emerald-400 font-bold">✨ Điểm M đang ở VÂN CỰC ĐẠI (d₂ - d₁ = k·λ)</span>
          ) : isNearMin ? (
            <span className="text-slate-400 font-bold">⚪ Điểm M đang ở VÂN CỰC TIỂU (d₂ - d₁ = (k+0.5)·λ)</span>
          ) : (
            <span className="text-slate-300">Điểm M nằm giữa các vân</span>
          )}
        </div>
      </div>

      {/* Sliders */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
        {/* Lambda slider */}
        <div className="bg-slate-800/50 p-2.5 rounded-lg">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Bước sóng λ:</span>
            <span className="text-sky-400 font-mono font-bold">{lambda} px</span>
          </div>
          <input
            type="range"
            min="20"
            max="50"
            step="2"
            value={lambda}
            onChange={(e) => setLambda(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Source distance S1S2 */}
        <div className="bg-slate-800/50 p-2.5 rounded-lg">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Khoảng cách nguồn S₁S₂:</span>
            <span className="text-amber-400 font-mono font-bold">{sourceDist} px</span>
          </div>
          <input
            type="range"
            min="80"
            max="220"
            step="10"
            value={sourceDist}
            onChange={(e) => setSourceDist(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Play Pause */}
        <div className="flex items-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all shadow-md ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                : "bg-sky-500 hover:bg-sky-600 text-white"
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Dừng gợn sóng" : "Tạo sóng nước"}
          </button>
        </div>
      </div>
    </div>
  );
};

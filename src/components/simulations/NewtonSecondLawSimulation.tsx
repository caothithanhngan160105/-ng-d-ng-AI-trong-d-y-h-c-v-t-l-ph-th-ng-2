import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Scale } from "lucide-react";

export const NewtonSecondLawSimulation: React.FC = () => {
  const [cartMass, setCartMass] = useState<number>(0.5); // kg (500g)
  const [pullingForce, setPullingForce] = useState<number>(2.0); // N
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [recordedPoints, setRecordedPoints] = useState<Array<{ F: number; m: number; a: number }>>([
    { F: 1.0, m: 0.5, a: 2.0 },
    { F: 2.0, m: 0.5, a: 4.0 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // a = F / m
  const acceleration = pullingForce / cartMass;
  const position = 0.5 * acceleration * time * time;
  const velocity = acceleration * time;

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleRecordData = () => {
    setRecordedPoints((prev) => [
      ...prev,
      {
        F: pullingForce,
        m: cartMass,
        a: Number(acceleration.toFixed(2)),
      },
    ]);
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Bench / Track
    const benchY = 120;
    const pulleyX = width - 100;
    ctx.fillStyle = "#334155";
    ctx.fillRect(30, benchY, pulleyX - 30, 8);

    // Pulley wheel at end of track
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.arc(pulleyX, benchY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(pulleyX, benchY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pulley stand
    ctx.fillStyle = "#475569";
    ctx.fillRect(pulleyX - 3, benchY + 8, 6, 60);

    // Cart position
    const maxTrackX = pulleyX - 70;
    const startX = 60;
    const scale = (maxTrackX - startX) / 2.5; // 2.5 meters track length
    const cartX = Math.min(maxTrackX, startX + position * scale);

    // String from cart to pulley and hanging weight
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cartX + 35, benchY - 14);
    ctx.lineTo(pulleyX, benchY - 12);
    ctx.lineTo(pulleyX + 12, benchY + 15 + Math.min(60, position * scale));
    ctx.stroke();

    // Hanging weight (representing Force F)
    const weightY = benchY + 15 + Math.min(60, position * scale);
    ctx.fillStyle = "#f59e0b"; // amber-500
    ctx.fillRect(pulleyX + 4, weightY, 16, 20);
    ctx.fillStyle = "#ffffff";
    ctx.font = "8px sans-serif";
    ctx.fillText(`${pullingForce}N`, pulleyX + 5, weightY + 13);

    // Cart on track
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.roundRect(cartX - 35, benchY - 26, 70, 20, 3);
    ctx.fill();

    // Stacked weights on cart
    if (cartMass >= 0.5) {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(cartX - 25, benchY - 34, 50, 8);
    }
    if (cartMass >= 0.75) {
      ctx.fillStyle = "#334155";
      ctx.fillRect(cartX - 20, benchY - 42, 40, 8);
    }
    if (cartMass >= 1.0) {
      ctx.fillStyle = "#475569";
      ctx.fillRect(cartX - 15, benchY - 50, 30, 8);
    }

    // Cart wheels
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.arc(cartX - 20, benchY - 4, 5, 0, Math.PI * 2);
    ctx.arc(cartX + 20, benchY - 4, 5, 0, Math.PI * 2);
    ctx.fill();

    // Label cart mass
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText(`m = ${cartMass} kg`, cartX - 25, benchY - 12);

    // Force vector F arrow on cart
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cartX + 35, benchY - 14);
    ctx.lineTo(cartX + 35 + pullingForce * 12, benchY - 14);
    ctx.stroke();

    // Real-time graph of a versus F or a versus 1/m
    const gx = 30;
    const gy = 150;
    const gw = 180;
    const gh = 70;

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeRect(gx, gy, gw, gh);

    ctx.strokeStyle = "#64748b";
    ctx.beginPath();
    ctx.moveTo(gx + 25, gy + gh - 15);
    ctx.lineTo(gx + gw - 10, gy + gh - 15);
    ctx.moveTo(gx + 25, gy + gh - 15);
    ctx.lineTo(gx + 25, gy + 10);
    ctx.stroke();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "9px sans-serif";
    ctx.fillText("a (m/s²)", gx + 5, gy + 10);
    ctx.fillText("F (N)", gx + gw - 25, gy + gh - 4);

    // Plot recorded experimental points
    recordedPoints.forEach((pt) => {
      const px = gx + 25 + (pt.F / 5) * (gw - 40);
      const py = gy + gh - 15 - (pt.a / 12) * (gh - 25);
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw theoretical trend line a = F / m
    ctx.strokeStyle = "#10b981";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(gx + 25, gy + gh - 15);
    const maxF = 5;
    const maxA = maxF / cartMass;
    const endX = gx + 25 + (maxF / 5) * (gw - 40);
    const endY = gy + gh - 15 - (maxA / 12) * (gh - 25);
    ctx.lineTo(endX, Math.max(gy + 10, endY));
    ctx.stroke();
    ctx.setLineDash([]);
  }, [time, cartMass, pullingForce, position, recordedPoints, acceleration]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setTime((prev) => {
        const next = prev + delta;
        // Stop if car reaches end of track
        if (0.5 * acceleration * next * next >= 2.2) {
          setIsRunning(false);
          return next;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, acceleration]);

  return (
    <div id="newton-simulation-container" className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-lg font-bold text-sky-400 flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-400" />
            Mô phỏng: Định luật II Newton (Lớp 10)
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Kiểm chứng công thức a = F / m (gia tốc tỉ lệ thuận với F, tỉ lệ nghịch với m)
          </p>
        </div>

        {/* Readouts */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">Gia tốc tính toán a:</span>
          <span className="text-emerald-400 font-bold text-sm">{acceleration.toFixed(2)} m/s²</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Vận tốc tức thời v:</span>
          <span className="text-sky-400 font-bold text-sm">{velocity.toFixed(2)} m/s</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={680}
          height={230}
          className="w-full h-auto block"
        />
      </div>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
        {/* Pulling force F slider */}
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Lực kéo F (quả nặng):</span>
            <span className="text-amber-400 font-mono font-bold">{pullingForce.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.5"
            value={pullingForce}
            disabled={isRunning}
            onChange={(e) => {
              setPullingForce(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Mass of cart m slider */}
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Khối lượng xe lăn m:</span>
            <span className="text-sky-400 font-mono font-bold">{cartMass.toFixed(2)} kg</span>
          </div>
          <input
            type="range"
            min="0.25"
            max="1.50"
            step="0.25"
            value={cartMass}
            disabled={isRunning}
            onChange={(e) => {
              setCartMass(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-xs transition-all shadow-md ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                : "bg-sky-500 hover:bg-sky-600 text-white"
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Tạm dừng" : "Thả xe chạy"}
          </button>

          <button
            onClick={handleRecordData}
            title="Ghi điểm đo vào bảng số liệu"
            className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            + Lưu điểm
          </button>

          <button
            onClick={handleReset}
            title="Đặt lại vị trí xuất phát"
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recorded data table */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Số liệu đo đạc thực nghiệm (PHT Định luật II Newton):
        </span>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-1.5 px-3">Lần đo</th>
                <th className="py-1.5 px-3">Lực kéo F (N)</th>
                <th className="py-1.5 px-3">Khối lượng m (kg)</th>
                <th className="py-1.5 px-3">Gia tốc a (m/s²)</th>
                <th className="py-1.5 px-3">Tích m * a (N)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recordedPoints.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-1 px-3 text-slate-400">{idx + 1}</td>
                  <td className="py-1 px-3 text-amber-400">{item.F.toFixed(1)}</td>
                  <td className="py-1 px-3 text-sky-400">{item.m.toFixed(2)}</td>
                  <td className="py-1 px-3 text-emerald-400">{item.a.toFixed(2)}</td>
                  <td className="py-1 px-3 text-white font-bold">{(item.m * item.a).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from "react";
import { Eye, SunMedium } from "lucide-react";

export const LightRefractionSimulation: React.FC = () => {
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(45); // degrees
  const [n1, setN1] = useState<number>(1.0); // Không khí
  const [n2, setN2] = useState<number>(1.5); // Thủy tinh
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Snell's Law: n1 * sin(i) = n2 * sin(r)
  const iRad = (incidentAngleDeg * Math.PI) / 180;
  const sinR = (n1 * Math.sin(iRad)) / n2;
  const isTIR = sinR > 1.0; // Total Internal Reflection (Phản xạ toàn phần)
  const rRad = isTIR ? 0 : Math.asin(sinR);
  const rDeg = isTIR ? 0 : (rRad * 180) / Math.PI;

  // Critical angle for TIR (igh)
  const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 95;

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Bottom medium tint (n2)
    ctx.fillStyle = "rgba(56, 189, 248, 0.12)";
    ctx.fillRect(0, centerY, width, height / 2);

    // Interface boundary
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Medium labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px sans-serif";
    ctx.fillText(`Môi trường 1 (n₁ = ${n1.toFixed(2)})`, 20, centerY - 15);
    ctx.fillText(`Môi trường 2 (n₂ = ${n2.toFixed(2)})`, 20, centerY + 25);

    // Normal line (Pháp tuyến NN')
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("N", centerX - 5, 18);
    ctx.fillText("N'", centerX - 5, height - 8);

    // Optical circular protractor (Đĩa đo độ quang học)
    ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Angle ticks
    for (let deg = 0; deg < 360; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const len = deg % 30 === 0 ? 8 : 4;
      const x1 = centerX + (radius - len) * Math.cos(rad);
      const y1 = centerY + (radius - len) * Math.sin(rad);
      const x2 = centerX + radius * Math.cos(rad);
      const y2 = centerY + radius * Math.sin(rad);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Incident Laser beam (Tia tới SI)
    // Incident angle measured from Normal (N)
    const incidentRayLen = 130;
    const startX = centerX - incidentRayLen * Math.sin(iRad);
    const startY = centerY - incidentRayLen * Math.cos(iRad);

    ctx.strokeStyle = "#ef4444"; // Red laser
    ctx.lineWidth = 3;
    ctx.shadowColor = "#f43f5e";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // Laser Source Indicator (Đèn chiếu Laser)
    ctx.fillStyle = "#dc2626";
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(startX, startY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Arrow on incident ray
    ctx.fillStyle = "#ef4444";
    const midIncX = (startX + centerX) / 2;
    const midIncY = (startY + centerY) / 2;
    ctx.beginPath();
    ctx.arc(midIncX, midIncY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Reflected ray (Tia phản xạ IR)
    const reflEndX = centerX + incidentRayLen * Math.sin(iRad);
    const reflEndY = centerY - incidentRayLen * Math.cos(iRad);
    ctx.strokeStyle = isTIR ? "#ef4444" : "rgba(239, 68, 68, 0.4)";
    ctx.lineWidth = isTIR ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(reflEndX, reflEndY);
    ctx.stroke();

    // Refracted ray (Tia khúc xạ IK)
    if (!isTIR) {
      const refrEndX = centerX + incidentRayLen * Math.sin(rRad);
      const refrEndY = centerY + incidentRayLen * Math.cos(rRad);
      ctx.strokeStyle = "#10b981"; // emerald beam
      ctx.lineWidth = 3;
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(refrEndX, refrEndY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Label r
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(`r = ${rDeg.toFixed(1)}°`, centerX + 15, centerY + 35);
    } else {
      // Show TIR alert banner inside canvas
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("⚠️ PHẢN XẠ TOÀN PHẦN (Tia khúc xạ biến mất!)", centerX - 130, centerY + 50);
    }

    // Label incident angle i
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(`i = ${incidentAngleDeg}°`, centerX - 40, centerY - 25);
  }, [incidentAngleDeg, n1, n2, iRad, rRad, rDeg, isTIR]);

  return (
    <div id="refraction-simulation-container" className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-lg font-bold text-sky-400 flex items-center gap-2">
            <SunMedium className="w-5 h-5 text-sky-400" />
            Mô phỏng: Khúc xạ Ánh sáng & Phản xạ Toàn phần (Lớp 11)
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Khảo sát định luật Snell n₁·sin(i) = n₂·sin(r) và góc giới hạn phản xạ toàn phần i_gh
          </p>
        </div>

        {/* Readouts */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">Góc tới i:</span>
          <span className="text-rose-400 font-bold">{incidentAngleDeg}°</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Góc khúc xạ r:</span>
          <span className="text-emerald-400 font-bold">
            {isTIR ? "Không có (PXTP)" : `${rDeg.toFixed(1)}°`}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Tỉ số sin i / sin r:</span>
          <span className="text-sky-400 font-bold">
            {isTIR ? "-" : (Math.sin(iRad) / Math.sin(rRad)).toFixed(2)}
          </span>
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

      {/* Control sliders */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
        {/* Incident angle i */}
        <div className="bg-slate-800/50 p-2.5 rounded-lg">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Góc tới i:</span>
            <span className="text-rose-400 font-mono font-bold">{incidentAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="85"
            step="1"
            value={incidentAngleDeg}
            onChange={(e) => setIncidentAngleDeg(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        {/* Medium 1 index n1 */}
        <div className="bg-slate-800/50 p-2.5 rounded-lg">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Chiết suất n₁:</span>
            <span className="text-sky-400 font-mono font-bold">{n1.toFixed(2)}</span>
          </div>
          <select
            value={n1}
            onChange={(e) => setN1(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1 text-slate-200"
          >
            <option value="1.00">Không khí (n = 1.00)</option>
            <option value="1.33">Nước (n = 1.33)</option>
            <option value="1.50">Thủy tinh (n = 1.50)</option>
            <option value="2.42">Kim cương (n = 2.42)</option>
          </select>
        </div>

        {/* Medium 2 index n2 */}
        <div className="bg-slate-800/50 p-2.5 rounded-lg">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Chiết suất n₂:</span>
            <span className="text-emerald-400 font-mono font-bold">{n2.toFixed(2)}</span>
          </div>
          <select
            value={n2}
            onChange={(e) => setN2(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1 text-slate-200"
          >
            <option value="1.00">Không khí (n = 1.00)</option>
            <option value="1.33">Nước (n = 1.33)</option>
            <option value="1.50">Thủy tinh (n = 1.50)</option>
            <option value="2.42">Kim cương (n = 2.42)</option>
          </select>
        </div>
      </div>

      {/* Critical angle insight note */}
      {criticalAngleDeg && (
        <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-300 flex items-center justify-between">
          <span>
            💡 Góc giới hạn phản xạ toàn phần: <strong>i_gh = {criticalAngleDeg.toFixed(1)}°</strong> (do n₁ &gt; n₂)
          </span>
          <button
            onClick={() => setIncidentAngleDeg(Math.ceil(criticalAngleDeg) + 2)}
            className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 px-2 py-1 rounded text-amber-200 underline"
          >
            Thử góc gây phản xạ toàn phần (i &gt; i_gh)
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Compass,
  Info,
  Maximize2,
  Volume2,
  VolumeX,
  Target,
  Trophy,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  Award,
  Crosshair,
  TrendingUp,
  Move,
  Flame,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Web Audio sound synthesizer for classroom excitement
class SoundFx {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  playProbeBeep(voltage: number) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      // Frequency proportional to voltage magnitude
      const freq = Math.min(1200, Math.max(180, 440 + voltage * 4));
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignore audio failure
    }
  }

  playSpark() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Ignore audio failure
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.07, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  playLaunch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }
}

const sfx = new SoundFx();

// Charge in space
interface ChargePoint {
  id: string;
  x: number; // canvas pixels
  y: number;
  q: number; // in nC (nanocoulombs)
}

// Launched test particle
interface TestParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  q: number; // e.g. +1, -1, +2
  m: number; // relative mass
  color: string;
  name: string;
  trail: { x: number; y: number }[];
  alive: boolean;
}

export const ElectricPotentialSimulation: React.FC = () => {
  // Preset Scenarios
  type PresetType = "capacitor" | "single_positive" | "dipole" | "two_positives" | "custom";
  const [preset, setPreset] = useState<PresetType>("capacitor");

  // View modes
  type ViewMode = "2d_field" | "3d_terrain" | "particle_lab" | "classroom_arena";
  const [viewMode, setViewMode] = useState<ViewMode>("2d_field");

  // Display toggles
  const [showFieldVectors, setShowFieldVectors] = useState(true);
  const [showEquipotentialLines, setShowEquipotentialLines] = useState(true);
  const [showVoltageHeatmap, setShowVoltageHeatmap] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Physical Parameters for Capacitor
  const [plateVoltage, setPlateVoltage] = useState<number>(200); // Volts (U)
  const [plateDistance, setPlateDistance] = useState<number>(10); // cm

  // Custom Charges on canvas
  const [charges, setCharges] = useState<ChargePoint[]>([
    { id: "c1", x: 260, y: 220, q: +8 },
    { id: "c2", x: 440, y: 220, q: -8 },
  ]);

  // Equipotential custom contour voltages dropped by user
  const [pinnedContours, setPinnedContours] = useState<number[]>([]);

  // Draggable Voltmeter Probes
  // Probe A (Red) and Probe B (Black / Ref)
  const [probeA, setProbeA] = useState<{ x: number; y: number }>({ x: 300, y: 220 });
  const [probeB, setProbeB] = useState<{ x: number; y: number }>({ x: 400, y: 220 });
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  // Launched particles
  const [particles, setParticles] = useState<TestParticle[]>([]);
  const [selectedParticleType, setSelectedParticleType] = useState<"proton" | "electron" | "alpha">("proton");
  const [particleSpeed, setParticleSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Classroom Arena state
  const [arenaGame, setArenaGame] = useState<"hunt" | "prophecy" | "cannon">("hunt");
  const [arenaScore, setArenaScore] = useState<number>(0);
  const [targetVoltage, setTargetVoltage] = useState<number>(60);
  const [huntSuccess, setHuntSuccess] = useState<boolean>(false);

  // Prophecy game
  const [prophecyAnswered, setProphecyAnswered] = useState<boolean>(false);
  const [prophecyChoice, setProphecyChoice] = useState<"A_to_B" | "B_to_A" | null>(null);
  const [prophecyResult, setProphecyResult] = useState<boolean | null>(null);

  // Cannon target
  const [cannonTarget, setCannonTarget] = useState<{ x: number; y: number; hit: boolean }>({
    x: 520,
    y: 180,
    hit: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Sync sound setting
  useEffect(() => {
    sfx.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Load Presets
  const applyPreset = useCallback((p: PresetType) => {
    setPreset(p);
    setPinnedContours([]);
    setParticles([]);

    if (p === "capacitor") {
      setProbeA({ x: 260, y: 220 });
      setProbeB({ x: 440, y: 220 });
    } else if (p === "single_positive") {
      setCharges([{ id: "c1", x: 350, y: 220, q: +10 }]);
      setProbeA({ x: 260, y: 220 });
      setProbeB({ x: 480, y: 220 });
    } else if (p === "dipole") {
      setCharges([
        { id: "c1", x: 260, y: 220, q: +10 },
        { id: "c2", x: 440, y: 220, q: -10 },
      ]);
      setProbeA({ x: 300, y: 160 });
      setProbeB({ x: 400, y: 280 });
    } else if (p === "two_positives") {
      setCharges([
        { id: "c1", x: 260, y: 220, q: +10 },
        { id: "c2", x: 440, y: 220, q: +10 },
      ]);
      setProbeA({ x: 350, y: 220 });
      setProbeB({ x: 350, y: 120 });
    } else if (p === "custom") {
      setCharges([
        { id: "c1", x: 240, y: 180, q: +8 },
        { id: "c2", x: 460, y: 260, q: -8 },
      ]);
    }
  }, []);

  // Compute Potential V and Field E at any (x, y) on canvas
  const getPhysicsAt = useCallback(
    (x: number, y: number) => {
      if (preset === "capacitor") {
        // Plates located at xLeft and xRight
        const xLeft = 180;
        const xRight = 520;
        const yTop = 80;
        const yBottom = 360;

        // Inside plates: uniform field
        if (x >= xLeft && x <= xRight && y >= yTop && y <= yBottom) {
          const frac = (x - xLeft) / (xRight - xLeft);
          // Positive plate at left (+U), negative at right (0)
          const V = plateVoltage * (1 - frac);
          const Ex = (plateVoltage / (plateDistance * 0.01)); // V/m
          const Ey = 0;
          return { V, Ex, Ey, E: Math.abs(Ex) };
        } else {
          // Outside edge drop-off
          const dX = x < xLeft ? xLeft - x : x > xRight ? x - xRight : 0;
          const dY = y < yTop ? yTop - y : y > yBottom ? y - yBottom : 0;
          const dist = Math.sqrt(dX * dX + dY * dY);
          const baseV = x < xLeft ? plateVoltage : 0;
          const V = baseV * Math.exp(-dist / 60);
          return { V, Ex: 0, Ey: 0, E: 0 };
        }
      } else {
        // Point charges potential: V = sum( k * q_i / r_i )
        // Using scaled k for visual responsiveness
        const kConstant = 12000; // visual scaling
        let V = 0;
        let Ex = 0;
        let Ey = 0;

        for (const c of charges) {
          const dx = x - c.x;
          const dy = y - c.y;
          const r = Math.max(16, Math.sqrt(dx * dx + dy * dy));
          const vContrib = (kConstant * c.q) / r;
          V += vContrib;

          const eMag = (kConstant * c.q) / (r * r);
          Ex += eMag * (dx / r);
          Ey += eMag * (dy / r);
        }

        const E = Math.sqrt(Ex * Ex + Ey * Ey);
        return { V, Ex, Ey, E };
      }
    },
    [preset, plateVoltage, plateDistance, charges]
  );

  // Voltmeter readouts
  const probeAPhysics = getPhysicsAt(probeA.x, probeA.y);
  const probeBPhysics = getPhysicsAt(probeB.x, probeB.y);
  const voltageU_AB = probeAPhysics.V - probeBPhysics.V;

  // Add custom pinned contour at Probe A
  const handlePinContourAtProbeA = () => {
    const v = Math.round(probeAPhysics.V);
    if (!pinnedContours.includes(v)) {
      setPinnedContours([...pinnedContours, v]);
      sfx.playSpark();
    }
  };

  // Launch particle
  const handleLaunchParticle = (vx0 = 0, vy0 = 0) => {
    sfx.playLaunch();
    let q = 1;
    let m = 1;
    let color = "#38bdf8"; // cyan
    let name = "Proton (p+)";

    if (selectedParticleType === "electron") {
      q = -1;
      m = 0.05; // much lighter
      color = "#f43f5e"; // rose red
      name = "Electron (e-)";
    } else if (selectedParticleType === "alpha") {
      q = +2;
      m = 4;
      color = "#eab308"; // amber
      name = "Hạt Alpha (α 2+)";
    }

    const newParticle: TestParticle = {
      x: probeA.x,
      y: probeA.y,
      vx: vx0,
      vy: vy0,
      q,
      m,
      color,
      name,
      trail: [{ x: probeA.x, y: probeA.y }],
      alive: true,
    };

    setParticles((prev) => [...prev, newParticle]);
  };

  // Setup Arena Hunt challenge
  const nextHuntTarget = useCallback(() => {
    const targets = [20, 40, 60, 80, 100, 120, -40, -80];
    const picked = targets[Math.floor(Math.random() * targets.length)];
    setTargetVoltage(picked);
    setHuntSuccess(false);
  }, []);

  // Check hunt target condition
  useEffect(() => {
    if (viewMode === "classroom_arena" && arenaGame === "hunt" && !huntSuccess) {
      if (Math.abs(probeAPhysics.V - targetVoltage) <= 3.5) {
        setHuntSuccess(true);
        setArenaScore((s) => s + 100);
        sfx.playSuccess();
      }
    }
  }, [probeAPhysics.V, targetVoltage, viewMode, arenaGame, huntSuccess]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    const render = () => {
      // Clear canvas with deep dark laboratory tone
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // 1. Grid Background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (viewMode === "3d_terrain") {
        // ==========================================
        // 3D TOPOGRAPHIC POTENTIAL LANDSCAPE
        // ==========================================
        const cols = 28;
        const rows = 18;
        const xStep = width / (cols + 2);
        const yStep = height / (rows + 2);
        const originX = 70;
        const originY = 60;

        // Project 3D isometric mesh
        // Positive V creates mountain peak (moves upwards), Negative V creates funnel (moves downwards)
        const project = (i: number, j: number) => {
          const px = originX + i * xStep;
          const py = originY + j * yStep;
          const { V } = getPhysicsAt(px, py);
          const heightOffset = Math.max(-120, Math.min(120, V * 0.7));
          // Isometric slant
          const isoX = px + (j - rows / 2) * 5;
          const isoY = py - heightOffset;
          return { isoX, isoY, V };
        };

        // Draw mesh lines
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const p1 = project(i, j);
            const p2 = project(i + 1, j);
            const p3 = project(i, j + 1);

            // Wireframe row line
            const intensity = Math.min(1, Math.abs(p1.V) / 120);
            const strokeCol =
              p1.V >= 0
                ? `rgba(249, 115, 22, ${0.2 + intensity * 0.7})` // Orange/Amber Mountain
                : `rgba(56, 189, 248, ${0.2 + intensity * 0.7})`; // Cyan Pit

            ctx.strokeStyle = strokeCol;
            ctx.lineWidth = 1.2;

            ctx.beginPath();
            ctx.moveTo(p1.isoX, p1.isoY);
            ctx.lineTo(p2.isoX, p2.isoY);
            ctx.stroke();

            // Wireframe col line
            ctx.beginPath();
            ctx.moveTo(p1.isoX, p1.isoY);
            ctx.lineTo(p3.isoX, p3.isoY);
            ctx.stroke();
          }
        }

        // Draw annotation markers on peaks and wells
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("▲ ĐỈNH NÚI ĐIỆN THẾ CAO (V > 0)", 220, 40);
        ctx.fillText("▼ HỐ SÂU ĐIỆN THẾ THẤP (V < 0)", 480, 40);
      } else {
        // ==========================================
        // 2D FIELD & EQUIPOTENTIAL MAPPING
        // ==========================================

        // 1. Heatmap / Potential Glow
        if (showVoltageHeatmap) {
          const sampleStep = 24;
          for (let px = 10; px < width; px += sampleStep) {
            for (let py = 10; py < height; py += sampleStep) {
              const { V } = getPhysicsAt(px, py);
              const norm = Math.min(1, Math.abs(V) / 150);
              if (norm > 0.05) {
                if (V > 0) {
                  ctx.fillStyle = `rgba(239, 68, 68, ${norm * 0.14})`; // Red/Warm
                } else {
                  ctx.fillStyle = `rgba(59, 130, 246, ${norm * 0.14})`; // Blue/Cool
                }
                ctx.beginPath();
                ctx.arc(px, py, sampleStep * 0.7, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }

        // 2. Uniform Field Capacitor Plates
        if (preset === "capacitor") {
          const xLeft = 180;
          const xRight = 520;
          const yTop = 80;
          const yBottom = 360;

          // Positive Plate (Left)
          ctx.fillStyle = "#ef4444";
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 12;
          ctx.fillRect(xLeft - 12, yTop, 12, yBottom - yTop);
          ctx.shadowBlur = 0;

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`+ Bản Dương (${plateVoltage} V)`, xLeft - 6, yTop - 12);
          for (let py = yTop + 20; py < yBottom; py += 30) {
            ctx.fillText("+", xLeft - 6, py);
          }

          // Negative Plate (Right)
          ctx.fillStyle = "#3b82f6";
          ctx.shadowColor = "#3b82f6";
          ctx.shadowBlur = 12;
          ctx.fillRect(xRight, yTop, 12, yBottom - yTop);
          ctx.shadowBlur = 0;

          ctx.fillStyle = "#ffffff";
          ctx.fillText("− Bản Âm (0 V)", xRight + 6, yTop - 12);
          for (let py = yTop + 20; py < yBottom; py += 30) {
            ctx.fillText("−", xRight + 6, py);
          }
        }

        // 3. Point Charges
        if (preset !== "capacitor") {
          for (const c of charges) {
            const isPos = c.q > 0;
            const grad = ctx.createRadialGradient(c.x, c.y, 4, c.x, c.y, 24);
            if (isPos) {
              grad.addColorStop(0, "#f87171");
              grad.addColorStop(1, "rgba(239, 68, 68, 0.2)");
            } else {
              grad.addColorStop(0, "#60a5fa");
              grad.addColorStop(1, "rgba(59, 130, 246, 0.2)");
            }

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(c.x, c.y, 22, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = isPos ? "#ef4444" : "#2563eb";
            ctx.beginPath();
            ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(isPos ? `+${c.q}nC` : `${c.q}nC`, c.x, c.y);
          }
        }

        // 4. Electric Field Vectors (E-field arrows)
        if (showFieldVectors) {
          const step = 42;
          for (let x = 40; x < width - 40; x += step) {
            for (let y = 60; y < height - 60; y += step) {
              const { Ex, Ey, E } = getPhysicsAt(x, y);
              if (E > 0.05) {
                const len = Math.min(18, Math.max(6, Math.log10(E + 1) * 7));
                const angle = Math.atan2(Ey, Ex);

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);

                ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
                ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(-len / 2, 0);
                ctx.lineTo(len / 2, 0);
                ctx.stroke();

                // Arrow head
                ctx.beginPath();
                ctx.moveTo(len / 2, 0);
                ctx.lineTo(len / 2 - 4, -2.5);
                ctx.lineTo(len / 2 - 4, 2.5);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
              }
            }
          }
        }

        // 5. Equipotential Contour Lines (Mặt đẳng thế)
        if (showEquipotentialLines) {
          // Default standard voltage contours
          const defaultVoltages =
            preset === "capacitor"
              ? [
                  plateVoltage * 0.8,
                  plateVoltage * 0.6,
                  plateVoltage * 0.4,
                  plateVoltage * 0.2,
                ]
              : [120, 80, 50, 25, 0, -25, -50, -80, -120];

          const allVoltages = Array.from(new Set([...defaultVoltages, ...pinnedContours]));

          // In capacitor, equipotentials are vertical planes!
          if (preset === "capacitor") {
            const xLeft = 180;
            const xRight = 520;
            const yTop = 80;
            const yBottom = 360;

            allVoltages.forEach((targetV) => {
              if (targetV > 0 && targetV < plateVoltage) {
                const frac = 1 - targetV / plateVoltage;
                const lineX = xLeft + frac * (xRight - xLeft);

                ctx.strokeStyle = pinnedContours.includes(targetV)
                  ? "#eab308" // Gold for user-pinned contour
                  : "rgba(56, 189, 248, 0.75)"; // Cyan neon
                ctx.lineWidth = pinnedContours.includes(targetV) ? 2.5 : 1.5;
                ctx.setLineDash(pinnedContours.includes(targetV) ? [] : [5, 4]);

                ctx.beginPath();
                ctx.moveTo(lineX, yTop - 10);
                ctx.lineTo(lineX, yBottom + 10);
                ctx.stroke();
                ctx.setLineDash([]);

                // Badge label
                ctx.fillStyle = pinnedContours.includes(targetV) ? "#eab308" : "#38bdf8";
                ctx.font = "bold 11px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`${Math.round(targetV)} V`, lineX, yBottom + 24);
              }
            });
          } else {
            // Point charge field: Marching contour tracer
            allVoltages.forEach((targetV) => {
              const isPinned = pinnedContours.includes(targetV);
              ctx.strokeStyle = isPinned
                ? "#eab308"
                : targetV > 0
                ? "rgba(249, 115, 22, 0.7)"
                : targetV < 0
                ? "rgba(56, 189, 248, 0.7)"
                : "rgba(34, 197, 94, 0.8)";
              ctx.lineWidth = isPinned ? 2.5 : 1.2;
              ctx.setLineDash(isPinned ? [] : [4, 4]);

              // Sample concentric circles around charges or scan points
              for (const c of charges) {
                const effectiveQ = c.q;
                if (targetV === 0 || (targetV > 0 && effectiveQ > 0) || (targetV < 0 && effectiveQ < 0)) {
                  // Approximate radius
                  const kConstant = 12000;
                  const estimatedR = Math.abs((kConstant * effectiveQ) / (targetV || 10));
                  if (estimatedR > 18 && estimatedR < 280) {
                    ctx.beginPath();
                    ctx.arc(c.x, c.y, estimatedR, 0, Math.PI * 2);
                    ctx.stroke();

                    // Label tag
                    ctx.fillStyle = isPinned ? "#eab308" : "#ffffff";
                    ctx.font = "bold 10px monospace";
                    ctx.fillText(`${Math.round(targetV)}V`, c.x + estimatedR + 8, c.y);
                  }
                }
              }
              ctx.setLineDash([]);
            });
          }
        }

        // 6. Cannon Target (Classroom Arena game)
        if (viewMode === "classroom_arena" && arenaGame === "cannon") {
          ctx.strokeStyle = cannonTarget.hit ? "#22c55e" : "#f43f5e";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cannonTarget.x, cannonTarget.y, 22, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = cannonTarget.hit ? "rgba(34, 197, 94, 0.3)" : "rgba(244, 63, 94, 0.2)";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(cannonTarget.x, cannonTarget.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = cannonTarget.hit ? "#22c55e" : "#f43f5e";
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(cannonTarget.hit ? "BẮN TRÚNG! +100Đ" : "MỤC TIÊU BIA", cannonTarget.x, cannonTarget.y - 28);
        }

        // 7. Render Launched Particles & Physics Integration
        if (isPlaying && particles.length > 0) {
          setParticles((prevParticles) =>
            prevParticles.map((p) => {
              if (!p.alive) return p;

              const { Ex, Ey } = getPhysicsAt(p.x, p.y);
              // F = q * E -> a = q * E / m
              const dt = 0.35 * particleSpeed;
              const ax = (p.q * Ex * 0.04) / p.m;
              const ay = (p.q * Ey * 0.04) / p.m;

              const nextVx = p.vx + ax * dt;
              const nextVy = p.vy + ay * dt;
              const nextX = p.x + nextVx * dt;
              const nextY = p.y + nextVy * dt;

              // Check boundary
              const outOfBounds = nextX < 10 || nextX > width - 10 || nextY < 10 || nextY > height - 10;

              // Check Cannon Target collision
              if (
                viewMode === "classroom_arena" &&
                arenaGame === "cannon" &&
                !cannonTarget.hit
              ) {
                const distToTarget = Math.hypot(nextX - cannonTarget.x, nextY - cannonTarget.y);
                if (distToTarget <= 24) {
                  setCannonTarget((ct) => ({ ...ct, hit: true }));
                  setArenaScore((s) => s + 100);
                  sfx.playSuccess();
                }
              }

              const newTrail = [...p.trail, { x: nextX, y: nextY }];
              if (newTrail.length > 50) newTrail.shift();

              return {
                ...p,
                x: nextX,
                y: nextY,
                vx: nextVx,
                vy: nextVy,
                trail: newTrail,
                alive: !outOfBounds,
              };
            })
          );
        }

        // Draw particle trails and bodies
        particles.forEach((p) => {
          if (p.trail.length > 1) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
          }

          if (p.alive) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(p.q > 0 ? "+" : "−", p.x, p.y + 3);
          }
        });

        // 8. Draw Draggable Voltmeter Probes
        // Probe A (Red +)
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(probeA.x, probeA.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(probeA.x, probeA.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("VA (+)", probeA.x, probeA.y - 18);

        // Vector E at Probe A
        const pAPhysics = getPhysicsAt(probeA.x, probeA.y);
        if (pAPhysics.E > 0.05) {
          const eAngle = Math.atan2(pAPhysics.Ey, pAPhysics.Ex);
          const vLen = 32;
          ctx.strokeStyle = "#eab308"; // Golden vector E
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(probeA.x, probeA.y);
          ctx.lineTo(probeA.x + Math.cos(eAngle) * vLen, probeA.y + Math.sin(eAngle) * vLen);
          ctx.stroke();

          // Arrow tip
          const tipX = probeA.x + Math.cos(eAngle) * vLen;
          const tipY = probeA.y + Math.sin(eAngle) * vLen;
          ctx.fillStyle = "#eab308";
          ctx.beginPath();
          ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#eab308";
          ctx.font = "bold 10px sans-serif";
          ctx.fillText("→E", tipX + 10, tipY);
        }

        // Probe B (Black / Ref)
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.arc(probeB.x, probeB.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(probeB.x, probeB.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("VB (Ref)", probeB.x, probeB.y - 18);

        // Connecting lead wire between probes
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(probeA.x, probeA.y);
        ctx.lineTo(probeB.x, probeB.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    viewMode,
    preset,
    showFieldVectors,
    showEquipotentialLines,
    showVoltageHeatmap,
    plateVoltage,
    plateDistance,
    charges,
    pinnedContours,
    probeA,
    probeB,
    particles,
    isPlaying,
    particleSpeed,
    cannonTarget,
    arenaGame,
    getPhysicsAt,
  ]);

  // Pointer drag handling for Probes and Charges
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Check Probe A
    if (Math.hypot(x - probeA.x, y - probeA.y) < 22) {
      setDraggingItem("probeA");
      sfx.playProbeBeep(probeAPhysics.V);
      return;
    }

    // Check Probe B
    if (Math.hypot(x - probeB.x, y - probeB.y) < 22) {
      setDraggingItem("probeB");
      sfx.playProbeBeep(probeBPhysics.V);
      return;
    }

    // Check Charges
    for (const c of charges) {
      if (Math.hypot(x - c.x, y - c.y) < 24) {
        setDraggingItem(`charge_${c.id}`);
        return;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingItem) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(20, Math.min(canvas.width - 20, ((e.clientX - rect.left) / rect.width) * canvas.width));
    const y = Math.max(20, Math.min(canvas.height - 20, ((e.clientY - rect.top) / rect.height) * canvas.height));

    if (draggingItem === "probeA") {
      setProbeA({ x, y });
      sfx.playProbeBeep(getPhysicsAt(x, y).V);
    } else if (draggingItem === "probeB") {
      setProbeB({ x, y });
      sfx.playProbeBeep(getPhysicsAt(x, y).V);
    } else if (draggingItem.startsWith("charge_")) {
      const chargeId = draggingItem.replace("charge_", "");
      setCharges((prev) =>
        prev.map((c) => (c.id === chargeId ? { ...c, x, y } : c))
      );
    }
  };

  const handlePointerUp = () => {
    setDraggingItem(null);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-4 md:p-6 shadow-2xl flex flex-col gap-5">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
                Phòng Thí Nghiệm Ảo: Điện Thế &amp; Mặt Đẳng Thế
              </h2>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Vật lí 11 - Bài 20
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Khảo sát Điện thế V, Hiệu điện thế U = VA - VB, Mặt đẳng thế vuông góc với vectơ E và Gia tốc hạt
            </p>
          </div>
        </div>

        {/* Global Sound & Reset Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
              soundEnabled
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title="Bật/Tắt âm thanh lớp học"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? "Âm thanh BẬT" : "Tắt tiếng"}</span>
          </button>

          <button
            onClick={() => applyPreset(preset)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
            title="Khôi phục trạng thái ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Đặt lại</span>
          </button>
        </div>
      </div>

      {/* TOP VIEW TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setViewMode("2d_field")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              viewMode === "2d_field"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mặt Đẳng Thế 2D</span>
          </button>
          <button
            onClick={() => setViewMode("3d_terrain")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              viewMode === "3d_terrain"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Núi Điện Thế 3D</span>
          </button>
          <button
            onClick={() => setViewMode("particle_lab")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              viewMode === "particle_lab"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Bắn Hạt &amp; Cơ Năng</span>
          </button>
          <button
            onClick={() => setViewMode("classroom_arena")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              viewMode === "classroom_arena"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold animate-pulse"
                : "text-emerald-400 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Đấu Trường Lớp Học 🔥</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Kịch bản điện trường:</span>
          <select
            value={preset}
            onChange={(e) => applyPreset(e.target.value as PresetType)}
            className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="capacitor">Tụ điện phẳng (Điện trường đều)</option>
            <option value="single_positive">Điện tích điểm dương (+Q)</option>
            <option value="dipole">Lưỡng cực điện Dipole (+Q và −Q)</option>
            <option value="two_positives">Hai điện tích cùng dấu (+Q và +Q)</option>
            <option value="custom">Tùy biến tự do (Kéo thả điện tích)</option>
          </select>
        </div>
      </div>

      {/* DIGITAL VOLTMETER HUD & LIVE READOUT BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-inner">
        {/* Red Probe VA */}
        <div className="flex flex-col gap-0.5 border-r border-slate-800 pr-2">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>Đầu dò Đỏ VA:</span>
          </div>
          <div className="text-xl md:text-2xl font-mono font-bold text-rose-300">
            {probeAPhysics.V > 0 ? `+${probeAPhysics.V.toFixed(1)}` : probeAPhysics.V.toFixed(1)}{" "}
            <span className="text-xs text-slate-400 font-sans">V</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Cường độ E: {probeAPhysics.E.toFixed(0)} V/m
          </div>
        </div>

        {/* Blue Probe VB */}
        <div className="flex flex-col gap-0.5 border-r border-slate-800 pr-2">
          <div className="flex items-center gap-1.5 text-xs text-sky-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Đầu dò Xanh VB:</span>
          </div>
          <div className="text-xl md:text-2xl font-mono font-bold text-sky-300">
            {probeBPhysics.V > 0 ? `+${probeBPhysics.V.toFixed(1)}` : probeBPhysics.V.toFixed(1)}{" "}
            <span className="text-xs text-slate-400 font-sans">V</span>
          </div>
          <div className="text-[10px] text-slate-400">Mốc so sánh điện thế</div>
        </div>

        {/* Hiệu điện thế U_AB */}
        <div className="flex flex-col gap-0.5 border-r border-slate-800 pr-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Hiệu điện thế UAB = VA − VB:</span>
          </div>
          <div className="text-xl md:text-2xl font-mono font-bold text-amber-300">
            {voltageU_AB > 0 ? `+${voltageU_AB.toFixed(1)}` : voltageU_AB.toFixed(1)}{" "}
            <span className="text-xs text-slate-400 font-sans">V</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Chiều dòng điện tự nhiên: {voltageU_AB >= 0 ? "A → B" : "B → A"}
          </div>
        </div>

        {/* Action Button: Drop Equipotential */}
        <div className="flex flex-col justify-center gap-1.5">
          <button
            onClick={handlePinContourAtProbeA}
            className="w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-bold py-2 px-2.5 rounded-lg shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Crosshair className="w-4 h-4" />
            <span>Ghim Mặt Đẳng Thế Tại VA</span>
          </button>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Đã ghim: {pinnedContours.length} đường</span>
            {pinnedContours.length > 0 && (
              <button
                onClick={() => setPinnedContours([])}
                className="text-rose-400 hover:underline"
              >
                Xóa hết
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CANVAS WORKSPACE & SIMULATION VIEW */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full max-w-[700px] h-[360px] md:h-[400px] cursor-crosshair touch-none"
        />

        {/* Instructions Overlay pill */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none shadow-md">
          <Move className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Kéo đầu dò Đỏ VA hoặc Xanh VB để đo điện thế khắp không gian</span>
        </div>

        {/* View mode overlays */}
        {viewMode === "classroom_arena" && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 rounded-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 text-emerald-300 p-2 rounded-lg font-bold flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Điểm lớp: {arenaScore} Đ</span>
              </div>

              {/* Game Selector inside Arena */}
              <div className="flex gap-1 bg-slate-800 p-0.5 rounded-lg">
                <button
                  onClick={() => {
                    setArenaGame("hunt");
                    nextHuntTarget();
                  }}
                  className={`px-2.5 py-1 rounded font-medium ${
                    arenaGame === "hunt" ? "bg-emerald-600 text-white font-bold" : "text-slate-400"
                  }`}
                >
                  1. Săn Đẳng Thế
                </button>
                <button
                  onClick={() => {
                    setArenaGame("prophecy");
                    setProphecyAnswered(false);
                    setProphecyChoice(null);
                    setProphecyResult(null);
                  }}
                  className={`px-2.5 py-1 rounded font-medium ${
                    arenaGame === "prophecy" ? "bg-blue-600 text-white font-bold" : "text-slate-400"
                  }`}
                >
                  2. Tiên Tri Đường Sức
                </button>
                <button
                  onClick={() => {
                    setArenaGame("cannon");
                    setCannonTarget({ x: 520, y: 180, hit: false });
                  }}
                  className={`px-2.5 py-1 rounded font-medium ${
                    arenaGame === "cannon" ? "bg-rose-600 text-white font-bold" : "text-slate-400"
                  }`}
                >
                  3. Pháo Bắn Hạt
                </button>
              </div>
            </div>

            {/* Arena Active Task description */}
            <div className="flex items-center gap-3">
              {arenaGame === "hunt" && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">
                    Nhiệm vụ: Rê đầu dò Đỏ tìm điểm có điện thế{" "}
                    <strong className="text-amber-300 font-mono text-sm">{targetVoltage} V (±3V)</strong>:
                  </span>
                  {huntSuccess ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 animate-bounce">
                      <CheckCircle2 className="w-4 h-4" /> CHÍNH XÁC! +100Đ
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono">Hiện tại: {probeAPhysics.V.toFixed(1)} V</span>
                  )}
                  <button
                    onClick={nextHuntTarget}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[11px]"
                  >
                    Đổi mục tiêu
                  </button>
                </div>
              )}

              {arenaGame === "prophecy" && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Hỏi: Vectơ E tại A và B hướng theo chiều nào?</span>
                  {!prophecyAnswered ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setProphecyAnswered(true);
                          setProphecyChoice("A_to_B");
                          const isCorrect = voltageU_AB >= 0;
                          setProphecyResult(isCorrect);
                          if (isCorrect) {
                            setArenaScore((s) => s + 100);
                            sfx.playSuccess();
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded font-bold"
                      >
                        A → B (từ cao về thấp)
                      </button>
                      <button
                        onClick={() => {
                          setProphecyAnswered(true);
                          setProphecyChoice("B_to_A");
                          const isCorrect = voltageU_AB < 0;
                          setProphecyResult(isCorrect);
                          if (isCorrect) {
                            setArenaScore((s) => s + 100);
                            sfx.playSuccess();
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded font-bold"
                      >
                        B → A
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {prophecyResult ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Xuất sắc! Đường sức luôn đi từ nơi điện thế cao về nơi điện thế thấp!
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Chưa đúng! VA = {probeAPhysics.V.toFixed(0)}V, VB = {probeBPhysics.V.toFixed(0)}V nên E phải đi từ {voltageU_AB >= 0 ? "A sang B" : "B sang A"}.
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setProphecyAnswered(false);
                          setProphecyResult(null);
                        }}
                        className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]"
                      >
                        Thử lại
                      </button>
                    </div>
                  )}
                </div>
              )}

              {arenaGame === "cannon" && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">
                    Bắn hạt từ vị trí đầu dò A sao cho bay trúng bia hồng tâm:
                  </span>
                  <button
                    onClick={() => handleLaunchParticle(25, -5)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1 rounded-lg shadow flex items-center gap-1"
                  >
                    <Flame className="w-4 h-4" /> Bắn Thử!
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CONTROLS & EXPERIMENT SETTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Panel 1: Capacitance / Charges Parameters */}
        <div className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Zap className="w-4 h-4" /> Thông số Nguồn Điện &amp; Điện Trường
            </span>
          </div>

          {preset === "capacitor" ? (
            <div className="flex flex-col gap-2.5">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Hiệu điện thế giữa 2 bản cực (U):</span>
                  <strong className="text-amber-300 font-mono">{plateVoltage} V</strong>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="10"
                  value={plateVoltage}
                  onChange={(e) => setPlateVoltage(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Khoảng cách giữa hai bản (d):</span>
                  <strong className="text-amber-300 font-mono">{plateDistance} cm</strong>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="1"
                  value={plateDistance}
                  onChange={(e) => setPlateDistance(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">
                <span>Cường độ điện trường đều: </span>
                <strong className="text-emerald-400 font-mono">
                  E = U / d = {(plateVoltage / (plateDistance * 0.01)).toFixed(0)} V/m
                </strong>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-slate-300">
              <p className="text-slate-400">
                Điện thế gây bởi điện tích điểm: V = k·q / r (mốc thế năng ở vô cực).
              </p>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col gap-1">
                {charges.map((c, i) => (
                  <div key={c.id} className="flex justify-between items-center text-[11px]">
                    <span>
                      Điện tích #{i + 1} ({c.q > 0 ? "Dương" : "Âm"}):
                    </span>
                    <strong className={c.q > 0 ? "text-rose-400 font-mono" : "text-sky-400 font-mono"}>
                      {c.q > 0 ? `+${c.q}` : c.q} nC
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panel 2: Visual Elements Toggles */}
        <div className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Layers className="w-4 h-4" /> Hiển Thị Phần Tử Vật Lí
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Vectơ Cường độ điện trường (→E)</span>
              <input
                type="checkbox"
                checked={showFieldVectors}
                onChange={(e) => setShowFieldVectors(e.target.checked)}
                className="accent-blue-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Mặt đẳng thế (V = const)</span>
              <input
                type="checkbox"
                checked={showEquipotentialLines}
                onChange={(e) => setShowEquipotentialLines(e.target.checked)}
                className="accent-blue-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Bản đồ nhiệt điện thế (Heatmap)</span>
              <input
                type="checkbox"
                checked={showVoltageHeatmap}
                onChange={(e) => setShowVoltageHeatmap(e.target.checked)}
                className="accent-blue-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Panel 3: Particle Accelerator / Launch controls */}
        <div className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-rose-400">
              <Sparkles className="w-4 h-4" /> Bắn Thử Điện Tích (Gia Tốc Hạt)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title={isPlaying ? "Tạm dừng chuyển động" : "Tiếp tục"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setParticles([])}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400"
                title="Xóa vệt hạt"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setSelectedParticleType("proton")}
                className={`py-1.5 rounded-lg border text-center font-bold ${
                  selectedParticleType === "proton"
                    ? "bg-sky-600/30 border-sky-500 text-sky-300"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Proton (p+)
              </button>
              <button
                onClick={() => setSelectedParticleType("electron")}
                className={`py-1.5 rounded-lg border text-center font-bold ${
                  selectedParticleType === "electron"
                    ? "bg-rose-600/30 border-rose-500 text-rose-300"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Electron (e-)
              </button>
              <button
                onClick={() => setSelectedParticleType("alpha")}
                className={`py-1.5 rounded-lg border text-center font-bold ${
                  selectedParticleType === "alpha"
                    ? "bg-amber-600/30 border-amber-500 text-amber-300"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Hạt α (+2)
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleLaunchParticle(0, 0)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-lg border border-slate-700 transition"
              >
                Thả đứng yên tại VA
              </button>
              <button
                onClick={() => handleLaunchParticle(18, 0)}
                className="flex-1 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold py-2 rounded-lg shadow-md transition flex items-center justify-center gap-1"
              >
                <Flame className="w-3.5 h-3.5" /> Bắn v0 sang phải
              </button>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
              💡 <em>Định luật bảo toàn cơ năng:</em> Wđ + q·V = hằng số. Điện tích dương tự do tăng tốc về phía điện thế thấp, electron leo về phía điện thế cao!
            </div>
          </div>
        </div>
      </div>

      {/* PEDAGOGICAL SUMMARY & CLASSROOM PROMPTS */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>Gợi Ý Khai Thác Mô Phỏng Sôi Nổi Cho Giáo Viên Trên Lớp:</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/60">
            <strong className="text-white block mb-1">1. Phép Tương Tự Độ Cao Núi:</strong>
            Chuyển sang tab <strong>Núi Điện Thế 3D</strong>, giải thích: Nước tự chảy từ đỉnh núi cao xuống đáy thung lũng thế nào thì hạt điện tích dương tự trượt từ điện thế cao về điện thế thấp y hệt như vậy!
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/60">
            <strong className="text-white block mb-1">2. Trực Quan Hóa Mặt Đẳng Thế:</strong>
            Kéo đầu dò Đỏ và bấm <em>Ghim Mặt Đẳng Thế</em>. Học sinh dễ dàng quan sát: Vectơ cường độ điện trường (→E) luôn luôn <strong>vuông góc</strong> với các mặt đẳng thế tại mọi điểm!
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/60">
            <strong className="text-white block mb-1">3. Trò Chơi Lớp Học Sôi Động:</strong>
            Bật tab <strong>Đấu Trường Lớp Học 🔥</strong>, mời các nhóm học sinh lên bảng hoặc chia tổ thi đấu: săn tìm giá trị điện thế nhanh nhất hoặc tiên tri chiều đường sức điện trường.
          </div>
        </div>
      </div>
    </div>
  );
};

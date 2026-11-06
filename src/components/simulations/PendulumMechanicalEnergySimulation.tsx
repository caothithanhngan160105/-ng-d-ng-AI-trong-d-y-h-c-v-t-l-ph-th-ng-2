import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  RotateCcw,
  Play,
  Pause,
  Zap,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Table,
  ArrowRight,
  Sparkles,
  Sliders,
  Activity,
  Download,
  Volume2,
  VolumeX,
  Repeat,
  Compass,
  Layers,
  Clock,
  ChevronRight,
  Lightbulb,
  ToggleLeft,
  ToggleRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { MathText } from "../MathText";
import { downloadSimulationOffline } from "../../utils/offlineSimulations";

interface DataRecord {
  id: number;
  trialName: string;
  timeSec: number;
  angleDeg: number;
  heightMeter: number;
  velocityMPerS: number;
  kineticEnergyJ: number;
  potentialEnergyJ: number;
  totalMechanicalEnergyJ: number;
  thermalLossJ: number;
  note: string;
}

export const PendulumMechanicalEnergySimulation: React.FC = () => {
  // ================= 1. CÁC THÔNG SỐ VẬT LÍ CON LẮC =================
  // Chiều dài dây treo L (m): 0.5m đến 2.0m (mặc định 1.0 m)
  const [lengthL, setLengthL] = useState<number>(1.0);

  // Khối lượng quả lắc m (kg): 0.1kg đến 2.0kg (mặc định 0.5 kg)
  const [massM, setMassM] = useState<number>(0.5);

  // Gia tốc trọng trường g (m/s²): chuẩn 9.8 m/s²
  const gravityG = 9.8;

  // Góc lệch ban đầu alpha0 (độ): từ 10° đến 60° (mặc định 45°)
  const [initialAngleDeg, setInitialAngleDeg] = useState<number>(45);

  // ================= 2. CHẾ ĐỘ HOẠT ĐỘNG =================
  // "ideal": Không ma sát (Cơ năng bảo toàn 100%)
  // "damped": Có lực cản không khí (Tắt dần, cơ năng chuyển thành nhiệt năng)
  // "clock": Con lắc đồng hồ (Cơ cấu bánh răng thoát cấp năng lượng giữ dao động đều)
  const [mode, setMode] = useState<"ideal" | "damped" | "clock">("ideal");

  // Hệ số cản không khí (cho chế độ damped)
  const [dampingCoeff, setDampingCoeff] = useState<number>(0.08);

  // Bật / tắt âm thanh tích tắc của đồng hồ
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // ================= 3. TRẠNG THÁI DAO ĐỘNG THỜI GIAN THỰC =================
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedScale, setSpeedScale] = useState<number>(1.0); // 0.2x, 0.5x, 1.0x

  // Biến trạng thái: góc theta (rad), vận tốc góc omega (rad/s)
  const [angleThetaRad, setAngleThetaRad] = useState<number>((45 * Math.PI) / 180);
  const [angularVelocity, setAngularVelocity] = useState<number>(0);
  const [simTimeSec, setSimTimeSec] = useState<number>(0);
  const [accumulatedThermalLoss, setAccumulatedThermalLoss] = useState<number>(0);

  // Đồng hồ hiển thị thời gian kim (giây trôi qua)
  const [clockSeconds, setClockSeconds] = useState<number>(0);

  // Tương tác kéo thả quả lắc bằng chuột/cảm ứng
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Ref audio click sound
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastTickSide = useRef<"left" | "right">("left");

  // ================= 4. CÔNG TẮC ẨN / HIỆN SỐ LIỆU NĂNG LƯỢNG (SƯ PHẠM CV 5512) =================
  // Để học sinh tự áp dụng công thức tính toán: Wt = mgh, Wd = 1/2*m*v^2, W = Wd + Wt
  const [showEnergyValues, setShowEnergyValues] = useState<{
    height: boolean;
    velocity: boolean;
    potentialEnergy: boolean;
    kineticEnergy: boolean;
    totalMechanicalEnergy: boolean;
  }>({
    height: true,
    velocity: false,
    potentialEnergy: false,
    kineticEnergy: false,
    totalMechanicalEnergy: false,
  });

  const isAllValuesVisible =
    showEnergyValues.velocity &&
    showEnergyValues.potentialEnergy &&
    showEnergyValues.kineticEnergy &&
    showEnergyValues.totalMechanicalEnergy;

  const toggleAllValues = () => {
    const next = !isAllValuesVisible;
    setShowEnergyValues({
      height: true,
      velocity: next,
      potentialEnergy: next,
      kineticEnergy: next,
      totalMechanicalEnergy: next,
    });
  };

  // ================= 5. Ô HỌC SINH TỰ TÍNH & KIỂM TRA ĐÁP ÁN =================
  const [studentInput, setStudentInput] = useState<{
    value: string;
    target: "Wt" | "Wd" | "W" | "v";
  }>({ value: "", target: "Wt" });

  const [studentFeedback, setStudentFeedback] = useState<{
    status: "idle" | "correct" | "incorrect";
    message: string;
  }>({ status: "idle", message: "" });

  // ================= 6. TABS ĐIỀU HƯỚNG BÀI DẠY =================
  const [activeTab, setActiveTab] = useState<
    "lab" | "escapement_demo" | "data_table" | "worksheets" | "quiz"
  >("lab");

  // Bảng lưu số liệu thực nghiệm
  const [recordedData, setRecordedData] = useState<DataRecord[]>([]);

  // ================= 7. TÍNH TOÁN CÁC ĐẠI LƯỢNG VẬT LÍ =================
  const angleThetaDeg = useMemo(() => (angleThetaRad * 180) / Math.PI, [angleThetaRad]);

  // Độ cao tức thời h so với vị trí cân bằng (chọn mốc thế năng tại VTCB h = 0):
  // h = L * (1 - cos(theta))
  const currentHeightM = useMemo(() => {
    const h = lengthL * (1 - Math.cos(angleThetaRad));
    return Math.max(0, h);
  }, [lengthL, angleThetaRad]);

  // Độ cao cực đại ban đầu: h0 = L * (1 - cos(alpha0))
  const initialAngleRad = useMemo(() => (initialAngleDeg * Math.PI) / 180, [initialAngleDeg]);
  const initialHeightM = useMemo(
    () => lengthL * (1 - Math.cos(initialAngleRad)),
    [lengthL, initialAngleRad]
  );

  // Vận tốc dài v = omega * L (m/s)
  const currentVelocityMPerS = useMemo(() => {
    return Math.abs(angularVelocity * lengthL);
  }, [angularVelocity, lengthL]);

  // Vận tốc cực đại tại VTCB theo định luật bảo toàn cơ năng lí thuyết:
  // v_max = sqrt(2 * g * h0)
  const theoreticalVMax = useMemo(() => {
    return Math.sqrt(2 * gravityG * initialHeightM);
  }, [gravityG, initialHeightM]);

  // Thế năng trọng trường tức thời: W_t = m * g * h (Joules)
  const currentPotentialEnergyJ = useMemo(() => {
    return massM * gravityG * currentHeightM;
  }, [massM, gravityG, currentHeightM]);

  // Động năng tức thời: W_d = 1/2 * m * v^2 (Joules)
  const currentKineticEnergyJ = useMemo(() => {
    return 0.5 * massM * Math.pow(angularVelocity * lengthL, 2);
  }, [massM, angularVelocity, lengthL]);

  // Cơ năng tổng cộng tức thời: W = W_d + W_t (Joules)
  const currentTotalEnergyJ = useMemo(() => {
    return currentKineticEnergyJ + currentPotentialEnergyJ;
  }, [currentKineticEnergyJ, currentPotentialEnergyJ]);

  // Cơ năng toàn phần ban đầu cực đại: W0 = m * g * h0
  const initialMechanicalEnergyJ = useMemo(() => {
    return massM * gravityG * initialHeightM;
  }, [massM, gravityG, initialHeightM]);

  // Chu kì dao động con lắc đơn lí thuyết: T = 2 * pi * sqrt(L / g) (cho góc nhỏ)
  const theoreticalPeriodT = useMemo(() => {
    return 2 * Math.PI * Math.sqrt(lengthL / gravityG);
  }, [lengthL, gravityG]);

  // Tần số dao động: f = 1 / T
  const theoreticalFrequencyF = useMemo(() => {
    return 1 / theoreticalPeriodT;
  }, [theoreticalPeriodT]);

  // ================= 8. ÂM THANH TÍCH TẮC ĐỒNG HỒ =================
  const playTickSound = (type: "tick" | "tock") => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(type === "tick" ? 900 : 750, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio fallback
    }
  };

  // ================= 9. VÒNG LẶP MÔ PHỎNG VẬT LÍ (NUMERICAL INTEGRATION) =================
  useEffect(() => {
    if (!isRunning || isDragging) return;
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const realDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Giới hạn dt tránh nhảy vọt nếu tab bị mất focus
      const dt = Math.min(realDt, 0.04) * speedScale;

      // Phương trình vi phân dao động con lắc:
      // d²(theta)/dt² = - (g / L) * sin(theta) - (damping / m) * d(theta)/dt
      setAngleThetaRad((prevTheta) => {
        let currentOmega = angularVelocity;

        // Tính gia tốc góc alpha_acc
        let dampingTerm = 0;
        if (mode === "damped") {
          dampingTerm = (dampingCoeff / massM) * currentOmega;
        }

        // Trong chế độ con lắc đồng hồ (clock mode): cơ cấu hồi năng lượng bù đúng phần tiêu hao
        if (mode === "clock") {
          dampingTerm = (0.015 / massM) * currentOmega; // Ma sát nhẹ
          // Cứ mỗi lần qua VTCB, cơ cấu bánh răng thoát kích một xung lực nhỏ bù cơ năng
          if (Math.abs(prevTheta) < 0.02 && Math.abs(currentOmega) > 0.1) {
            currentOmega += currentOmega > 0 ? 0.012 : -0.012;
          }
        }

        const alphaAcc = -(gravityG / lengthL) * Math.sin(prevTheta) - dampingTerm;

        // Tích phân Euler-Cromer
        const newOmega = currentOmega + alphaAcc * dt;
        const newTheta = prevTheta + newOmega * dt;

        setAngularVelocity(newOmega);

        // Phát hiện qua VTCB (đổi dấu góc) để phát tiếng tích tắc & tăng kim đồng hồ
        if (
          (prevTheta < 0 && newTheta >= 0) ||
          (prevTheta > 0 && newTheta <= 0)
        ) {
          if (lastTickSide.current === "left") {
            playTickSound("tick");
            lastTickSide.current = "right";
          } else {
            playTickSound("tock");
            lastTickSide.current = "left";
          }
          setClockSeconds((s) => s + 1);
        }

        // Tính nhiệt năng hao phí tích lũy trong chế độ cản
        if (mode === "damped") {
          const dLoss = Math.abs(dampingTerm * newOmega * massM * lengthL * lengthL) * dt;
          setAccumulatedThermalLoss((l) => l + dLoss);
        }

        return newTheta;
      });

      setSimTimeSec((t) => t + dt);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, isDragging, speedScale, lengthL, massM, gravityG, mode, dampingCoeff, angularVelocity]);

  // ================= 10. ĐẶT LẠI TRẠNG THÁI (RESET) =================
  const handleReset = () => {
    setIsRunning(false);
    const rad = (initialAngleDeg * Math.PI) / 180;
    setAngleThetaRad(rad);
    setAngularVelocity(0);
    setSimTimeSec(0);
    setAccumulatedThermalLoss(0);
    setClockSeconds(0);
    setStudentFeedback({ status: "idle", message: "" });
  };

  // ================= 11. TƯƠNG TÁC KÉO THẢ QUẢ LẮC BẰNG CHUỘT / TAY =================
  const canvasW = 600;
  const canvasH = 430;
  const pivotX = canvasW / 2;
  const pivotY = 55;

  // Tỉ lệ scale độ dài dây trên canvas: L = 1.0m tương đương 230px
  const pixelsPerMeter = 230;
  const pendulumPixelLen = lengthL * pixelsPerMeter;

  // Tọa độ quả lắc
  const bobX = pivotX + pendulumPixelLen * Math.sin(angleThetaRad);
  const bobY = pivotY + pendulumPixelLen * Math.cos(angleThetaRad);

  const handlePointerDownBob = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsRunning(false);
    setAngularVelocity(0);
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {
      // Safe pointer capture
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * canvasW;
    const mouseY = ((e.clientY - rect.top) / rect.height) * canvasH;

    const dx = mouseX - pivotX;
    const dy = mouseY - pivotY;

    // Góc kéo lệch mới
    let newAngle = Math.atan2(dx, dy);
    // Giới hạn góc thả tối đa ±75°
    newAngle = Math.max(-1.3, Math.min(1.3, newAngle));
    setAngleThetaRad(newAngle);
    setInitialAngleDeg(Math.round(Math.abs((newAngle * 180) / Math.PI)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Safe capture release
      }
    }
  };

  // ================= 12. GHI DỮ LIỆU ĐO VÀO BẢNG =================
  const handleRecordData = () => {
    const record: DataRecord = {
      id: Date.now(),
      trialName: `Điểm ${recordedData.length + 1}`,
      timeSec: parseFloat(simTimeSec.toFixed(2)),
      angleDeg: parseFloat(angleThetaDeg.toFixed(1)),
      heightMeter: parseFloat(currentHeightM.toFixed(4)),
      velocityMPerS: parseFloat(currentVelocityMPerS.toFixed(3)),
      kineticEnergyJ: parseFloat(currentKineticEnergyJ.toFixed(3)),
      potentialEnergyJ: parseFloat(currentPotentialEnergyJ.toFixed(3)),
      totalMechanicalEnergyJ: parseFloat(currentTotalEnergyJ.toFixed(3)),
      thermalLossJ: parseFloat(accumulatedThermalLoss.toFixed(3)),
      note:
        Math.abs(angleThetaDeg) < 1
          ? "VTCB (Wd max, Wt = 0)"
          : Math.abs(currentVelocityMPerS) < 0.05
          ? "Vị trí biên (Wt max, Wd = 0)"
          : "Vị trí trung gian (Wd + Wt = const)",
    };
    setRecordedData((prev) => [record, ...prev]);
  };

  const handleExportCSV = () => {
    if (recordedData.length === 0) return;
    const headers = [
      "Lần đo",
      "Thời gian t (s)",
      "Góc lệch (độ)",
      "Độ cao h (m)",
      "Vận tốc v (m/s)",
      "Động năng Wd (J)",
      "Thế năng Wt (J)",
      "Cơ năng W (J)",
      "Nhiệt hao phí (J)",
      "Ghi chú",
    ];
    const rows = recordedData.map((r) => [
      r.trialName,
      r.timeSec,
      r.angleDeg,
      r.heightMeter,
      r.velocityMPerS,
      r.kineticEnergyJ,
      r.potentialEnergyJ,
      r.totalMechanicalEnergyJ,
      r.thermalLossJ,
      `"${r.note}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bang_so_lieu_co_nang_con_lac_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= 13. XỬ LÍ KIỂM TRA ĐÁP ÁN CỦA HỌC SINH =================
  const handleCheckStudentCalculation = () => {
    const entered = parseFloat(studentInput.value.replace(",", "."));
    if (isNaN(entered)) {
      setStudentFeedback({
        status: "incorrect",
        message: "Vui lòng nhập một số hợp lệ trước khi bấm kiểm tra!",
      });
      return;
    }

    let expected = 0;
    let label = "";
    let formula = "";

    if (studentInput.target === "Wt") {
      expected = currentPotentialEnergyJ;
      label = "Thế năng W_t";
      formula = `W_t = m · g · h = ${massM} kg × ${gravityG} m/s² × ${currentHeightM.toFixed(3)} m`;
    } else if (studentInput.target === "Wd") {
      expected = currentKineticEnergyJ;
      label = "Động năng W_đ";
      formula = `W_đ = 1/2 · m · v² = 0.5 × ${massM} kg × (${currentVelocityMPerS.toFixed(2)})²`;
    } else if (studentInput.target === "W") {
      expected = currentTotalEnergyJ;
      label = "Cơ năng tổng W";
      formula = `W = W_đ + W_t = ${currentKineticEnergyJ.toFixed(2)} J + ${currentPotentialEnergyJ.toFixed(2)} J`;
    } else {
      expected = currentVelocityMPerS;
      label = "Vận tốc v";
      formula = `v = √(2 · g · (h₀ - h)) = √(2 × 9.8 × ${(initialHeightM - currentHeightM).toFixed(3)})`;
    }

    const tolerance = Math.max(0.08 * expected, 0.05);

    if (Math.abs(entered - expected) <= tolerance) {
      setStudentFeedback({
        status: "correct",
        message: `🎉 Rất xuất sắc! Bạn đã tính đúng: ${label} = ${expected.toFixed(3)} (${formula} = ${expected.toFixed(3)}).`,
      });
    } else {
      setStudentFeedback({
        status: "incorrect",
        message: `Chưa chính xác. Kết quả lí thuyết là ~${expected.toFixed(3)}. Gợi ý: Áp dụng công thức ${formula}.`,
      });
    }
  };

  // ================= 14. BỘ CÂU HỎI TRẮC NGHIỆM ĐÁNH GIÁ NĂNG LỰC =================
  const quizQuestions = [
    {
      id: 1,
      question:
        "Khi một con lắc đồng hồ chuyển động từ vị trí biên về vị trí cân bằng (bỏ qua mọi ma sát), sự chuyển hóa năng lượng nào sau đây diễn ra?",
      options: [
        "A. Động năng chuyển hóa thành thế năng, cơ năng tăng dần.",
        "B. Thế năng chuyển hóa thành động năng, cơ năng được bảo toàn.",
        "C. Thế năng chuyển hóa thành động năng, cơ năng giảm dần.",
        "D. Cả động năng và thế năng đều tăng liên tục.",
      ],
      correctIndex: 1,
      explanation:
        "Khi con lắc đi từ biên về VTCB, độ cao h giảm dần nên thế năng W_t = mgh giảm; đồng thời vận tốc v tăng dần nên động năng W_đ = 1/2*m*v^2 tăng. Do bỏ qua ma sát, thế năng đã chuyển hóa trọn vẹn thành động năng và tổng cơ năng W = W_đ + W_t không đổi (bảo toàn).",
    },
    {
      id: 2,
      question:
        "Tại vị trí cân bằng của con lắc (chọn mốc thế năng tại vị trí cân bằng), năng lượng của con lắc có đặc điểm gì?",
      options: [
        "A. Thế năng cực đại, động năng bằng 0.",
        "B. Động năng cực đại, thế năng triệt tiêu (W_t = 0).",
        "C. Động năng và thế năng bằng nhau và cùng bằng 0.",
        "D. Cơ năng bị triệt tiêu hoàn toàn.",
      ],
      correctIndex: 1,
      explanation:
        "Tại VTCB, độ cao h = 0 so với mốc nên thế năng W_t = 0. Vận tốc của vật đạt giá trị cực đại v_max nên động năng đạt giá trị cực đại W_đ(max) = W (toàn bộ cơ năng ở dạng động năng).",
    },
    {
      id: 3,
      question:
        "Một con lắc đơn gồm quả nặng m = 0,2 kg được thả không vận tốc đầu từ vị trí có độ cao h0 = 0,2 m so với mốc thế năng tại VTCB. Lấy g = 10 m/s², bỏ qua ma sát. Vận tốc của quả nặng khi đi qua vị trí cân bằng là:",
      options: [
        "A. 1,0 m/s",
        "B. 2,0 m/s",
        "C. 4,0 m/s",
        "D. 0,4 m/s",
      ],
      correctIndex: 1,
      explanation:
        "Áp dụng định luật bảo toàn cơ năng giữa vị trí biên và vị trí cân bằng: W_biên = W_VTCB <=> m*g*h0 = 1/2*m*v_max^2 <=> v_max = sqrt(2*g*h0) = sqrt(2 * 10 * 0,2) = sqrt(4) = 2,0 m/s.",
    },
    {
      id: 4,
      question:
        "Trong thực tế, tại sao con lắc của chiếc đồng hồ quả lắc treo tường có thể chạy đung đưa nhiều năm liên tục mà không bị dừng lại do lực cản không khí?",
      options: [
        "A. Vì trong đồng hồ quả lắc hoàn toàn là môi trường chân không không có ma sát.",
        "B. Vì quả lắc làm bằng kim loại đặc biệt không chịu tác dụng của lực cản không khí.",
        "C. Nhờ cơ cấu hồi năng lượng (bánh răng thoát escapement và quả tạ hoặc dây cót) bổ sung đúng phần cơ năng bị hao phí trong mỗi chu kì.",
        "D. Vì định luật bảo toàn cơ năng luôn đúng trong mọi trường hợp thực tế có ma sát.",
      ],
      correctIndex: 2,
      explanation:
        "Trong thực tế luôn có lực cản không khí và ma sát tại trục quay làm cơ năng tiêu hao thành nhiệt năng (dao động tắt dần). Đồng hồ quả lắc duy trì được chuyển động đều đặn là nhờ quả tạ treo (hoặc dây cót) thông qua cơ cấu bánh răng thoát (escapement) cấp một xung năng lượng rất nhỏ sau mỗi nhịp dao động bù đúng phần năng lượng đã mất mát.",
    },
    {
      id: 5,
      question:
        "Khi quả nặng của con lắc ở vị trí mà động năng bằng 3 lần thế năng (W_đ = 3*W_t), độ cao h của vật so với mốc thế năng bằng bao nhiêu phần độ cao cực đại h0?",
      options: [
        "A. h = 1/4 h0",
        "B. h = 1/3 h0",
        "C. h = 1/2 h0",
        "D. h = 3/4 h0",
      ],
      correctIndex: 0,
      explanation:
        "Cơ năng W = W_đ + W_t = 3*W_t + W_t = 4*W_t <=> m*g*h0 = 4*(m*g*h) => h = h0 / 4 (độ cao bằng 1/4 độ cao cực đại).",
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownloadOffline = () => {
    downloadSimulationOffline("sim-pendulum-energy-10");
    setDownloadNotice("Đã tải thành công file HTML thí nghiệm độc lập về máy! Bạn có thể lưu vào USB hoặc mở trực tiếp trên máy tính phòng học mà không cần kết nối mạng.");
    setTimeout(() => setDownloadNotice(null), 6000);
  };

  return (
    <div
      id="pendulum-energy-sim-container"
      className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden font-sans select-none"
    >
      {/* 1. Header Toolbar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Mô phỏng Con lắc Đồng hồ & Định luật Bảo toàn Cơ năng
              </h2>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                Vật lí 10 • CT GDPT 2018
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Chuyển hóa qua lại giữa Động năng <span className="text-emerald-400 font-mono font-bold">W_đ</span> & Thế năng trọng trường <span className="text-amber-300 font-mono font-bold">W_t</span> • Bảo toàn cơ năng <span className="text-indigo-300 font-mono font-bold">W = const</span>
            </p>
          </div>
        </div>

        {/* Action: Download Offline HTML Button + Navigation Tab buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadOffline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/70 text-emerald-300 hover:text-white text-xs font-bold transition shadow-xs"
            title="Tải toàn bộ thí nghiệm về máy để chiếu dạy học offline không cần mạng"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tải thí nghiệm về máy (Offline)</span>
          </button>

          {/* Navigation Tab buttons */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("lab")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "lab"
                ? "bg-amber-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Thí nghiệm Con lắc</span>
          </button>
          <button
            onClick={() => setActiveTab("escapement_demo")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "escapement_demo"
                ? "bg-amber-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Cơ chế Đồng hồ (Escapement)</span>
          </button>
          <button
            onClick={() => setActiveTab("data_table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "data_table"
                ? "bg-amber-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Bảng số liệu ({recordedData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("worksheets")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "worksheets"
                ? "bg-amber-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Phiếu học tập CV 5512</span>
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "quiz"
                ? "bg-amber-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Luyện tập & Đánh giá</span>
          </button>
        </div>
        </div>
      </div>

      {/* Offline download success banner */}
      {downloadNotice && (
        <div className="bg-emerald-950/90 border-b border-emerald-700/80 px-4 py-2.5 text-xs text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
          <button onClick={() => setDownloadNotice(null)} className="text-emerald-400 hover:text-white font-bold text-sm">✕</button>
        </div>
      )}

      {/* ======================= TAB 1: THÍ NGHIỆM CON LẮC & BIỂU ĐỒ NĂNG LƯỢNG ======================= */}
      {activeTab === "lab" && (
        <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Visual Stage (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Top Toolbar over Canvas */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 px-3 py-2 rounded-xl border border-slate-800 text-xs">
              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    setMode("ideal");
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    mode === "ideal"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Không ma sát: Cơ năng bảo toàn 100%"
                >
                  Bảo toàn 100% (Lí tưởng)
                </button>
                <button
                  onClick={() => {
                    setMode("damped");
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    mode === "damped"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Có ma sát không khí: Dao động tắt dần, cơ năng chuyển thành nhiệt năng"
                >
                  Tắt dần (Có ma sát)
                </button>
                <button
                  onClick={() => {
                    setMode("clock");
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    mode === "clock"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Con lắc đồng hồ quả lắc: Bánh răng thoát bù năng lượng giữ biên độ ổn định"
                >
                  Con lắc Đồng hồ ⏱️
                </button>
              </div>

              {/* Sound & Toggle Master buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
                    soundEnabled
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                  title="Bật/tắt tiếng tích tắc đồng hồ"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{soundEnabled ? "Âm thanh: Bật" : "Tắt tiếng"}</span>
                </button>

                <button
                  onClick={toggleAllValues}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                    isAllValuesVisible
                      ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  }`}
                >
                  {isAllValuesVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isAllValuesVisible ? "Ẩn số liệu" : "Hiện số liệu"}</span>
                </button>
              </div>
            </div>

            {/* Interactive Stage: Side-by-side Layout (Vertical Run Controls + SVG Pendulum Canvas) */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 select-none">
              {/* VERTICAL ACTION CONTROLS PANEL (Hàng dọc cạnh bên thí nghiệm) */}
              <div className="w-full md:w-44 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-lg shrink-0 order-2 md:order-1">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5" />
                      Điều khiển chạy
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isRunning ? "bg-emerald-400 animate-ping" : "bg-slate-600"
                      }`}
                    />
                  </div>

                  {/* Primary Buttons */}
                  <div className="flex flex-col gap-2">
                    {/* Big Play / Pause Button */}
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition shadow-md ${
                        isRunning
                          ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-amber-500/20"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-4 h-4 fill-current animate-pulse" /> Tạm dừng
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" /> Thả dao động
                        </>
                      )}
                    </button>

                    {/* Reset Button */}
                    <button
                      onClick={handleReset}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      title="Đưa quả lắc về góc ban đầu alpha0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Đặt lại (Về biên)
                    </button>

                    {/* Step button: nhích từng chút một */}
                    <button
                      onClick={() => {
                        setIsRunning(false);
                        setSimTimeSec((t) => t + 0.05);
                        // Nhích góc một lượng nhỏ theo vận tốc hiện tại
                        setAngleThetaRad((a) => a + (angularVelocity || 0.1) * 0.04);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 transition"
                      title="Nhích chậm 1 khoảnh khắc để quan sát chi tiết"
                    >
                      <ChevronRight className="w-3.5 h-3.5" /> Bước tiếp
                    </button>

                    {/* Record trial to table */}
                    <button
                      onClick={handleRecordData}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
                      title="Lưu số liệu thời điểm này vào bảng số liệu thực nghiệm"
                    >
                      <Table className="w-3.5 h-3.5 text-amber-400" /> Ghi số liệu
                    </button>

                    {/* Offline Download button in vertical panel */}
                    <button
                      onClick={handleDownloadOffline}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 transition shadow-xs"
                      title="Tải toàn bộ thí nghiệm về máy để chiếu dạy học offline không cần mạng"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" /> Tải về máy
                    </button>
                  </div>
                </div>

                {/* Speed Selection */}
                <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" /> Tốc độ quan sát:
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {[
                      { label: "0.2x", val: 0.2 },
                      { label: "0.5x", val: 0.5 },
                      { label: "1.0x", val: 1.0 },
                    ].map((s) => (
                      <button
                        key={s.val}
                        onClick={() => setSpeedScale(s.val)}
                        className={`py-1 rounded text-[10px] font-medium transition text-center ${
                          speedScale === s.val
                            ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                            : "text-slate-400 hover:text-slate-200 bg-slate-900"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Drag reminder note */}
                  <div className="text-[10px] text-slate-400 mt-1 leading-tight text-center bg-slate-900/80 p-1.5 rounded-lg border border-slate-800/80">
                    💡 <em>Bạn có thể dùng chuột kéo thả quả lắc trực tiếp trên hình!</em>
                  </div>
                </div>
              </div>

              {/* MAIN SVG CANVAS (Khung mô phỏng con lắc & vỏ đồng hồ) */}
              <div className="relative flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-2 flex flex-col items-center justify-center overflow-hidden shadow-inner order-1 md:order-2">
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${canvasW} ${canvasH}`}
                  className="w-full h-auto max-h-[380px] select-none touch-none cursor-crosshair drop-shadow-2xl"
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                >
                  <defs>
                    {/* Shadow filter for bob */}
                    <filter id="bobGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.4" />
                    </filter>

                    {/* Metallic brass gradient for pendulum bob */}
                    <radialGradient id="brassBobGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="45%" stopColor="#f59e0b" />
                      <stop offset="85%" stopColor="#b45309" />
                      <stop offset="100%" stopColor="#78350f" />
                    </radialGradient>

                    {/* Velocity arrow marker */}
                    <marker
                      id="velArrow"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                    </marker>

                    {/* Weight Force marker */}
                    <marker
                      id="weightArrow"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
                    </marker>

                    {/* Clock body wood gradient */}
                    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3f2314" />
                      <stop offset="50%" stopColor="#5c341f" />
                      <stop offset="100%" stopColor="#2c180e" />
                    </linearGradient>
                  </defs>

                  {/* 1. Wooden Grandfather Clock Body Outline */}
                  <g opacity={mode === "clock" ? 1 : 0.35}>
                    {/* Outer cabinet frame */}
                    <rect
                      x={pivotX - 160}
                      y="15"
                      width="320"
                      height="390"
                      rx="20"
                      fill="url(#woodGrad)"
                      stroke="#854d0e"
                      strokeWidth="2.5"
                      opacity="0.25"
                    />
                    {/* Inner glass window */}
                    <rect
                      x={pivotX - 140}
                      y="35"
                      width="280"
                      height="355"
                      rx="12"
                      fill="#0f172a"
                      fillOpacity="0.7"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />

                    {/* Top Clock Dial (Mặt đồng hồ số có kim chạy) */}
                    <g transform={`translate(${pivotX}, 45)`}>
                      <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
                      {/* 12 hour tick marks */}
                      <circle cx="0" cy="-16" r="1.5" fill="#e2e8f0" />
                      <circle cx="16" cy="0" r="1.5" fill="#e2e8f0" />
                      <circle cx="0" cy="16" r="1.5" fill="#e2e8f0" />
                      <circle cx="-16" cy="0" r="1.5" fill="#e2e8f0" />
                      {/* Seconds hand rotating */}
                      <line
                        x1="0"
                        y1="0"
                        x2={14 * Math.sin(((clockSeconds * 6) * Math.PI) / 180)}
                        y2={-14 * Math.cos(((clockSeconds * 6) * Math.PI) / 180)}
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="0" cy="0" r="2" fill="#ffffff" />
                    </g>
                  </g>

                  {/* 2. Angle Protractor Arc (Thước đo độ góc) */}
                  <path
                    d={`M ${pivotX - 110} ${pivotY} A 110 110 0 0 0 ${pivotX + 110} ${pivotY}`}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {[-60, -45, -30, 0, 30, 45, 60].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const tx = pivotX + 110 * Math.sin(rad);
                    const ty = pivotY + 110 * Math.cos(rad);
                    return (
                      <g key={deg}>
                        <circle cx={tx} cy={ty} r="1.5" fill="#64748b" />
                        {deg !== 0 && (
                          <text
                            x={tx}
                            y={ty + 11}
                            fill="#64748b"
                            fontSize="8"
                            textAnchor="middle"
                          >
                            {Math.abs(deg)}°
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* 3. Equilibrium Vertical Center Reference Line (Phương thẳng đứng VTCB) */}
                  <line
                    x1={pivotX}
                    y1={pivotY}
                    x2={pivotX}
                    y2={pivotY + pendulumPixelLen + 40}
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={pivotX}
                    y={pivotY + pendulumPixelLen + 50}
                    fill="#94a3b8"
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    VTCB (O)
                  </text>

                  {/* 4. Zero Potential Energy Reference Level (Mốc thế năng Wt = 0 tại đáy) */}
                  {(() => {
                    const lowestY = pivotY + pendulumPixelLen;
                    return (
                      <g>
                        <line
                          x1={pivotX - 130}
                          y1={lowestY}
                          x2={pivotX + 130}
                          y2={lowestY}
                          stroke="#10b981"
                          strokeWidth="1.5"
                          strokeDasharray="5 3"
                          opacity="0.8"
                        />
                        <text
                          x={pivotX + 135}
                          y={lowestY + 3}
                          fill="#34d399"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          Mốc thế năng (h = 0, W_t = 0)
                        </text>

                        {/* Height indicator from current bob to zero reference */}
                        {currentHeightM > 0.005 && (
                          <g>
                            <line
                              x1={bobX}
                              y1={bobY}
                              x2={bobX}
                              y2={lowestY}
                              stroke="#f59e0b"
                              strokeWidth="2"
                              strokeDasharray="2 2"
                            />
                            <text
                              x={bobX + (angleThetaRad >= 0 ? 8 : -35)}
                              y={(bobY + lowestY) / 2}
                              fill="#fde047"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              h = {currentHeightM.toFixed(3)} m
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })()}

                  {/* 5. Trajectory Arc (Cung quỹ đạo chuyển động) */}
                  {(() => {
                    const maxRad = initialAngleRad;
                    const startArcX = pivotX - pendulumPixelLen * Math.sin(maxRad);
                    const startArcY = pivotY + pendulumPixelLen * Math.cos(maxRad);
                    const endArcX = pivotX + pendulumPixelLen * Math.sin(maxRad);
                    const endArcY = pivotY + pendulumPixelLen * Math.cos(maxRad);
                    return (
                      <path
                        d={`M ${startArcX} ${startArcY} A ${pendulumPixelLen} ${pendulumPixelLen} 0 0 0 ${endArcX} ${endArcY}`}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="1.5"
                        strokeDasharray="2 4"
                        opacity="0.5"
                      />
                    );
                  })()}

                  {/* 6. Pivot Point (Điểm treo cố định) */}
                  <circle cx={pivotX} cy={pivotY} r="7" fill="#64748b" stroke="#ffffff" strokeWidth="2" />
                  <rect
                    x={pivotX - 18}
                    y={pivotY - 14}
                    width="36"
                    height="8"
                    rx="3"
                    fill="#334155"
                    stroke="#64748b"
                    strokeWidth="1"
                  />

                  {/* 7. Suspension Rod / Cord (Thanh / Dây treo con lắc) */}
                  <line
                    x1={pivotX}
                    y1={pivotY}
                    x2={bobX}
                    y2={bobY}
                    stroke="#e2e8f0"
                    strokeWidth={mode === "clock" ? 4 : 2.5}
                    strokeLinecap="round"
                  />

                  {/* 8. Velocity Vector Arrow v (Vectơ vận tốc tức thời tiếp tuyến quỹ đạo) */}
                  {Math.abs(currentVelocityMPerS) > 0.05 && (
                    <g>
                      {(() => {
                        // Tiếp tuyến với đường tròn: góc vuông với bán kính
                        const tangentAngle = angleThetaRad + (angularVelocity > 0 ? Math.PI / 2 : -Math.PI / 2);
                        const vLen = Math.min(65, currentVelocityMPerS * 28);
                        const vxEnd = bobX + vLen * Math.sin(tangentAngle);
                        const vyEnd = bobY + vLen * Math.cos(tangentAngle);
                        return (
                          <g>
                            <line
                              x1={bobX}
                              y1={bobY}
                              x2={vxEnd}
                              y2={vyEnd}
                              stroke="#10b981"
                              strokeWidth="3"
                              markerEnd="url(#velArrow)"
                            />
                            <text
                              x={vxEnd + 6}
                              y={vyEnd}
                              fill="#34d399"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              v = {currentVelocityMPerS.toFixed(2)} m/s
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  )}

                  {/* 9. Gravity Force Arrow P = mg */}
                  <line
                    x1={bobX}
                    y1={bobY}
                    x2={bobX}
                    y2={bobY + 38}
                    stroke="#ef4444"
                    strokeWidth="2"
                    markerEnd="url(#weightArrow)"
                    opacity="0.85"
                  />
                  <text x={bobX + 6} y={bobY + 34} fill="#f87171" fontSize="9" fontWeight="bold">
                    P = mg
                  </text>

                  {/* 10. The Bob (Quả nặng con lắc) - Có thể kéo thả trực tiếp */}
                  <g
                    filter="url(#bobGlow)"
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={handlePointerDownBob}
                  >
                    {/* Outer pulse when moving */}
                    {isRunning && (
                      <circle
                        cx={bobX}
                        cy={bobY}
                        r={24}
                        fill="#f59e0b"
                        opacity="0.25"
                        className="animate-ping"
                      />
                    )}
                    {/* Bob disk */}
                    <circle
                      cx={bobX}
                      cy={bobY}
                      r={18 + Math.sqrt(massM) * 4}
                      fill="url(#brassBobGrad)"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* Mass label */}
                    <text
                      x={bobX}
                      y={bobY + 4}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="extrabold"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {massM}kg
                    </text>
                  </g>

                  {/* Angle label at pivot */}
                  {Math.abs(angleThetaDeg) > 3 && (
                    <text
                      x={pivotX + 24 * Math.sin(angleThetaRad / 2)}
                      y={pivotY + 28 * Math.cos(angleThetaRad / 2)}
                      fill="#fbbf24"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      α = {Math.abs(Math.round(angleThetaDeg))}°
                    </text>
                  )}
                </svg>

                {/* Status caption below canvas */}
                <div className="w-full bg-slate-900/90 rounded-xl p-2 mt-1 border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>
                      Góc lệch hiện tại: <strong className="text-amber-400 font-mono">{angleThetaDeg.toFixed(1)}°</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      Chu kì T: <strong className="text-sky-400 font-mono">{theoreticalPeriodT.toFixed(2)} s</strong>
                    </span>
                    <span>|</span>
                    <span>
                      v_max (VTCB): <strong className="text-emerald-400 font-mono">{theoreticalVMax.toFixed(2)} m/s</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE ENERGY BAR CHARTS (Biểu đồ cột Chuyển hóa Động năng - Thế năng) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Biểu đồ Cột Chuyển hóa Năng lượng Thời gian thực (Joule)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  W = W_đ + W_t {mode === "ideal" ? "= HẰNG SỐ (Bảo toàn)" : ""}
                </span>
              </div>

              {/* Energy Bars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* 1. Kinetic Energy Wd */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      Động năng (W_đ):
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {showEnergyValues.kineticEnergy
                        ? `${currentKineticEnergyJ.toFixed(3)} J`
                        : "??? J"}
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-75"
                      style={{
                        width: `${Math.min(
                          100,
                          initialMechanicalEnergyJ > 0
                            ? (currentKineticEnergyJ / initialMechanicalEnergyJ) * 100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    W_đ = 1/2 · m · v² (Max tại VTCB, = 0 tại Biên)
                  </span>
                </div>

                {/* 2. Potential Energy Wt */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      Thế năng (W_t):
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      {showEnergyValues.potentialEnergy
                        ? `${currentPotentialEnergyJ.toFixed(3)} J`
                        : "??? J"}
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-75"
                      style={{
                        width: `${Math.min(
                          100,
                          initialMechanicalEnergyJ > 0
                            ? (currentPotentialEnergyJ / initialMechanicalEnergyJ) * 100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    W_t = m · g · h (Max tại Biên, = 0 tại VTCB)
                  </span>
                </div>

                {/* 3. Total Mechanical Energy W */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-300 font-semibold flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                      Cơ năng tổng (W):
                    </span>
                    <span className="font-mono font-bold text-indigo-400">
                      {showEnergyValues.totalMechanicalEnergy
                        ? `${currentTotalEnergyJ.toFixed(3)} J`
                        : "??? J"}
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full transition-all duration-75"
                      style={{
                        width: `${Math.min(
                          100,
                          initialMechanicalEnergyJ > 0
                            ? (currentTotalEnergyJ / initialMechanicalEnergyJ) * 100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {mode === "ideal"
                      ? "Bảo toàn tuyệt đối (W = const)"
                      : mode === "damped"
                      ? "Tiêu tán do ma sát khí (W giảm dần)"
                      : "Ổn định nhờ cơ cấu hồi năng lượng"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Parameters & Pedagogical Task Panel (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* 1. Parameter Adjustments */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3.5 shadow-md">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Thông số Thí nghiệm Con lắc
              </span>

              {/* Slider 1: Length L */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Chiều dài dây <strong>L</strong>:</span>
                  <span className="font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                    {lengthL.toFixed(2)} m
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={lengthL}
                  onChange={(e) => {
                    setLengthL(parseFloat(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.5 m (Nhanh)</span>
                  <span>1.0 m (Chuẩn T≈2s)</span>
                  <span>1.5 m (Chậm)</span>
                </div>
              </div>

              {/* Slider 2: Mass m */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Khối lượng quả nặng <strong>m</strong>:</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                    {massM.toFixed(2)} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={massM}
                  onChange={(e) => setMassM(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.1 kg</span>
                  <span>0.5 kg</span>
                  <span>2.0 kg</span>
                </div>
              </div>

              {/* Slider 3: Initial Angle alpha0 */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Góc thả ban đầu <strong>α₀</strong>:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                    {initialAngleDeg}°
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={initialAngleDeg}
                  onChange={(e) => {
                    const newDeg = parseInt(e.target.value);
                    setInitialAngleDeg(newDeg);
                    setAngleThetaRad((newDeg * Math.PI) / 180);
                    setAngularVelocity(0);
                    setIsRunning(false);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>10°</span>
                  <span>30°</span>
                  <span>45°</span>
                  <span>60°</span>
                </div>
              </div>

              {/* Damping slider if mode is damped */}
              {mode === "damped" && (
                <div className="flex flex-col gap-1 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-rose-300">Hệ số cản không khí:</span>
                    <span className="font-mono font-bold text-rose-400">
                      {dampingCoeff.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.25"
                    step="0.01"
                    value={dampingCoeff}
                    onChange={(e) => setDampingCoeff(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* 2. CÔNG TẮC ẨN / HIỆN SỐ LIỆU SƯ PHẠM (CV 5512) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    Công tắc Số liệu Sư phạm
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Bật công tắc để hiện số; Tắt để học sinh tự tính
                  </p>
                </div>
                <button
                  onClick={toggleAllValues}
                  className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold transition"
                >
                  {isAllValuesVisible ? "Ẩn hết" : "Hiện hết"}
                </button>
              </div>

              {/* Toggle rows */}
              <div className="flex flex-col gap-2">
                {/* Vận tốc v */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-300 font-medium">Vận tốc tức thời (v):</span>
                    <span className="block text-[10px] text-slate-500">v = √(2·g·(h₀ - h))</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">
                      {showEnergyValues.velocity ? `${currentVelocityMPerS.toFixed(2)} m/s` : "??? m/s"}
                    </span>
                    <button
                      onClick={() =>
                        setShowEnergyValues((v) => ({ ...v, velocity: !v.velocity }))
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {showEnergyValues.velocity ? (
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Thế năng Wt */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-300 font-medium">Thế năng trọng trường:</span>
                    <span className="block text-[10px] text-slate-500">W_t = m · g · h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">
                      {showEnergyValues.potentialEnergy
                        ? `${currentPotentialEnergyJ.toFixed(3)} J`
                        : "??? J"}
                    </span>
                    <button
                      onClick={() =>
                        setShowEnergyValues((v) => ({ ...v, potentialEnergy: !v.potentialEnergy }))
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {showEnergyValues.potentialEnergy ? (
                        <ToggleRight className="w-5 h-5 text-amber-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Động năng Wd */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-300 font-medium">Động năng:</span>
                    <span className="block text-[10px] text-slate-500">W_đ = 1/2 · m · v²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">
                      {showEnergyValues.kineticEnergy
                        ? `${currentKineticEnergyJ.toFixed(3)} J`
                        : "??? J"}
                    </span>
                    <button
                      onClick={() =>
                        setShowEnergyValues((v) => ({ ...v, kineticEnergy: !v.kineticEnergy }))
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {showEnergyValues.kineticEnergy ? (
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Cơ năng tổng W */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-300 font-medium">Tổng cơ năng:</span>
                    <span className="block text-[10px] text-slate-500">W = W_đ + W_t</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-400">
                      {showEnergyValues.totalMechanicalEnergy
                        ? `${currentTotalEnergyJ.toFixed(3)} J`
                        : "??? J"}
                    </span>
                    <button
                      onClick={() =>
                        setShowEnergyValues((v) => ({
                          ...v,
                          totalMechanicalEnergy: !v.totalMechanicalEnergy,
                        }))
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {showEnergyValues.totalMechanicalEnergy ? (
                        <ToggleRight className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Ô HỌC SINH TỰ TÍNH TOÁN & THỬ THÁCH NHANH */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-900/50 rounded-2xl p-4 flex flex-col gap-2.5 shadow-md">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Thử thách Tự tính toán của Học sinh
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Tại vị trí hiện tại (m = {massM} kg, h = {currentHeightM.toFixed(3)} m): Hãy chọn đại lượng và nhập kết quả tính được để tự kiểm tra:
              </p>

              <div className="flex items-center gap-1.5">
                <select
                  value={studentInput.target}
                  onChange={(e) =>
                    setStudentInput((prev) => ({
                      ...prev,
                      target: e.target.value as any,
                    }))
                  }
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-amber-300 focus:outline-none"
                >
                  <option value="Wt">Thế năng W_t (J)</option>
                  <option value="Wd">Động năng W_đ (J)</option>
                  <option value="W">Cơ năng W (J)</option>
                  <option value="v">Vận tốc v (m/s)</option>
                </select>

                <input
                  type="text"
                  placeholder="Nhập số (J / m/s)..."
                  value={studentInput.value}
                  onChange={(e) => {
                    setStudentInput((prev) => ({ ...prev, value: e.target.value }));
                    if (studentFeedback.status !== "idle") {
                      setStudentFeedback({ status: "idle", message: "" });
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
                />

                <button
                  onClick={handleCheckStudentCalculation}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition shadow-sm"
                >
                  Kiểm tra
                </button>
              </div>

              {/* Feedback alert */}
              {studentFeedback.status !== "idle" && (
                <div
                  className={`p-2.5 rounded-xl text-[11px] leading-relaxed border ${
                    studentFeedback.status === "correct"
                      ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-950/70 border-rose-500/40 text-rose-200"
                  }`}
                >
                  {studentFeedback.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: CƠ CHẾ BÁNH RĂNG THOÁT ĐỒNG HỒ (ESCAPEMENT) ======================= */}
      {activeTab === "escapement_demo" && (
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Bí ẩn Kĩ thuật: Cơ chế Bánh răng thoát (Escapement) trong Đồng hồ quả lắc
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Khám phá cách các nhà bác học thế kỉ 17 (Galileo, Huygens) giải bài toán: Làm thế nào để con lắc dao động mãi mãi mà chu kì không bị sai lệch dù có lực cản không khí?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Diagram of Escapement */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px]">
              <svg viewBox="0 0 320 260" className="w-full max-w-[280px]">
                {/* Escapement wheel (Bánh răng thoát có răng cưa đặc trưng) */}
                <g transform="translate(160, 150)">
                  <circle cx="0" cy="0" r="55" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
                  {/* Teeth */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const rot = i * 30;
                    return (
                      <path
                        key={i}
                        d="M 0 -55 L 8 -65 L -4 -58 z"
                        fill="#fbbf24"
                        transform={`rotate(${rot})`}
                      />
                    );
                  })}
                  <circle cx="0" cy="0" r="10" fill="#78350f" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                    Trục cót
                  </text>
                </g>

                {/* Anchor / Pallet (Mỏ neo giữ và nhả răng) */}
                <g transform="translate(160, 80)">
                  {/* Anchor arm tilted slightly */}
                  <path
                    d="M -45 15 C -20 -10, 20 -10, 45 15 L 38 25 C 18 5, -18 5, -38 25 z"
                    fill="#475569"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                  />
                  {/* Left pallet tooth */}
                  <polygon points="-45,15 -52,28 -38,25" fill="#dc2626" />
                  {/* Right pallet tooth */}
                  <polygon points="45,15 52,28 38,25" fill="#16a34a" />

                  {/* Connecting rod up to pendulum */}
                  <line x1="0" y1="0" x2="0" y2="-45" stroke="#94a3b8" strokeWidth="3" />
                  <circle cx="0" cy="0" r="4" fill="#facc15" />
                  <text x="0" y="-50" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Nối cần con lắc
                  </text>
                </g>

                {/* Falling Weight Supply (Quả tạ treo kéo dây) */}
                <g transform="translate(60, 160)">
                  <line x1="40" y1="-10" x2="40" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="25" y="35" width="30" height="40" rx="4" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
                  <text x="40" y="58" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Quả tạ
                  </text>
                  <text x="40" y="86" fill="#fde047" fontSize="8" textAnchor="middle">
                    Cấp ΔW
                  </text>
                </g>
              </svg>
              <span className="text-[11px] text-slate-400 text-center mt-2">
                Mô hình Bánh răng thoát (Escapement) & Mỏ neo trong đồng hồ cơ khí
              </span>
            </div>

            {/* Detailed Explanation */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-xs text-slate-300 space-y-3">
              <div>
                <h4 className="font-bold text-amber-300 text-sm">
                  3 Nguyên tắc Vật lí của Con lắc Đồng hồ:
                </h4>
                <div className="mt-2 space-y-2 text-[11px] leading-relaxed">
                  <p>
                    • <strong>1. Tính đẳng thời của dao động nhỏ:</strong> Galileo phát hiện rằng với các góc lệch nhỏ (&alpha; &lt; 10&deg;), chu kì T = 2&pi;&radic;(L/g) hoàn toàn không phụ thuộc vào biên độ. Do đó, con lắc là 'bộ đếm nhịp' thời gian lí tưởng nhất.
                  </p>
                  <p>
                    • <strong>2. Định luật bảo toàn &amp; hao phí năng lượng:</strong> Mỗi chu kì dao động, ma sát không khí làm mất mát một lượng cơ năng &Delta;W_hao_phí = |A_cản|. Nếu không bù đắp, con lắc sẽ dừng sau vài phút.
                  </p>
                  <p>
                    • <strong>3. Cơ cấu hồi năng lượng thông minh:</strong> Quả tạ treo (hoặc dây cót) nặng dần hạ xuống, thế năng của quả tạ truyền qua bánh răng thoát. Cứ mỗi nhịp con lắc đi qua vị trí cân bằng, mỏ neo nhả 1 răng và truyền một cú hích nhẹ đúng bằng lượng &Delta;W_hao_phí! Nhờ đó, cơ năng luôn được duy trì và đồng hồ chạy chuẩn xác hàng thế kỉ!
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] text-amber-300">
                <strong>Vận dụng thực tế:</strong> Đồng hồ quả lắc Big Ben tại thủ đô London (Anh) sử dụng quả lắc dài 4m, nặng 300kg, dao động với chu kì đúng 2 giây để giữ giờ cho toàn thành phố!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 3: BẢNG SỐ LIỆU ĐO THỰC NGHIỆM ======================= */}
      {activeTab === "data_table" && (
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Table className="w-4 h-4 text-amber-400" />
                Bảng Thu thập Số liệu Thực nghiệm ảo: Kiểm chứng W_đ + W_t = const
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ghi nhận các điểm đo $(t, \alpha, h, v, W_đ, W_t, W)$ tại các vị trí biên và vị trí cân bằng
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={recordedData.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" /> Xuất File CSV
              </button>
              <button
                onClick={() => setRecordedData([])}
                disabled={recordedData.length === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition disabled:opacity-40"
              >
                Xóa bảng
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Lần đo</th>
                  <th className="py-2.5 px-3">Thời gian t (s)</th>
                  <th className="py-2.5 px-3">Góc α (°)</th>
                  <th className="py-2.5 px-3 text-amber-300">Độ cao h (m)</th>
                  <th className="py-2.5 px-3 text-emerald-300">Vận tốc v (m/s)</th>
                  <th className="py-2.5 px-3 text-emerald-400 font-bold">W_đ (J)</th>
                  <th className="py-2.5 px-3 text-amber-400 font-bold">W_t (J)</th>
                  <th className="py-2.5 px-3 text-indigo-400 font-bold">Cơ năng W (J)</th>
                  <th className="py-2.5 px-3">Nhận xét vị trí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {recordedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500 font-sans">
                      Chưa có điểm đo nào. Hãy sang Tab "Thí nghiệm Con lắc", bấm <strong>"Thả dao động"</strong> và bấm <strong>"Ghi số liệu"</strong> tại các vị trí khác nhau.
                    </td>
                  </tr>
                ) : (
                  recordedData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2 px-3 font-sans font-medium text-white">{row.trialName}</td>
                      <td className="py-2 px-3">{row.timeSec}</td>
                      <td className="py-2 px-3 text-amber-300">{row.angleDeg}°</td>
                      <td className="py-2 px-3 text-amber-400">{row.heightMeter}</td>
                      <td className="py-2 px-3 text-emerald-300">{row.velocityMPerS}</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">{row.kineticEnergyJ}</td>
                      <td className="py-2 px-3 text-amber-400 font-bold">{row.potentialEnergyJ}</td>
                      <td className="py-2 px-3 text-indigo-300 font-bold">{row.totalMechanicalEnergyJ}</td>
                      <td className="py-2 px-3 font-sans text-[11px] text-slate-400">{row.note}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= TAB 4: PHIẾU HỌC TẬP CV 5512 ======================= */}
      {activeTab === "worksheets" && (
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Hệ thống Phiếu Học Tập Khám phá & Phát triển Năng lực (Công văn 5512)
            </span>
            <p className="text-xs text-slate-400 mt-1">
              Bài 26: Cơ năng và định luật bảo toàn cơ năng (Vật lí 10) - Định hướng phát hiện và giải quyết vấn đề
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PHT 1 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Phiếu Học Tập Số 1
                </span>
                <h4 className="text-xs font-bold text-white mt-2">
                  Khảo sát Sự chuyển hóa Động năng & Thế năng
                </h4>
                <div className="text-[11px] text-slate-300 mt-2 space-y-1.5">
                  <p>• <strong>Nhiệm vụ 1:</strong> Thả con lắc từ góc α₀ = 45°. Quan sát độ cao h và vận tốc v khi con lắc đi từ biên về VTCB. Nhận xét chiều biến thiên của W_đ và W_t?</p>
                  <p>• <strong>Nhiệm vụ 2:</strong> Tại vị trí cân bằng, thế năng bằng bao nhiêu và động năng đạt giá trị thế nào?</p>
                  <p>• <strong>Nhiệm vụ 3:</strong> Tại vị trí biên, vận tốc bằng bao nhiêu và thế năng đạt giá trị thế nào?</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-emerald-400 font-medium">
                ✓ Phát triển năng lực quan sát hiện tượng và mô tả định tính quy luật chuyển hóa.
              </div>
            </div>

            {/* PHT 2 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Phiếu Học Tập Số 2
                </span>
                <h4 className="text-xs font-bold text-white mt-2">
                  Nghiệm lại Định luật Bảo toàn Cơ năng W_đ + W_t = const
                </h4>
                <div className="text-[11px] text-slate-300 mt-2 space-y-1.5">
                  <p>• <strong>Nhiệm vụ 1:</strong> Bật chế độ "Lí tưởng" (không ma sát). Chọn 3 thời điểm bất kì: Vị trí biên A, vị trí cân bằng O, và vị trí trung gian M. Ghi số liệu W_đ, W_t vào bảng.</p>
                  <p>• <strong>Nhiệm vụ 2:</strong> Tính tổng cơ năng W tại cả 3 vị trí. So sánh và rút ra kết luận định lượng?</p>
                  <p>• <strong>Nhiệm vụ 3:</strong> Viết phương trình bảo toàn cơ năng của con lắc đơn: W_A = W_O &hArr; m&middot;g&middot;h₀ = 1/2&middot;m&middot;v_max&sup2;.</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-emerald-400 font-medium">
                ✓ Phát triển năng lực thu thập số liệu và kiểm chứng quy luật khoa học bằng thực nghiệm.
              </div>
            </div>

            {/* PHT 3 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                  Phiếu Học Tập Số 3
                </span>
                <h4 className="text-xs font-bold text-white mt-2">
                  Vận dụng: Giải thích Cơ chế Con lắc Đồng hồ
                </h4>
                <div className="text-[11px] text-slate-300 mt-2 space-y-1.5">
                  <p>• <strong>Nhiệm vụ 1:</strong> Chuyển sang chế độ "Tắt dần (Có ma sát)". Quan sát cột cơ năng W và giải thích vì sao cơ năng không còn bảo toàn?</p>
                  <p>• <strong>Nhiệm vụ 2:</strong> Chuyển sang chế độ "Con lắc đồng hồ". Quan sát mỏ neo và bánh răng thoát: Cơ cấu này làm nhiệm vụ gì để đồng hồ duy trì chạy ổn định?</p>
                  <p>• <strong>Vận dụng:</strong> Nếu người dùng quên lên dây cót hoặc quả tạ chạm đáy đất thì đồng hồ sẽ ra sao?</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-indigo-400 font-medium">
                ✓ Phát triển năng lực vận dụng kiến thức vật lí giải thích thiết bị đời sống.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 5: ĐÁNH GIÁ NĂNG LỰC & LUYỆN TẬP ======================= */}
      {activeTab === "quiz" && (
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Câu hỏi Trắc nghiệm Đánh giá Năng lực Nhận thức & Vận dụng Cơ năng
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Kiểm tra mức độ nắm vững bản chất bảo toàn cơ năng và ứng dụng thực tiễn
              </p>
            </div>
            <button
              onClick={() => setShowQuizResults(!showQuizResults)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              {showQuizResults ? "Làm lại bài" : "Nộp bài & Xem giải thích"}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {quizQuestions.map((q, qIndex) => {
              const selectedOpt = selectedAnswers[q.id];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5"
                >
                  <span className="text-xs font-bold text-slate-200">
                    Câu {qIndex + 1}: {q.question}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedOpt === optIndex;
                      let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800";

                      if (showQuizResults) {
                        if (optIndex === q.correctIndex) {
                          btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold";
                        } else if (isSelected && !isCorrect) {
                          btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200";
                        }
                      } else if (isSelected) {
                        btnStyle = "bg-amber-950/80 border-amber-500 text-amber-200 font-semibold";
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => {
                            if (!showQuizResults) {
                              setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIndex }));
                            }
                          }}
                          className={`text-left text-xs p-2.5 rounded-lg border transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div
                      className={`p-2.5 rounded-lg text-[11px] leading-relaxed border mt-1 ${
                        isCorrect
                          ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                          : "bg-amber-950/40 border-amber-500/30 text-amber-300"
                      }`}
                    >
                      <strong>Giải thích chi tiết:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

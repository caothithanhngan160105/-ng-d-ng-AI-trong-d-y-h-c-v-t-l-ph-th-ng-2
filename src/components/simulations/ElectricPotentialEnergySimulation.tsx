import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Info,
  Activity,
  Sliders,
  Clock,
  HelpCircle,
  Table,
  CheckCircle2,
  ChevronRight,
  Volume2,
  VolumeX,
  Repeat,
  ArrowRight,
  MoveVertical,
  MoveHorizontal,
  Compass,
  CornerDownRight,
  Sparkles,
  Layers,
  Settings2,
  MousePointer,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { MathText } from "../MathText";

export type OrientationMode = "vertical" | "horizontal";
export type PathPreset =
  | "straight_along"
  | "straight_opposite"
  | "inclined"
  | "perpendicular"
  | "broken"
  | "curve"
  | "custom";

interface DataRecord {
  id: number;
  step: string;
  orientation: string;
  q_microC: number;
  E_V_per_m: number;
  s_cm: number;
  alpha_deg: number;
  d_cm: number;
  dM_cm: number;
  dN_cm: number;
  WM_mJ: number;
  WN_mJ: number;
  deltaWt_mJ: number;
  A_mJ: number;
  note: string;
}

export const ElectricPotentialEnergySimulation: React.FC = () => {
  // ================= 1. BỐ TRÍ HÌNH HỌC HAI BẢN CỰC =================
  // "vertical": Bản (+) ở trên, Bản (-) ở dưới, đường sức hướng xuống
  // "horizontal": Bản (+) ở trái, Bản (-) ở phải, đường sức hướng sang phải
  const [orientation, setOrientation] = useState<OrientationMode>("vertical");

  // ================= 2. THÔNG SỐ ĐIỆN LƯỢNG q =================
  // Điện lượng thử q (μC): có thể thay đổi cả độ lớn và dấu âm/dương
  // Cho phép điều chỉnh từ -10 μC đến +10 μC
  const [qMicroC, setQMicroC] = useState<number>(2);

  // ================= 3. THÔNG SỐ CƯỜNG ĐỘ ĐIỆN TRƯỜNG E =================
  // Cường độ điện trường đều E (V/m): từ 500 V/m đến 10 000 V/m (mặc định 2500 V/m)
  const [electricFieldE, setElectricFieldE] = useState<number>(2500);

  // Khoảng cách giữa hai bản d0 = 10 cm = 0.10 m (chuẩn SGK)
  const plateDistanceM = 0.1; // 10 cm

  // Hiệu điện thế giữa hai bản U = E * d0 (V)
  const voltageU = Math.round(electricFieldE * plateDistanceM);

  // ================= 4. QUÃNG ĐƯỜNG DỊCH CHUYỂN (s, alpha, d, M, N) =================
  // Dạng đường đi được chọn (mặc định: Quỹ đạo chéo MN để đối chiếu với MPN)
  const [pathPreset, setPathPreset] = useState<PathPreset>("inclined");

  // Độ dài quãng đường dịch chuyển s (cm): từ 1.0 đến 8.0 cm
  const [displacementDistanceCm, setDisplacementDistanceCm] = useState<number>(7.0);

  // Góc nghiêng alpha hợp với vectơ E: từ 0° đến 180°
  const [inclinedAngleDeg, setInclinedAngleDeg] = useState<number>(45);

  // Tọa độ vị trí điểm đầu M: tính từ bản dương (m)
  // primaryM (từ 0.01 đến 0.09 m), crossM (-0.05 đến +0.05 m)
  const [customStartM, setCustomStartM] = useState<{ primaryM: number; crossM: number }>({
    primaryM: 0.015,
    crossM: -0.035,
  });

  // Tọa độ tùy chỉnh điểm cuối N (m)
  const [customEndN, setCustomEndN] = useState<{ primaryN: number; crossN: number }>({
    primaryN: 0.065,
    crossN: 0.035,
  });

  // ================= 5. ĐIỀU KHIỂN CHUYỂN ĐỘNG & QUAN SÁT TỪ TỪ =================
  // Tốc độ chậm rãi (0.1x ~ 0.2x siêu chậm để quan sát trên lớp)
  const [speedScale, setSpeedScale] = useState<number>(0.2);
  const [autoLoop, setAutoLoop] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 0 -> 1
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Tương tác kéo thả chuột
  const [activeDragTarget, setActiveDragTarget] = useState<"charge" | "pointM" | "pointN" | null>(null);
  const [dragChargePos, setDragChargePos] = useState<{ primary: number; cross: number } | null>(null);

  // ================= 6. GIAO DIỆN & ĐỒ THỊ/BẢNG =================
  const [activeTab, setActiveTab] = useState<"sim" | "table" | "quiz">("sim");
  const [showVectors, setShowVectors] = useState({
    fieldLines: true,
    equipotential: true,
    forceVector: true,
    displacementVector: true,
    projectionLines: true,
    trajectoryLine: true,
    rulerGuides: true,
  });

  // Bảng ghi nhận kết quả đo thực nghiệm
  const [recordedData, setRecordedData] = useState<DataRecord[]>([]);

  // ================= 7. CÔNG TẮC ẨN / HIỆN SỐ LIỆU NĂNG LƯỢNG =================
  // Theo yêu cầu sư phạm: mặc định các số liệu về Công (A), Thế năng (W_t),
  // Độ giảm thế năng (ΔW_t), và Độ giảm thế (U) có thể ẩn đi để học sinh tự tính trước,
  // khi bật công tắc nào thì số liệu tương ứng mới hiện ra.
  const [showEnergyValues, setShowEnergyValues] = useState<{
    work: boolean;
    potentialEnergy: boolean;
    deltaWt: boolean;
    voltageDrop: boolean;
  }>({
    work: false,
    potentialEnergy: false,
    deltaWt: false,
    voltageDrop: false,
  });

  const isAllEnergyValuesVisible =
    showEnergyValues.work &&
    showEnergyValues.potentialEnergy &&
    showEnergyValues.deltaWt &&
    showEnergyValues.voltageDrop;

  const toggleAllEnergyValues = () => {
    const nextState = !isAllEnergyValuesVisible;
    setShowEnergyValues({
      work: nextState,
      potentialEnergy: nextState,
      deltaWt: nextState,
      voltageDrop: nextState,
    });
  };

  const toggleEnergyValue = (key: keyof typeof showEnergyValues) => {
    setShowEnergyValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Âm thanh
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const animRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Sound chime helper
  const playChime = (freq: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio fallback
    }
  };

  // ================= 7. TÍNH TOÁN VẬT LÍ (PHYSICS CORE) =================
  // Đổi đơn vị điện tích sang Coulomb
  const qCoulomb = qMicroC * 1e-6; // C
  const E = electricFieldE; // V/m
  const F_Newton = qCoulomb * E; // N (có dấu theo hướng của E)
  const absF_Newton = Math.abs(F_Newton);

  // Tọa độ điểm đầu M theo thiết lập preset hoặc custom (giữ cố định cùng M cho cả quỹ đạo chéo và gấp khúc)
  const effectiveM = useMemo<{ primaryM: number; crossM: number }>(() => {
    switch (pathPreset) {
      case "straight_along":
        return { primaryM: 0.015, crossM: 0 };
      case "straight_opposite":
        return { primaryM: 0.015 + (displacementDistanceCm / 100), crossM: 0 };
      case "inclined":
      case "broken":
      case "custom":
        return customStartM;
      case "perpendicular":
        return { primaryM: 0.05, crossM: -(displacementDistanceCm / 200) };
      case "curve":
        return { primaryM: 0.015, crossM: 0 };
      default:
        return customStartM;
    }
  }, [pathPreset, displacementDistanceCm, customStartM]);

  // Tọa độ điểm cuối N theo thiết lập (giữ cố định cùng N cho cả quỹ đạo chéo và gấp khúc)
  const effectiveN = useMemo<{ primaryN: number; crossN: number }>(() => {
    const sMeters = displacementDistanceCm / 100;

    switch (pathPreset) {
      case "straight_along": {
        const primN = Math.min(0.095, effectiveM.primaryM + sMeters);
        return { primaryN: primN, crossN: effectiveM.crossM };
      }
      case "straight_opposite": {
        const primN = Math.max(0.005, effectiveM.primaryM - sMeters);
        return { primaryN: primN, crossN: effectiveM.crossM };
      }
      case "inclined":
      case "broken":
      case "custom":
        return customEndN;
      case "perpendicular": {
        return { primaryN: effectiveM.primaryM, crossN: effectiveM.crossM + sMeters };
      }
      case "curve": {
        const primN = Math.min(0.095, effectiveM.primaryM + sMeters);
        return { primaryN: primN, crossN: effectiveM.crossM };
      }
      default:
        return customEndN;
    }
  }, [pathPreset, displacementDistanceCm, effectiveM, customEndN]);

  // Vị trí hiện tại của điện tích q trong quá trình dịch chuyển từ từ
  const currentPos = useMemo<{ primary: number; cross: number }>(() => {
    if (activeDragTarget === "charge" && dragChargePos) {
      return dragChargePos;
    }

    const t = Math.max(0, Math.min(1, progress));

    switch (pathPreset) {
      case "straight_along":
      case "straight_opposite":
      case "inclined":
      case "perpendicular":
      case "custom": {
        return {
          primary: effectiveM.primaryM + (effectiveN.primaryN - effectiveM.primaryM) * t,
          cross: effectiveM.crossM + (effectiveN.crossN - effectiveM.crossM) * t,
        };
      }
      case "broken": {
        // Quỹ đạo gấp khúc M -> P -> N chuẩn SGK Vật lí 11 Bài 19 (Hình thực nghiệm)
        // Đoạn 1 (0 -> 0.5): Từ M đi song song với đường sức E đến điểm P (P cùng đường sức với M, cùng mặt đẳng thế với N)
        // Đoạn 2 (0.5 -> 1.0): Từ P đi vuông góc với đường sức E đến điểm N (N có tọa độ primaryN, crossN)
        if (t <= 0.5) {
          const localT = t / 0.5;
          return {
            primary: effectiveM.primaryM + (effectiveN.primaryN - effectiveM.primaryM) * localT,
            cross: effectiveM.crossM,
          };
        } else {
          const localT = (t - 0.5) / 0.5;
          return {
            primary: effectiveN.primaryN,
            cross: effectiveM.crossM + (effectiveN.crossN - effectiveM.crossM) * localT,
          };
        }
      }
      case "curve": {
        const curPrimary = effectiveM.primaryM + (effectiveN.primaryN - effectiveM.primaryM) * t;
        const wave = Math.sin(t * Math.PI * 2) * 0.035;
        return { primary: curPrimary, cross: effectiveM.crossM + wave };
      }
      default:
        return {
          primary: effectiveM.primaryM + (effectiveN.primaryN - effectiveM.primaryM) * t,
          cross: effectiveM.crossM + (effectiveN.crossN - effectiveM.crossM) * t,
        };
    }
  }, [progress, activeDragTarget, dragChargePos, pathPreset, effectiveM, effectiveN]);

  // ================= 8. CÁC ĐẠI LƯỢNG VẬT LÍ TỨC THỜI =================
  // Khoảng cách từ vị trí hiện tại đến bản âm (m) -> mốc thế năng tại bản âm
  const distFromNegPlate_m = Math.max(0, plateDistanceM - currentPos.primary);
  const currentV_volts = E * distFromNegPlate_m;

  // Thế năng điện tại vị trí hiện tại W_t = q * V = q * E * d_bản_âm
  const currentWt_Joules = qCoulomb * currentV_volts;
  const currentWt_mJ = currentWt_Joules * 1000;

  // Thế năng tại điểm đầu M: W_tM = q * E * d_M
  const dM_fromNegPlate_m = Math.max(0, plateDistanceM - effectiveM.primaryM);
  const VM_volts = E * dM_fromNegPlate_m;
  const WtM_Joules = qCoulomb * VM_volts;
  const WtM_mJ = WtM_Joules * 1000;

  // Thế năng tại điểm cuối N: W_tN = q * E * d_N
  const dN_fromNegPlate_m = Math.max(0, plateDistanceM - effectiveN.primaryN);
  const VN_volts = E * dN_fromNegPlate_m;
  const WtN_Joules = qCoulomb * VN_volts;
  const WtN_mJ = WtN_Joules * 1000;

  // Toàn bộ hình chiếu từ M đến N: d_MN (m & cm)
  const total_d_MN_m = effectiveN.primaryN - effectiveM.primaryM;
  const total_d_MN_cm = total_d_MN_m * 100;

  // Quãng đường toàn phần từ M đến N theo từng dạng quỹ đạo
  const total_s_MN_m =
    pathPreset === "broken"
      ? Math.abs(effectiveN.primaryN - effectiveM.primaryM) +
        Math.abs(effectiveN.crossN - effectiveM.crossM)
      : Math.sqrt(
          Math.pow(effectiveN.primaryN - effectiveM.primaryM, 2) +
            Math.pow(effectiveN.crossN - effectiveM.crossM, 2)
        );
  const total_s_MN_cm = total_s_MN_m * 100;

  // Quãng đường thực tế đã dịch chuyển từ M tới vị trí hiện tại s_current (m)
  let sCurrent_m = 0;
  let currentAlphaDeg = 0;

  if (pathPreset === "broken") {
    const t = Math.max(0, Math.min(1, progress));
    if (t <= 0.5) {
      sCurrent_m = Math.abs(currentPos.primary - effectiveM.primaryM);
      currentAlphaDeg = total_d_MN_m >= 0 ? 0 : 180;
    } else {
      sCurrent_m =
        Math.abs(effectiveN.primaryN - effectiveM.primaryM) +
        Math.abs(currentPos.cross - effectiveM.crossM);
      currentAlphaDeg = 90; // Đoạn P -> N vuông góc đường sức E!
    }
  } else {
    const deltaPrimary_m = currentPos.primary - effectiveM.primaryM;
    const deltaCross_m = currentPos.cross - effectiveM.crossM;
    sCurrent_m = Math.sqrt(deltaPrimary_m * deltaPrimary_m + deltaCross_m * deltaCross_m);

    if (sCurrent_m > 0.0001) {
      const cosVal = Math.max(-1, Math.min(1, deltaPrimary_m / sCurrent_m));
      currentAlphaDeg = Math.round((Math.acos(cosVal) * 180) / Math.PI);
    } else if (total_s_MN_m > 0.0001) {
      const cosVal = Math.max(-1, Math.min(1, total_d_MN_m / total_s_MN_m));
      currentAlphaDeg = Math.round((Math.acos(cosVal) * 180) / Math.PI);
    }
  }
  const sCurrent_cm = sCurrent_m * 100;

  // Hình chiếu của độ dời lên phương đường sức: d = primary_current - primary_M
  const dCurrent_m = currentPos.primary - effectiveM.primaryM;
  const dCurrent_cm = dCurrent_m * 100;

  // Công của lực điện trường đã sinh ra từ M đến vị trí hiện tại: A = q * E * d
  const workA_Joules = qCoulomb * E * dCurrent_m;
  const workA_mJ = workA_Joules * 1000;

  // Toàn bộ công từ M đến N: A_MN = q * E * d_MN
  const totalWorkA_MN_Joules = qCoulomb * E * total_d_MN_m;
  const totalWorkA_MN_mJ = totalWorkA_MN_Joules * 1000;

  // Độ giảm thế năng: Delta W_t = W_tM - W_t_current
  const deltaWt_mJ = WtM_mJ - currentWt_mJ;

  // Độ giảm thế (Hiệu điện thế U = VM - V_current = E * d)
  const voltageDrop_volts = VM_volts - currentV_volts;
  const totalVoltageDrop_MN_volts = VM_volts - VN_volts;

  // Kiểm chứng định lí công - thế năng: A = W_tM - W_t
  const isTheoremSatisfied = Math.abs(workA_mJ - deltaWt_mJ) < 0.01;

  // ================= 9. HÌNH HỌC TỌA ĐỘ SVG (RENDER) =================
  const isVertical = orientation === "vertical";
  const canvasWidth = isVertical ? 600 : 660;
  const canvasHeight = isVertical ? 450 : 360;

  // Bản cực trong hệ tọa độ dọc:
  // Bản (+) ở trên y = 55, Bản (-) ở dưới y = 375. Khoảng cách = 320 px tương ứng 0.10 m (3200 px/m)
  const vTopY = 55;
  const vBottomY = 375;
  const vSpanY = vBottomY - vTopY; // 320 px
  const vLeftX = 70;
  const vRightX = 520;

  // Bản cực trong hệ tọa độ ngang:
  // Bản (+) ở trái x = 75, Bản (-) ở phải x = 575. Khoảng cách = 500 px tương ứng 0.10 m (5000 px/m)
  const hLeftX = 75;
  const hRightX = 575;
  const hSpanX = hRightX - hLeftX; // 500 px
  const hTopY = 40;
  const hBottomY = 300;

  const pxPerMeter = isVertical ? vSpanY / plateDistanceM : hSpanX / plateDistanceM;

  // Hàm chuyển đổi tọa độ chuẩn (primary: khoảng cách từ bản dương theo phương E, cross: độ dời vuông góc) sang pixel
  const getSvgCoordinates = (primaryM: number, crossM: number) => {
    if (isVertical) {
      const centerX = (vLeftX + vRightX) / 2;
      return {
        svgX: centerX + crossM * pxPerMeter,
        svgY: vTopY + primaryM * pxPerMeter,
      };
    } else {
      const centerY = (hTopY + hBottomY) / 2;
      return {
        svgX: hLeftX + primaryM * pxPerMeter,
        svgY: centerY + crossM * pxPerMeter,
      };
    }
  };

  const { svgX: pxCurrentX, svgY: pxCurrentY } = getSvgCoordinates(currentPos.primary, currentPos.cross);
  const { svgX: pxStartX, svgY: pxStartY } = getSvgCoordinates(effectiveM.primaryM, effectiveM.crossM);
  const { svgX: pxEndX, svgY: pxEndY } = getSvgCoordinates(effectiveN.primaryN, effectiveN.crossN);

  // Điểm hình chiếu H của điểm cuối N (hoặc điểm hiện tại) lên đường sức đi qua M
  const { svgX: pxProjH_X, svgY: pxProjH_Y } = isVertical
    ? { svgX: pxStartX, svgY: pxEndY }
    : { svgX: pxEndX, svgY: pxStartY };

  const { svgX: pxCurrentProj_X, svgY: pxCurrentProj_Y } = isVertical
    ? { svgX: pxStartX, svgY: pxCurrentY }
    : { svgX: pxCurrentX, svgY: pxStartY };

  // Điểm phụ P cho đường gấp khúc M -> P -> N chuẩn SGK (P cùng đường sức với M, cùng mặt đẳng thế với N)
  const { svgX: pxPointP_X, svgY: pxPointP_Y } = getSvgCoordinates(
    effectiveN.primaryN,
    effectiveM.crossM
  );

  // ================= 10. ANIMATION TỪ TỪ =================
  useEffect(() => {
    if (!isRunning) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();

    const animateLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      // Base: 4 giây cho toàn bộ quãng đường ở 1.0x.
      // Với 0.2x: 20 giây chuyển động từ từ, cực kì thư thả để giáo viên phát vấn!
      const baseDurationSec = 4.0;
      const effectiveDuration = baseDurationSec / speedScale;
      const dProgress = dt / effectiveDuration;

      setProgress((prev) => {
        const nextP = prev + dProgress;
        if (nextP >= 1) {
          if (autoLoop) {
            playChime(587.33);
            return 0; // Quay về điểm đầu chạy lại
          } else {
            setIsRunning(false);
            playChime(659.25);
            return 1;
          }
        }
        return nextP;
      });

      if (isRunning) {
        animRef.current = requestAnimationFrame(animateLoop);
      }
    };

    animRef.current = requestAnimationFrame(animateLoop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRunning, speedScale, autoLoop]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setProgress(0);
    setDragChargePos(null);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    playChime(440);
  };

  // Bước tiếp (+0.1 tiến độ ~ 0.5-0.8 cm)
  const handleStepForward = () => {
    setIsRunning(false);
    setProgress((prev) => Math.min(1, prev + 0.125));
    playChime(523.25);
  };

  // Bước lùi
  const handleStepBackward = () => {
    setIsRunning(false);
    setProgress((prev) => Math.max(0, prev - 0.125));
    playChime(392);
  };

  // Ghi số liệu vào bảng
  const handleRecordMeasurement = () => {
    const newRecord: DataRecord = {
      id: Date.now(),
      step: `Lần ${recordedData.length + 1} (${pathPreset === "custom" ? "Tùy biến" : pathPreset})`,
      orientation: isVertical ? "Bản Dọc (Trên - Dưới)" : "Bản Ngang (Trái - Phải)",
      q_microC: qMicroC,
      E_V_per_m: electricFieldE,
      s_cm: Number(sCurrent_cm.toFixed(2)),
      alpha_deg: currentAlphaDeg,
      d_cm: Number(dCurrent_cm.toFixed(2)),
      dM_cm: Number((dM_fromNegPlate_m * 100).toFixed(1)),
      dN_cm: Number((distFromNegPlate_m * 100).toFixed(1)),
      WM_mJ: Number(WtM_mJ.toFixed(3)),
      WN_mJ: Number(currentWt_mJ.toFixed(3)),
      deltaWt_mJ: Number(deltaWt_mJ.toFixed(3)),
      A_mJ: Number(workA_mJ.toFixed(3)),
      note:
        dCurrent_cm === 0
          ? "d = 0 ⇒ A = 0 (Dịch chuyển trên mặt đẳng thế)"
          : workA_mJ > 0
          ? "A > 0 (Lực điện sinh công phát động, thế năng giảm)"
          : "A < 0 (Lực điện sinh công cản, thế năng tăng)",
    };
    setRecordedData((prev) => [...prev, newRecord]);
    playChime(659.25);
  };

  // Thí nghiệm tự động kiểm chứng 1-chạm (Quick Experiments)
  const runQuickExperiment = (type: "vary_q" | "vary_E" | "vary_s" | "vary_d" | "path_independence") => {
    handleReset();
    if (type === "vary_d") {
      // Khảo sát sự phụ thuộc của Công A vào hình chiếu d (A = q·E·d, A tỉ lệ thuận với d)
      // Giữ q = +2 μC, E = 2500 V/m. Thay đổi d = 1, 2, 3, 4, 5, 6 cm, d = 0, d = -2 cm
      const dCases = [
        { d: 1.0, label: "d = +1.0 cm (Cùng chiều E)" },
        { d: 2.0, label: "d = +2.0 cm (Cùng chiều E)" },
        { d: 3.0, label: "d = +3.0 cm (Cùng chiều E)" },
        { d: 4.0, label: "d = +4.0 cm (Cùng chiều E)" },
        { d: 5.0, label: "d = +5.0 cm (Cùng chiều E)" },
        { d: 6.0, label: "d = +6.0 cm (Cùng chiều E)" },
        { d: 0.0, label: "d = 0.0 cm (α = 90°, vuông góc E)" },
        { d: -2.0, label: "d = -2.0 cm (α = 180°, ngược chiều E)" },
      ];
      const qC = 2 * 1e-6;
      const records: DataRecord[] = dCases.map((item, idx) => {
        const d_m = item.d / 100;
        const A = qC * 2500 * d_m * 1000; // mJ
        const ratio = item.d !== 0 ? (A / item.d).toFixed(3) : "q·E = 0.050";
        return {
          id: Date.now() + idx,
          step: `TN Khảo sát d: ${item.label}`,
          orientation: isVertical ? "Bản Dọc" : "Bản Ngang",
          q_microC: 2,
          E_V_per_m: 2500,
          s_cm: Math.abs(item.d),
          alpha_deg: item.d >= 0 ? 0 : 180,
          d_cm: item.d,
          dM_cm: 8.5,
          dN_cm: Number((8.5 - item.d).toFixed(1)),
          WM_mJ: Number((qC * 2500 * 0.085 * 1000).toFixed(3)),
          WN_mJ: Number((qC * 2500 * (0.085 - d_m) * 1000).toFixed(3)),
          deltaWt_mJ: Number(A.toFixed(3)),
          A_mJ: Number(A.toFixed(3)),
          note:
            item.d === 0
              ? "d = 0 ⇒ A = 0 (Không sinh công khi dịch chuyển vuông góc đường sức)"
              : `A / d = ${ratio} mJ/cm = const ⇒ A tỉ lệ thuận bậc nhất với hình chiếu d!`,
        };
      });
      setRecordedData((prev) => [...prev, ...records]);
      setActiveTab("table");
      playChime(659.25);
    } else if (type === "vary_q") {
      // Giữ E = 2500 V/m, s = 5 cm, alpha = 0. Khảo sát q = 1, 2, 4, -2 μC
      const testCases = [1, 2, 4, -2];
      const records: DataRecord[] = testCases.map((testQ, idx) => {
        const qC = testQ * 1e-6;
        const d_m = 0.05;
        const A = qC * 2500 * d_m * 1000;
        const WM = qC * 2500 * 0.085 * 1000;
        const WN = qC * 2500 * 0.035 * 1000;
        return {
          id: Date.now() + idx,
          step: `TN Khảo sát q: q = ${testQ > 0 ? "+" + testQ : testQ} μC`,
          orientation: isVertical ? "Bản Dọc" : "Bản Ngang",
          q_microC: testQ,
          E_V_per_m: 2500,
          s_cm: 5.0,
          alpha_deg: 0,
          d_cm: 5.0,
          dM_cm: 8.5,
          dN_cm: 3.5,
          WM_mJ: Number(WM.toFixed(3)),
          WN_mJ: Number(WN.toFixed(3)),
          deltaWt_mJ: Number((WM - WN).toFixed(3)),
          A_mJ: Number(A.toFixed(3)),
          note: `A tỉ lệ thuận với q (${testQ > 0 ? "công dương" : "công âm do q < 0"})`,
        };
      });
      setRecordedData((prev) => [...prev, ...records]);
      setActiveTab("table");
      playChime(587.33);
    } else if (type === "vary_E") {
      // Giữ q = +2 μC, s = 5 cm, alpha = 0. Khảo sát E = 1000, 2500, 5000, 8000 V/m
      const testFields = [1000, 2500, 5000, 8000];
      const records: DataRecord[] = testFields.map((testE, idx) => {
        const qC = 2 * 1e-6;
        const d_m = 0.05;
        const A = qC * testE * d_m * 1000;
        const WM = qC * testE * 0.085 * 1000;
        const WN = qC * testE * 0.035 * 1000;
        return {
          id: Date.now() + idx,
          step: `TN Khảo sát E: E = ${testE} V/m`,
          orientation: isVertical ? "Bản Dọc" : "Bản Ngang",
          q_microC: 2,
          E_V_per_m: testE,
          s_cm: 5.0,
          alpha_deg: 0,
          d_cm: 5.0,
          dM_cm: 8.5,
          dN_cm: 3.5,
          WM_mJ: Number(WM.toFixed(3)),
          WN_mJ: Number(WN.toFixed(3)),
          deltaWt_mJ: Number((WM - WN).toFixed(3)),
          A_mJ: Number(A.toFixed(3)),
          note: `A tỉ lệ thuận với cường độ E (khi E tăng gấp đôi, A tăng gấp đôi)`,
        };
      });
      setRecordedData((prev) => [...prev, ...records]);
      setActiveTab("table");
      playChime(587.33);
    } else if (type === "vary_s") {
      // Giữ q = +2 μC, E = 2500 V/m. Khảo sát các quãng đường s = 2, 4, 6 cm và góc alpha = 0, 60, 90 độ
      const cases = [
        { s: 2.0, alpha: 0, label: "s = 2 cm, α = 0° (d = 2 cm)" },
        { s: 4.0, alpha: 0, label: "s = 4 cm, α = 0° (d = 4 cm)" },
        { s: 6.0, alpha: 0, label: "s = 6 cm, α = 0° (d = 6 cm)" },
        { s: 6.0, alpha: 60, label: "s = 6 cm, α = 60° (d = 3 cm)" },
        { s: 6.0, alpha: 90, label: "s = 6 cm, α = 90° (d = 0 cm, A = 0)" },
      ];
      const records: DataRecord[] = cases.map((item, idx) => {
        const qC = 2 * 1e-6;
        const d_m = (item.s / 100) * Math.cos((item.alpha * Math.PI) / 180);
        const A = qC * 2500 * d_m * 1000;
        return {
          id: Date.now() + idx,
          step: `TN Khảo sát s & α: ${item.label}`,
          orientation: isVertical ? "Bản Dọc" : "Bản Ngang",
          q_microC: 2,
          E_V_per_m: 2500,
          s_cm: item.s,
          alpha_deg: item.alpha,
          d_cm: Number((d_m * 100).toFixed(2)),
          dM_cm: 8.5,
          dN_cm: Number((8.5 - d_m * 100).toFixed(1)),
          WM_mJ: Number((qC * 2500 * 0.085 * 1000).toFixed(3)),
          WN_mJ: Number((qC * 2500 * (0.085 - d_m) * 1000).toFixed(3)),
          deltaWt_mJ: Number(A.toFixed(3)),
          A_mJ: Number(A.toFixed(3)),
          note:
            item.alpha === 90
              ? "α = 90° ⇒ d = 0, công A = 0 hoàn toàn!"
              : `Công A chỉ phụ thuộc vào hình chiếu d = s.cos(α) = ${(d_m * 100).toFixed(1)} cm`,
        };
      });
      setRecordedData((prev) => [...prev, ...records]);
      setActiveTab("table");
      playChime(587.33);
    } else if (type === "path_independence") {
      // Kiểm chứng công không phụ thuộc hình dạng đường đi (Chuẩn SGK Vật lí 11 Bài 19)
      const qC = 2 * 1e-6;
      const d_m = 0.05; // 5.0 cm
      const A = qC * 2500 * d_m * 1000; // 0.250 mJ
      const WM = qC * 2500 * 0.085 * 1000; // 0.425 mJ
      const WN = qC * 2500 * 0.035 * 1000; // 0.175 mJ
      const baseId = Date.now();

      const records: DataRecord[] = [
        {
          id: baseId,
          step: "1. Đường thẳng trực tiếp M → N (xiên α = 45°)",
          orientation: isVertical ? "Bản Dọc" : "Bản Ngang",
          q_microC: 2,
          E_V_per_m: 2500,
          s_cm: 7.07,
          alpha_deg: 45,
          d_cm: 5.0,
          dM_cm: 8.5,
          dN_cm: 3.5,
          WM_mJ: Number(WM.toFixed(3)),
          WN_mJ: Number(WN.toFixed(3)),
          deltaWt_mJ: Number(A.toFixed(3)),
          A_mJ: Number(A.toFixed(3)),
          note: "A_MN = q·E·s·cos(45°) = q·E·d = +0.250 mJ",
        },
        {
          id: baseId + 1,
          step: "2a. Đoạn M → P (dọc đường sức E)",
          orientation: isVertical ? "Bản Dọc" : "Bản Ngang",
          q_microC: 2,
          E_V_per_m: 2500,
          s_cm: 5.0,
          alpha_deg: 0,
          d_cm: 5.0,
          dM_cm: 8.5,
          dN_cm: 3.5,
          WM_mJ: Number(WM.toFixed(3)),
          WN_mJ: Number(WN.toFixed(3)),
          deltaWt_mJ: Number(A.toFixed(3)),
          A_mJ: Number(A.toFixed(3)),
          note: "Lực F cùng chiều dời: A_MP = q·E·MP = +0.250 mJ",
        },
        {
          id: baseId + 2,
          step: "2b. Đoạn P → N (vuông góc đường sức E)",
          orientation: isVertical ? "Bản Dọc" : "Bản Ngang",
          q_microC: 2,
          E_V_per_m: 2500,
          s_cm: 5.0,
          alpha_deg: 90,
          d_cm: 0.0,
          dM_cm: 3.5,
          dN_cm: 3.5,
          WM_mJ: Number(WN.toFixed(3)),
          WN_mJ: Number(WN.toFixed(3)),
          deltaWt_mJ: 0.0,
          A_mJ: 0.0,
          note: "Lực F vuông góc độ dời (cos90°=0) ⇒ A_PN = 0 mJ",
        },
        {
          id: baseId + 3,
          step: "2. Tổng đường gấp khúc M → P → N",
          orientation: isVertical ? "Bản Dọc" : "Bản Ngang",
          q_microC: 2,
          E_V_per_m: 2500,
          s_cm: 10.0,
          alpha_deg: 45,
          d_cm: 5.0,
          dM_cm: 8.5,
          dN_cm: 3.5,
          WM_mJ: Number(WM.toFixed(3)),
          WN_mJ: Number(WN.toFixed(3)),
          deltaWt_mJ: Number(A.toFixed(3)),
          A_mJ: Number(A.toFixed(3)),
          note: "A_MPN = A_MP + A_PN = 0.250 + 0 = +0.250 mJ ≡ A_MN ✓",
        },
        {
          id: baseId + 4,
          step: "3. Quỹ đạo đường cong bất kì M ~ N",
          orientation: isVertical ? "Bản Dọc" : "Bản Ngang",
          q_microC: 2,
          E_V_per_m: 2500,
          s_cm: 11.4,
          alpha_deg: 45,
          d_cm: 5.0,
          dM_cm: 8.5,
          dN_cm: 3.5,
          WM_mJ: Number(WM.toFixed(3)),
          WN_mJ: Number(WN.toFixed(3)),
          deltaWt_mJ: Number(A.toFixed(3)),
          A_mJ: Number(A.toFixed(3)),
          note: "Tích phân công: A = ∫ F·ds = q·E·d = +0.250 mJ không đổi!",
        },
      ];
      setRecordedData((prev) => [...prev, ...records]);
      setActiveTab("table");
      playChime(587.33);
    }
  };

  // ================= 11. XỬ LÝ KÉO THẢ TƯƠNG TÁC (DRAG & DROP) =================
  const handleSvgPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickPxX = ((e.clientX - rect.left) / rect.width) * canvasWidth;
    const clickPxY = ((e.clientY - rect.top) / rect.height) * canvasHeight;

    // Check hit on moving charge
    const distCharge = Math.hypot(clickPxX - pxCurrentX, clickPxY - pxCurrentY);
    if (distCharge <= 28) {
      setActiveDragTarget("charge");
      setIsRunning(false);
      (e.target as Element).setPointerCapture(e.pointerId);
      return;
    }

    // Check hit on start point M handle
    const distM = Math.hypot(clickPxX - pxStartX, clickPxY - pxStartY);
    if (distM <= 22) {
      setActiveDragTarget("pointM");
      setPathPreset("custom");
      setIsRunning(false);
      (e.target as Element).setPointerCapture(e.pointerId);
      return;
    }

    // Check hit on end point N handle
    const distN = Math.hypot(clickPxX - pxEndX, clickPxY - pxEndY);
    if (distN <= 22) {
      setActiveDragTarget("pointN");
      setPathPreset("custom");
      setIsRunning(false);
      (e.target as Element).setPointerCapture(e.pointerId);
      return;
    }
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!activeDragTarget || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const movePxX = ((e.clientX - rect.left) / rect.width) * canvasWidth;
    const movePxY = ((e.clientY - rect.top) / rect.height) * canvasHeight;

    let newPrimaryM = 0;
    let newCrossM = 0;

    if (isVertical) {
      newPrimaryM = Math.max(0.005, Math.min(0.095, (movePxY - vTopY) / pxPerMeter));
      const centerX = (vLeftX + vRightX) / 2;
      newCrossM = Math.max(-0.065, Math.min(0.065, (movePxX - centerX) / pxPerMeter));
    } else {
      newPrimaryM = Math.max(0.005, Math.min(0.095, (movePxX - hLeftX) / pxPerMeter));
      const centerY = (hTopY + hBottomY) / 2;
      newCrossM = Math.max(-0.045, Math.min(0.045, (movePxY - centerY) / pxPerMeter));
    }

    if (activeDragTarget === "charge") {
      setDragChargePos({ primary: newPrimaryM, cross: newCrossM });
    } else if (activeDragTarget === "pointM") {
      setCustomStartM({ primaryM: newPrimaryM, crossM: newCrossM });
      const dp = customEndN.primaryN - newPrimaryM;
      const dc = customEndN.crossN - newCrossM;
      const sDist = Math.sqrt(dp * dp + dc * dc);
      if (sDist > 0.001) {
        setDisplacementDistanceCm(Math.round(sDist * 100 * 10) / 10);
        const cosA = Math.max(-1, Math.min(1, dp / sDist));
        setInclinedAngleDeg(Math.round((Math.acos(cosA) * 180) / Math.PI));
      }
    } else if (activeDragTarget === "pointN") {
      setCustomEndN({ primaryN: newPrimaryM, crossN: newCrossM });
      const dp = newPrimaryM - customStartM.primaryM;
      const dc = newCrossM - customStartM.crossM;
      const sDist = Math.sqrt(dp * dp + dc * dc);
      if (sDist > 0.001) {
        setDisplacementDistanceCm(Math.round(sDist * 100 * 10) / 10);
        const cosA = Math.max(-1, Math.min(1, dp / sDist));
        setInclinedAngleDeg(Math.round((Math.acos(cosA) * 180) / Math.PI));
      }
    }
  };

  const handleSvgPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (activeDragTarget) {
      setActiveDragTarget(null);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Safe capture release
      }
    }
  };

  // Mật độ đường sức điện: số đường sức tỉ lệ với E
  const fieldLineFractions = useMemo(() => {
    if (electricFieldE <= 1500) return [0.2, 0.4, 0.6, 0.8];
    if (electricFieldE <= 3500) return [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
    if (electricFieldE <= 6000) return [0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 0.94];
    return [0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88, 0.96];
  }, [electricFieldE]);

  return (
    <div className="space-y-4 font-sans select-none">
      {/* 1. Header Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-indigo-900/60 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl shadow-inner text-white">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Bài 19: Thế năng điện - Vật lí 11
              </span>
              <span className="text-xs text-slate-400">
                Thí nghiệm khảo sát đa thông số: <MathText math="q, E, s, d" inline={true} />
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2 mt-0.5">
              Khảo sát Công lực điện <MathText math="A = qEd" inline={true} /> & Định lí Thế năng điện
            </h3>
          </div>
        </div>

        {/* Orientation & View Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Orientation Toggle: Vertical vs Horizontal */}
          <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 flex items-center text-xs">
            <button
              onClick={() => {
                setOrientation("vertical");
                handleReset();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                orientation === "vertical"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
              title="Quay 2 bản cực thành dạng Dọc: Bản (+) ở trên, Bản (-) ở dưới"
            >
              <MoveVertical className="w-3.5 h-3.5" /> Bản Dọc (Trên - Dưới)
            </button>
            <button
              onClick={() => {
                setOrientation("horizontal");
                handleReset();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                orientation === "horizontal"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
              title="Quay 2 bản cực dạng Ngang: Bản (+) ở trái, Bản (-) ở phải"
            >
              <MoveHorizontal className="w-3.5 h-3.5" /> Bản Ngang (Trái - Phải)
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 flex items-center text-xs">
            <button
              onClick={() => setActiveTab("sim")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === "sim" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-300 hover:text-white"
              }`}
            >
              Thí nghiệm tương tác
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "table" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-300 hover:text-white"
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Bảng số liệu
              {recordedData.length > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {recordedData.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "quiz" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-300 hover:text-white"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Câu hỏi 5512
            </button>
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
            title={soundEnabled ? "Tắt âm thanh hiệu ứng" : "Bật âm thanh hiệu ứng"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Main Simulation Workspace */}
      {activeTab === "sim" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Visual Interactive Canvas (7 or 8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between shadow-lg">
            {/* Top Canvas Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-slate-200">
                  {activeDragTarget
                    ? `Đang kéo thả ${
                        activeDragTarget === "charge"
                          ? "hạt điện tích q"
                          : activeDragTarget === "pointM"
                          ? "điểm đầu M"
                          : "điểm cuối N"
                      }...`
                    : isRunning
                    ? "Hạt điện tích đang dịch chuyển từ từ..."
                    : "Đang dừng - Sẵn sàng thực hiện phép đo"}
                </span>
              </div>

              {/* Vector Toggles */}
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span className="mr-1">Hiển thị:</span>
                <button
                  onClick={() => setShowVectors((v) => ({ ...v, displacementVector: !v.displacementVector }))}
                  className={`px-2 py-0.5 rounded border transition ${
                    showVectors.displacementVector
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                  title="Vectơ quãng đường s (MN)"
                >
                  Độ dời s
                </button>
                <button
                  onClick={() => setShowVectors((v) => ({ ...v, projectionLines: !v.projectionLines }))}
                  className={`px-2 py-0.5 rounded border transition ${
                    showVectors.projectionLines
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                  title="Hình chiếu d lên phương đường sức"
                >
                  Hình chiếu d
                </button>
                <button
                  onClick={() => setShowVectors((v) => ({ ...v, forceVector: !v.forceVector }))}
                  className={`px-2 py-0.5 rounded border transition ${
                    showVectors.forceVector
                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                  title="Vectơ lực điện F = qE"
                >
                  Lực F
                </button>
                <button
                  onClick={() => setShowVectors((v) => ({ ...v, equipotential: !v.equipotential }))}
                  className={`px-2 py-0.5 rounded border transition ${
                    showVectors.equipotential
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                  title="Các mặt phẳng đẳng thế"
                >
                  Đẳng thế
                </button>

                <div className="h-3.5 w-[1px] bg-slate-700 mx-0.5" />

                <button
                  onClick={toggleAllEnergyValues}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded border transition font-medium text-[11px] ${
                    isAllEnergyValuesVisible
                      ? "bg-amber-500/25 text-amber-300 border-amber-500/50 font-bold"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                  title={
                    isAllEnergyValuesVisible
                      ? "Tắt công tắc để ẩn số liệu (A, W_t, ΔW_t)"
                      : "Bật công tắc để hiện tất cả số liệu (A, W_t, ΔW_t)"
                  }
                >
                  {isAllEnergyValuesVisible ? (
                    <>
                      <Eye className="w-3 h-3 text-amber-400" />
                      <span>Số liệu: Bật</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 text-amber-500/80" />
                      <span>Số liệu: Ẩn</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Thanh chọn nhanh Quỹ đạo (Đường chéo MN vs Đường gấp khúc MPN - M và N giữ cố định) */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 my-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Quỹ đạo khảo sát <span className="text-slate-400 font-normal">(Điểm M, N cố định cùng vị trí):</span></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPathPreset("inclined");
                    handleReset();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    pathPreset === "inclined"
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-300"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                  }`}
                  title="Hạt đi theo đường chéo trực tiếp từ M đến N"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Quỹ đạo chéo thẳng MN</span>
                </button>
                <button
                  onClick={() => {
                    setPathPreset("broken");
                    handleReset();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    pathPreset === "broken"
                      ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25 ring-2 ring-sky-300"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                  }`}
                  title="Hạt đi theo đường gấp khúc M -> P -> N (MP cùng chiều E, PN vuông góc E)"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>Quỹ đạo gấp khúc MPN</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Stage: Khung vẽ canvas & Hàng dọc nút điều khiển cạnh bên thí nghiệm */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 my-2 select-none">
              {/* Vertical Action Controls Panel (Hàng dọc cạnh bên thí nghiệm theo yêu cầu) */}
              <div className="w-full md:w-44 bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-900/60 rounded-xl p-2.5 flex flex-col justify-between gap-2.5 shadow-md shrink-0 order-2 md:order-1">
                {/* Header title */}
                <div className="flex items-center justify-between pb-1.5 border-b border-indigo-900/60">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Điều khiển chạy
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isRunning ? "bg-emerald-400 animate-ping" : "bg-slate-500"
                    }`}
                  />
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col gap-2">
                  {/* Big Play/Pause Button */}
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-md ${
                      isRunning
                        ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-amber-500/20"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                    }`}
                    title={isRunning ? "Tạm dừng thí nghiệm" : "Bắt đầu cho điện tích dịch chuyển từ từ"}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-current animate-pulse" /> Tạm dừng
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" /> Dịch chuyển
                      </>
                    )}
                  </button>

                  {/* Step Forward Button */}
                  <button
                    onClick={handleStepForward}
                    disabled={progress >= 1}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 transition disabled:opacity-40"
                    title="Nhích từ từ đúng 1 bước (+1 cm) để quan sát chi tiết"
                  >
                    <ChevronRight className="w-3.5 h-3.5" /> Bước tiếp (+1cm)
                  </button>

                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    title="Đưa điện tích về điểm xuất phát M"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Đặt lại (Về M)
                  </button>

                  {/* Auto Loop Toggle */}
                  <button
                    onClick={() => setAutoLoop(!autoLoop)}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-medium border transition ${
                      autoLoop
                        ? "bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold"
                        : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200"
                    }`}
                    title="Tự động lặp lại từ từ liên tục để quan sát nhiều lần"
                  >
                    <Repeat className="w-3.5 h-3.5" /> Lặp lại: {autoLoop ? "BẬT" : "TẮT"}
                  </button>

                  {/* Record Data Button */}
                  <button
                    onClick={handleRecordMeasurement}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
                    title="Lưu điểm đo hiện tại vào bảng số liệu thí nghiệm"
                  >
                    <Table className="w-3.5 h-3.5 text-amber-400" /> Ghi số liệu
                  </button>
                </div>

                {/* Speed Selection Section */}
                <div className="pt-2 border-t border-indigo-900/60 flex flex-col gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" /> Tốc độ quan sát:
                  </span>
                  <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {[
                      { label: "0.1x", val: 0.1, desc: "Cực chậm" },
                      { label: "0.2x", val: 0.2, desc: "Chậm" },
                      { label: "0.5x", val: 0.5, desc: "Vừa" },
                      { label: "1.0x", val: 1.0, desc: "Chuẩn" },
                    ].map((s) => (
                      <button
                        key={s.val}
                        onClick={() => setSpeedScale(s.val)}
                        className={`py-1 px-1 rounded text-[10px] font-medium transition text-center ${
                          speedScale === s.val
                            ? "bg-sky-600 text-white font-bold shadow-xs"
                            : "text-slate-400 hover:text-slate-200 bg-slate-900/60"
                        }`}
                        title={s.desc}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center / Right: SVG Interactive Canvas */}
              <div className="relative flex-1 flex justify-center items-center py-1 select-none overflow-hidden order-1 md:order-2">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                className="w-full max-w-[640px] h-auto select-none touch-none cursor-crosshair rounded-xl border border-slate-900/80 bg-slate-950"
                onPointerDown={handleSvgPointerDown}
                onPointerMove={handleSvgPointerMove}
                onPointerUp={handleSvgPointerUp}
              >
                <defs>
                  {/* Plate Gradients */}
                  <linearGradient id="positivePlateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="50%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#b91c1c" />
                  </linearGradient>
                  <linearGradient id="negativePlateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>

                  {/* Marker arrows */}
                  <marker id="arrowE" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                  </marker>
                  <marker id="arrowForce" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" fill={qMicroC > 0 ? "#ef4444" : "#3b82f6"} />
                  </marker>
                  <marker id="arrowS" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#c084fc" />
                  </marker>
                  <marker id="arrowD" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
                  </marker>

                  {/* Charge glow */}
                  <filter id="chargeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Coordinate Grid */}
                <pattern id="simGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <rect width={canvasWidth} height={canvasHeight} fill="#020617" />
                <rect width={canvasWidth} height={canvasHeight} fill="url(#simGrid)" opacity="0.45" />

                {/* ================= HỆ THỐNG BẢN CỰC & ĐIỆN TRƯỜNG ================= */}
                {isVertical ? (
                  // ========== BẢN DỌC: BẢN (+) TRÊN, BẢN (-) DƯỚI, E HƯỚNG XUỐNG ==========
                  <g>
                    {/* Top Plate (+) */}
                    <rect x={vLeftX} y={vTopY - 18} width={vRightX - vLeftX} height={18} fill="url(#positivePlateGrad)" rx="3" />
                    {[110, 160, 210, 260, 310, 360, 410, 460].map((x) => (
                      <text key={`plus-${x}`} x={x} y={vTopY - 5} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                        +
                      </text>
                    ))}
                    <text x={vRightX + 8} y={vTopY - 4} fill="#f87171" fontSize="10.5" fontWeight="bold">
                      Bản (+) {`+${voltageU} V`}
                    </text>

                    {/* Bottom Plate (-) */}
                    <rect x={vLeftX} y={vBottomY} width={vRightX - vLeftX} height={18} fill="url(#negativePlateGrad)" rx="3" />
                    {[110, 160, 210, 260, 310, 360, 410, 460].map((x) => (
                      <text key={`minus-${x}`} x={x} y={vBottomY + 13} fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">
                        -
                      </text>
                    ))}
                    <text x={vRightX + 8} y={vBottomY + 13} fill="#60a5fa" fontSize="10.5" fontWeight="bold">
                      Bản (-) 0 V (Gốc thế năng)
                    </text>

                    {/* Electric field lines E (Vertical, from Top (+) to Bottom (-)) */}
                    {showVectors.fieldLines &&
                      fieldLineFractions.map((frac, idx) => {
                        const x = vLeftX + frac * (vRightX - vLeftX);
                        return (
                          <g key={`efield-${idx}`} opacity={Math.min(0.8, 0.3 + (electricFieldE / 10000) * 0.5)}>
                            <line
                              x1={x}
                              y1={vTopY + 8}
                              x2={x}
                              y2={vBottomY - 8}
                              stroke="#38bdf8"
                              strokeWidth={electricFieldE > 5000 ? "1.6" : "1.2"}
                              strokeDasharray="4 3"
                              markerEnd="url(#arrowE)"
                            />
                            {idx === 0 && (
                              <text x={x + 4} y={vTopY + 28} fill="#38bdf8" fontSize="9" fontWeight="bold">
                                E = {electricFieldE.toLocaleString()} V/m
                              </text>
                            )}
                          </g>
                        );
                      })}

                    {/* Equipotential lines (Horizontal) */}
                    {showVectors.equipotential &&
                      [0.2, 0.4, 0.6, 0.8].map((fraction) => {
                        const y = vTopY + fraction * vSpanY;
                        const vVal = Math.round(voltageU * (1 - fraction));
                        return (
                          <g key={`eq-${fraction}`} opacity="0.35">
                            <line x1={vLeftX} y1={y} x2={vRightX} y2={y} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                            <text x={vLeftX - 6} y={y + 3} fill="#34d399" fontSize="8.5" fontWeight="bold" textAnchor="end">
                              {vVal} V
                            </text>
                          </g>
                        );
                      })}

                    {/* Ruler cm (Left axis, from Top 0cm to Bottom 10cm) */}
                    <g opacity="0.75">
                      <line x1={vLeftX - 25} y1={vTopY} x2={vLeftX - 25} y2={vBottomY} stroke="#64748b" strokeWidth="1" />
                      {[0, 2, 4, 6, 8, 10].map((cm) => {
                        const yTick = vTopY + (cm / 10) * vSpanY;
                        return (
                          <g key={`tick-${cm}`}>
                            <line x1={vLeftX - 30} y1={yTick} x2={vLeftX - 20} y2={yTick} stroke="#94a3b8" strokeWidth="1" />
                            <text x={vLeftX - 34} y={yTick + 3} fill="#94a3b8" fontSize="8" textAnchor="end">
                              {cm} cm
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </g>
                ) : (
                  // ========== BẢN NGANG: BẢN (+) TRÁI, BẢN (-) PHẢI, E HƯỚNG SANG PHẢI ==========
                  <g>
                    {/* Left Plate (+) */}
                    <rect x={hLeftX - 18} y={hTopY} width={18} height={hBottomY - hTopY} fill="url(#positivePlateGrad)" rx="3" />
                    {[70, 110, 150, 190, 230, 270].map((y) => (
                      <text key={`plus-${y}`} x={hLeftX - 5} y={y} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                        +
                      </text>
                    ))}
                    <text x={hLeftX} y={hTopY - 8} fill="#f87171" fontSize="10.5" fontWeight="bold">
                      Bản (+) {`+${voltageU} V`}
                    </text>

                    {/* Right Plate (-) */}
                    <rect x={hRightX} y={hTopY} width={18} height={hBottomY - hTopY} fill="url(#negativePlateGrad)" rx="3" />
                    {[70, 110, 150, 190, 230, 270].map((y) => (
                      <text key={`minus-${y}`} x={hRightX + 9} y={y} fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">
                        -
                      </text>
                    ))}
                    <text x={hRightX - 60} y={hTopY - 8} fill="#60a5fa" fontSize="10.5" fontWeight="bold">
                      Bản (-) 0 V
                    </text>

                    {/* Electric field lines E (Horizontal) */}
                    {showVectors.fieldLines &&
                      fieldLineFractions.map((frac, idx) => {
                        const y = hTopY + frac * (hBottomY - hTopY);
                        return (
                          <g key={`efield-${idx}`} opacity={Math.min(0.8, 0.3 + (electricFieldE / 10000) * 0.5)}>
                            <line
                              x1={hLeftX + 8}
                              y1={y}
                              x2={hRightX - 8}
                              y2={y}
                              stroke="#38bdf8"
                              strokeWidth={electricFieldE > 5000 ? "1.6" : "1.2"}
                              strokeDasharray="4 3"
                              markerEnd="url(#arrowE)"
                            />
                            {idx === 0 && (
                              <text x={hLeftX + 20} y={y - 4} fill="#38bdf8" fontSize="9" fontWeight="bold">
                                E = {electricFieldE.toLocaleString()} V/m
                              </text>
                            )}
                          </g>
                        );
                      })}

                    {/* Equipotential lines (Vertical) */}
                    {showVectors.equipotential &&
                      [0.2, 0.4, 0.6, 0.8].map((fraction) => {
                        const x = hLeftX + fraction * hSpanX;
                        const vVal = Math.round(voltageU * (1 - fraction));
                        return (
                          <g key={`eq-${fraction}`} opacity="0.35">
                            <line x1={x} y1={hTopY} x2={x} y2={hBottomY} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                            <text x={x} y={hBottomY + 14} fill="#34d399" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                              {vVal} V
                            </text>
                          </g>
                        );
                      })}
                  </g>
                )}

                {/* ================= ĐƯỜNG DỊCH CHUYỂN, HÌNH CHIẾU d & GÓC ALPHA ================= */}
                {/* 1. Điểm xuất phát M (Handle kéo thả) */}
                <g className="cursor-pointer" title="Điểm xuất phát M (kéo thả để thay đổi vị trí)">
                  <circle cx={pxStartX} cy={pxStartY} r="7" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                  <text x={pxStartX - 14} y={pxStartY - 10} fill="#a5b4fc" fontSize="12" fontWeight="extrabold">
                    M
                  </text>
                  <text x={pxStartX - 14} y={pxStartY + 14} fill="#cbd5e1" fontSize="8">
                    d_M = {(dM_fromNegPlate_m * 100).toFixed(1)} cm
                  </text>
                </g>

                {/* 2. Điểm kết thúc N (Handle kéo thả) */}
                <g className="cursor-pointer" title="Điểm kết thúc N (kéo thả để đổi quãng đường s và góc α)">
                  <circle cx={pxEndX} cy={pxEndY} r="7" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
                  <text x={pxEndX + 10} y={pxEndY - 10} fill="#f472b6" fontSize="12" fontWeight="extrabold">
                    N
                  </text>
                  <text x={pxEndX + 10} y={pxEndY + 14} fill="#cbd5e1" fontSize="8">
                    d_N = {(dN_fromNegPlate_m * 100).toFixed(1)} cm
                  </text>
                </g>

                {/* 3. Dạng quỹ đạo nối giữa M và N */}
                {pathPreset === "broken" ? (
                  // Quỹ đạo gãy khúc M -> P -> N chuẩn SGK Vật lí 11 Bài 19 (Hình thực nghiệm)
                  <g>
                    {/* Đường nét đứt trực tiếp MN để so sánh */}
                    <line
                      x1={pxStartX}
                      y1={pxStartY}
                      x2={pxEndX}
                      y2={pxEndY}
                      stroke="#fbbf24"
                      strokeWidth="1.8"
                      strokeDasharray="4 4"
                      opacity="0.65"
                    />

                    {/* Đoạn 1: M -> P dọc theo đường sức E */}
                    <line
                      x1={pxStartX}
                      y1={pxStartY}
                      x2={pxPointP_X}
                      y2={pxPointP_Y}
                      stroke="#38bdf8"
                      strokeWidth="2.8"
                    />
                    {/* Đoạn 2: P -> N vuông góc đường sức E */}
                    <line
                      x1={pxPointP_X}
                      y1={pxPointP_Y}
                      x2={pxEndX}
                      y2={pxEndY}
                      stroke="#38bdf8"
                      strokeWidth="2.8"
                      strokeDasharray="6 3"
                    />

                    {/* Điểm P (nằm trên đường sức qua M, cùng mặt đẳng thế với N) */}
                    <circle cx={pxPointP_X} cy={pxPointP_Y} r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={pxPointP_X - 16} y={pxPointP_Y + 14} fill="#38bdf8" fontSize="11" fontWeight="extrabold">
                      P
                    </text>
                  </g>
                ) : pathPreset === "curve" ? (
                  // Quỹ đạo đường cong
                  <path
                    d={`M ${pxStartX} ${pxStartY} Q ${(pxStartX + pxEndX) / 2 + 35} ${(pxStartY + pxEndY) / 2} ${pxEndX} ${pxEndY}`}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />
                ) : (
                  // Đường thẳng trực tiếp M -> N (hoặc quỹ đạo chéo MN)
                  <g>
                    {/* Hướng dẫn nét đứt tam giác vuông P để học sinh đối chiếu với MPN */}
                    {pathPreset === "inclined" && (
                      <g opacity="0.5">
                        <line
                          x1={pxStartX}
                          y1={pxStartY}
                          x2={pxPointP_X}
                          y2={pxPointP_Y}
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                        <line
                          x1={pxPointP_X}
                          y1={pxPointP_Y}
                          x2={pxEndX}
                          y2={pxEndY}
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                        <circle cx={pxPointP_X} cy={pxPointP_Y} r="3.5" fill="#0284c7" />
                        <text x={pxPointP_X - 14} y={pxPointP_Y + 12} fill="#38bdf8" fontSize="10" fontWeight="bold">
                          P
                        </text>
                      </g>
                    )}

                    {showVectors.displacementVector && (
                      <g>
                        <line
                          x1={pxStartX}
                          y1={pxStartY}
                          x2={pxEndX}
                          y2={pxEndY}
                          stroke="#fbbf24"
                          strokeWidth="2.8"
                          markerEnd="url(#arrowS)"
                        />
                        {/* Quỹ đạo chuyển động trực tiếp MN */}
                      </g>
                    )}
                  </g>
                )}

                {/* 4. Hình chiếu d lên phương đường sức */}
                {showVectors.projectionLines && (
                  <g>
                    {/* Đường dóng vuông góc từ N tới trục đường sức qua M */}
                    <line
                      x1={pxEndX}
                      y1={pxEndY}
                      x2={pxProjH_X}
                      y2={pxProjH_Y}
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                    {/* Kí hiệu góc vuông tại điểm vuông góc */}
                    <rect
                      x={isVertical ? pxProjH_X - 6 : pxProjH_X - 6}
                      y={isVertical ? (total_d_MN_m >= 0 ? pxProjH_Y - 6 : pxProjH_Y) : pxProjH_Y - 6}
                      width="6"
                      height="6"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />

                    {/* Đoạn thẳng biểu diễn hình chiếu d = MH trên phương đường sức */}
                    <line
                      x1={pxStartX}
                      y1={pxStartY}
                      x2={pxProjH_X}
                      y2={pxProjH_Y}
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      markerEnd="url(#arrowD)"
                    />
                    {/* Label hình chiếu d */}
                    <g
                      transform={`translate(${
                        isVertical ? pxStartX - 50 : (pxStartX + pxProjH_X) / 2
                      }, ${isVertical ? (pxStartY + pxProjH_Y) / 2 : pxStartY + 20})`}
                    >
                      <rect x="-6" y="-12" width="70" height="17" fill="#18181b" rx="4" stroke="#f59e0b" strokeWidth="1" />
                      <text x="29" y="0" fill="#fbbf24" fontSize="9.5" fontWeight="extrabold" textAnchor="middle">
                        d = {total_d_MN_cm.toFixed(1)} cm
                      </text>
                    </g>
                  </g>
                )}

                {/* 6. Vết chuyển động tức thời từ M tới vị trí hiện tại */}
                <line
                  x1={pxStartX}
                  y1={pxStartY}
                  x2={pxCurrentX}
                  y2={pxCurrentY}
                  stroke={qMicroC > 0 ? "#ef4444" : "#3b82f6"}
                  strokeWidth="2"
                  opacity="0.6"
                />

                {/* 7. Vectơ lực điện trường F = qE tại vị trí hạt */}
                {showVectors.forceVector && (
                  <g>
                    {/* Chiều của lực F: q > 0 thì F cùng chiều E, q < 0 thì F ngược chiều E */}
                    {isVertical ? (
                      // Đường sức E hướng xuống
                      <g>
                        <line
                          x1={pxCurrentX}
                          y1={pxCurrentY}
                          x2={pxCurrentX}
                          y2={qMicroC > 0 ? pxCurrentY + 45 : pxCurrentY - 45}
                          stroke={qMicroC > 0 ? "#ef4444" : "#3b82f6"}
                          strokeWidth="2.5"
                          markerEnd="url(#arrowForce)"
                        />
                        <text
                          x={pxCurrentX + 8}
                          y={qMicroC > 0 ? pxCurrentY + 38 : pxCurrentY - 38}
                          fill={qMicroC > 0 ? "#f87171" : "#60a5fa"}
                          fontSize="9.5"
                          fontWeight="extrabold"
                        >
                          F = {absF_Newton.toFixed(3)} N ({qMicroC > 0 ? "Cùng chiều E" : "Ngược chiều E"})
                        </text>
                      </g>
                    ) : (
                      // Đường sức E hướng sang phải
                      <g>
                        <line
                          x1={pxCurrentX}
                          y1={pxCurrentY}
                          x2={qMicroC > 0 ? pxCurrentX + 45 : pxCurrentX - 45}
                          y2={pxCurrentY}
                          stroke={qMicroC > 0 ? "#ef4444" : "#3b82f6"}
                          strokeWidth="2.5"
                          markerEnd="url(#arrowForce)"
                        />
                        <text
                          x={qMicroC > 0 ? pxCurrentX + 25 : pxCurrentX - 55}
                          y={pxCurrentY - 8}
                          fill={qMicroC > 0 ? "#f87171" : "#60a5fa"}
                          fontSize="9.5"
                          fontWeight="extrabold"
                        >
                          F = {absF_Newton.toFixed(3)} N
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* ================= 8. HẠT ĐIỆN TÍCH q ĐANG DỊCH CHUYỂN ================= */}
                <g filter="url(#chargeGlow)" className="cursor-grab active:cursor-grabbing">
                  {/* Hào quang xung quanh hạt */}
                  <circle
                    cx={pxCurrentX}
                    cy={pxCurrentY}
                    r={isRunning ? 22 : 18}
                    fill={qMicroC > 0 ? "#ef4444" : "#3b82f6"}
                    opacity="0.35"
                    className={isRunning ? "animate-ping" : ""}
                  />
                  {/* Thân hạt mang điện */}
                  <circle
                    cx={pxCurrentX}
                    cy={pxCurrentY}
                    r="15"
                    fill={qMicroC > 0 ? "#ef4444" : "#2563eb"}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  {/* Ký hiệu điện lượng */}
                  <text
                    x={pxCurrentX}
                    y={pxCurrentY + 5}
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="extrabold"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {qMicroC > 0 ? `+q` : `-q`}
                  </text>
                </g>

                {/* Hướng dẫn tương tác ngắn khi chưa chạy */}
                {progress === 0 && !activeDragTarget && (
                  <g opacity="0.9">
                    <rect
                      x={pxStartX - 100}
                      y={isVertical ? pxStartY - 36 : pxStartY + 26}
                      width="200"
                      height="22"
                      rx="6"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />
                    <text
                      x={pxStartX}
                      y={isVertical ? pxStartY - 22 : pxStartY + 41}
                      fill="#fde047"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Bấm "Dịch chuyển từ từ" hoặc kéo rê hạt q / điểm M, N
                    </text>
                  </g>
                )}

                {/* Floating energy values status pill on canvas */}
                {!isAllEnergyValuesVisible ? (
                  <g
                    className="cursor-pointer"
                    onClick={toggleAllEnergyValues}
                    opacity="0.92"
                  >
                    <rect
                      x={canvasWidth - 200}
                      y={10}
                      width="190"
                      height="22"
                      rx="6"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />
                    <text
                      x={canvasWidth - 105}
                      y={24}
                      fill="#fde047"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      🔒 Số liệu (A, W_t, ΔW_t) đang ẩn [Bật]
                    </text>
                  </g>
                ) : (
                  <g
                    className="cursor-pointer"
                    onClick={toggleAllEnergyValues}
                    opacity="0.85"
                  >
                    <rect
                      x={canvasWidth - 180}
                      y={10}
                      width="170"
                      height="22"
                      rx="6"
                      fill="#0f172a"
                      stroke="#10b981"
                      strokeWidth="1"
                    />
                    <text
                      x={canvasWidth - 95}
                      y={24}
                      fill="#34d399"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      👁️ Số liệu năng lượng: Đang BẬT [Tắt]
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

            {/* Bottom Compact Progress Bar: Kéo tiến trình & xem độ dời tức thời */}
            <div className="mt-2.5 px-3 py-2 bg-slate-900/90 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                <span className="text-purple-300 font-bold">s = {sCurrent_cm.toFixed(2)} cm</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">{total_s_MN_cm.toFixed(2)} cm</span>
                <span className="bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-300 border border-indigo-800/40">
                  {Math.round(progress * 100)}%
                </span>
              </div>

              <div className="flex-1 min-w-[140px] flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium">M</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.005"
                  value={progress}
                  onChange={(e) => {
                    setIsRunning(false);
                    setProgress(parseFloat(e.target.value));
                  }}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  title="Kéo thanh trượt để di chuyển điện tích q thủ công đến vị trí bất kì"
                />
                <span className="text-[10px] text-slate-400 font-medium">N</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                <span className="text-amber-300 font-bold">d = {dCurrent_cm.toFixed(2)} cm</span>
                <span className="text-slate-500">|</span>
                <span className="text-sky-300">α = {currentAlphaDeg}°</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Energy Telemetry HUD & Parameter Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Real-time Telemetry Dashboard */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Đo lường Năng lượng Thời gian thực
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    qMicroC > 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  q = {qMicroC > 0 ? `+${qMicroC}` : qMicroC} μC
                </span>
              </div>

              {/* Dynamic Values Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[11px] block">
                    Độ dời <MathText math="s = MN" inline={true} />:
                  </span>
                  <span className="text-sm font-bold font-mono text-purple-700">
                    {sCurrent_cm.toFixed(2)} cm
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[11px] block">
                    Hình chiếu <MathText math="d = s\cos\alpha" inline={true} />:
                  </span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      dCurrent_cm >= 0 ? "text-amber-600" : "text-blue-600"
                    }`}
                  >
                    {dCurrent_cm > 0 ? `+${dCurrent_cm.toFixed(2)}` : dCurrent_cm.toFixed(2)} cm
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[11px] block">
                    Điện thế <MathText math="V" inline={true} />:
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-600">
                    {currentV_volts.toFixed(1)} V
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[11px] block">
                    Cường độ <MathText math="E" inline={true} />:
                  </span>
                  <span className="text-sm font-bold font-mono text-sky-600">
                    {electricFieldE.toLocaleString()} V/m
                  </span>
                </div>
              </div>

              {/* Energy Calculation Display with Switch Controls */}
              <div className="bg-gradient-to-br from-indigo-50/90 via-slate-50 to-sky-50/70 p-3.5 rounded-2xl border border-indigo-200/90 space-y-2.5 shadow-xs">
                {/* Switch Master Controls Header */}
                <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Công tắc Số liệu Năng lượng
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Bật công tắc để hiện số; Tắt để học sinh tự tính
                    </span>
                  </div>
                  <button
                    onClick={toggleAllEnergyValues}
                    className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition ${
                      isAllEnergyValuesVisible
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs hover:bg-indigo-700"
                        : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                    }`}
                    title={
                      isAllEnergyValuesVisible
                        ? "Ẩn tất cả số liệu để học sinh tự làm bài"
                        : "Bật tất cả công tắc để hiện số"
                    }
                  >
                    {isAllEnergyValuesVisible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Bật tất cả
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" /> Ẩn tất cả
                      </>
                    )}
                  </button>
                </div>

                {/* 1. Công của lực điện A = qEd */}
                <div className="flex justify-between items-center text-xs py-0.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Công lực điện <MathText math="A = qEd" inline={true} />:
                  </span>
                  {showEnergyValues.work ? (
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded border ${
                          workA_mJ >= 0
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {workA_mJ >= 0 ? `+${workA_mJ.toFixed(2)}` : workA_mJ.toFixed(2)} mJ
                      </span>
                      <button
                        onClick={() => toggleEnergyValue("work")}
                        className="text-emerald-600 hover:text-emerald-800 transition"
                        title="Tắt công tắc để ẩn số công A"
                      >
                        <ToggleRight className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleEnergyValue("work")}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 text-amber-800 text-[11px] font-medium transition"
                      title="Bật công tắc để hiện số công A"
                    >
                      <ToggleLeft className="w-4 h-4 text-slate-400" />
                      <span>[🔒 Ẩn số - Bật xem]</span>
                    </button>
                  )}
                </div>

                {/* 2. Thế năng hiện tại W_t = qV */}
                <div className="flex justify-between items-center text-xs py-0.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Thế năng <MathText math="W_t = qV" inline={true} />:
                  </span>
                  {showEnergyValues.potentialEnergy ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {currentWt_mJ >= 0 ? `+${currentWt_mJ.toFixed(2)}` : currentWt_mJ.toFixed(2)} mJ
                      </span>
                      <button
                        onClick={() => toggleEnergyValue("potentialEnergy")}
                        className="text-indigo-600 hover:text-indigo-800 transition"
                        title="Tắt công tắc để ẩn số thế năng W_t"
                      >
                        <ToggleRight className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleEnergyValue("potentialEnergy")}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 text-amber-800 text-[11px] font-medium transition"
                      title="Bật công tắc để hiện số thế năng W_t"
                    >
                      <ToggleLeft className="w-4 h-4 text-slate-400" />
                      <span>[🔒 Ẩn số - Bật xem]</span>
                    </button>
                  )}
                </div>

                {/* 3. Độ giảm thế (Hiệu điện thế) U = VM - V = Ed */}
                <div className="flex justify-between items-center text-xs py-0.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    Độ giảm thế <MathText math="U = V_M - V" inline={true} />:
                  </span>
                  {showEnergyValues.voltageDrop ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                        {voltageDrop_volts >= 0 ? `+${voltageDrop_volts.toFixed(1)}` : voltageDrop_volts.toFixed(1)} V
                      </span>
                      <button
                        onClick={() => toggleEnergyValue("voltageDrop")}
                        className="text-sky-600 hover:text-sky-800 transition"
                        title="Tắt công tắc để ẩn số độ giảm thế U"
                      >
                        <ToggleRight className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleEnergyValue("voltageDrop")}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 text-amber-800 text-[11px] font-medium transition"
                      title="Bật công tắc để hiện số độ giảm thế U"
                    >
                      <ToggleLeft className="w-4 h-4 text-slate-400" />
                      <span>[🔒 Ẩn số - Bật xem]</span>
                    </button>
                  )}
                </div>

                {/* 4. Độ giảm thế năng ΔW_t = W_tM - W_t */}
                <div className="flex justify-between items-center text-xs border-t border-indigo-100/80 pt-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Độ giảm thế năng <MathText math="\Delta W_t" inline={true} />:
                  </span>
                  {showEnergyValues.deltaWt ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        {deltaWt_mJ >= 0 ? `+${deltaWt_mJ.toFixed(2)}` : deltaWt_mJ.toFixed(2)} mJ
                      </span>
                      <button
                        onClick={() => toggleEnergyValue("deltaWt")}
                        className="text-amber-600 hover:text-amber-800 transition"
                        title="Tắt công tắc để ẩn số độ giảm thế năng ΔW_t"
                      >
                        <ToggleRight className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleEnergyValue("deltaWt")}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 text-amber-800 text-[11px] font-medium transition"
                      title="Bật công tắc để hiện số độ giảm thế năng ΔW_t"
                    >
                      <ToggleLeft className="w-4 h-4 text-slate-400" />
                      <span>[🔒 Ẩn số - Bật xem]</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Theorem Validation Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Định lí thế năng: <MathText math="A_{MN} = W_{tM} - W_{tN}" inline={true} />
                  </span>
                </div>
                {showEnergyValues.work && showEnergyValues.deltaWt ? (
                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    {isTheoremSatisfied
                      ? `Khớp: A = ΔWt = ${workA_mJ >= 0 ? "+" + workA_mJ.toFixed(2) : workA_mJ.toFixed(2)} mJ ✓`
                      : "Đang tính..."}
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      setShowEnergyValues((prev) => ({
                        ...prev,
                        work: true,
                        deltaWt: true,
                      }))
                    }
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1"
                    title="Bật công tắc A và ΔWt để đối chiếu kết quả"
                  >
                    <Eye className="w-3 h-3 text-amber-700" /> Bật kiểm chứng
                  </button>
                )}
              </div>

              {/* Path Equivalence Comparison Card (Định lí Trường thế SGK Vật lí 11 Bài 19) */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-700/60 rounded-xl p-3 text-xs text-white space-y-2 shadow-sm">
                <div className="flex items-center justify-between border-b border-indigo-800/60 pb-1.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Đối chiếu Công Quỹ đạo (Độc lập hình dạng đường đi):
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                    A = q·E·d
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center text-slate-200">
                    <span className="flex items-center gap-1 font-sans text-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      1. Đường thẳng trực tiếp <strong>MN</strong>:
                    </span>
                    <span className="font-bold text-amber-300">
                      A_MN = {totalWorkA_MN_mJ >= 0 ? `+${totalWorkA_MN_mJ.toFixed(2)}` : totalWorkA_MN_mJ.toFixed(2)} mJ
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-200">
                    <span className="flex items-center gap-1 font-sans text-sky-200">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      2. Gấp khúc <strong>M→P→N</strong> (<span className="text-sky-300">A_MP</span> + <span className="text-slate-400">A_PN</span>):
                    </span>
                    <span className="font-bold text-sky-300">
                      {totalWorkA_MN_mJ >= 0 ? `+${totalWorkA_MN_mJ.toFixed(2)}` : totalWorkA_MN_mJ.toFixed(2)} + 0 = {totalWorkA_MN_mJ >= 0 ? `+${totalWorkA_MN_mJ.toFixed(2)}` : totalWorkA_MN_mJ.toFixed(2)} mJ
                    </span>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-indigo-800/50 text-[10px] text-indigo-200 flex items-center justify-between">
                  <span>✓ Định luật SGK: Công không đổi theo dạng đường:</span>
                  <span className="text-emerald-300 font-bold font-mono">
                    A_MN ≡ A_MPN = q·E·d
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Parameter Control Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-600" />
                Bộ Điều Chỉnh Thông Số Thí Nghiệm
              </span>

              {/* 1. ĐIỆN LƯỢNG q (Độ lớn & Dấu) */}
              <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Điện lượng thử <MathText math="q" inline={true} />:
                  </span>
                  <span
                    className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded ${
                      qMicroC > 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {qMicroC > 0 ? `+${qMicroC}` : qMicroC} μC ({qMicroC > 0 ? "Dương" : "Âm"})
                  </span>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.5"
                  value={qMicroC}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setQMicroC(val === 0 ? (qMicroC >= 0 ? 0.5 : -0.5) : val);
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />

                {/* Quick Presets for Charge q */}
                <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] pt-1">
                  <span className="text-slate-400">Chọn nhanh:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { label: "+1 μC", val: 1 },
                      { label: "+2 μC", val: 2 },
                      { label: "+5 μC", val: 5 },
                      { label: "-2 μC", val: -2 },
                      { label: "-5 μC", val: -5 },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        onClick={() => setQMicroC(btn.val)}
                        className={`px-1.5 py-0.5 rounded border transition ${
                          qMicroC === btn.val
                            ? "bg-slate-800 text-white font-bold border-slate-700"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setQMicroC(-qMicroC)}
                      className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold hover:bg-indigo-100"
                      title="Đảo dấu điện tích"
                    >
                      Đảo dấu ±
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. CƯỜNG ĐỘ ĐIỆN TRƯỜNG E */}
              <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    Cường độ điện trường <MathText math="E" inline={true} />:
                  </span>
                  <span className="font-mono font-extrabold text-xs text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    {electricFieldE.toLocaleString()} V/m (U = {voltageU} V)
                  </span>
                </div>

                {/* Slider for E */}
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={electricFieldE}
                  onChange={(e) => setElectricFieldE(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />

                {/* Quick Presets for E */}
                <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] pt-1">
                  <span className="text-slate-400">Chọn nhanh E:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { label: "1 000 V/m", val: 1000 },
                      { label: "2 500 V/m", val: 2500 },
                      { label: "5 000 V/m", val: 5000 },
                      { label: "10 000 V/m", val: 10000 },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        onClick={() => setElectricFieldE(btn.val)}
                        className={`px-1.5 py-0.5 rounded border transition ${
                          electricFieldE === btn.val
                            ? "bg-sky-600 text-white font-bold border-sky-500"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. ĐIỀU CHỈNH TRỰC TIẾP HÌNH CHIẾU d DỌC THEO ĐƯỜNG SỨC E */}
              <div className="space-y-1.5 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Hình chiếu <MathText math="d" inline={true} /> (dọc theo <MathText math="\vec{E}" inline={true} />):
                  </span>
                  <span className="font-mono font-extrabold text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    d = {total_d_MN_cm >= 0 ? `+${total_d_MN_cm.toFixed(1)}` : total_d_MN_cm.toFixed(1)} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="-6.0"
                  max="7.0"
                  step="0.5"
                  value={Number(total_d_MN_cm.toFixed(1))}
                  onChange={(e) => {
                    const newD_cm = Number(e.target.value);
                    const dMeters = newD_cm / 100;
                    const crossMeters = customEndN.crossN - customStartM.crossM;
                    const newS = Math.sqrt(dMeters * dMeters + crossMeters * crossMeters);
                    setDisplacementDistanceCm(Math.max(1.0, Math.min(8.0, Number((newS * 100).toFixed(1)))));
                    if (newS > 0.001) {
                      const cosA = Math.max(-1, Math.min(1, dMeters / newS));
                      setInclinedAngleDeg(Math.round((Math.acos(cosA) * 180) / Math.PI));
                    }
                    setCustomEndN((prev) => ({
                      ...prev,
                      primaryN: Math.max(0.005, Math.min(0.095, customStartM.primaryM + dMeters)),
                    }));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-emerald-700/80">
                  <span>-6 cm (Ngược E: A &lt; 0)</span>
                  <span>0 cm (Vuông góc E: A = 0)</span>
                  <span>+7 cm (Cùng E: A &gt; 0)</span>
                </div>
                <div className="text-[10px] text-slate-600 pt-1 border-t border-emerald-200/60 flex items-center justify-between">
                  <span>Kiểm nghiệm tỉ lệ thuận:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    A / d = q·E = {((qMicroC * 1e-6) * electricFieldE * 0.01 * 1000).toFixed(3)} mJ/cm (Hằng số!)
                  </span>
                </div>
                {/* Interactive Drag Hint */}
                <div className="text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200 flex items-center gap-1.5 mt-1">
                  <MousePointer className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>
                    Có thể dùng chuột kéo thả trực tiếp <strong>điểm M</strong> hoặc <strong>điểm N</strong> trên hình vẽ!
                  </span>
                </div>
              </div>

              {/* 5. DẠNG QUỸ ĐẠO MẪU THEO SGK VẬT LÍ 11 */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">
                  Dạng quỹ đạo nghiên cứu (SGK KNTT):
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      setPathPreset("straight_along");
                      handleReset();
                    }}
                    className={`p-1.5 rounded-lg text-left border transition ${
                      pathPreset === "straight_along"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block font-semibold">1. Cùng chiều E</span>
                    <span className="text-[10px] text-slate-500">α = 0°, d = s, A &gt; 0</span>
                  </button>

                  <button
                    onClick={() => {
                      setPathPreset("straight_opposite");
                      handleReset();
                    }}
                    className={`p-1.5 rounded-lg text-left border transition ${
                      pathPreset === "straight_opposite"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block font-semibold">2. Ngược chiều E</span>
                    <span className="text-[10px] text-slate-500">α = 180°, d = -s, A &lt; 0</span>
                  </button>

                  <button
                    onClick={() => {
                      setPathPreset("inclined");
                      handleReset();
                    }}
                    className={`p-2 rounded-lg text-left border transition ${
                      pathPreset === "inclined"
                        ? "bg-amber-50 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-300"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block font-semibold flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                      3. Quỹ đạo chéo thẳng MN
                    </span>
                    <span className="text-[10px] text-slate-500">Đường thẳng nối M → N (d = s·cosα)</span>
                  </button>

                  <button
                    onClick={() => {
                      setPathPreset("perpendicular");
                      handleReset();
                    }}
                    className={`p-1.5 rounded-lg text-left border transition ${
                      pathPreset === "perpendicular"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block font-semibold">4. Vuông góc E</span>
                    <span className="text-[10px] text-slate-500">α = 90°, d = 0, A = 0</span>
                  </button>

                  <button
                    onClick={() => {
                      setPathPreset("broken");
                      handleReset();
                    }}
                    className={`p-2 rounded-lg text-left border transition col-span-2 ${
                      pathPreset === "broken"
                        ? "bg-sky-50 border-sky-500 text-sky-950 font-bold ring-2 ring-sky-300"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block font-semibold flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5 text-sky-600" />
                      5. Quỹ đạo gấp khúc MPN (M → P → N)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      M, N giữ cố định • A_MPN = A_MP + A_PN = q·E·d ≡ A_MN (Độc lập hình dạng đường đi)
                    </span>
                  </button>
                </div>
              </div>

              {/* 5. CÔNG CỤ TỰ ĐỘNG KHẢO SÁT 1-CHẠM THEO CÔNG VĂN 5512 */}
              <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-sky-500/10 p-3 rounded-xl border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Chuỗi Thí Nghiệm Khảo Sát Tự Động (Dành cho Giáo viên)
                </span>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Tự động điền chuỗi các lần đo để học sinh so sánh và rút ra định luật:
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => runQuickExperiment("vary_d")}
                    className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-bold shadow-xs hover:from-emerald-500 hover:to-teal-500 text-left col-span-2 flex items-center justify-between transition cursor-pointer"
                    title="Khảo sát công A tỉ lệ thuận bậc nhất với hình chiếu d (A = q·E·d)"
                  >
                    <span>📏 Khảo sát sự phụ thuộc vào hình chiếu d</span>
                    <span className="bg-emerald-800/80 text-[10px] px-1.5 py-0.5 rounded font-mono">A ∝ d</span>
                  </button>
                  <button
                    onClick={() => runQuickExperiment("vary_q")}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 font-semibold text-slate-700 text-left hover:bg-indigo-50/40 transition"
                  >
                    ⚡ Khảo sát theo q
                  </button>
                  <button
                    onClick={() => runQuickExperiment("vary_E")}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 font-semibold text-slate-700 text-left hover:bg-indigo-50/40 transition"
                  >
                    🌐 Khảo sát theo E
                  </button>
                  <button
                    onClick={() => runQuickExperiment("path_independence")}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 font-semibold text-slate-700 text-left hover:bg-indigo-50/40 transition col-span-2 flex items-center justify-between"
                  >
                    <span>🔄 Khảo sát không phụ thuộc đường đi</span>
                    <span className="text-[10px] text-indigo-600 font-bold">A_MN ≡ A_MPN</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Bảng Ghi Nhận Số Liệu Thực Nghiệm (Tab "table") */}
      {activeTab === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-600" />
                Bảng Ghi nhận Số liệu Thực nghiệm: Khảo sát Công <MathText math="A = qEd" inline={true} /> và Thế năng điện
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Cấu trúc bảng số liệu theo chuẩn bài học Vật lí 11 KNTT và Công văn 5512
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRecordedData([])}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                Xóa tất cả
              </button>
              <button
                onClick={() => setActiveTab("sim")}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Quay lại phòng thí nghiệm
              </button>
            </div>
          </div>

          {/* Energy Columns Switch Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Công tắc hiển thị cột số liệu năng lượng:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={toggleAllEnergyValues}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold border transition ${
                  isAllEnergyValuesVisible
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                }`}
                title={isAllEnergyValuesVisible ? "Tắt công tắc để ẩn đáp số" : "Bật tất cả công tắc để hiện đáp số"}
              >
                {isAllEnergyValuesVisible ? (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Bật tất cả đáp số
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" /> Ẩn đáp số (Học sinh tự tính)
                  </>
                )}
              </button>

              <button
                onClick={() => toggleEnergyValue("work")}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition ${
                  showEnergyValues.work
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {showEnergyValues.work ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                Công A
              </button>

              <button
                onClick={() => toggleEnergyValue("potentialEnergy")}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition ${
                  showEnergyValues.potentialEnergy
                    ? "bg-indigo-50 text-indigo-800 border-indigo-300 font-bold"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {showEnergyValues.potentialEnergy ? <ToggleRight className="w-4 h-4 text-indigo-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                Thế năng W_t
              </button>

              <button
                onClick={() => toggleEnergyValue("deltaWt")}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition ${
                  showEnergyValues.deltaWt
                    ? "bg-amber-50 text-amber-800 border-amber-300 font-bold"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {showEnergyValues.deltaWt ? <ToggleRight className="w-4 h-4 text-amber-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                Độ giảm thế năng ΔW_t
              </button>
            </div>
          </div>

          {recordedData.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Table className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">Chưa có điểm đo nào được ghi.</p>
              <p className="text-xs max-w-md mx-auto text-slate-400">
                Hãy quay về tab <strong>Thí nghiệm</strong>, thay đổi các thông số <MathText math="q, E, s" inline={true} /> rồi bấm nút{" "}
                <span className="text-amber-600 font-bold">"Ghi số liệu"</span>, hoặc bấm nút chạy các chuỗi khảo sát mẫu tự động!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-y border-slate-200">
                    <th className="py-2.5 px-3 font-semibold">Lần đo</th>
                    <th className="py-2.5 px-3 font-semibold">Bố trí</th>
                    <th className="py-2.5 px-3 font-semibold">q (μC)</th>
                    <th className="py-2.5 px-3 font-semibold">E (V/m)</th>
                    <th className="py-2.5 px-3 font-semibold">s (cm)</th>
                    <th className="py-2.5 px-3 font-semibold">Góc α (°)</th>
                    <th className="py-2.5 px-3 font-semibold">d (cm)</th>
                    <th className="py-2.5 px-3 font-semibold">W_tM (mJ)</th>
                    <th className="py-2.5 px-3 font-semibold">W_tN (mJ)</th>
                    <th className="py-2.5 px-3 font-semibold">ΔW_t (mJ)</th>
                    <th className="py-2.5 px-3 font-semibold">Công A (mJ)</th>
                    <th className="py-2.5 px-3 font-semibold">Nhận xét thực nghiệm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recordedData.map((row) => (
                    <tr key={row.id} className="hover:bg-indigo-50/40">
                      <td className="py-2 px-3 font-medium text-slate-900">{row.step}</td>
                      <td className="py-2 px-3 text-slate-600">{row.orientation}</td>
                      <td className={`py-2 px-3 font-mono font-bold ${row.q_microC > 0 ? "text-red-600" : "text-blue-600"}`}>
                        {row.q_microC > 0 ? `+${row.q_microC}` : row.q_microC}
                      </td>
                      <td className="py-2 px-3 font-mono text-sky-700">{row.E_V_per_m.toLocaleString()}</td>
                      <td className="py-2 px-3 font-mono text-purple-700">{row.s_cm}</td>
                      <td className="py-2 px-3 font-mono">{row.alpha_deg}°</td>
                      <td className="py-2 px-3 font-mono font-bold text-amber-600">{row.d_cm}</td>
                      <td className="py-2 px-3 font-mono text-indigo-700">
                        {showEnergyValues.potentialEnergy ? (
                          row.WM_mJ
                        ) : (
                          <button
                            onClick={() => toggleEnergyValue("potentialEnergy")}
                            className="text-amber-700 font-semibold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 hover:bg-amber-100 transition"
                            title="Bật công tắc để xem"
                          >
                            [🔒 Ẩn]
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-indigo-700">
                        {showEnergyValues.potentialEnergy ? (
                          row.WN_mJ
                        ) : (
                          <button
                            onClick={() => toggleEnergyValue("potentialEnergy")}
                            className="text-amber-700 font-semibold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 hover:bg-amber-100 transition"
                            title="Bật công tắc để xem"
                          >
                            [🔒 Ẩn]
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-amber-700 font-bold">
                        {showEnergyValues.deltaWt ? (
                          row.deltaWt_mJ
                        ) : (
                          <button
                            onClick={() => toggleEnergyValue("deltaWt")}
                            className="text-amber-700 font-semibold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 hover:bg-amber-100 transition"
                            title="Bật công tắc để xem"
                          >
                            [🔒 Ẩn]
                          </button>
                        )}
                      </td>
                      <td className={`py-2 px-3 font-mono font-bold ${row.A_mJ >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                        {showEnergyValues.work ? (
                          row.A_mJ > 0 ? `+${row.A_mJ}` : row.A_mJ
                        ) : (
                          <button
                            onClick={() => toggleEnergyValue("work")}
                            className="text-amber-700 font-semibold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 hover:bg-amber-100 transition"
                            title="Bật công tắc để xem"
                          >
                            [🔒 Ẩn]
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-600 italic">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Theoretical Summary Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-600" />
              Kết luận Rút ra từ Bảng Số liệu Khảo sát:
            </span>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
              <li>
                <strong>Quan hệ với điện lượng <MathText math="q" inline={true} />:</strong> Công <MathText math="A" inline={true} /> và thế năng <MathText math="W_t" inline={true} /> tỉ lệ thuận với điện tích <MathText math="q" inline={true} />. Khi đổi dấu điện tích từ dương sang âm, dấu của công và thế năng bị đổi dấu ngược lại.
              </li>
              <li>
                <strong>Quan hệ với cường độ điện trường <MathText math="E" inline={true} />:</strong> Khi tăng cường độ điện trường <MathText math="E" inline={true} /> lên bao nhiêu lần thì lực điện <MathText math="F = qE" inline={true} /> và công của lực điện <MathText math="A = qEd" inline={true} /> tăng lên bấy nhiêu lần.
              </li>
              <li>
                <strong>Quan hệ với quãng đường <MathText math="s" inline={true} /> và hình chiếu <MathText math="d" inline={true} />:</strong> Công của lực điện chỉ phụ thuộc vào hình chiếu <MathText math="d = s\cdot\cos\alpha" inline={true} /> lên phương của đường sức điện. Khi điện tích dịch chuyển vuông góc với đường sức (<MathText math="\alpha = 90^\circ, d = 0" inline={true} />), công của lực điện luôn bằng 0 và thế năng không đổi!
              </li>
              <li>
                <strong>Tính chất lực thế:</strong> Công <MathText math="A_{MN}" inline={true} /> khi đi theo đường thẳng trực tiếp đúng bằng công khi đi theo đường gấp khúc <MathText math="M \to C \to N" inline={true} /> hay bất kì đường cong nào. Lực điện trường trong điện trường đều là một trường lực thế.
              </li>
              <li>
                <strong>Định lí thế năng:</strong> Độ giảm thế năng điện <MathText math="W_{tM} - W_{tN}" inline={true} /> luôn bằng công của lực điện trường <MathText math="A_{MN}" inline={true} />.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 4. Classroom Quiz & Inquiry Questions Tab (Tab "quiz") */}
      {activeTab === "quiz" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Hệ thống Câu hỏi Phát vấn & Thảo luận Nhóm trên Lớp (Chuẩn CV 5512)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Dành cho giáo viên tổ chức hoạt động hình thành kiến thức và học sinh thảo luận
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Question 1 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">
                ❓ Câu hỏi 1: Lực điện sinh công phát động (A &gt; 0) hay công cản (A &lt; 0) khi nào?
              </span>
              <p className="text-slate-600 leading-relaxed">
                Khi thả điện tích dương <MathText math="q > 0" inline={true} /> tự do trong điện trường đều, lực điện trường kéo điện tích chuyển động cùng chiều với đường sức điện (<MathText math="d > 0 \implies A > 0" inline={true} />). Thế năng điện giảm dần. Ngược lại, nếu ngoại lực cưỡng bức đưa điện tích dương lại gần bản tích điện dương (<MathText math="d < 0" inline={true} />), lực điện sinh công âm (<MathText math="A < 0" inline={true} />), thế năng tăng lên.
              </p>
            </div>

            {/* Question 2 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">
                ❓ Câu hỏi 2: Khi thay đổi điện tích thử q hoặc cường độ E, công A thay đổi thế nào?
              </span>
              <p className="text-slate-600 leading-relaxed">
                Công của lực điện trường <MathText math="A = q \cdot E \cdot d" inline={true} /> tỉ lệ thuận với cả điện lượng <MathText math="q" inline={true} /> và cường độ điện trường <MathText math="E" inline={true} />. Khi tăng <MathText math="q" inline={true} /> hoặc <MathText math="E" inline={true} /> lên k lần thì công cũng tăng k lần. Với điện tích âm (<MathText math="q < 0" inline={true} />), lực điện ngược chiều <MathText math="\vec{E}" inline={true} /> nên chuyển động cùng chiều đường sức sẽ sinh công âm (<MathText math="A < 0" inline={true} />).
              </p>
            </div>

            {/* Question 3 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">
                ❓ Câu hỏi 3: Tại sao công của lực điện không phụ thuộc hình dạng đường đi?
              </span>
              <p className="text-slate-600 leading-relaxed">
                Vì bất kì đường cong ngoằn ngoèo nào cũng có thể phân tích thành các đoạn vi phân song song và vuông góc với đường sức. Các đoạn vuông góc có <MathText math="d_i = 0 \implies A_i = 0" inline={true} />. Tổng các đoạn song song luôn bằng hình chiếu khoảng cách giữa điểm đầu và điểm cuối <MathText math="d = x_M - x_N" inline={true} />. Do đó lực điện trường là lực thế.
              </p>
            </div>

            {/* Question 4 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">
                ❓ Câu hỏi 4: So sánh sự dịch chuyển dọc (Bản trên - Bản dưới) với sự rơi tự do trong trọng trường?
              </span>
              <p className="text-slate-600 leading-relaxed">
                Khi bố trí 2 bản dọc (bản dương ở trên, bản âm ở dưới), điện trường đều <MathText math="\vec{E}" inline={true} /> hướng thẳng đứng từ trên xuống dưới, tương tự như gia tốc trọng trường <MathText math="\vec{g}" inline={true} /> của Trái Đất. Hạt mang điện tích dương <MathText math="+q" inline={true} /> rơi từ trên xuống dưới chịu lực điện <MathText math="F = qE" inline={true} /> sinh công <MathText math="A = qEd" inline={true} />, làm thế năng điện giảm từ <MathText math="W_{tM}" inline={true} /> xuống <MathText math="W_{tN}" inline={true} />, tương ứng hoàn toàn với trọng lực <MathText math="P = mg" inline={true} /> làm giảm thế năng trọng trường <MathText math="W_t = mgh" inline={true} />!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
  RefreshCw,
  Compass,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  Check,
  ToggleLeft,
  ToggleRight,
  Lightbulb,
} from "lucide-react";
import { MathText } from "../MathText";

interface DataRecord {
  id: number;
  trialName: string;
  B_T: number;
  S_cm2: number;
  S_m2: number;
  alpha_deg: number;
  cos_alpha: number;
  N_turns: number;
  Phi_single_Wb: number;
  Phi_total_Wb: number;
  linesCount: number;
  note: string;
}

export const MagneticFluxSimulation: React.FC = () => {
  // ================= 1. THÔNG SỐ VẬT LÍ CỦA TỪ THÔNG =================
  // Cảm ứng từ B (Tesla): 0.05 T -> 2.0 T (mặc định 0.5 T)
  const [magneticFieldB, setMagneticFieldB] = useState<number>(0.5);

  // Diện tích khung dây S (cm²): 20 cm² -> 300 cm² (mặc định 100 cm²)
  const [areaCm2, setAreaCm2] = useState<number>(100);

  // Góc alpha = (vectơ n, vectơ B): từ 0° đến 360° (mặc định 0°)
  const [angleAlphaDeg, setAngleAlphaDeg] = useState<number>(0);

  // Số vòng dây N của cuộn dây: 1, 10, 50, 100 (mặc định 1 vòng)
  const [turnsN, setTurnsN] = useState<number>(1);

  // ================= 2. ĐỘNG CƠ QUAY KHUNG (AUTO-ROTATION) =================
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [rotationSpeedRpm, setRotationSpeedRpm] = useState<number>(15); // Vòng/phút

  // ================= 3. CÔNG TẮC ẨN / HIỆN SỐ LIỆU (SƯ PHẠM CV 5512) =================
  // Cho phép giáo viên ẩn số liệu để học sinh tự tính toán từ thông theo công thức:
  // Phi = B * S * cos(alpha) trước khi bật công tắc kiểm tra
  const [showValues, setShowValues] = useState<{
    cosAlpha: boolean;
    convertedArea: boolean;
    fluxSingle: boolean;
    fluxTotal: boolean;
    linesCount: boolean;
  }>({
    cosAlpha: false,
    convertedArea: false,
    fluxSingle: false,
    fluxTotal: false,
    linesCount: true,
  });

  const isAllValuesVisible =
    showValues.cosAlpha &&
    showValues.convertedArea &&
    showValues.fluxSingle &&
    showValues.fluxTotal;

  const toggleAllValues = () => {
    const next = !isAllValuesVisible;
    setShowValues({
      cosAlpha: next,
      convertedArea: next,
      fluxSingle: next,
      fluxTotal: next,
      linesCount: true,
    });
  };

  // ================= 4. Ô HỌC SINH TỰ TÍNH & KIỂM TRA ĐÁP SỐ =================
  const [studentInputFlux, setStudentInputFlux] = useState<string>("");
  const [studentInputUnit, setStudentInputUnit] = useState<"mWb" | "Wb">("mWb");
  const [checkResult, setCheckResult] = useState<{
    status: "idle" | "correct" | "incorrect" | "unit_error";
    message: string;
  }>({ status: "idle", message: "" });

  // ================= 5. TAB ĐIỀU HƯỚNG BÀI HỌC =================
  const [activeTab, setActiveTab] = useState<
    "lab" | "induction_demo" | "data_table" | "worksheets" | "quiz"
  >("lab");

  // Bảng lưu số liệu thực nghiệm
  const [recordedData, setRecordedData] = useState<DataRecord[]>([]);

  // ================= 6. THÍ NGHIỆM BIẾN THIÊN TỪ THÔNG (TAB INDUCTION) =================
  const [inductionMode, setInductionMode] = useState<"magnet" | "stretch" | "rotate">("magnet");
  const [magnetPosition, setMagnetPosition] = useState<number>(0); // -100 đến +100
  const [magnetVelocity, setMagnetVelocity] = useState<number>(0);
  const [inducedCurrent, setInducedCurrent] = useState<number>(0);
  const [isDraggingMagnet, setIsDraggingMagnet] = useState<boolean>(false);
  const magnetDragLastX = useRef<number>(0);
  const magnetDragLastTime = useRef<number>(0);

  // Khung dây co giãn (stretching)
  const [stretchScale, setStretchScale] = useState<number>(1.0); // 0.4 -> 1.6
  const [stretchVelocity, setStretchVelocity] = useState<number>(0);

  // ================= 7. TÍNH TOÁN VẬT LÍ CHÍNH XÁC =================
  // Đổi đơn vị diện tích: 1 m² = 10 000 cm² => S (m²) = S (cm²) * 1e-4
  const areaM2 = useMemo(() => areaCm2 * 1e-4, [areaCm2]);

  // Góc alpha tính ra radian
  const angleRad = useMemo(() => (angleAlphaDeg * Math.PI) / 180, [angleAlphaDeg]);

  // Giá trị cos(alpha)
  const cosAlpha = useMemo(() => {
    // Làm tròn số học chính xác các góc đặc biệt
    const mod360 = ((angleAlphaDeg % 360) + 360) % 360;
    if (mod360 === 90 || mod360 === 270) return 0;
    if (mod360 === 0) return 1;
    if (mod360 === 180) return -1;
    if (mod360 === 60 || mod360 === 300) return 0.5;
    if (mod360 === 120 || mod360 === 240) return -0.5;
    return Math.cos(angleRad);
  }, [angleAlphaDeg, angleRad]);

  // Từ thông qua 1 vòng: Phi = B * S * cos(alpha) (Wb)
  const fluxSingleWb = useMemo(() => {
    const val = magneticFieldB * areaM2 * cosAlpha;
    // Tránh sai số dấu phẩy động dạng -0
    return Math.abs(val) < 1e-12 ? 0 : val;
  }, [magneticFieldB, areaM2, cosAlpha]);

  const fluxSingleMWb = useMemo(() => fluxSingleWb * 1000, [fluxSingleWb]);

  // Từ thông qua cuộn N vòng: Phi_N = N * B * S * cos(alpha) (Wb)
  const fluxTotalWb = useMemo(() => fluxSingleWb * turnsN, [fluxSingleWb, turnsN]);
  const fluxTotalMWb = useMemo(() => fluxTotalWb * 1000, [fluxTotalWb]);

  // Số đường sức từ tượng trưng xuyên qua diện tích S
  // Mật độ đường sức tỉ lệ với B, diện tích tỉ lệ với S, góc chiếu |cos(alpha)|
  const effectiveLinesCount = useMemo(() => {
    const raw = Math.round(18 * (magneticFieldB / 1.0) * (areaCm2 / 100) * Math.abs(cosAlpha));
    return Math.max(0, raw);
  }, [magneticFieldB, areaCm2, cosAlpha]);

  // Dấu và trạng thái từ thông
  const fluxStatus = useMemo(() => {
    const mod360 = ((angleAlphaDeg % 360) + 360) % 360;
    if (mod360 === 0) {
      return {
        label: "Cực đại dương (Φ = +B·S)",
        desc: "Mặt phẳng khung vuông góc với đường sức từ, vectơ pháp tuyến cùng chiều với vectơ B.",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      };
    }
    if (mod360 === 90 || mod360 === 270) {
      return {
        label: "Từ thông triệt tiêu (Φ = 0)",
        desc: "Mặt phẳng khung song song với đường sức từ, không có đường sức nào đâm xuyên qua diện tích khung.",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      };
    }
    if (mod360 === 180) {
      return {
        label: "Cực tiểu âm (Φ = -B·S)",
        desc: "Mặt phẳng khung vuông góc với đường sức từ, vectơ pháp tuyến ngược chiều với vectơ B.",
        badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      };
    }
    if (cosAlpha > 0) {
      return {
        label: "Từ thông dương (Φ > 0)",
        desc: `Góc nhọn (α = ${Math.round(mod360)}° < 90°), cos(α) > 0, các đường sức đi xuyên theo chiều dương của pháp tuyến.`,
        badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      };
    }
    return {
      label: "Từ thông âm (Φ < 0)",
      desc: `Góc tù (90° < α = ${Math.round(mod360)}° < 270°), cos(α) < 0, các đường sức đi xuyên ngược chiều dương của pháp tuyến.`,
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    };
  }, [angleAlphaDeg, cosAlpha]);

  // ================= 8. HOẠT HỌA QUAY MOTOR =================
  useEffect(() => {
    if (!isRotating) return;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      // Tốc độ góc d(alpha)/dt = 360 * (RPM / 60)
      const deltaDeg = (rotationSpeedRpm / 60) * 360 * dt;
      setAngleAlphaDeg((prev) => (prev + deltaDeg) % 360);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRotating, rotationSpeedRpm]);

  // ================= 9. GIẢI PHÁP KIỂM TRA ĐÁP SỐ HỌC SINH =================
  const handleCheckStudentAnswer = () => {
    const entered = parseFloat(studentInputFlux.replace(",", "."));
    if (isNaN(entered)) {
      setCheckResult({
        status: "incorrect",
        message: "Vui lòng nhập một số hợp lệ trước khi bấm kiểm tra!",
      });
      return;
    }

    // Giá trị chuẩn theo đơn vị học sinh chọn
    const expected = studentInputUnit === "mWb" ? fluxSingleMWb : fluxSingleWb;
    const tolerance = Math.max(0.05 * Math.abs(expected), 0.05);

    // Kiểm tra nhầm lẫn phổ biến: quên đổi cm² ra m² (sai lệch 10 000 lần)
    const withoutUnitConversion =
      studentInputUnit === "Wb"
        ? magneticFieldB * areaCm2 * cosAlpha
        : (magneticFieldB * areaCm2 * cosAlpha) * 1000;

    if (Math.abs(entered - withoutUnitConversion) <= Math.abs(withoutUnitConversion * 0.1) && Math.abs(entered) > 0.1) {
      setCheckResult({
        status: "unit_error",
        message: `⚠️ Em đã quên đổi đơn vị diện tích! Chú ý: 1 m² = 10 000 cm², do đó S = ${areaCm2} cm² = ${areaCm2} × 10⁻⁴ m² = ${areaM2} m². Hãy nhân thêm 10⁻⁴ nhé!`,
      });
      return;
    }

    if (Math.abs(entered - expected) <= tolerance) {
      setCheckResult({
        status: "correct",
        message: `🎉 Xuất sắc! Kết quả tính hoàn toàn chính xác: Φ = B · S · cos(α) = ${magneticFieldB} T × ${areaM2} m² × ${cosAlpha.toFixed(
          3
        )} = ${expected.toFixed(3)} ${studentInputUnit}.`,
      });
    } else {
      setCheckResult({
        status: "incorrect",
        message: `Chưa chính xác. Gợi ý: Hãy kiểm tra lại góc α = ${angleAlphaDeg}°, cos(${angleAlphaDeg}°) = ${cosAlpha.toFixed(
          3
        )}, S = ${areaM2} m², B = ${magneticFieldB} T.`,
      });
    }
  };

  // ================= 10. GHI DỮ LIỆU ĐO =================
  const handleRecordData = () => {
    const newRecord: DataRecord = {
      id: Date.now(),
      trialName: `Lần ${recordedData.length + 1}`,
      B_T: magneticFieldB,
      S_cm2: areaCm2,
      S_m2: areaM2,
      alpha_deg: Math.round(angleAlphaDeg),
      cos_alpha: parseFloat(cosAlpha.toFixed(4)),
      N_turns: turnsN,
      Phi_single_Wb: parseFloat(fluxSingleWb.toFixed(6)),
      Phi_total_Wb: parseFloat(fluxTotalWb.toFixed(6)),
      linesCount: effectiveLinesCount,
      note: fluxStatus.label,
    };
    setRecordedData((prev) => [newRecord, ...prev]);
  };

  const handleExportCSV = () => {
    if (recordedData.length === 0) return;
    const headers = [
      "Lần đo",
      "Cảm ứng từ B (T)",
      "Diện tích S (cm2)",
      "Diện tích S (m2)",
      "Góc alpha (độ)",
      "cos(alpha)",
      "Số vòng N",
      "Từ thông 1 vòng (Wb)",
      "Từ thông tổng (Wb)",
      "Số đường sức",
      "Ghi chú",
    ];
    const rows = recordedData.map((r) => [
      r.trialName,
      r.B_T,
      r.S_cm2,
      r.S_m2,
      r.alpha_deg,
      r.cos_alpha,
      r.N_turns,
      r.Phi_single_Wb,
      r.Phi_total_Wb,
      r.linesCount,
      `"${r.note}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bang_so_lieu_tu_thong_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= 11. HỆ THỐNG CÂU HỎI TRẮC NGHIỆM ĐÁNH GIÁ NĂNG LỰC =================
  const quizQuestions = [
    {
      id: 1,
      question:
        "Một khung dây phẳng có diện tích S đặt trong từ trường đều có cảm ứng từ B. Góc giữa vectơ cảm ứng từ B và vectơ pháp tuyến n của mặt phẳng khung dây là α. Từ thông qua diện tích S được xác định bởi công thức nào sau đây?",
      options: [
        "A. Φ = B · S · sin(α)",
        "B. Φ = B · S · cos(α)",
        "C. Φ = (B · S) / cos(α)",
        "D. Φ = B · S · tan(α)",
      ],
      correctIndex: 1,
      explanation:
        "Theo định nghĩa, từ thông qua diện tích S đặt trong từ trường đều B là đại lượng đại số: Φ = B·S·cos(α), trong đó α là góc giữa vectơ pháp tuyến n và vectơ cảm ứng từ B.",
    },
    {
      id: 2,
      question:
        "Khi mặt phẳng khung dây đặt song song với các đường sức từ thì từ thông qua khung dây bằng bao nhiêu?",
      options: [
        "A. Đạt giá trị cực đại Φ = B·S",
        "B. Bằng một nửa giá trị cực đại Φ = 0,5·B·S",
        "C. Bằng 0 (triệt tiêu)",
        "D. Đạt giá trị cực tiểu âm Φ = -B·S",
      ],
      correctIndex: 2,
      explanation:
        "Khi mặt phẳng khung song song với đường sức từ thì vectơ pháp tuyến n vuông góc với vectơ B (α = 90°). Do cos(90°) = 0 nên từ thông Φ = B·S·cos(90°) = 0. Về mặt trực quan: không có đường sức nào đâm xuyên qua diện tích khung dây.",
    },
    {
      id: 3,
      question:
        "Đơn vị đo của từ thông trong Hệ đơn vị đo lường quốc tế (SI) là gì?",
      options: [
        "A. Tesla (T)",
        "B. Vôn trên mét (V/m)",
        "C. Weber (Wb)",
        "D. Henri (H)",
      ],
      correctIndex: 2,
      explanation:
        "Đơn vị của từ thông trong hệ SI là Vê-be (Weber, kí hiệu là Wb). 1 Wb = 1 T · 1 m² = 1 V · s.",
    },
    {
      id: 4,
      question:
        "Để làm xuất hiện dòng điện cảm ứng trong một khung dây dẫn kín, điều kiện cần và đủ là gì?",
      options: [
        "A. Khung dây phải được đặt trong một từ trường cực kì mạnh.",
        "B. Từ thông qua mạch kín đó phải biến thiên theo thời gian (ΔΦ ≠ 0).",
        "C. Khung dây phải luôn luôn đứng yên đối diện cực Bắc của nam châm.",
        "D. Khung dây phải có điện trở thật lớn.",
      ],
      correctIndex: 1,
      explanation:
        "Định luật Fa-ra-đây về cảm ứng điện từ khẳng định: Hiện tượng cảm ứng điện từ chỉ xảy ra khi có sự biến thiên từ thông qua mạch kín theo thời gian (ΔΦ ≠ 0). Cường độ dòng điện cảm ứng tỉ lệ thuận với tốc độ biến thiên từ thông.",
    },
    {
      id: 5,
      question:
        "Một cuộn dây gồm N = 100 vòng, mỗi vòng có diện tích S = 20 cm² đặt trong từ trường đều B = 0,2 T sao cho vectơ pháp tuyến n cùng chiều với vectơ B. Tổng từ thông qua cuộn dây là bao nhiêu?",
      options: [
        "A. 0,04 Wb",
        "B. 40 Wb",
        "C. 0,4 Wb",
        "D. 400 Wb",
      ],
      correctIndex: 0,
      explanation:
        "Đổi S = 20 cm² = 20 × 10⁻⁴ m² = 0,002 m². Vì n cùng chiều B nên α = 0° => cos(0°) = 1. Tổng từ thông qua cuộn dây là: Φ_tổng = N · B · S · cos(α) = 100 × 0,2 × 0,002 × 1 = 0,04 Wb.",
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  // ================= 12. TÍNH TOÁN TỌA ĐỘ CANVAS 3D PERSPECTIVE =================
  // Vẽ khung dây elip 3D nghiêng theo góc alpha
  // Khi alpha = 0: khung nhìn thẳng diện tích cực đại (S chiếu = S)
  // Khi alpha = 90: khung nhìn mép nghiêng thành một đoạn thẳng (S chiếu = 0)
  // Khi alpha = 180: khung lật ngược mặt sau
  const canvasW = 620;
  const canvasH = 360;
  const centerX = canvasW / 2;
  const centerY = canvasH / 2;

  // Bán kính hiển thị của khung dây trên canvas
  const loopRadiusX = 130 * Math.sqrt(areaCm2 / 100);
  // Bán kính dọc thay đổi theo góc quay alpha để tạo chiều sâu 3D perspective
  // Khi alpha = 0: nhìn nghiêng một góc 30° phối cảnh để thấy rõ mặt trong
  // Bán kính trục phụ phụ thuộc vào cos(alpha)
  const perspectiveTilt = 0.55; // Độ nghiêng phối cảnh tĩnh
  const loopRadiusY = loopRadiusX * perspectiveTilt * Math.abs(cosAlpha);

  // Điểm đầu và điểm cuối của vectơ pháp tuyến n
  // Vectơ n vuông góc với mặt phẳng khung dây
  // Góc hiển thị của n trong hệ tọa độ canvas (hướng theo chiều quay alpha)
  const normVectorLen = 95;
  // Chiều của vectơ n trên màn hình:
  // Khi alpha = 0: n hướng sang phải (cùng chiều B)
  // Khi alpha = 90: n hướng lên trên
  // Khi alpha = 180: n hướng sang trái (ngược chiều B)
  const normEndX = centerX + normVectorLen * Math.cos(angleRad);
  const normEndY = centerY - normVectorLen * Math.sin(angleRad);

  // Vectơ B: dòng chảy các mũi tên song song từ trái sang phải
  // Khoảng cách giữa các đường sức phụ thuộc vào B
  const lineSpacing = Math.max(20, Math.round(55 / Math.sqrt(magneticFieldB / 0.5)));
  const numGridLines = 9;

  return (
    <div
      id="magnetic-flux-sim-container"
      className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden font-sans select-none"
    >
      {/* 1. Header Toolbar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Mô phỏng Khảo sát Từ thông & Cảm ứng điện từ
              </h2>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-sky-500/30">
                Vật lí 11 • CT 2018
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Công thức định lượng: <span className="text-amber-300 font-mono font-bold">Φ = B · S · cos(α)</span> • Trực quan hóa số đường sức từ xuyên qua khung dây
            </p>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("lab")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "lab"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Thí nghiệm Từ thông</span>
          </button>
          <button
            onClick={() => setActiveTab("induction_demo")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "induction_demo"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Hiện tượng Cảm ứng (ΔΦ)</span>
          </button>
          <button
            onClick={() => setActiveTab("data_table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "data_table"
                ? "bg-sky-600 text-white shadow-sm"
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
                ? "bg-sky-600 text-white shadow-sm"
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
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Luyện tập & Đánh giá</span>
          </button>
        </div>
      </div>

      {/* ======================= TAB 1: THÍ NGHIỆM TỪ THÔNG 3D ======================= */}
      {activeTab === "lab" && (
        <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Visual Canvas (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* 3D Perspective Graphic Box */}
            <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-3 overflow-hidden shadow-inner flex flex-col items-center">
              {/* Dynamic Status Tag */}
              <div className="w-full flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${fluxStatus.badgeColor}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    {fluxStatus.label}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    α = <strong className="text-amber-400">{Math.round(angleAlphaDeg)}°</strong>
                  </span>
                </div>

                {/* Motor Auto-rotation Control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRotating(!isRotating)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      isRotating
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                    }`}
                  >
                    {isRotating ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Dừng quay khung
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Tự động quay khung (Motor)
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setMagneticFieldB(0.5);
                      setAreaCm2(100);
                      setAngleAlphaDeg(0);
                      setIsRotating(false);
                      setTurnsN(1);
                    }}
                    className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Đặt lại thông số mặc định"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* SVG 3D Canvas */}
              <div className="w-full relative flex justify-center items-center">
                <svg
                  viewBox={`0 0 ${canvasW} ${canvasH}`}
                  className="w-full max-h-[350px] object-contain drop-shadow-xl"
                >
                  <defs>
                    {/* Marker arrow for Magnetic Field B */}
                    <marker
                      id="arrow-b"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                    </marker>

                    {/* Marker arrow for Normal Vector n */}
                    <marker
                      id="arrow-n"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="7"
                      markerHeight="7"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                    </marker>

                    {/* Gradient for Piercing Field Lines */}
                    <linearGradient id="piercingLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                      <stop offset="40%" stopColor="#fbbf24" stopOpacity="1" />
                      <stop offset="60%" stopColor="#fbbf24" stopOpacity="1" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                    </linearGradient>

                    {/* Copper Wire Coil pattern */}
                    <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fdba74" />
                      <stop offset="50%" stopColor="#c2410c" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>

                    {/* Area shading gradient */}
                    <radialGradient id="areaGlow" cx="50%" cy="50%" r="50%">
                      <stop
                        offset="0%"
                        stopColor={cosAlpha >= 0 ? "#38bdf8" : "#818cf8"}
                        stopOpacity="0.35"
                      />
                      <stop
                        offset="100%"
                        stopColor={cosAlpha >= 0 ? "#0284c7" : "#4338ca"}
                        stopOpacity="0.1"
                      />
                    </radialGradient>
                  </defs>

                  {/* 1. Grid of Magnetic Field Lines (Vectors B running left to right) */}
                  {Array.from({ length: numGridLines }).map((_, i) => {
                    const y = 35 + i * (canvasH - 70) / (numGridLines - 1);
                    const isInsideVertical =
                      y >= centerY - loopRadiusX * 0.9 && y <= centerY + loopRadiusX * 0.9;
                    const doesPierce =
                      isInsideVertical && Math.abs(cosAlpha) > 0.08 && effectiveLinesCount > 0;

                    return (
                      <g key={`b-line-${i}`}>
                        {/* Background faint line */}
                        <line
                          x1="30"
                          y1={y}
                          x2={canvasW - 35}
                          y2={y}
                          stroke={doesPierce ? "url(#piercingLineGrad)" : "#1e293b"}
                          strokeWidth={doesPierce ? 2.5 : 1.2}
                          strokeDasharray={doesPierce ? "none" : "4 4"}
                          markerEnd="url(#arrow-b)"
                        />
                        {/* Piercing sparkles on lines penetrating the loop */}
                        {doesPierce && (
                          <circle
                            cx={centerX}
                            cy={y}
                            r={3}
                            fill="#fde047"
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* B Vector Label */}
                  <g transform={`translate(${canvasW - 55}, 30)`}>
                    <text
                      x="0"
                      y="0"
                      fill="#38bdf8"
                      fontSize="14"
                      fontWeight="bold"
                      className="font-mono"
                    >
                      B →
                    </text>
                    <text x="0" y="14" fill="#94a3b8" fontSize="10">
                      {magneticFieldB} T
                    </text>
                  </g>

                  {/* 2. Shaded Loop Surface Area S (3D Ellipse perspective) */}
                  {loopRadiusY > 1 && (
                    <ellipse
                      cx={centerX}
                      cy={centerY}
                      rx={loopRadiusX}
                      ry={loopRadiusY}
                      fill="url(#areaGlow)"
                      stroke="url(#copperGrad)"
                      strokeWidth={turnsN > 1 ? 5 : 3.5}
                      transform={`rotate(0 ${centerX} ${centerY})`}
                      className="transition-all duration-75"
                    />
                  )}

                  {/* When alpha = 90° or 270°: Loop is perfectly parallel to field lines */}
                  {loopRadiusY <= 1 && (
                    <line
                      x1={centerX - loopRadiusX}
                      y1={centerY}
                      x2={centerX + loopRadiusX}
                      y2={centerY}
                      stroke="#f97316"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Copper turns visual badge if N > 1 */}
                  {turnsN > 1 && (
                    <text
                      x={centerX - loopRadiusX - 15}
                      y={centerY - 10}
                      fill="#fdba74"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {turnsN} vòng
                    </text>
                  )}

                  {/* Center origin dot */}
                  <circle cx={centerX} cy={centerY} r="4" fill="#f59e0b" />

                  {/* 3. Reference axis (Horizontal axis parallel to B) */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + 115}
                    y2={centerY}
                    stroke="#64748b"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={centerX + 118}
                    y={centerY + 4}
                    fill="#64748b"
                    fontSize="10"
                    fontStyle="italic"
                  >
                    Phương B
                  </text>

                  {/* 4. Normal Vector n (Vectơ pháp tuyến) */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={normEndX}
                    y2={normEndY}
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    markerEnd="url(#arrow-n)"
                  />
                  {/* Normal vector label */}
                  <text
                    x={normEndX + 8}
                    y={normEndY + 4}
                    fill="#f59e0b"
                    fontSize="13"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    n →
                  </text>

                  {/* 5. Angle Arc for alpha = (n, B) */}
                  {Math.abs(angleAlphaDeg % 360) > 4 && (
                    <path
                      d={`M ${centerX + 35} ${centerY} A 35 35 0 ${
                        (angleAlphaDeg % 360) > 180 ? 1 : 0
                      } 0 ${centerX + 35 * Math.cos(angleRad)} ${
                        centerY - 35 * Math.sin(angleRad)
                      }`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                      strokeDasharray="2 2"
                    />
                  )}
                  {/* Angle label text */}
                  <text
                    x={centerX + 48 * Math.cos(angleRad / 2)}
                    y={centerY - 48 * Math.sin(angleRad / 2)}
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    α = {Math.round(angleAlphaDeg)}°
                  </text>

                  {/* 6. Real-time counter of piercing lines inside loop */}
                  <g transform={`translate(${centerX - 70}, ${canvasH - 25})`}>
                    <rect
                      x="0"
                      y="0"
                      width="140"
                      height="22"
                      rx="11"
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text
                      x="70"
                      y="15"
                      fill="#38bdf8"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {showValues.linesCount
                        ? `Số đường sức đâm qua: ~${effectiveLinesCount}`
                        : "Số đường sức đâm qua: ???"}
                    </text>
                  </g>
                </svg>
              </div>

              {/* Brief physical meaning footer below canvas */}
              <div className="w-full bg-slate-900/90 rounded-xl p-2.5 mt-2 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Bản chất vật lí của Từ thông Φ:</p>
                  <p className="text-slate-400 mt-0.5">
                    {fluxStatus.desc} Mật độ đường sức từ đặc trưng cho <span className="text-sky-300 font-medium">B</span>, diện tích <span className="text-orange-300 font-medium">S</span> hứng chùm đường sức, và góc nghiêng <span className="text-amber-300 font-medium">α</span> quyết định hình chiếu đón đường sức.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Cosine Graph Phi(alpha) */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  Đồ thị Từ thông biến thiên theo góc quay: Φ(α) = Φ₀ · cos(α)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Φ₀ = B·S = {(magneticFieldB * areaM2 * 1000).toFixed(2)} mWb
                </span>
              </div>

              <div className="w-full h-24 relative bg-slate-900/90 rounded-lg p-1 overflow-hidden border border-slate-800/80">
                <svg viewBox="0 0 500 80" className="w-full h-full">
                  {/* Zero axis */}
                  <line x1="20" y1="40" x2="480" y2="40" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="5" y="44" fill="#94a3b8" fontSize="9">0</text>

                  {/* Vertical markers at 0, 90, 180, 270, 360 */}
                  <line x1="20" y1="10" x2="20" y2="70" stroke="#334155" strokeWidth="0.8" />
                  <text x="20" y="76" fill="#64748b" fontSize="8" textAnchor="middle">0°</text>

                  <line x1="135" y1="10" x2="135" y2="70" stroke="#334155" strokeWidth="0.8" />
                  <text x="135" y="76" fill="#64748b" fontSize="8" textAnchor="middle">90°</text>

                  <line x1="250" y1="10" x2="250" y2="70" stroke="#334155" strokeWidth="0.8" />
                  <text x="250" y="76" fill="#64748b" fontSize="8" textAnchor="middle">180°</text>

                  <line x1="365" y1="10" x2="365" y2="70" stroke="#334155" strokeWidth="0.8" />
                  <text x="365" y="76" fill="#64748b" fontSize="8" textAnchor="middle">270°</text>

                  <line x1="480" y1="10" x2="480" y2="70" stroke="#334155" strokeWidth="0.8" />
                  <text x="480" y="76" fill="#64748b" fontSize="8" textAnchor="middle">360°</text>

                  {/* Continuous Cosine Wave: y = 40 - 30 * cos(x) */}
                  <path
                    d={(() => {
                      let p = "M 20 10";
                      for (let deg = 0; deg <= 360; deg += 4) {
                        const x = 20 + (deg / 360) * 460;
                        const y = 40 - 28 * Math.cos((deg * Math.PI) / 180);
                        p += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
                      }
                      return p;
                    })()}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />

                  {/* Current Active Tracking Dot */}
                  {(() => {
                    const normDeg = ((angleAlphaDeg % 360) + 360) % 360;
                    const dotX = 20 + (normDeg / 360) * 460;
                    const dotY = 40 - 28 * Math.cos((normDeg * Math.PI) / 180);
                    return (
                      <g>
                        <circle cx={dotX} cy={dotY} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                        <line x1={dotX} y1="10" x2={dotX} y2="70" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>

          {/* Controls & Pedagogical Calculation Panel (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* 1. Sliders & Parameters */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3.5 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  Điều khiển 3 Thông số (B, S, α)
                </span>
              </div>

              {/* Slider 1: Magnetic Field B */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    Cảm ứng từ <strong>B</strong>:
                  </span>
                  <span className="font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                    {magneticFieldB.toFixed(2)} T
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="2.00"
                  step="0.05"
                  value={magneticFieldB}
                  onChange={(e) => setMagneticFieldB(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.05 T (Yếu)</span>
                  <span>1.0 T (Chuẩn)</span>
                  <span>2.0 T (Rất mạnh)</span>
                </div>
              </div>

              {/* Slider 2: Area S */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    Diện tích khung <strong>S</strong>:
                  </span>
                  <span className="font-mono font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800/40">
                    {areaCm2} cm²
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={areaCm2}
                  onChange={(e) => setAreaCm2(parseInt(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>20 cm²</span>
                  <span>100 cm² (0.01 m²)</span>
                  <span>300 cm²</span>
                </div>
              </div>

              {/* Slider 3: Angle alpha */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    Góc quay <strong>α = (n, B)</strong>:
                  </span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    {Math.round(angleAlphaDeg)}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={angleAlphaDeg}
                  onChange={(e) => {
                    setIsRotating(false);
                    setAngleAlphaDeg(parseInt(e.target.value));
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />

                {/* Preset Angle Buttons (Pedagogical fast selections) */}
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {[
                    { label: "0° (Max)", deg: 0 },
                    { label: "45°", deg: 45 },
                    { label: "60°", deg: 60 },
                    { label: "90° (0)", deg: 90 },
                    { label: "120°", deg: 120 },
                    { label: "180° (-Max)", deg: 180 },
                    { label: "270° (0)", deg: 270 },
                    { label: "360°", deg: 360 },
                  ].map((preset) => (
                    <button
                      key={preset.deg}
                      onClick={() => {
                        setIsRotating(false);
                        setAngleAlphaDeg(preset.deg);
                      }}
                      className={`text-[10px] py-1 px-1 rounded font-medium transition-all ${
                        Math.round(angleAlphaDeg % 360) === (preset.deg % 360)
                          ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coil Turns N */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="text-slate-300 font-medium">Số vòng dây <strong>N</strong>:</span>
                <div className="flex items-center gap-1">
                  {[1, 10, 50, 100].map((n) => (
                    <button
                      key={n}
                      onClick={() => setTurnsN(n)}
                      className={`text-xs px-2 py-0.5 rounded font-mono font-medium transition-all ${
                        turnsN === n
                          ? "bg-indigo-600 text-white font-bold"
                          : "bg-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. CÔNG TẮC ẨN / HIỆN SỐ LIỆU ĐO (Theo yêu cầu người dùng) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    Công tắc Số liệu Sư phạm
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Bật công tắc nào thì số liệu tương ứng mới hiện ra
                  </p>
                </div>
                <button
                  onClick={toggleAllValues}
                  className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold transition-colors"
                >
                  {isAllValuesVisible ? "Ẩn tất cả" : "Hiện tất cả"}
                </button>
              </div>

              {/* Individual Toggle Switches */}
              <div className="flex flex-col gap-2">
                {/* Toggle 1: cos(alpha) */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-300 font-medium">Hệ số cos(α):</span>
                    <span className="block text-[10px] text-slate-500">cos({Math.round(angleAlphaDeg)}°)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300">
                      {showValues.cosAlpha ? cosAlpha.toFixed(4) : "???"}
                    </span>
                    <button
                      onClick={() =>
                        setShowValues((prev) => ({ ...prev, cosAlpha: !prev.cosAlpha }))
                      }
                      className="text-slate-400 hover:text-white"
                      title={showValues.cosAlpha ? "Ẩn số liệu" : "Hiện số liệu"}
                    >
                      {showValues.cosAlpha ? (
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Toggle 2: S converted to m2 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-300 font-medium">Quy đổi S (m²):</span>
                    <span className="block text-[10px] text-slate-500">S (cm²) × 10⁻⁴</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-orange-300">
                      {showValues.convertedArea ? `${areaM2} m²` : "??? m²"}
                    </span>
                    <button
                      onClick={() =>
                        setShowValues((prev) => ({ ...prev, convertedArea: !prev.convertedArea }))
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {showValues.convertedArea ? (
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Toggle 3: Từ thông 1 vòng Phi */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-300 font-medium">Từ thông qua 1 vòng:</span>
                    <span className="block text-[10px] text-slate-500">Φ = B · S · cos(α)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-300">
                      {showValues.fluxSingle
                        ? `${fluxSingleMWb.toFixed(3)} mWb`
                        : "??? mWb"}
                    </span>
                    <button
                      onClick={() =>
                        setShowValues((prev) => ({ ...prev, fluxSingle: !prev.fluxSingle }))
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {showValues.fluxSingle ? (
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Toggle 4: Tổng từ thông cuộn dây N vòng */}
                {turnsN > 1 && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-300 font-medium">Tổng từ thông {turnsN} vòng:</span>
                      <span className="block text-[10px] text-slate-500">Φ_tổng = N · Φ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300">
                        {showValues.fluxTotal
                          ? `${fluxTotalMWb.toFixed(3)} mWb`
                          : "??? mWb"}
                      </span>
                      <button
                        onClick={() =>
                          setShowValues((prev) => ({ ...prev, fluxTotal: !prev.fluxTotal }))
                        }
                        className="text-slate-400 hover:text-white"
                      >
                        {showValues.fluxTotal ? (
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Record trial button */}
              <button
                onClick={handleRecordData}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700/60 mt-1"
              >
                <Table className="w-3.5 h-3.5 text-sky-400" />
                Ghi lần đo này vào Bảng số liệu
              </button>
            </div>

            {/* 3. Ô HỌC SINH TỰ TÍNH TOÁN & THỬ THÁCH NHANH */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Nhiệm vụ Tự tính của Học sinh
              </span>
              <p className="text-[11px] text-slate-300">
                Cho <span className="text-sky-300 font-bold">B = {magneticFieldB} T</span>, <span className="text-orange-300 font-bold">S = {areaCm2} cm²</span>, <span className="text-amber-300 font-bold">α = {Math.round(angleAlphaDeg)}°</span>. Hãy tính từ thông <span className="text-emerald-300 font-bold">Φ</span> qua 1 vòng dây:
              </p>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Nhập giá trị..."
                  value={studentInputFlux}
                  onChange={(e) => {
                    setStudentInputFlux(e.target.value);
                    if (checkResult.status !== "idle") setCheckResult({ status: "idle", message: "" });
                  }}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <select
                  value={studentInputUnit}
                  onChange={(e) => setStudentInputUnit(e.target.value as "mWb" | "Wb")}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-indigo-300 focus:outline-none"
                >
                  <option value="mWb">mWb</option>
                  <option value="Wb">Wb</option>
                </select>
                <button
                  onClick={handleCheckStudentAnswer}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Kiểm tra
                </button>
              </div>

              {/* Feedback Alert */}
              {checkResult.status !== "idle" && (
                <div
                  className={`p-2.5 rounded-xl text-[11px] leading-relaxed border ${
                    checkResult.status === "correct"
                      ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                      : checkResult.status === "unit_error"
                      ? "bg-amber-950/60 border-amber-500/40 text-amber-200"
                      : "bg-rose-950/60 border-rose-500/40 text-rose-200"
                  }`}
                >
                  {checkResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: HIỆN TƯỢNG CẢM ỨNG ĐIỆN TỪ (FARADAY LAB) ======================= */}
      {activeTab === "induction_demo" && (
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          {/* Header Explanation */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Khám phá: 3 Con đường làm biến thiên từ thông (ΔΦ ≠ 0) tạo ra dòng điện cảm ứng
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Theo định luật Fa-ra-đây, suất điện động cảm ứng xuất hiện trong mạch kín tỉ lệ với tốc độ biến thiên từ thông:{" "}
              <span className="text-amber-300 font-mono font-bold">e_c = - ΔΦ / Δt</span>. Hãy thử nghiệm cả 3 cách sau:
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setInductionMode("magnet")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  inductionMode === "magnet"
                    ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Cách 1: Di chuyển Nam châm (Đổi B)</span>
              </button>
              <button
                onClick={() => setInductionMode("stretch")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  inductionMode === "stretch"
                    ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Cách 2: Biến dạng khung dây (Đổi S)</span>
              </button>
              <button
                onClick={() => setInductionMode("rotate")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  inductionMode === "rotate"
                    ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Cách 3: Quay khung dây trong từ trường (Đổi α)</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulation Area */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
            {/* CÁCH 1: DI CHUYỂN NAM CHÂM RA VÀO CUỘN DÂY */}
            {inductionMode === "magnet" && (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-300">
                    Kéo thanh trượt vị trí nam châm hoặc bấm các nút dịch chuyển để quan sát kim điện kế & bóng đèn LED
                  </p>
                  <p className="text-[11px] text-slate-500">
                    (Khi nam châm đứng yên, từ trường không biến thiên =&gt; ΔΦ = 0 =&gt; Không có dòng điện cảm ứng!)
                  </p>
                </div>

                {/* SVG Visual: Bar Magnet & Coil */}
                <div className="w-full max-w-xl h-56 bg-slate-900/80 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 540 200" className="w-full h-full">
                    {/* Galvanometer (Điện kế đo dòng cảm ứng) */}
                    <g transform="translate(420, 40)">
                      <circle cx="40" cy="40" r="35" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                      <text x="40" y="25" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                        G (Điện kế)
                      </text>
                      {/* Zero center marker */}
                      <line x1="40" y1="32" x2="40" y2="38" stroke="#cbd5e1" strokeWidth="1.5" />
                      {/* Needle: angle depends on inducedCurrent */}
                      <line
                        x1="40"
                        y1="40"
                        x2={40 + 26 * Math.sin((inducedCurrent * Math.PI) / 180)}
                        y2={40 - 26 * Math.cos((inducedCurrent * Math.PI) / 180)}
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="transition-all duration-150"
                      />
                      <circle cx="40" cy="40" r="3" fill="#cbd5e1" />
                    </g>

                    {/* LED Bulb */}
                    <g transform="translate(435, 135)">
                      <circle
                        cx="25"
                        cy="25"
                        r="14"
                        fill={Math.abs(inducedCurrent) > 5 ? "#fde047" : "#334155"}
                        stroke="#eab308"
                        strokeWidth="2"
                        className={Math.abs(inducedCurrent) > 5 ? "animate-pulse" : ""}
                      />
                      {Math.abs(inducedCurrent) > 5 && (
                        <circle cx="25" cy="25" r="24" fill="#facc15" opacity="0.3" className="animate-ping" />
                      )}
                      <text x="25" y="52" fill="#94a3b8" fontSize="9" textAnchor="middle">
                        LED {Math.abs(inducedCurrent) > 5 ? "SÁNG" : "TẮT"}
                      </text>
                    </g>

                    {/* Connecting Wires from Coil to Meter & LED */}
                    <path
                      d="M 330 80 C 370 80, 390 60, 420 60"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <path
                      d="M 330 120 C 370 120, 390 145, 435 145"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />

                    {/* Solenoid Coil (Cuộn dây dẫn) */}
                    <g transform="translate(230, 60)">
                      <rect x="0" y="0" width="100" height="80" rx="10" fill="#1e293b" opacity="0.4" />
                      {/* Copper loops */}
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <ellipse
                          key={idx}
                          cx={15 + idx * 14}
                          cy="40"
                          rx="8"
                          ry="35"
                          fill="none"
                          stroke="#ea580c"
                          strokeWidth="3.5"
                        />
                      ))}
                      <text x="50" y="96" fill="#cbd5e1" fontSize="10" textAnchor="middle" fontWeight="bold">
                        Cuộn dây kín
                      </text>
                    </g>

                    {/* Bar Magnet (Nam châm thanh N-S) */}
                    {/* Position x ranges from 30 to 180 based on magnetPosition (-100 -> +100) */}
                    {(() => {
                      const posX = 70 + (magnetPosition / 100) * 80;
                      return (
                        <g transform={`translate(${posX}, 75)`} className="transition-all duration-100">
                          {/* Pole S (Blue) */}
                          <rect x="0" y="0" width="45" height="50" rx="4" fill="#2563eb" />
                          <text x="22" y="32" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">
                            S
                          </text>
                          {/* Pole N (Red) */}
                          <rect x="45" y="0" width="45" height="50" rx="4" fill="#dc2626" />
                          <text x="68" y="32" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">
                            N
                          </text>

                          {/* Field Lines coming out of N pole */}
                          <path
                            d="M 90 25 C 120 15, 140 10, 160 10"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                          />
                          <path
                            d="M 90 25 C 120 35, 140 40, 160 40"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                          />
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Magnet Slider & Motion Buttons */}
                <div className="w-full max-w-md flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Xa cuộn dây</span>
                    <span className="font-bold text-amber-400">
                      Vị trí nam châm: {magnetPosition > 0 ? "Tiến sâu vào" : "Ở ngoài"}
                    </span>
                    <span>Sát trong cuộn</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="60"
                    step="2"
                    value={magnetPosition}
                    onChange={(e) => {
                      const newPos = parseInt(e.target.value);
                      const delta = newPos - magnetPosition;
                      setMagnetPosition(newPos);
                      // Dòng điện cảm ứng xuất hiện tỉ lệ với vận tốc dịch chuyển (dPhi/dt)
                      const simulatedCurrent = delta * 4; // Độ lệch kim
                      setInducedCurrent(simulatedCurrent);
                      setTimeout(() => setInducedCurrent(0), 400);
                    }}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />

                  {/* Fast Action Buttons */}
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        // Di chuyển nhanh vào
                        setMagnetPosition(50);
                        setInducedCurrent(35); // Lệch sang phải
                        setTimeout(() => setInducedCurrent(0), 600);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <ArrowRight className="w-3.5 h-3.5" /> Đẩy nam châm VÀO (B tăng → Đèn sáng)
                    </button>
                    <button
                      onClick={() => {
                        // Di chuyển nhanh ra
                        setMagnetPosition(-70);
                        setInducedCurrent(-35); // Lệch sang trái
                        setTimeout(() => setInducedCurrent(0), 600);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Kéo nam châm RA (B giảm → Đèn sáng)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CÁCH 2: BIẾN DẠNG KHUNG DÂY (ĐỔI DIỆN TÍCH S) */}
            {inductionMode === "stretch" && (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-300">
                    Kéo thay đổi diện tích khung dây trong từ trường đều B = hằng số
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Khi co hoặc dãn diện tích khung, số đường sức từ lọt qua thay đổi (ΔS ≠ 0 =&gt; ΔΦ ≠ 0) sinh ra dòng điện cảm ứng
                  </p>
                </div>

                <div className="w-full max-w-md h-52 bg-slate-900/80 rounded-xl border border-slate-800 relative flex items-center justify-center">
                  <svg viewBox="0 0 400 180" className="w-full h-full">
                    {/* Background magnetic field crosses (B hướng vào trong trang giấy) */}
                    {Array.from({ length: 5 }).map((_, r) =>
                      Array.from({ length: 9 }).map((_, c) => (
                        <text
                          key={`${r}-${c}`}
                          x={30 + c * 40}
                          y={25 + r * 35}
                          fill="#38bdf8"
                          fontSize="14"
                          opacity="0.3"
                          textAnchor="middle"
                        >
                          ⊗
                        </text>
                      ))
                    )}

                    {/* Deformable loop */}
                    <rect
                      x={200 - 60 * stretchScale}
                      y={90 - 45 * stretchScale}
                      width={120 * stretchScale}
                      height={90 * stretchScale}
                      rx="12"
                      fill="#0284c7"
                      fillOpacity="0.25"
                      stroke="#ea580c"
                      strokeWidth="4"
                      className="transition-all duration-75"
                    />

                    {/* Center Lamp */}
                    <circle
                      cx="200"
                      cy="90"
                      r="12"
                      fill={Math.abs(stretchVelocity) > 2 ? "#fde047" : "#334155"}
                      stroke="#eab308"
                      strokeWidth="2"
                      className={Math.abs(stretchVelocity) > 2 ? "animate-pulse" : ""}
                    />
                    <text x="200" y="94" fill="#1e293b" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {Math.abs(stretchVelocity) > 2 ? "⚡" : "•"}
                    </text>
                  </svg>
                </div>

                <div className="w-full max-w-md flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Khung co lại (S nhỏ)</span>
                    <span className="font-bold text-orange-400">
                      Diện tích tương đối: {(stretchScale * 100).toFixed(0)}%
                    </span>
                    <span>Khung giãn to (S lớn)</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={stretchScale}
                    onChange={(e) => {
                      const newScale = parseFloat(e.target.value);
                      const diff = (newScale - stretchScale) * 100;
                      setStretchScale(newScale);
                      setStretchVelocity(diff);
                      setTimeout(() => setStretchVelocity(0), 300);
                    }}
                    className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* CÁCH 3: QUAY KHUNG DÂY (ĐỔI GÓC ALPHA) */}
            {inductionMode === "rotate" && (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-300">
                    Nguyên lí máy phát điện xoay chiều: Quay khung dây trong từ trường đều
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Khi góc α thay đổi liên tục theo thời gian α(t) = ωt =&gt; Từ thông biến thiên điều hòa Φ(t) = Φ₀·cos(ωt) =&gt; Tạo ra dòng điện xoay chiều AC liên tục!
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsRotating(!isRotating)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                        isRotating
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-emerald-600 text-white hover:bg-emerald-500"
                      }`}
                    >
                      {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isRotating ? "Dừng máy phát điện" : "Bật động cơ quay khung"}
                    </button>

                    <span className="text-xs text-slate-300 font-mono">
                      Góc hiện tại: <strong className="text-amber-400">{Math.round(angleAlphaDeg)}°</strong>
                    </span>
                  </div>

                  {/* Indicator Bulb Glowing with AC brightness */}
                  <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800">
                    <div
                      className={`w-6 h-6 rounded-full border border-amber-400 flex items-center justify-center transition-all ${
                        isRotating
                          ? "bg-amber-300 shadow-lg shadow-amber-400/50"
                          : "bg-slate-800"
                      }`}
                    >
                      <Zap className={`w-3.5 h-3.5 ${isRotating ? "text-slate-900" : "text-slate-500"}`} />
                    </div>
                    <span className="text-xs text-slate-300">
                      Trạng thái tải:{" "}
                      <strong className={isRotating ? "text-amber-400" : "text-slate-500"}>
                        {isRotating ? "Đèn phát sáng liên tục (Dòng điện xoay chiều)" : "Đèn tắt"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 3: BẢNG SỐ LIỆU ĐO THỰC NGHIỆM ======================= */}
      {activeTab === "data_table" && (
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Table className="w-4 h-4 text-sky-400" />
                Bảng Thu thập Số liệu Thực nghiệm ảo (Khảo sát Φ = B · S · cosα)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ghi nhận các lần đo khác nhau để học sinh phân tích quy luật phụ thuộc tỉ lệ của từ thông
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={recordedData.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Xuất File CSV
              </button>
              <button
                onClick={() => setRecordedData([])}
                disabled={recordedData.length === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-40"
              >
                Xóa bảng
              </button>
            </div>
          </div>

          {/* Table display */}
          <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Lần đo</th>
                  <th className="py-2.5 px-3">B (T)</th>
                  <th className="py-2.5 px-3">S (cm²)</th>
                  <th className="py-2.5 px-3">S (m²)</th>
                  <th className="py-2.5 px-3">α (độ)</th>
                  <th className="py-2.5 px-3">cos(α)</th>
                  <th className="py-2.5 px-3">Số vòng N</th>
                  <th className="py-2.5 px-3 text-sky-300 font-bold">Φ 1 vòng (Wb)</th>
                  <th className="py-2.5 px-3 text-indigo-300 font-bold">Tổng Φ (Wb)</th>
                  <th className="py-2.5 px-3">Đường sức</th>
                  <th className="py-2.5 px-3">Nhận xét</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {recordedData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-500 font-sans">
                      Chưa có số liệu lần đo nào. Hãy sang Tab "Thí nghiệm Từ thông", điều chỉnh các thông số và bấm <strong>"Ghi lần đo này vào Bảng số liệu"</strong>.
                    </td>
                  </tr>
                ) : (
                  recordedData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2 px-3 font-sans font-medium text-white">{row.trialName}</td>
                      <td className="py-2 px-3 text-sky-400">{row.B_T.toFixed(2)}</td>
                      <td className="py-2 px-3 text-orange-400">{row.S_cm2}</td>
                      <td className="py-2 px-3 text-orange-300">{row.S_m2}</td>
                      <td className="py-2 px-3 text-amber-400">{row.alpha_deg}°</td>
                      <td className="py-2 px-3 text-amber-300">{row.cos_alpha}</td>
                      <td className="py-2 px-3">{row.N_turns}</td>
                      <td className="py-2 px-3 text-sky-300 font-bold">{row.Phi_single_Wb}</td>
                      <td className="py-2 px-3 text-indigo-300 font-bold">{row.Phi_total_Wb}</td>
                      <td className="py-2 px-3 text-slate-400">~{row.linesCount}</td>
                      <td className="py-2 px-3 font-sans text-[11px] text-slate-400">{row.note}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= TAB 4: PHIẾU HỌC TẬP PHÁT TRIỂN NĂNG LỰC ======================= */}
      {activeTab === "worksheets" && (
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Hệ thống Phiếu học tập Khám phá & Phát triển Năng lực (Theo CV 5512)
            </span>
            <p className="text-xs text-slate-400 mt-1">
              Được thiết kế để giáo viên tổ chức hoạt động học tích cực cho học sinh trên lớp, kết hợp suy luận lí thuyết và kiểm nghiệm mô phỏng số.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PHT 1 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                  Phiếu Học Tập Số 1
                </span>
                <h4 className="text-xs font-bold text-white mt-2">
                  Xây dựng Định nghĩa & Biểu thức Từ thông
                </h4>
                <div className="text-[11px] text-slate-300 mt-2 space-y-1.5">
                  <p>• <strong>Nhiệm vụ 1:</strong> Quan sát mô phỏng và đếm số đường sức xuyên qua khung khi giữ nguyên S, tăng dần B từ 0.2 T lên 1.0 T. Nhận xét mối quan hệ giữa số đường sức và B.</p>
                  <p>• <strong>Nhiệm vụ 2:</strong> Giữ nguyên B, thay đổi diện tích S từ 50 cm² lên 200 cm². Số đường sức lọt qua thay đổi thế nào?</p>
                  <p>• <strong>Kết luận:</strong> Đại lượng từ thông Φ tỉ lệ thuận với những đại lượng nào?</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-emerald-400 font-medium">
                ✓ Phát triển năng lực tìm hiểu thế giới tự nhiên và mô hình hóa toán học.
              </div>
            </div>

            {/* PHT 2 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Phiếu Học Tập Số 2
                </span>
                <h4 className="text-xs font-bold text-white mt-2">
                  Khảo sát các Trường hợp Đặc biệt của Góc α
                </h4>
                <div className="text-[11px] text-slate-300 mt-2 space-y-1.5">
                  <p>• <strong>Nhiệm vụ 1:</strong> Xoay khung dây đến α = 0°, 90°, 180°. Ghi nhận số đường sức đâm xuyên qua khung ở từng vị trí.</p>
                  <p>• <strong>Nhiệm vụ 2:</strong> Tại sao khi mặt phẳng khung song song với các đường sức từ (α = 90°), từ thông lại triệt tiêu (Φ = 0)?</p>
                  <p>• <strong>Nhiệm vụ 3:</strong> Khi nào thì từ thông mang dấu âm (Φ &lt; 0)? Ý nghĩa vật lí của dấu âm là gì?</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-amber-400 font-medium">
                ✓ Phát triển tư duy hình học không gian và khắc phục ngộ nhận học sinh.
              </div>
            </div>

            {/* PHT 3 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                  Phiếu Học Tập Số 3
                </span>
                <h4 className="text-xs font-bold text-white mt-2">
                  Đề xuất Phương án Biến thiên Từ thông
                </h4>
                <div className="text-[11px] text-slate-300 mt-2 space-y-1.5">
                  <p>• <strong>Nhiệm vụ 1:</strong> Dựa vào biểu thức Φ = B·S·cos(α), nêu 3 cách cụ thể để làm biến thiên từ thông qua khung dây (ΔΦ ≠ 0).</p>
                  <p>• <strong>Nhiệm vụ 2:</strong> Thử nghiệm trên mô phỏng Tab "Hiện tượng cảm ứng", tìm điều kiện để đèn LED phát sáng mạnh nhất.</p>
                  <p>• <strong>Vận dụng:</strong> Nhà máy thủy điện Hòa Bình tạo ra dòng điện bằng cách biến thiên yếu tố nào trong 3 yếu tố trên?</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-indigo-400 font-medium">
                ✓ Phát triển năng lực vận dụng kiến thức vật lí vào thực tiễn kĩ thuật.
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
                Câu hỏi Trắc nghiệm Đánh giá Năng lực Nhận thức & Vận dụng
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Rèn luyện khả năng tính toán chuẩn xác và giải thích bản chất vật lí
              </p>
            </div>
            <button
              onClick={() => setShowQuizResults(!showQuizResults)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
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
                        btnStyle = "bg-sky-950/80 border-sky-500 text-sky-200 font-semibold";
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

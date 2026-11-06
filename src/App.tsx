import React, { useState, useEffect } from "react";
import { GradeLevel, LessonTopic, LessonActivity, BookSeries } from "./types/physics";
import { physicsCurriculum } from "./data/physicsCurriculum";
import { CurriculumSelector } from "./components/CurriculumSelector";
import { ActivityView5512 } from "./components/ActivityView5512";
import { AiGenerationModal } from "./components/AiGenerationModal";
import { SavedLessonsLibrary, SavedLessonItem } from "./components/SavedLessonsLibrary";
import { SimulationViewer } from "./components/simulations/SimulationViewer";
import {
  Atom,
  BookOpen,
  Sparkles,
  FolderKanban,
  MonitorPlay,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
  Scale,
  Compass,
  Zap,
  Download,
} from "lucide-react";
import { downloadSimulationOffline } from "./utils/offlineSimulations";
import { PedagogicalMethodsGuideModal } from "./components/PedagogicalMethodsGuideModal";
import { PedagogicalMethodItem } from "./data/pedagogicalMethods";

export default function App() {
  // Navigation tabs
  const [activeMainTab, setActiveMainTab] = useState<"builder" | "simulations" | "library">("builder");
  const [isPedagogyModalOpen, setIsPedagogyModalOpen] = useState(false);

  // Current Lesson & Activity state - Mặc định mở ngay bài Từ thông - Hiện tượng cảm ứng điện từ
  const initialLesson =
    physicsCurriculum.find((l) => l.id === "vl11-tu-thong-cam-ung-dien-tu") ||
    physicsCurriculum[0];
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(11);
  const [selectedBookSeries, setSelectedBookSeries] = useState<BookSeries>("ket_noi_tri_thuc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentTopic, setCurrentTopic] = useState<LessonTopic>(initialLesson);
  const [currentActivity, setCurrentActivity] = useState<LessonActivity>(initialLesson.defaultActivity);

  // Selected simulation in the Simulations Lab tab - Mặc định mở sim-magnetic-flux-11
  const [selectedLabSimId, setSelectedLabSimId] = useState<string>("sim-magnetic-flux-11");

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Saved lessons (with localStorage persistence)
  const [savedLessons, setSavedLessons] = useState<SavedLessonItem[]>(() => {
    try {
      const stored = localStorage.getItem("physics_5512_saved_lessons");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => item && item.topic && item.activity);
        }
      }
    } catch (e) {
      console.warn("Lỗi đọc từ localStorage:", e);
    }
    // Default initial saved lesson
    return [
      {
        id: "saved-init-1",
        savedAt: new Date().toLocaleDateString("vi-VN"),
        topic: initialLesson,
        activity: initialLesson.defaultActivity,
        bookSeries: "ket_noi_tri_thuc",
        teacherNotes: "Bài mẫu hình thành kiến thức vận tốc - gia tốc.",
      },
    ];
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("physics_5512_saved_lessons", JSON.stringify(savedLessons));
    } catch (e) {
      console.warn("Lỗi lưu vào localStorage:", e);
    }
  }, [savedLessons]);

  // When grade changes, pick first lesson of that grade if current not matching
  const handleSelectGrade = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    const firstOfGrade = physicsCurriculum.find((l) => l.grade === grade);
    if (firstOfGrade) {
      setCurrentTopic(firstOfGrade);
      setCurrentActivity(firstOfGrade.defaultActivity);
      if (firstOfGrade.simulationId) {
        setSelectedLabSimId(firstOfGrade.simulationId);
      }
    }
  };

  const handleSelectLesson = (topic: LessonTopic) => {
    setCurrentTopic(topic);
    setCurrentActivity(topic.defaultActivity);
    if (topic.simulationId) {
      setSelectedLabSimId(topic.simulationId);
    }
  };

  const handleSaveToLibrary = () => {
    const newItem: SavedLessonItem = {
      id: `lesson-${Date.now()}`,
      savedAt: new Date().toLocaleDateString("vi-VN"),
      topic: currentTopic,
      activity: currentActivity,
      bookSeries: selectedBookSeries,
      teacherNotes: `Lớp ${currentTopic.grade} - ${currentTopic.lessonTitle}`,
    };
    setSavedLessons((prev) => [newItem, ...prev]);
    showToast("Đã lưu bài giảng vào kho tài nguyên thành công!");
  };

  const handleLoadSavedLesson = (item: SavedLessonItem) => {
    setSelectedGrade(item.topic.grade);
    setSelectedBookSeries(item.bookSeries);
    setCurrentTopic(item.topic);
    setCurrentActivity(item.activity);
    setActiveMainTab("builder");
    showToast(`Đã mở bài giảng: ${item.topic.lessonTitle}`);
  };

  const handleDeleteSavedLesson = (id: string) => {
    setSavedLessons((prev) => prev.filter((item) => item.id !== id));
    showToast("Đã xóa bài giảng khỏi kho lưu trữ.");
  };

  const handleApplyAiActivity = (newActivity: LessonActivity) => {
    setCurrentActivity(newActivity);
    showToast("Đã cập nhật hoạt động mới biên soạn bởi AI theo CV 5512!");
  };

  const handleApplyPedagogyMethod = (method: PedagogicalMethodItem) => {
    setCurrentActivity((prev) => ({
      ...prev,
      pedagogicalMethod: method.name,
      organizationSteps: method.steps.map((st, i) => ({
        stepNumber: ((i % 4) + 1) as 1 | 2 | 3 | 4,
        stepName: `Bước ${i + 1}: ${st.title}`,
        teacherAction: st.teacherAction,
        studentAction: st.studentAction,
        pedagogicalRationale: `${st.description} (KTDH tích cực: ${st.suitableTechnique})`,
      })),
    }));
    setActiveMainTab("builder");
    showToast(`Đã áp dụng phương pháp "${method.name}" vào tiến trình hoạt động!`);
  };

  const allLabSimulations = [
    {
      id: "sim-collision-elastic-10",
      grade: 10,
      title: "TN1: Va chạm Đàn hồi - Bảng 29.1 (SGK Vật lí 10, tr. 114)",
      desc: "Hai xe đệm khí gắn lò xo, đo thời gian t qua cổng quang điện A và B, nghiệm lại bảo toàn động lượng và bảo toàn động năng",
      category: "Cơ học",
    },
    {
      id: "sim-collision-inelastic-10",
      grade: 10,
      title: "TN2: Va chạm Mềm - Bảng 29.2 (SGK Vật lí 10, tr. 114)",
      desc: "Hai xe đệm khí gắn đầu dính Velcro, sau va chạm dính chặt chuyển động với vận tốc chung v, khảo sát sự tiêu tán động năng thành nhiệt",
      category: "Cơ học",
    },
    {
      id: "sim-momentum-10",
      grade: 10,
      title: "Bộ thí nghiệm Va chạm & Động lượng tổng hợp (Bài 29)",
      desc: "Tích hợp cả 2 thí nghiệm va chạm đàn hồi (Bảng 29.1), va chạm mềm (Bảng 29.2) và khảo sát xung lượng lực F·Δt = Δp",
      category: "Cơ học",
    },
    {
      id: "sim-pendulum-energy-10",
      grade: 10,
      title: "Con lắc đồng hồ & Định luật bảo toàn cơ năng (Bài 26 - Lớp 10)",
      desc: "Mô phỏng quả lắc đồng hồ dao động, phân tích chuyển hóa Wđ - Wt, kiểm chứng bảo toàn cơ năng W = const, cơ chế bánh răng thoát escapement bù năng lượng và công tắc ẩn/hiện số liệu sư phạm",
      category: "Năng lượng & Cơ học",
    },
    {
      id: "sim-motion-10",
      grade: 10,
      title: "Chuyển động Thẳng biến đổi đều (Lớp 10)",
      desc: "Xe lăn gắn thước đo, đồ thị v-t, đo gia tốc a = Δv/Δt",
      category: "Cơ học",
    },
    {
      id: "sim-newton-10",
      grade: 10,
      title: "Định luật II Newton & Lực kéo (Lớp 10)",
      desc: "Xe lăn kéo bởi quả nặng, khảo sát mối liên hệ gia tốc a, lực F và khối lượng m",
      category: "Cơ học",
    },
    {
      id: "sim-oscillator-11",
      grade: 11,
      title: "Dao động điều hòa & Vectơ quay Fresnel (Lớp 11)",
      desc: "Con lắc lò xo / con lắc đơn, đồ thị sóng li độ hình sin x(t) và vectơ tròn đều",
      category: "Dao động",
    },
    {
      id: "sim-wave-11",
      grade: 11,
      title: "Giao thoa Sóng cơ 2 nguồn kết hợp (Lớp 11)",
      desc: "Mặt nước gợn sóng 2D, đầu dò điểm M kiểm chứng cực đại d₂ - d₁ = k·λ",
      category: "Sóng",
    },
    {
      id: "sim-potential-energy-11",
      grade: 11,
      title: "Thí nghiệm Điện tích dịch chuyển từ từ trong Điện trường đều & Thế năng điện (Bài 18 / 19 - Lớp 11)",
      desc: "Chuyển động từ từ có điều khiển tốc độ (Slow-Mo) giúp học sinh quan sát rõ ràng độ dời s, hình chiếu d, công A = q·E·d, đường gãy khúc và độ giảm thế năng ΔWt",
      category: "Điện trường",
    },
    {
      id: "sim-electric-potential-11",
      grade: 11,
      title: "Điện thế, Hiệu điện thế & Mặt đẳng thế (Bài 20 - Lớp 11)",
      desc: "Vôn kế số 2 đầu dò đo điện thế V, U_AB = V_A - V_B, vẽ mặt đẳng thế phát sáng, địa hình 3D núi điện thế và đấu trường bắn hạt sôi động",
      category: "Điện trường",
    },
    {
      id: "sim-refraction-11",
      grade: 11,
      title: "Khúc xạ Ánh sáng & Phản xạ Toàn phần (Lớp 11)",
      desc: "Đĩa tròn chia độ quang học, kiểm chứng định luật Snell và góc giới hạn i_gh",
      category: "Quang học",
    },
    {
      id: "sim-magnetic-flux-11",
      grade: 11,
      title: "Từ thông & Hiện tượng Cảm ứng điện từ (Bài 22 - Lớp 11)",
      desc: "Khảo sát công thức Φ = B·S·cos(α), trực quan hóa số đường sức từ đâm xuyên khung 3D, công tắc ẩn/hiện số liệu sư phạm và 3 con đường biến thiên từ thông tạo dòng điện cảm ứng",
      category: "Từ trường & Cảm ứng",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
                <Atom className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                    PhyPedagogy 5512
                  </h1>
                  <span className="hidden sm:inline-block bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200">
                    Vật lí 10-11
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  Xây dựng Hoạt động Hình thành Kiến thức mới • Chuẩn CV 5512 & 3456 • CT 2018
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                id="nav-builder"
                onClick={() => setActiveMainTab("builder")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeMainTab === "builder"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Soạn bài học</span>
              </button>

              <button
                id="nav-simulations"
                onClick={() => setActiveMainTab("simulations")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeMainTab === "simulations"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <MonitorPlay className="w-4 h-4" />
                <span>Phòng thí nghiệm ảo</span>
                <span className="hidden md:inline-block bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {allLabSimulations.length} Lab
                </span>
              </button>

              <button
                id="nav-library"
                onClick={() => setActiveMainTab("library")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeMainTab === "library"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>Kho bài giảng & Tài nguyên</span>
                {savedLessons.length > 0 && (
                  <span className="inline-block bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {savedLessons.length}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

              <button
                onClick={() => setIsPedagogyModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all shadow-xs"
                title="Cẩm nang 8 PPDH & 8 KTDH tích cực theo LÍ LUẬN DẠY HỌC VẬT LÍ PHỔ THÔNG (2022)"
              >
                <Compass className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">Cẩm nang</span> PPDH (LLDH)
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* VIEW 1: LESSON PLANNER & CV 5512 BUILDER */}
        {activeMainTab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left sidebar: Grade & Lesson Selector */}
            <div className="lg:col-span-4 space-y-4">
              <CurriculumSelector
                selectedGrade={selectedGrade}
                onSelectGrade={handleSelectGrade}
                selectedBookSeries={selectedBookSeries}
                onSelectBookSeries={setSelectedBookSeries}
                lessons={physicsCurriculum}
                selectedLessonId={currentTopic.id}
                onSelectLesson={handleSelectLesson}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {/* Quick Guidance Box */}
              <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-100 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-sky-900">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  Hướng dẫn cho Giáo viên:
                </div>
                <p className="leading-relaxed">
                  1. Tích chọn khối <strong>Lớp 10 hoặc 11</strong> và chọn bài dạy trong danh mục.
                </p>
                <p className="leading-relaxed">
                  2. Hệ thống tự động trích xuất cấu trúc hoạt động hình thành kiến thức theo chuẩn <strong>CV 5512</strong> (Mục tiêu, Nội dung, Sản phẩm, 4 bước tổ chức) và nghiên cứu các quan niệm sai lầm từ <strong>Sách giáo viên</strong>.
                </p>
                <p className="leading-relaxed">
                  3. Bấm <strong>"Tải file Word"</strong> để có ngay giáo án in nộp chuyên môn hoặc <strong>"Tùy biến với AI"</strong> để thiết kế theo mô hình 5E, STEM!
                </p>
              </div>
            </div>

            {/* Right main area: Activity View */}
            <div className="lg:col-span-8">
              <ActivityView5512
                topic={currentTopic}
                activity={currentActivity}
                bookSeries={selectedBookSeries}
                onUpdateActivity={setCurrentActivity}
                onSaveToLibrary={handleSaveToLibrary}
                onOpenAiModal={() => setIsAiModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: FULL VIRTUAL LABS SUITE */}
        {activeMainTab === "simulations" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5 text-emerald-600" />
                  Phòng Thí nghiệm Ảo Vật lí Tương tác (Virtual Physics Lab)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Được thiết kế trực quan, sinh động để chiếu giảng dạy trên lớp hoặc cho học sinh tự thao tác thí nghiệm hình thành kiến thức.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    downloadSimulationOffline(selectedLabSimId);
                    showToast("Đã tải tệp thí nghiệm (.html) về máy tính thành công!");
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  title="Tải gói mô phỏng HTML độc lập về máy để chiếu dạy học offline không cần mạng"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải thí nghiệm đang mở (Chạy Offline)</span>
                </button>
              </div>

              {/* Simulation Selector Pills */}
              <div className="flex flex-wrap gap-1.5 w-full pt-1 border-t border-slate-100">
                {allLabSimulations.map((sim) => {
                  const isSelected = selectedLabSimId === sim.id;
                  return (
                    <button
                      key={sim.id}
                      onClick={() => setSelectedLabSimId(sim.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all border ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <span>Lớp {sim.grade}:</span> {sim.category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Simulation Stage */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <SimulationViewer simulationId={selectedLabSimId} />
            </div>

            {/* Grid Catalog of Simulations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allLabSimulations.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => setSelectedLabSimId(sim.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedLabSimId === sim.id
                      ? "border-emerald-500 bg-emerald-50/30 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        Vật lí {sim.grade}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600">{sim.category}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mb-1">{sim.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{sim.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Click mở lab</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSimulationOffline(sim.id);
                        showToast(`Đã tải về máy: ${sim.title.substring(0, 30)}...`);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                      title="Tải tệp HTML độc lập về máy để chạy offline"
                    >
                      <Download className="w-3 h-3" />
                      <span>Tải Offline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: SAVED LESSONS & ONLINE RESOURCES */}
        {activeMainTab === "library" && (
          <SavedLessonsLibrary
            savedLessons={savedLessons}
            onLoadLesson={handleLoadSavedLesson}
            onDeleteLesson={handleDeleteSavedLesson}
            onUpdateLessonNotes={(id, notes) => {
              setSavedLessons((prev) =>
                prev.map((item) => (item.id === id ? { ...item, teacherNotes: notes } : item))
              );
            }}
          />
        )}
      </main>

      {/* AI Modal */}
      <AiGenerationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        topic={currentTopic}
        bookSeries={selectedBookSeries}
        onApplyActivity={handleApplyAiActivity}
      />

      {/* Pedagogical Methods Guide Modal */}
      <PedagogicalMethodsGuideModal
        isOpen={isPedagogyModalOpen}
        onClose={() => setIsPedagogyModalOpen(false)}
        currentLessonTitle={currentTopic.lessonTitle}
        onApplyMethod={handleApplyPedagogyMethod}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Ứng dụng Hỗ trợ Giáo viên Vật lí • Tích hợp Mô phỏng Thí nghiệm ảo • Tuân thủ CV 5512/BGDĐT & CV 3456/BGDĐT • Chương trình Giáo dục Phổ thông 2018
        </div>
      </footer>
    </div>
  );
}

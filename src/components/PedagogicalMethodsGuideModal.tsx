import React, { useState } from "react";
import {
  BookOpen,
  Compass,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Info,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Users,
  Grid,
  Hand,
  Cpu,
  MonitorPlay,
  RotateCcw,
  Zap,
  Bookmark,
  Share2,
} from "lucide-react";
import {
  PEDAGOGICAL_METHODS,
  TEACHING_TECHNIQUES,
  PROBLEM_SITUATION_TYPES,
  PedagogicalMethodItem,
} from "../data/pedagogicalMethods";
import { LessonTopic, LessonActivity } from "../types/physics";

interface PedagogicalMethodsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: LessonTopic;
  currentActivity: LessonActivity;
  onApplyMethodToActivity?: (method: PedagogicalMethodItem) => void;
}

export const PedagogicalMethodsGuideModal: React.FC<PedagogicalMethodsGuideModalProps> = ({
  isOpen,
  onClose,
  currentTopic,
  currentActivity,
  onApplyMethodToActivity,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMethodId, setSelectedMethodId] = useState<string>("gqvd_reasoning_exp");
  const [activeTab, setActiveTab] = useState<"methods" | "techniques" | "situations">("methods");
  const [applySuccessNotice, setApplySuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMethod =
    PEDAGOGICAL_METHODS.find((m) => m.id === selectedMethodId) || PEDAGOGICAL_METHODS[0];

  const filteredMethods =
    selectedCategory === "all"
      ? PEDAGOGICAL_METHODS
      : PEDAGOGICAL_METHODS.filter((m) => m.category === selectedCategory);

  const handleApply = (method: PedagogicalMethodItem) => {
    if (onApplyMethodToActivity) {
      onApplyMethodToActivity(method);
      setApplySuccessNotice(`Đã áp dụng phương pháp "${method.name}" vào Hoạt động hình thành kiến thức bài "${currentTopic.lessonTitle}"!`);
      setTimeout(() => {
        setApplySuccessNotice(null);
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Cẩm nang & Thư viện Phương pháp Dạy học Vật lí
                </h3>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
                  Chuẩn LLDH & CV 5512
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Căn cứ giáo trình Lí luận dạy học Vật lí (ĐH Quy Nhơn 2022) & Chương trình GDPT 2018
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Success toast inside modal */}
        {applySuccessNotice && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 flex items-center gap-2 shadow-md animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{applySuccessNotice}</span>
          </div>
        )}

        {/* Top Segment Nav */}
        <div className="bg-slate-100/80 px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab("methods")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === "methods"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📚 Các Phương pháp & Mô hình Dạy học ({PEDAGOGICAL_METHODS.length})
            </button>
            <button
              onClick={() => setActiveTab("techniques")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === "techniques"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🧩 Kĩ thuật Dạy học Tích cực ({TEACHING_TECHNIQUES.length})
            </button>
            <button
              onClick={() => setActiveTab("situations")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === "situations"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ⚡ 5 Dạng Tình huống Có vấn đề (LLDH)
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Bài học đang chọn: <strong className="text-slate-800">{currentTopic.lessonTitle}</strong>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50">
          {/* TAB 1: PPDH & MÔ HÌNH */}
          {activeTab === "methods" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left Sidebar List of Methods */}
              <div className="md:col-span-5 space-y-3">
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "Nhận thức Vật lí đặc thù", label: "Nhận thức Vật lí" },
                    { id: "Mô hình Dạy học Hiện đại", label: "Mô hình Hiện đại" },
                    { id: "Dạy học Tích hợp & Kĩ thuật", label: "STEM & Kĩ thuật" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border transition ${
                        selectedCategory === cat.id
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Methods List */}
                <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
                  {filteredMethods.map((method) => {
                    const isSelected = selectedMethodId === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethodId(method.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50/70 border-indigo-500 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {method.badge}
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-600">
                            {method.category}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{method.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {method.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Detail Preview of Selected Method */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {currentMethod.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      {currentMethod.name}
                    </h3>
                    <p className="text-xs text-slate-500 italic mt-0.5">
                      {currentMethod.sourceDoc}
                    </p>
                  </div>

                  {/* Apply Button */}
                  {onApplyMethodToActivity && (
                    <button
                      onClick={() => handleApply(currentMethod)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Áp dụng cho bài học này
                    </button>
                  )}
                </div>

                {/* Nature & Rationale */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block mb-1">Bản chất sư phạm & Cơ sở lí luận:</strong>
                  {currentMethod.natureAndRationale}
                </div>

                {/* Core Steps */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Tiến trình tổ chức hoạt động ({currentMethod.steps.length} bước chuẩn):
                  </h4>
                  <div className="space-y-2.5">
                    {currentMethod.steps.map((st) => (
                      <div
                        key={st.number}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                              {st.number}
                            </span>
                            {st.title}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {st.suitableTechnique}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mb-1.5">{st.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-slate-100">
                          <div>
                            <strong className="text-slate-700">GV tổ chức:</strong>{" "}
                            <span className="text-slate-600">{st.teacherAction}</span>
                          </div>
                          <div>
                            <strong className="text-slate-700">HS thực hiện:</strong>{" "}
                            <span className="text-slate-600">{st.studentAction}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example Application */}
                <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl text-xs space-y-1">
                  <strong className="text-amber-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    Ví dụ minh họa thực tế cho: {currentMethod.exampleApplicationLesson.lessonTitle}
                  </strong>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    <strong>Bối cảnh:</strong> {currentMethod.exampleApplicationLesson.scenario}
                  </p>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    <strong>Chỉ dẫn sư phạm:</strong> {currentMethod.exampleApplicationLesson.demonstrationGuide}
                  </p>
                </div>

                {/* Key Advantages */}
                <div className="text-[11px] text-slate-600 space-y-1">
                  <strong className="text-slate-800">Ưu điểm nổi bật khi phát triển phẩm chất - năng lực:</strong>
                  {currentMethod.keyAdvantages.map((adv, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KĨ THUẬT DẠY HỌC TÍCH CỰC */}
          {activeTab === "techniques" && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-xs text-indigo-900 leading-relaxed">
                <strong className="block text-sm font-bold text-indigo-950 mb-1">
                  Bộ Kĩ thuật Dạy học Tích cực theo chuẩn Đổi mới GDPT 2018
                </strong>
                Kĩ thuật dạy học là những biện pháp, cách thức hành động của giáo viên và học sinh trong các tình huống hành động nhỏ nhằm thực hiện và điều khiển quá trình dạy học. Việc phối hợp linh hoạt các kĩ thuật này trong 4 bước của CV 5512 giúp học sinh phát triển năng lực tự chủ, giao tiếp, hợp tác và tư duy phản biện.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEACHING_TECHNIQUES.map((tech) => (
                  <div
                    key={tech.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-2 shadow-2xs hover:border-indigo-300 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {tech.tag}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Phù hợp: Bước {tech.roleIn5512}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{tech.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{tech.description}</p>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700 space-y-1">
                      <strong className="text-slate-800 block">Quy trình thực hiện:</strong>
                      {tech.steps.map((st, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-bold shrink-0">•</span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 5 DẠNG TÌNH HUỐNG CÓ VẤN ĐỀ THEO LLDH */}
          {activeTab === "situations" && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 leading-relaxed">
                <strong className="block text-sm font-bold text-amber-900 mb-1">
                  5 Dạng Tình huống Có vấn đề điển hình trong Dạy học Vật lí (ĐH Quy Nhơn 2022, tr. 45-47)
                </strong>
                Hoạt động tư duy chỉ thực sự bắt đầu khi học sinh gặp phải mâu thuẫn giữa nhu cầu, nhiệm vụ nhận thức mới với trình độ kiến thức hiện có. Việc thiết kế tình huống có vấn đề xuất phát quyết định 80% sự thành công của bài dạy theo định hướng phát triển năng lực.
              </div>

              <div className="space-y-3.5">
                {PROBLEM_SITUATION_TYPES.map((sit, idx) => (
                  <div
                    key={sit.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-2.5 shadow-2xs hover:border-amber-400 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{sit.name}</h4>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">Khái niệm & Bản chất:</strong> {sit.definition}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <strong className="text-indigo-900 block mb-1">Ví dụ minh họa thực tiễn:</strong>
                      {sit.physicsExample}
                    </div>

                    <div className="text-[11px] text-emerald-700 font-medium">
                      ✓ <strong>Tác dụng sư phạm:</strong> {sit.pedagogicalEffect}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100/90 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Dữ liệu tích hợp: Giáo trình LLDH Vật lí phổ thông (2022) • CV 5512/BGDĐT & CV 3456/BGDĐT
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition"
          >
            Đóng cẩm nang
          </button>
        </div>
      </div>
    </div>
  );
};

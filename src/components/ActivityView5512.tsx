import React, { useState } from "react";
import { LessonTopic, LessonActivity, BookSeries } from "../types/physics";
import { SimulationViewer } from "./simulations/SimulationViewer";
import { TheoreticalInquiryPathView } from "./TheoreticalInquiryPathView";
import { MathText } from "./MathText";
import {
  FileText,
  MonitorPlay,
  ClipboardList,
  BookMarked,
  Download,
  Copy,
  Printer,
  Sparkles,
  Save,
  Check,
  Edit3,
  Clock,
  Target,
  Layers,
  Award,
  Laptop,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  HelpCircle,
  Zap,
  Flame,
  ArrowRight,
  GitFork,
  Users,
  ShieldCheck,
  Atom,
  Compass,
  CheckCircle2,
  CheckSquare,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";
import { exportActivityToWordDoc } from "../utils/exportWord";
import { exportActivityToPowerPoint } from "../utils/exportPowerPoint";
import { PedagogicalMethodsGuideModal } from "./PedagogicalMethodsGuideModal";
import { downloadSimulationOffline } from "../utils/offlineSimulations";
import { PedagogicalMethodItem, PEDAGOGICAL_METHODS } from "../data/pedagogicalMethods";
import { AssessmentToolsModal } from "./AssessmentToolsModal";
import { ACTIVITY_RUBRICS, ACTIVITY_CHECKLISTS, PEER_ASSESSMENT_GUIDE } from "../data/assessmentFramework";

interface ActivityView5512Props {
  topic: LessonTopic;
  activity: LessonActivity;
  bookSeries: BookSeries;
  onUpdateActivity: (updated: LessonActivity) => void;
  onSaveToLibrary: () => void;
  onOpenAiModal: () => void;
}

export const ActivityView5512: React.FC<ActivityView5512Props> = ({
  topic,
  activity,
  bookSeries,
  onUpdateActivity,
  onSaveToLibrary,
  onOpenAiModal,
}) => {
  const [activeTab, setActiveTab] = useState<"pedagogy" | "theory-path" | "simulation" | "worksheet" | "sgv" | "assessment" | "stem">("pedagogy");
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPedagogyModalOpen, setIsPedagogyModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isExportingPpt, setIsExportingPpt] = useState(false);
  const [pptSuccessNotice, setPptSuccessNotice] = useState<string | null>(null);
  const [activePedagogyId, setActivePedagogyId] = useState<string>("gqvd_reasoning_exp");
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);
  const [selectedSubActId, setSelectedSubActId] = useState<string>("2.1");

  // Apply chosen pedagogical method to the lesson activity
  const handleApplyPedagogyMethod = (method: PedagogicalMethodItem) => {
    setActivePedagogyId(method.id);
    const updated: LessonActivity = {
      ...activity,
      activityTitle: `Hoạt động 2: Hình thành kiến thức mới theo ${method.name} (${method.badge})`,
      implementation: {
        ...activity.implementation,
        step1_transfer: `[Áp dụng ${method.name} - ${method.steps[0]?.title || "Bước 1"}]\n${activity.implementation.step1_transfer}`,
        step2_execution: `[Áp dụng ${method.name} - ${method.steps[1]?.title || "Bước 2"}]\n${activity.implementation.step2_execution}`,
        step3_discussion: `[Áp dụng ${method.name} - ${method.steps[2]?.title || "Bước 3"}]\n${activity.implementation.step3_discussion}`,
        step4_conclusion: `[Áp dụng ${method.name} - ${method.steps[3]?.title || "Bước 4"}]\n${activity.implementation.step4_conclusion}`,
      },
    };
    onUpdateActivity(updated);
  };

  const handleDownloadSimulation = () => {
    if (!topic.simulationId) return;
    const ok = downloadSimulationOffline(topic.simulationId);
    if (ok) {
      setOfflineNotice("Đã tải thành công file HTML thí nghiệm offline về máy tính! Bạn có thể mở trực tiếp mà không cần mạng.");
      setTimeout(() => setOfflineNotice(null), 5000);
    }
  };

  // Copy full activity text formatted for paste
  const handleCopyText = () => {
    const text = `
KẾ HOẠCH BÀI DẠY VẬT LÍ ${topic.grade} - ${topic.lessonTitle}
(Chuẩn Công văn 5512/BGDĐT-GDTrH & 3456/BGDĐT-GDTrH)
===================================================
TÊN HOẠT ĐỘNG: ${activity.activityTitle}
Thời lượng: ${activity.durationMinutes} phút

A. MỤC TIÊU
${
  activity.objectives?.knowledge && activity.objectives.knowledge.length > 0
    ? `1. Kiến thức:
${activity.objectives.knowledge.map((k) => `- ${k}`).join("\n")}

2. Năng lực Vật lí:
${activity.objectives.physicsCompetencies.map((c) => `- ${c}`).join("\n")}

3. Năng lực chung:
${activity.objectives.generalCompetencies.map((c) => `- ${c}`).join("\n")}

4. Phẩm chất:
${activity.objectives.qualities.map((q) => `- ${q}`).join("\n")}`
    : `1. Năng lực Vật lí:
${activity.objectives.physicsCompetencies.map((c) => `- ${c}`).join("\n")}

2. Năng lực chung:
${activity.objectives.generalCompetencies.map((c) => `- ${c}`).join("\n")}

3. Phẩm chất:
${activity.objectives.qualities.map((q) => `- ${q}`).join("\n")}`
}

B. NỘI DUNG HOẠT ĐỘNG
${activity.content}

C. SẢN PHẨM HỌC TẬP
${activity.product}

D. TỔ CHỨC THỰC HIỆN (4 BƯỚC SƯ PHẠM)
* Bước 1 (Chuyển giao nhiệm vụ):
${activity.implementation.step1_transfer}

* Bước 2 (Thực hiện nhiệm vụ):
${activity.implementation.step2_execution}

* Bước 3 (Báo cáo, thảo luận):
${activity.implementation.step3_discussion}

* Bước 4 (Kết luận, nhận định):
${activity.implementation.step4_conclusion}

E. PHIẾU HỌC TẬP: ${activity.studentWorksheet.title}
${activity.studentWorksheet.tasks
  .map((t) => `[Câu ${t.id}] ${t.instruction}\n- Câu hỏi: ${t.prompt}\n- Gợi ý: ${t.expectedAnswer || ""}`)
  .join("\n\n")}

F. LƯU Ý TỪ SÁCH GIÁO VIÊN (SGV)
* Quan niệm sai lầm:
${activity.teacherGuideNotes.commonMisconceptions.map((m) => `- ${m}`).join("\n")}
* Lời khuyên sư phạm:
${activity.teacherGuideNotes.pedagogicalAdvice.map((a) => `- ${a}`).join("\n")}
* Phân hóa:
- Hỗ trợ: ${activity.teacherGuideNotes.differentiationPrompts.support}
- Nâng cao: ${activity.teacherGuideNotes.differentiationPrompts.advanced}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    exportActivityToWordDoc(topic, activity, bookSeries);
  };

  const handleExportPowerPoint = async () => {
    try {
      setIsExportingPpt(true);
      const fileName = await exportActivityToPowerPoint(topic, activity, bookSeries);
      setPptSuccessNotice(`Đã xuất bài giảng sang PowerPoint thành công: "${fileName}". Chuẩn cấu trúc sơ đồ khối logic, phân cấp đề mục chuẩn SGK, không chứa giáo án hay PPCT!`);
      setTimeout(() => setPptSuccessNotice(null), 6000);
    } catch (err) {
      console.error("Export PPT error:", err);
    } finally {
      setIsExportingPpt(false);
    }
  };

  return (
    <div id="activity-view-5512" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 md:p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                Vật lí {topic.grade}
              </span>
              <span>•</span>
              <span className="text-slate-300">{topic.chapterTitle}</span>
              <span>•</span>
              <span className="text-emerald-400">Chuẩn CV 5512 & 3456</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{topic.durationDisplay || `${topic.periodsCount || topic.estimatedPeriods || 2} tiết (${(topic.periodsCount || topic.estimatedPeriods || 2) * 45} phút)`}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {topic.lessonTitle}
            </h2>

            <div className="text-sm text-slate-300 flex items-center gap-2 pt-1">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Thời lượng hoạt động:</span>
              <span className="font-semibold text-white">{activity.durationMinutes} phút</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">{activity.activityTitle}</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* PowerPoint Export Button (Canva Style, Times New Roman 24-28pt, Pure SGK Knowledge) */}
            <button
              id="btn-export-pptx"
              onClick={handleExportPowerPoint}
              disabled={isExportingPpt}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-900/30 border border-cyan-400/50 cursor-pointer"
              title="Xuất bài giảng PowerPoint (.pptx) chuẩn cấu trúc sơ đồ khối nhánh logic, phân cấp đề mục chuẩn SGK (định nghĩa, định luật, thuyết, công thức), không chứa giáo án hay PPCT"
            >
              <Presentation className="w-3.5 h-3.5 text-cyan-200" />
              {isExportingPpt ? "Đang xuất PPT..." : "Xuất PowerPoint (.pptx)"}
            </button>

            {/* Assessment Tools Modal Button */}
            <button
              id="btn-assessment-tools"
              onClick={() => setIsAssessmentModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700/90 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/20 border border-emerald-500/40 cursor-pointer"
              title="Mở toàn bộ công cụ Đánh giá: Rubrics 4 mức độ, Bảng kiểm thao tác, CV 7991, Đánh giá đồng đẳng"
            >
              <Award className="w-3.5 h-3.5 text-emerald-200" />
              Đánh giá Hoạt động (Rubrics)
            </button>

            {/* Pedagogical Methods Button */}
            <button
              id="btn-pedagogy-guide"
              onClick={() => setIsPedagogyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 border border-indigo-500/40 cursor-pointer"
              title="Khám phá và đổi phương pháp dạy học cho bài học này theo giáo trình LLDH"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-200" />
              Phương pháp Dạy học (LLDH)
            </button>

            <button
              id="btn-ai-customize"
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tùy biến với AI
            </button>

            <button
              id="btn-save-activity"
              onClick={onSaveToLibrary}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
              title="Lưu bài dạy vào thư viện của tôi"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu bài giảng
            </button>

            <button
              id="btn-export-word"
              onClick={handleExportWord}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Xuất file Microsoft Word (.doc) theo mẫu giáo án chính thức"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              Tải file Word
            </button>

            <button
              id="btn-copy-activity"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Đã chép!" : "Sao chép"}
            </button>

            <button
              id="btn-print-activity"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
              title="In giáo án hoặc xuất PDF"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-toggle-edit"
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isEditing
                  ? "bg-amber-500/20 text-amber-300 border-amber-500"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
              }`}
              title={isEditing ? "Đang bật chế độ sửa trực tiếp" : "Bật chỉnh sửa văn bản trực tiếp"}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PowerPoint Success Notification Banner */}
        {pptSuccessNotice && (
          <div className="mt-4 p-3 bg-cyan-950/80 border border-cyan-400/50 rounded-xl text-xs text-cyan-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-semibold">{pptSuccessNotice}</span>
            </div>
            <button
              onClick={() => setPptSuccessNotice(null)}
              className="text-cyan-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800/80">
          <button
            id="tab-pedagogy"
            onClick={() => setActiveTab("pedagogy")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "pedagogy"
                ? "bg-sky-500 text-white shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            HĐ Hình thành kiến thức (CV 5512)
          </button>

          <button
            id="tab-theory-path"
            onClick={() => setActiveTab("theory-path")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "theory-path"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <GitFork className="w-4 h-4" />
            Sơ đồ con đường lí thuyết (GQVĐ)
          </button>

          <button
            id="tab-simulation"
            onClick={() => setActiveTab("simulation")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "simulation"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            Thí nghiệm ảo mô phỏng
          </button>

          <button
            id="tab-worksheet"
            onClick={() => setActiveTab("worksheet")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "worksheet"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Phiếu học tập đính kèm
          </button>

          <button
            id="tab-sgv"
            onClick={() => setActiveTab("sgv")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "sgv"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            Lưu ý từ Sách Giáo Viên (SGV)
          </button>

          <button
            id="tab-assessment"
            onClick={() => setActiveTab("assessment")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "assessment"
                ? "bg-rose-600 text-white shadow-sm font-bold"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            Đánh giá năng lực (CV 7991 & Rubrics)
          </button>

          <button
            id="tab-stem"
            onClick={() => setActiveTab("stem")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "stem"
                ? "bg-orange-600 text-white shadow-sm font-bold"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4" />
            Dự án STEM & Vận dụng
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="p-5 md:p-6 bg-slate-50/50">
        {/* TAB 1: 4 BƯỚC CV 5512 */}
        {activeTab === "pedagogy" && (
          <div className="space-y-6">
            {/* HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC MỚI */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold shadow-xs">
                  HĐ
                </span>
                <div>
                  <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                    Hoạt động trọng tâm (Chuẩn 4 bước Công văn 5512)
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {activity.activityTitle}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-lg text-xs font-semibold text-indigo-800 border border-indigo-200">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Thời lượng: {activity.durationMinutes} phút</span>
              </div>
            </div>

            {/* PPDH & MÔ HÌNH DẠY HỌC CHỦ ĐẠO CARD (LLDH Quy Nhơn 2022 & GDPT 2018) */}
            {(() => {
              const currentMethod =
                PEDAGOGICAL_METHODS.find((m) => m.id === activePedagogyId) || PEDAGOGICAL_METHODS[0];
              return (
                <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-4.5 rounded-2xl border border-indigo-700/60 shadow-md flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                        Phương pháp dạy học chủ đạo
                      </span>
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        {currentMethod.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        • {currentMethod.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentMethod.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span>Kĩ thuật dạy học tích cực: <strong className="text-indigo-300">{currentMethod.steps[1]?.suitableTechnique || "Khăn trải bàn"}</strong></span>
                      <span>•</span>
                      <span>Dạng tình huống: <strong className="text-amber-300">{currentMethod.problemSituationType}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPedagogyModalOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Đổi PPDH (8 Phương pháp)
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* a) Mục tiêu (Chuẩn Công văn 5512) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                  <Target className="w-4 h-4 text-sky-600" />
                  a) Mục tiêu của hoạt động dạy học (Chuẩn Công văn 5512/BGDĐT-GDTrH)
                </div>
                <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Năng lực & Phẩm chất học sinh
                </div>
              </div>

              {/* 1. Về kiến thức (nếu có) */}
              {activity.objectives?.knowledge && activity.objectives.knowledge.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-200/90 bg-amber-50/40 space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>1. Về kiến thức:</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {activity.objectives.knowledge.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold mt-0.5">•</span>
                        <div className="leading-relaxed">
                          <MathText inline>{item}</MathText>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 2. Năng lực vật lí */}
                <div className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-sky-950">
                    <Atom className="w-3.5 h-3.5 text-sky-600" />
                    {activity.objectives?.knowledge?.length ? "2. Về năng lực vật lí (đặc thù):" : "1. Về năng lực vật lí:"}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {activity.objectives.physicsCompetencies.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-sky-600 font-bold mt-0.5">•</span>
                        <div className="leading-relaxed">
                          <MathText inline>{comp}</MathText>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Năng lực chung */}
                <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-950">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    {activity.objectives?.knowledge?.length ? "3. Về năng lực chung:" : "2. Về năng lực chung:"}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {activity.objectives.generalCompetencies.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <div className="leading-relaxed">
                          <MathText inline>{comp}</MathText>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Phẩm chất & Năng lực số */}
                <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {activity.objectives?.knowledge?.length ? "4. Về phẩm chất chủ yếu:" : "3. Về phẩm chất chủ yếu:"}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {activity.objectives.qualities.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold mt-0.5">•</span>
                        <div className="leading-relaxed">
                          <MathText inline>{q}</MathText>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {activity.objectives.digitalCompetencies && activity.objectives.digitalCompetencies.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950 mb-1.5">
                        <Laptop className="w-3.5 h-3.5 text-emerald-600" />
                        5. Về năng lực số (Digital):
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {activity.objectives.digitalCompetencies.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold mt-0.5">•</span>
                            <div className="leading-relaxed">
                              <MathText inline>{d}</MathText>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* b) Nội dung & c) Sản phẩm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm mb-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  b) Nội dung (Nhiệm vụ học tập giao cho học sinh)
                </div>
                {isEditing ? (
                  <textarea
                    value={activity.content}
                    onChange={(e) =>
                      onUpdateActivity({ ...activity, content: e.target.value })
                    }
                    rows={4}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                ) : (
                  <MathText className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                    {activity.content}
                  </MathText>
                )}
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  c) Sản phẩm (Kết quả học tập học sinh cần đạt)
                </div>
                {isEditing ? (
                  <textarea
                    value={activity.product}
                    onChange={(e) =>
                      onUpdateActivity({ ...activity, product: e.target.value })
                    }
                    rows={4}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                ) : (
                  <MathText className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                    {activity.product}
                  </MathText>
                )}
              </div>
            </div>

            {/* d) Tổ chức thực hiện 4 bước */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="text-slate-900 font-bold text-sm flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sky-600 text-white text-xs">
                    4
                  </span>
                  d) Tổ chức thực hiện (Chuẩn tiến trình sư phạm 4 bước Công văn 5512)
                </div>
                <div className="flex items-center gap-2">
                  {activity.theoreticalInquiryPath && (
                    <button
                      id="btn-goto-theory-path"
                      onClick={() => setActiveTab("theory-path")}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors cursor-pointer"
                      title="Xem sơ đồ tiến trình giải quyết vấn đề theo con đường lí thuyết"
                    >
                      <GitFork className="w-3.5 h-3.5" />
                      Xem Sơ đồ Con đường Lí thuyết
                    </button>
                  )}
                  {isEditing && (
                    <span className="text-[11px] text-amber-600 font-medium">
                      ✏️ Đang ở chế độ chỉnh sửa trực tiếp
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Bước 1: Chuyển giao nhiệm vụ học tập - ĐƯA TÌNH HUỐNG CÓ VẤN ĐỀ VÀO ĐÂY */}
                <div className="p-4 md:p-5 rounded-xl border border-sky-200 bg-sky-50/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-200/80 pb-2.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-sky-900">
                      <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs shadow-2xs">
                        B1
                      </span>
                      <span>Bước 1: Chuyển giao nhiệm vụ học tập (Đưa tình huống có vấn đề vào tổ chức thực hiện)</span>
                    </div>

                    <button
                      onClick={() => setActiveTab("simulation")}
                      className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <MonitorPlay className="w-3 h-3" />
                      <span>Mở Thí nghiệm ảo kiểm chứng</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* KHỐI TÌNH HUỐNG CÓ VẤN ĐỀ NẰM TRONG BƯỚC 1 */}
                  {(() => {
                    const situation = activity.problematicSituation || {
                      title: `Tình huống xuất phát & Nghịch lí nhận thức: ${topic.lessonTitle}`,
                      scenario: `Giáo viên đưa ra hiện tượng thực tế gây bất ngờ hoặc đối lập với nhận thức trực giác thông thường của học sinh về ${topic.lessonTitle}, tạo mâu thuẫn nhận thức và thúc đẩy nhu cầu tìm hiểu tri thức mới.`,
                      drivingQuestion: `Tại sao lại có sự mâu thuẫn đối nghịch này? Quy luật vật lí nào chi phối và làm thế nào để xây dựng mô hình định lượng giải thích chính xác?`,
                      studentHypotheses: [
                        "Phỏng đoán theo trực giác bề ngoài của học sinh.",
                        "Hồi cứu định luật tương tác cơ học đã biết.",
                        "Xuất hiện mâu thuẫn nhận thức và câu hỏi tự nhiên của học sinh."
                      ],
                      transitionToExperiment: `Giáo viên chuyển giao nhiệm vụ nghiên cứu quy luật bảo toàn cho học sinh.`
                    };

                    return (
                      <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/80 p-4 md:p-4.5 rounded-xl border-2 border-amber-300/90 shadow-2xs space-y-3.5">
                        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                          <Flame className="w-4 h-4 text-amber-600" />
                          <span>TÌNH HUỐNG CÓ VẤN ĐỀ XUẤT PHÁT & MÂU THUẪN NHẬN THỨC TỰ NHIÊN CỦA HỌC SINH</span>
                        </div>

                        {/* Hiện tượng thực tiễn */}
                        <div className="bg-white/95 p-3 rounded-lg border border-amber-200 text-xs space-y-1.5">
                          <div className="font-bold text-amber-950 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-600" />
                            <span>1. Hiện tượng thực tiễn xuất phát:</span>
                          </div>
                          <p className="text-slate-800 leading-relaxed text-justify">
                            {situation.scenario}
                          </p>
                          {situation.mediaHint && (
                            <div className="text-[11px] text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded border border-amber-200/60 italic">
                              🎬 {situation.mediaHint}
                            </div>
                          )}
                        </div>

                        {/* Trích dẫn suy nghĩ tự nhiên của học sinh & Khai thác của giáo viên */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="bg-white/95 p-3 rounded-lg border border-amber-200 space-y-1.5">
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                              2. Khơi gợi & tiếp nhận suy nghĩ tự nhiên của học sinh:
                            </span>
                            <div className="text-slate-800 italic bg-amber-50/60 p-2 rounded border border-amber-200/70 text-[11px] leading-relaxed">
                              “Xe tải nặng hơn rất nhiều so với xe máy nên có lẽ lực xe tải tác dụng lên xe máy lớn hơn lực xe máy tác dụng lên xe tải. Nhưng tại sao sau va chạm, xe máy lại thay đổi vận tốc nhiều hơn rất nhiều so với xe tải? Có phải xe nào có khối lượng nhỏ hơn thì sẽ thay đổi vận tốc nhiều hơn không? Và sự thay đổi chuyển động của hai xe có liên quan gì đến khối lượng và vận tốc của chúng?”
                            </div>
                            <p className="text-[11px] text-slate-600">
                              <em>(Học sinh phát biểu bằng ngôn ngữ suy nghĩ tự nhiên, không gượng ép dùng thuật ngữ hàn lâm)</em>
                            </p>
                          </div>

                          <div className="bg-white/95 p-3 rounded-lg border border-amber-200 space-y-1.5">
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
                              3. Khai thác sư phạm & làm xuất hiện mâu thuẫn nhận thức:
                            </span>
                            <ul className="space-y-1 text-[11px] text-slate-700">
                              <li className="leading-relaxed">
                                • <strong>Giáo viên hỏi căn cứ:</strong> <em>“Các em dựa vào đâu để cho rằng lực tác dụng của hai xe không bằng nhau?”</em> (HS trả lời dựa vào hậu quả xe máy bị nát và văng xa).
                              </li>
                              <li className="leading-relaxed font-medium">
                                • <strong>Đối chiếu Định luật III Newton:</strong>{" "}
                                <MathText inline>{"$\\vec{F}_{12} = -\\vec{F}_{21}$"}</MathText> (hai lực tương tác luôn cùng độ lớn, ngược chiều và cùng giá).
                              </li>
                              <li className="leading-relaxed font-semibold text-rose-800">
                                • <strong>Mâu thuẫn:</strong> Lực tác dụng như nhau nhưng tại sao xe máy lại thay đổi vận tốc nhiều hơn rất nhiều so với xe tải? Kiến thức cũ chưa đủ giải thích!
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Câu hỏi tự nhiên của học sinh (phát hiện vấn đề) */}
                        <div className="bg-gradient-to-r from-orange-500/15 to-amber-500/15 p-3 rounded-lg border border-orange-300 text-xs space-y-1">
                          <div className="font-bold text-orange-950 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
                            <span>4. Câu hỏi phát hiện vấn đề xuất phát tự nhiên từ học sinh:</span>
                          </div>
                          <p className="text-orange-950 font-bold text-xs leading-relaxed italic bg-white/90 p-2 rounded border border-orange-200">
                            “{situation.drivingQuestion}”
                          </p>
                          <p className="text-[11px] text-slate-600 mt-1">
                            <em>→ Giáo viên chuẩn hóa thành vấn đề nghiên cứu khoa học và chuyển giao nhiệm vụ học tập cho các nhóm giải quyết bằng suy luận lí thuyết kết hợp kiểm nghiệm thực nghiệm.</em>
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Chi tiết nội dung chuyển giao nhiệm vụ học tập */}
                  <div className="bg-white p-3.5 rounded-lg border border-sky-200/80 space-y-2">
                    <span className="font-bold text-xs text-sky-950 block">
                      Chi tiết văn bản tiến trình Chuyển giao nhiệm vụ học tập của Giáo viên:
                    </span>
                    {isEditing ? (
                      <textarea
                        value={activity.implementation.step1_transfer}
                        onChange={(e) =>
                          onUpdateActivity({
                            ...activity,
                            implementation: {
                              ...activity.implementation,
                              step1_transfer: e.target.value,
                            },
                          })
                        }
                        rows={6}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    ) : (
                      <MathText className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                        {activity.implementation.step1_transfer}
                      </MathText>
                    )}
                  </div>
                </div>

                {/* Bước 2 */}
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30">
                  <div className="flex items-center gap-2 font-bold text-xs text-blue-900 mb-1.5">
                    <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      B2
                    </span>
                    Bước 2: Thực hiện nhiệm vụ học tập (HS tương tác mô phỏng / SGK)
                  </div>
                  {isEditing ? (
                    <textarea
                      value={activity.implementation.step2_execution}
                      onChange={(e) =>
                        onUpdateActivity({
                          ...activity,
                          implementation: {
                            ...activity.implementation,
                            step2_execution: e.target.value,
                          },
                        })
                      }
                      rows={3}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ) : (
                    <div className="pl-7 space-y-2">
                      <MathText className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                        {activity.implementation.step2_execution}
                      </MathText>
                      {topic.simulationId && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveTab("simulation")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                          >
                            <MonitorPlay className="w-3.5 h-3.5" />
                            Mở trực tiếp Thí nghiệm ảo mô phỏng (Bảng 29.1 & 29.2 SGK Trang 114)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bước 3 */}
                <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/30">
                  <div className="flex items-center gap-2 font-bold text-xs text-purple-900 mb-1.5">
                    <span className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center text-[10px]">
                      B3
                    </span>
                    Bước 3: Báo cáo kết quả và thảo luận (Trình bày số liệu & phản biện)
                  </div>
                  {isEditing ? (
                    <textarea
                      value={activity.implementation.step3_discussion}
                      onChange={(e) =>
                        onUpdateActivity({
                          ...activity,
                          implementation: {
                            ...activity.implementation,
                            step3_discussion: e.target.value,
                          },
                        })
                      }
                      rows={3}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  ) : (
                    <MathText className="text-xs text-slate-700 leading-relaxed text-justify pl-7 whitespace-pre-line">
                      {activity.implementation.step3_discussion}
                    </MathText>
                  )}
                </div>

                {/* Bước 4 */}
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 mb-1.5">
                    <span className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      B4
                    </span>
                    Bước 4: Đánh giá kết quả, kết luận, nhận định (Chốt kiến thức & công thức)
                  </div>
                  {isEditing ? (
                    <textarea
                      value={activity.implementation.step4_conclusion}
                      onChange={(e) =>
                        onUpdateActivity({
                          ...activity,
                          implementation: {
                            ...activity.implementation,
                            step4_conclusion: e.target.value,
                          },
                        })
                      }
                      rows={3}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  ) : (
                    <MathText className="text-xs text-slate-700 leading-relaxed text-justify pl-7 whitespace-pre-line">
                      {activity.implementation.step4_conclusion}
                    </MathText>
                  )}
                </div>
              </div>
            </div>

            {/* D.2. TIẾN TRÌNH CHI TIẾT CÁC TIỂU HOẠT ĐỘNG (HĐ 2.1, 2.2, 2.3) & PHƯƠNG PHÁP DẠY HỌC */}
            {activity.subActivities && activity.subActivities.length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-sky-200/90 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3">
                  <div className="flex items-center gap-2 text-sky-950 font-bold text-sm">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span>D.2. CHI TIẾT CÁC TIỂU HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC & PHƯƠNG PHÁP DẠY HỌC TƯƠNG ỨNG</span>
                  </div>
                  <div className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    Chuẩn phân rã tiến trình sư phạm CV 5512
                  </div>
                </div>

                {/* SubActivities Switcher Tabs */}
                <div className="flex flex-wrap gap-2">
                  {activity.subActivities.map((sub) => {
                    const isSelected = selectedSubActId === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubActId(sub.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-sky-600 text-white shadow-md shadow-sky-600/30 scale-102"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          isSelected ? "bg-white text-sky-700" : "bg-sky-600 text-white"
                        }`}>
                          {sub.id}
                        </span>
                        <span>{sub.code}: {sub.title}</span>
                        {sub.durationMinutes && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            isSelected ? "bg-sky-500 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            {sub.durationMinutes}p
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active SubActivity Detailed View */}
                {(() => {
                  const currentSub = activity.subActivities.find((s) => s.id === selectedSubActId) || activity.subActivities[0];
                  if (!currentSub) return null;

                  return (
                    <div className="space-y-4 pt-1">
                      {/* SubActivity Header Card */}
                      <div className="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-slate-50 p-4 rounded-xl border border-sky-200/80 flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1 max-w-3xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-sky-700 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md shadow-2xs">
                              {currentSub.code}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900">
                              {currentSub.title}
                            </h4>
                            {currentSub.worksheetRef && (
                              <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-purple-200">
                                📋 {currentSub.worksheetRef}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 pt-0.5">
                            Thời lượng phân bổ: <strong>{currentSub.durationMinutes} phút</strong> | Trọng tâm: Xây dựng bản chất vật lí và thiết lập hệ thức toán học.
                          </p>
                        </div>
                      </div>

                      {/* KHỐI PHƯƠNG PHÁP DẠY HỌC (PPDH) ÁP DỤNG */}
                      <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/80 p-4 rounded-xl border-2 border-amber-300 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                          <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs">
                            <Compass className="w-4 h-4 text-amber-600" />
                            <span>PHƯƠNG PHÁP DẠY HỌC (PPDH) ÁP DỤNG TRỌNG TÂM:</span>
                          </div>
                          <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                            {currentSub.pedagogicalMethod.badge}
                          </span>
                        </div>
                        <div className="text-xs text-slate-900 font-bold flex items-center gap-2">
                          <span className="text-amber-700">★ Tên phương pháp:</span>
                          <span className="text-amber-950 font-extrabold underline decoration-amber-400 decoration-2">
                            {currentSub.pedagogicalMethod.name}
                          </span>
                        </div>
                        <div className="bg-white/95 p-3 rounded-lg border border-amber-200 text-xs text-slate-800 space-y-1">
                          <span className="font-bold text-amber-900 block">
                            Cơ sở lí luận sư phạm & lí do lựa chọn phương pháp:
                          </span>
                          <p className="leading-relaxed text-justify italic text-slate-700">
                            "{currentSub.pedagogicalMethod.rationale}"
                          </p>
                        </div>
                      </div>

                      {/* Mục tiêu, Nội dung và Sản phẩm của tiểu hoạt động */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                        {/* Mục tiêu */}
                        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-sky-600" />
                            Mục tiêu cụ thể của {currentSub.code}:
                          </span>
                          <ul className="space-y-1.5 text-slate-700">
                            {currentSub.objectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                                <span className="text-sky-600 font-bold mt-0.5">•</span>
                                <MathText inline>{obj}</MathText>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Nội dung & Sản phẩm */}
                        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                          <div>
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                              Nội dung hoạt động:
                            </span>
                            <p className="text-slate-700 mt-1 leading-relaxed">
                              {currentSub.content}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-slate-200/80">
                            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Sản phẩm học tập:
                            </span>
                            <div className="text-slate-700 mt-1 leading-relaxed">
                              <MathText>{currentSub.product}</MathText>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bảng Tiến trình tổ chức thực hiện các bước sư phạm */}
                      <div className="space-y-2.5 pt-2">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <ClipboardList className="w-4 h-4 text-sky-600" />
                          Tiến trình tổ chức thực hiện các bước sư phạm của {currentSub.code}:
                        </span>

                        <div className="space-y-3">
                          {currentSub.implementationSteps.map((st, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all shadow-2xs space-y-2"
                            >
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                                <span className="px-2 py-0.5 rounded bg-sky-600 text-white text-[11px] font-black">
                                  {st.step}
                                </span>
                                <span className="text-sky-950">{st.title}</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                                <div className="bg-sky-50/50 p-2.5 rounded-lg border border-sky-100">
                                  <span className="font-bold text-sky-900 block mb-1">
                                    👨‍🏫 Hoạt động của Giáo viên:
                                  </span>
                                  <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                                    {st.teacherAction}
                                  </p>
                                </div>

                                <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                                  <span className="font-bold text-emerald-900 block mb-1">
                                    👩‍🎓 Hoạt động của Học sinh:
                                  </span>
                                  <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                                    {st.studentAction}
                                  </p>
                                </div>
                              </div>

                              {st.details && (
                                <div className="mt-2 bg-slate-900 text-slate-100 p-3 rounded-lg text-xs space-y-1 font-mono">
                                  <span className="text-amber-400 font-bold block font-sans">
                                    📌 Chi tiết câu trả lời & công thức chuẩn hóa trong báo cáo thảo luận:
                                  </span>
                                  <div className="text-slate-200 leading-relaxed whitespace-pre-line pl-2">
                                    <MathText>{st.details}</MathText>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB TIẾN TRÌNH CON ĐƯỜNG LÍ THUYẾT (DẠY HỌC PHÁT HIỆN & GIẢI QUYẾT VẤN ĐỀ) */}
        {activeTab === "theory-path" && (
          <div className="space-y-6">
            <TheoreticalInquiryPathView topic={topic} activity={activity} />
          </div>
        )}

        {/* TAB 2: THÍ NGHIỆM ẢO MÔ PHỎNG */}
        {activeTab === "simulation" && (
          <div className="space-y-4">
            {/* Offline download card for teachers */}
            {topic.simulationId && (
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-600/60 rounded-2xl p-4.5 flex flex-wrap items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/40">
                      TIỆN ÍCH DÀNH CHO GIÁO VIÊN
                    </span>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-emerald-400" />
                      Tải Thí nghiệm về máy tính (Chạy Offline 100% không cần vào app)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Tải về 1 file HTML độc lập chứa toàn bộ mô phỏng trực quan, các công tắc điều khiển, bảng số liệu và âm thanh. Thầy/cô chỉ cần lưu vào USB hoặc máy tính, nhấp đúp file là chiếu giảng dạy ngay trên lớp mà không cần mạng Internet và không cần đăng nhập vào web app!
                  </p>
                </div>
                <button
                  onClick={handleDownloadSimulation}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file HTML về máy</span>
                </button>
              </div>
            )}

            {offlineNotice && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-2 shadow-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{offlineNotice}</span>
                </div>
                <button onClick={() => setOfflineNotice(null)} className="text-emerald-400 hover:text-white font-bold">✕</button>
              </div>
            )}

            <SimulationViewer simulationId={topic.simulationId} />
          </div>
        )}

        {/* TAB 3: PHIẾU HỌC TẬP (WORKSHEET) */}
        {activeTab === "worksheet" && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                Tài liệu dạy học đính kèm
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {activity.studentWorksheet.title}
              </h3>
              <div className="text-xs text-slate-500 mt-1">
                Họ và tên HS: ............................................ Lớp: .......... Nhóm: ..........
              </div>
            </div>

            <div className="space-y-4">
              {activity.studentWorksheet.tasks.map((task) => (
                <div key={task.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {task.id}
                    </span>
                    <div className="space-y-2 flex-1">
                      <div className="text-xs font-semibold text-slate-800">
                        <MathText inline>{task.instruction}</MathText>
                      </div>
                      <div className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                        <MathText>{task.prompt}</MathText>
                      </div>
                      {task.expectedAnswer && (
                        <div className="text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/70 leading-relaxed">
                          <strong className="text-emerald-900">Gợi ý đáp án chuẩn:</strong>{" "}
                          <MathText inline>{task.expectedAnswer}</MathText>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                In phiếu học tập này cho học sinh
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: NGHIÊN CỨU SÁCH GIÁO VIÊN (SGV) */}
        {activeTab === "sgv" && (
          <div className="space-y-5">
            {/* Quan niệm sai lầm */}
            <div className="bg-white p-5 rounded-xl border border-rose-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Dự kiến quan niệm sai lầm phổ biến của học sinh (Misconceptions)
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {activity.teacherGuideNotes.commonMisconceptions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                    <span className="text-rose-500 font-bold">⚠️</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lời khuyên sư phạm */}
            <div className="bg-white p-5 rounded-xl border border-sky-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-sm mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Gợi ý phương pháp tổ chức dạy học của tác giả Sách Giáo Viên
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {activity.teacherGuideNotes.pedagogicalAdvice.map((advice, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-sky-50/40 p-2.5 rounded-lg border border-sky-100">
                    <span className="text-sky-600 font-bold">💡</span>
                    <span className="leading-relaxed">{advice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dạy học phân hóa */}
            <div className="bg-white p-5 rounded-xl border border-amber-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Hệ thống câu hỏi gợi mở phân hóa đối tượng học sinh
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200/60">
                  <span className="font-bold text-amber-900 block mb-1">
                    Trợ giúp học sinh còn lúng túng (Hỗ trợ):
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {activity.teacherGuideNotes.differentiationPrompts.support}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/60">
                  <span className="font-bold text-emerald-900 block mb-1">
                    Mở rộng cho học sinh khá / giỏi (Thử thách):
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {activity.teacherGuideNotes.differentiationPrompts.advanced}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ĐÁNH GIÁ NĂNG LỰC & RUBRICS (CV 7991 & TS. DƯƠNG DIỆP THANH HIỀN) */}
        {activeTab === "assessment" && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-5 rounded-2xl border border-rose-800/40 text-white flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  Khung Đánh giá Năng lực Vật lí (Công văn 7991/BGDĐT & TS. Dương Diệp Thanh Hiền)
                </div>
                <h3 className="text-lg font-bold text-white">
                  Hệ thống Phiếu đánh giá theo tiêu chí (Rubrics) & Bảng kiểm quan sát
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Thiết kế phục vụ đánh giá thường xuyên trong suốt 4 bước hoạt động dạy học, tích hợp bảng kiểm an toàn, thang điểm đánh giá đồng đẳng (3-2-1-0-(-1)) và ma trận định kì chuẩn 4 phần của Bộ GD&ĐT.
                </p>
              </div>

              <button
                onClick={() => setIsAssessmentModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                Mở Bộ công cụ Đánh giá Đầy đủ (CV 7991)
              </button>
            </div>

            {/* Rubrics Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  1. Rubric Đánh giá Kĩ năng Thực hành, Thí nghiệm & Khám phá khoa học (4 Mức độ):
                </h4>
                <span className="text-xs text-slate-500 font-medium">Chuẩn thang điểm 10</span>
              </div>

              {ACTIVITY_RUBRICS.slice(0, 2).map((rubric) => (
                <div key={rubric.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{rubric.title}</h5>
                      <p className="text-[11px] text-slate-500">{rubric.description}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      {rubric.applicableFor}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    {rubric.criteria.map((c) => (
                      <div key={c.id} className="border border-slate-200/80 rounded-lg p-3 bg-slate-50/30">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                          <span>{c.criterionName}</span>
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                            Trọng số: {c.weightPercent}%
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                          {c.levels.map((lvl) => (
                            <div
                              key={lvl.levelNumber}
                              className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                                lvl.levelNumber === 4
                                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                                  : lvl.levelNumber === 3
                                  ? "bg-sky-50/70 border-sky-300 text-sky-950"
                                  : lvl.levelNumber === 2
                                  ? "bg-amber-50/70 border-amber-300 text-amber-950"
                                  : "bg-rose-50/70 border-rose-300 text-rose-950"
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between font-bold mb-1">
                                  <span>Mức {lvl.levelNumber}: {lvl.levelName}</span>
                                  <span className="text-[10px] font-semibold opacity-90">{lvl.scoreRange}</span>
                                </div>
                                <p className="text-[11px] leading-relaxed opacity-90">{lvl.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Peer Assessment Guide & Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <Users className="w-4 h-4 text-indigo-600" />
                  2. Đánh giá Đồng đẳng Nhóm (Thang điểm 3 - 2 - 1 - 0 - (-1))
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Trích trang 30 giáo trình TS. Dương Diệp Thanh Hiền (2026) - Đánh giá mức độ đóng góp cá nhân trong sản phẩm chung:
                </p>
                <div className="space-y-1.5 text-xs">
                  {PEER_ASSESSMENT_GUIDE.scoreScale.map((scale) => (
                    <div
                      key={scale.score}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <span className={`w-6 h-6 rounded-md text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                        scale.score === 3
                          ? "bg-emerald-600"
                          : scale.score === 2
                          ? "bg-sky-600"
                          : scale.score === 1
                          ? "bg-amber-600"
                          : "bg-rose-600"
                      }`}>
                        {scale.score}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{scale.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  3. Bảng kiểm Thao tác Thực hành & An toàn Phòng thí nghiệm
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Giáo viên hoặc nhóm trưởng dùng để quan sát trực tiếp trong Bước 2 (Thực hiện nhiệm vụ):
                </p>
                <div className="space-y-2 text-xs">
                  {ACTIVITY_CHECKLISTS[0].items.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/40 border border-emerald-100"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800">{item.task}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DỰ ÁN STEM & VẬN DỤNG THỰC TIỄN */}
        {activeTab === "stem" && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 p-5 rounded-2xl border border-orange-800/40 text-white flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Tài liệu Dạy học STEM trong Vật lí (TS. Dương Diệp Thanh Hiền)
                </div>
                <h3 className="text-lg font-bold text-white">
                  Dự án STEM: {topic.stemActivity || "Chế tạo thiết bị ứng dụng vật lí vào đời sống"}
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Bám sát Kế hoạch giáo dục nhà trường (PPCT 105 tiết) - Quy trình thiết kế kĩ thuật 5 bước: Xác định vấn đề → Nghiên cứu kiến thức nền → Đề xuất giải pháp → Chế tạo thử nghiệm → Đánh giá và chia sẻ.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-400/40 text-amber-200 text-xs font-bold">
                <span>Thời lượng dự án:</span>
                <span className="text-white font-extrabold">{topic.durationDisplay || "2 tiết (90 phút)"}</span>
              </div>
            </div>

            {/* 5 Steps of STEM Design */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                {
                  step: 1,
                  title: "Xác định vấn đề",
                  desc: "Phân tích nhu cầu kỹ thuật thực tiễn đời sống, xác định rõ tiêu chí sản phẩm cần đạt.",
                  color: "border-sky-300 bg-sky-50/50 text-sky-950",
                  badge: "bg-sky-600",
                },
                {
                  step: 2,
                  title: "Nghiên cứu kiến thức nền",
                  desc: "Học sinh vận dụng các định luật vật lí (bảo toàn cơ năng, động lượng, định luật chất khí).",
                  color: "border-indigo-300 bg-indigo-50/50 text-indigo-950",
                  badge: "bg-indigo-600",
                },
                {
                  step: 3,
                  title: "Đề xuất bản vẽ thiết kế",
                  desc: "Phác thảo sơ đồ nguyên lí, lựa chọn vật liệu tái chế, thảo luận tối ưu hóa kích thước.",
                  color: "border-amber-300 bg-amber-50/50 text-amber-950",
                  badge: "bg-amber-600",
                },
                {
                  step: 4,
                  title: "Chế tạo & Thử nghiệm",
                  desc: "Tiến hành lắp ráp mô hình thực nghiệm, vận hành đo lường thông số và ghi nhận dữ liệu.",
                  color: "border-emerald-300 bg-emerald-50/50 text-emerald-950",
                  badge: "bg-emerald-600",
                },
                {
                  step: 5,
                  title: "Chia sẻ & Cải tiến",
                  desc: "Báo cáo trước lớp, giải trình câu hỏi phản biện khoa học, đề xuất hướng nâng cấp.",
                  color: "border-rose-300 bg-rose-50/50 text-rose-950",
                  badge: "bg-rose-600",
                },
              ].map((s) => (
                <div key={s.step} className={`p-3.5 rounded-xl border flex flex-col justify-between ${s.color}`}>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`w-5 h-5 rounded-full ${s.badge} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                        {s.step}
                      </span>
                      <span className="font-bold text-xs">{s.title}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* STEM Rubrics & Material Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <Award className="w-4 h-4 text-amber-600" />
                  Tiêu chí Đánh giá Sản phẩm STEM (Trọng số 100%)
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-sky-50/60 border border-sky-200">
                    <div className="flex justify-between font-bold text-sky-950 mb-0.5">
                      <span>1. Tính chính xác khoa học & Nguyên lí vật lí</span>
                      <span>30%</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">Mô hình vận hành ổn định, thể hiện rõ nguyên lí bảo toàn cơ năng hoặc định luật vật lí tương ứng.</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <div className="flex justify-between font-bold text-emerald-950 mb-0.5">
                      <span>2. Tính sáng tạo & Sử dụng vật liệu tái chế</span>
                      <span>25%</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">Tận dụng vật liệu sẵn có, thân thiện môi trường, chi phí thấp, giải pháp độc đáo.</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200">
                    <div className="flex justify-between font-bold text-indigo-950 mb-0.5">
                      <span>3. Độ bền cơ học & Thẩm mĩ mô hình</span>
                      <span>25%</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">Kết cấu chắc chắn, chịu lực tốt, trình bày gọn gàng, có tính thẩm mĩ cao.</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200">
                    <div className="flex justify-between font-bold text-amber-950 mb-0.5">
                      <span>4. Báo cáo, thuyết trình & Phản biện nhóm</span>
                      <span>20%</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">Trình bày mạch lạc, trả lời thỏa đáng các câu hỏi thắc mắc của giáo viên và các bạn.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <ClipboardList className="w-4 h-4 text-sky-600" />
                  Hồ sơ Học tập & Vật liệu Khuyến nghị
                </div>
                <div className="text-xs space-y-2 text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">Dụng cụ & Vật liệu gợi ý:</span>
                    <p className="leading-relaxed text-[11px]">
                      Bìa carton cứng, chai nhựa rỗng, que gỗ, dây treo, keo nến, thước cuộn, đồng hồ bấm giây (điện thoại thông minh), quả nặng kim loại hoặc đất nặn.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">Nhiệm vụ về nhà của nhóm:</span>
                    <p className="leading-relaxed text-[11px]">
                      Mỗi nhóm hoàn thành 01 bản vẽ thiết kế kỹ thuật (khổ A3) kèm bảng dự trù vật liệu và phân công nhiệm vụ cụ thể cho từng thành viên trước khi tiến hành lắp ráp tại lớp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pedagogical Methods Guide Modal */}
      <PedagogicalMethodsGuideModal
        isOpen={isPedagogyModalOpen}
        onClose={() => setIsPedagogyModalOpen(false)}
        currentTopic={topic}
        currentActivity={activity}
        onApplyMethodToActivity={handleApplyPedagogyMethod}
      />

      {/* Assessment Tools Modal (CV 7991, Rubrics, Checklists, Peer Assessment, CATs) */}
      <AssessmentToolsModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        currentLessonTitle={topic.lessonTitle}
        grade={topic.grade}
      />
    </div>
  );
};

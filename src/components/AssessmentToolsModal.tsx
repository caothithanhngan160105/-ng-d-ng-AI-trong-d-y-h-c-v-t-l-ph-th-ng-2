import React, { useState } from "react";
import {
  X,
  Award,
  CheckSquare,
  Users,
  Clock,
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  FileText,
  BarChart2,
  FolderOpen,
} from "lucide-react";
import {
  ACTIVITY_RUBRICS,
  ACTIVITY_CHECKLISTS,
  PEER_ASSESSMENT_GUIDE,
  CLASSROOM_ASSESSMENT_TECHNIQUES,
  EXAM_MATRICES_7991,
} from "../data/assessmentFramework";
import { GradeLevel } from "../types/physics";

interface AssessmentToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLessonTitle?: string;
  grade?: GradeLevel;
}

export function AssessmentToolsModal({
  isOpen,
  onClose,
  currentLessonTitle = "Bài học Vật lí",
  grade = 10,
}: AssessmentToolsModalProps) {
  const [activeTab, setActiveTab] = useState<
    "rubrics" | "checklists" | "peer_assessment" | "cats" | "cv7991" | "portfolio"
  >("rubrics");

  const [selectedRubricId, setSelectedRubricId] = useState<string>("rubric-experiment");
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>("chk-lab-procedure");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentRubric =
    ACTIVITY_RUBRICS.find((r) => r.id === selectedRubricId) || ACTIVITY_RUBRICS[0];
  const currentChecklist =
    ACTIVITY_CHECKLISTS.find((c) => c.id === selectedChecklistId) || ACTIVITY_CHECKLISTS[0];
  const currentExamMatrix =
    EXAM_MATRICES_7991.find((m) => m.grade === grade) || EXAM_MATRICES_7991[0];

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Award className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  Hệ thống Công cụ Kiểm tra - Đánh giá Năng lực Vật lí
                </h3>
                <span className="bg-emerald-500/40 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/30">
                  Lớp {grade}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Theo Giáo trình TS. Dương Diệp Thanh Hiền (ĐH Quy Nhơn, 2026) & Công văn 7991/BGDĐT-GDTrH (17/12/2024)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-2.5 flex items-center justify-between overflow-x-auto gap-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab("rubrics")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "rubrics"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Rubric Tiêu chí (4 Mức)</span>
            </button>

            <button
              onClick={() => setActiveTab("checklists")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "checklists"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Bảng kiểm (Checklists)</span>
            </button>

            <button
              onClick={() => setActiveTab("peer_assessment")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "peer_assessment"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Đánh giá Đồng đẳng (Thang 3-2-1-0)</span>
            </button>

            <button
              onClick={() => setActiveTab("cats")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "cats"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Kĩ thuật CATs (1 Phút, KWL)</span>
            </button>

            <button
              onClick={() => setActiveTab("cv7991")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "cv7991"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ma trận CV 7991 (Mới 4 phần)</span>
            </button>

            <button
              onClick={() => setActiveTab("portfolio")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "portfolio"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Hồ sơ & Sổ sự kiện</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors font-medium shadow-2xs"
              title="In phiếu đánh giá"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: RUBRICS */}
          {activeTab === "rubrics" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Chọn Rubric mẫu:</span>
                  {ACTIVITY_RUBRICS.map((rubric) => (
                    <button
                      key={rubric.id}
                      onClick={() => setSelectedRubricId(rubric.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                        selectedRubricId === rubric.id
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {rubric.title.replace("Rubric Đánh giá ", "")}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleCopyText(JSON.stringify(currentRubric, null, 2))}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Đã sao chép!" : "Sao chép cấu trúc"}</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <div className="mb-3">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    {currentRubric.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">{currentRubric.description}</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    Phù hợp áp dụng cho: <strong>{currentRubric.applicableFor}</strong> (Ví dụ: {currentLessonTitle})
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                        <th className="p-3 w-1/4 font-bold border-r border-slate-200">
                          Tiêu chí đánh giá & Trọng số
                        </th>
                        <th className="p-2.5 w-[18%] font-bold text-amber-900 bg-amber-50/50 border-r border-slate-200">
                          Mức 1: Cần cố gắng
                          <span className="block text-[10px] font-normal text-amber-700">(0 - 4.5 điểm)</span>
                        </th>
                        <th className="p-2.5 w-[18%] font-bold text-blue-900 bg-blue-50/50 border-r border-slate-200">
                          Mức 2: Đạt
                          <span className="block text-[10px] font-normal text-blue-700">(5.0 - 6.5 điểm)</span>
                        </th>
                        <th className="p-2.5 w-[19%] font-bold text-indigo-900 bg-indigo-50/50 border-r border-slate-200">
                          Mức 3: Khá
                          <span className="block text-[10px] font-normal text-indigo-700">(7.0 - 8.5 điểm)</span>
                        </th>
                        <th className="p-2.5 w-[20%] font-bold text-emerald-900 bg-emerald-50/50">
                          Mức 4: Tốt / Mẫu mực
                          <span className="block text-[10px] font-normal text-emerald-700">(9.0 - 10 điểm)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentRubric.criteria.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                            <div>{c.criterionName}</div>
                            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Trọng số: {c.weightPercent}%
                            </span>
                          </td>
                          {c.levels.map((lvl) => (
                            <td
                              key={lvl.levelNumber}
                              className={`p-2.5 text-[11px] leading-relaxed align-top ${
                                lvl.levelNumber < 4 ? "border-r border-slate-200" : ""
                              } ${
                                lvl.levelNumber === 1
                                  ? "bg-amber-50/20"
                                  : lvl.levelNumber === 2
                                  ? "bg-blue-50/20"
                                  : lvl.levelNumber === 3
                                  ? "bg-indigo-50/20"
                                  : "bg-emerald-50/20"
                              }`}
                            >
                              {lvl.description}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHECKLISTS */}
          {activeTab === "checklists" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-slate-700">Chọn bảng kiểm:</span>
                {ACTIVITY_CHECKLISTS.map((chk) => (
                  <button
                    key={chk.id}
                    onClick={() => setSelectedChecklistId(chk.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      selectedChecklistId === chk.id
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {chk.title}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      {currentChecklist.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{currentChecklist.instructions}</p>
                  </div>
                  <span className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2 py-1 rounded">
                    Tổng: {currentChecklist.items.length} chỉ báo
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentChecklist.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all"
                    >
                      <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-slate-50 text-slate-400 font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-xs text-slate-800 leading-relaxed">{item.task}</div>
                      <div className="flex items-center gap-2 shrink-0 text-[11px] font-semibold">
                        <span className="px-2 py-0.5 rounded border border-emerald-300 text-emerald-700 bg-emerald-50 cursor-pointer">
                          Đạt (✔)
                        </span>
                        <span className="px-2 py-0.5 rounded border border-slate-200 text-slate-500 bg-slate-50 cursor-pointer">
                          Chưa (-)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PEER & SELF ASSESSMENT */}
          {activeTab === "peer_assessment" && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200">
                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  {PEER_ASSESSMENT_GUIDE.title}
                </h4>
                <p className="text-xs text-blue-700 mt-1">
                  Nguồn: {PEER_ASSESSMENT_GUIDE.authorRef}
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                  {PEER_ASSESSMENT_GUIDE.scoreScale.map((sc) => (
                    <div
                      key={sc.score}
                      className="bg-white p-2.5 rounded-lg border border-blue-200 shadow-2xs text-center"
                    >
                      <div className="text-base font-black text-blue-800">
                        {sc.score > 0 ? `+${sc.score}` : sc.score} điểm
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1 leading-snug">{sc.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <h5 className="font-bold text-xs text-slate-900 mb-2">
                  Bảng ma trận Tự đánh giá và Đánh giá đồng đẳng các thành viên trong nhóm:
                </h5>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                        <th className="p-2.5 text-left font-bold border-r border-slate-200">
                          Họ và tên học sinh trong nhóm
                        </th>
                        {PEER_ASSESSMENT_GUIDE.criteria.map((cr) => (
                          <th
                            key={cr.id}
                            className="p-2.5 text-center font-bold border-r border-slate-200 text-[11px]"
                          >
                            {cr.name}
                          </th>
                        ))}
                        <th className="p-2.5 text-center font-bold bg-emerald-50 text-emerald-900">
                          Tổng điểm
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-center">
                      {["1. Nguyễn Văn A (Nhóm trưởng)", "2. Trần Thị B (Thư kí)", "3. Lê Văn C (Thành viên)", "4. Phạm Minh D (Thành viên)"].map(
                        (name, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2.5 text-left font-medium text-slate-900 border-r border-slate-200">
                              {name}
                            </td>
                            {PEER_ASSESSMENT_GUIDE.criteria.map((cr) => (
                              <td key={cr.id} className="p-2 border-r border-slate-200">
                                <span className="inline-block w-7 h-7 leading-7 rounded bg-slate-100 text-slate-700 font-bold text-xs">
                                  {idx === 0 ? "3" : idx === 1 ? "2" : idx === 2 ? "2" : "1"}
                                </span>
                              </td>
                            ))}
                            <td className="p-2 font-bold text-emerald-700 bg-emerald-50/30">
                              {idx === 0 ? "18/18" : idx === 1 ? "14/18" : idx === 2 ? "12/18" : "9/18"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 italic">
                  * Ghi chú cho giáo viên: Sử dụng bảng này giúp chuyển đổi công bằng từ điểm số chung của sản phẩm nhóm sang điểm cá nhân thực tế của từng học sinh, tránh tình trạng "ngồi nhờ" hoặc cào bằng điểm số.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CATS */}
          {activeTab === "cats" && (
            <div className="space-y-4">
              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Kĩ thuật Đánh giá Nhanh trên Lớp học (Classroom Assessment Techniques - CATs)
                </div>
                <p className="text-xs text-amber-800 mt-1">
                  Không dùng để lấy điểm xếp loại mà là chiến lược hỗ trợ giáo viên điều chỉnh nhịp độ giảng dạy ngay lập tức trong từng tiết học (45 phút hoặc 90 phút).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CLASSROOM_ASSESSMENT_TECHNIQUES.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-xs transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {cat.name}
                      </h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {cat.durationMinutes} phút
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Mục đích:</strong> {cat.purpose}
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong>Cách tổ chức:</strong> {cat.procedure}
                    </p>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                      <div className="text-[10px] font-bold text-slate-700 uppercase">Câu hỏi gợi ý:</div>
                      {cat.sampleQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="text-[11px] text-slate-700">
                          {q}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CV 7991 EXAM MATRIX */}
          {activeTab === "cv7991" && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      {currentExamMatrix.examTitle}
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Căn cứ: {currentExamMatrix.regulationsRef} (Thời gian làm bài: {currentExamMatrix.durationMinutes} phút - 1 tiết)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                      Tổng: {currentExamMatrix.totalPoints} điểm
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-200">
                  <span className="text-emerald-800 font-bold">Tỉ lệ cấp độ tư duy:</span>
                  <span className="text-blue-700">Biết: {currentExamMatrix.cognitiveRatio.recognitionPercent}% (4,0 đ)</span>
                  <span className="text-indigo-700">Hiểu: {currentExamMatrix.cognitiveRatio.comprehensionPercent}% (3,0 đ)</span>
                  <span className="text-amber-700">Vận dụng: {currentExamMatrix.cognitiveRatio.applicationPercent}% (3,0 đ)</span>
                </div>
              </div>

              <div className="space-y-3">
                {currentExamMatrix.sections.map((sec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                          {sIdx + 1}
                        </span>
                        {sec.sectionTitle}
                      </h5>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {sec.totalPoints.toFixed(1)} điểm ({sec.questionCount} câu)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{sec.description}</p>
                    <div className="flex items-center gap-4 text-[11px] pt-1 text-slate-500 border-t border-slate-100">
                      <span>Biết: <strong>{sec.scoreBreakdown.recognitionPoints} đ</strong></span>
                      <span>Hiểu: <strong>{sec.scoreBreakdown.comprehensionPoints} đ</strong></span>
                      <span>Vận dụng: <strong>{sec.scoreBreakdown.applicationPoints} đ</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PORTFOLIO & ANECDOTAL */}
          {activeTab === "portfolio" && (
            <div className="space-y-4">
              <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200">
                <h4 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-purple-600" />
                  Hồ sơ Học tập (Portfolio) & Mẫu Sổ Theo dõi Sự kiện Thường nhật (Anecdotal Records)
                </h4>
                <p className="text-xs text-purple-800 mt-1">
                  Đánh giá toàn diện sự tiến bộ của học sinh theo thời gian (Trích trang 40-42 giáo trình TS. Dương Diệp Thanh Hiền 2026).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Cấu trúc Hồ sơ Học tập STEM (Portfolio):
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    <li>1. Cơ cấu tổ chức nhóm, biên bản phân công nhiệm vụ.</li>
                    <li>2. Phiếu học tập cá nhân & phiếu học tập nhóm.</li>
                    <li>3. Bản vẽ thiết kế kĩ thuật & thuyết minh nguyên lí.</li>
                    <li>4. Nhật kí chế tạo sản phẩm, các lần thử nghiệm thất bại và cải tiến.</li>
                    <li>5. Phiếu tự đánh giá cá nhân và đánh giá đồng đẳng (thang 3-2-1-0).</li>
                    <li>6. Sản phẩm hoàn thiện (hình ảnh, video, mô hình thực tế).</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Mẫu Ghi chép Sự kiện Thường nhật của Giáo viên:
                  </h5>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 text-left">
                          <th className="p-2 font-bold">Học sinh / Nhóm</th>
                          <th className="p-2 font-bold">Sự kiện đặc biệt quan sát được</th>
                          <th className="p-2 font-bold">Biện pháp hỗ trợ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-2 font-semibold">Nhóm 1 - Học sinh A</td>
                          <td className="p-2 text-slate-600">Phát hiện ý tưởng sáng tạo dùng ròng rọc kép</td>
                          <td className="p-2 text-emerald-700 font-medium">Khen ngợi trước lớp, hỗ trợ vật liệu</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">Nhóm 3 - Học sinh B</td>
                          <td className="p-2 text-slate-600">Thao tác đấu nhầm cực ampe kế gây kịch kim</td>
                          <td className="p-2 text-amber-700 font-medium">Nhắc nhở an toàn, hướng dẫn lại thang đo</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Công cụ hỗ trợ giáo viên đánh giá năng lực theo chuẩn GDPT 2018
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

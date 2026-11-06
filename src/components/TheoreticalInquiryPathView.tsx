import React from "react";
import { LessonTopic, LessonActivity } from "../types/physics";
import { MathText } from "./MathText";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  FlaskConical,
  Scale,
  BrainCircuit,
  BookOpen,
  Info,
  Check,
  AlertTriangle,
} from "lucide-react";

interface TheoreticalInquiryPathViewProps {
  topic: LessonTopic;
  activity: LessonActivity;
}

export const TheoreticalInquiryPathView: React.FC<TheoreticalInquiryPathViewProps> = ({
  topic,
  activity,
}) => {
  const path = activity.theoreticalInquiryPath;

  if (!path) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
        Chưa có dữ liệu tiến trình con đường lí thuyết cho bài học này.
      </div>
    );
  }

  return (
    <div className="space-y-6" id="theoretical-inquiry-path-view">
      {/* Banner giới thiệu sơ đồ */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-blue-800">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-300 mb-1">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <span>LÍ LUẬN DẠY HỌC VẬT LÍ • PHƯƠNG PHÁP NGHIÊN CỨU BÀI DẠY</span>
        </div>
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">
          {path.diagramTitle}
        </h3>
        <p className="text-xs text-blue-100/90 mt-1 max-w-4xl leading-relaxed">
          Tổ chức quá trình dạy học định hướng phát triển năng lực theo mô hình phát hiện và giải quyết vấn đề bằng con đường suy luận lí thuyết (toán học) kết hợp kiểm nghiệm thực nghiệm, tuân thủ chặt chẽ phong cách văn bản sư phạm học thuật chuẩn mực (hoàn toàn bằng văn viết).
        </p>
      </div>

      {/* KHUNG SƠ ĐỒ CHÍNH (TƯƠNG ĐƯƠNG HÌNH ẢNH SLIDE) */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wide">
              Sơ đồ cấu trúc tiến trình xây dựng kiến thức
            </span>
          </div>
          <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-md border border-indigo-200">
            Mô hình lí luận giải quyết vấn đề
          </span>
        </div>

        {/* Bố cục lưới 2 cột: Cột trái (1 -> 2 -> 3.1 -> 3.2), Cột phải (4. Rút ra kết luận) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* CỘT TRÁI: TIẾN TRÌNH TỪ VẤN ĐỀ ĐẾN KIỂM NGHIỆM THÍ NGHIỆM (7 CỘT) */}
          <div className="lg:col-span-7 space-y-4">
            {/* KHỐI 1: LÀM NẢY SINH VẤN ĐỀ */}
            <div className="p-4 rounded-xl bg-amber-50/70 border-2 border-amber-300 text-slate-800 relative">
              <div className="text-xs font-bold text-amber-900 uppercase flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                  1
                </span>
                {path.step1_problem_arising.title}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed text-justify mb-2">
                {path.step1_problem_arising.description}
              </p>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/70 text-[11.5px] text-slate-700 space-y-1">
                <div className="font-semibold text-amber-900">Kiến thức cũ và kinh nghiệm xuất phát:</div>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  {path.step1_problem_arising.priorKnowledgeAndExperience.map((item, idx) => (
                    <li key={idx} className="text-slate-700">
                      <MathText inline>{item}</MathText>
                    </li>
                  ))}
                </ul>
                <div className="pt-1 text-slate-800 font-medium italic">
                  Hiện tượng: <MathText inline>{path.step1_problem_arising.phenomenon}</MathText>
                </div>
              </div>
            </div>

            {/* Mũi tên chỉ xuống */}
            <div className="flex justify-center -my-1">
              <div className="flex flex-col items-center text-indigo-500">
                <div className="w-0.5 h-4 bg-indigo-300"></div>
                <ArrowDown className="w-4 h-4 -mt-1 text-indigo-600" />
              </div>
            </div>

            {/* KHỐI 2: PHÁT HIỆN VẤN ĐỀ CẦN GIẢI QUYẾT */}
            <div className="p-4 rounded-xl bg-orange-50/70 border-2 border-orange-300 text-slate-800">
              <div className="text-xs font-bold text-orange-950 uppercase flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                {path.step2_problem_statement.title}
              </div>
              <div className="bg-white/90 p-3 rounded-lg border border-orange-200 text-xs text-orange-950 font-semibold leading-relaxed">
                "{path.step2_problem_statement.drivingQuestion}"
              </div>
              <div className="mt-2 text-[11px] text-slate-600 italic">
                Mục tiêu khoa học: {path.step2_problem_statement.scientificGoal}
              </div>
            </div>

            {/* Mũi tên chỉ xuống */}
            <div className="flex justify-center -my-1">
              <div className="flex flex-col items-center text-indigo-500">
                <div className="w-0.5 h-4 bg-indigo-300"></div>
                <ArrowDown className="w-4 h-4 -mt-1 text-indigo-600" />
              </div>
            </div>

            {/* KHỐI 3: GIẢI QUYẾT VẤN ĐỀ */}
            <div className="p-4 rounded-xl bg-blue-50/40 border-2 border-blue-300 space-y-4">
              <div className="text-xs font-bold text-blue-950 uppercase flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                {path.step3_problem_solving.title}
              </div>

              {/* 3.1: Suy luận lí thuyết */}
              <div className="p-3.5 bg-white rounded-xl border border-blue-200 text-xs space-y-2">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                  {path.step3_problem_solving.step3_1_theoretical_reasoning.title}
                </div>

                <div className="space-y-1.5 text-slate-700">
                  <div className="font-semibold text-slate-900 text-[11px]">
                    a) Xác định các kiến thức đã biết cần vận dụng:
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11.5px]">
                    {path.step3_problem_solving.step3_1_theoretical_reasoning.priorKnowledgeApplied.map((pk, idx) => (
                      <li key={idx}>
                        <MathText inline>{pk}</MathText>
                      </li>
                    ))}
                  </ul>

                  <div className="font-semibold text-slate-900 text-[11px] pt-1">
                    b) Cách thức vận dụng và tiến hành suy luận toán học:
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 space-y-2 text-slate-800">
                    {path.step3_problem_solving.step3_1_theoretical_reasoning.reasoningMethod.map((step, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs text-[11.5px] leading-relaxed">
                        <MathText>{step}</MathText>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50/90 p-3 rounded-xl border-2 border-blue-300 text-blue-950 text-xs">
                    <div className="font-bold uppercase tracking-wide text-blue-900 text-[10px] mb-1">
                      ★ Kết quả lí thuyết:
                    </div>
                    <MathText className="font-bold text-[12.5px] text-blue-950">{path.step3_problem_solving.step3_1_theoretical_reasoning.theoreticalResult}</MathText>
                  </div>
                </div>
              </div>

              {/* CÂU HỎI CHUYỂN TIẾP (CẦU NỐI KẾT NỐI 3.1 VỚI 3.2) */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-0.5 rounded-xl shadow-xs">
                <div className="bg-white p-3 rounded-[10px] flex items-center gap-2.5 text-xs">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="font-bold text-amber-950 italic">
                    "{path.step3_problem_solving.transitionQuestion}"
                  </div>
                </div>
              </div>

              {/* 3.2: Kiểm nghiệm nhờ thí nghiệm */}
              <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-emerald-600" />
                  {path.step3_problem_solving.step3_2_experimental_verification.title}
                </div>

                <div className="space-y-2 text-slate-700 text-[11.5px]">
                  <div>
                    <span className="font-semibold text-slate-900">a) Xác định nội dung cần kiểm nghiệm: </span>
                    <MathText inline>{path.step3_problem_solving.step3_2_experimental_verification.verificationContent.join(" ")}</MathText>
                  </div>

                  <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200/80 space-y-1.5">
                    <div className="font-semibold text-emerald-950">b) Thiết kế phương án thí nghiệm kiểm nghiệm:</div>
                    <div className="space-y-1 pl-1 text-[11px]">
                      <div>
                        <strong>- Dụng cụ: </strong>
                        {path.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.apparatus.join("; ")}
                      </div>
                      <div>
                        <strong>- Bố trí: </strong>
                        {path.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.arrangement}
                      </div>
                      <div>
                        <strong>- Tiến hành: </strong>
                        <MathText inline>{path.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.procedure}</MathText>
                      </div>
                      <div>
                        <strong>- Thu thập dữ liệu: </strong>
                        {path.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.dataToCollect.map((item, i) => (
                          <div key={i} className="pl-2">• <MathText inline>{item}</MathText></div>
                        ))}
                      </div>
                      <div>
                        <strong>- Xử lí số liệu: </strong>
                        <MathText inline>{path.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.dataProcessing}</MathText>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-900">c) Thực hiện thí nghiệm: </span>
                    <span>{path.step3_problem_solving.step3_2_experimental_verification.experimentalExecution.join(" ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KHỐI 4 - RÚT RA KẾT LUẬN & ĐỐI CHIẾU (5 CỘT) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-purple-50/50 border-2 border-purple-300 text-slate-800 space-y-3">
              <div className="text-xs font-bold text-purple-950 uppercase flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px] font-bold">
                  4
                </span>
                {path.step4_conclusion.title}
              </div>

              {/* Đối chiếu kết quả */}
              <div className="bg-white p-3 rounded-lg border border-purple-200 text-xs text-slate-700 leading-relaxed">
                <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-purple-600" />
                  Đối chiếu kết quả thí nghiệm với suy luận lí thuyết:
                </div>
                <MathText className="text-[11.5px]">{path.step4_conclusion.comparisonOutcome}</MathText>
              </div>

              {/* 2 Khả năng xảy ra theo đúng sơ đồ */}
              <div className="space-y-2.5">
                {/* Khả năng 1: Phù hợp -> KIẾN THỨC MỚI */}
                <div className="bg-emerald-50 p-3 rounded-lg border-2 border-emerald-400 text-xs text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Khả năng 1: Kết quả thí nghiệm PHÙ HỢP với lí thuyết:
                  </div>
                  <div className="text-[11.5px] leading-relaxed bg-white/80 p-2 rounded border border-emerald-200/60 font-medium">
                    <MathText>{path.step4_conclusion.caseMatchNewKnowledge}</MathText>
                  </div>
                </div>

                {/* Khả năng 2: Không phù hợp -> Đề xuất giả thuyết & kiểm tra */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 text-xs text-slate-700">
                  <div className="font-bold flex items-center gap-1.5 text-slate-800 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Khả năng 2: Nếu kết quả thí nghiệm KHÔNG phù hợp:
                  </div>
                  <MathText className="text-[11px] leading-relaxed text-slate-600">
                    {path.step4_conclusion.caseMismatchHypothesisRevision}
                  </MathText>
                </div>
              </div>

              {/* Trường hợp riêng, giới hạn và phạm vi áp dụng */}
              <div className="bg-white p-3 rounded-lg border border-purple-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-600" />
                  Trường hợp riêng, trường hợp giới hạn & Phạm vi áp dụng:
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-700">
                  {path.step4_conclusion.limitingCasesAndScope.map((scope, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <MathText inline>{scope}</MathText>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lưu ý sư phạm về văn viết */}
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-600" />
                Quy chuẩn văn bản kế hoạch bài dạy:
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Toàn bộ tiến trình được xây dựng theo thể thức văn viết chuyên môn (không sử dụng khẩu ngữ / văn thoại mô phỏng đối đáp), định hình rõ hành động của giáo viên và thao tác trí tuệ của học sinh qua từng giai đoạn logic khoa học.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { LessonTopic, LessonActivity, BookSeries } from "../types/physics";
import { X, Sparkles, Wand2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface AiGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: LessonTopic;
  bookSeries: BookSeries;
  onApplyActivity: (newActivity: LessonActivity) => void;
}

export const AiGenerationModal: React.FC<AiGenerationModalProps> = ({
  isOpen,
  onClose,
  topic,
  bookSeries,
  onApplyActivity,
}) => {
  const [pedagogicalStyle, setPedagogicalStyle] = useState<string>("cv5512");
  const [duration, setDuration] = useState<number>(25);
  const [focusSim, setFocusSim] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-lesson-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          bookSeries,
          pedagogicalStyle,
          targetDurationMinutes: duration,
          includeSimulationGuide: focusSim,
          customTeacherPrompt: customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server trả về mã lỗi: ${response.status}`);
      }

      const data = await response.json();
      if (data.activity) {
        onApplyActivity(data.activity);
        onClose();
      } else {
        throw new Error("Không nhận được dữ liệu hoạt động hợp lệ từ AI.");
      }
    } catch (err: any) {
      console.error("Lỗi sinh hoạt động bằng AI:", err);
      setErrorMsg(
        err.message || "Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại cấu hình."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Tùy biến Hoạt động với AI Sư phạm</h3>
              <p className="text-xs text-sky-200">
                Nghiên cứu SGK mới, SGV Vật lí {topic.grade} & Chuẩn hóa Công văn 5512
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 md:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Target Lesson Banner */}
          <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-medium">Bài học đang chọn:</span>
              <div className="font-bold text-sky-900 mt-0.5">{topic.lessonTitle}</div>
            </div>
            <span className="bg-sky-600 text-white px-2 py-0.5 rounded text-[11px] font-semibold">
              Lớp {topic.grade}
            </span>
          </div>

          {/* Pedagogical Style Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mô hình / Phong cách sư phạm mong muốn:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "cv5512", label: "Chuẩn 4 bước CV 5512 (Khám phá - Chốt kiến thức)" },
                { id: "model_5e", label: "Mô hình 5E (Engage - Explore - Explain - Elaborate)" },
                { id: "stem", label: "Định hướng STEM & Ứng dụng thực tiễn đời sống" },
                { id: "station", label: "Dạy học theo trạm (Station Rotation)" },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setPedagogicalStyle(style.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    pedagogicalStyle === style.id
                      ? "border-sky-600 bg-sky-50/80 font-bold text-sky-900 shadow-2xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Simulation focus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Thời lượng dự kiến:</span>
                <span className="text-sky-600 font-mono">{duration} phút</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                step="5"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Phù hợp tiết 1 hoặc tiết 2 của bài học
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={focusSim}
                  onChange={(e) => setFocusSim(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  Tích hợp hướng dẫn Thí nghiệm ảo / Thí nghiệm trực quan
                </span>
              </label>
            </div>
          </div>

          {/* Custom prompt textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Yêu cầu hoặc ghi chú riêng của Thầy/Cô (Tùy chọn):
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="VD: Lớp có nhiều học sinh thích lập trình/thực hành; hãy thêm bài toán gắn với đời sống thực tế..."
              rows={3}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/80 transition-colors"
          >
            Hủy bỏ
          </button>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang biên soạn theo CV 5512 & SGV...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Tạo hoạt động mới với AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

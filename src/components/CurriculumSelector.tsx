import React from "react";
import { GradeLevel, LessonTopic, BookSeries } from "../types/physics";
import { BookOpen, Search, Sparkles, MonitorPlay } from "lucide-react";

interface CurriculumSelectorProps {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  selectedBookSeries: BookSeries;
  onSelectBookSeries: (series: BookSeries) => void;
  lessons: LessonTopic[];
  selectedLessonId: string;
  onSelectLesson: (topic: LessonTopic) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CurriculumSelector: React.FC<CurriculumSelectorProps> = ({
  selectedGrade,
  onSelectGrade,
  selectedBookSeries,
  onSelectBookSeries,
  lessons,
  selectedLessonId,
  onSelectLesson,
  searchQuery,
  onSearchChange,
}) => {
  // Filter lessons based on grade and search query
  const filteredLessons = lessons.filter((lesson) => {
    const matchesGrade = lesson.grade === selectedGrade;
    const matchesQuery =
      searchQuery.trim() === "" ||
      lesson.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.defaultActivity.activityTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesQuery;
  });

  // Group by chapter
  const chaptersMap = new Map<string, LessonTopic[]>();
  filteredLessons.forEach((l) => {
    const key = `${l.chapterNumber} - ${l.chapterTitle}`;
    if (!chaptersMap.has(key)) {
      chaptersMap.set(key, []);
    }
    chaptersMap.get(key)!.push(l);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 md:p-5">
      {/* Grade Selector Tabs */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          1. Chọn Khối lớp (CT GDPT 2018):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {([10, 11, 12] as GradeLevel[]).map((grade) => {
            const isSelected = selectedGrade === grade;
            return (
              <button
                key={grade}
                id={`btn-grade-${grade}`}
                onClick={() => onSelectGrade(grade)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                  isSelected
                    ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <span>Vật lí {grade}</span>
                <span className={`text-[10px] font-normal mt-0.5 line-clamp-1 text-center ${isSelected ? "text-sky-100" : "text-slate-400"}`}>
                  {grade === 10
                    ? "Cơ học & Năng lượng"
                    : grade === 11
                    ? "Dao động, Sóng & Điện"
                    : "Nhiệt, Khí & Hạt nhân"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Book Series Banner & Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 pt-3 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            2. Bộ sách Giáo khoa (Chuẩn cố định):
          </label>
          <div className="w-full bg-sky-50/80 border border-sky-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span className="text-sky-950 line-clamp-1">
                Kết nối tri thức với cuộc sống (NXB GDVN)
              </span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
              Cố định
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Tìm kiếm bài học / chủ đề:
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="VD: Động lượng, Gia tốc, Newton..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>3. Danh mục bài dạy (Click để tải hoạt động 5512):</span>
          <span className="text-[11px] font-normal text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
            {filteredLessons.length} bài
          </span>
        </label>

        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {Array.from(chaptersMap.entries()).map(([chapterTitle, chapterLessons]) => (
            <div key={chapterTitle} className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                {chapterTitle}
              </div>
              <div className="space-y-1 pl-1">
                {chapterLessons.map((lesson) => {
                  const isSelected = lesson.id === selectedLessonId;
                  return (
                    <button
                      key={lesson.id}
                      id={`btn-lesson-${lesson.id}`}
                      onClick={() => onSelectLesson(lesson)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-2 border ${
                        isSelected
                          ? "bg-sky-50/90 text-sky-900 border-sky-300 font-semibold shadow-xs"
                          : "bg-white hover:bg-slate-50 text-slate-700 border-slate-100"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <BookOpen
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isSelected ? "text-sky-600" : "text-slate-400"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="leading-snug font-bold">{lesson.lessonTitle}</span>
                            {lesson.ppctSessions && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                                {lesson.ppctSessions}
                              </span>
                            )}
                            {lesson.durationDisplay && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                                {lesson.durationDisplay}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                            {lesson.defaultActivity.activityTitle}
                          </div>
                          {lesson.stemActivity && (
                            <div className="mt-1 flex items-center gap-1">
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                Dự án STEM: {lesson.stemActivity}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {lesson.simulationId && (
                        <span
                          className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                          title="Có tích hợp thí nghiệm ảo mô phỏng tương tác"
                        >
                          <MonitorPlay className="w-3 h-3 text-emerald-600" />
                          Lab ảo
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredLessons.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              Không tìm thấy bài học phù hợp với từ khóa tìm kiếm.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

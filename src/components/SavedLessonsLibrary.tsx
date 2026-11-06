import React, { useState } from "react";
import { LessonTopic, LessonActivity, BookSeries } from "../types/physics";
import {
  FolderKanban,
  BookOpen,
  Calendar,
  Trash2,
  ExternalLink,
  Download,
  Share2,
  FileText,
  Search,
  Sparkles,
  Link,
  BookmarkCheck,
} from "lucide-react";
import { exportActivityToWordDoc } from "../utils/exportWord";

export interface SavedLessonItem {
  id: string;
  savedAt: string;
  topic: LessonTopic;
  activity: LessonActivity;
  bookSeries: BookSeries;
  teacherNotes?: string;
  tags?: string[];
}

interface SavedLessonsLibraryProps {
  savedLessons: SavedLessonItem[];
  onLoadLesson: (item: SavedLessonItem) => void;
  onDeleteLesson: (id: string) => void;
  onUpdateLessonNotes: (id: string, notes: string) => void;
}

export const SavedLessonsLibrary: React.FC<SavedLessonsLibraryProps> = ({
  savedLessons,
  onLoadLesson,
  onDeleteLesson,
  onUpdateLessonNotes,
}) => {
  const [filterGrade, setFilterGrade] = useState<number | "all">("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"my_lessons" | "online_resources">("my_lessons");

  const filtered = savedLessons.filter((item) => {
    if (!item || !item.topic) return false;
    const matchesGrade = filterGrade === "all" || item.topic.grade === filterGrade;
    const matchesQuery =
      searchFilter.trim() === "" ||
      (item.topic.lessonTitle && item.topic.lessonTitle.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (item.activity?.activityTitle && item.activity.activityTitle.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (item.teacherNotes && item.teacherNotes.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesGrade && matchesQuery;
  });

  // Online teaching physics resources
  const onlineResources = [
    {
      title: "Kho học liệu số Bộ Giáo dục và Đào tạo",
      desc: "Học liệu điện tử, video bài giảng và tài liệu tập huấn SGK Vật lí 10, 11, 12 mới nhất.",
      url: "https://igiaoduc.vn",
      category: "Cổng chính thức",
    },
    {
      title: "PhET Interactive Simulations (Đại học Colorado)",
      desc: "Hơn 100 mô phỏng thí nghiệm ảo tương tác về Cơ học, Sóng, Điện từ học và Vật lí lượng tử.",
      url: "https://phet.colorado.edu/vi/simulations/filter?subjects=physics&type=html",
      category: "Thí nghiệm ảo",
    },
    {
      title: "Tập huấn và Sách Giáo viên Điện tử",
      desc: "NXB Giáo dục Việt Nam & NXB ĐH Sư phạm - Xem trực tuyến sách học sinh & sách giáo viên.",
      url: "https://taphuan.nxbgd.vn",
      category: "Sách giáo khoa & SGV",
    },
    {
      title: "Công văn 5512 & Hướng dẫn sinh hoạt chuyên môn 3456",
      desc: "Cẩm nang hướng dẫn xây dựng kế hoạch bài dạy theo định hướng phát triển phẩm chất, năng lực.",
      url: "https://moet.gov.vn",
      category: "Văn bản chỉ đạo",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-5 md:p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-sky-400" />
            Quản lí Bài giảng & Tài nguyên Giảng dạy Vật lí
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Lưu trữ giáo án CV 5512 cá nhân, phân loại theo khối lớp và liên kết nguồn tài nguyên trực tuyến
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("my_lessons")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === "my_lessons" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Giáo án của tôi ({savedLessons.length})
          </button>
          <button
            onClick={() => setActiveTab("online_resources")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === "online_resources" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Tài nguyên trực tuyến (BGD&ĐT)
          </button>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {activeTab === "my_lessons" ? (
          <div>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              {/* Grade buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium mr-1">Khối:</span>
                {(["all", 10, 11, 12] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setFilterGrade(g)}
                    className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                      filterGrade === g
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {g === "all" ? "Tất cả" : `Lớp ${g}`}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Lọc bài giảng đã lưu..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* List of Saved Lessons */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="bg-sky-50 text-sky-700 border border-sky-200/80 px-2 py-0.5 rounded text-[10px] font-bold">
                          Vật lí {item.topic.grade}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.savedAt}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                        {item.topic.lessonTitle}
                      </h4>
                      <p className="text-xs text-slate-600 mb-2">
                        <strong>Hoạt động:</strong> {item.activity.activityTitle}
                      </p>

                      <div className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {item.activity.content}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onLoadLesson(item)}
                        className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Mở bài giảng này
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => exportActivityToWordDoc(item.topic, item.activity, item.bookSeries)}
                          title="Tải file Word (.doc)"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteLesson(item.id)}
                          title="Xóa khỏi kho lưu trữ"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">
                  Chưa có bài giảng nào được lưu trong kho của Thầy/Cô.
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Hãy chọn bài học bất kì ở mục Soạn bài và bấm nút <strong>"Lưu bài giảng"</strong> để quản lí tại đây.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ONLINE RESOURCES TAB */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onlineResources.map((res, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {res.category}
                    </span>
                    <Link className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{res.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{res.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Truy cập cổng tài nguyên <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

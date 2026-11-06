// Types for Physics Teacher Activity Builder (CV 5512, 3456 & 7991)

export type GradeLevel = 10 | 11 | 12;

export type BookSeries = "ket_noi_tri_thuc" | "canh_dieu" | "chan_troi_sang_tao" | "chung_2018";

export interface StudentWorksheetTask {
  id: number;
  instruction: string;
  prompt: string;
  expectedAnswer?: string;
}

export interface StudentWorksheet {
  title: string;
  code?: string;
  tasks: StudentWorksheetTask[];
}

export interface TeacherGuideNotes {
  commonMisconceptions: string[];
  pedagogicalAdvice: string[];
  differentiationPrompts: {
    support: string;
    advanced: string;
  };
}

export interface ActivityImplementation5512 {
  step1_transfer: string; // Bước 1: Chuyển giao nhiệm vụ học tập
  step2_execution: string; // Bước 2: Thực hiện nhiệm vụ học tập
  step3_discussion: string; // Bước 3: Báo cáo kết quả và thảo luận
  step4_conclusion: string; // Bước 4: Đánh giá kết quả, thực hiện nhiệm vụ học tập (kết luận, chuẩn hóa)
}

export interface ActivityObjectives {
  knowledge?: string[]; // Kiến thức trọng tâm
  physicsCompetencies: string[]; // Năng lực vật lí (Nhận thức, tìm hiểu thế giới tự nhiên, vận dụng)
  generalCompetencies: string[]; // Năng lực chung (Tự chủ, giao tiếp hợp tác, giải quyết vấn đề)
  digitalCompetencies?: string[]; // Năng lực số (Digital Competence - Khai thác thiết bị số, cảm biến, bảng tính, mô phỏng số)
  qualities: string[]; // Phẩm chất (Chăm chỉ, trung thực, trách nhiệm)
}

export interface TeachingEquipment5512 {
  teacherEquipment: string[]; // Thiết bị dạy học và học liệu của giáo viên (phần mềm số, máy chiếu, PHT...)
  studentEquipment: string[]; // Thiết bị học tập của học sinh (thiết bị số, SGK KNTT, dụng cụ thí nghiệm...)
}

export interface Full5512Activities {
  activity1_warmup: {
    title: string;
    objectives: string;
    content: string;
    product: string;
    implementation: string;
  };
  activity3_practice: {
    title: string;
    objectives: string;
    content: string;
    product: string;
    implementation: string;
  };
  activity4_application: {
    title: string;
    objectives: string;
    content: string;
    product: string;
    implementation: string;
  };
}

export interface ProblematicSituation {
  title: string;
  scenario: string; // Tình huống thực tế / Nghịch lí gây mâu thuẫn nhận thức
  mediaHint?: string; // Video/hình ảnh/thí nghiệm nhanh minh họa
  drivingQuestion: string; // Câu hỏi then chốt kích thích hứng thú học sinh
  studentHypotheses: string[]; // Dự đoán / Phỏng đoán ban đầu của học sinh
  transitionToExperiment: string; // Cầu nối chuyển giao sang thí nghiệm/khám phá
}

export interface TheoreticalInquiryPath {
  diagramTitle: string; // Tiêu đề sơ đồ tiến trình
  step1_problem_arising: {
    title: string;
    description: string;
    priorKnowledgeAndExperience: string[];
    phenomenon: string;
  };
  step2_problem_statement: {
    title: string;
    drivingQuestion: string;
    scientificGoal: string;
  };
  step3_problem_solving: {
    title: string;
    step3_1_theoretical_reasoning: {
      title: string;
      priorKnowledgeApplied: string[];
      reasoningMethod: string[];
      theoreticalResult: string;
    };
    transitionQuestion: string; // "Làm thế nào để kiểm nghiệm nhờ thí nghiệm kết quả đã tìm được từ suy luận lý thuyết?"
    step3_2_experimental_verification: {
      title: string;
      verificationContent: string[];
      experimentalDesign: {
        apparatus: string[];
        arrangement: string;
        procedure: string;
        dataToCollect: string[];
        dataProcessing: string;
      };
      experimentalExecution: string[];
    };
  };
  step4_conclusion: {
    title: string;
    comparisonOutcome: string;
    caseMatchNewKnowledge: string;
    caseMismatchHypothesisRevision: string;
    limitingCasesAndScope: string[];
  };
}

export interface SubActivityStep5512 {
  step: string; // "Bước 1", "Bước 2", "Bước 3", "Bước 4", "Bước 5", "Bước 6"
  title: string; // e.g. "Chuyển giao nhiệm vụ học tập"
  teacherAction: string;
  studentAction?: string;
  details?: string;
}

export interface SubActivity5512 {
  id: string; // "2.1", "2.2", "2.3"
  code: string; // "HĐ 2.1", "HĐ 2.2", "HĐ 2.3"
  title: string; // Tiêu đề tiểu hoạt động
  pedagogicalMethod: {
    name: string; // Tên phương pháp dạy học áp dụng
    shortCode: string; // Mã viết tắt
    badge: string; // Huy hiệu hiển thị
    rationale: string; // Cơ sở lí luận và ưu điểm của phương pháp
  };
  durationMinutes?: number;
  objectives: string[]; // Mục tiêu cụ thể
  content: string; // Nội dung nhiệm vụ
  product: string; // Sản phẩm học tập
  implementationSteps: SubActivityStep5512[]; // Tiến trình các bước chi tiết
  worksheetRef?: string; // Phiếu học tập đính kèm (PHT 1, PHT 2, PHT 3, 4)
}

export interface LessonActivity {
  id: string;
  activityTitle: string;
  durationMinutes: number;
  objectives?: ActivityObjectives;
  problematicSituation?: ProblematicSituation;
  theoreticalInquiryPath?: TheoreticalInquiryPath;
  content: string; // Nội dung nhiệm vụ
  product: string; // Sản phẩm học tập
  implementation: ActivityImplementation5512;
  studentWorksheet: StudentWorksheet;
  teacherGuideNotes: TeacherGuideNotes;
  equipment?: TeachingEquipment5512;
  fullActivities?: Full5512Activities;
  subActivities?: SubActivity5512[]; // Các tiểu hoạt động chi tiết (HĐ 2.1, 2.2, 2.3)
  simulationId?: string; // ID of virtual simulation to launch
  tags?: string[];
  assessmentRubricId?: string; // ID of matching rubric
}

export interface LessonTopic {
  id: string;
  grade: GradeLevel;
  chapterNumber: number;
  chapterTitle: string;
  lessonNumber: number;
  lessonTitle: string;
  estimatedPeriods: number; // e.g. 1, 2, 3, 4
  periodsCount?: number;
  ppctSessions?: string; // e.g. "Tiết 1, 2" or "Tiết 63-64"
  durationDisplay?: string; // e.g. "1 tiết (45 phút)", "2 tiết (90 phút)", "3 tiết (135 phút)", "4 tiết (180 phút)"
  standardCurriculumCode?: string; // VD: VL10.C2.B1
  defaultActivity: LessonActivity;
  simulationId?: string;
  stemActivity?: string; // Hoạt động giáo dục STEM gắn kèm (từ PPCT KHDH)
  digitalCompetencies?: string[]; // Năng lực số phát triển (1.1.NC1a, 3.1.NC1b, 5.3.NC1b, v.v.)
  experiments?: string[]; // Thí nghiệm/thực hành tương ứng
  assessmentRubricId?: string; // ID of matching rubric
}

export interface SavedLessonPlan {
  id: string;
  title: string;
  grade: GradeLevel;
  chapterTitle: string;
  lessonTitle: string;
  bookSeries: BookSeries;
  createdAt: string;
  updatedAt: string;
  activity: LessonActivity;
  teacherName?: string;
  schoolName?: string;
  classApplied?: string;
}

export type PedagogicalMethod = 
  | "inquiry_simulation" 
  | "5e_model" 
  | "stem_oriented" 
  | "station_rotation" 
  | "jigsaw_collaborative";

export interface SimulationMeta {
  id: string;
  name: string;
  grade: GradeLevel;
  topic: string;
  description: string;
  keyConcepts: string[];
}

// -------------------------------------------------------------
// CÁC CÔNG CỤ ĐÁNH GIÁ (GIÁO TRÌNH TS. DƯƠNG DIỆP THANH HIỀN 2026 & CV 7991)
// -------------------------------------------------------------

export interface RubricLevel {
  levelNumber: 1 | 2 | 3 | 4;
  levelName: string; // "Cần cố gắng" | "Đạt" | "Khá" | "Tốt / Mẫu mực"
  scoreRange: string; // e.g. "0 - 4 điểm", "5 - 6.5 điểm", "7 - 8.5 điểm", "9 - 10 điểm"
  description: string;
}

export interface RubricCriterion {
  id: string;
  criterionName: string;
  weightPercent: number; // e.g. 25%
  levels: RubricLevel[];
}

export interface ActivityRubric {
  id: string;
  title: string;
  category: "experiment" | "stem_design" | "stem_product" | "presentation" | "group_work";
  applicableFor: string;
  description: string;
  criteria: RubricCriterion[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  isCompleted?: boolean;
  notes?: string;
}

export interface ActivityChecklist {
  id: string;
  title: string;
  category: "lab_safety" | "experiment_procedure" | "stem_design_check" | "learning_habits";
  instructions: string;
  items: ChecklistItem[];
}

export interface PeerAssessmentCriterion {
  id: string;
  aspect: string; // "Sự nhiệt tình & nghiêm túc", "Đóng góp ý tưởng", "Biết kì vọng", "Tổ chức nhóm", "Làm việc nhóm", "Tính hiệu quả"
  scoreGuide: string; // 3: Tốt hơn thành viên khác | 2: Trung bình | 1: Kém hơn | 0: Không giúp gì | -1: Trở ngại
}

export interface CATTechniqueItem {
  id: string;
  name: string; // "Bài tập 1 phút (One-minute paper)", "Thẻ kiểm tra 5 phút", "Ma trận ghi nhớ", v.v.
  durationMinutes: number;
  purpose: string;
  procedure: string;
  sampleQuestions: string[];
}

export interface ExamMatrixSection7991 {
  sectionTitle: string; // "Phần I: TNKQ Nhiều lựa chọn", "Phần II: TNKQ Đúng - Sai", "Phần III: Trả lời ngắn", "Phần IV: Tự luận"
  questionCount: number;
  totalPoints: number;
  description: string;
  scoreBreakdown: {
    recognitionPoints: number; // Biết (40%)
    comprehensionPoints: number; // Hiểu (30%)
    applicationPoints: number; // Vận dụng (30%)
  };
}

export interface ExamMatrix7991 {
  grade: GradeLevel;
  examTitle: string;
  durationMinutes: number; // 45 phút (1 tiết) hoặc 90 phút (2 tiết)
  regulationsRef: string; // "Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024"
  cognitiveRatio: {
    recognitionPercent: number; // 40%
    comprehensionPercent: number; // 30%
    applicationPercent: number; // 30%
  };
  totalPoints: number; // 10.0
  sections: ExamMatrixSection7991[];
}


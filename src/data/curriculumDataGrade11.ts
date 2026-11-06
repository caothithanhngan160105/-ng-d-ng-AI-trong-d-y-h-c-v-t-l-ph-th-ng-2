import { LessonTopic } from "../types/physics";

export const GRADE_11_LESSONS: LessonTopic[] = [
  // ==========================================
  // CHƯƠNG I: DAO ĐỘNG (15 TIẾT)
  // ==========================================
  {
    id: "vl11-dao-dong-dieu-hoa",
    grade: 11,
    chapterNumber: 1,
    chapterTitle: "Chương I: Dao động",
    lessonNumber: 1,
    lessonTitle: "Bài 1: Dao động điều hoà",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 1, 2",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL11.KNTT.B1",
    simulationId: "sim-oscillator-11",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1a"],
    experiments: ["Bộ TN ghi đồ thị dao động của con lắc đơn và con lắc lò xo"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl11-b1",
      activityTitle: "Hoạt động: Khám phá phương trình li độ hình sin & các đại lượng đặc trưng của dao động điều hòa (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Nêu được định nghĩa dao động điều hòa, viết được phương trình x = A.cos(ωt + φ).",
          "Xác định được các đại lượng: biên độ A, chu kì T, tần số f, tần số góc ω, pha dao động và pha ban đầu φ từ đồ thị hoặc mô phỏng.",
        ],
        physicsCompetencies: [
          "Thực hiện thí nghiệm đơn giản tạo ra dao động và mô tả chuyển động tuần hoàn.",
          "Vận dụng mối liên hệ giữa chuyển động tròn đều và dao động điều hòa trên trục hoành.",
        ],
        generalCompetencies: ["Tự chủ tìm tòi, giải quyết vấn đề mô hình hóa toán học."],
        digitalCompetencies: ["5.3.NC1b, 3.1.NC1a: Sử dụng mô phỏng số vẽ đồ thị x(t) theo thời gian thực."],
        qualities: ["Chăm chỉ, say mê khám phá hiện tượng tuần hoàn trong tự nhiên."],
      },
      content: "Nghiên cứu dao động cơ học, phân biệt dao động tự do và dao động tuần hoàn. Khảo sát hình chiếu của chuyển động tròn đều lên một đường kính để xây dựng phương trình li độ dạng cosin x = A.cos(ωt + φ).",
      product: "Đồ thị dao động hình sin vẽ từ thí nghiệm dải cát rơi hoặc mô phỏng số và bài tập xác định các đại lượng A, T, f, ω, φ.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Quan sát quả lắc đồng hồ, xích đu, cành cây đu đưa: Điểm chung của các chuyển động này là gì? Tại sao Galileo nhận thấy chu kì đung đưa của đèn chùm nhà thờ không đổi dù biên độ lớn hay nhỏ?",
        step2_execution: "Làm việc nhóm trên mô phỏng số (45 phút): Mở mô phỏng con lắc số; theo dõi vệt li độ hình sin x(t); đo chu kì T bằng đồng hồ hiện số; thay đổi biên độ A kiểm tra T có đổi không; xác định pha ban đầu φ khi thả từ biên dương.",
        step3_discussion: "Báo cáo và thảo luận (20 phút): Các nhóm so sánh pha dao động; giải thích mối liên hệ giữa vectơ quay bán kính A quay đều với góc pha (ωt + φ).",
        step4_conclusion: "Chuẩn hóa và kết luận (15 phút): Giáo viên chốt định nghĩa dao động điều hòa; các công thức liên hệ T = 1/f = 2π/ω; đơn vị rad/s và rad.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: ĐẠI LƯỢNG ĐẶC TRƯNG DAO ĐỘNG ĐIỀU HÒA",
        code: "PHT-VL11-B1",
        tasks: [
          {
            id: 1,
            instruction: "Đọc đồ thị dao động",
            prompt: "Một vật dao động có đồ thị li độ hình sin với giá trị cực đại 5 cm, thời gian từ vị trí biên dương sang biên âm kế tiếp là 0,5 s. Viết phương trình dao động của vật (chọn t = 0 lúc ở biên dương)?",
            expectedAnswer: "Biên độ A = 5 cm. Nửa chu kì T/2 = 0,5 s => Chu kì T = 1,0 s => Tần số góc omega = 2*pi/T = 2*pi rad/s. Lúc t = 0 vật ở biên dương => cos(phi) = +1 => phi = 0. Phương trình: x = 5*cos(2*pi*t) (cm).",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nhầm pha ban đầu phi chỉ có thể bằng 0 hoặc pi."],
        pedagogicalAdvice: ["Kết hợp chiếu giản đồ vectơ quay tròn đều song song với đồ thị sóng."],
        differentiationPrompts: {
          support: "Chu kì T là khoảng thời gian vật thực hiện được mấy dao động toàn phần?",
          advanced: "Tại sao hình chiếu của một chất điểm chuyển động tròn đều lên trục Ox luôn là một dao động điều hòa?",
        },
      },
    },
  },
  {
    id: "vl11-dong-nang-the-nang-dao-dong",
    grade: 11,
    chapterNumber: 1,
    chapterTitle: "Chương I: Dao động",
    lessonNumber: 5,
    lessonTitle: "Bài 5: Động năng. Thế năng. Sự chuyển hoá năng lượng trong dao động điều hoà",
    estimatedPeriods: 3,
    ppctSessions: "Tiết 9, 10, 11",
    durationDisplay: "3 tiết (135 phút)",
    standardCurriculumCode: "VL11.KNTT.B5",
    stemActivity: "Thiết kế đồng hồ quả lắc đếm giây nghệ thuật (chu kì 1s hoặc 2s)",
    experiments: ["Bộ TN khảo sát chuyển hóa động năng - thế năng của con lắc lò xo và con lắc đơn"],
    assessmentRubricId: "rubric-stem-product",
    defaultActivity: {
      id: "act-vl11-b5",
      activityTitle: "Hoạt động: Khảo sát chuyển hóa Wđ - Wt trong dao động & Dự án Thiết kế Đồng hồ đếm giây nghệ thuật (Thời lượng: 3 tiết - 135 phút)",
      durationMinutes: 135,
      objectives: {
        knowledge: [
          "Sử dụng đồ thị, phân tích và tính toán mô tả được sự chuyển hoá động năng và thế năng trong dao động điều hoà.",
          "Viết được biểu thức động năng Wđ = 1/2.m.v^2, thế năng Wt = 1/2.k.x^2 và cơ năng bảo toàn W = Wđ + Wt = 1/2.m.ω^2.A^2 = const.",
        ],
        physicsCompetencies: [
          "Xác định được tần số biến thiên của động năng và thế năng gấp 2 lần tần số của li độ (f' = 2f, T' = T/2).",
          "Chế tạo con lắc đếm giây (con lắc đơn T = 1s hoặc T = 2s) trang trí bàn học.",
        ],
        generalCompetencies: ["Năng lực sáng tạo kĩ thuật, làm việc nhóm chế tạo sản phẩm STEM."],
        qualities: ["Tỉ mỉ, kiên nhẫn khi cân chỉnh độ dài dây treo L."],
      },
      content: "Nghiên cứu sự biến thiên của động năng và thế năng theo li độ và theo thời gian. Chứng minh cơ năng dao động bảo toàn khi bỏ qua ma sát. Dự án STEM chế tạo con lắc đếm giây nghệ thuật.",
      product: "Đồ thị năng lượng Wđ, Wt theo li độ x (parabol) và chiếc đồng hồ quả lắc đếm giây mini hoạt động chuẩn xác.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (15 phút): Tại sao khi dao động điều hòa qua VTCB vận tốc đạt cực đại, ở biên gia tốc đạt cực đại? Năng lượng cơ học được bảo toàn như thế nào?",
        step2_execution: "Nghiên cứu và chế tạo (70 phút): Thiết lập công thức Wđ và Wt; chứng minh tổng W không đổi; tính chiều dài dây treo L để T = 2.0 s (L = g / pi^2 ≈ 0.994 m); thiết kế giá đỡ bằng gỗ hoặc bìa mô hình; thử nghiệm bấm giờ đếm nhịp 10 chu kì.",
        step3_discussion: "Báo cáo và hiệu chỉnh (30 phút): Các nhóm mang đồng hồ quả lắc thi đếm đúng 60 giây (30 chu kì toàn phần); phân tích nguyên nhân sai số thời gian.",
        step4_conclusion: "Chuẩn hóa và kết luận (20 phút): Giáo viên tổng kết tính chất biến thiên tuần hoàn của động năng và thế năng; chốt công thức cơ năng W tỉ lệ với bình phương biên độ A^2.",
      },
      studentWorksheet: {
        title: "PHIẾU DỰ ÁN STEM: ĐỒNG HỒ QUẢ LẮC ĐẾM GIÂY",
        code: "PHT-STEM-VL11-B5",
        tasks: [
          {
            id: 1,
            instruction: "Tính chiều dài dây treo",
            prompt: "Biết g = 9,8 m/s2. Cần cắt dây treo con lắc có chiều dài L bằng bao nhiêu mét để chu kì dao động nhỏ đúng bằng T = 1,00 giây?",
            expectedAnswer: "Ta có T = 2*pi*sqrt(L/g) => L = g * T^2 / (4*pi^2) = 9,8 * 1^2 / (4 * 3,1416^2) ≈ 0,248 m = 24,8 cm.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nghĩ chu kì biến thiên của động năng bằng chu kì của li độ (thực tế T' = T/2)."],
        pedagogicalAdvice: ["Dùng Rubric Đánh giá Sản phẩm STEM để chấm điểm sản phẩm con lắc nghệ thuật."],
        differentiationPrompts: {
          support: "Ở vị trí nào thì động năng bằng thế năng?",
          advanced: "Khi biên độ dao động A tăng gấp 3 lần thì cơ năng toàn phần của con lắc tăng lên mấy lần?",
        },
      },
    },
  },
  {
    id: "vl11-dao-dong-tat-dan-cuong-buc-cong-huong",
    grade: 11,
    chapterNumber: 1,
    chapterTitle: "Chương I: Dao động",
    lessonNumber: 6,
    lessonTitle: "Bài 6: Dao động tắt dần. Dao động cưỡng bức. Hiện tượng cộng hưởng",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 12, 13",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL11.KNTT.B6",
    stemActivity: "Thiết kế mô hình tòa nhà chống động đất hoặc máy đo địa chấn đơn giản",
    experiments: ["Bộ TN hiện tượng cộng hưởng cơ với các con lắc có chiều dài khác nhau"],
    assessmentRubricId: "rubric-stem-design",
    defaultActivity: {
      id: "act-vl11-b6",
      activityTitle: "Hoạt động: Khảo sát hiện tượng cộng hưởng cơ & Dự án Thiết kế mô hình tòa nhà chống động đất (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Nêu được ví dụ thực tế về dao động tắt dần, dao động cưỡng bức và hiện tượng cộng hưởng.",
          "Nêu điều kiện xảy ra cộng hưởng: tần số của ngoại lực cưỡng bức bằng tần số dao động riêng (f = f0).",
          "Đánh giá được mặt có lợi và mặt có hại của hiện tượng cộng hưởng trong kĩ thuật và xây dựng.",
        ],
        physicsCompetencies: [
          "Tiến hành thí nghiệm con lắc Barton quan sát biên độ dao động cực đại khi xảy ra cộng hưởng.",
          "Chế tạo mô hình tòa nhà nhiều tầng có gắn con lắc giảm chấn quả nặng (Tuned Mass Damper - TMD) chống rung lắc động đất.",
        ],
        generalCompetencies: ["Năng lực giải quyết vấn đề kỹ thuật công trình, tư duy phòng chống thiên tai."],
        qualities: ["Ý thức trách nhiệm cộng đồng, bảo vệ an toàn tính mạng con người."],
      },
      content: "Nghiên cứu nguyên nhân tắt dần dao động do lực cản môi trường. Khảo sát dao động cưỡng bức dưới tác dụng của ngoại lực tuần hoàn và hiện tượng biên độ tăng vọt khi f = f0. Vận dụng thiết kế hệ thống giảm chấn tòa nhà chọc trời.",
      product: "Mô hình tòa nhà cao tầng gắn con lắc phản rung lắc thử nghiệm trên bàn rung mô phỏng địa chấn.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Xem clip thảm họa sập cầu Tacoma Narrows năm 1940 do gió thổi và tòa tháp Taipei 101 vững vàng trong động đất nhờ quả cầu thép 660 tấn treo ở tầng 88. Hiện tượng vật lí nào ẩn sau các sự kiện này?",
        step2_execution: "Khảo sát và thi công (45 phút): Thí nghiệm hệ con lắc Barton; vẽ đường cong cộng hưởng; chế tạo mô hình khung nhà 3 tầng từ que tre/ống hút; treo con lắc nặng ở tầng thượng làm bộ triệt tiêu dao động TMD; rung lắc bàn thử nghiệm.",
        step3_discussion: "Báo cáo và giải trình (20 phút): Các nhóm thử nghiệm bàn rung; giải thích cơ chế con lắc TMD dao động ngược pha với tòa nhà, hấp thụ năng lượng rung lắc.",
        step4_conclusion: "Chuẩn hóa và kết luận (15 phút): Giáo viên chốt lại điều kiện cộng hưởng f = f0; các biện pháp phòng tránh cộng hưởng có hại (đổi bước chân duyệt binh qua cầu, làm bệ máy chống rung).",
      },
      studentWorksheet: {
        title: "PHIẾU DỰ ÁN STEM: MÔ HÌNH GIẢM CHẤN ĐỘNG ĐẤT",
        code: "PHT-STEM-VL11-B6",
        tasks: [
          {
            id: 1,
            instruction: "Phân tích hiện tượng",
            prompt: "Tại sao khi một đoàn quân hành quân bước đều qua một chiếc cầu treo, chỉ huy bắt buộc phải ra lệnh 'đi bước tự do'?",
            expectedAnswer: "Nếu bước đều, nhịp bước chân của đoàn quân có thể vô tình tạo ra ngoại lực tuần hoàn có tần số trùng với tần số riêng của cầu (f = f0), gây ra hiện tượng cộng hưởng làm biên độ dao động của cầu tăng vọt, vượt quá giới hạn chịu lực dẫn đến gãy sập cầu.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nghĩ dao động cưỡng bức có tần số bằng tần số riêng f0 (thực tế tần số của dao động cưỡng bức luôn bằng tần số f của ngoại lực)."],
        pedagogicalAdvice: ["Chiếu video quả cầu thép Taipei 101 đu đưa cứu tòa tháp khi động đất cấp 7."],
        differentiationPrompts: {
          support: "Cộng hưởng xảy ra khi tần số ngoại lực như thế nào so với tần số riêng?",
          advanced: "Lực cản của môi trường ảnh hưởng như thế nào đến độ nhọn của đỉnh đường cong cộng hưởng?",
        },
      },
    },
  },

  // ==========================================
  // CHƯƠNG II: SÓNG (17 TIẾT)
  // ==========================================
  {
    id: "vl11-giao-thoa-song",
    grade: 11,
    chapterNumber: 2,
    chapterTitle: "Chương II: Sóng",
    lessonNumber: 12,
    lessonTitle: "Bài 12: Giao thoa sóng",
    estimatedPeriods: 3,
    ppctSessions: "Tiết 41, 42, 43",
    durationDisplay: "3 tiết (135 phút)",
    standardCurriculumCode: "VL11.KNTT.B12",
    simulationId: "sim-wave-11",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1a"],
    experiments: ["Bộ TN giao thoa sóng nước với 2 mũi nhọn rung kết hợp và đèn hoạt nghiệm"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl11-b12",
      activityTitle: "Hoạt động: Khảo sát hiện tượng Giao thoa sóng nước & Xây dựng điều kiện cực đại, cực tiểu (Thời lượng: 3 tiết - 135 phút)",
      durationMinutes: 135,
      objectives: {
        knowledge: [
          "Mô tả được thí nghiệm giao thoa của hai nguồn sóng kết hợp trên mặt nước.",
          "Nêu điều kiện để hai sóng giao thoa được với nhau (cùng tần số, cùng phương dao động, hiệu số pha không đổi).",
          "Viết công thức xác định vị trí cực đại: d2 - d1 = k.λ và cực tiểu: d2 - d1 = (k + 0,5).λ.",
        ],
        physicsCompetencies: [
          "Quan sát và phân biệt được các gợn sóng hypebol cực đại (dao động mạnh nhất) và cực tiểu (đứng yên).",
          "Tính bước sóng λ từ khoảng cách giữa các đỉnh cực đại trên đoạn thẳng nối 2 nguồn.",
        ],
        generalCompetencies: ["Năng lực suy luận toán học, quan sát phân tích hiện tượng giao thoa."],
        digitalCompetencies: ["Vận hành mô phỏng sóng nước 2D, điều chỉnh tần số f và khoảng cách 2 nguồn d."],
        qualities: ["Khách quan, kiên trì đếm số vân cực đại giao thoa."],
      },
      content: "Nghiên cứu hiện tượng hai sóng kết hợp gặp nhau tạo nên hệ vân giao thoa ổn định gồm các điểm dao động với biên độ cực đại và các điểm đứng yên triệt tiêu. Thiết lập phương trình hiệu đường đi d2 - d1.",
      product: "Bản vẽ hệ vân giao thoa các nhánh hypebol và bài giải xác định số cực đại, cực tiểu trên đoạn nối 2 nguồn S1S2.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (15 phút): Ném 2 hòn đá xuống mặt hồ tĩnh lặng, tại sao các gợn sóng tròn lan tỏa cắt nhau lại tạo nên những dải nước gợn mạnh xen kẽ những dải nước phẳng lặng đứng yên?",
        step2_execution: "Khám phá trên mô phỏng số (70 phút): Mở mô phỏng giao thoa sóng nước PhysLab; di chuyển đầu dò kiểm tra các điểm cực đại (d2 - d1 = 0, ±λ, ±2λ) và cực tiểu; thay đổi tần số f, quan sát khoảng cách giữa các vân giao thoa co lại khi f tăng; giải bài tập xác định bước sóng.",
        step3_discussion: "Báo cáo và thảo luận (30 phút): Các nhóm giải thích tại sao hai nguồn phải là nguồn kết hợp thì mới quan sát được vân giao thoa ổn định.",
        step4_conclusion: "Chuẩn hóa và kết luận (20 phút): Giáo viên chốt công thức giao thoa; mở rộng sang hiện tượng giao thoa ánh sáng qua 2 khe Y-âng: i = λD / a.",
      },
      studentWorksheet: {
        title: "PHIẾU THÍ NGHIỆM: GIAO THOA SÓNG CƠ",
        code: "PHT-VL11-B12",
        tasks: [
          {
            id: 1,
            instruction: "Xác định cực đại hay cực tiểu",
            prompt: "Trong thí nghiệm giao thoa sóng nước với hai nguồn cùng pha có bước sóng λ = 2 cm. Một điểm M có khoảng cách đến hai nguồn là d1 = 18 cm và d2 = 24 cm. Điểm M là cực đại hay cực tiểu, bậc mấy?",
            expectedAnswer: "Hiệu đường đi: d2 - d1 = 24 - 18 = 6 cm. Lập tỉ số: (d2 - d1) / lambda = 6 / 2 = 3 (số nguyên k = 3). Vậy điểm M là điểm cực đại giao thoa bậc 3.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay quên điều kiện 2 nguồn phải là nguồn kết hợp (nghĩ rằng 2 nguồn sóng bất kì đều giao thoa được)."],
        pedagogicalAdvice: ["Cho học sinh kéo thanh trượt tần số f để thấy rõ: tần số càng lớn thì bước sóng càng nhỏ, các đường cực đại càng dày đặc."],
        differentiationPrompts: {
          support: "Khoảng cách giữa hai cực đại liên tiếp trên đoạn thẳng nối 2 nguồn bằng bao nhiêu bước sóng?",
          advanced: "Nếu hai nguồn dao động ngược pha nhau thì vị trí đường trung trực của đoạn S1S2 là cực đại hay cực tiểu?",
        },
      },
    },
  },
  {
    id: "vl11-song-dung",
    grade: 11,
    chapterNumber: 2,
    chapterTitle: "Chương II: Sóng",
    lessonNumber: 13,
    lessonTitle: "Bài 13: Sóng dừng",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 44, 45",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL11.KNTT.B13",
    stemActivity: "Chế tạo đàn bầu hoặc đàn một dây",
    experiments: ["Bộ TN tạo sóng dừng trên sợi dây đàn hồi gắn máy rung tần số phát âm"],
    assessmentRubricId: "rubric-stem-product",
    defaultActivity: {
      id: "act-vl11-b13",
      activityTitle: "Hoạt động: Khảo sát hiện tượng sóng dừng & Dự án Chế tạo đàn một dây (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Thực hiện thí nghiệm tạo sóng dừng và giải thích được sự hình thành sóng dừng do giao thoa giữa sóng tới và sóng phản xạ.",
          "Xác định được vị trí nút sóng (đứng yên) và bụng sóng (dao động biên độ cực đại).",
          "Viết điều kiện có sóng dừng trên dây hai đầu cố định: L = k.λ/2.",
        ],
        physicsCompetencies: [
          "Quan sát các bó sóng dừng trên sợi dây cao su gắn máy phát tần số.",
          "Chế tạo đàn bầu hoặc đàn guitar mini một dây từ hộp gỗ, dây đàn guitar và cần nảy âm.",
        ],
        generalCompetencies: ["Năng lực cảm thụ âm nhạc kết hợp kĩ thuật chế tác nhạc cụ truyền thống."],
        qualities: ["Tự hào bản sắc văn hóa dân tộc qua nhạc cụ truyền thống đàn bầu Việt Nam."],
      },
      content: "Nghiên cứu sự phản xạ của sóng tại vật cản cố định (sóng phản xạ ngược pha) và vật cản tự do (sóng phản xạ cùng pha). Thiết lập công thức khoảng cách giữa 2 nút hoặc 2 bụng liên tiếp là λ/2. Chế tạo nhạc cụ dây gảy.",
      product: "Sản phẩm đàn bầu mini gảy được giai điệu bài hát đơn giản và bản thuyết minh vật lí.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Lắng nghe tiếng đàn bầu da diết: Tại sao chỉ với 1 dây duy nhất, nghệ nhân chạm nhẹ tay vào các điểm nút trên dây lại phát ra các âm bồi thanh thoát du dương?",
        step2_execution: "Thí nghiệm và chế tạo (45 phút): Khảo sát máy rung tạo 1, 2, 3 bó sóng; đo bước sóng λ; chế tạo đàn bầu từ hộp bánh quy/ống bương, căng dây kim loại có khóa vặn chỉnh lực căng; gảy thử âm thanh và dùng cần nảy uốn cong thay đổi cao độ.",
        step3_discussion: "Báo cáo và biểu diễn (20 phút): Các nhóm gảy đàn thử nghiệm; giải thích tại sao khi chạm nhẹ vào điểm chính giữa dây (L/2) ta thu được họa âm bậc 2 có tần số gấp đôi.",
        step4_conclusion: "Chuẩn hóa và kết luận (15 phút): Giáo viên chốt công thức sóng dừng: L = k.λ/2 (k là số bó sóng, số bụng); khoảng cách từ nút đến bụng kề cận là λ/4.",
      },
      studentWorksheet: {
        title: "PHIẾU DỰ ÁN STEM: ĐÀN BẦU MỘT DÂY",
        code: "PHT-STEM-VL11-B13",
        tasks: [
          {
            id: 1,
            instruction: "Tính tần số âm phát ra",
            prompt: "Một sợi dây đàn dài L = 60 cm có hai đầu cố định. Vận tốc truyền sóng trên dây là v = 300 m/s. Tính tần số của âm cơ bản (bậc 1) và họa âm bậc 3 do dây phát ra?",
            expectedAnswer: "Dây 2 đầu cố định: L = k * v / (2f) => f = k * v / (2L). Âm cơ bản (k = 1): f1 = 1 * 300 / (2 * 0,6) = 250 Hz. Họa âm bậc 3 (k = 3): f3 = 3 * f1 = 3 * 250 = 750 Hz.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay đếm nhầm số nút và số bụng: Trên dây 2 đầu cố định có k bụng thì có k + 1 nút sóng."],
        pedagogicalAdvice: ["Dùng Rubric Sản phẩm STEM để đánh giá chất lượng âm thanh đàn bầu."],
        differentiationPrompts: {
          support: "Khoảng cách giữa hai nút sóng liên tiếp bằng mấy phần bước sóng?",
          advanced: "Tại sao khi gảy đàn bầu, nghệ nhân dùng cạnh bàn tay chạm nhẹ vào các điểm nút L/2, L/3, L/4 rồi nhấc ra ngay để kích thích âm bồi?",
        },
      },
    },
  },

  // ==========================================
  // CHƯƠNG III: ĐIỆN TRƯỜNG (17 TIẾT)
  // ==========================================
  {
    id: "vl11-the-nang-dien",
    grade: 11,
    chapterNumber: 3,
    chapterTitle: "Chương III: Điện trường",
    lessonNumber: 19,
    lessonTitle: "Bài 19: Thế năng điện",
    estimatedPeriods: 3,
    ppctSessions: "Tiết 60, 61, 62",
    durationDisplay: "3 tiết (135 phút)",
    standardCurriculumCode: "VL11.KNTT.B19",
    simulationId: "sim-potential-energy-11",
    digitalCompetencies: ["1.2.NC1b", "5.3.NC1b"],
    experiments: ["Mô phỏng điện trường đều giữa 2 bản tụ điện phẳng và chuyển động hạt tích điện q"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl11-b19",
      activityTitle: "Hoạt động: Xây dựng công thức Công của lực điện A = q.E.d và Khái niệm Thế năng điện (Thời lượng: 3 tiết - 135 phút)",
      durationMinutes: 135,
      objectives: {
        knowledge: [
          "Thảo luận qua quan sát để xác định công của lực điện trường đều: A = q.E.d (d là hình chiếu độ dời lên đường sức).",
          "Nêu được công của lực điện không phụ thuộc hình dạng đường đi, chỉ phụ thuộc vị trí điểm đầu và điểm cuối.",
          "Định nghĩa thế năng của điện tích q trong điện trường đặc trưng cho khả năng sinh công: W_M = q.E.d_M.",
        ],
        physicsCompetencies: [
          "Chứng minh tính chất lực thế của lực điện trường tương tự như trọng lực.",
          "Vận dụng công thức độ giảm thế năng: A_MN = W_M - W_N.",
        ],
        generalCompetencies: ["Tư duy so sánh tương tự hóa giữa trọng trường và điện trường."],
        digitalCompetencies: ["Vận hành mô phỏng Slow-Mo điều khiển hạt q chuyển động theo đường gấp khúc."],
        qualities: ["Cẩn thận trong tính toán dấu đại số của hình chiếu d."],
      },
      content: "Xây dựng biểu thức công của lực điện A = F.s.cos(alpha) = q.E.d. Chứng minh công trên đường gấp khúc bằng công trên đường thẳng. Định nghĩa thế năng điện và mốc thế năng.",
      product: "Bản chứng minh toán học tính chất lực thế của lực điện và bảng số liệu khảo sát công trên mô phỏng số.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (15 phút): Một hạt bụi tích điện dương đặt gần bản dương tự động lao nhanh về bản âm: Năng lượng nào đã chuyển hóa thành động năng của hạt? Công của lực điện có phụ thuộc đường đi ngoằn ngoèo không?",
        step2_execution: "Suy luận toán học và mô phỏng (70 phút): Nhóm học sinh tính công trên đoạn MN xiên góc; chiếu lên phương đường sức thu được A = q.E.d; mở mô phỏng di chuyển hạt q theo đường zíc-zắc; bật công tắc kiểm tra công A không đổi; định nghĩa W_M = q.E.d_M.",
        step3_discussion: "Báo cáo và thảo luận (30 phút): Các nhóm tranh luận về ý nghĩa của dấu d (d > 0 khi đi cùng chiều đường sức, d < 0 khi đi ngược chiều).",
        step4_conclusion: "Chuẩn hóa và kết luận (20 phút): Giáo viên tổng kết: Điện trường tĩnh là một trường thế; công của lực điện bằng độ giảm thế năng điện giữa hai điểm: A_MN = W_M - W_N.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: CÔNG CỦA LỰC ĐIỆN VÀ THẾ NĂNG ĐIỆN",
        code: "PHT-VL11-B19",
        tasks: [
          {
            id: 1,
            instruction: "Tính công của lực điện",
            prompt: "Một điện tích q = +2.10^-6 C dịch chuyển từ điểm M đến điểm N trong điện trường đều E = 5000 V/m. Hình chiếu độ dời MN lên đường sức có độ dài d = +0,1 m. Tính công của lực điện và độ biến thiên thế năng?",
            expectedAnswer: "Công của lực điện: A_MN = q * E * d = 2.10^-6 * 5000 * 0,1 = +0,001 J = +1 mJ. Độ biến thiên thế năng: Delta W = W_N - W_M = -A_MN = -1 mJ (thế năng giảm 1 mJ để chuyển hóa thành động năng).",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay lấy quãng đường thực s thay vì hình chiếu d lên đường sức điện."],
        pedagogicalAdvice: ["Sử dụng công tắc ẩn/hiện số liệu trên mô phỏng để học sinh tự tính d trước."],
        differentiationPrompts: {
          support: "Khi điện tích dịch chuyển vuông góc với đường sức điện thì công A bằng bao nhiêu?",
          advanced: "So sánh sự tương đồng và khác biệt giữa định luật vạn vật hấp dẫn của Newton và định luật Coulomb của lực điện?",
        },
      },
    },
  },
  {
    id: "vl11-dien-the-hieu-dien-the",
    grade: 11,
    chapterNumber: 3,
    chapterTitle: "Chương III: Điện trường",
    lessonNumber: 20,
    lessonTitle: "Bài 20: Điện thế",
    estimatedPeriods: 3,
    ppctSessions: "Tiết 63, 64, 65",
    durationDisplay: "3 tiết (135 phút)",
    standardCurriculumCode: "VL11.KNTT.B20",
    simulationId: "sim-electric-potential-11",
    digitalCompetencies: ["1.2.NC1b", "5.3.NC1b"],
    experiments: ["Vôn kế số 2 đầu dò đo điện thế tại các điểm khác nhau và khảo sát mặt đẳng thế"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl11-b20",
      activityTitle: "Hoạt động: Khảo sát Điện thế V, Hiệu điện thế U & Mặt đẳng thế (Thời lượng: 3 tiết - 135 phút)",
      durationMinutes: 135,
      objectives: {
        knowledge: [
          "Nêu định nghĩa điện thế V_M đặc trưng cho điện trường tại điểm M về thế năng: V_M = A_M_inf / q.",
          "Định nghĩa hiệu điện thế U_MN = V_M - V_N = A_MN / q (Vôn).",
          "Viết hệ thức liên hệ giữa cường độ điện trường và hiệu điện thế trong điện trường đều: E = U / d.",
          "Mô tả đặc điểm mặt đẳng thế: vuông góc với đường sức điện, không sinh công khi di chuyển trên mặt đẳng thế.",
        ],
        physicsCompetencies: [
          "Sử dụng vôn kế 2 đầu dò đo hiệu điện thế giữa 2 điểm trong mạch và trong điện trường mô phỏng.",
          "Vẽ bản đồ các mặt đẳng thế quanh điện tích điểm và giữa hai bản tụ phẳng.",
        ],
        generalCompetencies: ["Tư duy hình học không gian, giải thích hiện tượng chim đậu dây cao thế."],
        digitalCompetencies: ["Tương tác mô phỏng 3D núi điện thế, đấu trường bắn hạt gia tốc."],
        qualities: ["Ý thức an toàn điện, phòng tránh điện thế bước khi sấm sét."],
      },
      content: "Nghiên cứu điện thế V và hiệu điện thế U. Chứng minh công thức E = U/d. Khảo sát khái niệm mặt đẳng thế và ứng dụng an toàn điện thế bước trong đời sống.",
      product: "Bản đồ mặt đẳng thế phát sáng và bài thuyết trình về an toàn điện thế bước.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (15 phút): Tại sao đàn chim đậu trên dây điện cao thế 500 kV không bị giật, nhưng người đứng dưới đất gần dây lại gặp nguy hiểm chết người? Yếu tố nào quyết định dòng điện chạy qua cơ thể?",
        step2_execution: "Khám phá trên mô phỏng số (70 phút): Dùng vôn kế ảo 2 đầu dò đo điện thế hai chân chim (U ≈ 0); đo điện thế giữa dây và đất (U = 500 kV); bấm nút ghim mặt đẳng thế phát sáng; chứng minh vectơ E luôn vuông góc với mặt đẳng thế; kiểm tra hệ thức E = U/d.",
        step3_discussion: "Báo cáo và giải thích (30 phút): Các nhóm thuyết minh về quy tắc chụm hai chân khi có dây điện cao thế rơi xuống đất để triệt tiêu điện thế bước.",
        step4_conclusion: "Chuẩn hóa và kết luận (20 phút): Giáo viên chốt các công thức: V_M = W_M / q; U_MN = V_M - V_N; E = U/d; nhấn mạnh chiều của vectơ E luôn hướng về phía điện thế giảm.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: ĐIỆN THẾ VÀ HIỆU ĐIỆN THẾ",
        code: "PHT-VL11-B20",
        tasks: [
          {
            id: 1,
            instruction: "Liên hệ giữa E và U",
            prompt: "Hai bản kim loại phẳng song song tích điện trái dấu đặt cách nhau d = 5 cm. Hiệu điện thế giữa hai bản là U = 100 V. Tính cường độ điện trường giữa hai bản?",
            expectedAnswer: "Điện trường giữa 2 bản là điện trường đều: E = U / d = 100 V / 0,05 m = 2000 V/m.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nhầm điện thế cao với điện thế dương (điện thế có thể âm tùy mốc chọn)."],
        pedagogicalAdvice: ["Dùng chế độ 'Núi điện thế 3D' trên mô phỏng để học sinh thấy điện tích dương lăn từ đỉnh núi điện thế cao xuống đáy thung lũng."],
        differentiationPrompts: {
          support: "Công của lực điện khi dịch chuyển điện tích dọc theo mặt đẳng thế bằng bao nhiêu?",
          advanced: "Tại sao bề mặt của một vật dẫn cân bằng điện tích luôn là một mặt đẳng thế?",
        },
      },
    },
  },
  {
    id: "vl11-tu-thong-cam-ung-dien-tu",
    grade: 11,
    chapterNumber: 3,
    chapterTitle: "Chương III: Điện trường",
    lessonNumber: 22,
    lessonTitle: "Bài 22: Từ thông. Hiện tượng cảm ứng điện từ",
    estimatedPeriods: 3,
    ppctSessions: "Tiết 62-64",
    durationDisplay: "3 tiết (135 phút)",
    standardCurriculumCode: "VL11.KNTT.B22",
    simulationId: "sim-magnetic-flux-11",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1a"],
    experiments: ["Bộ TN nam châm dịch chuyển qua cuộn dây nối điện kế phát hiện dòng điện cảm ứng"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl11-b22",
      activityTitle: "Hoạt động: Khảo sát Từ thông Φ = B.S.cos(α) & Hiện tượng Cảm ứng điện từ (Thời lượng: 3 tiết - 135 phút)",
      durationMinutes: 135,
      objectives: {
        knowledge: [
          "Định nghĩa từ thông qua diện tích S và viết công thức: Φ = B.S.cos(α), đơn vị Weber (Wb).",
          "Mô tả hiện tượng cảm ứng điện từ xuất hiện khi từ thông qua mạch kín biến thiên (ΔΦ ≠ 0).",
          "Phát biểu nội dung định luật Lenz về chiều dòng điện cảm ứng và định luật Faraday về suất điện động cảm ứng.",
        ],
        physicsCompetencies: [
          "Thao tác mô phỏng 3D xoay khung dây và thay đổi từ trường, trực quan hóa số đường sức từ đâm xuyên.",
          "Xác định đúng chiều dòng điện cảm ứng trong các trường hợp nam châm lại gần hoặc ra xa ống dây.",
        ],
        generalCompetencies: ["Năng lực giải quyết vấn đề, ứng dụng năng lượng sạch (máy phát điện, bếp từ)."],
        digitalCompetencies: ["Vận hành mô phỏng số 3D, sử dụng công tắc ẩn/hiện số liệu sư phạm để tự tính Φ."],
        qualities: ["Hứng thú khám phá lịch sử thí nghiệm Faraday năm 1831."],
      },
      content: "Nghiên cứu khái niệm từ thông Φ, ý nghĩa số đường sức xuyên qua khung. Thực hành các cách làm biến thiên từ thông (đổi B, đổi S, đổi góc α). Khảo sát định luật Lenz chống lại sự biến thiên sinh ra nó.",
      product: "Phiếu học tập hoàn thành công thức từ thông, bảng tính toán tại các góc 0°, 60°, 90°, 180° và giải thích nguyên lí bếp từ.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (15 phút): Đặt nam châm vĩnh cửu cực mạnh cạnh cuộn dây bóng đèn không hề sáng. Nhưng chỉ cần vung tay dịch chuyển nam châm thì đèn lại bừng sáng! Bí mật ở đây là gì?",
        step2_execution: "Khám phá trên mô phỏng 3D (70 phút): Mở mô phỏng từ thông 3D; điều chỉnh B, S, α; tắt công tắc hiện số liệu, tự tính Φ = B.S.cos(α) vào vở rồi bật công tắc đối chứng; chuyển sang Tab Hiện tượng cảm ứng, kéo nam châm ra vào cuộn dây quan sát chiều dòng điện kim điện kế.",
        step3_discussion: "Báo cáo và thảo luận (30 phút): Các nhóm giải thích tại sao khi mặt phẳng khung song song với đường sức thì Φ = 0; giải thích nguyên lí hãm điện từ của xe buýt hiện đại.",
        step4_conclusion: "Chuẩn hóa và kết luận (20 phút): Giáo viên chốt công thức từ thông; định luật Lenz: 'Dòng điện cảm ứng có chiều sao cho từ trường do nó sinh ra có tác dụng chống lại nguyên nhân đã sinh ra nó'.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: TỪ THÔNG VÀ CẢM ỨNG ĐIỆN TỪ",
        code: "PHT-VL11-B22",
        tasks: [
          {
            id: 1,
            instruction: "Tính từ thông",
            prompt: "Khung dây hình vuông cạnh a = 10 cm (diện tích S = 0,01 m2) đặt trong từ trường đều B = 0,5 T. Vectơ pháp tuyến n hợp với B một góc alpha = 60°. Tính từ thông qua khung dây?",
            expectedAnswer: "Phi = B * S * cos(alpha) = 0,5 * 0,01 * cos(60°) = 0,5 * 0,01 * 0,5 = 0,0025 Wb = 2,5 mWb.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nhầm góc alpha (hợp bởi n và B) với góc beta hợp bởi mặt phẳng khung dây và B (alpha = 90° - beta)."],
        pedagogicalAdvice: ["Cho học sinh thử nghiệm cả 3 cách làm biến thiên từ thông trên mô phỏng 3D."],
        differentiationPrompts: {
          support: "Khi nào từ thông qua khung dây đạt giá trị cực đại?",
          advanced: "Suất điện động cảm ứng trong khung dây quay đều với tốc độ góc omega có dạng sóng gì? Viết biểu thức?",
        },
      },
    },
  },
  {
    id: "vl11-dien-tro-dinh-luat-ohm",
    grade: 11,
    chapterNumber: 4,
    chapterTitle: "Chương IV: Dòng điện. Mạch điện",
    lessonNumber: 23,
    lessonTitle: "Bài 23: Điện trở. Định luật Ohm",
    estimatedPeriods: 3,
    ppctSessions: "Tiết 84, 85, 86",
    durationDisplay: "3 tiết (135 phút)",
    standardCurriculumCode: "VL11.KNTT.B23",
    stemActivity: "Thiết kế đèn học thay đổi cường độ sáng (sử dụng biến trở và mạch LED)",
    digitalCompetencies: ["1.3.NC1a", "5.2.NC1b"],
    experiments: ["Bộ TN đo đặc tuyến I - U của dây dẫn kim loại và bóng đèn sợi đốt"],
    assessmentRubricId: "rubric-stem-product",
    defaultActivity: {
      id: "act-vl11-b23",
      activityTitle: "Hoạt động: Khảo sát Định luật Ohm & Dự án STEM Đèn học thay đổi cường độ sáng (Thời lượng: 3 tiết - 135 phút)",
      durationMinutes: 135,
      objectives: {
        knowledge: [
          "Định nghĩa điện trở R và nêu các nguyên nhân gây ra điện trở của vật dẫn kim loại.",
          "Phát biểu và viết biểu thức Định luật Ohm cho đoạn mạch: I = U / R.",
          "Vẽ đường đặc trưng vôn - ampe (I - U) của vật dẫn kim loại (đường thẳng qua O).",
        ],
        physicsCompetencies: [
          "Lắp mạch điện đo dòng điện I và hiệu điện thế U bằng ampe kế và vôn kế.",
          "Chế tạo mô hình đèn học bảo vệ thị lực có công tắc điều chỉnh tối thiểu 2 mức sáng.",
        ],
        generalCompetencies: ["Năng lực sáng tạo kĩ thuật, giải quyết vấn đề chống cận thị học đường."],
        qualities: ["Trách nhiệm tiết kiệm điện, bảo vệ sức khỏe đôi mắt."],
      },
      content: "Nghiên cứu định luật Ohm cho vật dẫn kim loại. Khảo sát sự cản trở dòng điện của điện trở R = rho.L / S. Ứng dụng biến trở con chạy và mạch ghép nối tiếp / song song chế tạo mô hình đèn bàn học thông minh.",
      product: "Đồ thị đường đặc trưng I-U trên giấy kẻ và chiếc đèn bàn học điều chỉnh được độ sáng theo tiêu chuẩn phòng học.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (15 phút): Tại sao trẻ em ngày nay bị cận thị rất sớm? Ánh sáng đèn bàn quá chói hoặc quá mờ ảnh hưởng thế nào đến điều tiết của mắt? Thử thách: Thiết kế chiếc đèn học có thể điều chỉnh linh hoạt độ sáng đọc sách và làm việc.",
        step2_execution: "Thực hành thí nghiệm và thi công (70 phút): Lắp mạch khảo sát I theo U; vẽ đường đặc trưng I-U; đọc tài liệu tiêu chuẩn độ rọi 300 - 500 lux; dùng biến trở hoặc mạch chuyển mạch nấc điện trở để điều khiển dòng qua đèn LED; lắp ráp khung đèn từ vật liệu gỗ/ống nhựa.",
        step3_discussion: "Báo cáo và đánh giá (30 phút): Các nhóm trưng bày đèn bàn, đo cường độ sáng bằng cảm biến Lux kế; bảo vệ bản thiết kế trước lớp theo Rubric.",
        step4_conclusion: "Chuẩn hóa và kết luận (20 phút): Giáo viên chốt định luật Ohm I = U / R; công thức điện trở suất theo nhiệt độ rho = rho0(1 + alpha*Delta t); đánh giá dự án STEM.",
      },
      studentWorksheet: {
        title: "PHIẾU DỰ ÁN STEM: ĐÈN HỌC ĐIỀU CHỈNH CƯỜNG ĐỘ SÁNG",
        code: "PHT-STEM-VL11-B23",
        tasks: [
          {
            id: 1,
            instruction: "Tính toán điện trở phân áp",
            prompt: "Một bóng đèn LED có thông số định mức 3V - 0,02A (20mA). Ta có nguồn pin 9V. Cần mắc nối tiếp với đèn một điện trở R bằng bao nhiêu ôm để đèn sáng bình thường không bị cháy?",
            expectedAnswer: "Hiệu điện thế rơi trên điện trở: U_R = U_nguon - U_den = 9 - 3 = 6 V. Vì mạch nối tiếp nên dòng qua R là I = 0,02 A. Điện trở cần mắc: R = U_R / I = 6 / 0,02 = 300 ôm.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nghĩ điện trở của đèn sợi đốt là hằng số (thực tế khi sáng dây tóc nóng lên, R tăng mạnh làm đặc tuyến I-U cong lên)."],
        pedagogicalAdvice: ["Dùng giáo trình STEM trang 50-107 để hướng dẫn học sinh làm dự án đèn học."],
        differentiationPrompts: {
          support: "Khi tăng điện trở R trong mạch thì cường độ dòng điện I tăng hay giảm?",
          advanced: "Làm thế nào để thiết kế mạch điều chỉnh độ sáng đèn LED mượt mà bằng linh kiện bán dẫn (Transistor hoặc chiết áp PWM) thay cho biến trở thuần trở?",
        },
      },
    },
  },
];

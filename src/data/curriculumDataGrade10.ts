import { LessonTopic } from "../types/physics";

export const GRADE_10_LESSONS: LessonTopic[] = [
  // ==========================================
  // CHƯƠNG I: MỞ ĐẦU (4 TIẾT)
  // ==========================================
  {
    id: "vl10-lam-quen-voi-vat-li",
    grade: 10,
    chapterNumber: 1,
    chapterTitle: "Chương I: Mở đầu",
    lessonNumber: 1,
    lessonTitle: "Bài 1: Làm quen với Vật lí",
    estimatedPeriods: 1,
    ppctSessions: "Tiết 1",
    durationDisplay: "1 tiết (45 phút)",
    standardCurriculumCode: "VL10.KNTT.B1",
    digitalCompetencies: ["1.1.NC1a", "3.1.NC1a"],
    assessmentRubricId: "rubric-presentation",
    defaultActivity: {
      id: "act-vl10-b1",
      activityTitle: "Hoạt động: Tìm hiểu đối tượng nghiên cứu và tiến trình tìm hiểu tự nhiên dưới góc độ vật lí (Thời lượng: 1 tiết - 45 phút)",
      durationMinutes: 45,
      objectives: {
        knowledge: [
          "Nêu được đối tượng nghiên cứu của Vật lí học và mục tiêu của môn Vật lí.",
          "Phân tích được một số ảnh hưởng của vật lí đối với cuộc sống, đối với sự phát triển khoa học, công nghệ và kĩ thuật.",
          "Mô tả được các bước trong tiến trình tìm hiểu thế giới tự nhiên dưới góc độ vật lí.",
        ],
        physicsCompetencies: [
          "Nêu được ví dụ chứng tỏ kiến thức, kĩ năng vật lí được sử dụng trong giao thông, y học, viễn thông và năng lượng.",
          "Mô tả được tiến trình: Quan sát -> Câu hỏi -> Giả thuyết -> Thí nghiệm kiểm chứng -> Kết luận.",
        ],
        generalCompetencies: ["Tự chủ và tự học, giao tiếp hợp tác qua thảo luận nhóm."],
        digitalCompetencies: ["1.1.NC1a, 3.1.NC1a: Tra cứu thông tin trên Internet về các phát minh vật lí."],
        qualities: ["Yêu thích khoa học, có ý thức tìm hiểu tự nhiên."],
      },
      content: "Tìm hiểu đối tượng nghiên cứu của Vật lí (vật chất và năng lượng), phân tích các cuộc cách mạng công nghiệp gắn liền với các thành tựu vật lí, mô tả chu trình nghiên cứu thực nghiệm và lí thuyết.",
      product: "Bảng tóm tắt đối tượng nghiên cứu và sơ đồ các bước trong tiến trình tìm hiểu thế giới tự nhiên.",
      implementation: {
        step1_transfer: "Giáo viên nêu vấn đề (5 phút): Tại sao điện thoại thông minh, máy bay, kính viễn vọng không gian James Webb đều bắt nguồn từ các nghiên cứu vật lí cơ bản? Chuyển giao phiếu học tập.",
        step2_execution: "Học sinh thực hiện nhiệm vụ (25 phút): Đọc SGK, làm việc nhóm 4 em: (1) Liệt kê 5 nhánh chính của Vật lí học; (2) Vẽ sơ đồ chu trình nghiên cứu khoa học; (3) Nêu ví dụ ứng dụng vật lí trong đời sống.",
        step3_discussion: "Báo cáo và thảo luận (10 phút): Đại diện 2 nhóm trình bày sơ đồ tiến trình khoa học; các nhóm khác đặt câu hỏi phản biện.",
        step4_conclusion: "Kết luận và chuẩn hóa (5 phút): Giáo viên tổng kết các bước trong phương pháp thực nghiệm và phương pháp mô hình lí thuyết.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: LÀM QUEN VỚI VẬT LÍ",
        code: "PHT-VL10-B1",
        tasks: [
          {
            id: 1,
            instruction: "Sơ đồ hóa phương pháp nghiên cứu",
            prompt: "Sắp xếp đúng thứ tự 5 bước trong phương pháp thực nghiệm nghiên cứu Vật lí?",
            expectedAnswer: "1. Xác định vấn đề cần nghiên cứu -> 2. Quan sát, thu thập thông tin -> 3. Đưa ra dự đoán (giả thuyết) -> 4. Thiết kế và làm thí nghiệm kiểm chứng -> 5. Rút ra kết luận (thừa nhận hoặc bác bỏ giả thuyết).",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nghĩ Vật lí chỉ là các công thức toán khô khan."],
        pedagogicalAdvice: ["Dùng kĩ thuật CATs 'Bài tập 1 phút' cuối giờ."],
        differentiationPrompts: {
          support: "Kể tên 3 đồ dùng trong gia đình hoạt động dựa trên các định luật vật lí?",
          advanced: "Phân tích vai trò của cơ học lượng tử trong sự ra đời của máy tính và Internet?",
        },
      },
    },
  },
  {
    id: "vl10-quy-tac-an-toan-phong-thuc-hanh",
    grade: 10,
    chapterNumber: 1,
    chapterTitle: "Chương I: Mở đầu",
    lessonNumber: 2,
    lessonTitle: "Bài 2: Các quy tắc an toàn trong phòng thực hành Vật lí",
    estimatedPeriods: 1,
    ppctSessions: "Tiết 2",
    durationDisplay: "1 tiết (45 phút)",
    standardCurriculumCode: "VL10.KNTT.B2",
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl10-b2",
      activityTitle: "Hoạt động: Nhận diện biển báo nguy hiểm và quy tắc an toàn trong phòng thực hành (Thời lượng: 1 tiết - 45 phút)",
      durationMinutes: 45,
      objectives: {
        knowledge: ["Thảo luận để nêu được các quy tắc an toàn trong nghiên cứu và học tập môn Vật lí."],
        physicsCompetencies: ["Phân loại được các biển cảnh báo nguy hiểm (điện cao thế, tia laser, chất phóng xạ, bề mặt nóng)."],
        generalCompetencies: ["Giao tiếp và hợp tác nhóm xây dựng cẩm nang an toàn phòng thí nghiệm."],
        qualities: ["Trách nhiệm, kỷ luật cao trong phòng thí nghiệm."],
      },
      content: "Tìm hiểu các nguy cơ mất an toàn khi làm thí nghiệm nhiệt, điện, quang (tia laser), chất phóng xạ. Nhận diện các biển báo và quy trình xử lí sự cố.",
      product: "Bản cam kết an toàn phòng thí nghiệm có chữ kí các thành viên nhóm.",
      implementation: {
        step1_transfer: "Giáo viên chiếu hình ảnh sự cố chập điện và vỡ ống thủy tinh (5 phút), giao nhiệm vụ phân tích nguyên nhân.",
        step2_execution: "Học sinh làm việc nhóm (25 phút): Ghép các biển cảnh báo với ý nghĩa tương ứng; liệt kê 10 điều cấm trong phòng thực hành.",
        step3_discussion: "Báo cáo (10 phút): Các nhóm tranh luận về cách xử lí khi xảy ra chập cháy điện.",
        step4_conclusion: "Chuẩn hóa (5 phút): Giáo viên chốt các nguyên tắc an toàn: Không chạm tay ướt vào nguồn điện, tắt nguồn trước khi tháo dây, đeo kính bảo hộ khi làm thí nghiệm nhiệt/quang.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: AN TOÀN PHÒNG THÍ NGHIỆM",
        code: "PHT-VL10-B2",
        tasks: [
          {
            id: 1,
            instruction: "Xử lí tình huống khẩn cấp",
            prompt: "Khi phát hiện một bạn bị điện giật trong phòng thực hành, hành động đầu tiên cần làm là gì?",
            expectedAnswer: "Lập tức ngắt ngay cầu dao/công tắc điện chính hoặc dùng vật cách điện khô (gậy gỗ, que nhựa) gạt dây điện ra khỏi người bị nạn; tuyệt đối không dùng tay chạm trực tiếp vào người nạn nhân.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Nhiều học sinh chủ quan với tia laser từ bút chỉ bảng."],
        pedagogicalAdvice: ["Cho học sinh kí cam kết ngay đầu năm học."],
        differentiationPrompts: {
          support: "Điện áp bao nhiêu Vôn trở lên có thể gây nguy hiểm cho tính mạng con người?",
          advanced: "Tại sao trong phòng thí nghiệm quang học hiện đại, cửa sổ luôn phải có biển cảnh báo bước sóng laser?",
        },
      },
    },
  },
  {
    id: "vl10-sai-so-phep-do",
    grade: 10,
    chapterNumber: 1,
    chapterTitle: "Chương I: Mở đầu",
    lessonNumber: 3,
    lessonTitle: "Bài 3: Thực hành tính sai số trong phép đo. Ghi kết quả đo",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 3, 4",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL10.KNTT.B3",
    stemActivity: "Thiết kế thước đo thước kẹp bằng bìa mica",
    experiments: ["Thực hành đo đường kính viên bi thép bằng thước kẹp"],
    assessmentRubricId: "rubric-stem-design",
    defaultActivity: {
      id: "act-vl10-b3",
      activityTitle: "Hoạt động: Xác định sai số phép đo & Dự án chế tạo thước kẹp mica (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Phân biệt được phép đo trực tiếp và phép đo gián tiếp.",
          "Xác định được sai số dụng cụ, sai số ngẫu nhiên, sai số tuyệt đối và sai số tỉ đối.",
          "Viết đúng kết quả đo theo quy chuẩn: A = A_tb ± ΔA.",
        ],
        physicsCompetencies: [
          "Sử dụng thước kẹp đo đường kính trong, đường kính ngoài, độ sâu lỗ.",
          "Chế tạo thước kẹp có du xích chia độ 0,1 mm từ bìa mica.",
        ],
        generalCompetencies: ["Năng lực thiết kế kĩ thuật, làm việc nhóm."],
        qualities: ["Tỉ mỉ, cẩn thận, trung thực trong đo đạc."],
      },
      content: "Khái niệm phép đo và sai số. Cách tính giá trị trung bình, sai số tuyệt đối từng lần đo, sai số ngẫu nhiên trung bình và sai số dụng cụ. Dự án STEM làm thước kẹp du xích 10 vạch.",
      product: "Bảng số liệu 5 lần đo đường kính viên bi kèm cách viết kết quả và mô hình thước kẹp mica.",
      implementation: {
        step1_transfer: "Giáo viên đưa viên bi thép nhỏ (10 phút): Làm sao đo được đường kính viên bi này chính xác tới 0,1 mm bằng thước kẻ học sinh? Giới thiệu nguyên tắc du xích Vernier.",
        step2_execution: "Thực hành đo và tính toán (45 phút): Đo 5 lần đường kính viên bi; tính giá trị trung bình, sai số tuyệt đối và sai số tương đối; cắt dán bìa mica tạo thân thước và du xích.",
        step3_discussion: "Báo cáo và kiểm tra (20 phút): Các nhóm đối chiếu kết quả đo giữa thước kẹp chuẩn và thước mica tự chế.",
        step4_conclusion: "Chuẩn hóa (15 phút): Giáo viên chốt quy tắc tính sai số của phép đo gián tiếp (tổng sai số tỉ đối khi nhân chia); quy tắc làm tròn chữ số có nghĩa.",
      },
      studentWorksheet: {
        title: "PHIẾU THỰC HÀNH: TÍNH SAI SỐ PHÉP ĐO",
        code: "PHT-VL10-B3",
        tasks: [
          {
            id: 1,
            instruction: "Ghi kết quả đo",
            prompt: "Đo thời gian rơi 5 lần: 0,398 s; 0,399 s; 0,402 s; 0,401 s; 0,400 s. Sai số dụng cụ là 0,001 s. Hãy viết kết quả đo thời gian rơi?",
            expectedAnswer: "t_tb = (0,398+0,399+0,402+0,401+0,400)/5 = 0,400 s. Sai số ngẫu nhiên: Delta t_ngau_nhien = (|0,398-0,400| + ...)/5 = 0,0012 s. Sai số dụng cụ Delta t_dc = 0,001 s => Delta t = 0,0012 + 0,001 = 0,0022 s ≈ 0,002 s. Kết quả: t = 0,400 ± 0,002 (s).",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay quên cộng sai số dụng cụ vào sai số tuyệt đối."],
        pedagogicalAdvice: ["Dùng Rubric Bản thiết kế để chấm mô hình thước kẹp mica."],
        differentiationPrompts: {
          support: "Công thức tính sai số tỉ đối delta theo sai số tuyệt đối Delta A và A_tb là gì?",
          advanced: "Chứng minh rằng khi tính thể tích khối cầu V = (4/3)pi.R^3 thì sai số tỉ đối của V gấp 3 lần sai số tỉ đối của bán kính R?",
        },
      },
    },
  },

  // ==========================================
  // CHƯƠNG II: ĐỘNG HỌC (16 TIẾT)
  // ==========================================
  {
    id: "vl10-toc-do-van-toc",
    grade: 10,
    chapterNumber: 2,
    chapterTitle: "Chương II: Động học",
    lessonNumber: 5,
    lessonTitle: "Bài 5: Tốc độ và vận tốc",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 6, 7",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL10.KNTT.B5",
    digitalCompetencies: ["1.3.NC1a", "3.1.NC1b"],
    assessmentRubricId: "rubric-presentation",
    defaultActivity: {
      id: "act-vl10-b5",
      activityTitle: "Hoạt động: Phân biệt Tốc độ vô hướng và Vận tốc vectơ theo CV 5512 (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Lập luận rút ra công thức tính tốc độ trung bình v = s / t.",
          "Dựa vào định nghĩa độ dịch chuyển d, rút ra công thức vectơ vận tốc v = d / t.",
          "Vận dụng công thức cộng vận tốc: v13 = v12 + v21.",
        ],
        physicsCompetencies: [
          "Phân biệt quãng đường s (luôn dương) và độ dịch chuyển d (đại lượng vectơ có thể âm, dương, bằng 0).",
          "Xác định vận tốc tổng hợp của thuyền khi bơi xuôi dòng và ngược dòng nước.",
        ],
        generalCompetencies: ["Giải quyết vấn đề định vị GPS, đọc thông số tốc kế trên xe hơi."],
        digitalCompetencies: ["1.3.NC1a, 3.1.NC1b: Tra cứu lộ trình bản đồ Google Maps và phân tích tốc độ trung bình."],
        qualities: ["Ý thức chấp hành quy định tốc độ khi tham gia giao thông."],
      },
      content: "Nghiên cứu tốc độ trung bình, tốc độ tức thời; định nghĩa độ dịch chuyển và vectơ vận tốc; phân tích tính tương đối của chuyển động và công thức cộng vận tốc.",
      product: "Bảng so sánh chi tiết Tốc độ và Vận tốc kèm lời giải bài toán thuyền chạy trên sông.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Một vận động viên bơi hết một vòng hồ bơi 50m rồi quay về điểm xuất phát mất 60 giây. Tốc độ trung bình và vận tốc trung bình của người đó là bao nhiêu?",
        step2_execution: "Làm việc nhóm (45 phút): Tính quãng đường s = 100m, độ dịch chuyển d = 0m; tính tốc độ v = 100/60 = 1,67 m/s và vận tốc v_vec = 0/60 = 0 m/s; giải thích sự khác biệt; làm bài tập cộng vận tốc thuyền và dòng nước.",
        step3_discussion: "Báo cáo và thảo luận (20 phút): Các nhóm tranh luận tại sao tốc kế xe máy chỉ đo tốc độ tức thời chứ không đo vận tốc.",
        step4_conclusion: "Chuẩn hóa (15 phút): Giáo viên tổng kết: Tốc độ là đại lượng vô hướng đặc trưng cho độ nhanh chậm; Vận tốc là đại lượng vectơ đặc trưng cho cả độ nhanh chậm và hướng chuyển động.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: TỐC ĐỘ VÀ VẬN TỐC",
        code: "PHT-VL10-B5",
        tasks: [
          {
            id: 1,
            instruction: "Công thức cộng vận tốc",
            prompt: "Một chiếc ca nô chạy xuôi dòng từ bến A đến bến B mất 2 giờ, chạy ngược dòng từ B về A mất 3 giờ. Biết khoảng cách AB = 60 km. Tính vận tốc ca nô đối với nước và vận tốc dòng nước?",
            expectedAnswer: "v_xuoi = 60/2 = 30 km/h = v_thuyen + v_nuoc. v_nguoc = 60/3 = 20 km/h = v_thuyen - v_nuoc. Giải hệ: v_thuyen = 25 km/h, v_nuoc = 5 km/h.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay đồng nhất tốc độ và vận tốc trong ngôn ngữ thường ngày."],
        pedagogicalAdvice: ["Dùng câu hỏi tình huống bơi lội vòng khép kín để tạo mâu thuẫn nhận thức."],
        differentiationPrompts: {
          support: "Khi vật đi một vòng tròn khép kín thì độ dời bằng bao nhiêu?",
          advanced: "Một máy bay bay về hướng Bắc với tốc độ 400 km/h gặp gió thổi về hướng Đông 100 km/h. Xác định vận tốc tổng hợp của máy bay so với mặt đất?",
        },
      },
    },
  },
  {
    id: "vl10-thuc-hanh-do-toc-do",
    grade: 10,
    chapterNumber: 2,
    chapterTitle: "Chương II: Động học",
    lessonNumber: 6,
    lessonTitle: "Bài 6: Thực hành: Đo tốc độ của vật chuyển động",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 8, 9",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL10.KNTT.B6",
    stemActivity: "Chế tạo xe đồ chơi đo tốc độ bằng video",
    digitalCompetencies: ["3.1.NC1b", "5.3.NC1b"],
    experiments: ["Bộ TN đo tốc độ chuyển động của viên bi thép bằng cổng quang điện hiện số"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl10-b6",
      activityTitle: "Hoạt động: Thực hành đo tốc độ bằng cổng quang điện & Dự án đo tốc độ bằng video (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Thảo luận thiết kế phương án và thực hiện đo tốc độ tức thời và tốc độ trung bình.",
          "Đánh giá ưu nhược điểm của các phương pháp đo: đồng hồ bấm giây thủ công, cổng quang điện, phân tích video Tracker.",
        ],
        physicsCompetencies: [
          "Thao tác đo thời gian chắn sáng của tấm cản quang qua cổng quang điện.",
          "Quay video chuyển động của xe đồ chơi và trích xuất tọa độ x(t) trên phần mềm Tracker.",
        ],
        generalCompetencies: ["Năng lực thực hành, ứng dụng công nghệ số vào nghiên cứu chuyển động."],
        qualities: ["Khách quan, chính xác trong thu thập dữ liệu."],
      },
      content: "Thực hành đo tốc độ của viên bi thép hoặc xe trượt bằng cổng quang điện và đồng hồ hiện số. Ứng dụng điện thoại thông minh quay video tốc độ cao (slow-mo) để đo tốc độ xe đồ chơi.",
      product: "Báo cáo kết quả đo tốc độ trung bình và đồ thị vị trí thời gian trích xuất từ video.",
      implementation: {
        step1_transfer: "Giáo viên nêu vấn đề (10 phút): Các trinh sát bắn tốc độ giao thông trên đường như thế nào? Trong phòng thí nghiệm làm sao đo tốc độ của viên bi chuyển động rất nhanh? Giới thiệu cổng quang điện.",
        step2_execution: "Thực hành đo đạc (45 phút): Nhóm học sinh đo độ rộng tấm chắn sáng d = 2 cm; thả xe trượt qua 2 cổng quang A và B; đồng hồ ghi thời gian t1, t2; tính tốc độ tức thời tại A, B và tốc độ trung bình trên đoạn AB; quay video xe đồ chơi có thước định cỡ.",
        step3_discussion: "Báo cáo và so sánh (20 phút): So sánh độ chính xác giữa bấm giờ bằng tay và dùng cảm biến cổng quang điện.",
        step4_conclusion: "Chuẩn hóa (15 phút): Giáo viên tổng kết sai số dụng cụ đo thời gian hiện số (± 0,001 s) và quy tắc đo tốc độ v = d / Δt.",
      },
      studentWorksheet: {
        title: "PHIẾU THỰC HÀNH: ĐO TỐC ĐỘ VẬT CHUYỂN ĐỘNG",
        code: "PHT-VL10-B6",
        tasks: [
          {
            id: 1,
            instruction: "Tính tốc độ tức thời",
            prompt: "Tấm cản quang rộng d = 1,00 cm đi qua cổng quang điện trong thời gian 0,020 s. Tính tốc độ tức thời của xe tại vị trí cổng quang?",
            expectedAnswer: "v = d / Delta t = 0,01 m / 0,020 s = 0,50 m/s = 50 cm/s.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nhầm độ rộng tấm cản quang d với quãng đường giữa 2 cổng quang."],
        pedagogicalAdvice: ["Khuyến khích học sinh dùng điện thoại quay phim để phân tích số liệu."],
        differentiationPrompts: {
          support: "Công thức tính vận tốc trung bình trên cả đoạn đường AB là gì?",
          advanced: "Tại sao khi tấm chắn sáng càng hẹp thì tốc độ đo được càng tiệm cận với tốc độ tức thời?",
        },
      },
    },
  },
  {
    id: "vl10-chuyen-dong-thang-bien-doi-deu",
    grade: 10,
    chapterNumber: 2,
    chapterTitle: "Chương II: Động học",
    lessonNumber: 9,
    lessonTitle: "Bài 9: Chuyển động thẳng biến đổi đều",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 13, 14",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL10.KNTT.B9",
    simulationId: "sim-motion-10",
    digitalCompetencies: ["3.1.NC1b", "5.3.NC1b"],
    experiments: ["Mô phỏng đồ thị v-t xe chuyển động biến đổi đều"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl10-b9",
      activityTitle: "Hoạt động: Xây dựng công thức chuyển động thẳng biến đổi đều qua đồ thị v - t (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Rút ra các công thức: v = v0 + a.t; d = v0.t + 1/2.a.t^2; v^2 - v0^2 = 2.a.d.",
          "Tính độ dịch chuyển d từ diện tích hình thang dưới đồ thị vận tốc - thời gian (v-t).",
        ],
        physicsCompetencies: [
          "Phân biệt chuyển động nhanh dần đều (a.v > 0) và chậm dần đều (a.v < 0).",
          "Vận dụng công thức giải bài toán hãm phanh an toàn của xe ô tô khi gặp vật cản.",
        ],
        generalCompetencies: ["Tư duy hình học tích hợp giải tích không dùng tích phân."],
        digitalCompetencies: ["Sử dụng mô phỏng số PhysLab khảo sát xe tăng tốc trên đường thẳng ray đệm khí."],
        qualities: ["Ý thức an toàn giao thông, giữ khoảng cách phanh xe an toàn."],
      },
      content: "Nghiên cứu đồ thị v-t dạng đường thẳng xiên. Sử dụng phương pháp diện tích hình thang giới hạn bởi đồ thị v-t và trục thời gian để chứng minh công thức độ dịch chuyển d = v0.t + 1/2.a.t^2 và hệ thức độc lập thời gian.",
      product: "Bản chứng minh hình học công thức độ dịch chuyển và lời giải các bài toán hãm phanh ô tô.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Một ô tô đang chạy 72 km/h tài xế đạp phanh gấp với gia tốc hãm a = -4 m/s^2. Sau bao lâu xe dừng lại và quãng đường hãm phanh là bao nhiêu mét?",
        step2_execution: "Làm việc nhóm và suy luận (45 phút): Vẽ đồ thị v-t; chia hình phẳng thành hình chữ nhật (v0*t) và tam giác vuông (1/2*a*t^2); chứng minh d = v0*t + 1/2*a*t^2; rút ra hệ thức v^2 - v0^2 = 2*a*d; kiểm chứng trên mô phỏng số.",
        step3_discussion: "Báo cáo và phản biện (20 phút): Đại diện nhóm giải bài toán khoảng cách an toàn khi phanh; thảo luận ảnh hưởng của đường trơn ướt.",
        step4_conclusion: "Chuẩn hóa (15 phút): Giáo viên hệ thống 4 công thức cốt lõi của chuyển động thẳng biến đổi đều; lưu ý chọn chiều dương để xác định dấu của a, v0 và d.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: CHUYỂN ĐỘNG THẲNG BIẾN ĐỔI ĐỀU",
        code: "PHT-VL10-B9",
        tasks: [
          {
            id: 1,
            instruction: "Bài toán phanh xe",
            prompt: "Một xe ô tô đang chạy với vận tốc 72 km/h (20 m/s) thì hãm phanh chuyển động chậm dần đều với gia tốc có độ lớn 2 m/s2. Tính quãng đường xe đi được từ lúc hãm phanh đến khi dừng hẳn?",
            expectedAnswer: "Khi dừng hẳn: v = 0. Chọn chiều dương là chiều chuyển động => v0 = +20 m/s, a = -2 m/s2. Áp dụng hệ thức liên hệ: v^2 - v0^2 = 2*a*d => 0^2 - 20^2 = 2*(-2)*d => -400 = -4*d => d = 100 m. Quãng đường xe đi được là 100 mét.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nhầm gia tốc chậm dần đều luôn mang dấu âm bất kể chọn chiều dương."],
        pedagogicalAdvice: ["Nhấn mạnh chuyển động chậm dần đều là tích a.v < 0."],
        differentiationPrompts: {
          support: "Công thức liên hệ không chứa thời gian t là gì?",
          advanced: "Tại sao diện tích dưới đồ thị v-t lại có giá trị đúng bằng độ dịch chuyển d? Giải thích bằng phương pháp chia nhỏ quãng đường?",
        },
      },
    },
  },
  {
    id: "vl10-chuyen-dong-nem",
    grade: 10,
    chapterNumber: 2,
    chapterTitle: "Chương II: Động học",
    lessonNumber: 12,
    lessonTitle: "Bài 12: Chuyển động ném",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 19, 20",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL10.KNTT.B12",
    stemActivity: "Thiết kế máy bắn đá",
    experiments: ["Thí nghiệm khảo sát chuyển động ném ngang và ném xiên"],
    assessmentRubricId: "rubric-stem-product",
    defaultActivity: {
      id: "act-vl10-b12",
      activityTitle: "Hoạt động: Khảo sát chuyển động ném & Dự án STEM Thiết kế máy bắn đá (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Phân tích chuyển động ném thành hai thành phần vuông góc độc lập: chuyển động thẳng đều theo trục Ox và rơi tự do theo trục Oy.",
          "Viết phương trình quỹ đạo parabol, công thức tầm bay xa L và tầm bay cao H.",
        ],
        physicsCompetencies: [
          "Thực hiện dự án nghiên cứu tìm điều kiện góc ném để đạt tầm xa lớn nhất (alpha = 45° trong chân không).",
          "Chế tạo mô hình máy bắn đá (Catapult) từ que kem, dây thun và nắp chai nhựa.",
        ],
        generalCompetencies: ["Năng lực sáng chế kĩ thuật, lập kế hoạch thử nghiệm và điều chỉnh."],
        qualities: ["Hăng say sáng tạo, an toàn khi bắn thử nghiệm."],
      },
      content: "Phương pháp tọa độ khảo sát chuyển động ném ngang và ném xiên. Thiết lập phương trình quỹ đạo y = (g / 2.v0^2).x^2 (ném ngang). Chế tạo máy bắn đá và thi đấu tầm xa trúng đích.",
      product: "Mô hình máy bắn đá mini bắn trúng hồng tâm ở cự li 3-5 mét kèm bản báo cáo góc ném tối ưu.",
      implementation: {
        step1_transfer: "Giao nhiệm vụ dự án STEM (15 phút): Các chiến binh cổ đại công thành bằng máy bắn đá như thế nào? Thử thách: Chế tạo máy bắn đá mini bắn viên bi giấy đạt tầm xa tối thiểu 3m.",
        step2_execution: "Thi công và khảo sát (45 phút): Nhóm học sinh lắp ráp khung máy bắn đá bằng que kem và súng bắn keo; dùng dây thun đàn hồi làm lực đẩy đòn bẩy; thử nghiệm ở các góc ném 30°, 45°, 60°; ghi nhận tầm xa.",
        step3_discussion: "Báo cáo và thi tài (20 phút): Các nhóm thi đấu bắn hồng tâm tính điểm; đại diện nhóm giải thích tại sao góc ném 45° cho tầm xa lớn nhất.",
        step4_conclusion: "Chuẩn hóa (10 phút): Giáo viên chốt phương trình quỹ đạo parabol; giải thích sức cản không khí thực tế làm góc ném tối ưu giảm xuống khoảng 38° - 42°.",
      },
      studentWorksheet: {
        title: "PHIẾU DỰ ÁN STEM: MÁY BẮN ĐÁ MINI",
        code: "PHT-STEM-VL10-B12",
        tasks: [
          {
            id: 1,
            instruction: "Tính tầm bay xa ném ngang",
            prompt: "Từ đỉnh tháp cao h = 20 m, ném ngang viên sỏi với vận tốc v0 = 15 m/s. Lấy g = 10 m/s2. Bỏ qua sức cản. Tính thời gian rơi và tầm bay xa của viên sỏi?",
            expectedAnswer: "Thời gian rơi: t = sqrt(2h/g) = sqrt(2*20/10) = 2 s. Tầm bay xa: L = v0 * t = 15 * 2 = 30 m.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nghĩ vật nặng hơn sẽ rơi nhanh hơn khi ném ngang."],
        pedagogicalAdvice: ["Dùng Rubric Sản phẩm STEM để chấm điểm thi đấu máy bắn đá."],
        differentiationPrompts: {
          support: "Chuyển động rơi theo phương thẳng đứng có phụ thuộc vào vận tốc ném ngang không?",
          advanced: "Thiết lập công thức tầm bay xa L của vật ném xiên góc alpha với vận tốc ban đầu v0?",
        },
      },
    },
  },

  // ==========================================
  // CHƯƠNG III: ĐỘNG LỰC HỌC (18 TIẾT)
  // ==========================================
  {
    id: "vl10-dinh-luat-2-newton",
    grade: 10,
    chapterNumber: 3,
    chapterTitle: "Chương III: Động lực học",
    lessonNumber: 15,
    lessonTitle: "Bài 15: Định luật 2 Newton",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 36, 37",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL10.KNTT.B15",
    simulationId: "sim-newton-10",
    digitalCompetencies: ["1.3.NC1a", "3.1.NC1b"],
    experiments: ["Bộ TN Định luật II Newton xe lăn kéo bởi quả nặng và cảm biến gia tốc"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl10-b15",
      activityTitle: "Hoạt động: Khảo sát mối quan hệ a ~ F và a ~ 1/m, xây dựng định luật 2 Newton (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Thực hiện thí nghiệm hoặc sử dụng số liệu rút ra a ~ F (khi m không đổi) và a ~ 1/m (khi F không đổi).",
          "Viết biểu thức vectơ a = vectơ F / m hay vectơ F = m.vectơ a (Định luật 2 Newton).",
          "Nêu được khối lượng là đại lượng đặc trưng cho mức quán tính của vật; vận dụng đơn vị 1 N = 1 kg.m/s^2.",
        ],
        physicsCompetencies: [
          "Thao tác đo gia tốc xe lăn khi thay đổi lực kéo F và khối lượng m.",
          "Vẽ đồ thị a theo F và đồ thị a theo 1/m để kiểm chứng mối quan hệ tỉ lệ.",
        ],
        generalCompetencies: ["Năng lực tìm tòi thực nghiệm khoa học, phân tích đồ thị."],
        digitalCompetencies: ["Khai thác phần mềm mô phỏng số PhysLab để thu thập bảng số liệu."],
        qualities: ["Khách quan, trung thực với số liệu thực nghiệm."],
      },
      content: "Tiến hành 2 bước thí nghiệm độc lập: (1) Giữ m không đổi, thay đổi quả nặng kéo F, đo gia tốc a; (2) Giữ F không đổi, đặt thêm gia tải lên xe (tăng m), đo gia tốc a. Tổng hợp thành biểu thức F = m.a.",
      product: "Đồ thị đường thẳng a(F) và a(1/m) trên giấy kẻ ô cùng hệ thức định luật 2 Newton.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Một chiếc ô tô con 1 tấn và một chiếc xe tải 10 tấn cùng động cơ có lực kéo 5000 N, xe nào tăng tốc nhanh hơn? Muốn xe tải tăng tốc bằng ô tô con thì lực kéo phải tăng mấy lần?",
        step2_execution: "Làm việc nhóm trên mô phỏng số (45 phút): Nhóm học sinh điều chỉnh F lần lượt 0.5N, 1.0N, 1.5N (m = 0.5 kg), đo a; sau đó giữ F = 1.0N, đổi m = 0.5kg, 1.0kg, 1.5kg, đo a; vẽ đồ thị kiểm chứng.",
        step3_discussion: "Báo cáo và thảo luận (20 phút): Các nhóm báo cáo đồ thị; thảo luận ý nghĩa của quán tính (khối lượng càng lớn càng khó đổi vận tốc).",
        step4_conclusion: "Chuẩn hóa (15 phút): Giáo viên phát biểu định luật 2 Newton; mở rộng trường hợp có nhiều lực tác dụng: vectơ F_hl = m.vectơ a.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: ĐỊNH LUẬT II NEWTON",
        code: "PHT-VL10-B15",
        tasks: [
          {
            id: 1,
            instruction: "Tính gia tốc và lực",
            prompt: "Một vật có khối lượng m = 2 kg đang đứng yên chịu tác dụng của lực kéo F = 10 N và lực ma sát Fms = 2 N theo phương ngang. Tính gia tốc của vật và vận tốc sau 4 giây?",
            expectedAnswer: "Hợp lực: F_hl = F_keo - Fms = 10 - 2 = 8 N. Gia tốc: a = F_hl / m = 8 / 2 = 4 m/s2. Vận tốc sau 4s: v = v0 + a*t = 0 + 4 * 4 = 16 m/s.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay quên lực ma sát cản trở, nhầm lẫn F trong định luật là lực kéo chứ không phải hợp lực."],
        pedagogicalAdvice: ["Nhấn mạnh: Trong định luật II Newton, F luôn luôn là HỢP LỰC của tất cả các lực tác dụng lên vật."],
        differentiationPrompts: {
          support: "Nếu hợp lực tác dụng lên vật bằng 0 thì gia tốc bằng bao nhiêu? Vật chuyển động như thế nào?",
          advanced: "Tại sao đơn vị lực Newton không phải là đơn vị cơ bản mà là đơn vị dẫn xuất trong hệ SI?",
        },
      },
    },
  },
  {
    id: "vl10-moment-luc-can-bang-vat-ran",
    grade: 10,
    chapterNumber: 3,
    chapterTitle: "Chương III: Động lực học",
    lessonNumber: 21,
    lessonTitle: "Bài 21: Moment lực. Cân bằng của vật rắn",
    estimatedPeriods: 4,
    ppctSessions: "Tiết 45-48",
    durationDisplay: "4 tiết (180 phút)",
    standardCurriculumCode: "VL10.KNTT.B21",
    stemActivity: "Chế tạo cánh tay cẩu thủy lực sử dụng đòn bẩy",
    experiments: ["Đĩa quay đồng trục có các lỗ cắm quả nặng kiểm chứng quy tắc moment lực M = F.d"],
    assessmentRubricId: "rubric-stem-product",
    defaultActivity: {
      id: "act-vl10-b21",
      activityTitle: "Hoạt động: Quy tắc Moment lực & Dự án Chế tạo cánh tay cẩu thủy lực (Thời lượng: 4 tiết - 180 phút)",
      durationMinutes: 180,
      objectives: {
        knowledge: [
          "Nêu định nghĩa moment lực M = F.d (d là cánh tay đòn, khoảng cách từ trục quay đến giá của lực).",
          "Phát biểu quy tắc moment lực: Tổng moment làm vật quay theo chiều kim đồng hồ bằng tổng moment quay ngược chiều.",
          "Nêu điều kiện cân bằng tổng quát của vật rắn: hợp lực bằng 0 và tổng moment lực bằng 0.",
        ],
        physicsCompetencies: [
          "Xác định đúng cánh tay đòn d trên các mô hình đòn bẩy thực tế (kéo cắt kim loại, cờ-lê, bập bênh).",
          "Chế tạo cánh tay cẩu thủy lực bằng bìa carton và xi-lanh tiêm truyền áp suất Pas-can.",
        ],
        generalCompetencies: ["Năng lực sáng tạo kĩ thuật, làm việc nhóm chế tạo sản phẩm STEM."],
        qualities: ["Kiên nhẫn thi công, phối hợp ăn ý giữa các thành viên."],
      },
      content: "Nghiên cứu tác dụng làm quay của lực, định nghĩa moment lực M = F.d (N.m). Thực hành đĩa moment kiểm chứng quy tắc M1 = M2. Chế tạo cánh tay cẩu thủy lực nâng vật nặng sử dụng nguyên lí đòn bẩy và áp suất chất lỏng.",
      product: "Mô hình cánh tay robot cẩu hàng nâng được vật nặng 200g và xoay 180 độ.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (20 phút): Tại sao mở nắp lon sữa bằng thìa lại dễ hơn dùng tay? Tại sao tay nắm cửa luôn đặt ở mép ngoài cùng xa bản lề? Giới thiệu dự án Cánh tay cẩu thủy lực.",
        step2_execution: "Nghiên cứu lí thuyết và thi công (90 phút): Thí nghiệm đĩa cân bằng moment; xây dựng công thức M = F.d; thiết kế bản vẽ cánh tay cẩu gồm 3 khớp đòn bẩy; dùng 4 cặp xi-lanh tiêm nối ống truyền dịch chứa nước nhuộm màu làm hệ thống thủy lực.",
        step3_discussion: "Báo cáo và thử tải (45 phút): Các nhóm điều khiển cánh tay cẩu gắp vật nặng 200g chuyển sang vị trí khác; bảo vệ bản thiết kế trước lớp.",
        step4_conclusion: "Chuẩn hóa và kết luận (25 phút): Giáo viên tổng kết quy tắc moment và điều kiện cân bằng của vật rắn có trục quay cố định; chấm điểm theo Rubric STEM.",
      },
      studentWorksheet: {
        title: "PHIẾU DỰ ÁN STEM: CÁNH TAY CẨU ĐÒN BẨY THỦY LỰC",
        code: "PHT-STEM-VL10-B21",
        tasks: [
          {
            id: 1,
            instruction: "Quy tắc moment lực",
            prompt: "Một thanh đòn bẩy dài L = 1 m có trục quay O ở chính giữa. Đầu A treo quả nặng P1 = 20 N cách O đoạn d1 = 40 cm. Cần tác dụng vào đầu B một lực F2 cách O đoạn d2 = 20 cm có độ lớn bao nhiêu để đòn bẩy nằm cân bằng ngang?",
            expectedAnswer: "Áp dụng quy tắc moment lực: P1 * d1 = F2 * d2 => F2 = (P1 * d1) / d2 = (20 * 40) / 20 = 40 N.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay đo khoảng cách từ trục quay đến ĐIỂM ĐẶT của lực thay vì khoảng cách vuông góc đến GIÁ của lực (cánh tay đòn d)."],
        pedagogicalAdvice: ["Dùng Rubric Đánh giá Sản phẩm Chế tạo STEM để chấm cánh tay robot cẩu hàng."],
        differentiationPrompts: {
          support: "Cánh tay đòn d là đoạn thẳng vuông góc từ trục quay đến đường nào?",
          advanced: "Lợi ích của việc kết hợp đòn bẩy với truyền động thủy lực trong máy xúc công trường là gì?",
        },
      },
    },
  },

  // ==========================================
  // CHƯƠNG IV: NĂNG LƯỢNG, CÔNG, CÔNG SUẤT (10 TIẾT)
  // ==========================================
  {
    id: "vl10-co-nang-bao-toan",
    grade: 10,
    chapterNumber: 4,
    chapterTitle: "Chương IV: Năng lượng, công, công suất",
    lessonNumber: 26,
    lessonTitle: "Bài 26: Cơ năng và định luật bảo toàn cơ năng",
    estimatedPeriods: 4,
    ppctSessions: "Tiết 68-71",
    durationDisplay: "4 tiết (180 phút)",
    standardCurriculumCode: "VL10.KNTT.B26",
    simulationId: "sim-pendulum-energy-10",
    stemActivity: "Thiết kế máng trượt bảo toàn cơ năng của viên bi",
    experiments: ["Bộ TN Con lắc đơn và máng trượt vòng lượn thẳng đứng"],
    assessmentRubricId: "rubric-stem-design",
    defaultActivity: {
      id: "act-vl10-b26",
      activityTitle: "Hoạt động: Xây dựng Định luật bảo toàn cơ năng & Mô phỏng Con lắc đồng hồ cổ (Thời lượng: 4 tiết - 180 phút)",
      durationMinutes: 180,
      objectives: {
        knowledge: [
          "Phân tích sự chuyển hoá qua lại giữa động năng và thế năng trong trọng trường đều.",
          "Nêu định nghĩa cơ năng W = Wđ + Wt và phát biểu định luật bảo toàn cơ năng: W = hằng số khi vật chỉ chịu tác dụng của trọng lực.",
          "Giải thích cơ chế cấp bù năng lượng bánh răng thoát (escapement) trong đồng hồ quả lắc.",
        ],
        physicsCompetencies: [
          "Chứng minh bằng suy luận toán học từ định lí biến thiên động năng dẫn tới W = const.",
          "Thao tác mô phỏng ảo con lắc đồng hồ, sử dụng công tắc ẩn/hiện số liệu sư phạm để tự tính toán kiểm chứng.",
          "Thiết kế mô hình máng trượt vòng lượn (Roller Coaster) cho viên bi lượn vòng an toàn không rơi.",
        ],
        generalCompetencies: ["Năng lực mô hình hóa toán học, giải quyết vấn đề kĩ thuật thực tiễn."],
        digitalCompetencies: ["Vận hành phần mềm mô phỏng số PhysLab, xuất bảng số liệu cơ năng CSV."],
        qualities: ["Trung thực với kết quả đo, say mê khám phá cơ cấu máy móc cổ."],
      },
      content: "Nghiên cứu cơ năng của vật trong trọng trường. Chứng minh định luật bảo toàn cơ năng bằng suy luận toán học. Khảo sát mô phỏng con lắc đồng hồ có âm thanh tích tắc và bánh răng thoát. Dự án thiết kế máng trượt viên bi.",
      product: "Bản chứng minh toán học định luật bảo toàn cơ năng, bảng đối chứng số liệu trên mô phỏng và mô hình máng trượt viên bi.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (20 phút): Xem quả lắc đồng hồ cổ kính đung đưa chính xác từng giây. Tại sao buông tay từ biên quả lắc lao nhanh xuống đáy rồi leo lên độ cao đối diện đúng bằng độ cao ban đầu? Vì sao đồng hồ cần quả tạ kéo để không bị dừng lại?",
        step2_execution: "Suy luận toán học và kiểm chứng mô phỏng (90 phút): Từ A = Delta Wđ và A = -Delta Wt chứng minh W1 = W2 = const; mở mô phỏng con lắc ảo, tắt công tắc hiện số, tự tính h, v, Wđ, Wt rồi bật công tắc đối chứng; khảo sát cơ chế bánh răng thoát cấp bù năng lượng; thi công máng trượt.",
        step3_discussion: "Báo cáo và giải trình (45 phút): Các nhóm thuyết minh về sự chuyển hóa Wđ - Wt; giải thích tại sao viên bi cần độ cao tối thiểu h >= 2.5*R để lượn qua vòng tròn đỉnh mà không rơi.",
        step4_conclusion: "Chuẩn hóa và kết luận (25 phút): Giáo viên chốt định luật bảo toàn cơ năng; điều kiện áp dụng (chỉ có lực thế sinh công); liên hệ tàu lượn siêu tốc và con lắc đồng hồ.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: BẢO TOÀN CƠ NĂNG & CON LẮC ĐỒNG HỒ",
        code: "PHT-VL10-B26",
        tasks: [
          {
            id: 1,
            instruction: "Tính toán cơ năng",
            prompt: "Con lắc có dây dài L = 1m, m = 0,5 kg kéo lệch góc 60° rồi buông nhẹ. Lấy g = 9,8 m/s2. Chọn mốc thế năng tại VTCB. Tính cơ năng toàn phần và vận tốc con lắc khi qua VTCB?",
            expectedAnswer: "h0 = L(1 - cos60°) = 1*(1 - 0.5) = 0.5 m. Cơ năng: W = m*g*h0 = 0.5 * 9.8 * 0.5 = 2.45 J. Tại VTCB: Wt = 0 => Wđ = W => 1/2*m*v_max^2 = 2.45 => v_max = sqrt(2*g*h0) = sqrt(2*9.8*0.5) = sqrt(9.8) ≈ 3.13 m/s.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay quên chọn mốc thế năng trước khi tính toán."],
        pedagogicalAdvice: ["Khai thác công tắc ẩn/hiện số liệu sư phạm trên mô phỏng để học sinh tự tính trước."],
        differentiationPrompts: {
          support: "Tại vị trí cao nhất vận tốc bằng mấy? Động năng bằng mấy?",
          advanced: "Thiết lập điều kiện độ cao ban đầu h để viên bi lăn trượt không ma sát qua được vòng xiếc bán kính R?",
        },
      },
    },
  },

  // ==========================================
  // CHƯƠNG V: ĐỘNG LƯỢNG (6 TIẾT)
  // ==========================================
  {
    id: "vl10-dinh-luat-bao-toan-dong-luong",
    grade: 10,
    chapterNumber: 5,
    chapterTitle: "Chương V: Động lượng",
    lessonNumber: 23,
    lessonTitle: "Bài 23: Động lượng. Định luật bảo toàn động lượng",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 77, 78",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL10.KNTT.B23",
    simulationId: "sim-momentum-10",
    stemActivity: "Chế tạo Tên lửa nước phản lực / Xe phản lực nước",
    experiments: [
      "Bộ dụng cụ thí nghiệm kiểm chứng định luật bảo toàn động lượng trên đệm khí",
      "Thí nghiệm va chạm giữa các quả cầu treo trên sợi dây",
    ],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl10-b23",
      activityTitle: "Kế hoạch dạy học Bài 23: Động lượng. Định luật bảo toàn động lượng (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Nêu được định nghĩa xung lượng của lực F.Δt; bản chất vectơ và đơn vị xung lượng của lực (N.s).",
          "Nêu được khái niệm hệ kín (hệ cô lập) và các trường hợp gần đúng hệ kín trong thực tế.",
          "Nắm vững định nghĩa, viết được công thức và suy ra đơn vị của động lượng p = m.v (kg.m/s hoặc N.s).",
          "Viết được biểu thức liên hệ giữa độ biến thiên động lượng của một vật và xung lượng của lực: Δp = F.Δt.",
          "Phát biểu nội dung và viết được biểu thức của định luật bảo toàn động lượng đối với hệ kín: p' = p.",
          "Vận dụng định luật bảo toàn động lượng cho bài toán va chạm mềm và chuyển động bằng phản lực.",
        ],
        physicsCompetencies: [
          "Nhận biết hệ vật, hệ kín, điều kiện áp dụng được định luật bảo toàn động lượng.",
          "Vận dụng công thức, định nghĩa, định luật để giải các bài toán tìm động lượng, xung lượng của lực, va chạm mềm và chuyển động bằng phản lực.",
          "Áp dụng định luật bảo toàn động lượng cho bài toán va chạm mềm và chuyển động bằng phản lực.",
        ],
        generalCompetencies: [
          "Rèn luyện năng lực tự học và nghiên cứu tài liệu; năng lực trình bày và trao đổi thông tin khi tìm hiểu trả lời các phiếu học tập từ 1 đến 5.",
          "Rèn luyện năng lực nêu và giải quyết vấn đề; hoạt động nhóm thông qua các hoạt động giải quyết yêu cầu do GV đề ra.",
        ],
        digitalCompetencies: [
          "Khai thác phần mềm mô phỏng va chạm số, đồng hồ hiện số và cảm biến cổng quang điện đo động lượng trước và sau va chạm.",
        ],
        qualities: [
          "Có ý thức tìm hiểu và liên hệ các hiện tượng thực tế liên quan (va chạm giao thông, tên lửa vũ trụ, súng giật).",
          "Có tác phong làm việc của nhà khoa học (chính xác, trung thực, cẩn thận).",
        ],
      },
      equipment: {
        teacherEquipment: [
          "Dụng cụ thí nghiệm kiểm chứng định luật bảo toàn động lượng.",
          "Thí nghiệm va chạm giữa các quả cầu treo trên sợi dây.",
          "Bảng ghi kết quả thí nghiệm.",
          "Bài giảng PowerPoint: có thí nghiệm ảo và các hình ảnh minh họa các hiện tượng liên quan đến động lượng, xung lượng và định luật bảo toàn động lượng.",
          "Hệ thống 5 Phiếu học tập từ PHT 1 đến PHT 5.",
        ],
        studentEquipment: [
          "Ôn lại kiến thức về gia tốc, các định luật Newton.",
          "Sách giáo khoa Vật lí 10, vở ghi và dụng cụ học tập.",
        ],
      },
      content: "Nghiên cứu xung lượng của lực và đại lượng động lượng. Khảo sát hệ cô lập và thiết lập định luật bảo toàn động lượng. Vận dụng giải thích và giải bài toán va chạm mềm và chuyển động bằng phản lực của tên lửa.",
      product: "Hệ thống câu trả lời hoàn thiện 5 Phiếu học tập, bản thiết lập công thức va chạm mềm và công thức phản lực tên lửa, kết quả bài tập vận dụng định lượng.",
      implementation: {
        step1_transfer: "Hoạt động 1: Mở đầu (10 phút): Giáo viên đặt vấn đề: 'Hiện nay khoa học ngày càng phát triển, con người không chỉ khám phá thế giới xung quanh mà còn khám phá cả vũ trụ bao la dựa vào những vệ tinh, phi thuyền, tàu vũ trụ. Việt Nam cũng đã có một vệ tinh Vinasat được bắn lên vào tháng 5 năm 2008. Vậy dựa vào những nguyên lí, định luật nào mà người ta có thể phóng các vệ tinh, phi thuyền, tàu vũ trụ ra khỏi Trái Đất?' Học sinh tiếp nhận vấn đề và chuyển sang hoạt động tìm hiểu.",
        step2_execution: "Hoạt động 2: Hình thành kiến thức (50 phút): Tổ chức 3 hoạt động chi tiết:\n• Hoạt động 2.1: Tìm hiểu khái niệm xung lượng của lực và động lượng (PHT 1).\n• Hoạt động 2.2: Tìm hiểu về hệ cô lập và định luật bảo toàn động lượng (PHT 2).\n• Hoạt động 2.3: Xây dựng công thức cho bài toán va chạm mềm và chuyển động bằng phản lực (PHT 3 & 4).",
        step3_discussion: "Hoạt động 3: Báo cáo kết quả và thảo luận (15 phút): Đại diện các nhóm báo cáo câu trả lời của 4 phiếu học tập đầu tiên. Học sinh các nhóm khác thảo luận, nhận xét, bổ sung và sửa lỗi về câu trả lời của nhóm đại diện. Giáo viên nhận xét, chính xác hóa các bài thuyết trình và tổng kết các hoạt động.",
        step4_conclusion: "Hoạt động 4: Chuẩn hóa, Luyện tập và Vận dụng (15 phút): Giáo viên chuyển giao Phiếu học tập số 5 để luyện tập định lượng: (1) Tính lực đẩy trung bình của hơi thuốc súng lên đầu đạn m = 10g: F = m.Δv / Δt = 8650 N; (2) Xe M = 38kg đang chạy v0 = 1 m/s, vật m = 2kg bay v01 = 7 m/s cắm vào xe: ngược chiều V = 0,6 m/s, cùng chiều V = 1,3 m/s, vuông góc V = 0,95 m/s; (3) Toa xe chuyển động phản lực. Hướng dẫn học sinh về nhà học bài và xem trước bài học tiếp theo.",
      },
      subActivities: [
        {
          id: "2.1",
          code: "HĐ 2.1",
          title: "Tìm hiểu khái niệm xung lượng của lực và động lượng",
          durationMinutes: 15,
          worksheetRef: "Phiếu học tập số 1",
          pedagogicalMethod: {
            name: "Phương pháp Dạy học trực quan & Đàm thoại gợi mở kết hợp Dạy học hợp tác nhóm",
            shortCode: "Trực quan + Đàm thoại + Nhóm",
            badge: "Visual & Heuristic Cooperative Learning",
            rationale: "Sử dụng hình ảnh và video va chạm thực tế (cầu thủ sút bóng, cơ thủ kích cơ bi-a, bóng tennis đập vợt) tạo biểu tượng cảm tính về tác dụng lực trong thời gian rất ngắn Δt; hệ thống câu hỏi đàm thoại gợi mở giúp học sinh tự chuyển hóa từ quan sát trực quan sang khái niệm xung lượng F.Δt và động lượng p = m.v; tổ chức nhóm giải quyết PHT 1 rèn luyện năng lực hợp tác và tự học.",
          },
          objectives: [
            "Định nghĩa được xung lượng của lực; nêu được tính chất vectơ và đơn vị xung lượng của lực (N.s).",
            "Nắm vững định nghĩa, viết được công thức và suy ra đơn vị đo của động lượng: p = m.v (kg.m/s).",
            "Viết được biểu thức liên hệ giữa độ biến thiên động lượng của một vật và xung lượng của lực: Δp = F.Δt (dạng khác của định luật II Newton).",
          ],
          content: "Học sinh thực hiện nhiệm vụ theo nhóm hoàn thành yêu cầu dựa trên gợi ý của GV (nghiên cứu SGK mục I và trả lời 5 câu hỏi của Phiếu học tập số 1).",
          product: "Câu trả lời hoàn chỉnh PHT 1: Định nghĩa xung lượng F.Δt (N.s); định nghĩa động lượng p = m.v (kg.m/s); chứng minh 1 N.s = 1 kg.m/s; hệ thức Δp = F.Δt và vận tốc v = 5 m/s của vật m = 0,1 kg chịu lực 50 N trong 0,01 s.",
          implementationSteps: [
            {
              step: "Bước 1",
              title: "Chuyển giao nhiệm vụ học tập",
              teacherAction: "GV trình chiếu những hình ảnh/video minh họa về xung của lực (cầu thủ đá quả bóng, cơ thủ đánh bóng bi-a, bóng đập vào vợt...) và yêu cầu HS làm việc nhóm hoàn thành Phiếu học tập số 1.",
              studentAction: "HS quan sát hình ảnh, tiếp nhận nhiệm vụ, thành lập nhóm và phân công nhiệm vụ hoàn thành Phiếu học tập số 1.",
            },
            {
              step: "Bước 2",
              title: "Thực hiện nhiệm vụ học tập",
              teacherAction: "GV quan sát, theo dõi quá trình làm việc của các nhóm, hỗ trợ giải đáp khi HS gặp vướng mắc về suy luận thứ nguyên N.s và biến đổi từ định luật II Newton.",
              studentAction: "HS nghiên cứu SGK mục I, thảo luận nhóm, giải quyết từng câu hỏi trong PHT 1: thiết lập xung lượng F.Δt, động lượng p = m.v, chứng minh đơn vị và giải bài toán định lượng Câu 5.",
            },
            {
              step: "Bước 3",
              title: "Báo cáo kết quả và thảo luận",
              teacherAction: "GV yêu cầu đại diện 1 nhóm trình bày kết quả trước lớp; tổ chức cho các nhóm khác nhận xét, đối chiếu và phản biện.",
              studentAction: "Đại diện 1 nhóm lên bảng trình bày chi tiết câu trả lời 5 câu hỏi của PHT 1; các nhóm khác chú ý lắng nghe, đối chiếu kết quả của nhóm mình, bổ sung và nêu câu hỏi phản biện.",
              details: "Câu 1: Lực có độ lớn đáng kể tác dụng trong thời gian ngắn làm biến đổi đáng kể trạng thái chuyển động của vật.\nCâu 2: Xung lượng của lực F trong khoảng thời gian Δt là tích F.Δt, đơn vị N.s, có tác dụng làm biến đổi trạng thái chuyển động.\nCâu 3: Động lượng p = m.v là đại lượng vectơ cùng hướng với v, đơn vị kg.m/s. Dạng diễn đạt khác của định luật II Newton: Δp = F.Δt.\nCâu 4: 1 N.s = 1 (kg.m/s²).s = 1 kg.m/s.\nCâu 5: p2 - p1 = F.Δt <=> m.v = F.Δt => v = (50 * 0,01) / 0,1 = 5 m/s.",
            },
            {
              step: "Bước 4",
              title: "Đánh giá kết quả, kết luận, chuẩn hóa",
              teacherAction: "GV nhận xét câu trả lời của nhóm đại diện và ý kiến của các nhóm khác. GV lưu ý thêm cho HS về ý nghĩa của biểu thức Δp = F.Δt: 'Lực tác dụng đủ mạnh trong một khoảng thời gian thì có thể gây ra biến thiên động lượng của vật'. GV chuẩn hóa kiến thức, tổng kết hoạt động 2.1.",
              studentAction: "HS lắng nghe nhận xét, ghi nhớ ý nghĩa bản chất vật lí của xung lượng và mối liên hệ với độ biến thiên động lượng, ghi nội dung chuẩn hóa vào vở.",
            },
          ],
        },
        {
          id: "2.2",
          code: "HĐ 2.2",
          title: "Tìm hiểu về hệ cô lập và định luật bảo toàn động lượng",
          durationMinutes: 15,
          worksheetRef: "Phiếu học tập số 2",
          pedagogicalMethod: {
            name: "Phương pháp Dạy học giải quyết vấn đề kết hợp Đàm thoại quy nạp và Dạy học hợp tác nhóm",
            shortCode: "GQVĐ + Đàm thoại quy nạp + Nhóm",
            badge: "Problem-Based & Inductive Learning",
            rationale: "Đặt học sinh trước câu hỏi mâu thuẫn nhận thức về tính kín tuyệt đối hay gần đúng của các hệ vật lí trong thực tế (hệ Trái Đất - vật, hệ hai xe trên mặt phẳng ngang, các vụ nổ và va chạm chớp nhoáng). Phương pháp quy nạp đàm thoại dẫn dắt học sinh tự phân tích triệt tiêu ngoại lực và áp đảo của nội lực để nhận ra phạm vi nghiệm đúng của Định luật bảo toàn động lượng.",
          },
          objectives: [
            "Nắm vững khái niệm hệ cô lập (hệ kín) và phân biệt được nội lực với ngoại lực.",
            "Phát biểu nội dung và viết được biểu thức của định luật bảo toàn động lượng đối với hệ hai vật hay nhiều vật: p' = p.",
            "Nhận thức được các điều kiện thực tế để một hệ được coi gần đúng là hệ kín (thời gian rất ngắn, nội lực rất lớn so với ngoại lực).",
          ],
          content: "Học sinh thực hiện nhiệm vụ theo nhóm hoàn thành yêu cầu dựa trên gợi ý của GV (nghiên cứu SGK mục II.1 và hoàn thành 4 câu hỏi trong Phiếu học tập số 2).",
          product: "Câu trả lời hoàn thiện PHT 2: Định nghĩa hệ cô lập; lập luận hệ Trái Đất - vật và hệ trượt không ma sát; biểu thức định luật bảo toàn động lượng p1 + p2 + ... = const hay p' = p; phân tích va chạm, vụ nổ là hệ kín gần đúng.",
          implementationSteps: [
            {
              step: "Bước 1",
              title: "Chuyển giao nhiệm vụ học tập",
              teacherAction: "GV yêu cầu HS làm việc nhóm, đọc SGK mục II.1 và hoàn thành Phiếu học tập số 2 (xem xét định nghĩa hệ cô lập và các tình huống thực tế của hệ).",
              studentAction: "HS mở SGK mục II.1, tiếp nhận Phiếu học tập số 2 và phân công thảo luận nhóm.",
            },
            {
              step: "Bước 2",
              title: "Thực hiện nhiệm vụ học tập",
              teacherAction: "GV hướng dẫn học sinh phân biệt nội lực (lực giữa các vật trong hệ) và ngoại lực (lực từ bên ngoài hệ); theo dõi và gợi ý phân tích điều kiện triệt tiêu của trọng lực P và phản lực N trên mặt ngang.",
              studentAction: "HS nghiên cứu SGK, thảo luận nhóm, giải thích tính chất hệ kín của hệ trên mặt phẳng ngang không ma sát (P + N = 0) và tính gần đúng của hệ vật - Trái Đất.",
            },
            {
              step: "Bước 3",
              title: "Báo cáo kết quả và thảo luận",
              teacherAction: "GV chỉ định đại diện 1 nhóm trình bày kết quả PHT 2; điều hành cả lớp thảo luận, chất vấn và phản biện.",
              studentAction: "Đại diện 1 nhóm báo cáo:\n- Câu 1: Một hệ nhiều vật được gọi là cô lập khi không có ngoại lực tác dụng lên hệ hoặc nếu có thì các ngoại lực ấy cân bằng nhau.\n- Câu 2: Hệ vật và Trái Đất không phải là hệ kín tuyệt đối vì vẫn có lực hấp dẫn từ các thiên thể xa xôi, nhưng do rất nhỏ nên coi gần đúng là hệ kín.\n- Câu 3: Hệ hai vật chuyển động không ma sát trên mặt phẳng nhẵn nằm ngang là hệ kín vì ngoại lực gồm trọng lực P và phản lực N triệt tiêu lẫn nhau: P + N = 0.\nCác nhóm khác đối chiếu bài làm, đóng góp ý kiến nhận xét.",
            },
            {
              step: "Bước 4",
              title: "Đánh giá, kết luận, nhận định (GV lưu ý mở rộng)",
              teacherAction: "GV lưu ý sâu sắc cho HS: (1) Trong thực tế trên Trái Đất khó có thể thực hiện được một hệ tuyệt đối kín vì không thể triệt tiêu triệt để lực ma sát, lực cản và lực hấp dẫn. Nhưng nếu các lực đó rất nhỏ thì coi gần đúng là hệ kín; (2) Trong các vụ nổ, va chạm: các nội lực xuất hiện thường rất lớn so với ngoại lực thông thường nên hệ vật có thể coi gần đúng là hệ kín trong thời gian ngắn xảy ra hiện tượng. GV chính thức thông báo và phát biểu định luật: 'Động lượng của một hệ cô lập là không đổi: p1 + p2 + ... + pn = không đổi hay p' = p'.",
              studentAction: "HS lắng nghe phần lưu ý mở rộng thực tế của GV, nắm chắc điều kiện gần đúng của hệ kín.",
            },
            {
              step: "Bước 5",
              title: "Học sinh tiếp thu ghi nhớ",
              teacherAction: "GV hướng dẫn HS ghi nhớ phát biểu và biểu thức định luật bảo toàn động lượng.",
              studentAction: "HS ghi nhớ hệ thức vectơ p' = p và các điều kiện nghiệm đúng.",
            },
            {
              step: "Bước 6",
              title: "Tổng kết hoạt động 2.2",
              teacherAction: "GV tổng kết hoạt động 2.2, đánh giá kết quả thực hiện nhiệm vụ học tập của HS (chỉ rõ ưu điểm và nhược điểm cần khắc phục).",
              studentAction: "HS tự đánh giá và hoàn thiện vở ghi bài.",
            },
          ],
        },
        {
          id: "2.3",
          code: "HĐ 2.3",
          title: "Xây dựng công thức cho bài toán va chạm mềm và chuyển động bằng phản lực",
          durationMinutes: 20,
          worksheetRef: "Phiếu học tập số 3 & Phiếu học tập số 4",
          pedagogicalMethod: {
            name: "Phương pháp Dạy học theo nhóm chuyên gia - mảnh ghép kết hợp Suy luận lí thuyết & Mô hình hóa toán học",
            shortCode: "Nhóm chuyên gia/mảnh ghép + Mô hình hóa toán",
            badge: "Jigsaw & Mathematical Modeling",
            rationale: "Kĩ thuật chia nhóm chuyên gia (Nhóm 1, 2 nghiên cứu Va chạm mềm qua PHT 3; Nhóm 3, 4 nghiên cứu Phản lực tên lửa qua PHT 4) giúp phát huy trách nhiệm cá nhân và năng lực thuyết trình chéo; việc vận dụng định luật bảo toàn động lượng vectơ vào hai hiện tượng cụ thể giúp rèn luyện năng lực mô hình hóa toán học trong Vật lí.",
          },
          objectives: [
            "Nhận biết được hệ vật, hệ kín và điều kiện áp dụng định luật bảo toàn động lượng trong va chạm và phóng tên lửa.",
            "Biết vận dụng định luật bảo toàn động lượng để thiết lập công thức chính xác cho bài toán va chạm mềm: v = (m1.v1) / (m1 + m2).",
            "Biết vận dụng định luật để thiết lập công thức chuyển động bằng phản lực: V = - (m / M).v; giải thích được ý nghĩa dấu (-) và hiện tượng súng giật lùi khi bắn.",
          ],
          content: "Học sinh chia 4 nhóm chuyên sâu hoàn thành nhiệm vụ theo gợi ý của GV: Nhóm 1, 2 hoàn thành Phiếu học tập số 3; Nhóm 3, 4 hoàn thành Phiếu học tập số 4. Sau đó đại diện mỗi nhóm thuyết trình cho các nhóm còn lại.",
          product: "Bản thiết lập công thức va chạm mềm và chuyển động bằng phản lực hoàn chỉnh; lời giải thích khoa học về dấu (-) và cơ chế súng giật lùi khi bắn.",
          implementationSteps: [
            {
              step: "Bước 1",
              title: "Chuyển giao nhiệm vụ học tập",
              teacherAction: "GV đặt vấn đề: Cho HS quan sát video thí nghiệm con lắc thử đạn (viên đạn bắn găm vào bao cát) và video phóng tên lửa vũ trụ... Đặt câu hỏi: 'Các thiết bị trên hoạt động dựa trên nguyên tắc nào? Ta sẽ giải thích được điều đó qua bài học hôm nay'. GV chia lớp thành 4 nhóm: Nhóm 1 & 2 hoàn thành Phiếu học tập số 3; Nhóm 3 & 4 hoàn thành Phiếu học tập số 4. Sau đó cho đại diện mỗi nhóm lên thuyết trình cho các nhóm còn lại.",
              studentAction: "HS quan sát video, nhận nhiệm vụ theo nhóm chuyên gia (Nhóm 1, 2 nhận PHT 3; Nhóm 3, 4 nhận PHT 4) và bắt đầu làm việc nhóm.",
            },
            {
              step: "Bước 2",
              title: "Thực hiện nhiệm vụ học tập",
              teacherAction: "GV đi tới từng nhóm quan sát quá trình thảo luận, kiểm tra cách HS thiết lập vectơ động lượng trước và sau tương tác; nhắc nhở học sinh lưu ý động lượng ban đầu của tên lửa bằng 0 và ý nghĩa đại số của phép cộng vectơ.",
              studentAction: "Các nhóm làm việc tích cực:\n- Nhóm 1 & 2 (PHT 3): Xác định động lượng trước va chạm p = m1.v1; sau va chạm hai vật dính làm một nên p' = (m1 + m2)v; áp dụng bảo toàn động lượng rút ra v = (m1.v1) / (m1 + m2).\n- Nhóm 3 & 4 (PHT 4): Xác định trước khi phụt khí hệ đứng yên p = 0; sau khi phụt khí p' = m.v + M.V; áp dụng bảo toàn động lượng: m.v + M.V = 0 => V = - (m / M).v. Thảo luận ý nghĩa dấu (-) và giải thích súng giật lùi.",
            },
            {
              step: "Bước 3",
              title: "Báo cáo kết quả và thảo luận (Thuyết trình chéo)",
              teacherAction: "GV gọi đại diện nhóm 1 (hoặc 2) lên thuyết trình PHT 3 và đại diện nhóm 3 (hoặc 4) lên thuyết trình PHT 4; điều khiển học sinh các nhóm chéo đặt câu hỏi chất vấn và thảo luận sôi nổi.",
              studentAction: "Đại diện các nhóm báo cáo:\n* Đại diện PHT 3 trình bày bài toán Va chạm mềm:\n  a. Động lượng hệ trước va chạm: p = m1.v1.\n  b. Động lượng hệ sau va chạm: p' = (m1 + m2).v.\n  c. Vì bỏ qua ma sát nên hệ là cô lập. Áp dụng ĐL bảo toàn động lượng: p = p' <=> m1.v1 = (m1 + m2).v => v = (m1.v1) / (m1 + m2). Va chạm của hai vật như vậy gọi là va chạm mềm.\n* Đại diện PHT 4 trình bày bài toán Chuyển động bằng phản lực:\n  a. Động lượng hệ lúc đầu: p = 0.\n  b. Động lượng hệ sau khi phụt khí: p' = m.v + M.V.\n  c. Trong quá trình phụt khí, nội lực rất lớn so với ngoại lực nên hệ là cô lập. Áp dụng ĐL bảo toàn động lượng: p' = p <=> m.v + M.V = 0 => V = - (m / M).v.\n  d. Dấu (-) cho biết vận tốc V của tên lửa ngược chiều với vận tốc v của dòng khí phụt ra phía sau. Hệ súng - đạn hoạt động tương tự: khi đạn bay về phía trước thì súng bị giật lùi về phía sau.\nCác nhóm khác thảo luận, nhận xét, bổ sung và hoàn thiện câu trả lời.",
            },
            {
              step: "Bước 4",
              title: "Đánh giá kết quả, kết luận, chuẩn hóa",
              teacherAction: "GV nhận xét và chính xác hóa các bài thuyết trình của cả 4 nhóm; đánh giá tinh thần hợp tác và chất lượng sản phẩm học tập; chốt lại 2 công thức trọng tâm của bài toán va chạm mềm và chuyển động phản lực; tổng kết toàn bộ hoạt động 2.3.",
              studentAction: "HS lắng nghe đánh giá của GV, hoàn thiện hai công thức chuẩn hóa vào vở ghi bài và bảng tổng kết kiến thức.",
            },
          ],
        },
      ],
      studentWorksheet: {
        title: "HỆ THỐNG PHIẾU HỌC TẬP: ĐỘNG LƯỢNG & ĐỊNH LUẬT BẢO TOÀN ĐỘNG LƯỢNG",
        code: "PHT-VL10-B23",
        tasks: [
          {
            id: 1,
            instruction: "Phiếu học tập số 1: Xung lượng của lực và Động lượng",
            prompt: "1. Quan sát ví dụ về cầu thủ đá banh, cơ thủ dùng cơ kích quả bi-a chuyển động va chạm vào quả bi-a khác. Nhận xét về kết quả tác dụng lực trong thời gian ngắn?\n2. Nêu định nghĩa và đơn vị xung lượng của lực F trong khoảng thời gian Δt?\n3. Nêu định nghĩa và đơn vị của động lượng p = m.v? Nêu dạng diễn đạt khác của định luật II Newton?\n4. Chứng minh đơn vị động lượng kg.m/s tương đương với Niu-tơn giây (N.s)?\n5. Một lực 50 N tác dụng vào một vật khối lượng m = 0,1 kg ban đầu nằm yên trong thời gian 0,01 s. Xác định vận tốc của vật?",
            expectedAnswer: "1. Lực có độ lớn đáng kể tác dụng trong thời gian ngắn có thể gây biến đổi đáng kể trạng thái chuyển động của vật.\n2. Tích F.Δt là xung lượng của lực F trong thời gian Δt, làm biến đổi trạng thái chuyển động của vật, đơn vị N.s.\n3. Động lượng là đại lượng vectơ: p = m.v, đơn vị kg.m/s. Dạng khác định luật II: Δp = F.Δt (Độ biến thiên động lượng bằng xung lượng của lực).\n4. Ta có: 1 N.s = 1 (kg.m/s²).s = 1 kg.m/s (đpcm).\n5. Ta có: p2 - p1 = F.Δt <=> m.v - 0 = F.Δt => v = (F.Δt) / m = (50 * 0,01) / 0,1 = 5 m/s.",
          },
          {
            id: 2,
            instruction: "Phiếu học tập số 2: Tìm hiểu về Hệ cô lập (Hệ kín)",
            prompt: "1. Nêu định nghĩa hệ cô lập (hệ kín)?\n2. Hệ vật và Trái Đất có phải là hệ kín không? Vì sao?\n3. Hệ hai vật chuyển động không ma sát trên mặt phẳng nhẵn nằm ngang có phải là hệ kín không? Vì sao?\n4. Trong thực tế, các vụ nổ và va chạm vì sao có thể coi gần đúng là hệ kín?",
            expectedAnswer: "1. Một hệ nhiều vật được gọi là cô lập khi không có ngoại lực tác dụng lên hệ hoặc nếu có thì các ngoại lực ấy cân bằng nhau.\n2. Hệ vật và Trái Đất không phải là hệ kín tuyệt đối vì vẫn có lực hấp dẫn từ các thiên thể khác trong vũ trụ tác dụng lên hệ, nhưng do rất nhỏ nên có thể coi gần đúng là hệ kín.\n3. Hệ hai vật chuyển động không ma sát trên mặt phẳng nhẵn nằm ngang là hệ kín vì ngoại lực gồm trọng lực P và phản lực N của mặt phẳng ngang triệt tiêu lẫn nhau: P + N = 0.\n4. Trong các vụ nổ, va chạm: các nội lực xuất hiện thường rất lớn so với ngoại lực thông thường trong thời gian xảy ra rất ngắn nên hệ được coi gần đúng là hệ kín.",
          },
          {
            id: 3,
            instruction: "Phiếu học tập số 3: Xây dựng công thức bài toán Va chạm mềm",
            prompt: "Xét vật m1 chuyển động với vận tốc v1 trên mặt phẳng ngang nhẵn, đến va chạm vào vật m2 đang nằm yên. Sau va chạm hai vật nhập làm một và cùng chuyển động với vận tốc v:\na. Viết biểu thức động lượng p của hệ trước va chạm?\nb. Viết biểu thức động lượng p' của hệ sau va chạm?\nc. Vì sao hệ được coi là cô lập? Áp dụng định luật bảo toàn động lượng, suy ra biểu thức tính vận tốc v của cả hệ?",
            expectedAnswer: "a. Động lượng của hệ trước va chạm: p = m1.v1 + m2.0 = m1.v1.\nb. Động lượng của hệ sau va chạm: p' = (m1 + m2).v.\nc. Vì bỏ qua ma sát nên tổng ngoại lực tác dụng lên hệ bằng 0 (P + N = 0), hệ là hệ cô lập.\nÁp dụng định luật bảo toàn động lượng: p = p' <=> m1.v1 = (m1 + m2).v => v = (m1.v1) / (m1 + m2). Va chạm của hai vật như vậy gọi là va chạm mềm.",
          },
          {
            id: 4,
            instruction: "Phiếu học tập số 4: Xây dựng công thức Chuyển động bằng phản lực",
            prompt: "Xét một tên lửa có khối lượng M chứa lượng khí m bên trong, ban đầu đứng yên:\na. Xác định động lượng p của cả hệ trước khi phụt khí?\nb. Sau khi lượng khí m phụt ra phía sau với vận tốc v thì tên lửa M chuyển động với vận tốc V. Viết biểu thức động lượng p' của hệ lúc này?\nc. Áp dụng định luật bảo toàn động lượng tìm biểu thức vận tốc V của tên lửa?\nd. Dấu (-) trong biểu thức tính V cho biết điều gì? Hãy giải thích hiện tượng súng giật lùi khi bắn?",
            expectedAnswer: "a. Ban đầu hệ đứng yên nên động lượng trước khi phụt khí: p = 0.\nb. Động lượng của hệ sau khi phụt khí: p' = m.v + M.V.\nc. Trong quá trình phụt khí, nội lực rất lớn so với ngoại lực nên hệ là cô lập. Áp dụng ĐL bảo toàn động lượng: p' = p <=> m.v + M.V = 0 => V = - (m / M).v.\nd. Dấu (-) trong biểu thức cho biết vận tốc V của tên lửa ngược chiều với vận tốc v của khí phụt ra. Hệ súng - đạn hoạt động dựa trên nguyên tắc phản lực tương tự: khi đạn bay về phía trước thì súng bị giật lùi về phía sau.",
          },
          {
            id: 5,
            instruction: "Phiếu học tập số 5: Bài tập luyện tập và vận dụng định lượng",
            prompt: "Câu 1: Đầu đạn m = 10 g chuyển động trong nòng súng nằm ngang trong thời gian 10^-3 s với v0 = 0. Vận tốc đạn khi đến đầu nòng súng v = 865 m/s. Tính lực đẩy trung bình của hơi thuốc súng lên đầu đạn?\nCâu 2: Xe M = 38 kg đang chạy ngang không ma sát với v0 = 1 m/s. Vật m = 2 kg bay ngang với v01 = 7 m/s cắm vào xe và nằm yên trong xe. Xác định vận tốc mới V của xe trong 3 trường hợp: a) Vật bay ngược chiều xe; b) Vật bay cùng chiều xe; c) Vật bay vuông góc xe?\nCâu 3: Vật m0 đặt trên toa xe m chuyển động trên đường ray không ma sát, ban đầu đứng yên. Sau đó m0 chuyển động ngang trên toa xe với vận tốc v0. Xác định vận tốc chuyển động của toa xe khi: a) v0 là vận tốc của m0 đối với mặt đất; b) v0 là vận tốc của m0 đối với toa xe?",
            expectedAnswer: "Câu 1: Áp dụng liên hệ xung lượng: F = m.Δv / Δt = (0,01 * 865) / 10^-3 = 8650 N.\nCâu 2: Chọn chiều dương là chiều v0. Phương trình bảo toàn động lượng: M.v0 + m.v01 = (M + m).V => V = (M.v0 + m.v01) / (M + m).\na) Ngược chiều: v01 = -7 m/s => V = (38*1 - 2*7) / (38 + 2) = 24 / 40 = 0,6 m/s.\nb) Cùng chiều: v01 = +7 m/s => V = (38*1 + 2*7) / (38 + 2) = 52 / 40 = 1,3 m/s.\nc) Vuông góc: v01 chiếu lên chiều chuyển động xe bằng 0 => V = (M.v0) / (M + m) = 38 / 40 = 0,95 m/s.\nCâu 3: Ban đầu hệ đứng yên p = 0.\na) v0 đối với mặt đất: m0.v0 + m.v = 0 => v = - (m0.v0) / m.\nb) v0 đối với toa xe: m0.(v0 + v) + m.v = 0 => v = - (m0.v0) / (m0 + m).",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh hay quên tính chất vectơ của động lượng và định luật bảo toàn động lượng (cộng đại số đơn thuần thay vì chiếu lên trục).",
          "Học sinh hay nhầm tưởng trong va chạm mềm cơ năng cũng bảo toàn (thực tế cơ năng giảm do biến dạng và tỏa nhiệt).",
        ],
        pedagogicalAdvice: [
          "Sử dụng mô phỏng ảo va chạm số và thí nghiệm đệm khí để học sinh đối chiếu số liệu trước và sau va chạm.",
          "Nhấn mạnh ý nghĩa của dấu (-) trong bài toán chuyển động bằng phản lực và giải thích hiện tượng súng giật.",
        ],
        differentiationPrompts: {
          support: "Đơn vị của động lượng trong hệ SI là gì? Nêu mối liên hệ giữa động lượng và xung lượng của lực?",
          advanced: "Thiết lập biểu thức tính vận tốc của tên lửa nhiều tầng theo công thức Tsiolkovsky và phân tích tại sao tên lửa cần nhiều tầng?",
        },
      },
    },
  },

  // ==========================================
  // CHƯƠNG VII: BIẾN DẠNG VẬT RẮN & ÁP SUẤT CHẤT LỎNG (4 TIẾT)
  // ==========================================
  {
    id: "vl10-khoi-luong-rieng-ap-suat-chat-long",
    grade: 10,
    chapterNumber: 7,
    chapterTitle: "Chương VII: Biến dạng của vật rắn. Áp suất chất lỏng",
    lessonNumber: 34,
    lessonTitle: "Bài 34: Khối lượng riêng. Áp suất chất lỏng",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 87, 88",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL10.KNTT.B34",
    stemActivity: "Chế tạo tàu ngầm mini lặn nổi",
    digitalCompetencies: ["1.3.NC1a", "5.2.NC1b"],
    experiments: ["Bình hình trụ đáy màng cao su đo áp suất chất lỏng ở các độ sâu"],
    assessmentRubricId: "rubric-stem-product",
    defaultActivity: {
      id: "act-vl10-b34",
      activityTitle: "Hoạt động: Khảo sát áp suất thủy tĩnh Δp = ρ.g.Δh & Dự án Tàu ngầm mini lặn nổi (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Nêu định nghĩa khối lượng riêng rho = m / V (kg/m3) và áp suất p = F / S (N/m2 hay Pa).",
          "Thiết lập và vận dụng công thức áp suất chất lỏng ở độ sâu h: p = p0 + rho.g.h.",
          "Giải thích nguyên tắc lặn nổi của tàu ngầm dựa trên cân bằng giữa trọng lực P và lực đẩy Ác-si-mét.",
        ],
        physicsCompetencies: [
          "Thí nghiệm đo áp suất chất lỏng tác dụng theo mọi phương lên màng cao su.",
          "Chế tạo mô hình thợ lặn Descartes / tàu ngầm mini từ chai nhựa và ống nghiệm/bút bi.",
        ],
        generalCompetencies: ["Năng lực sáng tạo kĩ thuật, làm việc nhóm."],
        qualities: ["Yêu thích sáng chế, cẩn thận chống rò rỉ nước."],
      },
      content: "Nghiên cứu áp suất thủy tĩnh trong lòng chất lỏng. Chứng minh công thức Delta p = rho.g.Delta h. Khảo sát nguyên tắc hoạt động của tàu ngầm quân sự và chế tạo tàu ngầm mini điều khiển bằng áp suất.",
      product: "Mô hình tàu ngầm mini lặn nổi linh hoạt khi bóp nhả vỏ chai nhựa.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Tại sao đập thủy điện luôn có phần đáy dày hơn phần trên miệng đập? Tại sao thợ lặn xuống sâu phải mặc bộ đồ chịu áp lực đặc biệt?",
        step2_execution: "Khảo sát và thi công (45 phút): Nhúng màng cao su vào nước ở các độ sâu khác nhau; chứng minh p tăng tỉ lệ với h; chế tạo tàu ngầm thợ lặn Descartes từ vỏ chai nhựa chứa nước và ruột bút bi gắn chì; bóp thân chai để tàu chìm, thả tay để tàu nổi.",
        step3_discussion: "Báo cáo và giải thích (20 phút): Đại diện nhóm giải thích cơ chế: bóp chai -> nước tràn vào ruột bút nén không khí lại -> khối lượng riêng trung bình tăng vượt nước -> tàu chìm.",
        step4_conclusion: "Chuẩn hóa (15 phút): Giáo viên chốt công thức áp suất chất lỏng; mở rộng nguyên tắc bình thông nhau và máy nâng thủy lực.",
      },
      studentWorksheet: {
        title: "PHIẾU DỰ ÁN STEM: TÀU NGẦM MINI LẶN NỔI",
        code: "PHT-STEM-VL10-B34",
        tasks: [
          {
            id: 1,
            instruction: "Tính áp suất ở đáy biển",
            prompt: "Một chiếc tàu ngầm đang lặn ở độ sâu h = 100 m dưới biển. Biết khối lượng riêng của nước biển là 1030 kg/m3, áp suất khí quyển p0 = 1,01.10^5 Pa, g = 9,8 m/s2. Tính áp suất tác dụng lên vỏ tàu ngầm?",
            expectedAnswer: "p = p0 + rho * g * h = 1,01.10^5 + 1030 * 9,8 * 100 = 101000 + 1009400 = 1.110.400 Pa ≈ 1,11.10^6 Pa (gấp khoảng 11 lần áp suất khí quyển).",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: ["Học sinh hay nghĩ áp suất chất lỏng chỉ tác dụng xuống đáy bình (thực tế tác dụng đều theo mọi phương)."],
        pedagogicalAdvice: ["Cho học sinh biểu diễn trò chơi thợ lặn Descartes thi lặn nổi."],
        differentiationPrompts: {
          support: "Lực đẩy Ác-si-mét phụ thuộc vào những yếu tố nào?",
          advanced: "Làm thế nào để tàu ngầm duy trì trạng thái lơ lửng cân bằng ở một độ sâu xác định?",
        },
      },
    },
  },
];

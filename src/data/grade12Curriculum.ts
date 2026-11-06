import { LessonTopic } from "../types/physics";

export const GRADE_12_LESSONS: LessonTopic[] = [
  // ==========================================
  // CHƯƠNG I: VẬT LÍ NHIỆT (14 TIẾT)
  // ==========================================
  {
    id: "vl12-cau-truc-chat-su-chuyen-the",
    grade: 12,
    chapterNumber: 1,
    chapterTitle: "Chương I: Vật lí nhiệt",
    lessonNumber: 1,
    lessonTitle: "Bài 1: Cấu trúc của chất. Sự chuyển thể",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 1, 2",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL12.KNTT.B1",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1a"],
    experiments: ["Mô hình chuyển động phân tử ở ba thể rắn, lỏng, khí"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl12-b1",
      activityTitle: "Hoạt động: Khám phá mô hình động học phân tử và giải thích sự chuyển thể của các chất (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Sử dụng mô hình động học phân tử, nêu được sơ lược cấu trúc của chất rắn, chất lỏng, chất khí.",
          "Giải thích được sơ lược một số hiện tượng vật lí liên quan đến sự chuyển thể: sự nóng chảy, sự hoá hơi.",
        ],
        physicsCompetencies: [
          "Mô tả được các đặc điểm vi mô (khoảng cách, tương tác, trật tự) của các phân tử ở ba thể.",
          "Vận dụng mô hình phân tử giải thích cơ chế hấp thụ nhiệt lượng để phá vỡ liên kết trong quá trình nóng chảy và sôi.",
        ],
        generalCompetencies: [
          "Năng lực tự chủ và tự học: Tự đọc tài liệu và quan sát video mô phỏng vi mô chuyển động nhiệt.",
          "Giao tiếp và hợp tác: Thảo luận nhóm hoàn thành sơ đồ tư duy so sánh ba thể của vật chất.",
        ],
        digitalCompetencies: [
          "5.3.NC1b: Khai thác mô phỏng 3D tương tác để quan sát động năng nhiệt phân tử khi tăng giảm nhiệt độ.",
          "3.1.NC1a: Tìm kiếm và xử lí thông tin video tư liệu về công nghệ đúc kim loại và chu trình nước.",
        ],
        qualities: ["Chăm chỉ, trung thực, có thái độ tìm tòi khoa học."],
      },
      content: "Nghiên cứu cấu trúc vi mô của chất rắn (tinh thể và vô định hình), chất lỏng và chất khí theo mô hình động học phân tử. Phân tích nguyên nhân chuyển động Brown và giải thích sự truyền nhiệt, chuyển thể.",
      product: "Bảng so sánh ba thể của vật chất về cấu trúc phân tử và sơ đồ giải thích sự nóng chảy, hóa hơi trên phiếu học tập nhóm.",
      implementation: {
        step1_transfer: "Giáo viên đặt tình huống (10 phút): Tại sao khi đun nước đá đang tan thì nhiệt độ vẫn duy trì ở 0°C dù bếp liên tục cung cấp nhiệt lượng? Nhiệt lượng đó đã biến đi đâu? Giáo viên giao phiếu học tập số 1.",
        step2_execution: "Học sinh thực hiện nhiệm vụ (45 phút): Nhóm 4 học sinh quan sát mô hình chuyển động phân tử trên phần mềm số; so sánh khoảng cách và lực tương tác giữa các phân tử ở thể rắn, lỏng, khí; thảo luận giải thích hiện tượng nước đá tan chảy và sôi.",
        step3_discussion: "Báo cáo và thảo luận (20 phút): Giáo viên gọi 2 nhóm trình bày sơ đồ phân tử. Các nhóm khác chất vấn về sự khác biệt giữa bay hơi trên mặt thoáng và sôi trong lòng chất lỏng.",
        step4_conclusion: "Kết luận và chuẩn hóa (15 phút): Giáo viên tổng kết các giả thuyết của mô hình động học phân tử: các chất cấu tạo từ phân tử chuyển động hỗn loạn không ngừng; nhiệt độ càng cao phân tử chuyển động càng nhanh; ở thể rắn liên kết bền vững, thể lỏng linh động hơn, thể khí tương tác rất yếu.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP SỐ 1: CẤU TRÚC PHÂN TỬ & SỰ CHUYỂN THỂ",
        code: "PHT-VL12-B1",
        tasks: [
          {
            id: 1,
            instruction: "Hoàn thành bảng so sánh cấu tạo vi mô của 3 thể",
            prompt: "Điền đặc điểm khoảng cách phân tử, lực tương tác phân tử và chuyển động nhiệt vào 3 cột Rắn - Lỏng - Khí.",
            expectedAnswer: "Rắn: khoảng cách rất gần, tương tác rất mạnh, dao động quanh VTCB cố định. Lỏng: khoảng cách gần, tương tác vừa, dao động quanh VTCB dịch chuyển. Khí: khoảng cách rất xa, tương tác rất yếu (trừ khi va chạm), chuyển động hỗn loạn hỗn độn.",
          },
          {
            id: 2,
            instruction: "Giải thích cơ chế vật lí",
            prompt: "Tại sao trong suốt quá trình nóng chảy của chất rắn kết tinh, nhiệt độ không đổi dù vẫn cung cấp nhiệt lượng?",
            expectedAnswer: "Toàn bộ nhiệt lượng cung cấp được sử dụng để làm suy yếu và phá vỡ mạng tinh thể liên kết giữa các phân tử, làm tăng thế năng tương tác phân tử chứ không làm tăng động năng nhiệt của các phân tử => nhiệt độ không đổi.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh hay nghĩ phân tử ở thể rắn thì đứng yên tuyệt đối. Cần nhấn mạnh: phân tử rắn luôn dao động nhiệt quanh VTCB.",
          "Học sinh nhầm lẫn sự bay hơi với sự sôi: bay hơi xảy ra ở mọi nhiệt độ và chỉ trên mặt thoáng, còn sôi xảy ra ở nhiệt độ sôi xác định và ở cả mặt thoáng lẫn trong lòng chất lỏng.",
        ],
        pedagogicalAdvice: [
          "Dùng kĩ thuật CATs 'Bài tập 1 phút' cuối tiết 2 để kiểm tra xem học sinh có phân biệt được vai trò của động năng và thế năng phân tử trong chuyển thể.",
          "Khai thác mô phỏng phân tử PhET States of Matter để học sinh trực tiếp tăng giảm nhiệt độ trên màn hình.",
        ],
        differentiationPrompts: {
          support: "Hãy quan sát hạt phấn hoa trong thí nghiệm Brown: nó tự chuyển động hay bị các phân tử nước xô đẩy?",
          advanced: "Chất rắn vô định hình (thủy tinh, nhựa đường) khi đun nóng có nhiệt độ nóng chảy xác định hay không? Vì sao?",
        },
      },
    },
  },
  {
    id: "vl12-noi-nang-dinh-luat-1-ndlh",
    grade: 12,
    chapterNumber: 1,
    chapterTitle: "Chương I: Vật lí nhiệt",
    lessonNumber: 2,
    lessonTitle: "Bài 2: Nội năng. Định luật I của nhiệt động lực học",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 3, 4",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL12.KNTT.B2",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1b"],
    experiments: ["Thí nghiệm cọ xát miếng kim loại làm tăng nhiệt độ, Thí nghiệm nén khí trong xilanh sinh công"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl12-b2",
      activityTitle: "Hoạt động: Nghiệm định luật I Nhiệt động lực học ΔU = A + Q và quy ước dấu (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Nêu được mối liên hệ nội năng của vật với năng lượng của các phân tử tạo nên vật (U = Eđ + Et).",
          "Phát biểu và vận dụng được Định luật I nhiệt động lực học: ΔU = A + Q trong các trường hợp đơn giản.",
        ],
        physicsCompetencies: [
          "Phân biệt được hai cách làm biến đổi nội năng: thực hiện công và truyền nhiệt.",
          "Xác định đúng quy ước dấu của các đại lượng A, Q, ΔU trong biểu thức ΔU = A + Q.",
        ],
        generalCompetencies: [
          "Giải quyết vấn đề và sáng tạo: Thiết kế sơ đồ nguyên lí động cơ nhiệt 4 kì và máy lạnh.",
        ],
        digitalCompetencies: [
          "5.3.NC1b: Phân tích đồ thị p-V biểu diễn công của khối khí trong quá trình dãn nở đẳng áp A = p.ΔV.",
        ],
        qualities: ["Trách nhiệm trong sử dụng năng lượng, ý thức bảo vệ môi trường chống nhiệt thải."],
      },
      content: "Xây dựng khái niệm nội năng U là tổng động năng chuyển động nhiệt và thế năng tương tác của các phân tử. Nghiên cứu hai phương thức làm biến đổi nội năng và biểu thức định luật I NĐLH ΔU = A + Q kèm quy ước dấu.",
      product: "Bảng phân tích quy ước dấu và bài giải các bài toán vận dụng định luật I nhiệt động lực học cho xi-lanh pit-tông.",
      implementation: {
        step1_transfer: "Giáo viên nêu vấn đề (10 phút): Khi dùng bơm tay bơm căng lốp xe đạp, tại sao thân ống bơm lại nóng ran lên? Có những cách nào làm tăng nhiệt độ của một thanh sắt mà không cần dùng lửa?",
        step2_execution: "Học sinh thực hiện nhiệm vụ (45 phút): Đọc SGK, phân biệt công A và nhiệt lượng Q; thiết lập hệ thức ΔU = A + Q; xây dựng bảng quy ước dấu (hệ nhận công A > 0, hệ sinh công A < 0, hệ nhận nhiệt Q > 0, hệ tỏa nhiệt Q < 0); giải bài tập tình huống pit-tông.",
        step3_discussion: "Báo cáo thảo luận (20 phút): Giáo viên cho 2 học sinh lên bảng giải bài toán pit-tông nén khí, cả lớp phản biện về việc xác định dấu âm dương của A và Q.",
        step4_conclusion: "Kết luận và chuẩn hóa (15 phút): Giáo viên chốt lại định luật I là sự mở rộng của định luật bảo toàn và chuyển hóa năng lượng cho các hiện tượng nhiệt; nhấn mạnh quy tắc ghi nhớ dấu.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP SỐ 2: ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
        code: "PHT-VL12-B2",
        tasks: [
          {
            id: 1,
            instruction: "Phân biệt hai cách làm thay đổi nội năng",
            prompt: "Cho 2 ví dụ trong đời sống làm tăng nội năng bằng thực hiện công và 2 ví dụ bằng truyền nhiệt?",
            expectedAnswer: "Thực hiện công: Cọ xát hai bàn tay vào mùa đông; nén khí trong ống bơm. Truyền nhiệt: Thả thìa kim loại vào cốc nước nóng; phơi thanh sắt ngoài trời nắng.",
          },
          {
            id: 2,
            instruction: "Vận dụng công thức ΔU = A + Q",
            prompt: "Một khối khí trong xi lanh nhận nhiệt lượng 250 J và dãn nở thực hiện công 150 J đẩy pit-tông đi lên. Tính độ biến thiên nội năng của khối khí?",
            expectedAnswer: "Khí nhận nhiệt => Q = +250 J. Khí sinh công đẩy pit-tông => A = -150 J. Áp dụng ĐL I NĐLH: ΔU = A + Q = -150 + 250 = +100 J. Nội năng khối khí tăng 100 J.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh rất hay nhầm lẫn dấu của công A: khi chất khí 'sinh công đẩy pit-tông' thì chất khí thực hiện công (mất năng lượng) nên trong biểu thức định luật I, A mang dấu âm (A < 0).",
        ],
        pedagogicalAdvice: [
          "Vẽ hình người nhận quà và cho quà để minh họa quy ước dấu: 'Nhận thì DƯƠNG (+), Cho/Sinh ra thì ÂM (-)'.",
        ],
        differentiationPrompts: {
          support: "Khối khí nhận nhiệt thì Q âm hay dương? Khí đẩy pit-tông ra ngoài thì khí mất công hay nhận công?",
          advanced: "Trong quá trình đẳng nhiệt của khí lí tưởng, độ biến thiên nội năng ΔU bằng bao nhiêu? Mối quan hệ giữa A và Q khi đó?",
        },
      },
    },
  },
  {
    id: "vl12-nhiet-do-thang-nhiet-do-nhiet-ke",
    grade: 12,
    chapterNumber: 1,
    chapterTitle: "Chương I: Vật lí nhiệt",
    lessonNumber: 3,
    lessonTitle: "Bài 3: Nhiệt độ. Thang nhiệt độ - nhiệt kế",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 5, 6",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL12.KNTT.B3",
    stemActivity: "Thiết kế và chuẩn độ nhiệt kế cồn pha màu tự chế",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1a"],
    experiments: ["Thí nghiệm đo nhiệt độ bằng nhiệt kế rượu, nhiệt kế thủy ngân, cảm biến nhiệt điện tử"],
    assessmentRubricId: "rubric-stem-product",
    defaultActivity: {
      id: "act-vl12-b3",
      activityTitle: "Dự án STEM: Thiết kế và chuẩn độ nhiệt kế cồn pha màu tự chế (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Nêu được nguyên lí truyền nhiệt giữa hai vật tiếp xúc và khái niệm trạng thái cân bằng nhiệt.",
          "Hiểu được cách xây dựng thang Celsius (°C) và thang Kelvin (K); chuyển đổi công thức T(K) = t(°C) + 273,15.",
          "Nêu được ý nghĩa của độ không tuyệt đối 0 K.",
        ],
        physicsCompetencies: [
          "Chế tạo được nhiệt kế chất lỏng tự chế dựa trên hiện tượng dãn nở vì nhiệt.",
          "Chuẩn độ được 2 mốc nhiệt độ chuẩn (0°C nước đá đang tan và 100°C nước sôi ở 1 atm) để chia vạch đo.",
        ],
        generalCompetencies: [
          "Giao tiếp và hợp tác nhóm chế tạo sản phẩm STEM, đánh giá đồng đẳng sản phẩm của nhóm bạn.",
        ],
        digitalCompetencies: [
          "Khai thác cảm biến nhiệt độ số (Digital Thermocouple / Pasco) để đối chứng độ chính xác.",
        ],
        qualities: ["Tỉ mỉ, kiên nhẫn khi chuẩn độ nhiệt kế, an toàn với nước sôi."],
      },
      content: "Tìm hiểu nguyên tắc nhiệt kế chất lỏng dãn nở vì nhiệt, định nghĩa điểm đóng băng và điểm sôi của nước tinh khiết. Thực hiện dự án STEM chế tạo nhiệt kế cồn từ bình thủy tinh nhỏ, ống hút trong suốt và cồn pha màu phẩm nhuộm.",
      product: "Chiếc nhiệt kế cồn tự chế có bảng chia độ từ 0°C đến 60°C kèm bản báo cáo sai số đối chứng với nhiệt kế phòng thí nghiệm.",
      implementation: {
        step1_transfer: "Giao nhiệm vụ dự án STEM (15 phút): Giáo viên cho xem video bệnh viện dã chiến thiếu nhiệt kế đo thân nhiệt, đặt nhiệm vụ cho các nhóm: 'Hãy chế tạo 1 chiếc nhiệt kế cồn bỏ túi từ vật liệu tái chế có khả năng đo nhiệt độ phòng và nước ấm'.",
        step2_execution: "Thi công và chuẩn độ (45 phút): Nhóm 4-5 học sinh dùng bình thủy tinh đựng cồn pha màu, cắm ống hút bịt kín nắp bằng súng bắn keo; nhúng bình vào cốc nước đá để đánh dấu vạch 0°C; nhúng vào nước ấm đối chứng với nhiệt kế chuẩn chia vạch đều mm; thử nghiệm đo nhiệt độ môi trường.",
        step3_discussion: "Báo cáo và đánh giá (18 phút): Các nhóm trưng bày nhiệt kế, cùng đo nhiệt độ một cốc nước chung; đại diện nhóm thuyết minh về độ nhạy (đường kính ống hút càng nhỏ nhiệt kế càng nhạy).",
        step4_conclusion: "Chuẩn hóa và kết luận (12 phút): Giáo viên giải thích tại sao thang Kelvin được gọi là thang nhiệt độ nhiệt động lực học tuyệt đối; chốt công thức T = t + 273,15.",
      },
      studentWorksheet: {
        title: "PHIẾU DỰ ÁN STEM: CHUẨN ĐỘ NHIỆT KẾ CỒN TỰ CHẾ",
        code: "PHT-STEM-VL12-B3",
        tasks: [
          {
            id: 1,
            instruction: "Nguyên lí hoạt động của nhiệt kế",
            prompt: "Để tăng độ nhạy của nhiệt kế chất lỏng (cùng 1 độ C mực chất lỏng dâng lên càng cao), ta nên chọn bầu chứa to hay nhỏ, ống mao dẫn to hay nhỏ? Vì sao?",
            expectedAnswer: "Bầu chứa thể tích lớn (để thể tích dãn nở Delta V = V0*beta*Delta t lớn) và ống mao dẫn tiết diện S nhỏ (để độ dâng Delta h = Delta V / S cao nhất).",
          },
          {
            id: 2,
            instruction: "Quy đổi nhiệt độ",
            prompt: "Nhiệt độ phòng hiện tại là 27°C. Hãy chuyển sang độ Kelvin (K) và độ Fahrenheit (°F)?",
            expectedAnswer: "T(K) = 27 + 273,15 = 300,15 K. t(°F) = 1,8 * 27 + 32 = 80,6 °F.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh nhầm lẫn rằng nhiệt độ đo lượng nhiệt của vật. Cần làm rõ: Nhiệt độ là số đo động năng tịnh tiến trung bình của phân tử, không phụ thuộc khối lượng vật, còn nhiệt năng/nội năng phụ thuộc cả khối lượng.",
        ],
        pedagogicalAdvice: [
          "Dùng Rubric Đánh giá Sản phẩm Chế tạo STEM để học sinh tự chấm điểm mô hình nhiệt kế cồn theo 4 tiêu chí.",
        ],
        differentiationPrompts: {
          support: "Tại sao không dùng nước lã làm nhiệt kế mà lại dùng cồn hoặc thủy ngân?",
          advanced: "Tại sao không thể làm lạnh bất kì vật chất nào xuống dưới 0 Kelvin (-273,15°C)?",
        },
      },
    },
  },
  {
    id: "vl12-nhiet-dung-rieng",
    grade: 12,
    chapterNumber: 1,
    chapterTitle: "Chương I: Vật lí nhiệt",
    lessonNumber: 4,
    lessonTitle: "Bài 4: Nhiệt dung riêng",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 7, 8",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL12.KNTT.B4",
    stemActivity: "Thiết kế bình giữ nhiệt",
    digitalCompetencies: ["5.2.NC1b", "3.1.NC1a"],
    experiments: ["Thực hành đo nhiệt dung riêng của nước bằng nhiệt lượng kế và oát kế số"],
    assessmentRubricId: "rubric-stem-design",
    defaultActivity: {
      id: "act-vl12-b4",
      activityTitle: "Hoạt động: Thực hành đo nhiệt dung riêng & Dự án STEM Thiết kế bình giữ nhiệt (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Nêu được định nghĩa nhiệt dung riêng c và đơn vị đo J/(kg.K).",
          "Viết và vận dụng công thức tính nhiệt lượng truyền trong quá trình thay đổi nhiệt độ: Q = m.c.ΔT.",
        ],
        physicsCompetencies: [
          "Thiết kế phương án và thực hành đo nhiệt dung riêng bằng nhiệt lượng kế điện trở.",
          "Áp dụng nguyên lí cách nhiệt (dẫn nhiệt, đối lưu, bức xạ nhiệt) để thiết kế bình giữ nhiệt mini.",
        ],
        generalCompetencies: [
          "Hợp tác nhóm thực hành đo lường, tính toán công suất nhiệt P = U.I và hiệu suất H.",
        ],
        digitalCompetencies: [
          "Thu thập dữ liệu cảm biến nhiệt độ theo thời gian và vẽ đồ thị T(t) trên máy tính.",
        ],
        qualities: ["Trung thực ghi số liệu nhiệt độ, trách nhiệm giữ an toàn nguồn điện đun."],
      },
      content: "Định nghĩa nhiệt dung riêng c, thiết lập hệ thức định lượng Q = m.c.ΔT. Khảo sát thí nghiệm cấp nhiệt lượng bằng dòng điện và ứng dụng tính toán bảo ôn nhiệt trong dự án Bình giữ nhiệt.",
      product: "Báo cáo thực nghiệm đo nhiệt dung riêng của nước c_nước ≈ 4180 J/(kg.K) và bản thiết kế bình giữ nhiệt từ vật liệu xốp, giấy bạc, chai rỗng.",
      implementation: {
        step1_transfer: "Đặt vấn đề (10 phút): Tại sao vùng ven biển ban ngày mát mẻ hơn trong đất liền, ban đêm lại ấm hơn? Tại sao nước được dùng làm chất tải nhiệt làm mát động cơ ô tô? Giao nhiệm vụ thực hành.",
        step2_execution: "Tiến hành đo nhiệt dung riêng (45 phút): Học sinh lắp mạch điện gồm nguồn điện, oát kế/ampe kế-vôn kế, dây đốt nhúng trong nhiệt lượng kế chứa m = 0,2 kg nước; đo nhiệt độ t0 và t sau thời gian tau; tính nhiệt dung riêng theo c = (U.I.tau)/(m.Δt).",
        step3_discussion: "Báo cáo số liệu và thảo luận sai số (20 phút): So sánh kết quả tính được với giá trị chuẩn 4200 J/(kg.K); thảo luận nguyên nhân mất nhiệt ra môi trường.",
        step4_conclusion: "Chuẩn hóa và chuyển giao dự án (15 phút): Giáo viên chốt công thức, hướng dẫn dự án STEM Thiết kế bình giữ nhiệt nộp ở buổi sau theo Rubric.",
      },
      studentWorksheet: {
        title: "PHIẾU THỰC HÀNH: XÁC ĐỊNH NHIỆT DUNG RIÊNG CỦA NƯỚC",
        code: "PHT-VL12-B4",
        tasks: [
          {
            id: 1,
            instruction: "Xử lí số liệu thực nghiệm",
            prompt: "Cho m = 0,15 kg nước, dòng điện I = 2 A qua điện trở R = 10 ôm trong thời gian 300 s làm nước tăng từ 25°C lên 34,5°C. Bỏ qua nhiệt lượng kế, tính nhiệt dung riêng c của nước?",
            expectedAnswer: "Nhiệt lượng dòng điện tỏa ra: Q = I^2 * R * t = 2^2 * 10 * 300 = 12000 J. Ta có Q = m * c * Delta t => c = Q / (m * Delta t) = 12000 / (0,15 * 9,5) = 8421 J/(kg.K) (giả định có hao phí lớn ra môi trường). Nếu hiệu suất 90%: c = 4200 J/(kg.K).",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh nhầm lẫn nhiệt dung riêng c với nhiệt dung C (nhiệt dung C = m.c là nhiệt lượng cả khối vật hấp thụ).",
        ],
        pedagogicalAdvice: [
          "Yêu cầu học sinh khuấy đều nước nhẹ nhàng trước khi đọc nhiệt kế để nhiệt độ đồng đều trong toàn bộ bình.",
        ],
        differentiationPrompts: {
          support: "Công thức tính điện năng tiêu thụ của dây đốt nóng là gì?",
          advanced: "Làm thế nào để đo chính xác cả nhiệt dung của vỏ nhiệt lượng kế để triệt tiêu sai số?",
        },
      },
    },
  },
  // ==========================================
  // CHƯƠNG II: KHÍ LÍ TƯỞNG (12 TIẾT)
  // ==========================================
  {
    id: "vl12-dinh-luat-boyle",
    grade: 12,
    chapterNumber: 2,
    chapterTitle: "Chương II: Khí lí tưởng",
    lessonNumber: 9,
    lessonTitle: "Bài 9: Định luật Boyle",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 29, 30",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL12.KNTT.B9",
    stemActivity: "Chế tạo mô hình kích nâng xe cơ học bằng áp suất khí nén",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1a"],
    experiments: ["Bộ thí nghiệm kiểm chứng định luật Boyle với xi-lanh kín và áp kế đo áp suất khí"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl12-b9",
      activityTitle: "Hoạt động: Khảo sát quá trình đẳng nhiệt và kiểm chứng Định luật Boyle p.V = const (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Nêu được ba thông số trạng thái p, V, T xác định trạng thái của một khối khí.",
          "Phát biểu và viết được biểu thức định luật Boyle: p.V = hằng số khi T không đổi.",
          "Vẽ và nhận dạng được đường đẳng nhiệt trong hệ tọa độ (p, V), (p, 1/V).",
        ],
        physicsCompetencies: [
          "Thao tác thí nghiệm nén và dãn khí từ từ để đảm bảo nhiệt độ T không đổi.",
          "Thu thập bảng số liệu p và V, vẽ đồ thị p theo 1/V để chứng minh mối quan hệ tỉ lệ nghịch.",
        ],
        generalCompetencies: [
          "Tư duy khoa học: Vận dụng định luật Boyle giải thích hiện tượng bọt khí nổi lên từ đáy hồ to dần.",
        ],
        digitalCompetencies: [
          "Nhập dữ liệu p, V vào bảng tính Excel hoặc GeoGebra để vẽ đường cong hypebol và đường hồi quy tuyến tính.",
        ],
        qualities: ["Cẩn thận, kiên nhẫn khi dịch chuyển pit-tông để giữ nhiệt độ cân bằng với môi trường."],
      },
      content: "Khảo sát quá trình biến đổi trạng thái của khối khí khi nhiệt độ không đổi (quá trình đẳng nhiệt). Thực hiện thí nghiệm thu thập 5 cặp số liệu (p, V) bằng xi lanh gắn áp kế, vẽ đường đẳng nhiệt và ứng dụng vào cơ chế kích khí nén.",
      product: "Bảng số liệu 5 lần đo tích số p.V, đồ thị đường hypebol đẳng nhiệt trên giấy kẻ ô và mô hình kích khí nén bằng xi-lanh tiêm.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Thả một quả bóng bay từ từ xuống nước sâu, thể tích quả bóng sẽ thay đổi thế nào? Người thợ lặn khi ngoi lên mặt nước tại sao phải thở ra liên tục mà không được nín thở?",
        step2_execution: "Thực hành đo đạc (45 phút): Nhóm học sinh điều chỉnh pit-tông từ từ đến các thể tích V = 40, 35, 30, 25, 20 ml; đọc chỉ số áp suất p tương ứng trên áp kế; tính tích p*V và tính sai số trung bình; vẽ đồ thị p theo V.",
        step3_discussion: "Báo cáo kết quả và thảo luận (20 phút): Các nhóm so sánh tích số p.V; giải thích tại sao cần dịch chuyển pit-tông thật chậm; phân tích dạng đường đẳng nhiệt trong tọa độ (p, V) và (p, 1/V).",
        step4_conclusion: "Chuẩn hóa và kết luận (15 phút): Giáo viên phát biểu định luật Boyle: 'Ở nhiệt độ không đổi, áp suất của một khối lượng khí xác định tỉ lệ nghịch với thể tích của nó': p1.V1 = p2.V2; mở rộng ứng dụng kích nâng khí nén.",
      },
      studentWorksheet: {
        title: "PHIẾU THÍ NGHIỆM: KHẢO SÁT ĐỊNH LUẬT BOYLE",
        code: "PHT-VL12-B9",
        tasks: [
          {
            id: 1,
            instruction: "Xử lí số liệu bảng đo",
            prompt: "Cho bảng số liệu: V1 = 40 cm3, p1 = 1,0 bar; V2 = 30 cm3, p2 = 1,33 bar; V3 = 20 cm3, p3 = 2,01 bar. Tính tích số p.V ở mỗi lần đo và nhận xét?",
            expectedAnswer: "p1*V1 = 40. p2*V2 = 39,9. p3*V3 = 40,2. Nhận xét: Tích số p.V gần như là một hằng số không đổi trong giới hạn sai số đo lường (sai số < 1%).",
          },
          {
            id: 2,
            instruction: "Giải thích hiện tượng đời sống",
            prompt: "Một bọt khí nổi lên từ đáy hồ sâu 10 m lên đến mặt nước. Biết nhiệt độ nước như nhau và áp suất khí quyển là 1 atm (tương đương 10 m nước). Thể tích bọt khí tăng lên mấy lần?",
            expectedAnswer: "Ở đáy hồ: p1 = p0 + d*h = 1 atm + 1 atm = 2 atm. Ở mặt nước: p2 = p0 = 1 atm. Quá trình đẳng nhiệt: p1*V1 = p2*V2 => V2 = (p1/p2)*V1 = (2/1)*V1 = 2*V1. Thể tích bọt khí tăng gấp 2 lần.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh dịch chuyển pit-tông quá nhanh làm chất khí bị nung nóng (quá trình đoạn nhiệt chứ không đẳng nhiệt), dẫn đến p.V tăng vọt làm sai lệch định luật. Cần nhắc học sinh đẩy từ từ và chờ 30 giây trước khi đọc áp suất.",
        ],
        pedagogicalAdvice: [
          "Cho học sinh vẽ đồ thị p theo 1/V: đường thẳng đi qua gốc tọa độ sẽ chứng minh trực quan tính tỉ lệ nghịch hơn đường cong hypebol.",
        ],
        differentiationPrompts: {
          support: "Khi ép pit-tông vào thì thể tích V tăng hay giảm? Áp suất trong bình tăng hay giảm?",
          advanced: "Đường đẳng nhiệt ở nhiệt độ T2 cao hơn đường T1 sẽ nằm ở phía trên hay phía dưới trong hệ tọa độ (p, V)? Vì sao?",
        },
      },
    },
  },
  {
    id: "vl12-dinh-luat-charles",
    grade: 12,
    chapterNumber: 2,
    chapterTitle: "Chương II: Khí lí tưởng",
    lessonNumber: 10,
    lessonTitle: "Bài 10: Định luật Charles",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 31, 32",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL12.KNTT.B10",
    stemActivity: "Thiết kế khinh khí cầu mini hoạt động bằng nến",
    digitalCompetencies: ["5.3.NC1b", "1.3.NC1a"],
    experiments: ["Bộ thí nghiệm chứng minh định luật Charles với giọt thủy ngân hoặc dầu trong ống thủy tinh nằm ngang ngâm nước nóng"],
    assessmentRubricId: "rubric-experiment",
    defaultActivity: {
      id: "act-vl12-b10",
      activityTitle: "Hoạt động: Khảo sát quá trình đẳng áp và Định luật Charles V/T = const (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Định nghĩa được quá trình đẳng áp và nội dung định luật Charles.",
          "Viết được biểu thức V/T = hằng số, hay V1/T1 = V2/T2 (với T là nhiệt độ tuyệt đối).",
          "Hiểu được cách xác định độ không tuyệt đối bằng phương pháp ngoại suy đồ thị V-t.",
        ],
        physicsCompetencies: [
          "Đo được sự thay đổi thể tích của lượng khí gián tiếp qua độ dời của giọt chất lỏng chỉ thị khi nhiệt độ thay đổi.",
          "Thiết kế khinh khí cầu mini bằng túi nylon mỏng và nến sáp dựa trên lực đẩy Ác-si-mét khi không khí nóng dãn nở giảm khối lượng riêng.",
        ],
        generalCompetencies: [
          "Hợp tác nhóm thử nghiệm khinh khí cầu mini, đánh giá an toàn phòng cháy.",
        ],
        digitalCompetencies: [
          "Vẽ đồ thị V theo T(K) bằng phần mềm để kiểm chứng đường thẳng kéo dài qua gốc tọa độ O.",
        ],
        qualities: ["Cẩn thận khi làm việc với nước nóng và nến lửa."],
      },
      content: "Khảo sát quá trình đẳng áp (áp suất p không đổi). Đo thể tích khí V ở các nhiệt độ khác nhau, chứng minh V tỉ lệ thuận với nhiệt độ tuyệt đối T (Kelvin) và vận dụng chế tạo khinh khí cầu mini.",
      product: "Đồ thị đường đẳng áp và mô hình khinh khí cầu mini bay lơ lửng được trong phòng học.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Xem video khinh khí cầu khổng lồ bay lên bầu trời: Tại sao đốt nóng không khí bên trong lại làm khí cầu bay lên được? Nếu dùng độ Celsius thì thể tích có tỉ lệ thuận với nhiệt độ không?",
        step2_execution: "Thí nghiệm và khảo sát (45 phút): Nhóm học sinh theo dõi ống mao dẫn chứa bọt dầu ngăn khối khí; đun nước nóng dần, ghi lại chiều dài cột khí L (tỉ lệ với V) và nhiệt độ t; đổi sang T(K); kiểm tra tỉ số V/T; thử nghiệm mô hình khinh khí cầu túi bóng.",
        step3_discussion: "Báo cáo và thảo luận (20 phút): Các nhóm báo cáo đồ thị; thảo luận hiện tượng ngoại suy đường thẳng cắt trục hoành tại -273,15°C (độ không tuyệt đối).",
        step4_conclusion: "Chuẩn hóa và kết luận (15 phút): Giáo viên phát biểu định luật Charles: 'Khi áp suất của một khối khí xác định không đổi, thể tích của khí tỉ lệ thuận với nhiệt độ tuyệt đối của nó': V1/T1 = V2/T2.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: ĐỊNH LUẬT CHARLES & QUÁ TRÌNH ĐẲNG ÁP",
        code: "PHT-VL12-B10",
        tasks: [
          {
            id: 1,
            instruction: "Lập luận về thang nhiệt độ",
            prompt: "Tại sao định luật Charles bắt buộc phải dùng nhiệt độ tuyệt đối T (Kelvin) mà không được dùng nhiệt độ Celsius (°C)?",
            expectedAnswer: "Vì V tỉ lệ thuận với T: V = const * T. Nếu dùng t(°C) thì V = V0(1 + alpha*t), thể tích là hàm bậc nhất chứ không tỉ lệ thuận với t(°C); ngoài ra nếu t = 0°C thì V vẫn khác 0.",
          },
          {
            id: 2,
            instruction: "Tính toán bài toán khinh khí cầu",
            prompt: "Khối khí bên trong khí cầu ban đầu ở 27°C có thể tích 100 m3. Đốt nóng không khí lên 87°C dưới áp suất khí quyển không đổi. Tính thể tích mới của khối khí?",
            expectedAnswer: "T1 = 27 + 273 = 300 K. T2 = 87 + 273 = 360 K. Đẳng áp: V1/T1 = V2/T2 => V2 = V1 * (T2/T1) = 100 * (360/300) = 120 m3. Khí nở ra đẩy bớt khí ra ngoài làm khí bên trong nhẹ đi.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh hay quên đổi từ °C sang Kelvin dẫn đến tính sai: ví dụ từ 20°C lên 40°C học sinh tưởng nhiệt độ tăng gấp đôi nên V tăng gấp đôi (thực tế từ 293 K lên 313 K chỉ tăng khoảng 6.8%).",
        ],
        pedagogicalAdvice: [
          "Nhấn mạnh quy tắc: Trong mọi bài toán chất khí, luôn đổi nhiệt độ sang Kelvin trước khi bấm máy tính!",
        ],
        differentiationPrompts: {
          support: "Công thức đổi từ độ C sang Kelvin là gì?",
          advanced: "Lực đẩy Ác-si-mét tác dụng lên khí cầu phụ thuộc vào nhiệt độ không khí bên trong như thế nào?",
        },
      },
    },
  },
  // ==========================================
  // CHƯƠNG III: TỪ TRƯỜNG (18 TIẾT)
  // ==========================================
  {
    id: "vl12-tu-truong",
    grade: 12,
    chapterNumber: 3,
    chapterTitle: "Chương III: Từ trường",
    lessonNumber: 14,
    lessonTitle: "Bài 14: Từ trường",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 57, 58",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL12.KNTT.B14",
    stemActivity: "Chế tạo la bàn bỏ túi từ tính tự chế",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1a"],
    experiments: ["Bộ thí nghiệm tạo từ phổ bằng mạt sắt với nam châm thẳng, nam châm chữ U và dòng điện thẳng/tròn"],
    assessmentRubricId: "rubric-stem-product",
    defaultActivity: {
      id: "act-vl12-b14",
      activityTitle: "Hoạt động: Khảo sát từ phổ, quy tắc bàn tay phải & Dự án chế tạo La bàn tự chế (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Nêu được khái niệm từ trường, tính chất cơ bản của từ trường (tác dụng lực từ lên nam châm hoặc dòng điện).",
          "Mô tả được từ phổ, định nghĩa đường sức từ và các đặc điểm của đường sức từ.",
          "Vận dụng quy tắc bàn tay phải xác định chiều đường sức từ của dòng điện thẳng và dòng điện tròn, ống dây.",
        ],
        physicsCompetencies: [
          "Thực hiện thí nghiệm rắc mạt sắt và gõ nhẹ để tạo hình ảnh từ phổ thực tế.",
          "Chế tạo la bàn bỏ túi từ kim khâu nhiễm từ nổi trên nắp chai nước.",
        ],
        generalCompetencies: ["Hợp tác nhóm, tư duy giải quyết vấn đề định hướng trong không gian."],
        digitalCompetencies: ["Sử dụng cảm biến từ kế (Magnetometer) trên điện thoại thông minh để đo cảm ứng từ B."],
        qualities: ["Trách nhiệm, cẩn thận khi thao tác với mạt sắt không để dính vào mắt."],
      },
      content: "Nghiên cứu bản chất từ trường, sự tương tác từ giữa nam châm - dòng điện. Vẽ và giải thích từ phổ của nam châm và dòng điện; vận dụng quy tắc bàn tay phải; chế tạo la bàn định hướng từ tính.",
      product: "Bản vẽ từ phổ các dạng nguồn từ và sản phẩm La bàn bỏ túi tự chế định vị chính xác hướng Bắc - Nam.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Người đi rừng bị lạc trong đêm không có sóng điện thoại làm sao tìm hướng Bắc? Tại sao kim la bàn luôn chỉ hướng Bắc - Nam địa lí?",
        step2_execution: "Thí nghiệm tạo từ phổ và chế tạo la bàn (45 phút): Nhóm học sinh rắc mạt sắt lên tấm nhựa đặt trên nam châm, gõ nhẹ quan sát đường cong từ phổ; dùng nam châm cọ xát vào kim khâu để từ hóa kim; cắm kim xuyên qua xốp thả nổi trên mặt nước; kiểm tra sự định hướng với la bàn chuẩn.",
        step3_discussion: "Báo cáo và giải thích (20 phút): Đại diện nhóm giải thích quy ước chiều đường sức từ 'Vào Nam Ra Bắc'; biểu diễn quy tắc bàn tay phải cho ống dây có dòng điện.",
        step4_conclusion: "Chuẩn hóa và kết luận (15 phút): Giáo viên hệ thống các tính chất đường sức từ: là các đường cong khép kín hoặc vô hạn ở hai đầu; không bao giờ cắt nhau; nơi nào từ trường mạnh đường sức mau, nơi nào yếu đường sức thưa.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: TỪ PHỔ VÀ QUY TẮC BÀN TAY PHẢI",
        code: "PHT-VL12-B14",
        tasks: [
          {
            id: 1,
            instruction: "Xác định chiều đường sức từ",
            prompt: "Một dòng điện thẳng đứng chạy từ dưới lên trên. Xác định chiều đường sức từ trên mặt phẳng nằm ngang vuông góc với dòng điện?",
            expectedAnswer: "Đặt ngón cái bàn tay phải chỉ thẳng đứng từ dưới lên theo chiều dòng điện, bốn ngón tay khum lại chỉ chiều đường sức từ => đường sức là các đường tròn đồng tâm có chiều ngược chiều kim đồng hồ khi nhìn từ trên xuống.",
          },
          {
            id: 2,
            instruction: "Giải thích từ trường Trái Đất",
            prompt: "Tại sao cực Bắc của kim la bàn lại hướng về phía Cực Bắc địa lí của Trái Đất?",
            expectedAnswer: "Vì ở gần Cực Bắc địa lí của Trái Đất là cực Nam từ tính của Trái Đất. Do hai cực khác tên hút nhau nên cực Bắc của kim la bàn bị cực Nam từ tính của Trái Đất hút về hướng đó.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh hay nhầm lẫn cực từ của Trái Đất trùng với cực địa lí. Cần giải thích rõ: Cực Bắc địa lí tương ứng với cực Nam từ trường Trái Đất.",
        ],
        pedagogicalAdvice: [
          "Cho học sinh cài ứng dụng Physics Toolbox Suite hoặc Sensor Box trên điện thoại để quan sát cảm biến la bàn số hoạt động.",
        ],
        differentiationPrompts: {
          support: "Quy tắc bàn tay phải dùng bàn tay nào? Ngón cái chỉ chiều gì?",
          advanced: "Tại sao đường sức từ là đường cong khép kín còn đường sức điện trường tĩnh lại là đường cong hở?",
        },
      },
    },
  },
  {
    id: "vl12-luc-tu-cam-ung-tu",
    grade: 12,
    chapterNumber: 3,
    chapterTitle: "Chương III: Từ trường",
    lessonNumber: 15,
    lessonTitle: "Bài 15: Lực từ tác dụng lên dây dẫn mang dòng điện. Cảm ứng từ",
    estimatedPeriods: 3,
    ppctSessions: "Tiết 59-61",
    durationDisplay: "3 tiết (135 phút)",
    standardCurriculumCode: "VL12.KNTT.B15",
    stemActivity: "Thiết kế mô hình tàu đệm từ đơn giản",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1b"],
    experiments: ["Bộ thí nghiệm khảo sát lực từ tác dụng lên đoạn dây dẫn đặt trong từ trường đều"],
    assessmentRubricId: "rubric-stem-design",
    defaultActivity: {
      id: "act-vl12-b15",
      activityTitle: "Hoạt động: Xây dựng công thức lực từ F = B.I.L.sin(α), quy tắc bàn tay trái & Dự án Tàu đệm từ (Thời lượng: 3 tiết - 135 phút)",
      durationMinutes: 135,
      objectives: {
        knowledge: [
          "Định nghĩa cảm ứng từ B và đơn vị Tesla (T).",
          "Viết được công thức tính lực từ tác dụng lên đoạn dây dẫn thẳng: F = B.I.L.sin(α).",
          "Vận dụng quy tắc bàn tay trái xác định phương chiều của lực từ.",
        ],
        physicsCompetencies: [
          "Thực hiện thí nghiệm khảo sát lực từ đẩy dây dẫn nhảy ra khỏi nam châm chữ U.",
          "Thiết kế bản vẽ mô hình tàu đệm từ (Maglev) sử dụng lực từ nâng thân tàu triệt tiêu ma sát.",
        ],
        generalCompetencies: ["Giải quyết vấn đề và sáng tạo trong thiết kế công nghệ giao thông tương lai."],
        digitalCompetencies: ["Phân tích video hoạt động của tàu đệm từ Maglev ở Nhật Bản và Trung Quốc."],
        qualities: ["Hăng say sáng tạo, kiên trì thử nghiệm."],
      },
      content: "Nghiên cứu đặc trưng của từ trường về mặt tác dụng lực: vectơ cảm ứng từ B. Khảo sát công thức lực Lorentz và lực từ Am-pe F = B.I.L.sin(α), quy tắc bàn tay trái và nguyên lí tàu đệm từ trường.",
      product: "Bài giải các bài toán lực từ và bản thiết kế mô hình tàu đệm từ sử dụng nam châm vĩnh cửu neodim.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (15 phút): Tàu đệm từ trường chạy với vận tốc trên 600 km/h mà không cần bánh xe tiếp xúc với đường ray. Lực nào đã nâng con tàu nặng hàng trăm tấn lơ lửng trên không trung?",
        step2_execution: "Khám phá quy luật và làm bài tập (70 phút): Học sinh làm thí nghiệm khung dây treo trong nam châm chữ U; đóng ngắt dòng điện quan sát góc lệch; thiết lập công thức F = B.I.L.sin(α); luyện tập quy tắc bàn tay trái; phác thảo bản thiết kế rãnh ray đệm từ.",
        step3_discussion: "Báo cáo và thảo luận giải pháp (30 phút): Các nhóm trình bày phương án bố trí các cực nam châm để tàu vừa được nâng vừa tự cân bằng không bị trượt khỏi ray.",
        step4_conclusion: "Chuẩn hóa và kết luận (20 phút): Giáo viên chuẩn hóa quy tắc bàn tay trái: Đặt bàn tay trái hứng đường sức từ (B đâm vào lòng bàn tay), chiều từ cổ tay đến ngón tay giữa là chiều dòng điện I, ngón cái choãi 90° chỉ chiều lực từ F.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: LỰC TỪ VÀ NGUYÊN LÍ TÀU ĐỆM TỪ",
        code: "PHT-VL12-B15",
        tasks: [
          {
            id: 1,
            instruction: "Tính toán lực từ",
            prompt: "Một đoạn dây dẫn dài L = 0,2 m mang dòng điện I = 5 A đặt trong từ trường đều B = 0,4 T. Dây hợp với vectơ B một góc 30°. Tính lực từ tác dụng lên đoạn dây?",
            expectedAnswer: "F = B * I * L * sin(alpha) = 0,4 * 5 * 0,2 * sin(30°) = 0,4 * 5 * 0,2 * 0,5 = 0,2 N.",
          },
          {
            id: 2,
            instruction: "Quy tắc bàn tay trái",
            prompt: "Từ trường B hướng thẳng đứng từ dưới lên. Dòng điện I chạy theo phương ngang từ Tây sang Đông. Lực từ F hướng theo hướng nào?",
            expectedAnswer: "Lòng bàn tay úp xuống hứng B đâm lên, cổ tay đến ngón giữa hướng sang Đông => Ngón tay cái choãi 90° chỉ về hướng Nam. Lực từ hướng về phía Nam.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh hay nhầm lẫn giữa quy tắc bàn tay PHẢI (xác định chiều đường sức từ do dòng điện sinh ra) và quy tắc bàn tay TRÁI (xác định lực từ do từ trường ngoài tác dụng lên dòng điện).",
        ],
        pedagogicalAdvice: [
          "Mẹo sư phạm: 'Phải sinh ra, Trái tác dụng' - Tay phải tìm chiều từ trường của dòng điện, tay trái tìm lực tác dụng.",
        ],
        differentiationPrompts: {
          support: "Bàn tay trái: Ngón tay nào chỉ chiều dòng điện? Ngón cái chỉ chiều gì?",
          advanced: "Làm thế nào để điều khiển đoàn tàu đệm từ tiến về phía trước và phanh hãm lại bằng từ trường?",
        },
      },
    },
  },
  {
    id: "vl12-may-phat-dien-xoay-chieu",
    grade: 12,
    chapterNumber: 3,
    chapterTitle: "Chương III: Từ trường",
    lessonNumber: 17,
    lessonTitle: "Bài 17: Máy phát điện xoay chiều",
    estimatedPeriods: 3,
    ppctSessions: "Tiết 65-67",
    durationDisplay: "3 tiết (135 phút)",
    standardCurriculumCode: "VL12.KNTT.B17",
    stemActivity: "Chế tạo máy phát điện xoay chiều quay tay đơn giản",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1a"],
    experiments: ["Bộ thí nghiệm máy phát điện xoay chiều mini nối với đèn LED hai màu và dao động kí số"],
    assessmentRubricId: "rubric-stem-product",
    defaultActivity: {
      id: "act-vl12-b17",
      activityTitle: "Dự án STEM: Chế tạo máy phát điện xoay chiều mini quay tay thắp sáng đèn LED (Thời lượng: 3 tiết - 135 phút)",
      durationMinutes: 135,
      objectives: {
        knowledge: [
          "Trình bày được phương án tạo ra dòng điện xoay chiều và nguyên tắc hoạt động dựa trên cảm ứng điện từ.",
          "Nêu được chu kì, tần số, giá trị cực đại và giá trị hiệu dụng của cường độ dòng điện và điện áp xoay chiều.",
          "Phát biểu được các quy tắc an toàn khi sử dụng dòng điện xoay chiều trong đời sống.",
        ],
        physicsCompetencies: [
          "Chế tạo được mô hình máy phát điện xoay chiều từ cuộn dây đồng, nam châm neodim và trục quay cơ học.",
          "Đo được điện áp xoay chiều hiệu dụng U và kiểm chứng sự chớp tắt luân phiên của 2 đèn LED mắc song song ngược cực.",
        ],
        generalCompetencies: ["Năng lực sáng tạo kĩ thuật, làm việc nhóm, thuyết trình bảo vệ sản phẩm."],
        digitalCompetencies: ["Kết nối đầu ra máy phát điện với dao động kí số trên máy tính hiển thị đường sin u(t)."],
        qualities: ["Tiết kiệm nguyên liệu, ý thức an toàn điện lưới quốc gia."],
      },
      content: "Nghiên cứu nguyên tắc quay khung dây trong từ trường hoặc quay nam châm trước cuộn dây cố định. Chế tạo máy phát điện mini quay tay, khảo sát mối liên hệ giữa tốc độ quay với độ sáng đèn LED và tần số dòng điện xoay chiều f = n.p.",
      product: "Mô hình máy phát điện xoay chiều mini quay tay thắp sáng được cặp đèn LED đỏ-xanh luân phiên.",
      implementation: {
        step1_transfer: "Giao nhiệm vụ dự án STEM (15 phút): Giáo viên chiếu video vùng lũ lụt bị cắt điện lưới hoàn toàn: Làm thế nào tạo ra điện năng thắp sáng bóng đèn cứu hộ chỉ bằng sức người? Giao tiêu chí sản phẩm.",
        step2_execution: "Thi công chế tạo và thử nghiệm (75 phút): Nhóm học sinh quấn 300-500 vòng dây đồng quanh lõi giấy/nhựa; gắn nam châm lên trục quay tay từ đĩa CD/que gỗ; đấu 2 đầu dây ra cặp LED đỏ-xanh mắc song song ngược chiều; quay trục thử nghiệm và đo điện áp bằng vôn kế xoay chiều.",
        step3_discussion: "Báo cáo và giải thích khoa học (25 phút): Đại diện các nhóm quay máy phát, giải thích tại sao 2 đèn LED chớp tắt luân phiên; liên hệ với cấu tạo stato và rôto của nhà máy thủy điện Hòa Bình/Sơn La.",
        step4_conclusion: "Chuẩn hóa và kết luận (20 phút): Giáo viên chốt lại định nghĩa dòng điện xoay chiều hình sin: i = I0.cos(ωt + φ); định nghĩa giá trị hiệu dụng I = I0 / √2 và U = U0 / √2; nêu công thức tần số máy phát f = n.p.",
      },
      studentWorksheet: {
        title: "PHIẾU DỰ ÁN STEM: MÁY PHÁT ĐIỆN XOAY CHIỀU QUAY TAY",
        code: "PHT-STEM-VL12-B17",
        tasks: [
          {
            id: 1,
            instruction: "Nguyên tắc hoạt động",
            prompt: "Giải thích tại sao khi quay nam châm trước cuộn dây thì hai đèn LED mắc song song ngược cực lại chớp tắt luân phiên?",
            expectedAnswer: "Khi cực Bắc lại gần cuộn dây, từ thông tăng => xuất hiện dòng điện cảm ứng chiều thứ nhất làm LED 1 sáng. Khi cực Bắc đi ra xa (hoặc cực Nam tiến lại), từ thông giảm => dòng cảm ứng đổi chiều làm LED 2 sáng. Dòng điện đổi chiều liên tục theo chu kì quay.",
          },
          {
            id: 2,
            instruction: "Tính toán giá trị hiệu dụng",
            prompt: "Điện áp xoay chiều dân dụng ở Việt Nam có giá trị hiệu dụng U = 220 V, tần số f = 50 Hz. Viết biểu thức điện áp tức thời u(t) và tính giá trị điện áp cực đại U0?",
            expectedAnswer: "U0 = U * sqrt(2) = 220 * 1,414 ≈ 311 V. Tần số góc omega = 2*pi*f = 100*pi (rad/s). Biểu thức: u(t) = 311*cos(100*pi*t) (V).",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh hay hiểu nhầm giá trị 220 V ghi trên các thiết bị điện là giá trị cực đại. Cần nhấn mạnh: Tất cả số đo trên vôn kế xoay chiều và thông số danh định trên thiết bị đều là GIÁ TRỊ HIỆU DỤNG.",
        ],
        pedagogicalAdvice: [
          "Cho học sinh quay trục máy phát điện thật chậm để thấy rõ 2 LED chớp tắt so le, sau đó quay thật nhanh thì mắt thấy cả 2 đèn sáng liên tục do hiện tượng lưu ảnh trên võng mạc.",
        ],
        differentiationPrompts: {
          support: "Giá trị hiệu dụng bằng giá trị cực đại chia cho mấy?",
          advanced: "Tại sao trong công nghiệp người ta chuộng máy phát điện có phần ứng cố định (stato) và phần cảm quay (rôto) hơn máy có khung dây quay?",
        },
      },
    },
  },
  // ==========================================
  // CHƯƠNG IV: VẬT LÍ HẠT NHÂN (16 TIẾT)
  // ==========================================
  {
    id: "vl12-cau-truc-hat-nhan",
    grade: 12,
    chapterNumber: 4,
    chapterTitle: "Chương IV: Vật lí hạt nhân",
    lessonNumber: 21,
    lessonTitle: "Bài 21: Cấu trúc hạt nhân",
    estimatedPeriods: 2,
    ppctSessions: "Tiết 77, 78",
    durationDisplay: "2 tiết (90 phút)",
    standardCurriculumCode: "VL12.KNTT.B21",
    digitalCompetencies: ["5.3.NC1b", "3.1.NC1a"],
    experiments: ["Mô phỏng thí nghiệm tán xạ hạt alpha của Rutherford trên máy tính"],
    assessmentRubricId: "rubric-presentation",
    defaultActivity: {
      id: "act-vl12-b21",
      activityTitle: "Hoạt động: Khám phá cấu trúc hạt nhân qua mô phỏng tán xạ Rutherford (Thời lượng: 2 tiết - 90 phút)",
      durationMinutes: 90,
      objectives: {
        knowledge: [
          "Rút ra được sự tồn tại và đánh giá được kích thước của hạt nhân từ kết quả thí nghiệm tán xạ hạt alpha.",
          "Mô tả được cấu tạo hạt nhân gồm proton và neutron (gọi chung là nucleon).",
          "Biểu diễn được kí hiệu hạt nhân ^A_Z X, nêu đơn vị khối lượng nguyên tử amu và khái niệm đồng vị.",
        ],
        physicsCompetencies: [
          "Phân tích dữ liệu tán xạ hạt alpha chứng minh nguyên tử có cấu tạo rỗng và phần lớn khối lượng tập trung ở hạt nhân mang điện dương cực nhỏ.",
          "Tính toán số lượng proton Z, neutron N = A - Z cho các đồng vị phóng xạ.",
        ],
        generalCompetencies: ["Tư duy mô hình hóa, kĩ năng đọc hiểu thông tin khoa học hiện đại."],
        digitalCompetencies: ["Tương tác với mô phỏng số Rutherford Scattering để theo dõi quỹ đạo hạt alpha bị bẻ cong."],
        qualities: ["Yêu thích khám phá khoa học, kiên trì học hỏi."],
      },
      content: "Tìm hiểu lịch sử khám phá hạt nhân từ mô hình bánh pudding của Thomson đến thí nghiệm tán xạ hạt alpha của Rutherford. Định nghĩa hạt nhân, số khối A, nguyên tử số Z, đồng vị và lực hạt nhân (tương tác mạnh).",
      product: "Bảng phân tích cấu trúc nucleon của các đồng vị bền và sơ đồ mô phỏng nguyên tử Rutherford - Bohr.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (10 phút): Nếu nguyên tử có kích thước như một sân vận động khổng lồ thì hạt nhân của nó chỉ bé bằng hạt đậu phộng ở giữa sân! Làm sao Rutherford bắn phá được hạt siêu nhỏ bé đó để phát hiện ra nó?",
        step2_execution: "Khám phá qua mô phỏng số (45 phút): Nhóm học sinh mở mô phỏng tán xạ Rutherford; đếm số hạt alpha đi thẳng và số hạt bị lệch góc lớn; giải thích tại sao có hạt bật ngược lại 180°; điền thông tin vào phiếu học tập; tính số neutron của các đồng vị Urani, Cacbon.",
        step3_discussion: "Báo cáo và thảo luận (20 phút): Các nhóm trình bày tại sao các proton cùng mang điện tích dương lại có thể nằm sát nhau trong hạt nhân mà không bị lực đẩy Coulomb xé toạc? Giới thiệu lực hạt nhân tương tác mạnh.",
        step4_conclusion: "Chuẩn hóa và kết luận (15 phút): Giáo viên chốt kí hiệu hạt nhân ^A_Z X; đơn vị amu (1 amu ≈ 1,66054.10^-27 kg); bán kính hạt nhân R = 1,2.10^-15 . A^(1/3) m.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: CẤU TRÚC HẠT NHÂN NGUYÊN TỬ",
        code: "PHT-VL12-B21",
        tasks: [
          {
            id: 1,
            instruction: "Xác định thành phần hạt nhân",
            prompt: "Cho hạt nhân Urani ^235_92 U. Hãy cho biết hạt nhân này có bao nhiêu proton, bao nhiêu neutron và tổng số nucleon là bao nhiêu?",
            expectedAnswer: "Số proton Z = 92. Số nucleon (số khối) A = 235. Số neutron N = A - Z = 235 - 92 = 143 neutron.",
          },
          {
            id: 2,
            instruction: "Khái niệm đồng vị",
            prompt: "Đồng vị là gì? Cho ví dụ về các đồng vị của nguyên tố Hydro trong tự nhiên?",
            expectedAnswer: "Đồng vị là các nguyên tử có cùng số proton Z nhưng khác số neutron N (dẫn đến số khối A khác nhau). 3 đồng vị của Hydro: Hydro thường (^1_1 H), Đơteri (^2_1 H hay D), Triti (^3_1 H hay T).",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh hay nhầm lẫn lực liên kết giữa các nucleon trong hạt nhân là lực hút tĩnh điện hoặc hấp dẫn. Cần nhấn mạnh: Đó là LỰC HẠT NHÂN (tương tác mạnh), có bán kính tác dụng cực ngắn (~ 10^-15 m) và mạnh hơn lực đẩy Coulomb hàng trăm lần.",
        ],
        pedagogicalAdvice: [
          "Dùng kĩ thuật KWL: K (em đã biết gì về nguyên tử từ Hóa học), W (muốn tìm hiểu lực gì giữ hạt nhân), L (đã học được về lực hạt nhân và đồng vị).",
        ],
        differentiationPrompts: {
          support: "Số khối A bằng tổng của những hạt nào?",
          advanced: "Tại sao các hạt nhân nặng (A > 200) thường có số neutron N lớn hơn nhiều so với số proton Z?",
        },
      },
    },
  },
  {
    id: "vl12-hien-tuong-phong-xa",
    grade: 12,
    chapterNumber: 4,
    chapterTitle: "Chương IV: Vật lí hạt nhân",
    lessonNumber: 23,
    lessonTitle: "Bài 23: Hiện tượng phóng xạ",
    estimatedPeriods: 4,
    ppctSessions: "Tiết 83-86",
    durationDisplay: "4 tiết (180 phút)",
    standardCurriculumCode: "VL12.KNTT.B23",
    digitalCompetencies: ["1.2.NC1a", "5.3.NC1b", "3.1.NC1b"],
    experiments: ["Mô phỏng quan sát tia phóng xạ trong buồng mây Wilson và khảo sát chu kì bán rã"],
    assessmentRubricId: "rubric-presentation",
    defaultActivity: {
      id: "act-vl12-b23",
      activityTitle: "Hoạt động: Khảo sát định luật phóng xạ, chu kì bán rã & Ứng dụng an toàn bức xạ (Thời lượng: 4 tiết - 180 phút)",
      durationMinutes: 180,
      objectives: {
        knowledge: [
          "Nêu được bản chất tự phát và ngẫu nhiên của sự phân rã phóng xạ.",
          "Mô tả được tính chất của các tia phóng xạ alpha, beta (trừ và cộng) và gamma.",
          "Phát biểu và vận dụng định luật phóng xạ: N(t) = N0.e^(-lambda.t) = N0.2^(-t/T).",
          "Nêu được các nguyên tắc an toàn phóng xạ và nhận diện biển báo cảnh báo phóng xạ.",
        ],
        physicsCompetencies: [
          "Mô phỏng buồng mây Wilson quan sát vệt đường đi của các tia alpha và beta.",
          "Vận dụng chu kì bán rã của Cacbon 14 (^14_6 C) để tính tuổi của cổ vật khảo cổ học.",
        ],
        generalCompetencies: ["Năng lực tìm kiếm, đánh giá nguồn tài liệu khoa học về y học hạt nhân và năng lượng điện nguyên tử."],
        digitalCompetencies: ["Vẽ đồ thị suy giảm phóng xạ hàm mũ trên phần mềm máy tính."],
        qualities: ["Ý thức trách nhiệm xã hội, tuân thủ nghiêm ngặt quy tắc an toàn bức xạ."],
      },
      content: "Tìm hiểu hiện tượng phóng xạ tự nhiên, phân loại 3 loại tia phóng xạ chính (alpha, beta, gamma). Xây dựng định luật phân rã phóng xạ, chu kì bán rã T = ln2 / lambda và khảo sát các ứng dụng trong y học (xạ trị), nông nghiệp và khảo cổ học.",
      product: "Bài trình bày chuyên đề về ứng dụng và tác hại của phóng xạ kèm bài giải bài toán định tuổi khảo cổ học bằng Cacbon 14.",
      implementation: {
        step1_transfer: "Tình huống xuất phát (15 phút): Các nhà khảo cổ tìm thấy một chiếc thuyền gỗ cổ dưới đáy biển, làm thế nào để biết chính xác chiếc thuyền đó được đóng từ thời Lý hay thời Trần cách đây hàng trăm năm?",
        step2_execution: "Nghiên cứu định luật và làm việc nhóm (90 phút): Học sinh quan sát vết tia trong buồng mây ảo; phân biệt khả năng đâm xuyên của hạt alpha (bị chặn bởi tờ giấy), hạt beta (bị chặn bởi nhôm mỏng) và tia gamma (cần tấm chì dày); thiết lập công thức N(t) = N0.2^(-t/T); giải bài tập xác định tuổi cổ vật; làm việc nhóm nghiên cứu ứng dụng xạ trị ung thư.",
        step3_discussion: "Thuyết trình và tranh biện (45 phút): Các nhóm thuyết trình về các chủ đề: Nhóm 1 - Tia phóng xạ trong chẩn đoán và điều trị y tế; Nhóm 2 - Phương pháp định tuổi Cacbon 14; Nhóm 3 - Thảm họa Chernobyl / Fukushima và an toàn điện hạt nhân.",
        step4_conclusion: "Chuẩn hóa và kết luận (30 phút): Giáo viên hệ thống hóa: Phóng xạ là quá trình hạt nhân tự biến đổi không phụ thuộc yếu tố bên ngoài (nhiệt độ, áp suất); chốt công thức định luật; hướng dẫn quy tắc khoảng cách và che chắn an toàn.",
      },
      studentWorksheet: {
        title: "PHIẾU HỌC TẬP: ĐỊNH LUẬT PHÓNG XẠ & ĐỊNH TUỔI CỔ VẬT",
        code: "PHT-VL12-B23",
        tasks: [
          {
            id: 1,
            instruction: "Phân biệt 3 loại tia phóng xạ",
            prompt: "Hoàn thành bảng so sánh tia alpha, beta, gamma về: Bản chất, Điện tích, Khả năng đâm xuyên và Độ ion hóa môi trường?",
            expectedAnswer: "Alpha: dòng hạt nhân He-4, điện tích +2e, đâm xuyên yếu (tờ giấy chặn được), ion hóa rất mạnh. Beta: dòng electron (-e) hoặc positron (+e), đâm xuyên vừa (nhôm 2-3 mm), ion hóa vừa. Gamma: sóng điện từ bước sóng cực ngắn (photon năng lượng cao), không mang điện, đâm xuyên cực mạnh (cần lớp chì dày), ion hóa yếu.",
          },
          {
            id: 2,
            instruction: "Bài toán định tuổi khảo cổ",
            prompt: "Chất phóng xạ Cacbon 14 có chu kì bán rã T = 5730 năm. Một mẫu gỗ cổ có độ phóng xạ bằng 25% độ phóng xạ của mẫu gỗ tươi cùng khối lượng. Tính tuổi của mẫu gỗ cổ đó?",
            expectedAnswer: "Ta có H / H0 = 25% = 1/4 = (1/2)^2 => t / T = 2 => t = 2 * T = 2 * 5730 = 11460 năm. Cổ vật có tuổi thọ khoảng 11460 năm.",
          },
        ],
      },
      teacherGuideNotes: {
        commonMisconceptions: [
          "Học sinh ngộ nhận rằng có thể dùng nhiệt độ cao hoặc áp suất cực lớn để đẩy nhanh quá trình phân rã phóng xạ nhằm tiêu hủy rác thải hạt nhân. Cần nhấn mạnh: Tốc độ phân rã phóng xạ hoàn toàn độc lập với mọi tác nhân hóa học, vật lí bên ngoài!",
        ],
        pedagogicalAdvice: [
          "Sử dụng Rubric Đánh giá Báo cáo Thuyết trình & Tranh luận Khoa học để học sinh chấm chéo các bài thuyết trình chuyên đề của nhóm bạn.",
        ],
        differentiationPrompts: {
          support: "Sau 1 chu kì bán rã thì số hạt nhân phóng xạ còn lại bao nhiêu phần trăm?",
          advanced: "Nếu một chất phóng xạ có chu kì bán rã 1 ngày, thì sau 10 ngày lượng phóng xạ còn lại có hoàn toàn bằng 0 không? Viết biểu thức giới hạn khi t tiến tới vô cùng?",
        },
      },
    },
  },
];

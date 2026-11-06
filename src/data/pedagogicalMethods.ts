/**
 * Cẩm nang & Dữ liệu Hệ thống Phương pháp Dạy học Vật lí Phổ thông
 * Căn cứ theo:
 * 1. Tập bài giảng "Lí luận dạy học Vật lí phổ thông" - PGS.TS Lương Thế Dũng, TS. Dương Diệp Thanh Hiền (ĐH Quy Nhơn, 2022)
 * 2. Phân loại PPDH, Mô hình, Hình thức và Kĩ thuật dạy học tích cực (CV 5512/BGDĐT & CT GDPT 2018)
 * 3. Hướng dẫn áp dụng linh hoạt cho Hoạt động Hình thành Kiến thức mới
 */

export interface PedagogicalMethodItem {
  id: string;
  name: string;
  shortName: string;
  category: "Nhận thức Vật lí đặc thù" | "Mô hình Dạy học Hiện đại" | "Dạy học Tích hợp & Kĩ thuật";
  badge: string;
  iconName: string;
  summary: string;
  sourceDoc: string; // Trích dẫn sách LLDH hoặc nguồn tài liệu
  natureAndRationale: string; // Bản chất & cơ sở lí luận
  steps: {
    number: number;
    title: string;
    description: string;
    teacherAction: string;
    studentAction: string;
    suitableTechnique: string;
  }[];
  suitableLessonTypes: string[]; // Khái niệm, Định luật, Thuyết, Ứng dụng kĩ thuật
  problemSituationType: string; // Tình huống phát triển, bế tắc, ngạc nhiên bất ngờ, lạ, lựa chọn
  exampleApplicationLesson: {
    lessonTitle: string;
    grade: number;
    scenario: string;
    demonstrationGuide: string;
  };
  keyAdvantages: string[];
}

export interface TeachingTechniqueItem {
  id: string;
  name: string;
  tag: string;
  description: string;
  steps: string[];
  roleIn5512: "Chuyển giao" | "Thực hiện nhiệm vụ" | "Báo cáo thảo luận" | "Kết luận chuẩn hóa";
}

export interface ProblemSituationType {
  id: string;
  name: string;
  definition: string;
  physicsExample: string;
  pedagogicalEffect: string;
}

export const PROBLEM_SITUATION_TYPES: ProblemSituationType[] = [
  {
    id: "situation-surprise",
    name: "Tình huống Ngạc nhiên - Bất ngờ (Nghịch lí)",
    definition: "HS đứng trước một hiện tượng xảy ra theo chiều hướng trái ngược với suy nghĩ trực giác thông thường (có tính chất nghịch lí, khó tin là có thật), kích thích mạnh mẽ tính tò mò, bắt buộc HS phải thay đổi hoặc bổ sung quan niệm cũ sai lầm.",
    physicsExample: "Ví dụ: Thí nghiệm con cá nhỏ vẫn bơi lội khỏe mạnh ở đáy ống nghiệm nước trong khi mặt nước phía trên miệng ống đang sôi sùng sục trên ngọn lửa đèn cồn; hoặc quả bóng bay lơ lửng ổn định ngay trong luồng gió thổi nghiêng của máy sấy (Định luật Bernoulli).",
    pedagogicalEffect: "Gây sốc nhận thức, phá vỡ 'vùng an toàn' của kinh nghiệm cảm tính, tạo động lực nội tại cực mạnh để đi tìm bản chất vật lí."
  },
  {
    id: "situation-deadlock",
    name: "Tình huống Bế tắc",
    definition: "HS đứng trước một hiện tượng vẫn thường gặp hàng ngày nhưng không giải thích được vì sao, coi như một bí mật tự nhiên. Khi được giao nhiệm vụ giải thích thì không biết dựa vào đâu vì vốn kiến thức cũ hoàn toàn bất lực.",
    physicsExample: "Ví dụ: Hiện tượng chiếc đũa cắm vào cốc nước trông như bị gãy khúc ở mặt phân cách nước - không khí; chiếc đồng hồ quả lắc đung đưa đều đặn qua hàng chục năm nhưng nếu không có quả tạ/dây cót thì chỉ đung đưa vài phút là dừng hẳn.",
    pedagogicalEffect: "Làm bộc lộ rõ ranh giới giữa điều đã biết và điều chưa biết, khẳng định nhu cầu cấp thiết phải xây dựng kiến thức hoặc định luật mới."
  },
  {
    id: "situation-choice",
    name: "Tình huống Lựa chọn",
    definition: "HS đứng trước vấn đề có nhiều phương pháp hoặc nhiều kiến thức đã biết có thể áp dụng, nhưng chưa chắc chắn phương pháp nào sẽ mang lại kết quả chắc chắn và tối ưu. HS buộc phải so sánh, lựa chọn và kiểm chứng.",
    physicsExample: "Ví dụ: Khi khảo sát va chạm hai vật (Bài 29 Vật lí 10), HS phân vân lựa chọn giữa việc dùng định luật II Newton (vận tốc biến thiên phức tạp) hay dùng phương pháp thực nghiệm đệm khí để tìm đại lượng bảo toàn.",
    pedagogicalEffect: "Rèn luyện tư duy phê phán, khả năng lập luận đối chiếu và xây dựng giả thuyết có cơ sở khoa học."
  },
  {
    id: "situation-development",
    name: "Tình huống Phát triển",
    definition: "HS đứng trước một vấn đề đã được giải quyết một phần trong phạm vi hẹp, cần tiếp tục phát triển, hoàn thiện và mở rộng sang phạm vi mới mà kiến thức cũ không còn đủ sức bao quát.",
    physicsExample: "Ví dụ: Khái niệm vận tốc v đủ để mô tả chuyển động thẳng đều, nhưng khi vận tốc thay đổi liên tục theo thời gian thì cần mở rộng xây dựng khái niệm mới là 'Gia tốc a = Δv/Δt'.",
    pedagogicalEffect: "Giúp HS thấy được tính vận động liên tục, phát triển của các khái niệm và định luật vật lí trong lịch sử khoa học."
  },
  {
    id: "situation-novelty",
    name: "Tình huống Lạ",
    definition: "HS đứng trước một hiện tượng lạ có những nét đặc biệt lôi cuốn sự chú ý mà các em chưa từng thấy bao giờ trong đời sống thường ngày.",
    physicsExample: "Ví dụ: Hình ảnh từ phổ 3D của các đường cảm ứng từ phát sáng đâm xuyên qua khung dây quay, hoặc hiện tượng siêu dẫn làm nam châm lơ lửng không gian.",
    pedagogicalEffect: "Kích thích hứng thú thẩm mĩ và niềm đam mê nghiên cứu khám phá thế giới tự nhiên."
  }
];

export const TEACHING_TECHNIQUES: TeachingTechniqueItem[] = [
  {
    id: "placemat",
    name: "Kĩ thuật Khăn trải bàn (Placemat)",
    tag: "Làm việc nhóm tích cực",
    description: "Kĩ thuật tổ chức hoạt động nhóm kết hợp giữa làm việc cá nhân độc lập và tổng hợp ý kiến tập thể trên một tờ giấy A0/A1 chia thành 4 góc cá nhân và 1 ô trung tâm.",
    steps: [
      "Bước 1: Mỗi thành viên ngồi ở một góc giấy, suy nghĩ độc lập và viết ý kiến/kết quả cá nhân vào phần góc của mình (không trao đổi trong 3-5 phút).",
      "Bước 2: Cả nhóm lần lượt chia sẻ ý kiến cá nhân, thảo luận, phản biện và thống nhất câu trả lời chung ghi vào ô trung tâm.",
      "Bước 3: Đại diện nhóm trình bày sản phẩm ô trung tâm trước lớp."
    ],
    roleIn5512: "Thực hiện nhiệm vụ"
  },
  {
    id: "jigsaw",
    name: "Kĩ thuật Các mảnh ghép (Jigsaw)",
    tag: "Chuyên sâu & Chia sẻ",
    description: "Chia lớp thành 'Nhóm chuyên gia' (mỗi nhóm nghiên cứu sâu 1 khía cạnh) rồi tái lập thành 'Nhóm mảnh ghép' (mỗi thành viên mang kiến thức chuyên gia về truyền đạt lại cho bạn).",
    steps: [
      "Vòng 1 (Nhóm chuyên gia): Nhóm 1 tính Wđ, Nhóm 2 tính Wt, Nhóm 3 tính cơ năng W, Nhóm 4 phân tích cơ cấu bánh răng thoát.",
      "Vòng 2 (Nhóm mảnh ghép): Mỗi nhóm mới gồm đủ đại diện từ nhóm 1, 2, 3, 4. Các thành viên lần lượt chia sẻ để cả nhóm hoàn thiện bức tranh toàn cảnh."
    ],
    roleIn5512: "Thực hiện nhiệm vụ"
  },
  {
    id: "think-pair-share",
    name: "Kĩ thuật Chia sẻ nhóm đôi (Think - Pair - Share)",
    tag: "Tương tác nhanh",
    description: "Tiến trình 3 nhịp: Suy nghĩ cá nhân (Think: 1-2 phút) -> Ghép đôi thảo luận (Pair: 2-3 phút) -> Chia sẻ trước lớp (Share: 3-5 phút).",
    steps: [
      "Think: HS độc lập giải câu hỏi/tính toán số liệu trên mô phỏng.",
      "Pair: Quay sang bạn cùng bàn đối chiếu kết quả, phát hiện chỗ sai lệch.",
      "Share: GV gọi ngẫu nhiên một số cặp báo cáo và chất vấn."
    ],
    roleIn5512: "Báo cáo thảo luận"
  },
  {
    id: "gallery-walk",
    name: "Kĩ thuật Phòng tranh (Gallery Walk)",
    tag: "Trưng bày & Nhận xét chéo",
    description: "Các nhóm dán sản phẩm (sơ đồ tư duy, phiếu học tập, bản thiết kế kĩ thuật) quanh lớp học như một phòng triển lãm tranh. HS di chuyển tham quan và dán giấy ghi chú (Sticker) nhận xét.",
    steps: [
      "Các nhóm treo sản phẩm lên tường quanh phòng học.",
      "Cả lớp di chuyển theo chiều kim đồng hồ, đọc và dán giấy ghi chú khen ngợi/góp ý/đặt câu hỏi.",
      "Nhóm quay về vị trí, đọc phản hồi của các bạn và giải trình trước lớp."
    ],
    roleIn5512: "Báo cáo thảo luận"
  },
  {
    id: "brainstorming",
    name: "Kĩ thuật Động não (Brainstorming)",
    tag: "Khởi động & Nêu ý tưởng",
    description: "Thu thập tối đa các ý kiến, giả thuyết, phương án giải quyết vấn đề trong thời gian ngắn mà không vội vàng phán xét đúng/sai.",
    steps: [
      "GV nêu câu hỏi vấn đề: 'Có những cách nào để kiểm chứng bảo toàn cơ năng?'",
      "HS tự do phát biểu nhanh các ý tưởng, GV hoặc thư kí ghi hết lên bảng.",
      "Cả lớp phân loại, đánh giá và chọn lọc những ý tưởng khả thi nhất."
    ],
    roleIn5512: "Chuyển giao"
  },
  {
    id: "one-minute-paper",
    name: "Kĩ thuật Trình bày một phút (One-Minute Paper)",
    tag: "Đánh giá nhanh cuối bài",
    description: "Vào cuối hoạt động hoặc cuối tiết học, HS viết ngắn gọn trong 1 phút lên mẩu giấy: 'Điều quan trọng nhất em học được hôm nay là gì?' và 'Điều gì em vẫn còn thắc mắc chưa hiểu?'.",
    steps: [
      "GV phát mẩu giấy nhỏ hoặc chiếu form điện tử.",
      "HS có đúng 60 giây để ghi lại điểm mấu chốt và câu hỏi băn khoăn.",
      "GV thu nhận để điều chỉnh tiến trình cho tiết học sau."
    ],
    roleIn5512: "Kết luận chuẩn hóa"
  },
  {
    id: "mindmap",
    name: "Kĩ thuật Lược đồ tư duy (Mindmap)",
    tag: "Hệ thống hóa kiến thức",
    description: "Sử dụng từ khóa, hình vẽ, màu sắc và các nhánh nối để khái quát hóa toàn bộ mối quan hệ giữa các đại lượng vật lí và định luật.",
    steps: [
      "Từ khóa trung tâm ở giữa (VD: CƠ NĂNG W).",
      "Các nhánh cấp 1: Động năng (Wđ), Thế năng (Wt), Định luật bảo toàn, Điều kiện áp dụng, Ứng dụng con lắc đồng hồ.",
      "Các nhánh cấp 2: Công thức, đơn vị, sự chuyển hóa, hao phí do ma sát."
    ],
    roleIn5512: "Kết luận chuẩn hóa"
  },
  {
    id: "xyz-technique",
    name: "Kĩ thuật XYZ (6-3-5 / 3-2-1)",
    tag: "Sáng tạo ý tưởng nhóm",
    description: "X người trong nhóm, mỗi người viết Y ý tưởng trong Z phút, sau đó chuyền giấy cho bạn bên cạnh tiếp tục phát triển ý tưởng.",
    steps: [
      "Ví dụ 3-2-1: Nhóm 3 bạn, mỗi bạn viết 2 giải pháp giảm ma sát trong 1 phút.",
      "Chuyền phiếu xoay vòng để bạn đọc và bổ sung ý tưởng mới.",
      "Tổng kết phiếu sau 3 lượt xoay."
    ],
    roleIn5512: "Thực hiện nhiệm vụ"
  }
];

export const PEDAGOGICAL_METHODS: PedagogicalMethodItem[] = [
  // 1. GQVĐ (CHUẨN LLDH VẬT LÍ QUY NHƠN 2022)
  {
    id: "gqvd_reasoning_exp",
    name: "Dạy học Phát hiện & Giải quyết vấn đề (GQVĐ)",
    shortName: "Nêu & GQVĐ",
    category: "Nhận thức Vật lí đặc thù",
    badge: "LLDH Vật lí Quy Nhơn 2022 (tr.56-65)",
    iconName: "Compass",
    summary: "Xây dựng tình huống có vấn đề -> Suy luận toán học thiết lập quy luật lí thuyết -> Thiết kế phương án thực nghiệm kiểm chứng trên mô phỏng số -> Rút ra kết luận khoa học.",
    sourceDoc: "Giáo trình Lí luận Dạy học Vật lí phổ thông (Lương Thế Dũng – Dương Diệp Thanh Hiền, ĐH Quy Nhơn 2022, tr. 18-20, 56-65).",
    natureAndRationale: "Bản chất là mô phỏng chu trình nhận thức khoa học của nhà vật lí: Đi từ mâu thuẫn nhận thức thực tiễn -> đề xuất giả thuyết/mô hình lí thuyết bằng toán học -> suy ra hệ quả quan sát được -> dùng thí nghiệm kiểm chứng hệ quả -> thể chế hóa thành định luật chân lí khách quan.",
    steps: [
      {
        number: 1,
        title: "Đặt vấn đề xây dựng bài toán nhận thức",
        description: "Tạo tình huống có vấn đề, làm xuất hiện mâu thuẫn nhận thức và kích thích nhu cầu tìm tòi.",
        teacherAction: "Trình chiếu hiện tượng con lắc đồng hồ đung đưa không mỏi nhưng con lắc thật bị dừng nhanh chóng nếu không có quả tạ; đặt câu hỏi trung tâm: 'Đại lượng nào bảo toàn và vì sao cần bánh răng thoát?'.",
        studentAction: "Quan sát, bộc lộ trực giác ban đầu, nhận ra mâu thuẫn giữa bảo toàn năng lượng và dao động tắt dần trong thực tế.",
        suitableTechnique: "Kĩ thuật Động não / Think-Pair-Share"
      },
      {
        number: 2,
        title: "Giải quyết vấn đề bằng suy luận lí thuyết (suy luận toán học)",
        description: "Xuất phát từ các kiến thức nền tảng (định lí động năng, công của lực thế) để chứng minh đẳng thức bảo toàn W1 = W2.",
        teacherAction: "Gợi ý: Lực căng T vuông góc với v nên sinh công bằng bao nhiêu? Hãy đồng nhất công của trọng lực với độ biến thiên động năng.",
        studentAction: "Thực hiện các bước biến đổi toán học: AP = Wđ2 - Wđ1 = Wt1 - Wt2 => Wđ1 + Wt1 = Wđ2 + Wt2 = const.",
        suitableTechnique: "Kĩ thuật Khăn trải bàn (Placemat)"
      },
      {
        number: 3,
        title: "Kiểm nghiệm kết quả lí thuyết bằng thí nghiệm mô phỏng",
        description: "Vận hành thí nghiệm ảo để đo đạc định lượng h, v, tính Wđ, Wt, W và đánh giá sai số thực nghiệm.",
        teacherAction: "Hướng dẫn HS dùng công tắc ẩn số liệu sư phạm để tự tính toán trước trên vở, sau đó bật số liệu ảo để kiểm chứng.",
        studentAction: "Thao tác trên mô phỏng số, thu thập số liệu vào bảng, tính sai số tương đối delta < 0,1%, kiểm chứng W = const.",
        suitableTechnique: "Làm việc nhóm thực hành số"
      },
      {
        number: 4,
        title: "Rút ra kết luận & Thể chế hóa kiến thức mới",
        description: "Khẳng định giả thuyết lí thuyết đã được thực nghiệm xác nhận là chân lí; mở rộng giải thích cơ chế bánh răng thoát.",
        teacherAction: "Chốt lại phát biểu định luật, hệ quả v_max = sqrt(2gh0), và phân tích xung lực cấp năng lượng của cơ cấu escapement.",
        studentAction: "Ghi nhận kiến thức chuẩn hóa, vẽ sơ đồ tư duy liên hệ thực tế (đồng hồ Big Ben, tàu lượn siêu tốc).",
        suitableTechnique: "Kĩ thuật Lược đồ tư duy / One-minute paper"
      }
    ],
    suitableLessonTypes: ["Định luật bảo toàn cơ năng", "Định luật bảo toàn động lượng", "Định luật II Newton", "Định luật Faraday"],
    problemSituationType: "Tình huống bế tắc & Nghịch lí ngạc nhiên",
    exampleApplicationLesson: {
      lessonTitle: "Bài 26: Cơ năng và định luật bảo toàn cơ năng (Lớp 10)",
      grade: 10,
      scenario: "Chiếc đồng hồ quả lắc gia truyền chạy chính xác hàng chục năm nhưng tháo quả tạ thì tắt dần sau vài phút.",
      demonstrationGuide: "Sử dụng tính năng Công tắc ẩn/hiện số liệu để HS tự tính toán W trên giấy trước khi cho chạy mô phỏng đối chiếu."
    },
    keyAdvantages: [
      "Rèn luyện tư duy biện giải lôgic toán học kết hợp tư duy thực nghiệm chặt chẽ.",
      "Học sinh tự mình làm ra kiến thức (tái tạo chân lí) chứ không tiếp thu thụ động.",
      "Phù hợp tuyệt đối với cấu trúc 4 bước của Công văn 5512/BGDĐT."
    ]
  },

  // 2. MÔ HÌNH 5E (ENGAGE - EXPLORE - EXPLAIN - ELABORATE - EVALUATE)
  {
    id: "model_5e",
    name: "Mô hình Dạy học 5E (Chuẩn Quốc tế & GDPT 2018)",
    shortName: "Mô hình 5E",
    category: "Mô hình Dạy học Hiện đại",
    badge: "Mô hình BSCS 5E (Bybee et al.)",
    iconName: "Layers",
    summary: "5 pha tương tác liên tục: Gắn kết (Engage) -> Khám phá (Explore) -> Giải thích (Explain) -> Áp dụng mở rộng (Elaborate) -> Đánh giá (Evaluate).",
    sourceDoc: "Bộ sách GDPT 2018 (SGK Cánh Diều & Kết nối tri thức); BSCS 5E Instructional Model.",
    natureAndRationale: "Dựa trên thuyết kiến tạo (Constructivism): Người học chủ động xây dựng kiến thức mới dựa trên trải nghiệm thực tiễn và vốn kinh nghiệm sẵn có thông qua chu trình 5 pha rõ ràng, lấy học sinh làm trung tâm.",
    steps: [
      {
        number: 1,
        title: "1. Gắn kết (Engage)",
        description: "Tạo sự chú ý, kết nối kinh nghiệm thực tế và khơi gợi câu hỏi khám phá.",
        teacherAction: "Chiếu video con lắc đồng hồ cổ và clip xích đu; nêu câu hỏi kích thích: 'Khi em bay lên cao nhất trên xích đu thì năng lượng là gì? Lao xuống thấp nhất thì cảm thấy thế nào?'.",
        studentAction: "Chia sẻ trải nghiệm thực tế khi chơi xích đu và quan sát đồng hồ quả lắc ở gia đình.",
        suitableTechnique: "Kĩ thuật Động não (Brainstorming)"
      },
      {
        number: 2,
        title: "2. Khám phá (Explore)",
        description: "Học sinh trực tiếp tương tác, thao tác kéo thả và đo đạc trên phòng thí nghiệm ảo.",
        teacherAction: "Giao nhiệm vụ: Mở mô phỏng con lắc số, kéo góc biên 45°, quan sát thanh năng lượng xanh (Wđ) và lam (Wt) biến thiên.",
        studentAction: "Tự do khám phá trên máy tính bảng/laptop, ghi nhận sự tăng giảm trái ngược giữa động năng và thế năng.",
        suitableTechnique: "Thực hành khám phá theo nhóm"
      },
      {
        number: 3,
        title: "3. Giải thích (Explain)",
        description: "Học sinh sử dụng ngôn ngữ vật lí để giải thích bản chất hiện tượng; giáo viên chuẩn hóa kiến thức cốt lõi.",
        teacherAction: "Tổ chức cho các nhóm báo cáo nhận xét: 'Tại sao tổng hai thanh năng lượng lại luôn bằng đúng thanh màu vàng không đổi?'.",
        studentAction: "Phát biểu quy luật: Thế năng giảm bao nhiêu thì động năng tăng bấy nhiêu; tổng W = Wđ + Wt luôn bằng hằng số.",
        suitableTechnique: "Kĩ thuật Khăn trải bàn & Báo cáo đại diện"
      },
      {
        number: 4,
        title: "4. Áp dụng mở rộng (Elaborate)",
        description: "Vận dụng kiến thức vào bối cảnh mới phức tạp hơn: Lực cản không khí và cơ chế kĩ thuật Escapement của đồng hồ.",
        teacherAction: "Yêu cầu HS chuyển sang tab Bánh răng thoát (Escapement) và chế độ Có lực cản để tính năng lượng bù hao phí Delta W.",
        studentAction: "Khám phá cách quả tạ treo nhả xung năng lượng ở mỗi nhịp gõ tích tắc, giải bài toán đồng hồ chạy 1 tuần mới cần lên dây cót.",
        suitableTechnique: "Kĩ thuật Các mảnh ghép (Jigsaw)"
      },
      {
        number: 5,
        title: "5. Đánh giá (Evaluate)",
        description: "Đánh giá sự tiến bộ của học sinh qua bài tập trắc nghiệm năng lực và tự đánh giá bản thân.",
        teacherAction: "Cung cấp hệ thống 5 câu hỏi trắc nghiệm năng lực trực tiếp trên tab Luyện tập của app.",
        studentAction: "Làm bài kiểm tra tương tác, xem phản hồi giải thích chi tiết và tự điều chỉnh nhận thức.",
        suitableTechnique: "Kĩ thuật Trình bày một phút (One-minute paper)"
      }
    ],
    suitableLessonTypes: ["Tất cả các bài học hình thành kiến thức mới Vật lí 10 & 11"],
    problemSituationType: "Tình huống phát triển & Tình huống lạ",
    exampleApplicationLesson: {
      lessonTitle: "Bài 26: Cơ năng và định luật bảo toàn cơ năng",
      grade: 10,
      scenario: "Khám phá sự chuyển hóa năng lượng trên xích đu và con lắc đồng hồ qua mô hình 5 pha liên hoàn.",
      demonstrationGuide: "Pha Explore cho HS kéo thả con lắc ở nhiều góc khác nhau; Pha Elaborate cho HS quan sát bánh răng thoát."
    },
    keyAdvantages: [
      "Quy trình sư phạm mạch lạc, tự nhiên, tạo cơ hội tối đa cho học sinh tự trải nghiệm và rút ra kiến thức.",
      "Dễ áp dụng với giáo viên dạy học tích cực theo sách giáo khoa mới CT 2018.",
      "Tích hợp xuất sắc giữa thí nghiệm ảo trực quan và đánh giá định dạng thường xuyên."
    ]
  },

  // 3. PHƯƠNG PHÁP BÀN TAY NẶN BỘT (HANDS-ON / LA MAIN À LA PÂTE)
  {
    id: "hands_on_charpak",
    name: "Phương pháp Bàn tay nặn bột (Hands-on / La main à la pâte)",
    shortName: "Bàn tay nặn bột",
    category: "Mô hình Dạy học Hiện đại",
    badge: "Georges Charpak (Giải Nobel Vật lí)",
    iconName: "Hand",
    summary: "5 bước kinh điển: Tình huống xuất phát -> Bộc lộ biểu tượng ban đầu của HS -> Đề xuất phương án thực nghiệm -> Tiến hành thí nghiệm tìm tòi -> Kết luận và hợp thức hóa kiến thức.",
    sourceDoc: "Phương pháp Bàn tay nặn bột trong dạy học các môn Khoa học (Bộ GD&ĐT); Sách LLDH Vật lí tr. 32-34.",
    natureAndRationale: "Học sinh không tiếp nhận kiến thức như chân lí có sẵn từ giáo viên hay sách giáo khoa, mà bắt đầu từ những quan niệm ngây thơ ban đầu (biểu tượng ban đầu), tự mình tranh luận, đặt câu hỏi nghiên cứu, tự đề xuất thí nghiệm kiểm chứng để tự 'uốn nắn' lại tư duy của chính mình.",
    steps: [
      {
        number: 1,
        title: "Bước 1: Tình huống xuất phát và câu hỏi nêu vấn đề",
        description: "GV đưa ra hiện tượng mở đầu gần gũi và khơi gợi câu hỏi nghiên cứu.",
        teacherAction: "Treo một quả cầu sắt vào sợi dây tạo thành con lắc, kéo lệch rồi thả nhẹ. Nêu câu hỏi: 'Khi quả lắc đung đưa, năng lượng của nó thay đổi thế nào?'.",
        studentAction: "Quan sát chuyển động thực tế của con lắc, tập trung chú ý vào vị trí cao nhất và vị trí thấp nhất.",
        suitableTechnique: "Kĩ thuật Hỏi và trả lời (Q&A)"
      },
      {
        number: 2,
        title: "Bước 2: Bộc lộ biểu tượng ban đầu của học sinh",
        description: "Học sinh vẽ/viết vào vở thực hành những suy nghĩ tự nhiên ban đầu (dù đúng hay sai) mà không sợ bị chấm điểm.",
        teacherAction: "Yêu cầu: 'Các em hãy vẽ vào vở sơ đồ con lắc tại 3 vị trí (biên trái, VTCB, biên phải) và ghi dự đoán năng lượng dạng nào lớn nhất, có bị mất đi không?'.",
        studentAction: "Vẽ hình vào vở, ghi dự đoán: 'Ở trên cao thế năng lớn nhất', 'Ở dưới thấp vận tốc lớn nhất', 'Cơ năng có thể bị mất dần do ma sát'.",
        suitableTechnique: "Kĩ thuật Vẽ tranh phác thảo / Ghi chép cá nhân"
      },
      {
        number: 3,
        title: "Bước 3: Đề xuất câu hỏi nghiên cứu và phương án thí nghiệm",
        description: "Từ những bất đồng trong biểu tượng ban đầu, HS đề xuất câu hỏi khoa học và cách bố trí đo đạc.",
        teacherAction: "Tập hợp các ý kiến trái chiều lên bảng. Hỏi: 'Làm thế nào để đo chính xác xem cơ năng có thực sự bằng nhau ở mọi vị trí hay không?'.",
        studentAction: "Đề xuất phương án: Cần đo độ cao h để tính Wt = mgh, cần đo vận tốc v qua cảm biến để tính Wđ = 1/2mv^2, rồi cộng lại so sánh.",
        suitableTechnique: "Kĩ thuật Động não (Brainstorming)"
      },
      {
        number: 4,
        title: "Bước 4: Tiến hành thí nghiệm tìm tòi - khám phá",
        description: "Học sinh vận hành thí nghiệm ảo trên app, thu thập dữ liệu khách quan để kiểm tra biểu tượng ban đầu.",
        teacherAction: "Cung cấp phần mềm mô phỏng con lắc số PhysLab; bao quát lớp và gợi ý HS tắt số liệu để tự tính trước khi đối chiếu.",
        studentAction: "Thực hiện phép đo tại 3 vị trí, lập bảng số liệu, nhận thấy W1 = W2 = W3 = const, loại bỏ những ngộ nhận sai ban đầu.",
        suitableTechnique: "Làm việc nhóm trên phòng thí nghiệm số"
      },
      {
        number: 5,
        title: "Bước 5: Kết luận và hợp thức hóa kiến thức",
        description: "Đối chiếu kết quả thí nghiệm với biểu tượng ban đầu ở Bước 2, phát biểu định luật khoa học chính xác.",
        teacherAction: "Hướng dẫn HS so sánh lại hình vẽ ở Bước 2 với kết quả thực nghiệm; chốt lại nội dung Định luật bảo toàn cơ năng theo chuẩn SGK.",
        studentAction: "Tự sửa lại những ghi chép sai ban đầu trong vở, ghi nhớ định luật bảo toàn và điều kiện chỉ có lực thế tác dụng.",
        suitableTechnique: "Kĩ thuật Trình bày một phút & Tổng kết cá nhân"
      }
    ],
    suitableLessonTypes: ["Khảo sát con lắc & Cơ năng", "Định luật bảo toàn động lượng", "Cảm ứng điện từ", "Khúc xạ ánh sáng"],
    problemSituationType: "Tình huống bế tắc & Bộc lộ quan niệm sai",
    exampleApplicationLesson: {
      lessonTitle: "Bài 26: Cơ năng và định luật bảo toàn cơ năng",
      grade: 10,
      scenario: "Học sinh tự vẽ phác thảo biểu tượng ban đầu về năng lượng con lắc vào vở trước khi mở mô phỏng số.",
      demonstrationGuide: "Bước 2 yêu cầu HS vẽ biểu tượng ban đầu vào vở; Bước 4 dùng mô phỏng kiểm chứng; Bước 5 tự đối chiếu chỉnh sửa."
    },
    keyAdvantages: [
      "Khắc phục triệt để các quan niệm sai lầm (misconceptions) bám rễ sâu trong suy nghĩ học sinh.",
      "Hình thành tác phong khoa học: Tôn trọng sự thật khách quan của thực nghiệm.",
      "Học sinh cực kì hào hứng vì được tự mình đề xuất cách làm và tự kiểm chứng suy nghĩ cá nhân."
    ]
  },

  // 4. DẠY HỌC THEO TRẠM / THEO GÓC (STATION TEACHING)
  {
    id: "station_teaching",
    name: "Dạy học theo Trạm / theo Góc (Station / Corner Teaching)",
    shortName: "Dạy học theo Trạm",
    category: "Mô hình Dạy học Hiện đại",
    badge: "Phân hóa & Đa trí tuệ (Howard Gardner)",
    iconName: "Grid",
    summary: "Chia không gian lớp học thành 4 Trạm học tập độc lập. Các nhóm học sinh luân chuyển qua từng trạm theo lịch trình (10-12 phút/trạm).",
    sourceDoc: "Sách LLDH Vật lí tr. 97 (Các kiểu tổ chức hoạt động học theo nhóm); Tài liệu tập huấn GDPT 2018.",
    natureAndRationale: "Mỗi trạm tiếp cận nội dung bài học theo một phong cách nhận thức khác nhau (thực nghiệm số, suy luận lí thuyết, chế tạo kĩ thuật, vận dụng thực tế), giúp phát huy tối đa các loại hình trí thông minh và cá biệt hóa năng lực học sinh.",
    steps: [
      {
        number: 1,
        title: "Trạm 1: Khám phá Thí nghiệm ảo (Trạm Thực nghiệm)",
        description: "Học sinh thao tác trực tiếp trên mô phỏng số PhysLab, kéo thả con lắc ở các góc 30°, 45°, 60°, ghi số liệu Wđ, Wt, W.",
        teacherAction: "Cung cấp bảng hướng dẫn thực hành số tại Trạm 1 kèm tiêu chí ghi chép.",
        studentAction: "Vận hành mô phỏng, xuất file CSV hoặc ghi vào phiếu học tập trạm 1.",
        suitableTechnique: "Thực hành số theo nhóm"
      },
      {
        number: 2,
        title: "Trạm 2: Xây dựng Công thức Toán học (Trạm Lí thuyết)",
        description: "Học sinh làm việc với các hệ thức toán học từ định lí động năng và công trọng lực để chứng minh đẳng thức bảo toàn.",
        teacherAction: "Đặt các thẻ gợi ý toán học (Gợi ý 1: Công lực căng T; Gợi ý 2: AP = mgh1 - mgh2).",
        studentAction: "Thực hiện phép biến đổi đại số, suy ra công thức v_max = sqrt(2gh0).",
        suitableTechnique: "Kĩ thuật Khăn trải bàn"
      },
      {
        number: 3,
        title: "Trạm 3: Giải mã Bánh răng Escapement (Trạm Kĩ thuật STEM)",
        description: "Quan sát cơ cấu bánh răng thoát của đồng hồ quả lắc, nghe âm thanh tích tắc, tìm hiểu nguyên lí cấp năng lượng bù ma sát.",
        teacherAction: "Trưng bày mô hình đồng hồ cơ học hoặc mở Tab 2 Escapement trên app.",
        studentAction: "Phân tích vai trò của quả tạ hạ chậm và mỏ neo ngàm ruby giải phóng năng lượng từng chu kì.",
        suitableTechnique: "Phân tích mô hình chức năng"
      },
      {
        number: 4,
        title: "Trạm 4: Đấu trường Vận dụng & Đời sống (Trạm Vận dụng)",
        description: "Giải quyết các bài toán thực tiễn: Tàu lượn siêu tốc, nhảy mạo hiểm Bungee, xích đu trẻ em và tính an toàn cơ học.",
        teacherAction: "Đưa ra các tình huống thực tiễn sinh động kèm hình ảnh minh họa.",
        studentAction: "Giải thích các hiện tượng và tính toán thông số vận tốc an toàn.",
        suitableTechnique: "Kĩ thuật Chia sẻ nhóm đôi"
      }
    ],
    suitableLessonTypes: ["Cơ năng & Bảo toàn năng lượng", "Động lượng & Va chạm", "Sóng & Giao thoa"],
    problemSituationType: "Tình huống lựa chọn & Đa phương án",
    exampleApplicationLesson: {
      lessonTitle: "Bài 26: Cơ năng và định luật bảo toàn cơ năng",
      grade: 10,
      scenario: "Lớp học được chia làm 4 góc chuyên đề: Góc Mô phỏng số, Góc Suy luận toán, Góc Kĩ thuật Escapement, Góc Ứng dụng Roller Coaster.",
      demonstrationGuide: "Mỗi nhóm dành 8-10 phút tại 1 trạm, sau đó luân chuyển theo tiếng chuông báo hiệu của GV."
    },
    keyAdvantages: [
      "Không khí lớp học vô cùng sôi động, học sinh được vận động, di chuyển và thay đổi trạng thái liên tục.",
      "Tận dụng tối đa thiết bị máy tính/máy tính bảng có hạn trong phòng học.",
      "Phát triển toàn diện cả tư duy toán, kĩ năng thực nghiệm, hiểu biết kĩ thuật và vận dụng thực tiễn."
    ]
  },

  // 5. GIÁO DỤC STEM & QUY TRÌNH THIẾT KẾ KĨ THUẬT (EDP)
  {
    id: "stem_edp",
    name: "Giáo dục STEM & Quy trình Thiết kế Kĩ thuật (EDP)",
    shortName: "Giáo dục STEM (EDP)",
    category: "Dạy học Tích hợp & Kĩ thuật",
    badge: "Engineering Design Process (5 bước)",
    iconName: "Cpu",
    summary: "Quy trình thiết kế kĩ thuật: Xác định vấn đề -> Nghiên cứu kiến thức nền -> Đề xuất giải pháp -> Chế tạo mẫu thử nghiệm trên mô phỏng -> Đánh giá & cải tiến.",
    sourceDoc: "Sách LLDH Vật lí tr. 27-31 (Hai con đường dạy học ứng dụng kĩ thuật); Công văn 3089/BGDĐT-GDTrH về triển khai giáo dục STEM.",
    natureAndRationale: "Theo con đường thứ hai trong LLDH Vật lí: Dựa trên định luật bảo toàn và biến thiên cơ năng, thiết kế một thiết bị máy móc giải quyết một bài toán kĩ thuật đời sống (chế tạo đồng hồ giữ giờ chính xác bằng con lắc và cơ cấu hồi năng lượng).",
    steps: [
      {
        number: 1,
        title: "Bước 1: Xác định vấn đề kĩ thuật (Ask)",
        description: "Đặt ra yêu cầu thiết kế một cơ cấu giữ nhịp thời gian chính xác cho đồng hồ cơ khí hoạt động liên tục 7 ngày.",
        teacherAction: "Giao nhiệm vụ dự án STEM: 'Hãy thiết kế cơ cấu giữ nhịp đồng hồ quả lắc sao cho bù được cơ năng hao hụt do ma sát không khí'.",
        studentAction: "Xác định các tiêu chí kĩ thuật: Chu kì ổn định T = 1s hoặc 2s, biên độ không đổi, nguồn cấp năng lượng từ quả tạ rơi chậm.",
        suitableTechnique: "Kĩ thuật Động não xác định tiêu chí"
      },
      {
        number: 2,
        title: "Bước 2: Nghiên cứu kiến thức nền (Imagine & Research)",
        description: "Nghiên cứu công thức chu kì con lắc T = 2pi*sqrt(L/g) và định luật bảo toàn & biến thiên cơ năng Delta W = A_cản.",
        teacherAction: "Định hướng HS tìm hiểu tính đẳng thời của dao động nhỏ (Galileo) và định luật biến thiên cơ năng.",
        studentAction: "Tính toán lượng hao phí cơ năng mỗi chu kì và tính thế năng cần dự trữ của quả tạ M*g*H.",
        suitableTechnique: "Kĩ thuật Khăn trải bàn"
      },
      {
        number: 3,
        title: "Bước 3: Đề xuất giải pháp & Thiết kế bản vẽ (Plan)",
        description: "Đề xuất cơ cấu bánh răng thoát (Escape wheel) và ngàm mỏ neo (Pallet fork) để biến chuyển động rơi thành nhịp gõ tích tắc.",
        teacherAction: "Cung cấp bản vẽ nguyên lí của Christiaan Huygens năm 1656 trên slide/mô phỏng.",
        studentAction: "Vẽ phác thảo cơ cấu truyền động từ quả tạ qua trục bánh răng đến mỏ neo con lắc.",
        suitableTechnique: "Vẽ bản thiết kế kĩ thuật theo nhóm"
      },
      {
        number: 4,
        title: "Bước 4: Chế tạo & Vận hành thử nghiệm trên mô phỏng (Create & Test)",
        description: "Khởi chạy Tab Cơ chế Bánh răng thoát trên app, thử nghiệm các góc lệch và tải trọng quả tạ.",
        teacherAction: "Giám sát việc chạy thử nghiệm, hướng dẫn HS quan sát nhịp gõ nhả răng và nghe âm thanh tích tắc.",
        studentAction: "Ghi nhận dao động ổn định, đo chu kì thực tế trên đồng hồ bấm giây ảo.",
        suitableTechnique: "Thực nghiệm mô phỏng số"
      },
      {
        number: 5,
        title: "Bước 5: Đánh giá, chia sẻ & Cải tiến sản phẩm (Improve)",
        description: "Báo cáo sản phẩm trước lớp, thảo luận giải pháp giảm ma sát (dùng ngàm ruby, ổ bi sapphire) để tăng thời gian chạy.",
        teacherAction: "Tổ chức phiên phản biện dự án STEM giữa các nhóm; trao giải thiết kế cơ khí tối ưu.",
        studentAction: "Thuyết trình bản thiết kế, phản biện ý kiến của nhóm bạn, đề xuất cải tiến tăng độ chính xác của đồng hồ.",
        suitableTechnique: "Kĩ thuật Phòng tranh (Gallery Walk)"
      }
    ],
    suitableLessonTypes: ["Ứng dụng con lắc đồng hồ", "Máy phát điện xoay chiều", "Tàu lượn siêu tốc", "Động cơ nhiệt"],
    problemSituationType: "Tình huống thiết kế kĩ thuật đời sống",
    exampleApplicationLesson: {
      lessonTitle: "Bài 26: Cơ năng và định luật bảo toàn cơ năng (Chủ đề STEM Đồng hồ quả lắc)",
      grade: 10,
      scenario: "Dự án STEM: Thiết kế và giải mã cơ cấu quả lắc đồng hồ cơ học cổ giữ giờ chuẩn xác.",
      demonstrationGuide: "Sử dụng Tab 2 'Cơ chế bánh răng thoát Escapement' làm nền tảng kiểm thử mô hình kĩ thuật ảo."
    },
    keyAdvantages: [
      "Kết nối liên môn chặt chẽ giữa Khoa học (Vật lí), Kĩ thuật (Cơ khí), Công nghệ (Thiết kế CAD) và Toán học (Tính toán năng lượng).",
      "Khơi dậy niềm đam mê sáng chế, định hướng nghề nghiệp kĩ thuật cho học sinh THPT.",
      "Đáp ứng trọn vẹn yêu cầu Giáo dục STEM của Bộ Giáo dục và Đào tạo."
    ]
  },

  // 6. DẠY HỌC TRẢI NGHIỆM (CHU TRÌNH KOLB 4 GIAI ĐOẠN)
  {
    id: "kolb_experiential",
    name: "Dạy học Trải nghiệm (Chu trình Kolb 4 giai đoạn)",
    shortName: "Dạy học Trải nghiệm",
    category: "Mô hình Dạy học Hiện đại",
    badge: "David Kolb (Experiential Learning)",
    iconName: "Compass",
    summary: "Chu trình 4 giai đoạn: Trải nghiệm cụ thể (CE) -> Quan sát chiêm nghiệm (RO) -> Khái quát hóa khái niệm trừu tượng (AC) -> Thử nghiệm tích cực trong bối cảnh mới (AE).",
    sourceDoc: "Sách LLDH Vật lí tr. 42 (Phát triển tư duy và năng lực sáng tạo); Chu trình học tập trải nghiệm của David Kolb (1984).",
    natureAndRationale: "Tri thức chân chính được hình thành thông qua việc biến đổi kinh nghiệm thực tế của người học. Việc bắt đầu từ trải nghiệm trực quan sống động trên mô phỏng giúp học sinh có điểm tựa cảm tính vững chắc trước khi trừu tượng hóa thành công thức toán học.",
    steps: [
      {
        number: 1,
        title: "1. Trải nghiệm cụ thể (Concrete Experience - CE)",
        description: "Học sinh tự tay kéo quả lắc, cảm nhận độ căng của sợi dây và quan sát chuyển động lao nhanh từ biên về vị trí cân bằng.",
        teacherAction: "Mở mô phỏng con lắc số, cho HS tự do kéo thả quả nặng và cảm nhận nhịp đung đưa kèm âm thanh gõ tích tắc.",
        studentAction: "Thao tác trên màn hình, trải nghiệm trực tiếp sự thay đổi độ cao và tốc độ của quả cầu.",
        suitableTechnique: "Trải nghiệm tương tác số"
      },
      {
        number: 2,
        title: "2. Quan sát chiêm nghiệm (Reflective Observation - RO)",
        description: "Học sinh dừng lại suy ngẫm, đối chiếu sự thay đổi độ cao h với thanh thế năng Wt, và vận tốc v với thanh động năng Wđ.",
        teacherAction: "Nêu câu hỏi gợi mở suy ngẫm: 'Em quan sát thấy điều gì xảy ra với hai thanh màu xanh lá và màu xanh lam khi quả lắc đung đưa?'.",
        studentAction: "Chiêm nghiệm nhận thấy: Cứ thanh này tụt xuống bao nhiêu thì thanh kia dâng lên bấy nhiêu, thanh tổng màu vàng hổ phách bất biến.",
        suitableTechnique: "Kĩ thuật Chia sẻ nhóm đôi (Think-Pair-Share)"
      },
      {
        number: 3,
        title: "3. Khái quát hóa khái niệm trừu tượng (Abstract Conceptualization - AC)",
        description: "Học sinh cùng giáo viên đúc kết quy luật thành ngôn ngữ và công thức toán học: W = Wđ + Wt = const.",
        teacherAction: "Dẫn dắt HS thiết lập biểu thức toán học W = 1/2*m*v^2 + mgh = const và rút ra hệ quả vận tốc cực đại tại VTCB.",
        studentAction: "Ghi chép công thức, xây dựng bản đồ khái niệm cơ năng vào vở học tập.",
        suitableTechnique: "Kĩ thuật Lược đồ tư duy (Mindmap)"
      },
      {
        number: 4,
        title: "4. Thử nghiệm tích cực trong bối cảnh mới (Active Experimentation - AE)",
        description: "Vận dụng kiến thức vừa khái quát để dự đoán và giải quyết các tình huống mới trong đời sống và kĩ thuật.",
        teacherAction: "Đặt bài toán thử thách: 'Nếu thay đổi khối lượng quả lắc gấp đôi, vận tốc tại vị trí cân bằng có tăng gấp đôi không? Hãy dự đoán rồi kiểm tra trên mô phỏng!'.",
        studentAction: "Dựa vào công thức v_max = sqrt(2gh0) dự đoán vận tốc không phụ thuộc vào m; sau đó kéo thanh trượt m trên app để kiểm chứng.",
        suitableTechnique: "Thực nghiệm kiểm chứng giả thuyết"
      }
    ],
    suitableLessonTypes: ["Tất cả các bài học có thí nghiệm mô phỏng trực quan"],
    problemSituationType: "Tình huống ngạc nhiên & Quan sát thực tiễn",
    exampleApplicationLesson: {
      lessonTitle: "Bài 26: Cơ năng và định luật bảo toàn cơ năng",
      grade: 10,
      scenario: "Học sinh trải nghiệm kéo thả con lắc đồng hồ trên màn hình cảm ứng để tự cảm nhận sự biến đổi năng lượng.",
      demonstrationGuide: "Bắt đầu bằng pha trải nghiệm tự do kéo thả, sau đó cho tạm dừng để chiêm nghiệm và khái quát hóa."
    },
    keyAdvantages: [
      "Kết nối nhịp nhàng giữa kinh nghiệm cảm tính trực quan và tư duy trừu tượng hóa.",
      "Tạo hứng thú học tập tự nhiên, giảm bớt sự khô khan của các phương trình vật lí.",
      "Cực kì hiệu quả khi kết hợp với các phần mềm mô phỏng thí nghiệm số tương tác cao."
    ]
  },

  // 7. PHƯƠNG PHÁP MÔ HÌNH HÓA (STÔPHƠ 4 GIAI ĐOẠN)
  {
    id: "model_stophore",
    name: "Phương pháp Mô hình hóa (Chu trình Stôphơ 4 giai đoạn)",
    shortName: "Phương pháp Mô hình",
    category: "Nhận thức Vật lí đặc thù",
    badge: "V.A Stôphơ (LLDH Vật lí tr. 35-41)",
    iconName: "Atom",
    summary: "4 giai đoạn khoa học: Thu thập thông tin đối tượng gốc -> Xây dựng mô hình (lí tưởng hóa) -> Thao tác trên mô hình (thí nghiệm tưởng tượng/ảo) -> Kiểm tra thực nghiệm & ứng dụng.",
    sourceDoc: "Sách LLDH Vật lí tr. 35-41 (Mô hình và phương pháp mô hình trong dạy học vật lí).",
    natureAndRationale: "Theo V.A Stôphơ: Mô hình là hệ thống phản ánh những thuộc tính bản chất của đối tượng nghiên cứu. Việc nghiên cứu trên mô hình sẽ thay thế cho nghiên cứu trên chính vật thật phức tạp, cho phép thu nhận thông tin mới về đối tượng gốc.",
    steps: [
      {
        number: 1,
        title: "Giai đoạn 1: Thu thập thông tin về đối tượng gốc",
        description: "Quan sát đồng hồ quả lắc thật trong đời sống, ghi nhận các chuyển động đung đưa, dây treo, quả lắc và quả tạ.",
        teacherAction: "Chiếu hình ảnh cấu tạo chiếc đồng hồ quả lắc thực tế với hệ thống vỏ gỗ, quả tạ, con lắc và mặt số.",
        studentAction: "Liệt kê các chi tiết quan sát được, nhận xét chuyển động tuần hoàn qua lại quanh vị trí cân bằng.",
        suitableTechnique: "Quan sát đối tượng thật"
      },
      {
        number: 2,
        title: "Giai đoạn 2: Xây dựng mô hình lí tưởng (Lí tưởng hóa)",
        description: "Trừu xuất các yếu tố không cơ bản (vỏ gỗ, hình dạng phức tạp), thay thế bằng 'Mô hình con lắc đơn': Dây nhẹ không dãn, quả cầu chất điểm khối lượng m.",
        teacherAction: "Gợi ý HS: Để nghiên cứu quy luật chuyển động, ta có thể đơn giản hóa con lắc đồng hồ thành mô hình vật lí nào?",
        studentAction: "Xác lập mô hình con lắc đơn với chiều dài L, quả cầu m và bỏ qua ma sát không khí ở bước đầu.",
        suitableTechnique: "Thao tác trừu tượng hóa"
      },
      {
        number: 3,
        title: "Giai đoạn 3: Thao tác trên mô hình (Thí nghiệm ảo & Suy luận)",
        description: "Vận hành mô phỏng ảo trên máy tính, thực hiện các thí nghiệm lí tưởng và suy ra phương trình bảo toàn cơ năng.",
        teacherAction: "Hướng dẫn HS vận hành mô hình ảo PhysLab, thay đổi L, m, alpha0 để rút ra quy luật độc lập của chu kì với biên độ nhỏ.",
        studentAction: "Thu thập số liệu trên mô hình ảo, rút ra hệ thức W = Wđ + Wt = const.",
        suitableTechnique: "Thao tác trên mô hình số"
      },
      {
        number: 4,
        title: "Giai đoạn 4: Thực nghiệm kiểm tra & Chuyển về đối tượng gốc",
        description: "Đối chiếu kết quả từ mô hình với đồng hồ quả lắc thật, bổ sung lực cản không khí và cơ chế bánh răng thoát cấp bù năng lượng.",
        teacherAction: "Đặt câu hỏi: 'Mô hình lí tưởng bỏ qua ma sát có hoàn toàn trùng khớp với đồng hồ thật? Ta cần bổ sung yếu tố gì để giải thích đồng hồ thật?'.",
        studentAction: "Bổ sung yếu tố hao phí ma sát và cơ cấu escapement, hoàn thiện nhận thức toàn diện về đối tượng gốc.",
        suitableTechnique: "Đối chiếu và hoàn thiện mô hình"
      }
    ],
    suitableLessonTypes: ["Con lắc đơn & Con lắc đồng hồ", "Chất điểm & Quỹ đạo", "Khí lí tưởng", "Mô hình đường sức từ"],
    problemSituationType: "Tình huống chuyển từ thực tế sang mô hình lí tưởng",
    exampleApplicationLesson: {
      lessonTitle: "Bài 26: Cơ năng và định luật bảo toàn cơ năng",
      grade: 10,
      scenario: "Xây dựng mô hình con lắc đơn lí tưởng để giải mã nguyên lí hoạt động của con lắc đồng hồ cổ.",
      demonstrationGuide: "Chỉ rõ các giả thiết lí tưởng hóa (dây không dãn, khối lượng dây không đáng kể, kích thước quả cầu rất nhỏ)."
    },
    keyAdvantages: [
      "Hình thành năng lực mô hình hóa - một trong những năng lực cốt lõi nhất của nhà khoa học vật lí hiện đại.",
      "Giúp học sinh hiểu sâu sắc ranh giới giữa mô hình lí thuyết lí tưởng và thực tiễn kỹ thuật phức tạp.",
      "Là nền tảng vững chắc cho các chương trình vật lí nâng cao và đại học."
    ]
  },

  // 8. LỚP HỌC ĐẢO NGƯỢC (FLIPPED CLASSROOM)
  {
    id: "flipped_classroom",
    name: "Mô hình Lớp học Đảo ngược (Flipped Classroom)",
    shortName: "Lớp học Đảo ngược",
    category: "Mô hình Dạy học Hiện đại",
    badge: "Dạy học Kết hợp (Blended Learning)",
    iconName: "MonitorPlay",
    summary: "Đảo ngược quy trình: Học sinh tự khám phá mô phỏng và đọc SGK tại nhà trước giờ học -> Giờ lên lớp dành trọn vẹn cho thảo luận nhóm, giải quyết vấn đề khó và bài tập sáng tạo.",
    sourceDoc: "Sách LLDH Vật lí tr. 73 (Thí nghiệm và quan sát vật lí ở nhà); Chuyên đề Dạy học đảo ngược môn KHTN/Vật lí.",
    natureAndRationale: "Chuyển giao đoạn tiếp nhận thông tin thụ động về nhà với sự hỗ trợ của mô phỏng số chạy offline hoặc trực tuyến; nâng cấp thời gian vàng trên lớp học trực tiếp thành không gian tương tác xã hội, giải quyết các nhiệm vụ nhận thức bậc cao (phân tích, đánh giá, sáng tạo).",
    steps: [
      {
        number: 1,
        title: "Pha 1 (Tại nhà trước giờ học): Khám phá mô phỏng & Điền phiếu tự học",
        description: "HS tải file HTML thí nghiệm offline về máy tính hoặc mở link app trên điện thoại, tự mình kéo con lắc và hoàn thành Phiếu học tập số 1.",
        teacherAction: "Giao nhiệm vụ trên hệ thống/Zalo lớp: Tải thí nghiệm về máy, làm theo 3 nhiệm vụ trên phiếu tự học trước giờ lên lớp.",
        studentAction: "Tự giác làm thí nghiệm ảo ở nhà, ghi số liệu, tự tính thử Wđ, Wt, W và ghi lại những câu hỏi chưa hiểu.",
        suitableTechnique: "Tự học với mô phỏng Offline"
      },
      {
        number: 2,
        title: "Pha 2 (Đầu giờ học trên lớp): Kiểm tra nhanh & Tiếp nhận thắc mắc",
        description: "GV kiểm tra sự chuẩn bị của HS qua 3 câu hỏi trắc nghiệm tương tác nhanh hoặc bảng KWL.",
        teacherAction: "Quét nhanh kết quả chuẩn bị bài của các nhóm, chỉ ra những điểm còn hiểu sai lệch phổ biến.",
        studentAction: "Nêu các câu hỏi băn khoăn: 'Tại sao khi bật lực cản thì cơ năng không còn bảo toàn?'.",
        suitableTechnique: "Kĩ thuật KWL / Q&A nhanh"
      },
      {
        number: 3,
        title: "Pha 3 (Trong giờ học): Thảo luận nhóm chuyên sâu & Dự án STEM",
        description: "Dành 25-30 phút để các nhóm tranh luận, giải các bài tập tổng hợp và khám phá cơ chế bánh răng thoát Escapement.",
        teacherAction: "Đóng vai trò cố vấn, đi tới từng nhóm hỗ trợ gỡ rối những suy luận toán học phức tạp.",
        studentAction: "Học tập nhóm tích cực, giải thích nguyên lí quả tạ bù năng lượng cho đồng hồ, trình bày kết quả lên bảng.",
        suitableTechnique: "Kĩ thuật Khăn trải bàn & Jigsaw"
      },
      {
        number: 4,
        title: "Pha 4 (Tổng kết & Đánh giá): Chuẩn hóa kiến thức & Giao bài tập sáng tạo",
        description: "GV thể chế hóa kiến thức cốt lõi và giao bài tập vận dụng thiết kế kĩ thuật mở rộng.",
        teacherAction: "Khái quát hóa định luật, nhận xét sự chuẩn bị tự học xuất sắc của học sinh.",
        studentAction: "Ghi nhận kiến thức chuẩn hóa, nhận nhiệm vụ tìm hiểu đồng hồ Big Ben hoặc các trò chơi mạo hiểm.",
        suitableTechnique: "Kĩ thuật Trình bày một phút"
      }
    ],
    suitableLessonTypes: ["Tất cả các bài học có thí nghiệm ảo hoặc video tư liệu"],
    problemSituationType: "Tình huống tự học nảy sinh thắc mắc",
    exampleApplicationLesson: {
      lessonTitle: "Bài 26: Cơ năng và định luật bảo toàn cơ năng",
      grade: 10,
      scenario: "Học sinh được tải file HTML thí nghiệm về máy tính gia đình tự thực hành trước, giờ lên lớp dành cho tranh luận chuyên sâu.",
      demonstrationGuide: "Cung cấp file Offline HTML 'Thi_Nghiem_Con_Lac_Dong_Ho_Bao_Toan_Co_Nang_Lop10.html' cho HS tải về nhà."
    },
    keyAdvantages: [
      "Giải phóng tối đa thời gian trên lớp khỏi việc đọc chép hoặc giảng giải lí thuyết đơn thuần.",
      "Tối ưu hóa năng lực tự chủ và tự học (một trong 3 năng lực chung cốt lõi của GDPT 2018).",
      "Học sinh được làm việc nhóm thực sự và nhận được sự trợ giúp trực tiếp kịp thời từ giáo viên."
    ]
  }
];

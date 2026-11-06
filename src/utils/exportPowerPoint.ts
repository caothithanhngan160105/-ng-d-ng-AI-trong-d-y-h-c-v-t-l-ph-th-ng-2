import pptxgen from "pptxgenjs";
import { LessonTopic, LessonActivity, BookSeries } from "../types/physics";

/**
 * Utility to export an interactive, Canva-inspired high-aesthetic PowerPoint presentation (.pptx)
 * Design & Content specifications aligned with user's visual reference photos:
 * 1. Visual Hierarchy & Logic (Phỏng theo chuẩn thiết kế từ ảnh thực tế):
 *    - Top Crimson/Red Banner: [VẬT LÍ {grade} — {chapterTitle.toUpperCase()}]
 *    - Structured Textbook Headings (Phân cấp đề mục SGK):
 *      * Dòng 1: Chương ...
 *      * Dòng 2: Bài [Số] - Tên Bài học SGK
 *      * Dòng 3: Đề mục kiến thức SGK: I. ..., 1.1. ..., 1.2. ...
 *    - Logical Tree Diagram (Sơ đồ khối nhánh logic như Image 1):
 *      * Khối mẹ bên trái nối các đường nhánh connector lines sang cột các khối con bên phải
 *    - Card Containers with Outer Drop Shadows (Khối thẻ đổ bóng nổi bật như Image 2 & 3)
 *    - Bottom Accent Line & Rounded Page Number Badge (như [22], [17] trong ảnh tham khảo)
 * 2. Strictly 100% Textbook Physics Knowledge (Nội dung thuần túy SGK):
 *    - Tuyệt đối KHÔNG đưa nội dung giáo án (không bước 1, 2, 3, 4, không rubrics giáo viên)
 *    - Tuyệt đối KHÔNG đưa PPCT (không thời lượng số tiết hay phân phối chương trình)
 *    - Các đề mục là NỘI DUNG KIẾN THỨC SÁCH GIÁO KHOA: định nghĩa, khái niệm, bản chất, định luật, thuyết, công thức, đơn vị SI, bài tập ví dụ mẫu có lời giải chi tiết và ghi nhớ.
 * 3. Typography & Overflow Safety:
 *    - Font: STRICTLY Times New Roman throughout
 *    - Strict safe margins (Slide bounds 13.33" x 7.5", content bounds Y: 1.95" to 6.3", bottom margin > 1.2" airy and breathable)
 */

export interface TextbookLessonSection {
  grade: number;
  chapterName: string;
  lessonName: string;
  mainConceptTitle: string;
  // Slide 2: Logical tree diagram
  treeDiagram: {
    parentBoxTitle: string;
    parentBoxSubtitle: string;
    childBoxes: string[];
  };
  // Slide 3: Concept & Theory
  theory: {
    sectionTitle: string;
    colLeft: { title: string; bullets: string[] };
    colRight: { title: string; bullets: string[] };
  };
  // Slide 4: Law & Formula
  formulaSection: {
    sectionTitle: string;
    conceptText: string;
    heroFormula: string;
    units: { symbol: string; name: string; unit: string }[];
    signRules: string[];
  };
  // Slide 5: Mechanism & Relations
  mechanismSection: {
    sectionTitle: string;
    lawTitle: string;
    lawStatement: string;
    energyRelation: string;
    rules: string[];
  };
  // Slide 6: Practical Applications
  applicationsSection: {
    sectionTitle: string;
    apps: { code: string; name: string; desc: string }[];
  };
  // Slide 7: Worked Example & Core Takeaways
  exampleSection: {
    sectionTitle: string;
    examplePrompt: string;
    solutionSteps: string[];
    finalResult: string;
    takeaways: string[];
  };
}

/**
 * Intelligent pure textbook knowledge generator (NO lesson plan, NO PPCT)
 */
function getPureTextbookContent(topic: LessonTopic, activity: LessonActivity): TextbookLessonSection {
  const titleLower = (topic.lessonTitle || "").toLowerCase();
  const idLower = (topic.id || "").toLowerCase();
  const grade = topic.grade;
  const chapterName = topic.chapterTitle || `Chương trình Vật lí ${grade}`;
  const lessonName = topic.lessonTitle;

  // CASE 1: BÀI 19: THẾ NĂNG ĐIỆN (VẬT LÍ 11)
  if (idLower.includes("the-nang-dien") || titleLower.includes("thế năng điện") || titleLower.includes("công của lực điện")) {
    return {
      grade: 11,
      chapterName: "Chương III. Điện trường",
      lessonName: "Bài 19. Thế năng điện",
      mainConceptTitle: "I. CÔNG CỦA LỰC ĐIỆN TRONG ĐIỆN TRƯỜNG ĐỀU",
      treeDiagram: {
        parentBoxTitle: "Công của lực điện trường đều\nA = q · E · d",
        parentBoxSubtitle: "(d = s · cos α là hình chiếu độ dời lên phương của một đường sức điện)",
        childBoxes: [
          "Bản chất lực tác dụng: Lực điện F = q · E không đổi cả về hướng và độ lớn",
          "Công trên đường thẳng MN: A_MN = F · s · cos α = q · E · d",
          "Công trên đường gấp khúc MPN: A_MPN = A_MP + A_PN = q · E · d + 0 = q · E · d",
          "Tính chất lực thế: Công của lực điện hoàn toàn không phụ thuộc vào hình dạng đường đi",
          "Công trên quỹ đạo khép kín: Khi điện tích dịch chuyển theo đường cong kín thì A_kín = 0",
        ],
      },
      theory: {
        sectionTitle: "II. ĐẶC ĐIỂM CỦA LỰC THẾ VÀ TÍNH CHẤT TRƯỜNG THẾ",
        colLeft: {
          title: "1. ĐIỆN TRƯỜNG TĨNH LÀ TRƯỜNG THẾ",
          bullets: [
            "• Lực điện tác dụng lên điện tích q là một lực thế.",
            "• Công của lực điện chỉ phụ thuộc vị trí điểm đầu M và điểm cuối N, không phụ thuộc hình dạng quỹ đạo.",
            "• Khi điện tích dịch chuyển vuông góc với đường sức (α = 90°): Lực điện không sinh công (A = 0).",
            "• Điện trường tĩnh là một trường thế (tương tự như trọng trường).",
          ],
        },
        colRight: {
          title: "2. SO SÁNH TƯƠNG ĐỒNG VỚI TRỌNG TRƯỜNG",
          bullets: [
            "• Trọng lực P = m · g là lực thế: Công A_P = m · g · (z_M - z_N).",
            "• Lực điện F = q · E là lực thế: Công A_MN = q · E · (d_M - d_N).",
            "• Khối lượng m tương ứng với điện tích q.",
            "• Gia tốc trọng trường g tương ứng với cường độ điện trường E.",
          ],
        },
      },
      formulaSection: {
        sectionTitle: "III. THẾ NĂNG CỦA MỘT ĐIỆN TÍCH TRONG ĐIỆN TRƯỜNG",
        conceptText: "Thế năng của một điện tích q đặt tại điểm M trong điện trường đặc trưng cho khả năng sinh công của điện trường khi đặt điện tích tại điểm đó.",
        heroFormula: "W_M = q · E · d_M",
        units: [
          { symbol: "W_M", name: "Thế năng điện của điện tích q tại điểm M", unit: "Joule (J) hoặc mJ" },
          { symbol: "q", name: "Độ lớn và dấu đại số của điện tích thử", unit: "Coulomb (C)" },
          { symbol: "E", name: "Cường độ điện trường đều giữa hai bản", unit: "Vôn trên mét (V/m)" },
          { symbol: "d_M", name: "Khoảng cách từ điểm M đến mốc thế năng", unit: "mét (m)" },
        ],
        signRules: [
          "Mốc thế năng (W = 0): Thường chọn tại bản cực âm hoặc ở vô cực.",
          "Thế năng W_M tỉ lệ thuận với điện tích q đặt trong điện trường.",
        ],
      },
      mechanismSection: {
        sectionTitle: "IV. MỐI LIÊN HỆ GIỮA CÔNG VÀ ĐỘ GIẢM THẾ NĂNG ĐIỆN",
        lawTitle: "ĐỊNH LÍ VỀ THẾ NĂNG ĐIỆN",
        lawStatement: "Công của lực điện tác dụng lên điện tích q khi dịch chuyển từ điểm M đến điểm N bằng độ giảm thế năng của điện tích q giữa hai điểm đó.",
        energyRelation: "A_MN = W_M - W_N = -ΔW_t",
        rules: [
          "• Khi lực điện sinh công dương (A > 0): Thế năng giảm, động năng của hạt tăng dần.",
          "• Khi lực điện sinh công âm (A < 0): Thế năng tăng, động năng của hạt giảm dần.",
          "• Quy ước dấu hình chiếu d: d > 0 khi đi cùng chiều đường sức E; d < 0 khi đi ngược chiều E.",
          "• Khi dịch chuyển trên mặt phẳng vuông góc đường sức E: d = 0 => A = 0.",
        ],
      },
      applicationsSection: {
        sectionTitle: "V. ỨNG DỤNG THỰC TẾ CỦA ĐIỆN TRƯỜNG VÀ THẾ NĂNG ĐIỆN",
        apps: [
          {
            code: "5.1",
            name: "Máy gia tốc hạt (Particle Accelerator)",
            desc: "Sử dụng công của điện trường cao thế để gia tốc các electron, proton đạt vận tốc lớn phục vụ xạ trị ung thư và nghiên cứu hạt nhân.",
          },
          {
            code: "5.2",
            name: "Hệ thống Phin lọc bụi tĩnh điện (ESP)",
            desc: "Ion hóa các hạt khói bụi trong khí thải nhà máy nhiệt điện, xi măng, sau đó dùng lực điện hút bụi bám vào bản cực làm sạch 99% khói thải.",
          },
          {
            code: "5.3",
            name: "Ống phóng điện tử (CRT) và Máy in phun",
            desc: "Dùng điện trường đều giữa các bản lái tia để điều khiển chuẩn xác quỹ đạo bay của chùm điện tử và hạt mực tích điện theo ý muốn.",
          },
        ],
      },
      exampleSection: {
        sectionTitle: "VI. BÀI TẬP VÍ DỤ VẬN DỤNG SGK VÀ GHI NHỚ TRỌNG TÂM",
        examplePrompt: "Một điện tích điểm q = +2 μC (2 · 10^-6 C) dịch chuyển từ điểm M đến điểm N trong điện trường đều E = 5000 V/m. Hình chiếu của đoạn độ dời MN lên đường sức có độ dài d = +0,1 m (10 cm). Tính công của lực điện và độ giảm thế năng?",
        solutionSteps: [
          "Bước 1: Áp dụng công thức công của lực điện trường: A_MN = q · E · d.",
          "Bước 2: Thay số đại số: A_MN = (2 · 10^-6 C) · (5000 V/m) · (0,1 m) = +10^-3 J = +1 mJ.",
          "Bước 3: Độ giảm thế năng: W_M - W_N = A_MN = +1 mJ.",
        ],
        finalResult: "Công lực điện A_MN = +1 mJ; thế năng giảm 1 mJ chuyển hóa thành động năng.",
        takeaways: [
          "1. Lực điện là lực thế: Công hoàn toàn không phụ thuộc vào hình dạng đường đi.",
          "2. Công thức cốt lõi SGK: A = q · E · d (cần chú ý đúng dấu đại số của hình chiếu d).",
          "3. Công của lực điện bằng độ giảm thế năng: A_MN = W_M - W_N = -ΔW_t.",
        ],
      },
    };
  }

  // CASE 2: BÀI 26: SỰ BẢO TOÀN CƠ NĂNG (LỚP 10)
  if (idLower.includes("pendulum") || idLower.includes("bao-toan-co-nang") || titleLower.includes("cơ năng") || titleLower.includes("con lắc")) {
    return {
      grade: 10,
      chapterName: "Chương IV. Năng lượng, công, công suất",
      lessonName: "Bài 26. Sự bảo toàn cơ năng",
      mainConceptTitle: "I. ĐỘNG NĂNG, THẾ NĂNG VÀ CƠ NĂNG",
      treeDiagram: {
        parentBoxTitle: "Cơ năng trong trọng trường\nW = W_đ + W_t",
        parentBoxSubtitle: "(Tổng động năng và thế năng trọng trường của một vật)",
        childBoxes: [
          "Động năng: W_đ = 1/2 · m · v² (năng lượng do vật chuyển động mà có)",
          "Thế năng trọng trường: W_t = m · g · z (năng lượng tương tác giữa Trái Đất và vật)",
          "Vị trí biên: Thế năng đạt cực đại, vận tốc v = 0 nên động năng bằng 0",
          "Vị trí cân bằng: Động năng đạt cực đại, độ cao z = 0 nên thế năng bằng 0",
          "Điều kiện bảo toàn: Vật chuyển động trong trọng trường chỉ chịu tác dụng của trọng lực",
        ],
      },
      theory: {
        sectionTitle: "II. ĐỊNH LUẬT BẢO TOÀN CƠ NĂNG",
        colLeft: {
          title: "1. NỘI DUNG ĐỊNH LUẬT BẢO TOÀN",
          bullets: [
            "• Khi một vật chuyển động trong trọng trường chỉ chịu tác dụng của trọng lực, cơ năng của vật là một đại lượng bảo toàn.",
            "• Biểu thức: W = W_đ + W_t = 1/2 · m · v² + m · g · z = const.",
            "• Trong quá trình chuyển động: Động năng giảm bao nhiêu thì thế năng tăng bấy nhiêu và ngược lại.",
          ],
        },
        colRight: {
          title: "2. BIẾN THIÊN CƠ NĂNG KHI CÓ MA SÁT",
          bullets: [
            "• Khi vật chịu thêm tác dụng của lực ma sát, lực cản: Cơ năng không bảo toàn.",
            "• Độ biến thiên cơ năng bằng công của lực ma sát: W_2 - W_1 = A_ms.",
            "• Do lực ma sát sinh công âm (A_ms < 0) nên cơ năng giảm dần (tiêu hao thành nhiệt năng).",
          ],
        },
      },
      formulaSection: {
        sectionTitle: "III. CÁC HỆ THỨC TÍNH TOÁN CƠ NĂNG TRỌNG TÂM",
        conceptText: "Vận tốc của vật tại vị trí bất kì có độ cao z khi được thả rơi tự do không vận tốc ban đầu từ độ cao cực đại h_max.",
        heroFormula: "v = √(2 · g · (h_max - z))",
        units: [
          { symbol: "W", name: "Cơ năng toàn phần của vật", unit: "Joule (J)" },
          { symbol: "m", name: "Khối lượng của vật chuyển động", unit: "Kilôgam (kg)" },
          { symbol: "v", name: "Vận tốc tức thời của vật", unit: "mét trên giây (m/s)" },
          { symbol: "z", name: "Độ cao so với mốc thế năng", unit: "mét (m)" },
        ],
        signRules: [
          "Mốc thế năng (z = 0): Thường chọn tại mặt đất hoặc vị trí thấp nhất của quỹ đạo.",
          "Vận tốc cực đại tại vị trí cân bằng: v_max = √(2 · g · h_max).",
        ],
      },
      mechanismSection: {
        sectionTitle: "IV. SỰ CHUYỂN HÓA NĂNG LƯỢNG TRONG DAO ĐỘNG CON LẮC",
        lawTitle: "CƠ CHẾ CHUYỂN HÓA W_đ VÀ W_t",
        lawStatement: "Trong dao động của con lắc đồng hồ, thế năng và động năng chuyển hóa tuần hoàn qua lại lẫn nhau với chu kì T' = T/2.",
        energyRelation: "W = W_đ_max = W_t_max = m · g · h_max = const",
        rules: [
          "• Từ biên về VTCB: Thế năng chuyển hóa hoàn toàn thành động năng.",
          "• Từ VTCB ra biên: Động năng chuyển hóa hoàn toàn thành thế năng.",
          "• Độ cao cực đại của con lắc: h_max = L · (1 - cos α_0).",
          "• Cơ chế bánh răng thoát đồng hồ: Cấp bù năng lượng đúng lúc để bù trừ hao phí ma sát.",
        ],
      },
      applicationsSection: {
        sectionTitle: "V. ỨNG DỤNG THỰC TẾ CỦA ĐỊNH LUẬT BẢO TOÀN CƠ NĂNG",
        apps: [
          {
            code: "5.1",
            name: "Đồng hồ Quả lắc cơ học",
            desc: "Ứng dụng dao động của con lắc đếm giây và cơ cấu bánh cóc thoát năng lượng để đo đạc thời gian chính xác qua hàng thế kỉ.",
          },
          {
            code: "5.2",
            name: "Tàu lượn siêu tốc (Roller Coaster)",
            desc: "Kéo tàu lên vị trí đỉnh dốc cao nhất để tích trữ thế năng cực đại, sau đó tàu chuyển động tự do biến thế năng thành vận tốc nghẹt thở.",
          },
          {
            code: "5.3",
            name: "Nhà máy thủy điện",
            desc: "Thế năng của khối nước trên hồ đập cao chuyển hóa thành động năng của dòng chảy làm quay tuabin máy phát điện.",
          },
        ],
      },
      exampleSection: {
        sectionTitle: "VI. BÀI TẬP VÍ DỤ VẬN DỤNG SGK VÀ GHI NHỚ TRỌNG TÂM",
        examplePrompt: "Một con lắc đơn có chiều dài dây L = 1,0 m, quả nặng m = 200 g (0,2 kg). Kéo con lắc lệch góc α_0 = 60° rồi buông nhẹ không vận tốc đầu. Lấy g = 9,8 m/s². Bỏ qua ma sát. Tính vận tốc của con lắc khi đi qua vị trí cân bằng?",
        solutionSteps: [
          "Bước 1: Chọn mốc thế năng tại VTCB. Độ cao tại biên: h_0 = L · (1 - cos 60°) = 1,0 · (1 - 0,5) = 0,5 m.",
          "Bước 2: Cơ năng tại biên: W = m · g · h_0 = 0,2 · 9,8 · 0,5 = 0,98 J.",
          "Bước 3: Tại VTCB thế năng bằng 0, cơ năng bảo toàn: 1/2 · m · v_max² = W => v_max = √(2 · g · h_0).",
          "Bước 4: Tính số: v_max = √(2 · 9,8 · 0,5) ≈ 3,13 m/s.",
        ],
        finalResult: "Vận tốc tại VTCB là v_max ≈ 3,13 m/s; Động năng cực đại W_đ = 0,98 J.",
        takeaways: [
          "1. Cơ năng bảo toàn khi vật chỉ chịu tác dụng của trọng lực: W = W_đ + W_t = const.",
          "2. Vận tốc cực đại tại vị trí thấp nhất: v_max = √(2 · g · h_max).",
          "3. Khi có lực ma sát: Cơ năng không bảo toàn, độ giảm cơ năng bằng công lực cản.",
        ],
      },
    };
  }

  // CASE 3: BÀI 23: ĐỘNG LƯỢNG. ĐỊNH LUẬT BẢO TOÀN ĐỘNG LƯỢNG (LỚP 10)
  if (
    idLower.includes("dong-luong") ||
    idLower.includes("b23") ||
    titleLower.includes("động lượng") ||
    titleLower.includes("xung lượng")
  ) {
    return {
      grade: 10,
      chapterName: "Chương V. Động lượng",
      lessonName: "Bài 23. Động lượng. Định luật bảo toàn động lượng",
      mainConceptTitle: "I. XUNG LƯỢNG CỦA LỰC VÀ ĐỘNG LƯỢNG",
      treeDiagram: {
        parentBoxTitle: "Xung lượng của lực và Động lượng\np = m · v  |  Δp = F · Δt",
        parentBoxSubtitle: "(Hai khái niệm nền tảng mô tả chuyển động và tương tác lực theo SGK)",
        childBoxes: [
          "Xung lượng của lực: F · Δt (đơn vị N · s) đặc trưng cho tác dụng của lực trong khoảng thời gian Δt",
          "Định nghĩa động lượng: p = m · v là đại lượng vectơ cùng hướng với vectơ vận tốc v (đơn vị kg · m/s)",
          "Mối liên hệ xung lượng - động lượng: Δp = p₂ - p₁ = F · Δt (dạng mở rộng của định luật II Newton)",
          "Khái niệm hệ cô lập (hệ kín): Hệ không chịu ngoại lực hoặc tổng các ngoại lực tác dụng triệt tiêu lẫn nhau",
          "Định luật bảo toàn động lượng: Tổng động lượng của một hệ cô lập là một đại lượng bảo toàn (p' = p)",
        ],
      },
      theory: {
        sectionTitle: "II. HỆ CÔ LẬP VÀ ĐỊNH LUẬT BẢO TOÀN ĐỘNG LƯỢNG",
        colLeft: {
          title: "1. ĐỊNH NGHĨA HỆ CÔ LẬP (HỆ KÍN)",
          bullets: [
            "• Một hệ nhiều vật được gọi là cô lập khi không có ngoại lực tác dụng lên hệ hoặc nếu có thì các ngoại lực ấy cân bằng nhau.",
            "• Hệ hai vật chuyển động trên mặt phẳng ngang không ma sát là hệ cô lập vì trọng lực P và phản lực N triệt tiêu nhau: P + N = 0.",
            "• Hệ Trái Đất - vật được coi gần đúng là hệ kín vì lực hấp dẫn của các thiên thể xa xôi là không đáng kể.",
          ],
        },
        colRight: {
          title: "2. CÁC TRƯỜNG HỢP GẦN ĐÚNG HỆ KÍN TRONG THỰC TẾ",
          bullets: [
            "• Trong các hiện tượng va chạm hoặc vụ nổ diễn ra trong thời gian rất ngắn Δt cực nhỏ.",
            "• Tương tác nội lực giữa các vật rất lớn so với các ngoại lực (trọng lực, lực cản), do đó có thể bỏ qua ngoại lực.",
            "• Khi ngoại lực theo một phương triệt tiêu nhau: Động lượng của hệ bảo toàn theo phương đó.",
          ],
        },
      },
      formulaSection: {
        sectionTitle: "III. BIỂU THỨC ĐỊNH LUẬT BẢO TOÀN ĐỘNG LƯỢNG",
        conceptText: "Tổng vectơ động lượng của các vật trong hệ cô lập trước tương tác bằng tổng vectơ động lượng sau tương tác.",
        heroFormula: "p₁ + p₂ + ... = p'₁ + p'₂ + ...  <=>  p = const",
        units: [
          { symbol: "p", name: "Động lượng của vật trong hệ", unit: "kg · m/s (hoặc N · s)" },
          { symbol: "m", name: "Khối lượng của vật chuyển động", unit: "Kilôgam (kg)" },
          { symbol: "v", name: "Vận tốc chuyển động tức thời", unit: "mét trên giây (m/s)" },
          { symbol: "F · Δt", name: "Xung lượng của lực tác dụng", unit: "Niu-tơn giây (N · s)" },
        ],
        signRules: [
          "1 N · s = 1 (kg · m/s²) · s = 1 kg · m/s (hai đơn vị đo lường hoàn toàn tương đương).",
          "Bảo toàn động lượng là phương trình vectơ: Phải chọn trục tọa độ và chiếu các vectơ vận tốc lên trục.",
        ],
      },
      mechanismSection: {
        sectionTitle: "IV. HAI BÀI TOÁN TRỌNG TÂM: VA CHẠM MỀM & PHẢN LỰC",
        lawTitle: "CÔNG THỨC VẬN DỤNG CỐT LÕI SGK",
        lawStatement: "Áp dụng định luật bảo toàn động lượng để thiết lập công thức chính xác cho va chạm mềm và chuyển động phản lực của tên lửa.",
        energyRelation: "Va chạm mềm: v = (m₁ · v₁) / (m₁ + m₂)  |  Tên lửa: V = - (m / M) · v",
        rules: [
          "• Va chạm mềm: Hai vật sau va chạm dính chặt làm một, cùng chuyển động với vận tốc v. Cơ năng giảm do biến dạng.",
          "• Chuyển động bằng phản lực: Ban đầu đứng yên (p = 0), khi phụt lượng khí m với vận tốc v thì tên lửa M giật lùi với vận tốc V.",
          "• Dấu (-) trong công thức tên lửa: Vận tốc tên lửa V luôn ngược chiều với vận tốc dòng khí v phụt ra.",
          "• Hiện tượng súng giật khi bắn: Đạn bay ra phía trước với động lượng p_đạn làm súng giật lùi về phía sau: V_súng = - (m_đạn / M_súng) · v_đạn.",
        ],
      },
      applicationsSection: {
        sectionTitle: "V. ỨNG DỤNG THỰC TẾ TRONG KĨ THUẬT & ĐỜI SỐNG",
        apps: [
          {
            code: "5.1",
            name: "Phóng vệ tinh và Thám hiểm không gian",
            desc: "Ứng dụng phản lực của động cơ tên lửa nhiều tầng mang nhiên liệu lỏng phụt khí tốc độ cực cao, đưa vệ tinh Vinasat-1 của Việt Nam vào quỹ đạo địa tĩnh.",
          },
          {
            code: "5.2",
            name: "Chuyển động phản lực trong sinh học",
            desc: "Mực, sứa, bạch tuộc hút nước vào khoang cơ thể rồi co bóp phụt dòng nước mạnh ra phía sau để phóng cơ thể lao nhanh về phía trước.",
          },
          {
            code: "5.3",
            name: "Túi khí an toàn ô tô (Airbag) & Xung lượng",
            desc: "Áp dụng hệ thức F = Δp / Δt: Túi khí làm tăng thời gian va chạm Δt lên nhiều lần, giúp giảm tối đa lực xung kích F tác dụng lên đầu tài xế khi va chạm.",
          },
        ],
      },
      exampleSection: {
        sectionTitle: "VI. BÀI TẬP VẬN DỤNG SGK (PHT SỐ 5) & 3 GHI NHỚ TRỌNG TÂM",
        examplePrompt: "Một chiếc xe khối lượng M = 38 kg đang chạy trên đường ngang không ma sát với v₀ = 1 m/s. Một vật nhỏ m = 2 kg bay ngang với vận tốc v₀₁ = 7 m/s cắm vào xe và nằm yên trong xe. Xác định vận tốc mới V của xe khi: a) Vật bay ngược chiều xe; b) Vật bay cùng chiều xe; c) Vật bay vuông góc xe?",
        solutionSteps: [
          "Bước 1: Chọn chiều dương là chiều chuyển động ban đầu của xe. Do không ma sát nên hệ (xe + vật) là hệ cô lập theo phương ngang.",
          "Bước 2: Áp dụng ĐL bảo toàn động lượng: M · v₀ + m · v₀₁ = (M + m) · V => V = (M · v₀ + m · v₀₁) / (M + m).",
          "Bước 3a: Ngược chiều (v₀₁ = -7 m/s): V = (38·1 + 2·(-7)) / (38 + 2) = 24 / 40 = +0,6 m/s (xe tiếp tục chạy theo hướng cũ).",
          "Bước 3b: Cùng chiều (v₀₁ = +7 m/s): V = (38·1 + 2·7) / (38 + 2) = 52 / 40 = +1,3 m/s (xe tăng tốc).",
          "Bước 3c: Vuông góc chiều xe (hình chiếu v₀₁ lên phương ngang bằng 0): V = (38·1 + 0) / (38 + 2) = 38 / 40 = +0,95 m/s.",
        ],
        finalResult: "Kết quả: a) V = 0,6 m/s; b) V = 1,3 m/s; c) V = 0,95 m/s (chuẩn xác theo Phiếu học tập số 5 SGK).",
        takeaways: [
          "1. Động lượng p = m·v và xung lượng lực F·Δt: Hai đại lượng vectơ đặc trưng cho chuyển động và tương tác lực (Δp = F·Δt).",
          "2. Định luật bảo toàn động lượng: Tổng động lượng hệ kín bảo toàn p' = p (phải xét tính vectơ và chiếu lên trục tọa độ).",
          "3. Hai mô hình chuyển động nền tảng: Va chạm mềm v = (m₁v₁)/(m₁+m₂) và Chuyển động bằng phản lực V = -(m/M)v.",
        ],
      },
    };
  }

  // DEFAULT FALLBACK FOR ANY OTHER LESSON (GRADES 10, 11, 12)
  const knowledge = activity.objectives?.knowledge || [
    "Khái niệm và định nghĩa vật lí theo SGK",
    "Quy luật biến đổi của các đại lượng đo lường",
  ];
  const firstTask = activity.studentWorksheet?.tasks?.[0];

  return {
    grade: grade,
    chapterName: topic.chapterTitle || `Chương trình Vật lí ${grade}`,
    lessonName: topic.lessonTitle,
    mainConceptTitle: `I. KHÁI NIỆM VÀ ĐỊNH NGHĨA TRỌNG TÂM SGK`,
    treeDiagram: {
      parentBoxTitle: `${topic.lessonTitle.toUpperCase()}\nQuy luật vật lí cốt lõi`,
      parentBoxSubtitle: "(Hệ thống kiến thức trọng tâm theo Chương trình GDPT 2018)",
      childBoxes: [
        knowledge[0] || "Định nghĩa bản chất hiện tượng vật lí theo chuẩn SGK",
        knowledge[1] || "Mối quan hệ định lượng giữa các đại lượng đo lường",
        "Điều kiện nghiệm đúng và giới hạn áp dụng của mô hình vật lí",
        "Phương pháp khảo sát thực nghiệm và thu thập số liệu",
        "Ý nghĩa thực tiễn và ứng dụng trong khoa học công nghệ",
      ],
    },
    theory: {
      sectionTitle: "II. BẢN CHẤT VẬT LÍ VÀ NGUYÊN LÍ KHOA HỌC",
      colLeft: {
        title: "1. ĐỊNH NGHĨA VÀ NGUYÊN LÍ CỐT LÕI",
        bullets: [
          `• ${knowledge[0] || "Nêu rõ định nghĩa bản chất của hiện tượng vật lí."}`,
          "• Phân tích cơ chế tác động và tương tác giữa các phần tử của hệ.",
          "• Thiết lập mối quan hệ nhân quả trong quá trình biến đổi trạng thái.",
        ],
      },
      colRight: {
        title: "2. CÁC TÍNH CHẤT VÀ QUY LUẬT NỀN TẢNG",
        bullets: [
          `• ${knowledge[1] || "Các đặc điểm đo lường định lượng của đại lượng."}`,
          "• Phạm vi áp dụng của định luật trong điều kiện thực tế.",
          "• Mối liên hệ với các định luật bảo toàn trong tự nhiên.",
        ],
      },
    },
    formulaSection: {
      sectionTitle: "III. HỆ THỐNG CÔNG THỨC TOÁN - LÍ VÀ ĐƠN VỊ SI",
      conceptText: "Biểu thức toán học mô tả mối quan hệ định lượng giữa các đại lượng vật lí đặc trưng của bài học.",
      heroFormula: activity.product?.match(/[A-Za-z0-9_]+\s*=\s*[^,.]+/)?.[0] || "Y = f(X) [Công thức chuẩn SGK]",
      units: [
        { symbol: "Đại lượng chính", name: "Đại lượng vật lí cần xác định", unit: "Đơn vị đo chuẩn trong hệ SI" },
        { symbol: "Tham số đo", name: "Đại lượng đo lường thực nghiệm", unit: "Chuẩn SGK" },
      ],
      signRules: [
        "Xác định đúng hệ quy chiếu, chiều dương và mốc tính toán ban đầu.",
        "Quy ước dấu đại số của các đại lượng vectơ và giá trị đại số.",
      ],
    },
    mechanismSection: {
      sectionTitle: "IV. CƠ CHẾ VẬN HÀNH VÀ QUY TẮC ĐẠI SỐ",
      lawTitle: "ĐỊNH LUẬT VẬT LÍ TRỌNG TÂM",
      lawStatement: "Nội dung định luật và phương pháp xác định các thông số trạng thái trong hệ vật lí đang xét.",
      energyRelation: "Mối liên hệ năng lượng và định luật bảo toàn trong hệ",
      rules: [
        "• Quy tắc xác định chiều biến thiên của các đại lượng vật lí.",
        "• Điều kiện để hệ đạt trạng thái cân bằng hoặc ổn định.",
        "• Phương pháp giải bài toán định lượng bám sát SGK.",
      ],
    },
    applicationsSection: {
      sectionTitle: "V. ỨNG DỤNG THỰC TẾ TRONG KĨ THUẬT VÀ ĐỜI SỐNG",
      apps: [
        {
          code: "5.1",
          name: "Ứng dụng trong Kĩ thuật và Công nghệ hiện đại",
          desc: "Tối ưu hóa thiết bị máy móc, tự động hóa đo lường và phát triển các vật liệu công nghệ mới.",
        },
        {
          code: "5.2",
          name: "Ứng dụng trong Đời sống và Sản xuất",
          desc: "Giải thích các hiện tượng tự nhiên xung quanh và nâng cao hiệu quả an toàn trong sinh hoạt.",
        },
        {
          code: "5.3",
          name: "Chế tạo thiết bị kĩ thuật STEM",
          desc: "Vận dụng nguyên lí khoa học để chế tạo các mô hình thực nghiệm và thiết bị đo sáng tạo.",
        },
      ],
    },
    exampleSection: {
      sectionTitle: "VI. BÀI TẬP VẬN DỤNG SGK VÀ GHI NHỚ TRỌNG TÂM",
      examplePrompt: firstTask?.prompt || `Vận dụng công thức của bài học để giải bài toán định lượng cơ bản trong SGK Vật lí ${grade}?`,
      solutionSteps: [
        "Bước 1: Tóm tắt đề bài, đổi các đại lượng về đơn vị đo lường chuẩn SI.",
        "Bước 2: Viết công thức vật lí tương ứng và giải phương trình tìm ẩn số.",
        "Bước 3: Thay số và kiểm tra tính hợp lí của kết quả.",
      ],
      finalResult: firstTask?.expectedAnswer || "Kết quả tính toán chuẩn xác theo phương pháp giải mẫu mực SGK.",
      takeaways: [
        "1. Nắm chắc định nghĩa bản chất và phạm vi nghiệm đúng của định luật.",
        "2. Thuộc lòng công thức trọng tâm và ý nghĩa các đại lượng trong hệ SI.",
        "3. Rèn luyện kĩ năng giải bài toán định lượng và liên hệ thực tế.",
      ],
    },
  };
}

/**
 * Main export function creating a 7-slide Canva-inspired presentation
 * Strictly adhering to user's uploaded reference photos:
 * - Top Crimson/Red banner
 * - Hierarchical numbered textbook headings (Chương, Bài, Đề mục)
 * - Logical tree diagram with connector brackets on Slide 2 (Image 1)
 * - Drop-shadow cards on Slides 3, 4, 5, 6, 7 (Image 2 & 3)
 * - Bottom accent bar and rounded page badge [01] ... [07]
 * - Strictly 100% textbook knowledge (Zero lesson plan, zero PPCT)
 */
export async function exportActivityToPowerPoint(
  topic: LessonTopic,
  activity: LessonActivity,
  bookSeries: BookSeries = "ket_noi_tri_thuc"
) {
  const pptx = new pptxgen();

  // 16:9 widescreen layout: 13.33 x 7.5 inches
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Ban Chuyen Mon Vat Li - THPT Trung Vuong";
  pptx.company = "Bo GD va DT - Truong THPT Trung Vuong";
  pptx.title = `${topic.lessonTitle.replace(/&/g, "va")} - Vat li ${topic.grade}`;
  pptx.subject = `Bai giang Dien tu Chuan Kien thuc SGK Vat li ${topic.grade}`;

  // Get pure textbook data
  const data = getPureTextbookContent(topic, activity);

  // Palette from user reference images: Clean White Canvas, Bold Crimson/Red Banner, Navy & Sky Accents
  const COLORS = {
    canvasBg: "FFFFFF",        // Pure white background (như hình mẫu)
    bannerRed: "B91C1C",       // Deep Crimson Red banner (#B91C1C / #991B1B)
    bannerRedBorder: "991B1B",
    headerDark: "0F172A",      // Crisp bold title text
    textDark: "1E293B",        // Primary readable text
    textMuted: "64748B",       // Subtitle & secondary notes
    treeBoxBorder: "2563EB",   // Blue border for tree boxes (như Image 1)
    treeBoxFill: "F8FAFC",     // Light pristine tint
    treeParentFill: "EFF6FF",  // Parent concept box fill
    accentAmber: "D97706",     // Amber highlight
    accentGreen: "059669",     // Green highlight
    accentSky: "0284C7",       // Sky blue highlight
    lineDivider: "CBD5E1",     // Divider line
    shadowColor: "94A3B8",     // Soft drop shadow
  };

  const FONT_NAME = "Times New Roman";

  // Helper: Draw Slide Master based on user reference photos
  const applyReferenceSlideMaster = (
    slide: any,
    slideNumber: number,
    sectionHeading: string,
    subHeading: string = data.lessonName
  ) => {
    // 1. Pristine white background
    slide.background = { color: COLORS.canvasBg };

    // 2. Top Crimson/Red Banner (như tất cả 4 ảnh mẫu của người dùng)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.5,
      y: 0.18,
      w: 10.33,
      h: 0.5,
      rectRadius: 0.08,
      fill: { color: COLORS.bannerRed },
      line: { color: COLORS.bannerRedBorder, width: 1.2 },
    });

    slide.addText(`BÀI GIẢNG VẬT LÍ ${data.grade} — CHƯƠNG TRÌNH SGK GDPT 2018`, {
      x: 1.5,
      y: 0.18,
      w: 10.33,
      h: 0.5,
      fontFace: FONT_NAME,
      fontSize: 14,
      bold: true,
      color: "FFFFFF",
      align: "center",
      valign: "middle",
    });

    // 3. Hierarchical Numbered Headings (Phân cấp đề mục chuẩn SGK như Image 1 & 2)
    // Dòng 1: Tên chương
    slide.addText(data.chapterName, {
      x: 0.8,
      y: 0.78,
      w: 11.73,
      h: 0.35,
      fontFace: FONT_NAME,
      fontSize: 18,
      bold: true,
      color: COLORS.headerDark,
      valign: "middle",
    });

    // Dòng 2 & 3: Tên bài & Đề mục kiến thức SGK
    slide.addText(
      [
        { text: `${subHeading} — `, options: { fontSize: 20, bold: true, color: COLORS.bannerRed } },
        { text: sectionHeading, options: { fontSize: 20, bold: true, color: COLORS.headerDark } },
      ],
      {
        x: 0.8,
        y: 1.15,
        w: 11.73,
        h: 0.45,
        fontFace: FONT_NAME,
        valign: "middle",
      }
    );

    // 4. Subtle horizontal divider line below headings
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.68,
      w: 11.73,
      h: 0.02,
      fill: { color: COLORS.bannerRed },
    });

    // 5. Bottom Footer (như Image 1, 2, 3): Accent line + Page badge
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 6.55,
      w: 10.2,
      h: 0.03,
      fill: { color: COLORS.bannerRed },
    });

    slide.addText(`Vật lí ${data.grade} — Bộ sách Kết nối tri thức với cuộc sống`, {
      x: 0.8,
      y: 6.68,
      w: 8.5,
      h: 0.35,
      fontFace: FONT_NAME,
      fontSize: 11.5,
      italic: true,
      color: COLORS.textMuted,
    });

    // Rounded Page Indicator Badge at bottom-right (như [22] và [17] trong ảnh mẫu)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 11.4,
      y: 6.45,
      w: 1.1,
      h: 0.42,
      rectRadius: 0.08,
      fill: { color: "FFFFFF" },
      line: { color: COLORS.bannerRed, width: 1.2 },
    });

    slide.addText(`[0${slideNumber}]`, {
      x: 11.4,
      y: 6.45,
      w: 1.1,
      h: 0.42,
      fontFace: FONT_NAME,
      fontSize: 12,
      bold: true,
      color: COLORS.bannerRed,
      align: "center",
      valign: "middle",
    });
  };

  // Safe vertical bounds for cards: strictly Y: 1.85 to 6.25 (Height 4.4")
  const contentY = 1.85;

  // =========================================================================
  // SLIDE 1: BÌA BÀI HỌC CHUẨN SÁCH GIÁO KHOA
  // =========================================================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: COLORS.canvasBg };

  // Top banner
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 1.5,
    y: 0.25,
    w: 10.33,
    h: 0.55,
    rectRadius: 0.08,
    fill: { color: COLORS.bannerRed },
    line: { color: COLORS.bannerRedBorder, width: 1.5 },
  });
  slide1.addText(`BÀI GIẢNG VẬT LÍ ${data.grade} — CHƯƠNG TRÌNH SGK GDPT 2018`, {
    x: 1.5,
    y: 0.25,
    w: 10.33,
    h: 0.55,
    fontFace: FONT_NAME,
    fontSize: 15,
    bold: true,
    color: "FFFFFF",
    align: "center",
    valign: "middle",
  });

  // Main Card Container with soft shadow
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.05,
    w: 11.73,
    h: 5.2,
    rectRadius: 0.15,
    fill: { color: "FFFFFF" },
    line: { color: "CBD5E1", width: 1.5 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 10, offset: 4, angle: 45, opacity: 0.18 },
  });

  // Left red decorative stripe
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.05,
    w: 0.22,
    h: 5.2,
    fill: { color: COLORS.bannerRed },
  });

  // Chapter & Subject subtitle
  slide1.addText(
    [
      { text: `MÔN VẬT LÍ ${data.grade} • `, options: { fontSize: 16, bold: true, color: COLORS.bannerRed } },
      { text: `${data.chapterName.toUpperCase()}\n`, options: { fontSize: 16, bold: true, color: COLORS.textDark } },
      { text: "BỘ SÁCH GIÁO KHOA: KẾT NỐI TRI THỨC VỚI CUỘC SỐNG", options: { fontSize: 13, color: COLORS.textMuted } },
    ],
    {
      x: 1.35,
      y: 1.3,
      w: 10.8,
      h: 0.85,
      fontFace: FONT_NAME,
    }
  );

  // Big Lesson Title
  slide1.addText(data.lessonName.toUpperCase(), {
    x: 1.35,
    y: 2.25,
    w: 10.8,
    h: 1.2,
    fontFace: FONT_NAME,
    fontSize: 32,
    bold: true,
    color: COLORS.headerDark,
    valign: "middle",
  });

  // 4 Core Textbook Content Sections (Khung tóm tắt 4 mục bài học SGK)
  const overviewCards = [
    { title: "MỤC I", desc: "Công của lực điện trong điện trường đều", col: "2563EB", bg: "EFF6FF" },
    { title: "MỤC II", desc: "Đặc điểm của lực thế & tính chất trường thế", col: "059669", bg: "ECFDF5" },
    { title: "MỤC III", desc: "Thế năng của điện tích trong điện trường", col: "D97706", bg: "FFFBEB" },
    { title: "MỤC IV", desc: "Mối liên hệ giữa công và độ giảm thế năng", col: "7C3AED", bg: "F5F3FF" },
  ];

  overviewCards.forEach((c, i) => {
    const cx = 1.35 + i * 2.7;
    const cy = 3.75;
    slide1.addShape(pptx.ShapeType.roundRect, {
      x: cx,
      y: cy,
      w: 2.55,
      h: 1.6,
      rectRadius: 0.1,
      fill: { color: c.bg },
      line: { color: c.col, width: 1.5 },
      shadow: { type: "outer", color: COLORS.shadowColor, blur: 6, offset: 2, angle: 45, opacity: 0.15 },
    });
    slide1.addText(
      [
        { text: `${c.title}\n`, options: { fontSize: 13, bold: true, color: c.col } },
        { text: c.desc, options: { fontSize: 14, bold: true, color: COLORS.textDark } },
      ],
      {
        x: cx + 0.15,
        y: cy + 0.15,
        w: 2.25,
        h: 1.3,
        fontFace: FONT_NAME,
        align: "center",
        valign: "middle",
      }
    );
  });

  // Slide 1 footer page badge
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 11.4,
    y: 6.45,
    w: 1.1,
    h: 0.42,
    rectRadius: 0.08,
    fill: { color: "FFFFFF" },
    line: { color: COLORS.bannerRed, width: 1.2 },
  });
  slide1.addText("[01]", {
    x: 11.4,
    y: 6.45,
    w: 1.1,
    h: 0.42,
    fontFace: FONT_NAME,
    fontSize: 12,
    bold: true,
    color: COLORS.bannerRed,
    align: "center",
    valign: "middle",
  });

  // =========================================================================
  // SLIDE 2: SƠ ĐỒ NHÁNH LOGIC CHUẨN IMAGE 1
  // Layout: Left Parent Box -> Connector lines -> Right Stack of 5 Child Boxes
  // =========================================================================
  const slide2 = pptx.addSlide();
  applyReferenceSlideMaster(slide2, 2, "I. CÔNG CỦA LỰC ĐIỆN TRONG ĐIỆN TRƯỜNG ĐỀU");

  // Left Parent Box (Khối mẹ bên trái như Image 1)
  const parentX = 0.8;
  const parentY = 2.0;
  const parentW = 3.6;
  const parentH = 4.2;

  slide2.addShape(pptx.ShapeType.roundRect, {
    x: parentX,
    y: parentY,
    w: parentW,
    h: parentH,
    rectRadius: 0.12,
    fill: { color: COLORS.treeParentFill },
    line: { color: COLORS.treeBoxBorder, width: 2 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 8, offset: 3, angle: 45, opacity: 0.18 },
  });

  // Header ribbon inside parent box
  slide2.addShape(pptx.ShapeType.rect, {
    x: parentX,
    y: parentY,
    w: parentW,
    h: 0.6,
    fill: { color: "2563EB" },
  });
  slide2.addText("KHÁI NIỆM & CÔNG THỨC SGK", {
    x: parentX,
    y: parentY,
    w: parentW,
    h: 0.6,
    fontFace: FONT_NAME,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    align: "center",
    valign: "middle",
  });

  slide2.addText(
    [
      { text: `${data.treeDiagram.parentBoxTitle}\n\n`, options: { fontSize: 20, bold: true, color: "1E40AF" } },
      { text: `${data.treeDiagram.parentBoxSubtitle}`, options: { fontSize: 16, color: COLORS.textDark, italic: true } },
    ],
    {
      x: parentX + 0.25,
      y: parentY + 0.85,
      w: parentW - 0.5,
      h: parentH - 1.05,
      fontFace: FONT_NAME,
      align: "center",
      valign: "middle",
    }
  );

  // Branch lines (Đường nhánh rẽ như trong ảnh mẫu)
  // Main horizontal stub out of parent box
  slide2.addShape(pptx.ShapeType.line, {
    x: parentX + parentW,
    y: parentY + parentH / 2,
    w: 0.5,
    h: 0,
    line: { color: COLORS.treeBoxBorder, width: 2 },
  });
  // Vertical branch line
  const branchX = parentX + parentW + 0.5; // 4.9
  const childStartY = 1.95;
  const childGap = 0.88;
  const childCount = data.treeDiagram.childBoxes.length; // 5
  const branchTopY = childStartY + 0.35;
  const branchBottomY = childStartY + (childCount - 1) * childGap + 0.35;

  slide2.addShape(pptx.ShapeType.line, {
    x: branchX,
    y: branchTopY,
    w: 0,
    h: branchBottomY - branchTopY,
    line: { color: COLORS.treeBoxBorder, width: 2 },
  });

  // Right Stack of 5 Child Boxes (như Image 1)
  const childX = branchX + 0.5; // 5.4
  const childW = 7.1;
  const childH = 0.72;

  data.treeDiagram.childBoxes.forEach((boxText, idx) => {
    const cy = childStartY + idx * childGap;

    // Horizontal stub into child box
    slide2.addShape(pptx.ShapeType.line, {
      x: branchX,
      y: cy + childH / 2,
      w: 0.5,
      h: 0,
      line: { color: COLORS.treeBoxBorder, width: 2 },
    });

    // Child Box container
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: childX,
      y: cy,
      w: childW,
      h: childH,
      rectRadius: 0.08,
      fill: { color: COLORS.treeBoxFill },
      line: { color: COLORS.treeBoxBorder, width: 1.4 },
      shadow: { type: "outer", color: COLORS.shadowColor, blur: 5, offset: 2, angle: 45, opacity: 0.12 },
    });

    slide2.addText(boxText, {
      x: childX + 0.25,
      y: cy,
      w: childW - 0.5,
      h: childH,
      fontFace: FONT_NAME,
      fontSize: 16,
      bold: idx === 0 || idx === 3,
      color: COLORS.textDark,
      valign: "middle",
    });
  });

  // =========================================================================
  // SLIDE 3: BẢN CHẤT LỰC THẾ & TÍNH CHẤT TRƯỜNG THẾ (IMAGE 2 STYLE)
  // =========================================================================
  const slide3 = pptx.addSlide();
  applyReferenceSlideMaster(slide3, 3, "II. ĐẶC ĐIỂM CỦA LỰC THẾ VÀ TÍNH CHẤT TRƯỜNG THẾ");

  const colW = 5.7;
  const colLeftX = 0.8;
  const colRightX = 6.8;
  const cardH = 4.3;

  // Left Card: Điện trường tĩnh
  slide3.addShape(pptx.ShapeType.roundRect, {
    x: colLeftX,
    y: contentY,
    w: colW,
    h: cardH,
    rectRadius: 0.12,
    fill: { color: "FFFFFF" },
    line: { color: "3B82F6", width: 1.5 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 8, offset: 3, angle: 45, opacity: 0.15 },
  });
  slide3.addShape(pptx.ShapeType.rect, {
    x: colLeftX,
    y: contentY,
    w: colW,
    h: 0.52,
    fill: { color: "2563EB" },
  });
  slide3.addText(data.theory.colLeft.title, {
    x: colLeftX + 0.25,
    y: contentY,
    w: colW - 0.5,
    h: 0.52,
    fontFace: FONT_NAME,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    valign: "middle",
  });
  slide3.addText(
    data.theory.colLeft.bullets.map((b) => ({
      text: `${b}\n\n`,
      options: { fontSize: 18, color: COLORS.textDark },
    })),
    {
      x: colLeftX + 0.35,
      y: contentY + 0.75,
      w: colW - 0.7,
      h: cardH - 0.95,
      fontFace: FONT_NAME,
      valign: "top",
    }
  );

  // Right Card: So sánh tương đồng với trọng trường
  slide3.addShape(pptx.ShapeType.roundRect, {
    x: colRightX,
    y: contentY,
    w: colW,
    h: cardH,
    rectRadius: 0.12,
    fill: { color: "FFFFFF" },
    line: { color: "10B981", width: 1.5 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 8, offset: 3, angle: 45, opacity: 0.15 },
  });
  slide3.addShape(pptx.ShapeType.rect, {
    x: colRightX,
    y: contentY,
    w: colW,
    h: 0.52,
    fill: { color: "059669" },
  });
  slide3.addText(data.theory.colRight.title, {
    x: colRightX + 0.25,
    y: contentY,
    w: colW - 0.5,
    h: 0.52,
    fontFace: FONT_NAME,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    valign: "middle",
  });
  slide3.addText(
    data.theory.colRight.bullets.map((b) => ({
      text: `${b}\n\n`,
      options: { fontSize: 18, color: COLORS.textDark },
    })),
    {
      x: colRightX + 0.35,
      y: contentY + 0.75,
      w: colW - 0.7,
      h: cardH - 0.95,
      fontFace: FONT_NAME,
      valign: "top",
    }
  );

  // =========================================================================
  // SLIDE 4: THẾ NĂNG ĐIỆN & CÔNG THỨC TRỌNG TÂM (IMAGE 3 STYLE)
  // =========================================================================
  const slide4 = pptx.addSlide();
  applyReferenceSlideMaster(slide4, 4, "III. THẾ NĂNG CỦA ĐIỆN TÍCH TRONG ĐIỆN TRƯỜNG");

  // Left Column: Khái niệm & Quy ước mốc thế năng
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: colLeftX,
    y: contentY,
    w: colW,
    h: cardH,
    rectRadius: 0.12,
    fill: { color: "FFFFFF" },
    line: { color: "F59E0B", width: 1.5 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 8, offset: 3, angle: 45, opacity: 0.15 },
  });
  slide4.addShape(pptx.ShapeType.rect, {
    x: colLeftX,
    y: contentY,
    w: colW,
    h: 0.52,
    fill: { color: "D97706" },
  });
  slide4.addText("1. ĐỊNH NGHĨA THẾ NĂNG ĐIỆN SGK", {
    x: colLeftX + 0.25,
    y: contentY,
    w: colW - 0.5,
    h: 0.52,
    fontFace: FONT_NAME,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    valign: "middle",
  });
  slide4.addText(
    [
      { text: "• Định nghĩa khoa học:\n", options: { fontSize: 19, bold: true, color: "D97706" } },
      { text: `${data.formulaSection.conceptText}\n\n`, options: { fontSize: 18, color: COLORS.textDark } },
      { text: "• Quy ước mốc thế năng:\n", options: { fontSize: 19, bold: true, color: "2563EB" } },
      ...(data.formulaSection.signRules.map((rule) => ({
        text: `✓ ${rule}\n`,
        options: { fontSize: 18, color: COLORS.textDark },
      }))),
    ],
    {
      x: colLeftX + 0.35,
      y: contentY + 0.75,
      w: colW - 0.7,
      h: cardH - 0.95,
      fontFace: FONT_NAME,
      valign: "top",
    }
  );

  // Right Column: Hero Formula Box & Đơn vị SI (như Image 3)
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: colRightX,
    y: contentY,
    w: colW,
    h: cardH,
    rectRadius: 0.12,
    fill: { color: "FFFFFF" },
    line: { color: "F59E0B", width: 1.5 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 8, offset: 3, angle: 45, opacity: 0.15 },
  });
  slide4.addShape(pptx.ShapeType.rect, {
    x: colRightX,
    y: contentY,
    w: colW,
    h: 0.52,
    fill: { color: "B45309" },
  });
  slide4.addText("2. BIỂU THỨC TOÁN - LÍ VÀ ĐƠN VỊ ĐO SI", {
    x: colRightX + 0.25,
    y: contentY,
    w: colW - 0.5,
    h: 0.52,
    fontFace: FONT_NAME,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    valign: "middle",
  });

  // Glowing Formula Box
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: colRightX + 0.35,
    y: contentY + 0.75,
    w: colW - 0.7,
    h: 1.05,
    rectRadius: 0.1,
    fill: { color: "FFFBEB" },
    line: { color: "F59E0B", width: 2 },
    shadow: { type: "outer", color: "F59E0B", blur: 6, offset: 2, angle: 45, opacity: 0.2 },
  });
  slide4.addText(data.formulaSection.heroFormula, {
    x: colRightX + 0.45,
    y: contentY + 0.8,
    w: colW - 0.9,
    h: 0.95,
    fontFace: FONT_NAME,
    fontSize: 26,
    bold: true,
    color: "B45309",
    align: "center",
    valign: "middle",
  });

  // Unit Legend
  slide4.addText(
    [
      { text: "Ý NGHĨA CÁC ĐẠI LƯỢNG TRONG HỆ SI:\n", options: { fontSize: 18, bold: true, color: "D97706" } },
      ...(data.formulaSection.units.map((u) => ({
        text: `• ${u.symbol}: ${u.name} (${u.unit})\n`,
        options: { fontSize: 17, color: COLORS.textDark },
      }))),
    ],
    {
      x: colRightX + 0.35,
      y: contentY + 1.95,
      w: colW - 0.7,
      h: cardH - 2.1,
      fontFace: FONT_NAME,
      valign: "top",
    }
  );

  // =========================================================================
  // SLIDE 5: ĐỊNH LÍ ĐỘ GIẢM THẾ NĂNG & QUY ƯỚC DẤU (IMAGE 4 STYLE)
  // =========================================================================
  const slide5 = pptx.addSlide();
  applyReferenceSlideMaster(slide5, 5, "IV. MỐI LIÊN HỆ GIỮA CÔNG VÀ ĐỘ GIẢM THẾ NĂNG");

  // Left Column: Định lí độ giảm thế năng
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: colLeftX,
    y: contentY,
    w: colW,
    h: cardH,
    rectRadius: 0.12,
    fill: { color: "FFFFFF" },
    line: { color: "2563EB", width: 1.5 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 8, offset: 3, angle: 45, opacity: 0.15 },
  });
  slide5.addShape(pptx.ShapeType.rect, {
    x: colLeftX,
    y: contentY,
    w: colW,
    h: 0.52,
    fill: { color: "1D4ED8" },
  });
  slide5.addText("1. ĐỊNH LÍ BIẾN THIÊN THẾ NĂNG", {
    x: colLeftX + 0.25,
    y: contentY,
    w: colW - 0.5,
    h: 0.52,
    fontFace: FONT_NAME,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    valign: "middle",
  });

  // Law Box
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: colLeftX + 0.35,
    y: contentY + 0.75,
    w: colW - 0.7,
    h: 0.95,
    rectRadius: 0.08,
    fill: { color: "EFF6FF" },
    line: { color: "2563EB", width: 2 },
  });
  slide5.addText(data.mechanismSection.energyRelation, {
    x: colLeftX + 0.45,
    y: contentY + 0.8,
    w: colW - 0.9,
    h: 0.85,
    fontFace: FONT_NAME,
    fontSize: 24,
    bold: true,
    color: "1E40AF",
    align: "center",
    valign: "middle",
  });

  slide5.addText(
    [
      { text: "• Nội dung định lí:\n", options: { fontSize: 18, bold: true, color: "1D4ED8" } },
      { text: `${data.mechanismSection.lawStatement}\n\n`, options: { fontSize: 17, color: COLORS.textDark } },
      { text: "• Ý nghĩa bảo toàn cơ năng:\n", options: { fontSize: 18, bold: true, color: "059669" } },
      { text: "Khi lực điện sinh công phát động (A > 0), thế năng giảm để chuyển hóa thành động năng của hạt mang điện.", options: { fontSize: 17, color: COLORS.textDark } },
    ],
    {
      x: colLeftX + 0.35,
      y: contentY + 1.85,
      w: colW - 0.7,
      h: cardH - 2.0,
      fontFace: FONT_NAME,
      valign: "top",
    }
  );

  // Right Column: Bảng quy ước dấu đại số
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: colRightX,
    y: contentY,
    w: colW,
    h: cardH,
    rectRadius: 0.12,
    fill: { color: "FFFFFF" },
    line: { color: "EF4444", width: 1.5 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 8, offset: 3, angle: 45, opacity: 0.15 },
  });
  slide5.addShape(pptx.ShapeType.rect, {
    x: colRightX,
    y: contentY,
    w: colW,
    h: 0.52,
    fill: { color: "DC2626" },
  });
  slide5.addText("2. QUY ƯỚC DẤU ĐẠI SỐ TRỌNG TÂM", {
    x: colRightX + 0.25,
    y: contentY,
    w: colW - 0.5,
    h: 0.52,
    fontFace: FONT_NAME,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    valign: "middle",
  });
  slide5.addText(
    data.mechanismSection.rules.map((r) => ({
      text: `${r}\n\n`,
      options: { fontSize: 18, color: COLORS.textDark },
    })),
    {
      x: colRightX + 0.35,
      y: contentY + 0.75,
      w: colW - 0.7,
      h: cardH - 0.95,
      fontFace: FONT_NAME,
      valign: "top",
    }
  );

  // =========================================================================
  // SLIDE 6: ỨNG DỤNG THỰC TẾ & CÔNG NGHỆ HIỆN ĐẠI
  // =========================================================================
  const slide6 = pptx.addSlide();
  applyReferenceSlideMaster(slide6, 6, "V. ỨNG DỤNG THỰC TẾ CỦA ĐIỆN TRƯỜNG VÀ THẾ NĂNG ĐIỆN");

  data.applicationsSection.apps.forEach((app, idx) => {
    const cardY = contentY + idx * 1.45;
    slide6.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: cardY,
      w: 11.73,
      h: 1.25,
      rectRadius: 0.1,
      fill: { color: "FFFFFF" },
      line: { color: idx === 0 ? "2563EB" : idx === 1 ? "059669" : "7C3AED", width: 1.5 },
      shadow: { type: "outer", color: COLORS.shadowColor, blur: 6, offset: 2, angle: 45, opacity: 0.12 },
    });

    // Badge code
    slide6.addShape(pptx.ShapeType.roundRect, {
      x: 1.05,
      y: cardY + 0.18,
      w: 0.8,
      h: 0.88,
      rectRadius: 0.08,
      fill: { color: idx === 0 ? "EFF6FF" : idx === 1 ? "ECFDF5" : "F5F3FF" },
      line: { color: idx === 0 ? "2563EB" : idx === 1 ? "059669" : "7C3AED", width: 1.5 },
    });
    slide6.addText(app.code, {
      x: 1.05,
      y: cardY + 0.18,
      w: 0.8,
      h: 0.88,
      fontFace: FONT_NAME,
      fontSize: 18,
      bold: true,
      color: idx === 0 ? "1E40AF" : idx === 1 ? "065F46" : "6D28D9",
      align: "center",
      valign: "middle",
    });

    slide6.addText(
      [
        { text: `${app.name}\n`, options: { fontSize: 19, bold: true, color: COLORS.headerDark } },
        { text: app.desc, options: { fontSize: 16, color: COLORS.textDark } },
      ],
      {
        x: 2.1,
        y: cardY + 0.12,
        w: 10.2,
        h: 1.0,
        fontFace: FONT_NAME,
        valign: "middle",
      }
    );
  });

  // =========================================================================
  // SLIDE 7: BÀI TẬP VÍ DỤ SGK CÓ LỜI GIẢI CHI TIẾT & GHI NHỚ TRỌNG TÂM
  // =========================================================================
  const slide7 = pptx.addSlide();
  applyReferenceSlideMaster(slide7, 7, "VI. BÀI TẬP VẬN DỤNG SGK VÀ GHI NHỚ TRỌNG TÂM");

  // Left Column: Bài tập mẫu SGK
  slide7.addShape(pptx.ShapeType.roundRect, {
    x: colLeftX,
    y: contentY,
    w: colW,
    h: cardH,
    rectRadius: 0.12,
    fill: { color: "FFFFFF" },
    line: { color: "2563EB", width: 1.5 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 8, offset: 3, angle: 45, opacity: 0.15 },
  });
  slide7.addShape(pptx.ShapeType.rect, {
    x: colLeftX,
    y: contentY,
    w: colW,
    h: 0.52,
    fill: { color: "1D4ED8" },
  });
  slide7.addText("1. VÍ DỤ MẪU SGK CÓ LỜI GIẢI CHI TIẾT", {
    x: colLeftX + 0.25,
    y: contentY,
    w: colW - 0.5,
    h: 0.52,
    fontFace: FONT_NAME,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    valign: "middle",
  });
  slide7.addText(
    [
      { text: "• Đề bài mẫu SGK:\n", options: { fontSize: 18, bold: true, color: "1D4ED8" } },
      { text: `${data.exampleSection.examplePrompt}\n\n`, options: { fontSize: 17, color: COLORS.textDark } },
      { text: "• Các bước giải chi tiết:\n", options: { fontSize: 18, bold: true, color: "D97706" } },
      ...(data.exampleSection.solutionSteps.map((step) => ({
        text: `✓ ${step}\n`,
        options: { fontSize: 17, color: COLORS.textDark },
      }))),
      { text: "\n=> ĐÁP SỐ CHUẨN: ", options: { fontSize: 18, bold: true, color: "059669" } },
      { text: `${data.exampleSection.finalResult}`, options: { fontSize: 17, bold: true, color: COLORS.headerDark } },
    ],
    {
      x: colLeftX + 0.35,
      y: contentY + 0.75,
      w: colW - 0.7,
      h: cardH - 0.95,
      fontFace: FONT_NAME,
      valign: "top",
    }
  );

  // Right Column: Ghi nhớ cốt lõi SGK
  slide7.addShape(pptx.ShapeType.roundRect, {
    x: colRightX,
    y: contentY,
    w: colW,
    h: cardH,
    rectRadius: 0.12,
    fill: { color: "FFFFFF" },
    line: { color: "059669", width: 1.5 },
    shadow: { type: "outer", color: COLORS.shadowColor, blur: 8, offset: 3, angle: 45, opacity: 0.15 },
  });
  slide7.addShape(pptx.ShapeType.rect, {
    x: colRightX,
    y: contentY,
    w: colW,
    h: 0.52,
    fill: { color: "047857" },
  });
  slide7.addText("2. CÁC NỘI DUNG CỐT LÕI BẮT BUỘC GHI NHỚ", {
    x: colRightX + 0.25,
    y: contentY,
    w: colW - 0.5,
    h: 0.52,
    fontFace: FONT_NAME,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    valign: "middle",
  });
  slide7.addText(
    [
      ...(data.exampleSection.takeaways.map((item, idx) => ([
        { text: `★ GHI NHỚ TRỌNG TÂM ${idx + 1}:\n`, options: { fontSize: 19, bold: true, color: "D97706" } },
        { text: `${item}\n\n`, options: { fontSize: 18, color: COLORS.textDark } },
      ])).flat()),
      { text: "Chúc các em học tốt và nắm vững kiến thức Vật lí!", options: { fontSize: 18, bold: true, color: "059669", italic: true } },
    ],
    {
      x: colRightX + 0.35,
      y: contentY + 0.75,
      w: colW - 0.7,
      h: cardH - 0.95,
      fontFace: FONT_NAME,
      valign: "top",
    }
  );

  // Generate and save PowerPoint file
  const fileName = `BaiGiang_SGK_${topic.lessonTitle.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, "_")}_VatLi_${topic.grade}.pptx`;
  await pptx.writeFile({ fileName });
  return fileName;
}

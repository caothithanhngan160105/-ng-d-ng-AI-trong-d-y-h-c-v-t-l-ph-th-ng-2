import { LessonTopic, LessonActivity, BookSeries } from "../types/physics";
import { formatMathForWord } from "../components/MathText";

export function exportActivityToWordDoc(
  topic: LessonTopic,
  activity: LessonActivity,
  bookSeries: BookSeries,
  teacherName = "Giáo viên Vật lí",
  schoolName = "Trường THPT"
) {
  const bookSeriesLabel = "Bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)";

  // Helper to format string with math and newlines for Word
  const fmt = (text: string | undefined | null) => {
    if (!text) return "";
    return formatMathForWord(text).replace(/\n/g, "<br>");
  };

  const contentHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${activity.activityTitle}</title>
      <style>
        body, p, table, th, td, div, span, li { font-family: 'Times New Roman', Times, serif !important; font-size: 13pt; line-height: 1.4; color: #000; }
        h1 { font-family: 'Times New Roman', Times, serif !important; font-size: 15pt; text-align: center; text-transform: uppercase; margin-bottom: 4px; font-weight: bold; }
        h2 { font-family: 'Times New Roman', Times, serif !important; font-size: 13pt; text-align: center; font-weight: normal; margin-top: 0; }
        h3 { font-family: 'Times New Roman', Times, serif !important; font-size: 13pt; font-weight: bold; margin-top: 14px; margin-bottom: 6px; text-transform: uppercase; }
        h4 { font-family: 'Times New Roman', Times, serif !important; font-size: 13pt; font-weight: bold; font-style: italic; margin-top: 10px; margin-bottom: 4px; }
        p { margin-top: 4px; margin-bottom: 4px; text-align: justify; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 8px; }
        th, td { border: 1px solid #000; padding: 6px; font-size: 12pt; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
        .header-table { border: none; margin-bottom: 16px; }
        .header-table td { border: none; padding: 2px; }
        .box { border: 1px solid #000; padding: 8px; margin-top: 8px; background-color: #fafafa; }
      </style>
    </head>
    <body>
      <table class="header-table">
        <tr>
          <td style="width: 50%; text-align: center;">
            <strong>${schoolName.toUpperCase()}</strong><br>
            TỔ KHOA HỌC TỰ NHIÊN - VẬT LÍ
          </td>
          <td style="width: 50%; text-align: center;">
            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
            <em>Độc lập - Tự do - Hạnh phúc</em>
          </td>
        </tr>
      </table>

      <h1>KẾ HOẠCH BÀI DẠY VẬT LÍ LỚP ${topic.grade}</h1>
      <h2>${topic.chapterTitle.toUpperCase()}</h2>
      <h1>${topic.lessonTitle.toUpperCase()}</h1>
      <p style="text-align: center; font-style: italic;">(Thực hiện đúng chuẩn Công văn 5512/BGDĐT-GDTrH, 3456/BGDĐT-GDTrH & 7991/BGDĐT-GDTrH)</p>
      <p style="text-align: center;"><strong>Thời lượng: ${topic.durationDisplay || `${topic.estimatedPeriods} tiết (${topic.estimatedPeriods * 45} phút)`}</strong> ${topic.ppctSessions ? `(${topic.ppctSessions})` : ""} | Sách giáo khoa: ${bookSeriesLabel} | Người soạn: ${teacherName}</p>
      ${topic.stemActivity ? `<p style="text-align: center; color: #b45309;"><strong>DỰ ÁN GIÁO DỤC STEM: ${topic.stemActivity.toUpperCase()}</strong></p>` : ""}

      <hr style="border: 0.5px solid #000;" />

      <h3>HOẠT ĐỘNG: HÌNH THÀNH KIẾN THỨC MỚI (TRỌNG TÂM)</h3>
      <p><strong>Tên hoạt động:</strong> ${activity.activityTitle}</p>
      <p><strong>Thời lượng:</strong> ${activity.durationMinutes} phút</p>

      <h4>a) Mục tiêu:</h4>
      ${
        activity.objectives.knowledge && activity.objectives.knowledge.length > 0
          ? `
      <p><strong>1. Về kiến thức:</strong></p>
      <ul>
        ${activity.objectives.knowledge.map((k) => `<li>${fmt(k)}</li>`).join("")}
      </ul>
      <p><strong>2. Về năng lực vật lí (đặc thù):</strong></p>
      `
          : `
      <p><strong>1. Về năng lực vật lí:</strong></p>
      `
      }
      <ul>
        ${activity.objectives.physicsCompetencies.map((c) => `<li>${fmt(c)}</li>`).join("")}
      </ul>
      <p><strong>${activity.objectives.knowledge && activity.objectives.knowledge.length > 0 ? "3" : "2"}. Về năng lực chung:</strong></p>
      <ul>
        ${activity.objectives.generalCompetencies.map((c) => `<li>${fmt(c)}</li>`).join("")}
      </ul>
      <p><strong>${activity.objectives.knowledge && activity.objectives.knowledge.length > 0 ? "4" : "3"}. Về phẩm chất chủ yếu:</strong></p>
      <ul>
        ${activity.objectives.qualities.map((q) => `<li>${fmt(q)}</li>`).join("")}
      </ul>
      ${
        activity.objectives.digitalCompetencies && activity.objectives.digitalCompetencies.length > 0
          ? `
      <p><strong>${activity.objectives.knowledge && activity.objectives.knowledge.length > 0 ? "5" : "4"}. Về năng lực số (Digital Competency):</strong></p>
      <ul>
        ${activity.objectives.digitalCompetencies.map((d) => `<li>${fmt(d)}</li>`).join("")}
      </ul>
      `
          : ""
      }

      <h4>b) Nội dung:</h4>
      <p style="text-align: justify;">${fmt(activity.content)}</p>

      <h4>c) Sản phẩm:</h4>
      <p style="text-align: justify;">${fmt(activity.product)}</p>

      <h4>d) Tổ chức thực hiện (Chuẩn tiến trình sư phạm 4 bước Công văn 5512):</h4>
      <p><em>(Tình huống có vấn đề xuất phát, kích hoạt mâu thuẫn nhận thức và câu hỏi tự nhiên của học sinh được đưa trực tiếp vào Bước 1)</em></p>

      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Các bước tiến trình</th>
            <th style="width: 75%;">Nội dung hoạt động của Giáo viên và Học sinh</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Bước 1: Chuyển giao nhiệm vụ học tập</strong><br>
              <em>(Đưa tình huống có vấn đề vào tổ chức thực hiện)</em>
            </td>
            <td>
              <div style="border: 1px solid #d97706; background-color: #fffbeb; padding: 8px; margin-bottom: 8px; border-radius: 4px;">
                <strong style="color: #b45309;">★ TÌNH HUỐNG CÓ VẤN ĐỀ XUẤT PHÁT (KÍCH HOẠT SUY NGHĨ TỰ NHIÊN):</strong><br>
                - <strong>Hiện tượng thực tiễn:</strong> ${fmt(activity.problematicSituation?.scenario || "")}<br>
                - <strong>Bộc lộ suy nghĩ tự nhiên của học sinh:</strong> <em>“Xe tải nặng hơn rất nhiều so với xe máy nên có lẽ lực xe tải tác dụng lên xe máy lớn hơn lực xe máy tác dụng lên xe tải. Nhưng tại sao sau va chạm, xe máy lại thay đổi vận tốc nhiều hơn rất nhiều so với xe tải? Có phải xe nào có khối lượng nhỏ hơn thì sẽ thay đổi vận tốc nhiều hơn không? Và sự thay đổi chuyển động của hai xe có liên quan gì đến khối lượng và vận tốc của chúng?”</em><br>
                - <strong>Khai thác sư phạm & làm xuất hiện mâu thuẫn nhận thức:</strong> GV hỏi căn cứ suy nghĩ; đối chiếu Định luật III Newton (<i>F&#8407;</i><sub>12</sub> = -<i>F&#8407;</i><sub>21</sub>); làm bộc lộ mâu thuẫn giữa lực bằng nhau và sự biến thiên vận tốc rất khác nhau.<br>
                - <strong>Câu hỏi tự nhiên của học sinh:</strong> <strong style="color: #c2410c;">"${fmt(activity.problematicSituation?.drivingQuestion || "")}"</strong>
              </div>
              ${fmt(activity.implementation.step1_transfer)}
            </td>
          </tr>
          <tr>
            <td><strong>Bước 2: Thực hiện nhiệm vụ học tập</strong></td>
            <td>${fmt(activity.implementation.step2_execution)}</td>
          </tr>
          <tr>
            <td><strong>Bước 3: Báo cáo kết quả và thảo luận</strong></td>
            <td>${fmt(activity.implementation.step3_discussion)}</td>
          </tr>
          <tr>
            <td><strong>Bước 4: Kết luận, nhận định</strong></td>
            <td>${fmt(activity.implementation.step4_conclusion)}</td>
          </tr>
        </tbody>
      </table>

      ${
        activity.subActivities && activity.subActivities.length > 0
          ? `
      <h3>TIẾN TRÌNH CHI TIẾT CÁC TIỂU HOẠT ĐỘNG (HÌNH THÀNH KIẾN THỨC)</h3>
      <p><em>(Kế hoạch dạy học chi tiết hóa theo từng đơn vị kiến thức & Phương pháp dạy học tương ứng)</em></p>
      ${activity.subActivities
        .map(
          (sub) => `
        <div style="border: 1.5px solid #0369a1; background-color: #f0f9ff; padding: 12px; margin: 12px 0; border-radius: 6px;">
          <h4 style="color: #0369a1; font-size: 13pt; margin-top: 0; text-transform: uppercase;">
            ${fmt(sub.code)}: ${fmt(sub.title)} ${sub.durationMinutes ? `(${sub.durationMinutes} phút)` : ""}
          </h4>
          <p><strong>★ Phương pháp dạy học chủ đạo:</strong> <span style="color: #b45309; font-weight: bold;">${fmt(sub.pedagogicalMethod.name)}</span></p>
          <p><em>- Cơ sở lí luận sư phạm: ${fmt(sub.pedagogicalMethod.rationale)}</em></p>
          ${sub.worksheetRef ? `<p><strong>- Phiếu học tập liên kết:</strong> <strong>${fmt(sub.worksheetRef)}</strong></p>` : ""}
          <p><strong>- Mục tiêu cụ thể:</strong></p>
          <ul>
            ${sub.objectives.map((obj) => `<li>${fmt(obj)}</li>`).join("")}
          </ul>
          <p><strong>- Nội dung:</strong> ${fmt(sub.content)}</p>
          <p><strong>- Sản phẩm học tập:</strong> ${fmt(sub.product)}</p>

          <p><strong>- Tiến trình các bước sư phạm thực hiện:</strong></p>
          <table>
            <thead>
              <tr>
                <th style="width: 12%;">Các bước</th>
                <th style="width: 25%;">Tên bước</th>
                <th style="width: 31%;">Hoạt động của Giáo viên</th>
                <th style="width: 32%;">Hoạt động của Học sinh</th>
              </tr>
            </thead>
            <tbody>
              ${sub.implementationSteps
                .map(
                  (step) => `
                <tr>
                  <td style="text-align: center; font-weight: bold;">${fmt(step.step)}</td>
                  <td><strong>${fmt(step.title)}</strong></td>
                  <td>${fmt(step.teacherAction)}</td>
                  <td>
                    ${fmt(step.studentAction || "")}
                    ${step.details ? `<div style="margin-top: 6px; font-size: 11pt; color: #1e3a8a; background: #e0f2fe; padding: 6px; border-radius: 4px;"><strong>Chi tiết đáp án & kiến thức:</strong><br>${fmt(step.details)}</div>` : ""}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
        )
        .join("")}
      `
          : ""
      }

      ${
        activity.theoreticalInquiryPath
          ? `
      <div style="border: 2px solid #1e3a8a; background-color: #f8fafc; padding: 12px; margin: 14px 0; border-radius: 4px;">
        <p style="color: #1e3a8a; font-weight: bold; font-size: 13pt; margin-top: 0; text-transform: uppercase;">
          ★ TIẾN TRÌNH XÂY DỰNG KIẾN THỨC THEO CON ĐƯỜNG LÍ THUYẾT (DẠY HỌC PHÁT HIỆN & GIẢI QUYẾT VẤN ĐỀ)
        </p>
        <p><em>(${fmt(activity.theoreticalInquiryPath.diagramTitle)})</em></p>

        <p><strong>1. ${fmt(activity.theoreticalInquiryPath.step1_problem_arising.title)}:</strong></p>
        <p>${fmt(activity.theoreticalInquiryPath.step1_problem_arising.description)}</p>
        <ul>
          ${activity.theoreticalInquiryPath.step1_problem_arising.priorKnowledgeAndExperience.map((item) => `<li>${fmt(item)}</li>`).join("")}
        </ul>
        <p><em>Hiện tượng xuất phát: ${fmt(activity.theoreticalInquiryPath.step1_problem_arising.phenomenon)}</em></p>

        <p><strong>2. ${fmt(activity.theoreticalInquiryPath.step2_problem_statement.title)}:</strong></p>
        <p style="font-weight: bold; color: #9a3412;">"${fmt(activity.theoreticalInquiryPath.step2_problem_statement.drivingQuestion)}"</p>
        <p><em>Mục tiêu khoa học: ${fmt(activity.theoreticalInquiryPath.step2_problem_statement.scientificGoal)}</em></p>

        <p><strong>3. ${fmt(activity.theoreticalInquiryPath.step3_problem_solving.title)}:</strong></p>
        <div style="margin-left: 15px;">
          <p><strong>3.1. ${fmt(activity.theoreticalInquiryPath.step3_problem_solving.step3_1_theoretical_reasoning.title)}:</strong></p>
          <p>- Kiến thức đã biết cần vận dụng: ${activity.theoreticalInquiryPath.step3_problem_solving.step3_1_theoretical_reasoning.priorKnowledgeApplied.map((item) => fmt(item)).join("; ")}</p>
          <p>- Tiến hành suy luận toán học:</p>
          <ul>
            ${activity.theoreticalInquiryPath.step3_problem_solving.step3_1_theoretical_reasoning.reasoningMethod.map((m) => `<li>${fmt(m)}</li>`).join("")}
          </ul>
          <p><strong>=> Kết quả lí thuyết:</strong> ${fmt(activity.theoreticalInquiryPath.step3_problem_solving.step3_1_theoretical_reasoning.theoreticalResult)}</p>

          <p style="font-style: italic; color: #b45309; font-weight: bold;">
            * Câu hỏi chuyển tiếp: "${fmt(activity.theoreticalInquiryPath.step3_problem_solving.transitionQuestion)}"
          </p>

          <p><strong>3.2. ${fmt(activity.theoreticalInquiryPath.step3_problem_solving.step3_2_experimental_verification.title)}:</strong></p>
          <p>- Nội dung kiểm nghiệm: ${activity.theoreticalInquiryPath.step3_problem_solving.step3_2_experimental_verification.verificationContent.map((item) => fmt(item)).join("; ")}</p>
          <p>- Thiết kế phương án thí nghiệm:</p>
          <ul>
            <li><strong>Dụng cụ:</strong> ${activity.theoreticalInquiryPath.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.apparatus.map((item) => fmt(item)).join(", ")}</li>
            <li><strong>Bố trí:</strong> ${fmt(activity.theoreticalInquiryPath.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.arrangement)}</li>
            <li><strong>Tiến hành:</strong> ${fmt(activity.theoreticalInquiryPath.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.procedure)}</li>
            <li><strong>Thu thập số liệu:</strong> ${activity.theoreticalInquiryPath.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.dataToCollect.map((item) => fmt(item)).join(" | ")}</li>
            <li><strong>Xử lí số liệu:</strong> ${fmt(activity.theoreticalInquiryPath.step3_problem_solving.step3_2_experimental_verification.experimentalDesign.dataProcessing)}</li>
          </ul>
          <p>- Thực hiện thí nghiệm: ${activity.theoreticalInquiryPath.step3_problem_solving.step3_2_experimental_verification.experimentalExecution.map((item) => fmt(item)).join(" ")}</p>
        </div>

        <p><strong>4. ${fmt(activity.theoreticalInquiryPath.step4_conclusion.title)}:</strong></p>
        <p>- Đối chiếu kết quả: ${fmt(activity.theoreticalInquiryPath.step4_conclusion.comparisonOutcome)}</p>
        <p>- <strong>Khả năng 1 (Phù hợp):</strong> ${fmt(activity.theoreticalInquiryPath.step4_conclusion.caseMatchNewKnowledge)}</p>
        <p>- <strong>Khả năng 2 (Không phù hợp):</strong> ${fmt(activity.theoreticalInquiryPath.step4_conclusion.caseMismatchHypothesisRevision)}</p>
        <p>- Trường hợp riêng & phạm vi áp dụng:</p>
        <ul>
          ${activity.theoreticalInquiryPath.step4_conclusion.limitingCasesAndScope.map((s) => `<li>${fmt(s)}</li>`).join("")}
        </ul>
      </div>
      `
          : ""
      }

      <h3>HỒ SƠ DẠY HỌC - ${activity.studentWorksheet.title.toUpperCase()}</h3>
      <p><em>(Mã hiệu: ${activity.studentWorksheet.code || "PHT-5512"})</em></p>
      <table>
        <thead>
          <tr>
            <th style="width: 8%;">STT</th>
            <th style="width: 35%;">Yêu cầu thao tác / Nhiệm vụ</th>
            <th style="width: 35%;">Kết quả ghi nhận của Học sinh</th>
            <th style="width: 22%;">Gợi ý đáp án chuẩn</th>
          </tr>
        </thead>
        <tbody>
          ${activity.studentWorksheet.tasks
            .map(
              (task) => `
            <tr>
              <td style="text-align: center;"><strong>${task.id}</strong></td>
              <td>${fmt(task.instruction)}</td>
              <td><em>${fmt(task.prompt)}</em></td>
              <td style="font-size: 11pt; color: #333;">${fmt(task.expectedAnswer) || "Đang cập nhật"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <h3>LƯU Ý SƯ PHẠM (TRÍCH XUẤT TỪ SÁCH GIÁO VIÊN VẬT LÍ KẾT NỐI TRI THỨC)</h3>
      <div class="box">
        <p><strong>1. Quan niệm sai lầm thường gặp của học sinh (Misconceptions):</strong></p>
        <ul>
          ${activity.teacherGuideNotes.commonMisconceptions.map((m) => `<li>${fmt(m)}</li>`).join("")}
        </ul>
        <p><strong>2. Gợi ý phương pháp sư phạm:</strong></p>
        <ul>
          ${activity.teacherGuideNotes.pedagogicalAdvice.map((a) => `<li>${fmt(a)}</li>`).join("")}
        </ul>
        <p><strong>3. Câu hỏi gợi mở phân hóa:</strong></p>
        <p>- <em>Hỗ trợ học sinh yếu/trung bình:</em> ${fmt(activity.teacherGuideNotes.differentiationPrompts.support)}</p>
        <p>- <em>Mở rộng cho học sinh khá/giỏi:</em> ${fmt(activity.teacherGuideNotes.differentiationPrompts.advanced)}</p>
      </div>

      <h3>HỆ THỐNG KIỂM TRA - ĐÁNH GIÁ NĂNG LỰC HỌC TẬP</h3>
      <p><em>(Theo Giáo trình "Kiểm tra, đánh giá trong dạy học Vật lí" - TS. Dương Diệp Thanh Hiền, ĐH Quy Nhơn 2026 & Công văn 7991/BGDĐT-GDTrH)</em></p>

      <h4>1. Phiếu đánh giá theo tiêu chí (Rubric) cho hoạt động học tập:</h4>
      <table>
        <thead>
          <tr>
            <th style="width: 28%;">Tiêu chí đánh giá</th>
            <th style="width: 18%;">Mức 1: Cần cố gắng<br>(0 - 4.5 điểm)</th>
            <th style="width: 18%;">Mức 2: Đạt<br>(5.0 - 6.5 điểm)</th>
            <th style="width: 18%;">Mức 3: Khá<br>(7.0 - 8.5 điểm)</th>
            <th style="width: 18%;">Mức 4: Tốt / Mẫu mực<br>(9.0 - 10 điểm)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Khám phá & Thực hành đo lường</strong> (Trọng số: 30%)</td>
            <td>Thao tác lúng túng, sai số lớn, chưa tuân thủ quy tắc an toàn.</td>
            <td>Thao tác đúng quy trình cơ bản, đọc được số liệu nhưng còn chậm.</td>
            <td>Thao tác nhanh, chính xác, đo lặp lại 3-5 lần, ghi số liệu trung thực.</td>
            <td>Thao tác thành thạo, điều chỉnh linh hoạt, làm chủ thiết bị và hướng dẫn nhóm khác.</td>
          </tr>
          <tr>
            <td><strong>2. Xử lí số liệu & Giải thích khoa học</strong> (Trọng số: 30%)</td>
            <td>Không tính được giá trị trung bình, sai lệch bản chất vật lí.</td>
            <td>Tính được giá trị trung bình, vẽ đồ thị cơ bản nhưng chưa giải thích sâu.</td>
            <td>Tính đúng sai số, vẽ đồ thị chuẩn khớp lí thuyết, lập luận logic.</td>
            <td>Lập luận sắc bén, phân tích thấu đáo nguồn sai số và đề xuất cải tiến tối ưu.</td>
          </tr>
          <tr>
            <td><strong>3. Báo cáo & Tranh luận khoa học</strong> (Trọng số: 20%)</td>
            <td>Nói nhỏ, thiếu tự tin, đọc tài liệu, không trả lời được chất vấn.</td>
            <td>Trình bày nghe rõ nhưng chưa lôi cuốn, trả lời được câu hỏi dễ.</td>
            <td>Thuyết trình mạch lạc, tự tin, trả lời tốt câu hỏi phản biện của bạn.</td>
            <td>Lôi cuốn, đối đáp thông minh, khơi gợi thảo luận sâu cho cả lớp.</td>
          </tr>
          <tr>
            <td><strong>4. Tinh thần Hợp tác & Trách nhiệm nhóm</strong> (Trọng số: 20%)</td>
            <td>Thụ động, không tham gia đóng góp vào sản phẩm chung của nhóm.</td>
            <td>Có tham gia khi được phân công nhưng còn cần nhắc nhở.</td>
            <td>Tích cực, chủ động nhận việc và hỗ trợ đồng đội hoàn thành đúng hạn.</td>
            <td>Gương mẫu, điều phối nhóm xuất sắc, truyền cảm hứng tích cực.</td>
          </tr>
        </tbody>
      </table>

      <h4>2. Phiếu tự đánh giá và đánh giá đồng đẳng (Thang điểm: 3 = Tốt hơn | 2 = Trung bình | 1 = Kém hơn | 0 = Không giúp gì | -1 = Trở ngại):</h4>
      <table>
        <thead>
          <tr>
            <th style="width: 30%;">Họ và tên học sinh</th>
            <th style="width: 14%;">Nhiệt tình & nghiêm túc</th>
            <th style="width: 14%;">Đóng góp ý tưởng</th>
            <th style="width: 14%;">Tổ chức & hợp tác</th>
            <th style="width: 14%;">Hiệu quả sản phẩm</th>
            <th style="width: 14%;">Tổng điểm</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1. Nguyễn Văn A (Nhóm trưởng)</td><td align="center">3</td><td align="center">3</td><td align="center">3</td><td align="center">3</td><td align="center"><strong>12/12</strong></td></tr>
          <tr><td>2. Trần Thị B (Thư kí)</td><td align="center">2</td><td align="center">3</td><td align="center">2</td><td align="center">3</td><td align="center"><strong>10/12</strong></td></tr>
          <tr><td>3. Lê Văn C (Thành viên)</td><td align="center">2</td><td align="center">2</td><td align="center">2</td><td align="center">2</td><td align="center"><strong>8/12</strong></td></tr>
          <tr><td>4. Phạm Minh D (Thành viên)</td><td align="center">2</td><td align="center">1</td><td align="center">2</td><td align="center">1</td><td align="center"><strong>6/12</strong></td></tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + contentHtml], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `GiaoAn_5512_VatLi${topic.grade}_${topic.id}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

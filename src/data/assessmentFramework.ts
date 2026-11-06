import {
  ActivityRubric,
  ActivityChecklist,
  CATTechniqueItem,
  ExamMatrix7991,
} from "../types/physics";

// -------------------------------------------------------------
// 1. HỆ THỐNG PHIẾU ĐÁNH GIÁ THEO TIÊU CHÍ (RUBRICS)
// Trích dẫn: "Kiểm tra, đánh giá trong dạy học Vật lí" (TS. Dương Diệp Thanh Hiền, 2026)
// & "Dạy học STEM trong Vật lí" (Dương Diệp Thanh Hiền, 2024)
// -------------------------------------------------------------

export const ACTIVITY_RUBRICS: ActivityRubric[] = [
  {
    id: "rubric-experiment",
    title: "Rubric Đánh giá Kĩ năng Thực hành & Thí nghiệm Vật lí",
    category: "experiment",
    applicableFor: "Các bài học thực hành, thí nghiệm kiểm chứng, khảo sát định luật",
    description: "Đánh giá quá trình chuẩn bị, thao tác đo lường, xử lí sai số và rút ra kết luận khoa học.",
    criteria: [
      {
        id: "exp-c1",
        criterionName: "Bố trí dụng cụ & Tuân thủ quy tắc an toàn",
        weightPercent: 20,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Chưa biết cách sắp xếp dụng cụ, vi phạm quy tắc an toàn (đoản mạch, rơi vỡ, đảo cực nguồn).",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Bố trí đúng sơ đồ nhưng thao tác còn lúng túng, cần giáo viên hoặc bạn bè nhắc nhở an toàn.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Bố trí thí nghiệm nhanh, đúng sơ đồ nguyên lí, chấp hành đầy đủ quy tắc an toàn điện và cơ.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Bố trí thiết bị khoa học, thẩm mĩ cao, chủ động kiểm tra an toàn trước khi cấp nguồn, hỗ trợ nhóm khác.",
          },
        ],
      },
      {
        id: "exp-c2",
        criterionName: "Kĩ năng thao tác đo lường & Ghi nhận dữ liệu",
        weightPercent: 30,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Đọc sai chỉ số trên dụng cụ đo (thước, vôn kế, ampe kế, cảm biến), bỏ sót nhiều lần đo.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Thao tác đo cơ bản đúng, đọc được giá trị nhưng còn sai lệch điểm đặt mắt hoặc chưa chỉnh zero.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Đo đúng quy trình lặp (tối thiểu 3-5 lần), điều chỉnh đúng thang đo, ghi số liệu trung thực vào bảng.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Thao tác chuẩn xác, nhanh nhẹn, điều chỉnh linh hoạt khi có nhiễu, ghi nhận dữ liệu chi tiết kèm đơn vị.",
          },
        ],
      },
      {
        id: "exp-c3",
        criterionName: "Xử lí số liệu, Vẽ đồ thị & Tính sai số",
        weightPercent: 30,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Không tính được giá trị trung bình, không xác định sai số dụng cụ và sai số ngẫu nhiên.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Tính được giá trị trung bình, vẽ được đồ thị nhưng chia tỉ lệ trục chưa chuẩn, tính sai số còn lỗi nhỏ.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Tính đúng sai số tuyệt đối và tương đối, vẽ đồ thị chuẩn khớp với dạng đường thẳng/đường cong thực nghiệm.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Xử lí số liệu bằng phần mềm/bảng tính hoặc thủ công xuất sắc; phân tích rõ nguyên nhân sai số hệ thống.",
          },
        ],
      },
      {
        id: "exp-c4",
        criterionName: "Rút ra kết luận khoa học & Báo cáo",
        weightPercent: 20,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Chưa rút ra được định luật/mối quan hệ giữa các đại lượng; báo cáo thực hành sơ sài, thiếu mục.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Nêu được kết luận bài thực hành theo hướng dẫn SGK nhưng chưa giải thích được bản chất vật lí sâu.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Rút ra định luật chính xác, so sánh kết quả thực nghiệm với dự đoán lý thuyết, hoàn thành đầy đủ báo cáo.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Lập luận sắc bén, làm rõ phạm vi áp dụng của định luật, đề xuất cải tiến phương án thí nghiệm tối ưu hơn.",
          },
        ],
      },
    ],
  },
  {
    id: "rubric-stem-design",
    title: "Rubric Đánh giá Bản thiết kế Kĩ thuật STEM",
    category: "stem_design",
    applicableFor: "Hoạt động 3 (Lựa chọn giải pháp) trong bài dạy STEM / EDP",
    description: "Đánh giá bản vẽ kỹ thuật, sơ đồ nguyên lí, cơ sở khoa học và tính toán kích thước, vật liệu.",
    criteria: [
      {
        id: "des-c1",
        criterionName: "Cơ sở khoa học & Nguyên lí Vật lí áp dụng",
        weightPercent: 25,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Chưa giải thích được nguyên lí vật lí làm cơ sở cho thiết bị hoạt động; lựa chọn sai quy luật.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Nêu được công thức hoặc định luật liên quan nhưng chưa liên kết chặt chẽ với từng bộ phận của mô hình.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Giải thích rõ ràng cơ chế vận hành bằng các định luật Vật lí (cơ năng, áp suất, lực điện từ, quang học).",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Xây dựng mô hình toán - lí chính xác, tính toán tối ưu các thông số để thiết bị đạt hiệu suất cao nhất.",
          },
        ],
      },
      {
        id: "des-c2",
        criterionName: "Quy chuẩn bản vẽ kĩ thuật & Sơ đồ cấu tạo",
        weightPercent: 30,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Hình vẽ phác thảo mơ hồ, thiếu kích thước, không thể hiện được các chi tiết liên kết.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Bản vẽ có kích thước tổng thể, chỉ rõ các bộ phận chính nhưng tỉ lệ chưa thật sự chuẩn xác.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Bản vẽ rõ ràng, đầy đủ các hình chiếu hoặc sơ đồ mạch điện, có ghi chú kích thước và chú thích chi tiết.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Bản vẽ chuẩn kĩ thuật (hoặc dùng phần mềm thiết kế), có bảng kê chi tiết (BOM), tính toán dung sai hợp lí.",
          },
        ],
      },
      {
        id: "des-c3",
        criterionName: "Lựa chọn vật liệu & Tính khả thi thi công",
        weightPercent: 25,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Đề xuất vật liệu quá đắt đỏ, khó tìm, không phù hợp với điều kiện học sinh tự chế tạo.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Vật liệu tái chế thông dụng nhưng phương án gia công lắp ghép còn khó thực hiện bằng tay.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Sử dụng vật liệu dễ tìm, an toàn, thân thiện môi trường; các bước chế tạo rõ ràng và khả thi.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Tối ưu hóa chi phí (giá rẻ), tận dụng vật liệu tái chế thông minh, quy trình thi công an toàn và chuẩn xác.",
          },
        ],
      },
      {
        id: "des-c4",
        criterionName: "Bảo vệ bản thiết kế & Tiếp thu phản biện",
        weightPercent: 20,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Không trả lời được câu hỏi chất vấn của giáo viên và nhóm bạn về bản vẽ.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Trả lời được câu hỏi trực tiếp nhưng còn phụ thuộc vào 1 thành viên đại diện, chưa ghi nhận góp ý.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Trình bày mạch lạc, trả lời tự tin hầu hết câu hỏi phản biện, ghi nhận chỉnh sửa bản vẽ hợp lí.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Thuyết trình lôi cuốn, bảo vệ luận điểm khoa học vững vàng, chủ động đề xuất phương án cải tiến ngay tại lớp.",
          },
        ],
      },
    ],
  },
  {
    id: "rubric-stem-product",
    title: "Rubric Đánh giá Sản phẩm Chế tạo STEM (Mô hình / Thiết bị)",
    category: "stem_product",
    applicableFor: "Hoạt động 5 (Chia sẻ, thảo luận và đánh giá) trong bài dạy STEM",
    description: "Đánh giá mức độ hoàn thiện, hiệu năng hoạt động thực tế và tính sáng tạo của sản phẩm STEM.",
    criteria: [
      {
        id: "prd-c1",
        criterionName: "Hiệu năng hoạt động & Đạt tiêu chí kĩ thuật",
        weightPercent: 40,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Sản phẩm không hoạt động hoặc không đạt các chỉ tiêu bắt buộc (tốc độ, độ bền, độ sáng, áp suất).",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Sản phẩm hoạt động được nhưng độ ổn định chưa cao, chập chờn hoặc chỉ đạt mức tối thiểu.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Sản phẩm hoạt động ổn định, đạt đầy đủ các thông số kĩ thuật đã cam kết trong bản thiết kế.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Hoạt động hoàn hảo, vượt chỉ tiêu ban đầu, độ tin cậy và độ lặp lại rất cao trong nhiều lần thử nghiệm.",
          },
        ],
      },
      {
        id: "prd-c2",
        criterionName: "Chất lượng gia công, Độ bền & An toàn",
        weightPercent: 25,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Mối nối lỏng lẻo, dễ rơi gãy, có chi tiết sắc nhọn nguy hiểm hoặc rò rỉ điện/chất lỏng.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Kết cấu cơ bản vững chắc, an toàn khi vận hành thử nghiệm nhưng còn thiếu tính gia cố bền vững.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Gia công chắc chắn, cách điện và bảo vệ an toàn tốt, chịu được tác động rung lắc thông thường.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Hoàn thiện sắc sảo, bố trí gọn gàng, độ an toàn tuyệt đối và có độ bền sử dụng lâu dài.",
          },
        ],
      },
      {
        id: "prd-c3",
        criterionName: "Thẩm mĩ, Sáng tạo & Thân thiện môi trường",
        weightPercent: 20,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Hình thức thô sơ, chưa trang trí, sử dụng vật liệu gây ô nhiễm hoặc lãng phí.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Hình thức gọn gàng, có ý thức trang trí và tận dụng vật liệu tái chế ở mức cơ bản.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Mẫu mã đẹp, phối màu hài hòa, có điểm sáng tạo độc đáo về cơ cấu chuyển động hoặc vi mạch.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Thiết kế ấn tượng mang tính thương mại cao, sáng tạo đột phá, 100% tái chế xanh.",
          },
        ],
      },
      {
        id: "prd-c4",
        criterionName: "Nhật kí chế tạo & Phương án cải tiến",
        weightPercent: 15,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Không có sổ tay/nhật kí ghi nhận quá trình làm và thử nghiệm; không nhận ra nhược điểm.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Ghi chép sơ lược các buổi làm việc, nhận ra 1 số lỗi khi thử nghiệm nhưng chưa nêu cách khắc phục.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Nhật kí ghi chép đầy đủ các lần thử nghiệm thất bại và thành công, đề xuất phương án cải tiến rõ ràng.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Hồ sơ kỹ thuật mẫu mực kèm hình ảnh/video các pha chế tạo, chứng minh cải tiến qua số liệu định lượng.",
          },
        ],
      },
    ],
  },
  {
    id: "rubric-presentation",
    title: "Rubric Đánh giá Báo cáo Thuyết trình & Tranh luận Khoa học",
    category: "presentation",
    applicableFor: "Hoạt động Báo cáo kết quả và thảo luận (CV 5512 Bước 3)",
    description: "Đánh giá khả năng diễn đạt ngôn ngữ khoa học, sử dụng slide/poster trực quan và kỹ năng tương tác phản biện.",
    criteria: [
      {
        id: "pre-c1",
        criterionName: "Nội dung khoa học & Tính chính xác của lập luận",
        weightPercent: 35,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Kiến thức vật lí còn sai sót, dùng thuật ngữ chưa chuẩn, nội dung lộn xộn, thiếu trọng tâm.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Nội dung đúng về cơ bản nhưng diễn giải chưa sâu, còn đọc slide hoặc phụ thuộc giấy nháp.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Nội dung chuẩn xác, cấu trúc logic, làm nổi bật được bản chất hiện tượng và kết quả thực nghiệm.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Lập luận sắc bén, làm chủ hoàn toàn kiến thức, liên hệ thực tiễn mở rộng phong phú và sâu sắc.",
          },
        ],
      },
      {
        id: "pre-c2",
        criterionName: "Kĩ năng trình bày & Ngôn ngữ hình thể",
        weightPercent: 25,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Nói quá nhỏ hoặc quá nhanh, không giao tiếp mắt với người nghe, tư thế lúng túng.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Nói rõ ràng, nghe được nhưng chưa có điểm nhấn, cử chỉ còn ngập ngừng, phụ thuộc tài liệu.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Giọng nói truyền cảm, tốc độ vừa phải, giao tiếp mắt tốt với khán giả, tác phong tự tin.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Thuyết trình lôi cuốn, làm chủ sân khấu, dùng ngôn ngữ hình thể và giọng điệu nhấn nhá xuất sắc.",
          },
        ],
      },
      {
        id: "pre-c3",
        criterionName: "Sử dụng Phương tiện trực quan (Slide, Poster, Mô hình)",
        weightPercent: 20,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Slide quá nhiều chữ, hình ảnh mờ nhạt, poster cẩu thả, không thao tác minh họa trên mô hình.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Trình bày trực quan cơ bản, có hình ảnh và đồ thị minh họa nhưng bố cục chưa thật sự bắt mắt.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Poster/Slide thiết kế đẹp, cô đọng, phối hợp nhuần nhuyễn giữa lời nói với thao tác chỉ dẫn trên hình.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Thiết kế đẳng cấp, chuyên nghiệp, phối hợp video, animation hoặc trình diễn mô hình sống động.",
          },
        ],
      },
      {
        id: "pre-c4",
        criterionName: "Khả năng tương tác & Trả lời chất vấn phản biện",
        weightPercent: 20,
        levels: [
          {
            levelNumber: 1,
            levelName: "Cần cố gắng",
            scoreRange: "0 - 4.5 đ",
            description: "Né tránh câu hỏi chất vấn, mất bình tĩnh hoặc trả lời không đúng trọng tâm câu hỏi của bạn.",
          },
          {
            levelNumber: 2,
            levelName: "Đạt",
            scoreRange: "5.0 - 6.5 đ",
            description: "Trả lời được câu hỏi dễ, câu hỏi khó còn lúng túng và cần sự trợ giúp từ giáo viên.",
          },
          {
            levelNumber: 3,
            levelName: "Khá",
            scoreRange: "7.0 - 8.5 đ",
            description: "Bình tĩnh lắng nghe, giải thích thỏa đáng hầu hết câu hỏi của các nhóm với thái độ tôn trọng.",
          },
          {
            levelNumber: 4,
            levelName: "Tốt / Mẫu mực",
            scoreRange: "9.0 - 10 đ",
            description: "Đối đáp thông minh, khéo léo dẫn dắt mở rộng vấn đề, đặt lại câu hỏi khơi gợi thảo luận cho cả lớp.",
          },
        ],
      },
    ],
  },
];

// -------------------------------------------------------------
// 2. BẢNG KIỂM (CHECKLISTS)
// Trích trang 47-48 giáo trình TS. Dương Diệp Thanh Hiền (2026)
// -------------------------------------------------------------

export const ACTIVITY_CHECKLISTS: ActivityChecklist[] = [
  {
    id: "chk-lab-procedure",
    title: "Bảng kiểm Thao tác Thực hành Thí nghiệm Vật lí",
    category: "experiment_procedure",
    instructions: "Đánh dấu (✔) nếu học sinh thực hiện đạt yêu cầu, để trống (-) nếu chưa đạt.",
    items: [
      { id: "chk1-1", task: "Kiểm tra tình trạng đầy đủ và hoạt động của các dụng cụ trước khi bắt đầu" },
      { id: "chk1-2", task: "Đặt mắt ngang bằng với vạch chia độ của dụng cụ đo để tránh sai số thị sai" },
      { id: "chk1-3", task: "Chỉnh vít hoặc nút Zero của lực kế, ampe kế, vôn kế, cân trước khi đo" },
      { id: "chk1-4", task: "Chọn đúng thang đo phù hợp với đại lượng dự kiến trước khi cấp nguồn hoặc tác dụng lực" },
      { id: "chk1-5", task: "Thực hiện phép đo lặp lại tối thiểu 3 đến 5 lần trong cùng điều kiện" },
      { id: "chk1-6", task: "Ghi chép số liệu tức thời và trung thực vào bảng số liệu, không đoán mò hoặc sửa số" },
      { id: "chk1-7", task: "Ngắt nguồn điện, xả điện tích hoặc hạ vật nặng về vị trí an toàn ngay sau khi đo xong" },
      { id: "chk1-8", task: "Vệ sinh, thu dọn và sắp xếp dụng cụ gọn gàng về đúng vị trí ban đầu" },
    ],
  },
  {
    id: "chk-stem-design",
    title: "Bảng kiểm Tiêu chí Đánh giá Bản thiết kế STEM",
    category: "stem_design_check",
    instructions: "Kiểm tra từng tiêu chí bắt buộc của một bản thiết kế kĩ thuật hoàn chỉnh.",
    items: [
      { id: "chk2-1", task: "Bản vẽ có đầy đủ hình biểu diễn (hình chiếu hoặc sơ đồ mạch điện rõ ràng)" },
      { id: "chk2-2", task: "Có ghi đầy đủ kích thước các chi tiết (dài, rộng, cao, đường kính...)" },
      { id: "chk2-3", task: "Có bản thuyết minh cơ sở vật lí (nguyên lí hoạt động dựa trên định luật nào)" },
      { id: "chk2-4", task: "Có danh mục nguyên vật liệu chi tiết kèm số lượng và ước tính chi phí" },
      { id: "chk2-5", task: "Các phương án lắp ghép, gắn kết có tính khả thi với công cụ sẵn có" },
      { id: "chk2-6", task: "Đã phân công rõ vai trò của từng thành viên trong nhóm tham gia thi công" },
    ],
  },
  {
    id: "chk-learning-habits",
    title: "Bảng kiểm Thói quen Học tập & Kĩ năng Xã hội (Trang 48)",
    category: "learning_habits",
    instructions: "Quan sát hành vi của học sinh trong giờ học và đánh giá Có hoặc Không.",
    items: [
      { id: "chk3-1", task: "Tôn trọng ý kiến của người khác và lắng nghe không ngắt lời" },
      { id: "chk3-2", task: "Chủ động yêu cầu được giúp đỡ khi gặp khó khăn hoặc khúc mắc" },
      { id: "chk3-3", task: "Tích cực hợp tác và chia sẻ tài liệu với các bạn cùng nhóm" },
      { id: "chk3-4", task: "Dùng chung và có ý thức giữ gìn dụng cụ học tập của nhóm" },
      { id: "chk3-5", task: "Hoàn thành nhiệm vụ được giao đúng thời gian quy định" },
    ],
  },
];

// -------------------------------------------------------------
// 3. PHIẾU TỰ ĐÁNH GIÁ & ĐÁNH GIÁ ĐỒNG ĐẲNG (THANG 3, 2, 1, 0, -1)
// Trích nguyên văn trang 30 giáo trình TS. Dương Diệp Thanh Hiền (2026)
// -------------------------------------------------------------

export const PEER_ASSESSMENT_GUIDE = {
  title: "Phiếu Tự Đánh giá và Đánh giá Đồng đẳng Công việc Nhóm",
  authorRef: "TS. Dương Diệp Thanh Hiền, Trường ĐH Quy Nhơn (2026), Tr. 30",
  scoreScale: [
    { score: 3, label: "Tốt hơn các thành viên khác trong nhóm" },
    { score: 2, label: "Trung bình (đạt yêu cầu)" },
    { score: 1, label: "Không tốt bằng các thành viên khác trong nhóm" },
    { score: 0, label: "Không giúp gì cho nhóm" },
    { score: -1, label: "Là trở ngại đối với nhóm" },
  ],
  criteria: [
    { id: "pac1", name: "Sự nhiệt tình và nghiêm túc" },
    { id: "pac2", name: "Đóng góp ý tưởng" },
    { id: "pac3", name: "Biết những gì được kì vọng" },
    { id: "pac4", name: "Tổ chức và quản lí nhóm" },
    { id: "pac5", name: "Làm việc nhóm & Hỗ trợ đồng đội" },
    { id: "pac6", name: "Tính hiệu quả của sản phẩm giao phó" },
  ],
};

// -------------------------------------------------------------
// 4. KĨ THUẬT ĐÁNH GIÁ TRÊN LỚP (CATs - Classroom Assessment Techniques)
// Trích trang 62-66 giáo trình TS. Dương Diệp Thanh Hiền (2026)
// -------------------------------------------------------------

export const CLASSROOM_ASSESSMENT_TECHNIQUES: CATTechniqueItem[] = [
  {
    id: "cat-1min",
    name: "Bài tập 1 phút (One-minute Paper)",
    durationMinutes: 1,
    purpose: "Thu thập phản hồi nhanh cuối giờ để nắm bắt kịp thời mức độ hiểu bài và điểm nghẽn nhận thức.",
    procedure: "Phát giấy nhỏ hoặc dùng công cụ số, học sinh có đúng 1 phút để viết nhanh câu trả lời cho 3 câu hỏi cốt lõi.",
    sampleQuestions: [
      "1. Điều gì quan trọng nhất em học được từ bài học ngày hôm nay?",
      "2. Câu hỏi quan trọng nào về hiện tượng/định luật mà em vẫn chưa được giải đáp?",
      "3. Điểm nào trong bài học còn khiến em cảm thấy mơ hồ, khó hiểu nhất?",
    ],
  },
  {
    id: "cat-5min-ticket",
    name: "Thẻ kiểm tra 5 phút (Check Ticket)",
    durationMinutes: 5,
    purpose: "Kiểm tra kiến thức nền trước bài học hoặc củng cố nhanh ngay sau một đơn vị kiến thức mới hình thành.",
    procedure: "Giao 2-3 câu hỏi định lượng hoặc định tính ngắn. Giáo viên lướt nhanh để điều chỉnh kế hoạch giảng dạy.",
    sampleQuestions: [
      "1. Viết công thức tính đại lượng vừa học kèm đơn vị đo trong hệ SI?",
      "2. Nếu tăng đại lượng X lên gấp đôi thì đại lượng Y biến đổi như thế nào?",
      "3. Hãy nêu 1 ví dụ thực tiễn trong đời sống ứng dụng quy luật này?",
    ],
  },
  {
    id: "cat-memory-matrix",
    name: "Ma trận Ghi nhớ (Memory Matrix)",
    durationMinutes: 5,
    purpose: "Giúp học sinh phân loại, hệ thống hóa và so sánh các khái niệm, quy luật có nhiều điểm tương đồng.",
    procedure: "Giáo viên cho khung bảng với các hàng và cột, để trống các ô cho học sinh điền các đặc trưng cốt lõi.",
    sampleQuestions: [
      "Điền ma trận so sánh Động năng và Thế năng (Khái niệm, Công thức, Điểm đặt mốc, Tính chất âm/dương, Khả năng bảo toàn).",
      "Điền ma trận phân biệt Sóng ngang và Sóng dọc (Phương dao động, Phương truyền sóng, Môi trường truyền được).",
      "Điền ma trận so sánh Quá trình Đẳng nhiệt và Quá trình Đẳng áp (Thông số không đổi, Định luật, Đồ thị trong hệ p-V).",
    ],
  },
  {
    id: "cat-kwl",
    name: "Bảng hỏi KWL (Know - Want to know - Learned)",
    durationMinutes: 5,
    purpose: "Kích hoạt kiến thức sẵn có, gợi mở câu hỏi nghiên cứu và tự đánh giá thành quả sau buổi học.",
    procedure: "Cột K (Những điều em ĐÃ BIẾT), Cột W (Những điều em MUỐN BIẾT THÊM), Cột L (Những điều em ĐÃ HỌC ĐƯỢC).",
    sampleQuestions: [
      "K: Em đã biết gì về sự rơi của các vật trong không khí?",
      "W: Em muốn khám phá điều gì khi hút hết không khí ra khỏi ống chân không?",
      "L: Em đã nghiệm ra được kết luận gì về sự rơi tự do sau bài học?",
    ],
  },
];

// -------------------------------------------------------------
// 5. MA TRẬN & BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ THEO CÔNG VĂN 7991/BGDĐT-GDTrH
// (Kèm theo Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ GDĐT)
// Trích phụ lục trang 86-91 giáo trình TS. Dương Diệp Thanh Hiền (2026)
// Cấu trúc chuẩn: 40% Biết - 30% Hiểu - 30% Vận dụng
// 4 Phần: TNKQ Nhiều lựa chọn (3đ) + Đúng Sai (2đ) + Trả lời ngắn (2đ) + Tự luận (3đ)
// -------------------------------------------------------------

export const EXAM_MATRICES_7991: ExamMatrix7991[] = [
  {
    grade: 10,
    examTitle: "Ma trận Đề Kiểm tra Cuối Kì I - Vật lí 10 (Chuẩn CV 7991)",
    durationMinutes: 45,
    regulationsRef: "Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ Giáo dục & Đào tạo",
    cognitiveRatio: {
      recognitionPercent: 40,
      comprehensionPercent: 30,
      applicationPercent: 30,
    },
    totalPoints: 10.0,
    sections: [
      {
        sectionTitle: "Phần I. Trắc nghiệm 4 lựa chọn (1 phương án đúng)",
        questionCount: 12,
        totalPoints: 3.0,
        description: "12 câu hỏi trắc nghiệm truyền thống (0,25 điểm/câu). Kiểm tra kiến thức cốt lõi và hiểu biết cơ bản.",
        scoreBreakdown: { recognitionPoints: 2.0, comprehensionPoints: 1.0, applicationPoints: 0.0 },
      },
      {
        sectionTitle: "Phần II. Trắc nghiệm Đúng - Sai (Dạng phức hợp 4 ý)",
        questionCount: 2,
        totalPoints: 2.0,
        description: "2 câu hỏi (mỗi câu gồm 4 lệnh hỏi a, b, c, d). Đòi hỏi tư duy tổng hợp logic để phán đoán từng ý.",
        scoreBreakdown: { recognitionPoints: 0.5, comprehensionPoints: 1.0, applicationPoints: 0.5 },
      },
      {
        sectionTitle: "Phần III. Trắc nghiệm Trả lời ngắn",
        questionCount: 4,
        totalPoints: 2.0,
        description: "4 câu hỏi điền số/kết quả tính toán (0,5 điểm/câu). Học sinh tự tính toán đại lượng không có phương án gợi ý.",
        scoreBreakdown: { recognitionPoints: 0.5, comprehensionPoints: 0.5, applicationPoints: 1.0 },
      },
      {
        sectionTitle: "Phần IV. Tự luận",
        questionCount: 2,
        totalPoints: 3.0,
        description: "2 bài toán tự luận vận dụng (bài toán thực tiễn, phân tích đồ thị hoặc thiết kế phương án thí nghiệm).",
        scoreBreakdown: { recognitionPoints: 1.0, comprehensionPoints: 0.5, applicationPoints: 1.5 },
      },
    ],
  },
  {
    grade: 11,
    examTitle: "Ma trận Đề Kiểm tra Cuối Kì I - Vật lí 11 (Chuẩn CV 7991)",
    durationMinutes: 45,
    regulationsRef: "Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ Giáo dục & Đào tạo",
    cognitiveRatio: {
      recognitionPercent: 40,
      comprehensionPercent: 30,
      applicationPercent: 30,
    },
    totalPoints: 10.0,
    sections: [
      {
        sectionTitle: "Phần I. Trắc nghiệm 4 lựa chọn (1 phương án đúng)",
        questionCount: 12,
        totalPoints: 3.0,
        description: "12 câu hỏi trắc nghiệm về Dao động điều hòa và Sóng cơ học (0,25 điểm/câu).",
        scoreBreakdown: { recognitionPoints: 2.0, comprehensionPoints: 1.0, applicationPoints: 0.0 },
      },
      {
        sectionTitle: "Phần II. Trắc nghiệm Đúng - Sai (Dạng phức hợp 4 ý)",
        questionCount: 2,
        totalPoints: 2.0,
        description: "2 câu hỏi tình huống thực tế về sự truyền sóng hoặc đồ thị dao động li độ - thời gian.",
        scoreBreakdown: { recognitionPoints: 0.5, comprehensionPoints: 1.0, applicationPoints: 0.5 },
      },
      {
        sectionTitle: "Phần III. Trắc nghiệm Trả lời ngắn",
        questionCount: 4,
        totalPoints: 2.0,
        description: "4 câu hỏi tính bước sóng λ, chu kì T, vận tốc v cực đại, khoảng vân i (0,5 điểm/câu).",
        scoreBreakdown: { recognitionPoints: 0.5, comprehensionPoints: 0.5, applicationPoints: 1.0 },
      },
      {
        sectionTitle: "Phần IV. Tự luận",
        questionCount: 2,
        totalPoints: 3.0,
        description: "Bài toán khảo sát năng lượng dao động điều hòa hoặc thí nghiệm đo tốc độ truyền âm.",
        scoreBreakdown: { recognitionPoints: 1.0, comprehensionPoints: 0.5, applicationPoints: 1.5 },
      },
    ],
  },
  {
    grade: 12,
    examTitle: "Ma trận Đề Kiểm tra Cuối Kì I - Vật lí 12 (Chuẩn CV 7991)",
    durationMinutes: 45,
    regulationsRef: "Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ Giáo dục & Đào tạo (Trang 89)",
    cognitiveRatio: {
      recognitionPercent: 40,
      comprehensionPercent: 30,
      applicationPercent: 30,
    },
    totalPoints: 10.0,
    sections: [
      {
        sectionTitle: "Phần I. Trắc nghiệm 4 lựa chọn (1 phương án đúng)",
        questionCount: 12,
        totalPoints: 3.0,
        description: "12 câu hỏi về Vật lí nhiệt (nóng chảy, hóa hơi, nội năng) và Khí lí tưởng (Boyle, Charles, PT trạng thái).",
        scoreBreakdown: { recognitionPoints: 2.0, comprehensionPoints: 1.0, applicationPoints: 0.0 },
      },
      {
        sectionTitle: "Phần II. Trắc nghiệm Đúng - Sai (Dạng phức hợp 4 ý)",
        questionCount: 2,
        totalPoints: 2.0,
        description: "2 câu hỏi tình huống mô hình động học phân tử và đồ thị biến đổi trạng thái khí trong hệ p-V, p-T.",
        scoreBreakdown: { recognitionPoints: 0.5, comprehensionPoints: 1.0, applicationPoints: 0.5 },
      },
      {
        sectionTitle: "Phần III. Trắc nghiệm Trả lời ngắn",
        questionCount: 4,
        totalPoints: 2.0,
        description: "4 câu hỏi tính nhiệt lượng Q = mcΔT, công A = pΔV, áp suất p hoặc nhiệt độ tuyệt đối T (Kelvin).",
        scoreBreakdown: { recognitionPoints: 0.5, comprehensionPoints: 0.5, applicationPoints: 1.0 },
      },
      {
        sectionTitle: "Phần IV. Tự luận",
        questionCount: 2,
        totalPoints: 3.0,
        description: "Bài toán cân bằng nhiệt kết hợp chuyển thể hoặc chu trình biến đổi trạng thái của khối khí lí tưởng.",
        scoreBreakdown: { recognitionPoints: 1.0, comprehensionPoints: 0.5, applicationPoints: 1.5 },
      },
    ],
  },
];

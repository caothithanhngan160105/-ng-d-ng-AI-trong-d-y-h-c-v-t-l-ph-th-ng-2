import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Google GenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API: Generate / Tailor Activity with Gemini 3.8 Flash
app.post("/api/generate-lesson-activity", async (req: Request, res: Response) => {
  try {
    const {
      grade,
      topic,
      lessonName,
      bookSeries,
      pedagogicalMethod,
      targetLevel,
      customNote,
      simulationName,
    } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "Chưa cấu hình GEMINI_API_KEY trong hệ thống.",
        fallback: true,
      });
    }

    const systemInstruction = `Bạn là chuyên gia sư phạm Vật lí hàng đầu Việt Nam, am hiểu sâu sắc Chương trình GDPT 2018, Sách giáo khoa và Sách giáo viên (SGV) Vật lí 10, 11, 12 bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam), Công văn 5512/BGDĐT-GDTrH, Công văn 3456/BGDĐT-GDTrH và Khung năng lực số cho học sinh phổ thông.
ĐẶC BIỆT LƯU Ý: CỐ ĐỊNH DUY NHẤT 1 BỘ SÁCH: KẾT NỐI TRI THỨC VỚI CUỘC SỐNG (NXB GIÁO DỤC VIỆT NAM).
ĐIỀU TIÊN QUYẾT: PHẢI CHUẨN XÁC TUYỆT ĐỐI VỀ MẶT KIẾN THỨC VẬT LÍ (khái niệm, định luật, định nghĩa, công thức, đơn vị, chiều vectơ, điều kiện áp dụng).

QUY ĐỊNH ĐẶC BIỆT THEO YÊU CẦU GIÁO VIÊN:
1. KHÔNG CẦN ĐƯA MỤC TIÊU VÀO (Không cần trường objectives).
2. KHÔNG CẦN THIẾT BỊ DẠY HỌC, CHỈ TRÌNH BÀY DUY NHẤT HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC MỚI.
3. KHI HÌNH THÀNH KIẾN THỨC MỚI, BẮT BUỘC PHẢI ĐƯA RA TÌNH HUỐNG CÓ VẤN ĐỀ (problematicSituation) THẬT KÍCH THÍCH HỨNG THÚ, GÂY MÂU THUẪN NHẬN THỨC (Cognitive Conflict) giữa nhận thức trực giác ban đầu và hiện tượng thực tế, kích thích trí tò mò của học sinh.
4. Tình huống có vấn đề phải có:
   - title: Tiêu đề tình huống hấp dẫn, giật gân, nghịch lí.
   - scenario: Mô tả bối cảnh hiện tượng thực tiễn sống động gây bất ngờ hoặc đối lập nhận thức.
   - mediaHint: Gợi ý học liệu trực quan, clip, mô phỏng.
   - drivingQuestion: Câu hỏi then chốt kích thích tư duy khoa học.
   - studentHypotheses: Các phỏng đoán/giả thuyết ban đầu trái chiều của học sinh.
   - transitionToExperiment: Lời dẫn chuyển giao sang thí nghiệm ảo để kiểm chứng.
5. Tiến trình dạy học: Chuẩn 4 bước CV 5512 cho riêng hoạt động hình thành kiến thức (Bước 1: Chuyển giao nhiệm vụ -> Bước 2: Thực hiện nhiệm vụ trên mô phỏng thí nghiệm số -> Bước 3: Báo cáo, thảo luận -> Bước 4: Kết luận, nhận định chốt kiến thức).
6. Phiếu học tập (PHT) số hóa đính kèm và Lưu ý sư phạm từ SGV KNTT.`;

    const prompt = `Hãy thiết kế Kế hoạch bài dạy chuẩn Công văn 5512 và phát triển Năng lực số cho:
- Môn: Vật lí Lớp ${grade}
- Chủ đề/Chương: ${topic}
- Tên bài dạy: ${lessonName}
- Bộ SGK: Cố định chuẩn "Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)"
- Yêu cầu cốt lõi: KHÔNG CẦN MỤC TIÊU, KHÔNG CẦN THIẾT BỊ DẠY HỌC, CHỈ TRÌNH BÀY DUY NHẤT HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC MỚI. BẮT BUỘC PHẢI CÓ TÌNH HUỐNG CÓ VẤN ĐỀ để kích thích hứng thú của học sinh. Chuẩn xác tuyệt đối kiến thức vật lí.
- Phương pháp dạy học: ${pedagogicalMethod || "Dạy học giải quyết vấn đề kết hợp thí nghiệm ảo số"}
- Mô phỏng thí nghiệm ảo tích hợp: ${simulationName || "Mô phỏng tương tác số"}
- Yêu cầu bổ sung của giáo viên: ${customNote || "Không có"}

Yêu cầu trả về đúng định dạng JSON có cấu trúc sau:
{
  "activityTitle": "Hoạt động: Hình thành kiến thức mới...",
  "durationMinutes": 25,
  "problematicSituation": {
    "title": "Tiêu đề tình huống / Nghịch lí gây mâu thuẫn nhận thức...",
    "scenario": "Hiện tượng thực tế gây bất ngờ hoặc đối nghịch với trực giác thông thường...",
    "mediaHint": "Video / Hình ảnh / Hiện tượng trực quan...",
    "drivingQuestion": "Câu hỏi then chốt kích thích tư duy và tranh luận...",
    "studentHypotheses": ["Giả thuyết 1 của HS...", "Giả thuyết 2 của HS..."],
    "transitionToExperiment": "Cầu nối chuyển giao sang sử dụng thí nghiệm ảo để kiểm chứng..."
  },
  "content": "Nhiệm vụ học tập giao cho học sinh...",
  "product": "Sản phẩm cụ thể học sinh hoàn thành...",
  "implementation": {
    "step1_transfer": "Bước 1: Chuyển giao nhiệm vụ (GV nêu tình huống có vấn đề, gợi ý giả thuyết, phát PHT)...",
    "step2_execution": "Bước 2: Thực hiện nhiệm vụ (HS thao tác trên thí nghiệm ảo để thu thập số liệu)...",
    "step3_discussion": "Bước 3: Báo cáo, thảo luận (Các nhóm trình bày số liệu, đối chiếu giả thuyết ban đầu)...",
    "step4_conclusion": "Bước 4: Kết luận, nhận định chuẩn hóa kiến thức và công thức..."
  },
  "studentWorksheet": {
    "title": "PHIẾU HỌC TẬP: ...",
    "tasks": [
      {"id": 1, "instruction": "Thao tác trên mô phỏng...", "prompt": "Ghi lại số liệu / Nhận xét...", "expectedAnswer": "Gợi ý đáp án chuẩn..."}
    ]
  },
  "teacherGuideNotes": {
    "commonMisconceptions": ["Sai lầm 1...", "Sai lầm 2..."],
    "pedagogicalAdvice": ["Lời khuyên sư phạm từ SGV KNTT..."],
    "differentiationPrompts": {
      "support": "Câu hỏi hỗ trợ học sinh trung bình",
      "advanced": "Câu hỏi phát triển học sinh khá giỏi"
    }
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error generating lesson activity:", error);
    return res.status(500).json({
      error: error?.message || "Lỗi khi tạo hoạt động bài dạy bằng AI.",
    });
  }
});

// Start server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PhysLab 5512 Server running on http://localhost:${PORT}`);
  });
}

startServer();

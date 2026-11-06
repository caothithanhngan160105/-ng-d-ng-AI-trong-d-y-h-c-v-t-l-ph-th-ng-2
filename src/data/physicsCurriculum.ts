import { LessonTopic, SimulationMeta } from "../types/physics";
import { GRADE_10_LESSONS } from "./curriculumDataGrade10";
import { GRADE_11_LESSONS } from "./curriculumDataGrade11";
import { GRADE_12_LESSONS } from "./grade12Curriculum";

export { GRADE_10_LESSONS } from "./curriculumDataGrade10";
export { GRADE_11_LESSONS } from "./curriculumDataGrade11";
export { GRADE_12_LESSONS } from "./grade12Curriculum";

export const SIMULATION_REGISTRY: SimulationMeta[] = [
  {
    id: "sim-motion-10",
    name: "Khảo sát Chuyển động Thẳng biến đổi đều & Rơi tự do (Lớp 10)",
    grade: 10,
    topic: "Động học",
    description: "Quan sát xe chạy trên đệm khí, thay đổi vận tốc ban đầu v0, gia tốc a; theo dõi đồng hồ đo thời gian tự động và đồ thị v-t, x-t trực quan.",
    keyConcepts: ["Gia tốc", "Vận tốc", "Đồ thị vận tốc - thời gian", "Độ dịch chuyển"],
  },
  {
    id: "sim-newton-10",
    name: "Khảo sát Định luật II Newton (Xe lăn & Lực kéo - Lớp 10)",
    grade: 10,
    topic: "Động lực học",
    description: "Khảo sát mối quan hệ giữa gia tốc a với hợp lực F (khi m không đổi) và với khối lượng m (khi F không đổi) theo chuẩn bài thực hành SGK.",
    keyConcepts: ["Định luật II Newton", "Lực kéo", "Khối lượng", "Gia tốc a = F/m"],
  },
  {
    id: "sim-pendulum-energy-10",
    name: "Khảo sát Con lắc đồng hồ & Định luật bảo toàn cơ năng (Bài 26 - Lớp 10)",
    grade: 10,
    topic: "Cơ học & Năng lượng",
    description: "Khảo sát sự chuyển hóa qua lại giữa động năng và thế năng của con lắc đồng hồ. Nghiệm lại định luật bảo toàn cơ năng W = Wđ + Wt = const trong trường hợp không ma sát, phân tích sự tiêu tán năng lượng do lực cản không khí và cơ chế bánh răng thoát (escapement) cấp bù năng lượng giúp quả lắc đồng hồ dao động bền bỉ qua năm tháng.",
    keyConcepts: [
      "Cơ năng W = Wđ + Wt",
      "Động năng Wđ = 1/2*m*v^2",
      "Thế năng trọng trường Wt = m*g*h",
      "Định luật bảo toàn cơ năng",
      "Độ cao h = L*(1 - cos alpha)",
      "Vận tốc cực đại tại VTCB v_max = sqrt(2gh0)",
      "Cơ chế bánh răng thoát (Escapement Mechanism)",
      "Tiêu tán năng lượng do lực cản"
    ],
  },
  {
    id: "sim-momentum-10",
    name: "Khảo sát Động lượng & Xung lượng của Lực (Cổng quang điện hiện số - Lớp 10)",
    grade: 10,
    topic: "Động lượng & Va chạm",
    description: "Khảo sát chuyển động xe đệm khí qua 2 cổng quang điện hiện số, xác định động lượng p = m.v, tạo xung lực F.dt và kiểm chứng định luật biến thiên động lượng Delta p = F.dt. Hỗ trợ xuất dữ liệu số CSV cho Excel.",
    keyConcepts: ["Động lượng p = m.v", "Vectơ động lượng", "Xung lượng của lực F.dt", "Độ biến thiên động lượng Delta p", "Năng lực số"],
  },
  {
    id: "sim-oscillator-11",
    name: "Khảo sát Dao động Điều hòa (Con lắc lò xo & Con lắc đơn - Lớp 11)",
    grade: 11,
    topic: "Dao động cơ",
    description: "Mô phỏng dao động điều hòa, vẽ đồng thời đồ thị x(t), v(t), a(t), giản đồ vectơ quay Fresnel và biểu đồ chuyển hóa động năng - thế năng.",
    keyConcepts: ["Biên độ A", "Tần số góc omega", "Chu kì T", "Pha dao động", "Bảo toàn cơ năng"],
  },
  {
    id: "sim-wave-11",
    name: "Giao thoa Sóng cơ 2 nguồn kết hợp trên mặt nước (Lớp 11)",
    grade: 11,
    topic: "Sóng cơ học",
    description: "Mô phỏng 2 nguồn sóng điểm kết hợp dao động trên mặt nước, tạo hệ vân giao thoa các hyperbol cực đại và cực tiểu, thay đổi tần số f và khoảng cách d.",
    keyConcepts: ["Giao thoa sóng", "Cực đại giao thoa", "Cực tiểu giao thoa", "Bước sóng lambda"],
  },
  {
    id: "sim-potential-energy-11",
    name: "Khảo sát Điện trường đều, Công của Lực điện & Thế năng điện (Lớp 11)",
    grade: 11,
    topic: "Điện trường & Thế năng điện",
    description: "Mô phỏng chuyển động của điện tích thử q giữa hai bản tụ điện phẳng song song, khảo sát công của lực điện A = q.E.d, đường đẳng thế và thế năng điện W_M = q.V_M.",
    keyConcepts: ["Điện trường đều", "Lực điện trường F = q.E", "Công của lực điện A = q.E.d", "Thế năng điện W_t = q.V", "Độ giảm thế năng"],
  },
  {
    id: "sim-electric-potential-11",
    name: "Điện thế, Hiệu điện thế & Mặt đẳng thế (Kèm Thí nghiệm Lớp học Sôi động - Lớp 11)",
    grade: 11,
    topic: "Điện thế & Hiệu điện thế",
    description: "Khảo sát đại lượng điện thế V = A_M_inf / q, đo hiệu điện thế U_AB bằng vôn kế số 2 đầu dò, trực quan hóa mặt đẳng thế vuông góc với vectơ E, mô hình 3D địa hình núi điện thế và đấu trường bắn hạt gia tốc.",
    keyConcepts: ["Điện thế V", "Hiệu điện thế U", "Mặt đẳng thế", "Mối liên hệ E = U/d", "Bảo toàn cơ năng hạt q"],
  },
  {
    id: "sim-refraction-11",
    name: "Khúc xạ Ánh sáng & Hiện tượng Phản xạ toàn phần (Lớp 11)",
    grade: 11,
    topic: "Quang học",
    description: "Chiếu tia laser qua môi trường trong suốt với chiết suất n1, n2 tùy chỉnh. Sử dụng thước đo độ xoay để kiểm chứng định luật Snell và góc giới hạn phản xạ toàn phần.",
    keyConcepts: ["Định luật khúc xạ ánh sáng", "Chiết suất", "Phản xạ toàn phần", "Góc tới hạn igh"],
  },
  {
    id: "sim-magnetic-flux-11",
    name: "Khảo sát Từ thông & Hiện tượng Cảm ứng điện từ (Mô phỏng 3D - Lớp 11 & 12)",
    grade: 11,
    topic: "Từ trường & Cảm ứng điện từ",
    description: "Mô phỏng 3D khung dây quay trong từ trường đều, trực quan hóa số đường sức từ xuyên qua tiết diện S, công tắc ẩn/hiện số liệu sư phạm cho học sinh tự tính Phi = B*S*cos(alpha), khảo sát 3 cách làm biến thiên từ thông tạo dòng điện cảm ứng.",
    keyConcepts: ["Từ thông Phi = B*S*cos(alpha)", "Vectơ pháp tuyến n", "Đơn vị Weber (Wb)", "Biến thiên từ thông Delta Phi", "Dòng điện cảm ứng", "Định luật Faraday"],
  },
  {
    id: "sim-gas-laws-12",
    name: "Khảo sát Các định luật chất khí: Boyle, Charles & PT trạng thái (Lớp 12)",
    grade: 12,
    topic: "Khí lí tưởng",
    description: "Mô phỏng xi-lanh kín chứa khí lí tưởng, thay đổi pit-tông để nén giãn thể tích V, thay đổi nhiệt độ T bằng nguồn nhiệt, đo áp suất p bằng áp kế và vẽ đường đẳng nhiệt p-V, đẳng áp V-T trực quan.",
    keyConcepts: ["Định luật Boyle p.V = const", "Định luật Charles V/T = const", "Phương trình Clapeyron p.V = n.R.T", "Độ không tuyệt đối 0 K"],
  },
  {
    id: "sim-thermal-12",
    name: "Đo Nhiệt dung riêng, Nhiệt nóng chảy riêng & Định luật I NĐLH (Lớp 12)",
    grade: 12,
    topic: "Vật lí nhiệt",
    description: "Mô phỏng nhiệt lượng kế đun nước bằng dây điện trở, đo công suất điện P = U.I, thời gian đun tau và độ tăng nhiệt độ Delta T. Khảo sát công và nhiệt lượng làm biến đổi nội năng Delta U = A + Q.",
    keyConcepts: ["Nội năng U", "Định luật I NĐLH Delta U = A + Q", "Nhiệt dung riêng c", "Nhiệt nóng chảy riêng lambda", "Nhiệt lượng Q = m.c.Delta T"],
  },
  {
    id: "sim-nuclear-decay-12",
    name: "Khảo sát Hiện tượng Phóng xạ & Chu kì bán rã (Lớp 12)",
    grade: 12,
    topic: "Vật lí hạt nhân",
    description: "Mô phỏng xúc xắc hạt nhân và buồng mây Wilson, khảo sát số hạt nhân chưa phân rã N(t) = N0.2^(-t/T) theo thời gian, vẽ đồ thị hàm suy giảm phóng xạ mũ và tính tuổi cổ vật bằng Cacbon-14.",
    keyConcepts: ["Hiện tượng phóng xạ", "Hạt alpha, beta, gamma", "Chu kì bán rã T", "Định luật phóng xạ", "Định tuổi Cacbon-14"],
  },
];

export const PHYSICS_CURRICULUM: LessonTopic[] = [
  ...GRADE_10_LESSONS,
  ...GRADE_11_LESSONS,
  ...GRADE_12_LESSONS,
];

export const physicsCurriculum = PHYSICS_CURRICULUM;

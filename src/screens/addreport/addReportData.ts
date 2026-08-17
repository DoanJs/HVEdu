export const reportGoals = [
  {
    id: 1,
    field: "Giao tiếp",
    icon: "bi-chat-dots",
    color: "blue",
    supportType: "down",
    goal: "Trẻ gọi tên được người thân khi được hỏi.",
    support: "Giảm hỗ trợ",
    summary:
      "Trẻ đã gọi tên được bố, mẹ, ông bà khi được hỏi trong 4/5 cơ hội. Cần khuyến khích trẻ chủ động gọi tên hơn.",
  },
  {
    id: 2,
    field: "Nhận thức",
    icon: "bi-lightbulb",
    color: "green",
    supportType: "same",
    goal: "Trẻ phân loại được đồ vật theo màu sắc (đỏ, vàng, xanh).",
    support: "Không đổi",
    summary:
      "Trẻ phân loại đúng 2/3 màu với sự gợi ý. Cần tiếp tục luyện tập để tăng độ chính xác.",
  },
  {
    id: 3,
    field: "Vận động tinh",
    icon: "bi-hand-index-thumb",
    color: "yellow",
    supportType: "down",
    goal: "Trẻ xếp chồng 6 khối vuông thành tháp.",
    support: "Giảm hỗ trợ",
    summary:
      "Trẻ xếp được 6 khối thành tháp vững, ít cần hỗ trợ hơn trước. Tiếp tục duy trì và tăng độ ổn định.",
  },
  {
    id: 4,
    field: "Kỹ năng xã hội",
    icon: "bi-people-fill",
    color: "pink",
    supportType: "up",
    goal: "Trẻ chờ đến lượt khi chơi cùng bạn trong 3 lượt.",
    support: "Tăng hỗ trợ",
    summary:
      "Trẻ mới chờ đến lượt được 1/3 lượt, chưa ổn định. Cần nhắc nhớ và hướng dẫn nhiều hơn.",
  },
  {
    id: 5,
    field: "Tự chăm sóc",
    icon: "bi-shirt",
    color: "purple",
    supportType: "same",
    goal: "Trẻ tự rửa tay bằng xà phòng đúng 6 bước.",
    support: "Không đổi",
    summary:
      "Trẻ thực hiện đúng 6 bước với sự nhắc nhỏ. Tiếp tục luyện tập để hình thành thói quen.",
  },
];

export const getRandomItem = () => {
  const array = [
    {
      icon: "bi-chat-dots",
      color: "blue",
      supportType: "down",
    },
    {
      icon: "bi-lightbulb",
      color: "green",
      supportType: "same",
    },
    {
      icon: "bi-hand-index-thumb",
      color: "yellow",
      supportType: "down",
    },
    {
      icon: "bi-people-fill",
      color: "pink",
      supportType: "up",
    },
    {
      icon: "bi-shirt",
      color: "purple",
      supportType: "same",
    },
  ];

  return array[Math.floor(Math.random() * array.length)];
};

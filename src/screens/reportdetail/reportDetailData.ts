export const reportTasks = [
  {
    id: 1,
    target: 'Trẻ gọi tên được người thân khi được hỏi.',
    field: 'Giao tiếp',
    fieldIcon: 'bi-chat-dots-fill',
    fieldClass: 'blue',
    support: 'Giảm hỗ trợ',
    supportClass: 'down',
    content: 'Gợi mở bằng câu hỏi và hình ảnh, sau đó giảm dần gợi ý để trẻ tự trả lời.',
    summary: 'Trẻ đã gọi tên được bố, mẹ, ông bà trong 4/5 cơ hội. Cần khuyến khích trẻ chủ động gọi tên hơn.',
  },
  {
    id: 2,
    target: 'Trẻ phân loại được đồ vật theo màu sắc (đỏ, vàng, xanh).',
    field: 'Nhận thức',
    fieldIcon: 'bi-lightbulb-fill',
    fieldClass: 'green',
    support: 'Không đổi',
    supportClass: 'same',
    content: 'Sử dụng thẻ màu và đồ vật thực tế. Luyện tập qua trò chơi phân loại.',
    summary: 'Trẻ phân loại đúng 2/3 màu với sự gợi ý. Cần tiếp tục luyện tập để tăng độ chính xác.',
  },
  {
    id: 3,
    target: 'Trẻ xếp chồng 6 khối vuông thành tháp.',
    field: 'Vận động tinh',
    fieldIcon: 'bi-hand-index-thumb-fill',
    fieldClass: 'yellow',
    support: 'Giảm hỗ trợ',
    supportClass: 'down',
    content: 'Hướng dẫn mẫu, sau đó để trẻ tự thực hiện. Khích lệ và củng cố khi trẻ thành công.',
    summary: 'Trẻ xếp được 6 khối thành tháp vững, ít cần hỗ trợ hơn trước. Tiếp tục duy trì vận động ổn định.',
  },
  {
    id: 4,
    target: 'Trẻ chờ đến lượt khi chơi cùng bạn trong 3 lượt.',
    field: 'Kỹ năng xã hội',
    fieldIcon: 'bi-people-fill',
    fieldClass: 'pink',
    support: 'Tăng hỗ trợ',
    supportClass: 'up',
    content: 'Dùng đồng hồ đếm ngược, nhắc lượt bằng thẻ. Khen ngợi khi trẻ chờ đúng lượt.',
    summary: 'Trẻ mới chờ đến lượt được 1/3 lượt, chưa ổn định. Cần nhắc nhở và hướng dẫn nhiều hơn.',
  },
  {
    id: 5,
    target: 'Trẻ tự rửa tay bằng xà phòng đúng 6 bước.',
    field: 'Tự chăm sóc',
    fieldIcon: 'bi-gift-fill',
    fieldClass: 'purple',
    support: 'Không đổi',
    supportClass: 'same',
    content: 'Hướng dẫn 6 bước qua tranh. Thực hành và kiểm tra lại từng bước.',
    summary: 'Trẻ thực hiện đúng 6 bước với sự nhắc nhỏ. Tiếp tục luyện tập để hình thành thói quen.',
  },
];


export const getRandomItem = () => {
  const array = [
    {
      fieldIcon: "bi-gift-fill",
      fieldClass: "purple",
      supportClass: "same",
    },
    {
      fieldIcon: "bi-people-fill",
      fieldClass: "pink",
      supportClass: "up",
    },
    {
      fieldIcon: "bi-hand-index-thumb-fill",
      fieldClass: "yellow",
      supportClass: "down",
    },
    {
      fieldIcon: "bi-lightbulb-fill",
      fieldClass: "green",
      supportClass: "same",
    },
    {
      fieldIcon: "bi-chat-dots-fill",
      fieldClass: "blue",
      supportClass: "down",
    },
  ];

  return array[Math.floor(Math.random() * array.length)];
};

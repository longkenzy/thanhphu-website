/**
 * THÀNH PHÚ CONSTRUCTION - PROJECTS DATABASE
 * Cơ sở dữ liệu chi tiết danh mục 9 dự án tiêu biểu của Thành Phú
 */

const PROJECTS_DATA = {
  "saigon-horizon": {
    id: "saigon-horizon",
    title: "Tòa Nhà Văn Phòng & Thương Mại SaiGon Horizon",
    category: "xay-lap",
    categoryName: "Thi công xây lắp",
    badge: "Xây Lắp Dân Dụng",
    status: "Đã Bàn Giao",
    image: "assets/images/project-1.svg",
    gallery: [
      "assets/images/project-1.svg",
      "assets/images/hero-slide-1.svg",
      "assets/images/project-7.svg"
    ],
    location: "Đường Nguyễn Hữu Thọ, Quận 7, TP. Hồ Chí Minh",
    client: "Horizon Real Estate Corporation",
    scale: "2 tầng hầm + 21 tầng nổi (Tổng diện tích sàn: 32,500 m²)",
    contractType: "Tổng thầu thi công xây dựng kết cấu & hoàn thiện trọn gói",
    timeline: "Khởi công: Tháng 04/2022 - Nghiệm thu bàn giao: Tháng 06/2024",
    year: "2024",
    overview: "Tổ hợp văn phòng hạng A và trung tâm thương mại SaiGon Horizon là công trình điểm nhấn kiến trúc tại cửa ngõ Nam Sài Gòn. Thành Phú đảm nhiệm vai trò Tổng thầu xây lắp toàn diện từ giai đoạn thi công cọc khoan nhồi sâu, tường vây Barrette 2 tầng hầm đến kết cấu thân bê tông dự ứng lực nhịp lớn và toàn bộ hạ tầng kỹ thuật phụ trợ.",
    scope: [
      "Thi công cọc khoan nhồi D1200 - D1500 sâu 58m và tường vây Barrette dày 800mm.",
      "Xây dựng 2 tầng hầm sâu 8.5m với biện pháp Semi-Topdown kiểm soát chuyển vị an toàn tuyệt đối.",
      "Thi công kết cấu khung bê tông cốt thép toàn khối 21 tầng nổi ứng dụng cốp pha nhôm định hình hiện đại.",
      "Hoàn thiện khối đế thương mại, ốp lát đá Granite cao cấp và hạ tầng cảnh quan nội khu."
    ],
    highlights: [
      "Đạt 1,200,000 giờ làm việc an toàn không tai nạn lao động.",
      "Bàn giao vượt tiến độ cam kết 25 ngày so với hợp đồng gốc.",
      "Ứng dụng mô hình BIM 3D trong quản lý xung đột kết cấu và cơ điện MEP."
    ],
    related: ["tan-tao", "nam-long", "mega-logistics"]
  },

  "tan-tao": {
    id: "tan-tao",
    title: "Tổ Hợp Nhà Máy Cơ Khí & Linh Kiện Tân Tạo",
    category: "xay-lap",
    categoryName: "Thi công xây lắp",
    badge: "Xây Lắp Nhà Xưởng",
    status: "Đã Bàn Giao",
    image: "assets/images/project-2.svg",
    gallery: [
      "assets/images/project-2.svg",
      "assets/images/hero-slide-2.svg",
      "assets/images/project-5.svg"
    ],
    location: "KCN Tân Tạo, Quận Bình Tân, TP. Hồ Chí Minh",
    client: "Tân Tạo Precision Mechanics JSC",
    scale: "Khu đất 50,000 m² - Diện tích sàn xưởng sản xuất: 45,000 m²",
    contractType: "Tổng thầu thiết kế và thi công (Design & Build)",
    timeline: "Khởi công: Tháng 09/2022 - Bàn giao: Tháng 11/2023",
    year: "2023",
    overview: "Dự án tổ hợp sản xuất cơ khí công nghệ cao đòi hỏi tiêu chuẩn khắt khe về độ rung chấn nền móng và khả năng chịu tải trọng lớn của sàn xưởng. Thành Phú áp dụng công nghệ sàn bê tông gia cường sợi thép đánh bóng siêu phẳng cùng kết cấu giàn thép tiền chế khẩu độ lớn 48m không cột giữa.",
    scope: [
      "San lấp mặt bằng và xử lý nền đất yếu bằng phương pháp cọc xi măng đất (CDM).",
      "Gia công chế tạo và lắp dựng hơn 2,800 tấn kết cấu thép tiền chế vượt nhịp 48m tại xưởng cơ khí Thành Phú.",
      "Thi công nền sàn bê tông cốt sợi thép rải phẳng bằng máy laser tự động, phủ lớp sơn Epoxy kháng tĩnh điện và hóa chất.",
      "Hệ thống trạm biến áp 3x2500kVA và mạng lưới cấp thoát nước tuần hoàn."
    ],
    highlights: [
      "Đạt chứng chỉ công trình xanh LEED Gold (Hoa Kỳ).",
      "Độ phẳng mặt sàn đạt tiêu chuẩn quốc tế DIN 18202 Class 4.",
      "Tối ưu 15% thời gian gia công lắp ghép nhờ tự chủ nhà xưởng kết cấu thép."
    ],
    related: ["mega-logistics", "saigon-horizon", "cnc-amata"]
  },

  "nam-long": {
    id: "nam-long",
    title: "Hạ Tầng Trục Tuyến Giao Thông KĐT Nam Long",
    category: "xay-lap",
    categoryName: "Thi công xây lắp",
    badge: "Hạ Tầng Giao Thông",
    status: "Đang Thi Công",
    image: "assets/images/project-3.svg",
    gallery: [
      "assets/images/project-3.svg",
      "assets/images/hero-slide-3.svg",
      "assets/images/project-6.svg"
    ],
    location: "Huyện Bến Lức, Tỉnh Long An",
    client: "Tập Đoàn Nam Long (Nam Long Group)",
    scale: "Trục đường chính lộ giới 30m, chiều dài 4.2 km + Cống hộp ngầm D1500",
    contractType: "Gói thầu thi công nền móng, mặt đường và hệ thống ngầm kỹ thuật",
    timeline: "Khởi công: Tháng 03/2024 - Dự kiến nghiệm thu: Quý 4/2026",
    year: "2024 - 2026",
    overview: "Dự án phát triển trục xương sống giao thông kết nối các phân khu đô thị vệ tinh quy mô 355ha của Nam Long Group. Đội ngũ cơ giới Thành Phú huy động dàn thiết bị chuyên dùng gồm lu rung 25 tấn, máy rải bê tông nhựa nóng và trạm trộn bê tông tươi lưu động tại chân công trình.",
    scope: [
      "Xử lý nền đất yếu ven sông Vàm Cỏ bằng bấc thấm kết hợp hút chân không.",
      "Thi công lớp cấp phối đá dăm loại 1 và thảm 2 lớp bê tông nhựa chặt C12.5 & C19 dày 12cm.",
      "Lắp đặt hệ thống hào tuynel kỹ thuật ngầm đa năng tích hợp điện ngầm, cáp viễn thông và cấp nước.",
      "Xây dựng mạng lưới cống thoát nước mưa bê tông ly tâm đường kính D1000 - D1500."
    ],
    highlights: [
      "Tiến độ lũy kế hiện tại đạt 88%, vượt mốc cam kết với chủ đầu tư.",
      "Kiểm định chất lượng độ đầm chặt K >= 0.98 qua 100% các điểm đo độc lập.",
      "Giải pháp thi công đảm bảo duy trì dòng chảy tự nhiên và bảo vệ môi trường sinh thái sông nước."
    ],
    related: ["binh-loi", "saigon-horizon", "tan-tao"]
  },

  "riverfront-villas": {
    id: "riverfront-villas",
    title: "Khu Biệt Thự Cao Cấp Ven Sông Riverfront Villas",
    category: "noi-that",
    categoryName: "Trang trí nội thất",
    badge: "Nội Thất Biệt Thự",
    status: "Đã Bàn Giao",
    image: "assets/images/project-4.svg",
    gallery: [
      "assets/images/project-4.svg",
      "assets/images/project-9.svg",
      "assets/images/project-1.svg"
    ],
    location: "Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh",
    client: "Riverside Luxury Land JSC",
    scale: "Quần thể 18 căn biệt thự đơn lập view sông (Mỗi căn sàn 450 - 680 m²)",
    contractType: "Tổng thầu thi công xây dựng kết cấu và hoàn thiện nội thất chìa khóa trao tay",
    timeline: "Khởi công: Tháng 01/2023 - Hoàn thành: Tháng 05/2024",
    year: "2024",
    overview: "Dự án biệt thự siêu sang dành cho giới tinh hoa tại bán đảo Thảo Điền. Công trình yêu cầu sự tinh xảo tuyệt đối trong từng đường nét trang trí nội thất phong cách Bắc Âu (Scandinavian Luxury) kết hợp vật liệu gỗ óc chó tự nhiên Bắc Mỹ, đá cẩm thạch Calacatta nhập khẩu và hệ thống Smart Home chuẩn KNX.",
    scope: [
      "Thi công kết cấu móng bè cọc cừ tràm kết hợp cọc bê tông chống sạt lở mép sông.",
      "Gia công lắp đặt đồ gỗ nội thất phòng khách, phòng ngủ Master, phòng rượu và walk-in closet.",
      "Ốp lát đá tự nhiên Calacatta đối vân nghệ thuật khu vực sảnh chính và phòng tắm cao cấp.",
      "Xây dựng bể bơi vô cực tràn bờ công nghệ lọc muối khoáng điện phân trên tầng thượng mỗi căn biệt thự."
    ],
    highlights: [
      "100% hạng mục đồ gỗ nội thất được đo ni đóng giày gia công tại xưởng Thành Phú.",
      "Tích hợp hệ thống nhà thông minh kiểm soát ánh sáng, nhiệt độ và an ninh đa tầng.",
      "Khách hàng đánh giá hài lòng tuyệt đối về độ hoàn thiện thẩm mỹ và sự yên tĩnh cách âm."
    ],
    related: ["aqua-pearl", "saigon-horizon", "diamond-parkview"]
  },

  "mega-logistics": {
    id: "mega-logistics",
    title: "Trung Tâm Kho Vận Thông Minh Mega Logistics VSIP II",
    category: "xay-lap",
    categoryName: "Thi công xây lắp",
    badge: "Xây Lắp Công Nghiệp",
    status: "Đã Bàn Giao",
    image: "assets/images/project-5.svg",
    gallery: [
      "assets/images/project-5.svg",
      "assets/images/hero-slide-2.svg",
      "assets/images/project-2.svg"
    ],
    location: "Khu Công Nghiệp VSIP II, Tỉnh Bình Dương",
    client: "Mega Logistics Asia Holding",
    scale: "Tổng diện tích sàn 60,000 m² - Khả năng lưu kho 75,000 pallet",
    contractType: "Tổng thầu thi công xây lắp kết cấu hạ tầng kho bãi",
    timeline: "Khởi công: Tháng 11/2022 - Nghiệm thu: Tháng 12/2023",
    year: "2023",
    overview: "Kho bãi trung chuyển logistics tự động hóa hàng đầu khu vực miền Nam. Thành Phú thực hiện toàn bộ kết cấu móng cọc dự ứng lực, sàn bê tông không khe co giãn (Jointless Slab) với tải trọng phân bố đều 8 tấn/m² phục vụ hệ thống xe nâng tự hành AGV tốc độ cao.",
    scope: [
      "Ép cọc bê tông cốt thép dự ứng lực ly tâm PHC D400 và D500 tổng chiều dài hơn 42,000m.",
      "Đổ bê tông sàn siêu phẳng diện tích lớn không khe nứt bằng công nghệ phụ gia bù co ngót.",
      "Lắp dựng 18 cửa xuất nhập hàng tự động Dock Leveller chịu lực và mái che Canopy vượt nhịp 15m.",
      "Lắp đặt hệ thống PCCC tự động màng ngăn nước Drencher và đầu phun Sprinkler đạt chuẩn NFPA."
    ],
    highlights: [
      "Đạt tiêu chuẩn sàn kho hiện đại bậc nhất theo chuẩn FM2 Special của Hiệp hội Sàn bê tông Anh Quốc.",
      "Hệ thống PCCC được Cục Cảnh sát PCCC & CNCH nghiệm thu tuyệt đối an toàn.",
      "Bàn giao đúng tiến độ cho khách thuê thương mại điện tử quốc tế đi vào khai thác ngay."
    ],
    related: ["tan-tao", "saigon-horizon", "cnc-amata"]
  },

  "binh-loi": {
    id: "binh-loi",
    title: "Kè Kênh & Cảnh Quan Công Viên Sinh Thái Bình Lợi",
    category: "xay-lap",
    categoryName: "Thi công xây lắp",
    badge: "Hạ Tầng Kỹ Thuật",
    status: "Đã Bàn Giao",
    image: "assets/images/project-6.svg",
    gallery: [
      "assets/images/project-6.svg",
      "assets/images/hero-slide-3.svg",
      "assets/images/project-3.svg"
    ],
    location: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    client: "Ban Quản Lý Dự Án Đầu Tư Xây Dựng Khu Vực",
    scale: "Chiều dài tuyến kè 1,800m - Diện tích công viên cảnh quan: 3.5 hecta",
    contractType: "Thi công xây dựng công trình thủy lợi, đê kè và công viên đô thị",
    timeline: "Khởi công: Tháng 05/2021 - Bàn giao đưa vào sử dụng: Tháng 10/2022",
    year: "2022",
    overview: "Công trình trọng điểm cải tạo chỉnh trang đô thị ven sông Sài Gòn, giải quyết triệt để bài toán ngập úng và xói lở bờ sông do thủy triều. Thành Phú triển khai đóng cừ ván bê tông cốt thép dự ứng lực SW dạng sóng kết hợp dầm mũ liên kết và neo giằng đất sâu.",
    scope: [
      "Đóng 1,800m cừ ván bê tông dự ứng lực SW600 sâu 18m bằng búa rung thủy lực gắn trên sà lan nổi.",
      "Đổ bê tông dầm mũ bê tông cốt thép mác M350 liên kết hệ thống neo cọc cừ sâu vào bờ.",
      "San lấp tạo mặt bằng công viên 3.5ha, lát đá Granite lối dạo bộ và trồng cây xanh bản địa tạo bóng mát.",
      "Lắp đặt trạm bơm tiêu thoát nước chống ngập công suất 12,000 m³/h tự động theo mực nước triều."
    ],
    highlights: [
      "Khắc phục triệt để tình trạng sạt lở bờ kênh trong mùa mưa bão lớn.",
      "Tạo không gian sinh hoạt cộng đồng xanh - sạch - đẹp được người dân địa phương đánh giá cao.",
      "Công trình được UBND Thành phố trao bằng khen công trình chất lượng tiêu biểu."
    ],
    related: ["nam-long", "saigon-horizon", "riverfront-villas"]
  },

  "diamond-parkview": {
    id: "diamond-parkview",
    title: "Hệ Mặt Dựng Facade & Cửa Nhôm Kính Diamond Parkview",
    category: "nhom-kinh",
    categoryName: "SXLĐ cấu kiện nhôm kính",
    badge: "Cấu Kiện Nhôm Kính",
    status: "Đã Bàn Giao",
    image: "assets/images/project-7.svg",
    gallery: [
      "assets/images/project-7.svg",
      "assets/images/project-1.svg",
      "assets/images/project-8.svg"
    ],
    location: "Quận Tân Phú, TP. Hồ Chí Minh",
    client: "Diamond Urban Development Corp",
    scale: "2 block chung cư cao 18 tầng (14,000 m² mặt dựng kính Low-E & cửa nhôm định hình)",
    contractType: "Tổng thầu sản xuất, gia công cơ khí và lắp đặt hoàn thiện nhôm kính facade",
    timeline: "Khởi công: Tháng 08/2022 - Nghiệm thu: Tháng 12/2023",
    year: "2023",
    overview: "Tổ hợp chung cư thương mại hiện đại với điểm nhấn là mặt dựng facade vách kính phản quang Low-E tiết kiệm năng lượng. Thành Phú chịu trách nhiệm gia công toàn bộ hệ khung nhôm định hình cao cấp chịu áp lực gió bão cấp 12 và lắp đặt hơn 1,800 bộ cửa sổ, cửa đi nhôm kính cho 650 căn hộ.",
    scope: [
      "Sản xuất tại xưởng cơ khí Thành Phú hệ khung nhôm sơn tĩnh điện AkzoNobel bảo hành 25 năm.",
      "Gia công và lắp đặt 14,000 m² vách kính khung nổi (Stick Curtain Wall) sử dụng kính dán an toàn Low-E 2 lớp 10.38mm.",
      "Thi công hệ thống lan can ban công kính cường lực 15mm không trụ đạt chuẩn an toàn cao tầng.",
      "Lắp đặt cửa lùa nhôm kính hệ 93 cách âm 38dB cho toàn bộ khối căn hộ và trung tâm thương mại."
    ],
    highlights: [
      "Khả năng cách nhiệt vượt trội, giảm tới 32% điện năng tiêu thụ cho điều hòa không khí.",
      "Đạt chứng nhận kiểm định áp lực gió 2,000 Pa và kín nước tuyệt đối 600 Pa tại trung tâm thí nghiệm IBST.",
      "Được trao giải thưởng Công trình Nhôm Kính An Toàn & Đẳng Cấp."
    ],
    related: ["cnc-amata", "saigon-horizon", "aqua-pearl"]
  },

  "cnc-amata": {
    id: "cnc-amata",
    title: "Hệ Vách Kính Khổ Lớn & Cửa Nhôm Chống Cháy CNC Amata",
    category: "nhom-kinh",
    categoryName: "SXLĐ cấu kiện nhôm kính",
    badge: "Cấu Kiện Nhôm Kính",
    status: "Đang Thi Công",
    image: "assets/images/project-8.svg",
    gallery: [
      "assets/images/project-8.svg",
      "assets/images/hero-slide-2.svg",
      "assets/images/project-7.svg"
    ],
    location: "Khu Công Nghiệp Amata, TP. Biên Hòa, Tỉnh Đồng Nai",
    client: "CNC Tech Holdings Global",
    scale: "Khu nhà xưởng công nghệ 28,000 m² (Hệ thống vách kính phòng sạch & cửa nhôm chống cháy)",
    contractType: "Chế tạo, gia công và lắp đặt cấu kiện nhôm kính kỹ thuật cao",
    timeline: "Khởi công: Tháng 04/2024 - Tiến độ: 80% (Dự kiến bàn giao Quý 4/2026)",
    year: "2024 - 2026",
    overview: "Nhà máy sản xuất linh kiện bán dẫn và chip điện tử đòi hỏi môi trường phòng sạch Cleanroom Class 10.000 với độ kín khít tuyệt đối và tiêu chuẩn phòng cháy chữa cháy khắt khe. Thành Phú cung cấp gói thầu cấu kiện cửa nhôm kính chống cháy EI60 và vách kính thông tầng cho khối nhà điều hành R&D.",
    scope: [
      "Chế tạo và thử nghiệm đốt mẫu cửa nhôm kính ngăn cháy EI60 đạt kiểm định của Cục Cảnh sát PCCC.",
      "Thi công hệ vách kính phòng sạch hai mặt phẳng liền mạch không bám bụi bẩn, tích hợp hệ khóa liên động Interlock.",
      "Lắp đặt vách kính Spider chân nhện khổ lớn 3.2m x 2.4m tại sảnh văn phòng đón tiếp đối tác quốc tế.",
      "Thi công hệ cửa tự động cảm biến mắt thần nhập khẩu Nhật Bản đóng mở êm ái."
    ],
    highlights: [
      "Đáp ứng hoàn toàn tiêu chuẩn PCCC mới nhất QCVN 06:2022/BXD.",
      "Kiểm soát độ bụi và áp suất phòng sạch đạt chứng nhận ISO 14644-1.",
      "Quy trình sản xuất CNC khép kín tại nhà xưởng Thành Phú đảm bảo sai số lắp dựng dưới 1mm."
    ],
    related: ["diamond-parkview", "tan-tao", "mega-logistics"]
  },

  "aqua-pearl": {
    id: "aqua-pearl",
    title: "Nội Thất Khách Sạn & Nghỉ Dưỡng Aqua Pearl Resort",
    category: "noi-that",
    categoryName: "Trang trí nội thất",
    badge: "Nội Thất Khách Sạn",
    status: "Đã Bàn Giao",
    image: "assets/images/project-9.svg",
    gallery: [
      "assets/images/project-9.svg",
      "assets/images/project-4.svg",
      "assets/images/hero-slide-1.svg"
    ],
    location: "Bãi Sau, TP. Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu",
    client: "Pearl Hospitality Investment Group",
    scale: "Khách sạn 4 sao quốc tế, 140 phòng nghỉ + Sảnh tiệc cưới 800 khách",
    contractType: "Thiết kế, sản xuất và thi công hoàn thiện nội thất trọn gói",
    timeline: "Khởi công: Tháng 02/2021 - Nghiệm thu bàn giao: Tháng 08/2022",
    year: "2022",
    overview: "Tổ hợp nghỉ dưỡng biển cao cấp kết hợp trung tâm hội nghị tiệc cưới quốc tế. Thành Phú đảm nhiệm toàn bộ công tác thi công nội thất kiến trúc lấy cảm hứng từ đại dương nhiệt đới, xử lý triệt để khả năng chống ăn mòn của hơi muối biển đối với phụ kiện kim loại và gỗ nội thất.",
    scope: [
      "Sản xuất lắp đặt đồ gỗ nội thất phòng ngủ, tủ âm tường, vách đầu giường ốp nỉ tiêu âm cho 140 phòng tiêu chuẩn 4 sao.",
      "Thi công trần thạch cao uốn lượn giật cấp kết hợp hệ thống đèn LED âm trần cảm ứng sảnh tiệc 800 khách.",
      "Hoàn thiện hệ vách ngăn di động tiêu âm STC 52 ngăn chia linh hoạt các phòng hội nghị đa năng.",
      "Lắp đặt hệ thống cửa ban công nhôm cầu cách nhiệt và phụ kiện Inox 316 kháng muối biển tuyệt hảo."
    ],
    highlights: [
      "Được vinh danh giải thưởng Top 10 Khu Nghỉ Dưỡng Biển Kiến Trúc Nội Thất Đẹp 2023.",
      "Thời gian thi công hoàn thành vượt tiến độ 40 ngày, kịp mở cửa đón mùa du lịch cao điểm.",
      "Tuổi thọ vật liệu nội thất duy trì độ bóng đẹp bền bỉ sau hơn 2 năm vận hành thực tế."
    ],
    related: ["riverfront-villas", "diamond-parkview", "saigon-horizon"]
  }
};

/**
 * Hàm hiển thị chi tiết dự án trên trang chi-tiet-du-an.html
 */
async function renderProjectDetail() {
  const container = document.getElementById('project-detail-container');
  if (!container) return;

  // Lấy ID hoặc slug từ URL query parameter (?id=saigon-horizon)
  const urlParams = new URLSearchParams(window.location.search);
  let projectId = urlParams.get('id');

  let project = null;
  let apiFetched = false;

  // Thử tải từ REST API trước (MongoDB Atlas)
  if (projectId) {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          project = data.data;
          apiFetched = true;
        }
      } else {
        apiFetched = true; // API phản hồi 404 hoặc không tìm thấy
      }
    } catch (e) {
      console.warn('Fallback to local database for project:', e);
    }
  }

  // Fallback sang local PROJECTS_DATA chỉ khi offline hoàn toàn
  if (!project && !apiFetched) {
    if (projectId && PROJECTS_DATA[projectId]) {
      project = PROJECTS_DATA[projectId];
    }
  }

  // Nếu không tìm thấy dự án (đã bị xóa hoặc không tồn tại)
  if (!project) {
    container.innerHTML = `
      <div style="text-align: center; padding: 70px 20px; background: #ffffff; border-radius: var(--radius-sm); border: 1px dashed var(--gray-border); margin: 30px 0;">
        <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--gray); margin-bottom: 16px;"></i>
        <h2 style="font-size: 1.4rem; color: var(--dark); margin-bottom: 10px;">Dự án không tồn tại hoặc đã bị gỡ bỏ</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 520px; margin: 0 auto 25px;">
          Dự án bạn đang tìm kiếm có thể đã bị xóa hoặc tạm ẩn trong hệ thống quản trị.
        </p>
        <a href="du-an.html" class="btn btn-primary btn-sm"><i class="fas fa-arrow-left"></i> Quay Lại Danh Mục Dự Án</a>
      </div>
    `;
    return;
  }

  // 1. Cập nhật Title & Meta trang
  document.title = `${project.title} | Dự Án Thành Phú Construction`;

  // 2. Cập nhật Tiêu đề & Badges
  const detailTitle = document.getElementById('detail-title');
  if (detailTitle) detailTitle.textContent = project.title;

  const detailBadge = document.getElementById('detail-badge');
  if (detailBadge) detailBadge.textContent = project.badge || 'Dự Án Tiêu Biểu';

  const detailStatus = document.getElementById('detail-status');
  if (detailStatus) {
    detailStatus.textContent = project.status || 'Đã Bàn Giao';
    if (project.status && (project.status.includes('Đang') || project.status.includes('thi công'))) {
      detailStatus.style.backgroundColor = 'var(--accent)';
      detailStatus.style.color = 'var(--dark)';
    } else {
      detailStatus.style.backgroundColor = 'var(--primary)';
      detailStatus.style.color = '#ffffff';
    }
  }

  const detailCategory = document.getElementById('detail-category');
  if (detailCategory) {
    detailCategory.textContent = project.categoryName || 'Thi công xây lắp';
    detailCategory.href = `du-an.html?cat=${project.category || 'xay-lap'}`;
  }

  // 3. Cập nhật Ảnh đại diện & Gallery
  const mainImage = document.getElementById('detail-main-img');
  if (mainImage) {
    mainImage.src = project.image || 'assets/images/project-1.svg';
    mainImage.alt = project.title;
  }

  const galleryThumbs = document.getElementById('detail-gallery-thumbs');
  if (galleryThumbs && project.gallery && project.gallery.length > 0) {
    galleryThumbs.innerHTML = project.gallery.map((imgSrc, idx) => `
      <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchDetailMainImage('${imgSrc}', this)">
        <img src="${imgSrc}" alt="${project.title} - Ảnh ${idx + 1}">
      </div>
    `).join('');
  }

  // 4. Cập nhật Bảng Thông Số Kỹ Thuật (Specs Table)
  const specClient = document.getElementById('spec-client');
  if (specClient) specClient.textContent = project.client || 'Thành Phú & Đối Tác';

  const specLocation = document.getElementById('spec-location');
  if (specLocation) specLocation.textContent = project.location || 'TP. Hồ Chí Minh';

  const specScale = document.getElementById('spec-scale');
  if (specScale) specScale.textContent = project.scale || 'Quy mô tiêu chuẩn';

  const specContract = document.getElementById('spec-contract');
  if (specContract) specContract.textContent = project.contractType || 'Tổng thầu thi công xây dựng';

  const specTimeline = document.getElementById('spec-timeline');
  if (specTimeline) specTimeline.textContent = project.timeline || 'Đang cập nhật';

  const specYear = document.getElementById('spec-year');
  if (specYear) specYear.textContent = project.year || '2024';

  // 5. Cập nhật Nội dung chi tiết
  const detailOverview = document.getElementById('detail-overview');
  if (detailOverview) detailOverview.textContent = project.overview || '';

  const detailScope = document.getElementById('detail-scope');
  if (detailScope) {
    if (project.scope && project.scope.length > 0) {
      detailScope.innerHTML = project.scope.map(item => `
        <li><i class="fas fa-check-circle" style="color: var(--primary); margin-right: 10px;"></i> ${item}</li>
      `).join('');
      detailScope.parentElement.style.display = 'block';
    } else {
      detailScope.parentElement.style.display = 'none';
    }
  }

  const detailHighlights = document.getElementById('detail-highlights');
  if (detailHighlights) {
    if (project.highlights && project.highlights.length > 0) {
      detailHighlights.innerHTML = project.highlights.map(item => `
        <li><i class="fas fa-star" style="color: var(--accent); margin-right: 10px;"></i> ${item}</li>
      `).join('');
      detailHighlights.parentElement.style.display = 'block';
    } else {
      detailHighlights.parentElement.style.display = 'none';
    }
  }

  // Nếu có nội dung bài viết chi tiết dạng HTML
  let extraContentBox = document.getElementById('detail-rich-content-box');
  if (!extraContentBox && project.content && project.content.trim() && project.content !== '<p></p>') {
    const parentBody = document.querySelector('.project-detail-body');
    if (parentBody) {
      extraContentBox = document.createElement('div');
      extraContentBox.id = 'detail-rich-content-box';
      extraContentBox.className = 'detail-block';
      extraContentBox.innerHTML = `
        <h2 class="detail-block-title">
          <i class="fas fa-file-lines"></i> BÀI VIẾT CHI TIẾT & HÌNH ẢNH THI CÔNG
        </h2>
        <div style="line-height: 1.8; color: var(--text-body); font-size: 0.95rem;">
          ${project.content}
        </div>
      `;
      const commitmentBox = parentBody.querySelector('.commitment-box');
      if (commitmentBox) {
        parentBody.insertBefore(extraContentBox, commitmentBox);
      } else {
        parentBody.appendChild(extraContentBox);
      }
    }
  }

  // 6. Cập nhật Dự án liên quan (Related Projects)
  const relatedContainer = document.getElementById('detail-related-grid');
  if (relatedContainer) {
    try {
      const relRes = await fetch('/api/projects?limit=3');
      if (relRes.ok) {
        const relData = await relRes.json();
        if (relData.success && Array.isArray(relData.data)) {
          const relList = relData.data.filter(p => (p.id !== project.id && p.slug !== project.slug));
          if (relList.length > 0) {
            relatedContainer.innerHTML = relList.slice(0, 3).map(relProject => `
              <div class="project-card" data-category="${relProject.category || 'xay-lap'}">
                <a href="chi-tiet-du-an.html?id=${relProject.slug || relProject.id}" class="project-img-box">
                  <span class="project-badge">${relProject.badge || 'Xây Lắp'}</span>
                  <span class="project-status">${relProject.status || 'Đã Bàn Giao'}</span>
                  <img src="${relProject.image || 'assets/images/project-1.svg'}" alt="${relProject.title}" onerror="this.src='assets/images/project-1.svg'">
                </a>
                <div class="project-body">
                  <h3 class="project-title"><a href="chi-tiet-du-an.html?id=${relProject.slug || relProject.id}">${relProject.title}</a></h3>
                  <div class="project-meta">
                    <div class="project-meta-item"><i class="fas fa-map-marker-alt"></i> ${relProject.location || 'TP.HCM'}</div>
                    <div class="project-meta-item"><i class="fas fa-ruler-combined"></i> ${relProject.scale || 'Tiêu chuẩn'}</div>
                  </div>
                  <div style="margin-top: 15px;">
                    <a href="chi-tiet-du-an.html?id=${relProject.slug || relProject.id}" class="btn btn-primary btn-sm" style="width: 100%;">
                      Xem Chi Tiết <i class="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            `).join('');
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Could not load dynamic related projects:', e);
    }
  }
}

/**
 * Hàm khởi tạo và hiển thị danh sách dự án động trên trang du-an.html
 */
async function initProjectsPage() {
  const gridContainer = document.getElementById('projects-grid-container') || document.querySelector('.project-grid');
  const filterNav = document.getElementById('projects-filter-nav') || document.querySelector('.filter-nav');

  if (!gridContainer) return;

  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('API response not ok');
    const data = await res.json();
    
    if (data.success && Array.isArray(data.data)) {
      const projects = data.data;
      window.allLoadedProjects = projects;

      // Cập nhật số lượng trên các nút bộ lọc Filter Nav
      if (filterNav) {
        const xayLapCount = projects.filter(p => p.category === 'xay-lap' || p.category === 'caotang' || p.category === 'congnghiep' || p.category === 'hatang').length;
        const noiThatCount = projects.filter(p => p.category === 'noi-that').length;
        const nhomKinhCount = projects.filter(p => p.category === 'nhom-kinh').length;
        
        filterNav.innerHTML = `
          <button type="button" class="filter-btn active" data-filter="all">TẤT CẢ DỰ ÁN (${projects.length})</button>
          <button type="button" class="filter-btn" data-filter="xay-lap">THI CÔNG XÂY LẮP (${xayLapCount})</button>
          <button type="button" class="filter-btn" data-filter="noi-that">TRANG TRÍ NỘI THẤT (${noiThatCount})</button>
          <button type="button" class="filter-btn" data-filter="nhom-kinh">SXLĐ CẤU KIỆN NHÔM KÍNH (${nhomKinhCount})</button>
        `;
      }

      // Nếu không có dự án nào trong hệ thống (hoặc đã bị xóa hết)
      if (projects.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; background: #ffffff; border: 1px dashed var(--gray-border); border-radius: var(--radius-sm); box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
            <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--gray); margin-bottom: 15px;"></i>
            <h3 style="font-size: 1.3rem; margin-bottom: 8px; color: var(--dark);">Hiện chưa có dự án nào được công bố</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 520px; margin: 0 auto 20px;">
              Danh mục dự án đang được cập nhật hoặc tạm ẩn. Vui lòng quay lại sau hoặc liên hệ với chúng tôi để biết thêm chi tiết.
            </p>
            <a href="lien-he.html" class="btn btn-primary btn-sm"><i class="fas fa-phone-alt"></i> Liên Hệ Trực Tiếp</a>
          </div>
        `;
        return;
      }

      // Render danh sách dự án động
      gridContainer.innerHTML = projects.map(p => {
        const isOngoing = p.status && (p.status.toLowerCase().includes('đang') || p.status.toLowerCase().includes('thi công'));
        const statusStyle = isOngoing ? 'background: var(--accent); color: var(--dark);' : 'background: var(--primary); color: #ffffff;';
        
        return `
          <div class="project-card" data-category="${p.category || 'xay-lap'}">
            <a href="chi-tiet-du-an.html?id=${p.slug || p.id}" class="project-img-box">
              <span class="project-badge">${p.badge || p.categoryName || 'Dự Án Tiêu Biểu'}</span>
              <span class="project-status" style="${statusStyle}">${p.status || 'Đã Bàn Giao'}</span>
              <img src="${p.image || 'assets/images/project-1.svg'}" alt="${p.title}" loading="lazy" onerror="this.src='assets/images/project-1.svg'">
            </a>
            <div class="project-body">
              <h3 class="project-title"><a href="chi-tiet-du-an.html?id=${p.slug || p.id}">${p.title}</a></h3>
              <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.overview || ''}</p>
              <div class="project-meta">
                ${p.location ? `<div class="project-meta-item"><i class="fas fa-map-marker-alt"></i> ${p.location}</div>` : ''}
                ${p.scale ? `<div class="project-meta-item"><i class="fas fa-ruler-combined"></i> ${p.scale}</div>` : ''}
                ${p.client ? `<div class="project-meta-item"><i class="fas fa-user-tie"></i> Chủ đầu tư: ${p.client}</div>` : ''}
                ${p.timeline || p.year ? `<div class="project-meta-item"><i class="fas fa-calendar-alt"></i> ${p.timeline || ('Hoàn thành: ' + p.year)}</div>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Gắn lại sự kiện lọc danh mục
      if (typeof initProjectFilter === 'function') {
        initProjectFilter();
      }
      if (typeof gsap !== 'undefined') {
        gsap.utils.toArray('#projects-grid-container .project-card').forEach((card, index) => {
          gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: (index % 3) * 0.06,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                toggleActions: 'play none none none'
              }
            }
          );
        });
      }
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }
  } catch (err) {
    console.warn('Không tải được danh sách dự án động từ API:', err);
  }
}

/**
 * Hàm khởi tạo và hiển thị dự án tiêu biểu trên trang chủ index.html
 */
async function initHomeProjects() {
  const homeGrid = document.getElementById('home-projects-grid');
  if (!homeGrid) return;

  try {
    const res = await fetch('/api/projects?limit=8');
    if (!res.ok) throw new Error('API response not ok');
    const data = await res.json();

    if (data.success && Array.isArray(data.data)) {
      const projects = data.data;
      if (projects.length === 0) {
        homeGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
            <i class="fas fa-folder-open" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--gray);"></i>
            <h4>Dự án đang được cập nhật</h4>
            <p style="font-size: 0.9rem;">Vui lòng quay lại sau.</p>
          </div>
        `;
        return;
      }

      homeGrid.innerHTML = projects.slice(0, 8).map(p => {
        const isOngoing = p.status && (p.status.toLowerCase().includes('đang') || p.status.toLowerCase().includes('thi công'));
        const statusStyle = isOngoing ? 'background: var(--accent); color: var(--dark);' : 'background: var(--primary); color: #ffffff;';
        
        return `
          <div class="project-card" data-category="${p.category || 'caotang'}">
            <a href="chi-tiet-du-an.html?id=${p.slug || p.id}" class="project-img-box">
              <span class="project-badge">${p.badge || 'Dự Án'}</span>
              <span class="project-status" style="${statusStyle}">${p.status || 'Đã Bàn Giao'}</span>
              <img src="${p.image || 'assets/images/project-1.svg'}" alt="${p.title}" loading="lazy" onerror="this.src='assets/images/project-1.svg'">
            </a>
            <div class="project-body">
              <h3 class="project-title"><a href="chi-tiet-du-an.html?id=${p.slug || p.id}">${p.title}</a></h3>
              <div class="project-meta">
                ${p.location ? `<div class="project-meta-item"><i class="fas fa-map-marker-alt"></i> ${p.location}</div>` : ''}
                ${p.scale ? `<div class="project-meta-item"><i class="fas fa-ruler-combined"></i> Quy mô: ${p.scale}</div>` : ''}
                ${p.timeline || p.year ? `<div class="project-meta-item"><i class="fas fa-calendar-check"></i> ${p.timeline || ('Hoàn thành: ' + p.year)}</div>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');

      if (typeof initProjectFilter === 'function') {
        initProjectFilter();
      }
      if (typeof gsap !== 'undefined') {
        gsap.utils.toArray('#home-projects-grid .project-card').forEach((card, index) => {
          gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: (index % 3) * 0.08,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                toggleActions: 'play none none none'
              }
            }
          );
        });
      }
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }
  } catch (err) {
    console.warn('Không tải được dự án trang chủ:', err);
  }
}

/**
 * Hàm chuyển ảnh to khi bấm vào ảnh thumbnail
 */
function switchDetailMainImage(src, thumbElement) {
  const mainImage = document.getElementById('detail-main-img');
  if (mainImage) {
    mainImage.style.opacity = '0.5';
    mainImage.src = src;
    setTimeout(() => {
      mainImage.style.opacity = '1';
    }, 150);
  }

  const allThumbs = document.querySelectorAll('.thumb-item');
  allThumbs.forEach(t => t.classList.remove('active'));
  if (thumbElement) {
    thumbElement.classList.add('active');
  }
}

// Gắn vào window để gọi từ bất kỳ đâu
if (typeof window !== 'undefined') {
  window.PROJECTS_DATA = PROJECTS_DATA;
  window.renderProjectDetail = renderProjectDetail;
  window.initProjectsPage = initProjectsPage;
  window.initHomeProjects = initHomeProjects;
  window.switchDetailMainImage = switchDetailMainImage;
}


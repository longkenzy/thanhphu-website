/**
 * THÀNH PHÚ CONSTRUCTION - ARTICLES DATABASE & DETAIL RENDERER
 * Cơ sở dữ liệu và bộ xử lý hiển thị chi tiết tin tức Thành Phú
 */

const ARTICLES_DATA = {
  "le-cat-noc-saigon-horizon": {
    _id: "art_saigon_horizon_001",
    id: "le-cat-noc-saigon-horizon",
    slug: "le-cat-noc-saigon-horizon",
    title: "Lễ Cất Nóc Vượt Tiến Độ 25 Ngày Tòa Nhà Văn Phòng SaiGon Horizon",
    category: "su-kien",
    categoryName: "Sự Kiện & Tiến Độ",
    author: "Ban Truyền Thông Thành Phú",
    date: "15/08/2026",
    image: "assets/images/news-1.svg",
    isFeatured: true,
    status: "published",
    views: 1845,
    excerpt: "Sáng ngày 15/08, Công ty CP Đầu tư Xây lắp Thành Phú cùng Chủ đầu tư đã chính thức đổ mẻ bê tông cất nóc tầng 21 tháp văn phòng cao cấp SaiGon Horizon. Sự kiện đánh dấu việc hoàn thành toàn bộ phần kết cấu thô trước tiến độ cam kết 25 ngày.",
    content: `
      <h3>Dấu ấn vượt tiến độ tại dự án trọng điểm phía Nam</h3>
      <p>Sáng ngày 15/08, trong không khí phấn khởi và trang trọng, Công ty Cổ phần Đầu tư Xây lắp Thành Phú cùng Chủ đầu tư Horizon Real Estate Corporation đã chính thức tiến hành nghi thức đổ mẻ bê tông cất nóc tầng 21 – tầng cao nhất của tháp văn phòng hạng A SaiGon Horizon (Đường Nguyễn Hữu Thọ, Quận 7, TP.HCM).</p>
      <p>Sự kiện đánh dấu mốc son quan trọng khi gói thầu Tổng thầu kết cấu và hoàn thiện thô được bàn giao trước tiến độ cam kết trong hợp đồng gốc đến <strong>25 ngày</strong>, đồng thời ghi nhận kỷ lục hơn <strong>1,200,000 giờ lao động an toàn tuyệt đối</strong> không xảy ra tai nạn.</p>
      <blockquote>"Thành công vượt tiến độ tại SaiGon Horizon là minh chứng rõ nét cho năng lực quản trị dự án chuyên nghiệp, kỷ luật thi công công trường và tinh thần tận tâm, sáng tạo của đội ngũ kỹ sư Thành Phú."<br><small>— Ông Nguyễn Văn Thành, Tổng Giám Đốc Công ty CP Đầu tư Xây lắp Thành Phú</small></blockquote>
      <h3>Quy mô kỹ thuật và giải pháp thi công hiện đại</h3>
      <p>Dự án SaiGon Horizon có quy mô 2 tầng hầm và 21 tầng nổi, tổng diện tích sàn xây dựng lên đến 32,500 m². Để đạt được tiến độ thần tốc nhưng vẫn đảm bảo chất lượng kỹ thuật cao nhất theo tiêu chuẩn ISO 9001:2015, Ban chỉ huy công trường Thành Phú đã áp dụng đồng bộ các giải pháp kỹ thuật tiên tiến:</p>
      <ul>
        <li>Ứng dụng mô hình số hóa <strong>BIM 3D & 4D</strong> để phối hợp xung đột kết cấu dầm sàn với hệ thống cơ điện MEP trước khi lắp dựng cốp pha.</li>
        <li>Sử dụng hệ cốp pha nhôm định hình hiện đại, chu kỳ đổ bê tông sàn đạt trung bình 6 ngày/sàn.</li>
        <li>Kiểm soát chất lượng bê tông thương phẩm bằng trạm quan trắc nhiệt độ khối đổ tự động.</li>
        <li>Duy trì chế độ kiểm tra an toàn PCCC và làm việc trên cao nghiêm ngặt 3 ca/ngày.</li>
      </ul>
      <p>Ngay sau lễ cất nóc, Thành Phú sẽ khẩn trương tập trung tối đa nguồn lực cho công tác hoàn thiện kiến trúc mặt ngoài, hệ nhôm kính uPVC và hạ tầng cảnh quan để bàn giao toàn bộ công trình đúng tiến độ cho Chủ đầu tư vào Quý IV/2026.</p>
    `,
    createdAt: "2026-08-15T08:30:00.000Z",
    updatedAt: "2026-08-15T08:30:00.000Z"
  },

  "tap-huan-an-toan-lao-dong-pccc-q3-2026": {
    _id: "art_an_toan_pccc_002",
    id: "tap-huan-an-toan-lao-dong-pccc-q3-2026",
    slug: "tap-huan-an-toan-lao-dong-pccc-q3-2026",
    title: "Tập Huấn Công Tác An Toàn Lao Động & Phòng Cháy Chữa Cháy Quý III/2026",
    category: "an-toan",
    categoryName: "An Toàn Lao Động",
    author: "Phòng An Toàn HSE",
    date: "02/08/2026",
    image: "assets/images/news-2.svg",
    isFeatured: false,
    status: "published",
    views: 940,
    excerpt: "Chương trình huấn luyện định kỳ nhằm củng cố nhận thức an toàn, kỹ năng làm việc trên cao và phản ứng sự cố cho 150 cán bộ kỹ thuật và công nhân tại công trường.",
    content: `
      <h3>Đặt sinh mệnh và an toàn của người lao động lên hàng đầu</h3>
      <p>Ngày 02/08/2026, Phòng An Toàn - Sức Khỏe - Môi Trường (HSE) Công ty Xây lắp Thành Phú đã phối hợp cùng cơ quan Cảnh sát PCCC & CNCH tổ chức khóa huấn luyện định kỳ Quý III về công tác An toàn vệ sinh lao động và thực tập phương án chữa cháy cứu nạn cứu hộ tại công trường.</p>
      <p>Hơn 150 kỹ sư, chỉ huy trưởng, an toàn viên và đại diện các đội thi công đã tham gia đầy đủ cả hai phần: đào tạo lý thuyết và diễn tập thực địa.</p>
      <h3>Nội dung huấn luyện trọng tâm</h3>
      <ul>
        <li>Quy chuẩn an toàn khi lắp dựng giàn giáo và làm việc tại khu vực mép sàn cao tầng.</li>
        <li>Quy trình cấp phép làm việc có phát sinh nhiệt (hàn cắt kim loại) trong mùa nắng nóng.</li>
        <li>Thực hành vận hành bình bọt chữa cháy khí CO2 và triển khai lăng vòi nước cứu hỏa.</li>
        <li>Kỹ năng sơ cấp cứu tai nạn lao động và di tản thoát nạn nhanh chóng.</li>
      </ul>
      <p>Khóa huấn luyện là một trong những hoạt động thường niên bắt buộc nhằm duy trì chứng nhận hệ thống quản lý an toàn ISO 45001:2018 tại toàn bộ các dự án do Thành Phú thi công.</p>
    `,
    createdAt: "2026-08-02T09:00:00.000Z",
    updatedAt: "2026-08-02T09:00:00.000Z"
  },

  "ung-dung-bim-trong-quan-ly-xung-dot-mep": {
    _id: "art_bim_mep_003",
    id: "ung-dung-bim-trong-quan-ly-xung-dot-mep",
    slug: "ung-dung-bim-trong-quan-ly-xung-dot-mep",
    aliases: ["ung-dung-mo-hinh-bim-quan-ly-xung-dot-mep"],
    title: "Ứng Dụng Mô Hình Thông Tin Công Trình (BIM) Trong Quản Lý Xung Đột Kết Cấu MEP",
    category: "cong-nghe",
    categoryName: "Công Nghệ Xây Dựng",
    author: "Phòng Kỹ Thuật & Đổi Mới",
    date: "20/07/2026",
    image: "assets/images/news-3.svg",
    isFeatured: false,
    status: "published",
    views: 1420,
    excerpt: "BIM 3D và 4D giúp phòng Kỹ thuật Thành Phú giải quyết triệt để xung đột giữa hệ dầm sàn và đường ống cấp thoát nước/thông gió, tiết kiệm 12% chi phí vật tư.",
    content: `
      <h3>Chuyển đổi số mạnh mẽ trong quản lý thi công xây dựng</h3>
      <p>Với xu hướng hiện đại hóa ngành xây lắp, Công ty CP Đầu tư Xây lắp Thành Phú đã chủ động đầu tư bài bản vào việc ứng dụng công nghệ Mô hình thông tin công trình (BIM - Building Information Modeling) từ giai đoạn thiết kế bản vẽ Shop Drawing đến nghiệm thu hoàn công.</p>
      <p>Nhờ áp dụng phần mềm Revit kết hợp Navisworks Manage, đội ngũ kỹ sư BIM Thành Phú đã quét và phát hiện trước hàng trăm vị trí va chạm giữa đường ống kỹ thuật cơ điện (MEP), máng cáp điện và hệ dầm bê tông trước khi triển khai ngoài thực tế.</p>
      <blockquote>"Việc giải quyết xung đột trên máy tính giúp loại bỏ hoàn toàn tình trạng đục phá dầm sàn sau khi đổ bê tông, giảm thiểu 12% hao phí vật tư và rút ngắn đáng kể thời gian thi công hoàn thiện."</blockquote>
      <h3>Lợi ích vượt trội của mô hình BIM tại các dự án Thành Phú</h3>
      <ul>
        <li>Mô phỏng tiến độ thi công 4D trực quan, giúp Chủ đầu tư theo dõi dự án theo thời gian thực.</li>
        <li>Bóc tách khối lượng vật tư chính xác đến từng mét thép, mét khối bê tông.</li>
        <li>Tối ưu hóa không gian kỹ thuật tầng hầm và trần kỹ thuật cho các tòa nhà cao tầng.</li>
      </ul>
    `,
    createdAt: "2026-07-20T10:15:00.000Z",
    updatedAt: "2026-07-20T10:15:00.000Z"
  },

  "khoi-cong-ha-tang-do-thi-nam-long": {
    _id: "art_nam_long_infra_004",
    id: "khoi-cong-ha-tang-do-thi-nam-long",
    slug: "khoi-cong-ha-tang-do-thi-nam-long",
    aliases: ["le-khoi-cong-ha-tang-do-thi-nam-long"],
    title: "Lễ Khởi Công Giai Đoạn 2 Tuyến Hạ Tầng Kỹ Thuật Đô Thị Nam Long",
    category: "tien-do",
    categoryName: "Tiến Độ Dự Án",
    author: "Ban Truyền Thông Thành Phú",
    date: "10/07/2026",
    image: "assets/images/news-4.svg",
    isFeatured: false,
    status: "published",
    views: 820,
    excerpt: "Thành Phú chính thức đưa vào công trường 25 thiết bị cơ giới nặng để triển khai thảm nhựa asphalt và hạ tầng ngầm phân khu 2 khu đô thị sinh thái Nam Long.",
    content: `
      <h3>Khởi động giai đoạn bứt phá của dự án hạ tầng trọng điểm</h3>
      <p>Sáng ngày 10/07/2026, tại đại công trường Khu đô thị Nam Long, Công ty Cổ phần Đầu tư Xây lắp Thành Phú đã long trọng tổ chức lễ phát động ra quân và khởi công giai đoạn 2 gói thầu Hạ tầng kỹ thuật giao thông đô thị.</p>
      <p>Tại giai đoạn 2 này, Thành Phú huy động đồng loạt 25 đầu xe lu rung, máy ủi, máy xúc bánh xích và trạm rải thảm nhựa nóng hiện đại với cam kết hoàn thành vượt tiến độ trước mùa mưa lũ.</p>
      <h3>Các hạng mục thi công chủ chốt</h3>
      <ul>
        <li>Hệ thống thoát nước mưa và thu gom nước thải sinh hoạt D600 - D1500 với chiều dài hơn 4.2 km.</li>
        <li>Lu lèn nền đường K98 và thảm 2 lớp bê tông nhựa chặt C12.5 và C19.</li>
        <li>Hệ thống hào kỹ thuật ngầm hóa toàn bộ cáp viễn thông và lưới điện trung hạ thế.</li>
        <li>Lắp đặt hệ thống chiếu sáng công cộng dùng đèn năng lượng mặt trời thông minh và vỉa hè lát gạch Terrazzo.</li>
      </ul>
    `,
    createdAt: "2026-07-10T08:00:00.000Z",
    updatedAt: "2026-07-10T08:00:00.000Z"
  },

  "xu-huong-cong-trinh-xanh-be-tong-tro-bay": {
    _id: "art_green_concrete_005",
    id: "xu-huong-cong-trinh-xanh-be-tong-tro-bay",
    slug: "xu-huong-cong-trinh-xanh-be-tong-tro-bay",
    title: "Xu Hướng Công Trình Xanh 2026: Giải Pháp Bê Tông Tro Bay Giảm Phát Thải CO2",
    category: "kien-thuc",
    categoryName: "Kiến Thức Xây Dựng",
    author: "Viện Nghiên Cứu Kỹ Thuật Xây Lắp",
    date: "25/06/2026",
    image: "assets/images/news-5.svg",
    isFeatured: false,
    status: "published",
    views: 1150,
    excerpt: "Tìm hiểu về giải pháp sử dụng phụ gia khoáng hoạt tính nhằm tăng độ bền sunfat và bảo vệ môi trường trong thi công cọc ngầm và móng đài cao ốc.",
    content: `
      <h3>Xây dựng bền vững - Trách nhiệm của các nhà thầu hiện đại</h3>
      <p>Trong bối cảnh biến đổi khí hậu toàn cầu và mục tiêu Net Zero vào năm 2050 của Việt Nam, ngành xây dựng đang nỗ lực chuyển dịch sang các loại vật liệu thân thiện với môi trường. Một trong những đột phá tiêu biểu được Thành Phú ứng dụng tại nhiều dự án lớn là bê tông tro bay (Fly Ash Concrete).</p>
      <p>Tro bay là phụ phẩm công nghiệp giàu oxit silic và nhôm, khi thay thế từ 15% đến 25% lượng xi măng Portland truyền thống sẽ mang lại những hiệu quả kỹ thuật và môi trường vượt bậc.</p>
      <h3>Ưu điểm vượt trội của bê tông tro bay</h3>
      <ul>
        <li><strong>Giảm nhiệt thủy hóa:</strong> Giúp chống nứt nhiệt hiệu quả cho các khối bê tông móng dày từ 2m đến 4m.</li>
        <li><strong>Tăng độ đặc chắc và chống thấm:</strong> Các hạt tro bay siêu mịn lấp đầy lỗ rỗng mao dẫn, ngăn ngừa sự xâm thực của ion Clo và Sunfat trong môi trường nước ngầm mặn/chua.</li>
        <li><strong>Bảo vệ môi trường:</strong> Giảm đáng kể lượng phát thải khí nhà kính CO2 phát sinh từ quá trình nung clinker xi măng.</li>
      </ul>
    `,
    createdAt: "2026-06-25T14:20:00.000Z",
    updatedAt: "2026-06-25T14:20:00.000Z"
  },

  "thanh-phu-vinh-danh-top-20-doanh-nghiep-xay-lap-2026": {
    _id: "art_award_top20_006",
    id: "thanh-phu-vinh-danh-top-20-doanh-nghiep-xay-lap-2026",
    slug: "thanh-phu-vinh-danh-top-20-doanh-nghiep-xay-lap-2026",
    title: "Thành Phú Được Vinh Danh Top 20 Doanh Nghiệp Xây Lắp Tiêu Biểu Phía Nam",
    category: "giai-thuong",
    categoryName: "Giải Thưởng & Sự Kiện",
    author: "Ban Truyền Thông Thành Phú",
    date: "12/06/2026",
    image: "assets/images/news-6.svg",
    isFeatured: false,
    status: "published",
    views: 1650,
    excerpt: "Ghi nhận những đóng góp thiết thực cho diện mạo hạ tầng và các tiêu chuẩn khắt khe về an toàn kỹ thuật được kiểm định độc lập.",
    content: `
      <h3>Khẳng định vị thế thương hiệu xây dựng uy tín</h3>
      <p>Tối ngày 12/06/2026, tại Trung tâm Hội nghị Quốc gia, Lễ trao giải thưởng "Thương hiệu Xây dựng Tiêu biểu Phía Nam năm 2026" do Hiệp hội Xây dựng Việt Nam chủ trì đã diễn ra long trọng.</p>
      <p>Công ty Cổ phần Đầu tư Xây lắp Thành Phú đã xuất sắc vượt qua hơn 300 doanh nghiệp để được vinh danh trong <strong>Top 20 Doanh nghiệp Xây lắp Tiêu biểu</strong> dựa trên các tiêu chí khắt khe: năng lực tài chính minh bạch, tiến độ thi công chính xác, số giờ an toàn lao động và sự tín nhiệm từ các đối tác lớn.</p>
      <blockquote>"Danh hiệu này là sự ghi nhận xứng đáng cho những nỗ lực bền bỉ của tập thể cán bộ công nhân viên Thành Phú suốt những năm qua, đồng thời là động lực to lớn để chúng tôi tiếp tục kiến tạo những công trình tầm vóc."</blockquote>
    `,
    createdAt: "2026-06-12T19:00:00.000Z",
    updatedAt: "2026-06-12T19:00:00.000Z"
  },

  "khanh-thanh-day-chuyen-cat-cnc-co-khi-thanh-phu": {
    _id: "art_cnc_factory_007",
    id: "khanh-thanh-day-chuyen-cat-cnc-co-khi-thanh-phu",
    slug: "khanh-thanh-day-chuyen-cat-cnc-co-khi-thanh-phu",
    title: "Khánh Thành Dây Chuyền Cắt CNC Kim Loại Tự Động Tại Nhà Xưởng Cơ Khí Thành Phú",
    category: "nang-luc",
    categoryName: "Năng Lực Sản Xuất",
    author: "Khối Sản Xuất & Chế Tạo",
    date: "28/05/2026",
    image: "assets/images/machinery-3.svg",
    isFeatured: false,
    status: "published",
    views: 760,
    excerpt: "Gia tăng 40% công suất gia công dầm thép tổ hợp, đáp ứng nhu cầu cung ứng kết cấu thép cho các dự án nhà xưởng công nghiệp lớn.",
    content: `
      <h3>Đầu tư máy móc hiện đại nâng cao năng lực sản xuất nội bộ</h3>
      <p>Nhằm đáp ứng nhu cầu gia tăng nhanh chóng của các dự án kết cấu thép và nhà xưởng công nghiệp quy mô lớn tại các tỉnh miền Đông và Tây Nam Bộ, Công ty Xây lắp Thành Phú đã đầu tư nâng cấp toàn diện nhà máy cơ khí tại KCN Tân Tạo.</p>
      <p>Ngày 28/05/2026, dây chuyền máy cắt kim loại Laser CNC công suất 15,000W thế hệ mới nhất nhập khẩu từ Đức đã chính thức được nghiệm thu và đưa vào vận hành thương mại.</p>
      <h3>Hiệu quả vượt bậc của dây chuyền mới</h3>
      <ul>
        <li>Cắt được thép tấm dày tới 50mm với sai số quang học chỉ dưới 0.1mm.</li>
        <li>Tự động hóa hoàn toàn quy trình xếp phôi bằng phần mềm Nesting, tiết kiệm 8% phôi thép phế liệu.</li>
        <li>Nâng tổng công suất gia công kết cấu thép của Thành Phú lên trên 1,500 tấn/tháng.</li>
      </ul>
    `,
    createdAt: "2026-05-28T11:00:00.000Z",
    updatedAt: "2026-05-28T11:00:00.000Z"
  },

  "le-ky-niem-16-nam-ngay-thanh-lap-cong-ty": {
    _id: "6aaced0c4073403f745c53a4",
    id: "le-ky-niem-16-nam-ngay-thanh-lap-cong-ty",
    slug: "le-ky-niem-16-nam-ngay-thanh-lap-cong-ty",
    title: "LỄ KỶ NIỆM 16 NĂM NGÀY THÀNH LẬP CÔNG TY",
    category: "giai-thuong",
    categoryName: "Giải Thưởng & Sự Kiện",
    author: "Ban Truyền Thông Thành Phú",
    date: "15/08/2026",
    image: "https://res.cloudinary.com/bzwvyqou/image/upload/v1789717775/thanhphu/news/le-ky-niem-16-nam-ngay-thanh-lap-cong-ty-1789717770042.jpg",
    isFeatured: false,
    status: "published",
    views: 125,
    excerpt: "16 NĂM VỮNG BƯỚC – KẾT NỐI VƯƠN XA\nHành trình khẳng định bản lĩnh – Lan tỏa giá trị – Chinh phục tương lai",
    content: `
      <p>Trong không khí hân hoan và đầy tự hào, vừa qua Công ty đã long trọng tổ chức sự kiện kỷ niệm 16 năm thành lập với chủ đề <strong>“16 năm vững bước – Kết nối vươn xa”</strong>, đánh dấu hành trình phát triển đầy tự hào và khẳng định bản lĩnh của một tập thể luôn đoàn kết, kiên định và không ngừng đổi mới.</p>
      <p>Suốt 16 năm qua, bằng tinh thần trách nhiệm, sự tận tâm và khát vọng vươn lên, Công ty đã từng bước vượt qua nhiều thử thách để xây dựng nền tảng vững chắc, khẳng định uy tín thương hiệu và tạo dựng niềm tin với khách hàng, đối tác.</p>
      <p><strong>“Vững bước”</strong> là hành trình của bản lĩnh và sự bền bỉ. <strong>“Kết nối vươn xa”</strong> là khát vọng mở rộng giá trị, gắn kết con người, chinh phục những mục tiêu lớn hơn trong tương lai. Thành công hôm nay chính là kết tinh từ sự đồng lòng của toàn thể cán bộ nhân viên cùng sự tin tưởng, đồng hành quý báu từ Quý khách hàng và đối tác.</p>
      <p>16 năm là một dấu mốc đáng tự hào, nhưng cũng chính là điểm khởi đầu cho những khát vọng lớn hơn. Xin gửi lời tri ân sâu sắc đến Quý khách hàng, Quý đối tác cùng toàn thể cán bộ nhân viên đã luôn tin tưởng, đồng hành và góp phần tạo nên hành trình đầy ý nghĩa này.</p>
      <p>Bên dưới là một số hình ảnh kỷ niệm để ghi dấu lại ngày đặc biệt này của Đại gia đình Thành Phú (16/5/2026). Xin chân thành cảm ơn!</p>
      <p><img src="https://res.cloudinary.com/bzwvyqou/image/upload/v1789717701/thanhphu/news/inline-article-img-1789717694500.jpg" alt="Kỷ niệm 16 năm 1"></p>
      <p><img src="https://res.cloudinary.com/bzwvyqou/image/upload/v1789717714/thanhphu/news/inline-article-img-1789717707314.jpg" alt="Kỷ niệm 16 năm 2"></p>
      <p><img src="https://res.cloudinary.com/bzwvyqou/image/upload/v1789717729/thanhphu/news/inline-article-img-1789717721702.jpg" alt="Kỷ niệm 16 năm 3"></p>
      <p><img src="https://res.cloudinary.com/bzwvyqou/image/upload/v1789717744/thanhphu/news/inline-article-img-1789717736965.jpg" alt="Kỷ niệm 16 năm 4"></p>
      <p><img src="https://res.cloudinary.com/bzwvyqou/image/upload/v1789717754/thanhphu/news/inline-article-img-1789717747516.jpg" alt="Kỷ niệm 16 năm 5"></p>
    `,
    createdAt: "2026-09-18T07:49:32.105Z",
    updatedAt: "2026-09-18T07:56:26.062Z"
  }
};

const ARTICLES_LIST = Object.values(ARTICLES_DATA);

/**
 * Tìm kiếm bài viết theo ID, slug hoặc alias
 */
function getArticleById(idOrSlug) {
  if (!idOrSlug) return ARTICLES_DATA["le-cat-noc-saigon-horizon"];
  
  const key = idOrSlug.trim();
  if (ARTICLES_DATA[key]) return ARTICLES_DATA[key];

  return ARTICLES_LIST.find(a => 
    a.id === key || 
    a.slug === key || 
    a._id === key ||
    (Array.isArray(a.aliases) && a.aliases.includes(key))
  );
}

/**
 * Hiển thị nội dung chi tiết bài viết
 */
function renderArticleContent(article) {
  if (!article) {
    showNotFound();
    return;
  }

  // Cập nhật Page Title & Meta
  document.title = `${article.title} | Xây Lắp Thành Phú`;
  const metaDesc = document.getElementById('page-meta-desc');
  if (metaDesc) metaDesc.content = article.excerpt || article.title;

  // Cập nhật Breadcrumb & Tiêu đề
  const breadcrumbEl = document.getElementById('breadcrumb-title');
  if (breadcrumbEl) breadcrumbEl.textContent = article.title;

  const titleEl = document.getElementById('article-title');
  if (titleEl) titleEl.textContent = article.title;

  const catEl = document.getElementById('article-category');
  if (catEl) catEl.textContent = article.categoryName || 'TIN TỨC';

  const dateEl = document.getElementById('article-date');
  if (dateEl) dateEl.textContent = article.date || '';

  const authorEl = document.getElementById('article-author');
  if (authorEl) authorEl.textContent = article.author || 'Ban Truyền Thông Thành Phú';

  const viewsEl = document.getElementById('article-views');
  if (viewsEl) viewsEl.textContent = Number(article.views || 0).toLocaleString('vi-VN');

  const excerptEl = document.getElementById('article-excerpt');
  if (excerptEl) excerptEl.textContent = article.excerpt || '';

  const imgEl = document.getElementById('article-image');
  if (imgEl) {
    imgEl.src = article.image || 'assets/images/news-1.svg';
    imgEl.alt = article.title || 'Hình ảnh bài viết';
    imgEl.onerror = function() {
      this.onerror = null;
      this.src = 'assets/images/news-1.svg';
    };
  }

  const contentEl = document.getElementById('article-content');
  if (contentEl) {
    contentEl.innerHTML = article.content || '<p>Nội dung đang được cập nhật...</p>';
  }
}

/**
 * Tải chi tiết bài viết (ưu tiên API, tự động fallback nếu offline/static)
 */
async function loadArticleDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id') || urlParams.get('slug') || 'le-cat-noc-saigon-horizon';

  let articleData = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`/api/articles/${encodeURIComponent(articleId)}?view=1`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        articleData = data.data;
      }
    }
  } catch (err) {
    console.warn('[Articles] API unavailable, using static fallback:', err.message || err);
  }

  // Fallback sang database tĩnh nếu API không có kết quả
  if (!articleData) {
    articleData = getArticleById(articleId);
  }

  if (articleData) {
    renderArticleContent(articleData);
    loadRelatedArticles(articleData.id || articleId, articleData.category);
  } else {
    showNotFound();
  }
}

/**
 * Tải danh sách bản tin liên quan
 */
async function loadRelatedArticles(currentId, category) {
  const container = document.getElementById('related-articles-list');
  if (!container) return;

  let related = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('/api/articles?status=published', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        related = data.data.filter(a => a.id !== currentId && a.slug !== currentId);
      }
    }
  } catch (err) {
    console.warn('[Articles] Related articles fallback');
  }

  if (related.length === 0) {
    related = ARTICLES_LIST.filter(a => a.id !== currentId && a.slug !== currentId);
  }

  const topRelated = related.slice(0, 4);

  if (topRelated.length === 0) {
    container.innerHTML = '<div style="font-size:0.85rem; color:var(--text-muted);">Không có bài viết liên quan.</div>';
    return;
  }

  container.innerHTML = topRelated.map(item => `
    <a href="chi-tiet-tin-tuc.html?id=${item.slug || item.id}" class="related-news-item">
      <img src="${item.image || 'assets/images/news-1.svg'}" alt="${item.title}" onerror="this.onerror=null; this.src='assets/images/news-1.svg';">
      <div>
        <h5 class="related-news-title">${item.title}</h5>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
          <i class="far fa-calendar-alt"></i> ${item.date || ''}
        </div>
      </div>
    </a>
  `).join('');
}

/**
 * Hiển thị thông báo khi không tìm thấy bài viết
 */
function showNotFound() {
  const titleEl = document.getElementById('article-title');
  if (titleEl) titleEl.textContent = 'Không tìm thấy bài viết';

  const contentEl = document.getElementById('article-content');
  if (contentEl) {
    contentEl.innerHTML = `
      <div style="text-align:center; padding: 50px 20px;">
        <i class="far fa-frown" style="font-size: 3rem; color: var(--primary); margin-bottom: 16px;"></i>
        <h3 style="font-size: 1.3rem; margin-bottom: 10px;">Bản tin không tồn tại hoặc đã được gỡ bỏ</h3>
        <p style="color: var(--text-muted); margin-bottom: 25px;">Vui lòng kiểm tra lại đường dẫn hoặc khám phá các bài viết khác của Thành Phú.</p>
        <a href="tin-tuc.html" class="btn btn-primary btn-sm">Quay lại Trang Tin Tức <i class="fas fa-arrow-right"></i></a>
      </div>
    `;
  }

  const excerptEl = document.getElementById('article-excerpt');
  if (excerptEl) excerptEl.style.display = 'none';

  const imgBox = document.querySelector('.article-feature-img-box');
  if (imgBox) imgBox.style.display = 'none';
}

// Gắn toàn cục lên window
if (typeof window !== 'undefined') {
  window.ARTICLES_DATA = ARTICLES_DATA;
  window.ARTICLES_LIST = ARTICLES_LIST;
  window.getArticleById = getArticleById;
  window.renderArticleContent = renderArticleContent;
  window.loadArticleDetail = loadArticleDetail;
  window.loadRelatedArticles = loadRelatedArticles;
  window.showNotFound = showNotFound;
}

// Tự động khởi chạy khi tải trang độc lập
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('article-content')) {
      loadArticleDetail();
    }
  });
} else {
  if (document.getElementById('article-content')) {
    loadArticleDetail();
  }
}

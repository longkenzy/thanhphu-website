require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Article = require('./models/Article');
const { Slide, SlideSetting } = require('./models/Slide');
const Project = require('./models/Project');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Helper to extract public_id from Cloudinary URL or ID
function getCloudinaryPublicId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  if (!urlOrId.startsWith('http')) return urlOrId;
  try {
    const parts = urlOrId.split('/upload/');
    if (parts.length < 2) return null;
    let path = parts[1];
    const pathSegments = path.split('/');
    const versionIndex = pathSegments.findIndex(s => /^v\d+$/.test(s));
    let cleanedSegments = [];
    if (versionIndex !== -1) {
      cleanedSegments = pathSegments.slice(versionIndex + 1);
    } else {
      const thanhphuIndex = pathSegments.findIndex(s => s === 'thanhphu');
      cleanedSegments = thanhphuIndex !== -1 ? pathSegments.slice(thanhphuIndex) : pathSegments;
    }
    let fullId = cleanedSegments.join('/');
    fullId = fullId.replace(/\.[^/.]+$/, '');
    return fullId || null;
  } catch (e) {
    return null;
  }
}

// Helper to safely delete an image from Cloudinary
async function destroyCloudinaryImage(urlOrId) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !urlOrId) return;
  const publicId = getCloudinaryPublicId(urlOrId);
  if (!publicId) return;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    console.log(`[Cloudinary] Deleted asset '${publicId}':`, res.result);
    return res;
  } catch (err) {
    console.warn(`[Cloudinary] Warning when deleting '${publicId}':`, err.message);
  }
}

// MongoDB Atlas Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'thanhphu';

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI chưa được cấu hình. Hệ thống sẽ hoạt động ở chế độ fallback file JSON.');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ Kết nối MongoDB Atlas thành công! [Database: ${mongoose.connection.name}]`);
    await autoSeedDatabase();
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB Atlas:', err.message);
    console.log('⚠️  Đang sử dụng chế độ fallback file JSON.');
  }
}

// Default Hero Slides
const DEFAULT_SLIDES = [
  {
    title: 'Dân Dụng & Cao Tầng',
    subtitle: 'Tổng Thầu Thiết Kế & Thi Công Vượt Tiến Độ',
    image: 'assets/images/hero-slide-1.svg',
    order: 0,
    isActive: true
  },
  {
    title: 'Công Nghiệp & Nhà Xưởng',
    subtitle: 'Giải Pháp Nhà Xưởng Hiện Đại Đạt Chuẩn Quốc Tế',
    image: 'assets/images/hero-slide-2.svg',
    order: 1,
    isActive: true
  },
  {
    title: 'Hạ Tầng Kỹ Thuật',
    subtitle: 'Kiến Tạo Giá Trị Bền Vững & Đồng Bộ Đô Thị',
    image: 'assets/images/hero-slide-3.svg',
    order: 2,
    isActive: true
  }
];

// Path to data files and uploads
const DATA_DIR = path.join(__dirname, 'data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const UPLOADS_DIR = path.join(__dirname, 'assets', 'uploads');

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function getProjects() {
  if (!fs.existsSync(PROJECTS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveProjects(data) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving projects.json:', e);
  }
}

// Auto seed data to MongoDB if collection is empty
async function autoSeedDatabase() {
  try {
    const count = await Article.countDocuments();
    if (count === 0) {
      console.log('🔄 Đang đồng bộ dữ liệu bài viết ban đầu vào MongoDB Atlas...');
      let seedData = DEFAULT_ARTICLES;
      if (fs.existsSync(ARTICLES_FILE)) {
        try {
          const fileData = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
          if (Array.isArray(fileData) && fileData.length > 0) {
            seedData = fileData;
          }
        } catch (e) {
          console.error('Lỗi đọc articles.json:', e);
        }
      }
      await Article.insertMany(seedData);
      console.log(`✅ Đã nạp thành công ${seedData.length} bài viết vào MongoDB Atlas!`);
    } else {
      console.log(`📊 Đã có sẵn ${count} bài viết trên MongoDB Atlas.`);
    }

    // Auto seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('🔄 Đang nạp 9 dự án tiêu biểu vào MongoDB Atlas...');
      let seedProjects = [];
      if (fs.existsSync(PROJECTS_FILE)) {
        try {
          seedProjects = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
        } catch (e) {}
      }
      if (seedProjects.length > 0) {
        await Project.insertMany(seedProjects);
        console.log(`✅ Đã nạp thành công ${seedProjects.length} dự án vào MongoDB Atlas!`);
      }
    } else {
      console.log(`🏗️  Đã có sẵn ${projectCount} dự án trên MongoDB Atlas.`);
    }

    // Auto seed Slides
    const slideCount = await Slide.countDocuments();
    if (slideCount === 0) {
      console.log('🔄 Đang nạp 3 slide trang chủ mặc định vào MongoDB Atlas...');
      await Slide.insertMany(DEFAULT_SLIDES);
      console.log('✅ Đã nạp thành công 3 slide mẫu vào MongoDB!');
    }

    // Auto seed Slide Settings (e.g. speed)
    let setting = await SlideSetting.findOne({ key: 'hero_slider' });
    if (!setting) {
      await SlideSetting.create({ key: 'hero_slider', autoplaySpeed: 6 });
      console.log('✅ Đã khởi tạo cài đặt tốc độ slide mặc định (6s) vào MongoDB!');
    }
  } catch (err) {
    console.error('Lỗi trong quá trình auto-seed MongoDB:', err);
  }
}


// Default seed articles
const DEFAULT_ARTICLES = [
  {
    "id": "le-cat-noc-saigon-horizon",
    "slug": "le-cat-noc-saigon-horizon",
    "title": "Lễ Cất Nóc Vượt Tiến Độ 25 Ngày Tòa Nhà Văn Phòng SaiGon Horizon",
    "category": "su-kien",
    "categoryName": "Sự Kiện & Tiến Độ",
    "author": "Ban Truyền Thông Thành Phú",
    "date": "15/08/2026",
    "image": "assets/images/news-1.svg",
    "isFeatured": true,
    "status": "published",
    "views": 1845,
    "excerpt": "Sáng ngày 15/08, Công ty CP Đầu tư Xây lắp Thành Phú cùng Chủ đầu tư đã chính thức đổ mẻ bê tông cất nóc tầng 21 tháp văn phòng cao cấp SaiGon Horizon. Sự kiện đánh dấu việc hoàn thành toàn bộ phần kết cấu thô trước tiến độ cam kết 25 ngày.",
    "content": "<h3>Dấu ấn vượt tiến độ tại dự án trọng điểm phía Nam</h3><p>Sáng ngày 15/08, trong không khí phấn khởi và trang trọng, Công ty Cổ phần Đầu tư Xây lắp Thành Phú cùng Chủ đầu tư Horizon Real Estate Corporation đã chính thức tiến hành nghi thức đổ mẻ bê tông cất nóc tầng 21 – tầng cao nhất của tháp văn phòng hạng A SaiGon Horizon (Đường Nguyễn Hữu Thọ, Quận 7, TP.HCM).</p><p>Sự kiện đánh dấu mốc son quan trọng khi gói thầu Tổng thầu kết cấu và hoàn thiện thô được bàn giao trước tiến độ cam kết trong hợp đồng gốc đến <strong>25 ngày</strong>, đồng thời ghi nhận kỷ lục hơn <strong>1,200,000 giờ lao động an toàn tuyệt đối</strong> không xảy ra tai nạn.</p><blockquote>\"Thành công vượt tiến độ tại SaiGon Horizon là minh chứng rõ nét cho năng lực quản trị dự án chuyên nghiệp, kỷ luật thi công công trường và tinh thần tận tâm, sáng tạo của đội ngũ kỹ sư Thành Phú.\"<br><small>— Ông Nguyễn Văn Thành, Tổng Giám Đốc Công ty CP Đầu tư Xây lắp Thành Phú</small></blockquote><h3>Quy mô kỹ thuật và giải pháp thi công hiện đại</h3><p>Dự án SaiGon Horizon có quy mô 2 tầng hầm và 21 tầng nổi, tổng diện tích sàn xây dựng lên đến 32,500 m². Để đạt được tiến độ thần tốc nhưng vẫn đảm bảo chất lượng kỹ thuật cao nhất theo tiêu chuẩn ISO 9001:2015, Ban chỉ huy công trường Thành Phú đã áp dụng đồng bộ các giải pháp kỹ thuật tiên tiến:</p><ul><li>Ứng dụng mô hình số hóa <strong>BIM 3D & 4D</strong> để phối hợp xung đột kết cấu dầm sàn với hệ thống cơ điện MEP trước khi lắp dựng cốp pha.</li><li>Sử dụng hệ cốp pha nhôm định hình hiện đại, chu kỳ đổ bê tông sàn đạt trung bình 6 ngày/sàn.</li><li>Kiểm soát chất lượng bê tông thương phẩm bằng trạm quan trắc nhiệt độ khối đổ tự động.</li><li>Duy trì chế độ kiểm tra an toàn PCCC và làm việc trên cao nghiêm ngặt 3 ca/ngày.</li></ul><p>Ngay sau lễ cất nóc, Thành Phú sẽ khẩn trương tập trung tối đa nguồn lực cho công tác hoàn thiện kiến trúc mặt ngoài, hệ nhôm kính uPVC và hạ tầng cảnh quan để bàn giao toàn bộ công trình đúng tiến độ cho Chủ đầu tư vào Quý IV/2026.</p>",
    "createdAt": "2026-08-15T08:30:00.000Z",
    "updatedAt": "2026-08-15T08:30:00.000Z"
  },
  {
    "id": "tap-huan-an-toan-lao-dong-pccc-q3-2026",
    "slug": "tap-huan-an-toan-lao-dong-pccc-q3-2026",
    "title": "Tập Huấn Công Tác An Toàn Lao Động & Phòng Cháy Chữa Cháy Quý III/2026",
    "category": "an-toan",
    "categoryName": "An Toàn Lao Động",
    "author": "Phòng An Toàn HSE",
    "date": "02/08/2026",
    "image": "assets/images/news-2.svg",
    "isFeatured": false,
    "status": "published",
    "views": 940,
    "excerpt": "Chương trình huấn luyện định kỳ nhằm củng cố nhận thức an toàn, kỹ năng làm việc trên cao và phản ứng sự cố cho 150 cán bộ kỹ thuật và công nhân tại công trường.",
    "content": "<h3>Đặt sinh mệnh và an toàn của người lao động lên hàng đầu</h3><p>Ngày 02/08/2026, Phòng An Toàn - Sức Khỏe - Môi Trường (HSE) Công ty Xây lắp Thành Phú đã phối hợp cùng cơ quan Cảnh sát PCCC & CNCH tổ chức khóa huấn luyện định kỳ Quý III về công tác An toàn vệ sinh lao động và thực tập phương án chữa cháy cứu nạn cứu hộ tại công trường.</p><p>Hơn 150 kỹ sư, chỉ huy trưởng, an toàn viên và đại diện các đội thi công đã tham gia đầy đủ cả hai phần: đào tạo lý thuyết và diễn tập thực địa.</p><h3>Nội dung huấn luyện trọng tâm</h3><ul><li>Quy chuẩn an toàn khi lắp dựng giàn giáo và làm việc tại khu vực mép sàn cao tầng.</li><li>Quy trình cấp phép làm việc có phát sinh nhiệt (hàn cắt kim loại) trong mùa nắng nóng.</li><li>Thực hành vận hành bình bọt chữa cháy khí CO2 và triển khai lăng vòi nước cứu hỏa.</li><li>Kỹ năng sơ cấp cứu tai nạn lao động và di tản thoát nạn nhanh chóng.</li></ul><p>Khóa huấn luyện là một trong những hoạt động thường niên bắt buộc nhằm duy trì chứng nhận hệ thống quản lý an toàn ISO 45001:2018 tại toàn bộ các dự án do Thành Phú thi công.</p>",
    "createdAt": "2026-08-02T09:00:00.000Z",
    "updatedAt": "2026-08-02T09:00:00.000Z"
  },
  {
    "id": "ung-dung-mo-hinh-bim-quan-ly-xung-dot-mep",
    "slug": "ung-dung-mo-hinh-bim-quan-ly-xung-dot-mep",
    "title": "Ứng Dụng Mô Hình Thông Tin Công Trình (BIM) Trong Quản Lý Xung Đột Kết Cấu MEP",
    "category": "cong-nghe",
    "categoryName": "Công Nghệ Xây Dựng",
    "author": "Phòng Kỹ Thuật & Đổi Mới",
    "date": "20/07/2026",
    "image": "assets/images/news-3.svg",
    "isFeatured": false,
    "status": "published",
    "views": 1420,
    "excerpt": "BIM 3D và 4D giúp phòng Kỹ thuật Thành Phú giải quyết triệt để xung đột giữa hệ dầm sàn và đường ống cấp thoát nước/thông gió, tiết kiệm 12% chi phí vật tư.",
    "content": "<h3>Chuyển đổi số mạnh mẽ trong quản lý thi công xây dựng</h3><p>Với xu hướng hiện đại hóa ngành xây lắp, Công ty CP Đầu tư Xây lắp Thành Phú đã chủ động đầu tư bài bản vào việc ứng dụng công nghệ Mô hình thông tin công trình (BIM - Building Information Modeling) từ giai đoạn thiết kế bản vẽ Shop Drawing đến nghiệm thu hoàn công.</p><p>Nhờ áp dụng phần mềm Revit kết hợp Navisworks Manage, đội ngũ kỹ sư BIM Thành Phú đã quét và phát hiện trước hàng trăm vị trí va chạm giữa đường ống kỹ thuật cơ điện (MEP), máng cáp điện và hệ dầm bê tông trước khi triển khai ngoài thực tế.</p><blockquote>\"Việc giải quyết xung đột trên máy tính giúp loại bỏ hoàn toàn tình trạng đục phá dầm sàn sau khi đổ bê tông, giảm thiểu 12% hao phí vật tư và rút ngắn đáng kể thời gian thi công hoàn thiện.\"</blockquote><h3>Lợi ích vượt trội của mô hình BIM tại các dự án Thành Phú</h3><ul><li>Mô phỏng tiến độ thi công 4D trực quan, giúp Chủ đầu tư theo dõi dự án theo thời gian thực.</li><li>Bóc tách khối lượng vật tư chính xác đến từng mét thép, mét khối bê tông.</li><li>Tối ưu hóa không gian kỹ thuật tầng hầm và trần kỹ thuật cho các tòa nhà cao tầng.</li></ul>",
    "createdAt": "2026-07-20T10:15:00.000Z",
    "updatedAt": "2026-07-20T10:15:00.000Z"
  },
  {
    "id": "le-khoi-cong-ha-tang-do-thi-nam-long",
    "slug": "le-khoi-cong-ha-tang-do-thi-nam-long",
    "title": "Lễ Khởi Công Giai Đoạn 2 Tuyến Hạ Tầng Kỹ Thuật Đô Thị Nam Long",
    "category": "tien-do",
    "categoryName": "Tiến Độ Dự Án",
    "author": "Ban Truyền Thông Thành Phú",
    "date": "10/07/2026",
    "image": "assets/images/news-4.svg",
    "isFeatured": false,
    "status": "published",
    "views": 820,
    "excerpt": "Thành Phú chính thức đưa vào công trường 25 thiết bị cơ giới nặng để triển khai thảm nhựa asphalt và hạ tầng ngầm phân khu 2 khu đô thị sinh thái Nam Long.",
    "content": "<h3>Khởi động giai đoạn bứt phá của dự án hạ tầng trọng điểm</h3><p>Sáng ngày 10/07/2026, tại đại công trường Khu đô thị Nam Long, Công ty Cổ phần Đầu tư Xây lắp Thành Phú đã long trọng tổ chức lễ phát động ra quân và khởi công giai đoạn 2 gói thầu Hạ tầng kỹ thuật giao thông đô thị.</p><p>Tại giai đoạn 2 này, Thành Phú huy động đồng loạt 25 đầu xe lu rung, máy ủi, máy xúc bánh xích và trạm rải thảm nhựa nóng hiện đại với cam kết hoàn thành vượt tiến độ trước mùa mưa lũ.</p><h3>Các hạng mục thi công chủ chốt</h3><ul><li>Hệ thống thoát nước mưa và thu gom nước thải sinh hoạt D600 - D1500 với chiều dài hơn 4.2 km.</li><li>Lu lèn nền đường K98 và thảm 2 lớp bê tông nhựa chặt C12.5 và C19.</li><li>Hệ thống hào kỹ thuật ngầm hóa toàn bộ cáp viễn thông và lưới điện trung hạ thế.</li><li>Lắp đặt hệ thống chiếu sáng công cộng dùng đèn năng lượng mặt trời thông minh và vỉa hè lát gạch Terrazzo.</li></ul>",
    "createdAt": "2026-07-10T08:00:00.000Z",
    "updatedAt": "2026-07-10T08:00:00.000Z"
  },
  {
    "id": "xu-huong-cong-trinh-xanh-be-tong-tro-bay",
    "slug": "xu-huong-cong-trinh-xanh-be-tong-tro-bay",
    "title": "Xu Hướng Công Trình Xanh 2026: Giải Pháp Bê Tông Tro Bay Giảm Phát Thải CO2",
    "category": "kien-thuc",
    "categoryName": "Kiến Thức Xây Dựng",
    "author": "Viện Nghiên Cứu Kỹ Thuật Xây Lắp",
    "date": "25/06/2026",
    "image": "assets/images/news-5.svg",
    "isFeatured": false,
    "status": "published",
    "views": 1150,
    "excerpt": "Tìm hiểu về giải pháp sử dụng phụ gia khoáng hoạt tính nhằm tăng độ bền sunfat và bảo vệ môi trường trong thi công cọc ngầm và móng đài cao ốc.",
    "content": "<h3>Xây dựng bền vững - Trách nhiệm của các nhà thầu hiện đại</h3><p>Trong bối cảnh biến đổi khí hậu toàn cầu và mục tiêu Net Zero vào năm 2050 của Việt Nam, ngành xây dựng đang nỗ lực chuyển dịch sang các loại vật liệu thân thiện với môi trường. Một trong những đột phá tiêu biểu được Thành Phú ứng dụng tại nhiều dự án lớn là bê tông tro bay (Fly Ash Concrete).</p><p>Tro bay là phụ phẩm công nghiệp giàu oxit silic và nhôm, khi thay thế từ 15% đến 25% lượng xi măng Portland truyền thống sẽ mang lại những hiệu quả kỹ thuật và môi trường vượt bậc.</p><h3>Ưu điểm vượt trội của bê tông tro bay</h3><ul><li><strong>Giảm nhiệt thủy hóa:</strong> Giúp chống nứt nhiệt hiệu quả cho các khối bê tông móng dày từ 2m đến 4m.</li><li><strong>Tăng độ đặc chắc và chống thấm:</strong> Các hạt tro bay siêu mịn lấp đầy lỗ rỗng mao dẫn, ngăn ngừa sự xâm thực của ion Clo và Sunfat trong môi trường nước ngầm mặn/chua.</li><li><strong>Bảo vệ môi trường:</strong> Giảm đáng kể lượng phát thải khí nhà kính CO2 phát sinh từ quá trình nung clinker xi măng.</li></ul>",
    "createdAt": "2026-06-25T14:20:00.000Z",
    "updatedAt": "2026-06-25T14:20:00.000Z"
  },
  {
    "id": "thanh-phu-vinh-danh-top-20-doanh-nghiep-xay-lap-2026",
    "slug": "thanh-phu-vinh-danh-top-20-doanh-nghiep-xay-lap-2026",
    "title": "Thành Phú Được Vinh Danh Top 20 Doanh Nghiệp Xây Lắp Tiêu Biểu Phía Nam",
    "category": "giai-thuong",
    "categoryName": "Giải Thưởng & Sự Kiện",
    "author": "Ban Truyền Thông Thành Phú",
    "date": "12/06/2026",
    "image": "assets/images/news-6.svg",
    "isFeatured": false,
    "status": "published",
    "views": 1650,
    "excerpt": "Ghi nhận những đóng góp thiết thực cho diện mạo hạ tầng và các tiêu chuẩn khắt khe về an toàn kỹ thuật được kiểm định độc lập.",
    "content": "<h3>Khẳng định vị thế thương hiệu xây dựng uy tín</h3><p>Tối ngày 12/06/2026, tại Trung tâm Hội nghị Quốc gia, Lễ trao giải thưởng \"Thương hiệu Xây dựng Tiêu biểu Phía Nam năm 2026\" do Hiệp hội Xây dựng Việt Nam chủ trì đã diễn ra long trọng.</p><p>Công ty Cổ phần Đầu tư Xây lắp Thành Phú đã xuất sắc vượt qua hơn 300 doanh nghiệp để được vinh danh trong <strong>Top 20 Doanh nghiệp Xây lắp Tiêu biểu</strong> dựa trên các tiêu chí khắt khe: năng lực tài chính minh bạch, tiến độ thi công chính xác, số giờ an toàn lao động và sự tín nhiệm từ các đối tác lớn.</p><blockquote>\"Danh hiệu này là sự ghi nhận xứng đáng cho những nỗ lực bền bỉ của tập thể cán bộ công nhân viên Thành Phú suốt những năm qua, đồng thời là động lực to lớn để chúng tôi tiếp tục kiến tạo những công trình tầm vóc.\"</blockquote>",
    "createdAt": "2026-06-12T19:00:00.000Z",
    "updatedAt": "2026-06-12T19:00:00.000Z"
  },
  {
    "id": "khanh-thanh-day-chuyen-cat-cnc-co-khi-thanh-phu",
    "slug": "khanh-thanh-day-chuyen-cat-cnc-co-khi-thanh-phu",
    "title": "Khánh Thành Dây Chuyền Cắt CNC Kim Loại Tự Động Tại Nhà Xưởng Cơ Khí Thành Phú",
    "category": "nang-luc",
    "categoryName": "Năng Lực Sản Xuất",
    "author": "Khối Sản Xuất & Chế Tạo",
    "date": "28/05/2026",
    "image": "assets/images/machinery-3.svg",
    "isFeatured": false,
    "status": "published",
    "views": 760,
    "excerpt": "Gia tăng 40% công suất gia công dầm thép tổ hợp, đáp ứng nhu cầu cung ứng kết cấu thép cho các dự án nhà xưởng công nghiệp lớn.",
    "content": "<h3>Đầu tư máy móc hiện đại nâng cao năng lực sản xuất nội bộ</h3><p>Nhằm đáp ứng nhu cầu gia tăng nhanh chóng của các dự án kết cấu thép và nhà xưởng công nghiệp quy mô lớn tại các tỉnh miền Đông và Tây Nam Bộ, Công ty Xây lắp Thành Phú đã đầu tư nâng cấp toàn diện nhà máy cơ khí tại KCN Tân Tạo.</p><p>Ngày 28/05/2026, dây chuyền máy cắt kim loại Laser CNC công suất 15,000W thế hệ mới nhất nhập khẩu từ Đức đã chính thức được nghiệm thu và đưa vào vận hành thương mại.</p><h3>Hiệu quả vượt bậc của dây chuyền mới</h3><ul><li>Cắt được thép tấm dày tới 50mm với sai số quang học chỉ dưới 0.1mm.</li><li>Tự động hóa hoàn toàn quy trình xếp phôi bằng phần mềm Nesting, tiết kiệm 8% phôi thép phế liệu.</li><li>Nâng tổng công suất gia công kết cấu thép của Thành Phú lên trên 1,500 tấn/tháng.</li></ul>",
    "createdAt": "2026-05-28T11:00:00.000Z",
    "updatedAt": "2026-05-28T11:00:00.000Z"
  }
];

// Helper functions to read and write articles
function getArticles() {
  try {
    if (!fs.existsSync(ARTICLES_FILE)) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(DEFAULT_ARTICLES, null, 2), 'utf8');
      return DEFAULT_ARTICLES;
    }
    const content = fs.readFileSync(ARTICLES_FILE, 'utf8');
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(DEFAULT_ARTICLES, null, 2), 'utf8');
      return DEFAULT_ARTICLES;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading articles file:', err);
    return DEFAULT_ARTICLES;
  }
}

function saveArticles(articles) {
  try {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving articles file:', err);
    return false;
  }
}

// Helper to convert Vietnamese text to SEO friendly slug
function slugifyVietnamese(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  str = str.replace(/[đĐ]/g, 'd');
  str = str.replace(/[^a-z0-9\s-]/g, '');
  str = str.trim().replace(/\s+/g, '-');
  str = str.replace(/-+/g, '-');
  return str;
}

// Parse JSON and urlencoded body with higher limit for image uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve static assets and uploads
app.use('/assets/uploads', express.static(UPLOADS_DIR));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname)));

// Friendly route mappings
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/trang-chu', file: 'index.html' },
  { path: '/gioi-thieu', file: 'gioi-thieu.html' },
  { path: '/linh-vuc', file: 'linh-vuc.html' },
  { path: '/linh-vuc-hoat-dong', file: 'linh-vuc.html' },
  { path: '/du-an', file: 'du-an.html' },
  { path: '/chi-tiet-du-an', file: 'chi-tiet-du-an.html' },
  { path: '/tin-tuc', file: 'tin-tuc.html' },
  { path: '/chi-tiet-tin-tuc', file: 'chi-tiet-tin-tuc.html' },
  { path: '/tuyen-dung', file: 'tuyen-dung.html' },
  { path: '/lien-he', file: 'lien-he.html' },
  { path: '/admin', file: 'admin.html' },
  { path: '/admin.html', file: 'admin.html' },
  { path: '/login', file: 'admin.html' },
  { path: '/dang-nhap', file: 'admin.html' }
];

routes.forEach(route => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, route.file));
  });
});

// Ensure MongoDB connection is active for all API calls (crucial for Vercel Serverless)
let isDbConnected = false;
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    if (!isDbConnected || mongoose.connection.readyState !== 1) {
      try {
        await connectDB();
        isDbConnected = mongoose.connection.readyState === 1;
      } catch (err) {
        console.warn('[MongoDB Middleware] Connect failed:', err.message);
      }
    }
  }
  next();
});

// ==========================================
// REST API FOR AUTHENTICATION (ĐĂNG NHẬP ADMIN CMS)
// ==========================================
const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || 'admin';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASS || 'admin';

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!'
      });
    }

    if (username.trim() === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASS) {
      const token = `tp_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return res.json({
        success: true,
        token,
        user: {
          username: DEFAULT_ADMIN_USER,
          name: 'Quản Trị Viên',
          role: 'Admin'
        },
        message: 'Đăng nhập thành công! Chào mừng bạn vào trang quản trị CMS.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác! (Mặc định: admin / admin)'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đăng nhập: ' + err.message });
  }
});

// ==========================================
// REST API FOR ARTICLES (MONGODB ATLAS & CMS)
// ==========================================

// 1. GET /api/articles - List articles with filtering & searching
app.get('/api/articles', async (req, res) => {
  try {
    const { search, category, status, featured, sort } = req.query;

    if (mongoose.connection.readyState === 1) {
      let filter = {};

      if (status && status !== 'all') {
        filter.status = status;
      }
      if (category && category !== 'all') {
        filter.category = category;
      }
      if (featured === 'true') {
        filter.isFeatured = true;
      }

      if (search && search.trim()) {
        const q = search.trim();
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { excerpt: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } },
          { categoryName: { $regex: q, $options: 'i' } }
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'oldest') {
        sortOption = { createdAt: 1 };
      } else if (sort === 'views') {
        sortOption = { views: -1 };
      }

      const articles = await Article.find(filter).sort(sortOption).lean();

      return res.json({
        success: true,
        total: articles.length,
        data: articles,
        source: 'mongodb'
      });
    }

    // Fallback if MongoDB is not connected
    let articles = getArticles();
    if (status && status !== 'all') {
      articles = articles.filter(a => a.status === status);
    }
    if (category && category !== 'all') {
      articles = articles.filter(a => a.category === category);
    }
    if (featured === 'true') {
      articles = articles.filter(a => a.isFeatured === true);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      articles = articles.filter(a => 
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
        (a.author && a.author.toLowerCase().includes(q)) ||
        (a.categoryName && a.categoryName.toLowerCase().includes(q))
      );
    }
    if (sort === 'oldest') {
      articles.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sort === 'views') {
      articles.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      articles.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    res.json({
      success: true,
      total: articles.length,
      data: articles,
      source: 'json-fallback'
    });
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách bài viết!' });
  }
});

// 2. GET /api/articles/:id - Get single article details
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      let article = await Article.findOne({ $or: [{ id: id }, { slug: id }] });
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết yêu cầu!'
        });
      }

      if (req.query.view === '1') {
        article.views = (article.views || 0) + 1;
        await article.save();
      }

      return res.json({
        success: true,
        data: article,
        source: 'mongodb'
      });
    }

    // Fallback
    const articles = getArticles();
    const article = articles.find(a => a.id === id || a.slug === id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết yêu cầu!'
      });
    }

    if (req.query.view === '1') {
      article.views = (article.views || 0) + 1;
      saveArticles(articles);
    }

    res.json({
      success: true,
      data: article,
      source: 'json-fallback'
    });
  } catch (err) {
    console.error('Error getting article details:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy chi tiết bài viết!' });
  }
});

// 3. POST /api/articles - Create new article
app.post('/api/articles', async (req, res) => {
  try {
    const { 
      title, 
      category, 
      categoryName, 
      author, 
      date, 
      image, 
      isFeatured, 
      status, 
      excerpt, 
      content,
      slug: customSlug
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề bài viết không được để trống!'
      });
    }

    const baseSlug = customSlug ? slugifyVietnamese(customSlug) : slugifyVietnamese(title);
    const willBeFeatured = Boolean(isFeatured);
    const nowIso = new Date();

    if (mongoose.connection.readyState === 1) {
      let uniqueSlug = baseSlug || 'bai-viet';
      let counter = 1;
      while (await Article.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      if (willBeFeatured) {
        await Article.updateMany({}, { isFeatured: false });
      }

      const newArticle = new Article({
        id: uniqueSlug,
        slug: uniqueSlug,
        title: title.trim(),
        category: category || 'tin-tuc',
        categoryName: categoryName || 'Tin Tức & Sự Kiện',
        author: (author && author.trim()) || 'Ban Truyền Thông Thành Phú',
        date: (date && date.trim()) || new Date().toLocaleDateString('vi-VN'),
        image: image || 'assets/images/news-1.svg',
        isFeatured: willBeFeatured,
        status: status === 'draft' ? 'draft' : 'published',
        views: 0,
        excerpt: (excerpt && excerpt.trim()) || '',
        content: content || '<p>Nội dung bài viết đang được cập nhật...</p>',
        createdAt: nowIso,
        updatedAt: nowIso
      });

      await newArticle.save();

      // Đồng bộ vào articles.json làm bản sao lưu
      try {
        const localArticles = getArticles();
        localArticles.unshift(newArticle.toObject());
        saveArticles(localArticles);
      } catch (e) {
        // Non-blocking
      }

      return res.status(201).json({
        success: true,
        message: 'Đăng bài viết mới thành công lên MongoDB Atlas!',
        data: newArticle
      });
    }

    // Fallback JSON
    const articles = getArticles();
    let uniqueSlug = baseSlug || 'bai-viet';
    let counter = 1;
    while (articles.some(a => a.slug === uniqueSlug || a.id === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    if (willBeFeatured) {
      articles.forEach(a => { a.isFeatured = false; });
    }

    const newArticle = {
      id: uniqueSlug,
      slug: uniqueSlug,
      title: title.trim(),
      category: category || 'tin-tuc',
      categoryName: categoryName || 'Tin Tức & Sự Kiện',
      author: (author && author.trim()) || 'Ban Truyền Thông Thành Phú',
      date: (date && date.trim()) || new Date().toLocaleDateString('vi-VN'),
      image: image || 'assets/images/news-1.svg',
      isFeatured: willBeFeatured,
      status: status === 'draft' ? 'draft' : 'published',
      views: 0,
      excerpt: (excerpt && excerpt.trim()) || '',
      content: content || '<p>Nội dung bài viết đang được cập nhật...</p>',
      createdAt: nowIso.toISOString(),
      updatedAt: nowIso.toISOString()
    };

    articles.unshift(newArticle);
    saveArticles(articles);

    res.status(201).json({
      success: true,
      message: 'Đăng bài viết mới thành công!',
      data: newArticle
    });
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo bài viết: ' + err.message });
  }
});

// 4. PUT /api/articles/:id - Update existing article
app.put('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      category, 
      categoryName, 
      author, 
      date, 
      image, 
      isFeatured, 
      status, 
      excerpt, 
      content,
      slug: newSlug
    } = req.body;

    if (title && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề bài viết không được để trống!'
      });
    }

    if (mongoose.connection.readyState === 1) {
      let article = await Article.findOne({ $or: [{ id: id }, { slug: id }] });
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết để cập nhật!'
        });
      }

      if (isFeatured === true) {
        await Article.updateMany({ _id: { $ne: article._id } }, { isFeatured: false });
      }

      if (newSlug) {
        const formattedSlug = slugifyVietnamese(newSlug);
        const existing = await Article.findOne({ slug: formattedSlug, _id: { $ne: article._id } });
        if (!existing) {
          article.slug = formattedSlug;
        }
      }

      if (title !== undefined) article.title = title.trim();
      if (category !== undefined) article.category = category;
      if (categoryName !== undefined) article.categoryName = categoryName;
      if (author !== undefined) article.author = author.trim();
      if (date !== undefined) article.date = date.trim();
      if (image !== undefined && image !== article.image) {
        if (article.image && article.image.startsWith('http')) {
          await destroyCloudinaryImage(article.image);
        }
        article.image = image;
      }
      if (isFeatured !== undefined) article.isFeatured = Boolean(isFeatured);
      if (status !== undefined) article.status = status === 'draft' ? 'draft' : 'published';
      if (excerpt !== undefined) article.excerpt = excerpt.trim();
      if (content !== undefined) article.content = content;
      article.updatedAt = new Date();

      await article.save();

      // Đồng bộ local articles.json
      try {
        const localArticles = getArticles();
        const lIdx = localArticles.findIndex(a => a.id === id || a.slug === id);
        if (lIdx !== -1) {
          localArticles[lIdx] = article.toObject();
          saveArticles(localArticles);
        }
      } catch (e) {}

      return res.json({
        success: true,
        message: 'Cập nhật bài viết thành công trên MongoDB Atlas!',
        data: article
      });
    }

    // Fallback JSON
    const articles = getArticles();
    const index = articles.findIndex(a => a.id === id || a.slug === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết để cập nhật!'
      });
    }

    if (isFeatured === true) {
      articles.forEach((a, idx) => {
        if (idx !== index) a.isFeatured = false;
      });
    }

    const current = articles[index];
    const updatedSlug = newSlug ? slugifyVietnamese(newSlug) : current.slug;

    if (image !== undefined && image !== current.image && current.image && current.image.startsWith('http')) {
      await destroyCloudinaryImage(current.image);
    }

    const updatedArticle = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      slug: updatedSlug || current.slug,
      category: category !== undefined ? category : current.category,
      categoryName: categoryName !== undefined ? categoryName : current.categoryName,
      author: author !== undefined ? author.trim() : current.author,
      date: date !== undefined ? date.trim() : current.date,
      image: image !== undefined ? image : current.image,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : current.isFeatured,
      status: status !== undefined ? (status === 'draft' ? 'draft' : 'published') : current.status,
      excerpt: excerpt !== undefined ? excerpt.trim() : current.excerpt,
      content: content !== undefined ? content : current.content,
      updatedAt: new Date().toISOString()
    };

    articles[index] = updatedArticle;
    saveArticles(articles);

    res.json({
      success: true,
      message: 'Cập nhật bài viết thành công!',
      data: updatedArticle
    });
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật bài viết!' });
  }
});

// 5. DELETE /api/articles/:id - Delete article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const deleted = await Article.findOneAndDelete({ $or: [{ id: id }, { slug: id }] });
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết cần xóa!'
        });
      }

      // Xóa ảnh trên Cloudinary nếu có
      if (deleted.image && deleted.image.startsWith('http')) {
        await destroyCloudinaryImage(deleted.image);
      }

      // Sync local file
      try {
        let localArticles = getArticles();
        localArticles = localArticles.filter(a => a.id !== id && a.slug !== id);
        saveArticles(localArticles);
      } catch (e) {}

      return res.json({
        success: true,
        message: 'Đã xóa bài viết thành công khỏi MongoDB Atlas!'
      });
    }

    // Fallback JSON
    let articles = getArticles();
    const initialLen = articles.length;
    const toDelete = articles.find(a => a.id === id || a.slug === id);
    if (!toDelete) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết cần xóa!'
      });
    }

    if (toDelete.image && toDelete.image.startsWith('http')) {
      await destroyCloudinaryImage(toDelete.image);
    }

    articles = articles.filter(a => a.id !== id && a.slug !== id);

    if (articles.length === initialLen) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết cần xóa!'
      });
    }

    saveArticles(articles);
    res.json({
      success: true,
      message: 'Đã xóa bài viết thành công!'
    });
  } catch (err) {
    console.error('Error deleting article:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa bài viết!' });
  }
});

// 6. PATCH /api/articles/:id/toggle-status - Quick toggle published/draft
app.patch('/api/articles/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const article = await Article.findOne({ $or: [{ id: id }, { slug: id }] });
      if (!article) {
        return res.status(404).json({ success: false, message: 'Bài viết không tồn tại!' });
      }

      article.status = article.status === 'published' ? 'draft' : 'published';
      article.updatedAt = new Date();
      await article.save();

      return res.json({
        success: true,
        status: article.status,
        message: `Đã đổi trạng thái thành: ${article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}`
      });
    }

    // Fallback
    const articles = getArticles();
    const article = articles.find(a => a.id === id || a.slug === id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Bài viết không tồn tại!' });
    }

    article.status = article.status === 'published' ? 'draft' : 'published';
    article.updatedAt = new Date().toISOString();
    saveArticles(articles);

    res.json({
      success: true,
      status: article.status,
      message: `Đã đổi trạng thái thành: ${article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái!' });
  }
});

// 7. PATCH /api/articles/:id/toggle-featured - Quick toggle isFeatured
app.patch('/api/articles/:id/toggle-featured', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const article = await Article.findOne({ $or: [{ id: id }, { slug: id }] });
      if (!article) {
        return res.status(404).json({ success: false, message: 'Bài viết không tồn tại!' });
      }

      const nextState = !article.isFeatured;
      if (nextState) {
        await Article.updateMany({}, { isFeatured: false });
      }
      article.isFeatured = nextState;
      article.updatedAt = new Date();
      await article.save();

      return res.json({
        success: true,
        isFeatured: article.isFeatured,
        message: article.isFeatured ? 'Đã đặt làm bài viết Tiêu Điểm!' : 'Đã bỏ đánh dấu Tiêu Điểm!'
      });
    }

    // Fallback
    const articles = getArticles();
    const article = articles.find(a => a.id === id || a.slug === id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Bài viết không tồn tại!' });
    }

    const nextState = !article.isFeatured;
    if (nextState) {
      articles.forEach(a => { a.isFeatured = false; });
    }
    article.isFeatured = nextState;
    article.updatedAt = new Date().toISOString();
    saveArticles(articles);

    res.json({
      success: true,
      isFeatured: article.isFeatured,
      message: article.isFeatured ? 'Đã đặt làm bài viết Tiêu Điểm!' : 'Đã bỏ đánh dấu Tiêu Điểm!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật tiêu điểm!' });
  }
});

// 8. GET /api/stats - Quick stats summary
app.get('/api/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const total = await Article.countDocuments();
      const published = await Article.countDocuments({ status: 'published' });
      const drafts = await Article.countDocuments({ status: 'draft' });
      const featured = await Article.countDocuments({ isFeatured: true });
      const totalProjects = await Project.countDocuments();

      const viewsAggr = await Article.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]);
      const totalViews = viewsAggr[0]?.totalViews || 0;

      const catAggr = await Article.aggregate([
        { $group: { _id: '$categoryName', count: { $sum: 1 } } }
      ]);
      const categories = {};
      catAggr.forEach(c => {
        if (c._id) categories[c._id] = c.count;
      });

      return res.json({
        success: true,
        stats: {
          total,
          published,
          drafts,
          featured,
          totalViews,
          categories,
          totalProjects
        }
      });
    }

    // Fallback
    const articles = getArticles();
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const drafts = articles.filter(a => a.status === 'draft').length;
    const featured = articles.filter(a => a.isFeatured).length;
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalProjects = getProjects().length;

    const categories = {};
    articles.forEach(a => {
      const cat = a.categoryName || 'Khác';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        total,
        published,
        drafts,
        featured,
        totalViews,
        categories,
        totalProjects
      }
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy thống kê!' });
  }
});

// 9. POST /api/upload - Cloudinary image upload with Local Fallback
app.post('/api/upload', async (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu hình ảnh!' });
    }

    // Attempt upload to Cloudinary CDN
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const safeBaseName = filename ? slugifyVietnamese(path.parse(filename).name) : 'upload';
        const publicId = `${safeBaseName}-${Date.now()}`;

        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: 'thanhphu/news',
          public_id: publicId,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        });

        return res.json({
          success: true,
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          format: uploadResult.format,
          provider: 'cloudinary',
          message: 'Tải ảnh lên Cloudinary CDN thành công!'
        });
      } catch (cloudErr) {
        console.warn('⚠️ Lỗi Cloudinary, chuyển sang lưu trữ cục bộ:', cloudErr.message);
      }
    }

    // Fallback: Local disk upload
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Dữ liệu ảnh base64 không đúng định dạng!' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('svg')) ext = 'svg';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';

    const safeBaseName = filename ? slugifyVietnamese(path.parse(filename).name) : 'upload';
    const uniqueFilename = `${safeBaseName}-${Date.now()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);

    fs.writeFileSync(filePath, buffer);

    res.json({
      success: true,
      url: `assets/uploads/${uniqueFilename}`,
      provider: 'local',
      message: 'Tải ảnh lên thư mục máy chủ thành công!'
    });
  } catch (err) {
    console.error('Error in upload API:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tải ảnh lên!' });
  }
});

// 10. POST /api/articles/reset-seed - Reset back to initial sample articles
app.post('/api/articles/reset-seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Article.deleteMany({});
      await Article.insertMany(DEFAULT_ARTICLES);
    }
    saveArticles(DEFAULT_ARTICLES);

    res.json({
      success: true,
      message: 'Đã khôi phục dữ liệu mẫu ban đầu thành công trên MongoDB Atlas!',
      data: DEFAULT_ARTICLES
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi khôi phục dữ liệu: ' + err.message });
  }
});

// ==========================================
// REST API FOR HERO SLIDES (QUẢN LÝ SLIDE TRANG CHỦ)
// ==========================================

// 1. GET /api/slides - Lấy danh sách slides và cài đặt tốc độ
app.get('/api/slides', async (req, res) => {
  try {
    const { all } = req.query;
    let query = {};
    if (all !== 'true') {
      query.isActive = true;
    }

    let slides = [];
    if (mongoose.connection.readyState === 1) {
      slides = await Slide.find(query).sort({ order: 1, createdAt: 1 }).lean();
    } else {
      slides = DEFAULT_SLIDES.filter(s => all === 'true' || s.isActive);
    }

    let setting = { autoplaySpeed: 6 };
    if (mongoose.connection.readyState === 1) {
      const dbSetting = await SlideSetting.findOne({ key: 'hero_slider' });
      if (dbSetting) setting.autoplaySpeed = dbSetting.autoplaySpeed;
    }

    res.json({
      success: true,
      total: slides.length,
      data: slides,
      settings: setting
    });
  } catch (err) {
    console.error('Error fetching slides:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách slide: ' + err.message });
  }
});

// 2. POST /api/slides - Thêm slide mới (hỗ trợ upload ảnh Cloudinary)
app.post('/api/slides', async (req, res) => {
  try {
    const { title, subtitle, image, order, isActive } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp hình ảnh cho slide!' });
    }

    let imageUrl = image;
    let cloudinaryId = '';

    // Nếu ảnh là chuỗi base64 -> upload lên Cloudinary
    if (image.startsWith('data:image')) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        try {
          const uploadRes = await cloudinary.uploader.upload(image, {
            folder: 'thanhphu/slides',
            resource_type: 'auto',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          });
          imageUrl = uploadRes.secure_url;
          cloudinaryId = uploadRes.public_id;
        } catch (cloudErr) {
          console.warn('Lỗi upload ảnh slide lên Cloudinary:', cloudErr.message);
          // Fallback to local
          const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            let ext = 'jpg';
            if (mimeType.includes('png')) ext = 'png';
            else if (mimeType.includes('webp')) ext = 'webp';
            const filename = `slide-${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
            imageUrl = `assets/uploads/${filename}`;
          }
        }
      }
    }

    // Xác định thứ tự tự động nếu không truyền
    let slideOrder = typeof order === 'number' ? order : 0;
    if (slideOrder === 0 && mongoose.connection.readyState === 1) {
      const maxOrderSlide = await Slide.findOne().sort({ order: -1 });
      slideOrder = maxOrderSlide ? maxOrderSlide.order + 1 : 0;
    }

    const newSlide = new Slide({
      title: (title && title.trim()) || '',
      subtitle: (subtitle && subtitle.trim()) || '',
      image: imageUrl,
      cloudinaryId: cloudinaryId,
      order: slideOrder,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newSlide.save();

    res.status(201).json({
      success: true,
      message: 'Thêm slide mới thành công!',
      data: newSlide
    });
  } catch (err) {
    console.error('Error creating slide:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo slide: ' + err.message });
  }
});

// 3. GET /api/slides/settings - Lấy cài đặt tốc độ slide
app.get('/api/slides/settings', async (req, res) => {
  try {
    let setting = await SlideSetting.findOne({ key: 'hero_slider' });
    if (!setting) {
      setting = await SlideSetting.create({ key: 'hero_slider', autoplaySpeed: 6 });
    }
    res.json({
      success: true,
      settings: {
        autoplaySpeed: setting.autoplaySpeed || 6
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy cài đặt tốc độ slide: ' + err.message });
  }
});

// 4. PUT /api/slides/settings - Lưu cài đặt tốc độ slide
app.put('/api/slides/settings', async (req, res) => {
  try {
    const { autoplaySpeed } = req.body;
    const speed = parseFloat(autoplaySpeed);
    if (isNaN(speed) || speed < 1 || speed > 60) {
      return res.status(400).json({ success: false, message: 'Tốc độ chạy slide phải từ 1 đến 60 giây!' });
    }

    let setting = await SlideSetting.findOneAndUpdate(
      { key: 'hero_slider' },
      { autoplaySpeed: speed, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: `Đã cập nhật tốc độ chạy slide thành ${speed} giây!`,
      settings: {
        autoplaySpeed: setting.autoplaySpeed
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lưu cài đặt: ' + err.message });
  }
});

// 5. PATCH /api/slides/reorder - Cập nhật thứ tự các slide hàng loạt
app.patch('/api/slides/reorder', async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order }
    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu thứ tự không hợp lệ!' });
    }

    const updates = orders.map(item => 
      Slide.findByIdAndUpdate(item.id, { order: Number(item.order), updatedAt: new Date() })
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Đã cập nhật thứ tự slide thành công!'
    });
  } catch (err) {
    console.error('Error reordering slides:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thứ tự: ' + err.message });
  }
});

// 6. PUT /api/slides/:id - Cập nhật slide
// 6. PUT /api/slides/:id - Cập nhật slide
app.put('/api/slides/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, image, order, isActive } = req.body;

    const slide = await Slide.findById(id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy slide!' });
    }

    // Nếu có ảnh mới dạng base64
    if (image && image.startsWith('data:image')) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        try {
          // Xóa ảnh cũ trên Cloudinary nếu có để dọn dẹp bộ nhớ
          if (slide.cloudinaryId || (slide.image && slide.image.includes('cloudinary'))) {
            await destroyCloudinaryImage(slide.cloudinaryId || slide.image);
          }

          const uploadRes = await cloudinary.uploader.upload(image, {
            folder: 'thanhphu/slides',
            resource_type: 'auto',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          });
          slide.image = uploadRes.secure_url;
          slide.cloudinaryId = uploadRes.public_id;
        } catch (cloudErr) {
          console.warn('Lỗi Cloudinary khi cập nhật slide:', cloudErr.message);
        }
      }
    } else if (image && image !== slide.image) {
      slide.image = image;
    }

    if (title !== undefined) slide.title = title.trim();
    if (subtitle !== undefined) slide.subtitle = subtitle.trim();
    if (order !== undefined) slide.order = Number(order);
    if (isActive !== undefined) slide.isActive = Boolean(isActive);
    slide.updatedAt = new Date();

    await slide.save();

    res.json({
      success: true,
      message: 'Cập nhật slide thành công!',
      data: slide
    });
  } catch (err) {
    console.error('Error updating slide:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật slide: ' + err.message });
  }
});

// 7. DELETE /api/slides/:id - Xóa slide
app.delete('/api/slides/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Slide.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy slide cần xóa!' });
    }

    // Xóa triệt để ảnh trên Cloudinary nếu là ảnh Cloudinary
    await destroyCloudinaryImage(deleted.cloudinaryId || deleted.image);

    res.json({
      success: true,
      message: 'Đã xóa slide và hình ảnh trên Cloudinary thành công!'
    });
  } catch (err) {
    console.error('Error deleting slide:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa slide: ' + err.message });
  }
});

// ==========================================
// REST API FOR PROJECTS (QUẢN LÝ DỰ ÁN & HỒ SƠ CÔNG TRÌNH)
// ==========================================

// 1. GET /api/projects - Lấy danh sách dự án (tìm kiếm, lọc chuyên mục, trạng thái, phân trang, enable/disable)
app.get('/api/projects', async (req, res) => {
  try {
    const { category, search, status, sort, isFeatured, isActive, all, page, limit } = req.query;

    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else if (all !== 'true') {
      // Mặc định khách truy cập website chỉ thấy các dự án đang enable (isActive !== false)
      query.isActive = { $ne: false };
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { location: { $regex: s, $options: 'i' } },
        { client: { $regex: s, $options: 'i' } },
        { badge: { $regex: s, $options: 'i' } },
        { overview: { $regex: s, $options: 'i' } }
      ];
    }

    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'views') sortOption = { views: -1 };
    else if (sort === 'title') sortOption = { title: 1 };

    if (mongoose.connection.readyState === 1) {
      let q = Project.find(query).sort(sortOption);
      if (page && limit) {
        const p = Math.max(1, parseInt(page, 10));
        const l = Math.max(1, parseInt(limit, 10));
        q = q.skip((p - 1) * l).limit(l);
      }
      const projects = await q.lean();
      const total = await Project.countDocuments(query);

      return res.json({
        success: true,
        count: projects.length,
        total,
        data: projects
      });
    }

    // Fallback JSON file
    let projects = getProjects();
    if (category && category !== 'all') {
      projects = projects.filter(p => p.category === category);
    }
    if (status && status !== 'all') {
      projects = projects.filter(p => p.status === status);
    }
    if (isFeatured === 'true') {
      projects = projects.filter(p => p.isFeatured);
    }
    if (isActive !== undefined) {
      projects = projects.filter(p => p.isActive === (isActive === 'true'));
    } else if (all !== 'true') {
      projects = projects.filter(p => p.isActive !== false);
    }

    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      projects = projects.filter(p => 
        (p.title && p.title.toLowerCase().includes(s)) ||
        (p.location && p.location.toLowerCase().includes(s)) ||
        (p.client && p.client.toLowerCase().includes(s)) ||
        (p.badge && p.badge.toLowerCase().includes(s)) ||
        (p.overview && p.overview.toLowerCase().includes(s))
      );
    }
    // Sorting
    if (sort === 'newest') {
      projects.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sort === 'oldest') {
      projects.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sort === 'views') {
      projects.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    res.json({
      success: true,
      count: projects.length,
      total: projects.length,
      data: projects
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách dự án: ' + err.message });
  }
});

// 2. GET /api/projects/:id - Lấy chi tiết dự án theo ID hoặc Slug
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let project = null;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        project = await Project.findById(id);
      }
      if (!project) {
        project = await Project.findOne({ $or: [{ id: id }, { slug: id }] });
      }
    } else {
      const projects = getProjects();
      project = projects.find(p => p.id === id || p.slug === id || p._id === id);
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin dự án!' });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết dự án: ' + err.message });
  }
});

// 3. POST /api/projects - Tạo dự án / bài viết dự án mới
app.post('/api/projects', async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      categoryName,
      badge,
      status,
      image,
      gallery,
      location,
      client,
      scale,
      contractType,
      timeline,
      year,
      overview,
      scope,
      highlights,
      content,
      order,
      isFeatured,
      isActive
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên dự án!' });
    }

    const cleanTitle = title.trim();
    let finalSlug = (slug && slug.trim()) ? slugifyVietnamese(slug.trim()) : slugifyVietnamese(cleanTitle);
    let finalId = finalSlug;

    // Check duplicate slug in DB
    if (mongoose.connection.readyState === 1) {
      const existing = await Project.findOne({ $or: [{ slug: finalSlug }, { id: finalId }] });
      if (existing) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
        finalId = finalSlug;
      }
    }

    let imageUrl = image || 'assets/images/project-1.svg';
    let cloudinaryId = '';

    // Handle Cloudinary upload for base64 image
    if (image && image.startsWith('data:image')) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        try {
          const uploadRes = await cloudinary.uploader.upload(image, {
            folder: 'thanhphu/projects',
            public_id: `${finalSlug}-${Date.now()}`,
            resource_type: 'auto',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          });
          imageUrl = uploadRes.secure_url;
          cloudinaryId = uploadRes.public_id;
        } catch (cloudErr) {
          console.warn('Lỗi upload ảnh dự án lên Cloudinary:', cloudErr.message);
        }
      }
    }

    // Auto order
    let projectOrder = typeof order === 'number' ? order : 0;
    if (projectOrder === 0 && mongoose.connection.readyState === 1) {
      const maxOrder = await Project.findOne().sort({ order: -1 });
      projectOrder = maxOrder ? (maxOrder.order || 0) + 1 : 0;
    }

    const parsedScope = Array.isArray(scope) ? scope : (typeof scope === 'string' ? scope.split('\n').map(s => s.trim()).filter(Boolean) : []);
    const parsedHighlights = Array.isArray(highlights) ? highlights : (typeof highlights === 'string' ? highlights.split('\n').map(s => s.trim()).filter(Boolean) : []);
    const parsedGallery = Array.isArray(gallery) ? gallery : (typeof gallery === 'string' ? gallery.split(',').map(s => s.trim()).filter(Boolean) : []);

    const newProjectData = {
      id: finalId,
      slug: finalSlug,
      title: cleanTitle,
      category: category || 'xay-lap',
      categoryName: categoryName || 'Thi công xây lắp',
      badge: badge || 'Xây Lắp Dân Dụng',
      status: status || 'Đã Bàn Giao',
      image: imageUrl,
      cloudinaryId: cloudinaryId,
      gallery: parsedGallery.length > 0 ? parsedGallery : [imageUrl],
      location: location || '',
      client: client || '',
      scale: scale || '',
      contractType: contractType || '',
      timeline: timeline || '',
      year: year || new Date().getFullYear().toString(),
      overview: overview || '',
      scope: parsedScope,
      highlights: parsedHighlights,
      content: content || '',
      order: projectOrder,
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const newProj = new Project(newProjectData);
      await newProj.save();
    }

    // Sync JSON
    let allProjects = getProjects();
    allProjects.unshift(newProjectData);
    saveProjects(allProjects);

    res.status(201).json({
      success: true,
      message: 'Đăng bài viết dự án thành công!',
      data: newProjectData
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo dự án: ' + err.message });
  }
});

// 4. PUT /api/projects/:id - Cập nhật dự án / bài viết dự án
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      categoryName,
      badge,
      status,
      image,
      gallery,
      location,
      client,
      scale,
      contractType,
      timeline,
      year,
      overview,
      scope,
      highlights,
      content,
      order,
      isFeatured,
      isActive
    } = req.body;

    let project = null;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        project = await Project.findById(id);
      }
      if (!project) {
        project = await Project.findOne({ $or: [{ id: id }, { slug: id }] });
      }
    }

    let imageUrl = image;
    let cloudinaryId = project ? project.cloudinaryId : '';

    // If new base64 image -> upload to Cloudinary & remove old
    if (image && image.startsWith('data:image')) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        try {
          if (cloudinaryId || (project && project.image && project.image.includes('cloudinary'))) {
            await destroyCloudinaryImage(cloudinaryId || project.image);
          }
          const uploadRes = await cloudinary.uploader.upload(image, {
            folder: 'thanhphu/projects',
            public_id: `${slug || (project ? project.slug : 'project')}-${Date.now()}`,
            resource_type: 'auto',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          });
          imageUrl = uploadRes.secure_url;
          cloudinaryId = uploadRes.public_id;
        } catch (cloudErr) {
          console.warn('Lỗi Cloudinary khi cập nhật ảnh dự án:', cloudErr.message);
        }
      }
    }

    const parsedScope = Array.isArray(scope) ? scope : (typeof scope === 'string' ? scope.split('\n').map(s => s.trim()).filter(Boolean) : undefined);
    const parsedHighlights = Array.isArray(highlights) ? highlights : (typeof highlights === 'string' ? highlights.split('\n').map(s => s.trim()).filter(Boolean) : undefined);
    const parsedGallery = Array.isArray(gallery) ? gallery : (typeof gallery === 'string' ? gallery.split(',').map(s => s.trim()).filter(Boolean) : undefined);

    if (project) {
      if (title !== undefined) project.title = title.trim();
      if (slug !== undefined) project.slug = slug.trim();
      if (category !== undefined) project.category = category;
      if (categoryName !== undefined) project.categoryName = categoryName;
      if (badge !== undefined) project.badge = badge;
      if (status !== undefined) project.status = status;
      if (imageUrl !== undefined) project.image = imageUrl;
      if (cloudinaryId !== undefined) project.cloudinaryId = cloudinaryId;
      if (parsedGallery !== undefined) project.gallery = parsedGallery;
      if (location !== undefined) project.location = location;
      if (client !== undefined) project.client = client;
      if (scale !== undefined) project.scale = scale;
      if (contractType !== undefined) project.contractType = contractType;
      if (timeline !== undefined) project.timeline = timeline;
      if (year !== undefined) project.year = year;
      if (overview !== undefined) project.overview = overview;
      if (parsedScope !== undefined) project.scope = parsedScope;
      if (parsedHighlights !== undefined) project.highlights = parsedHighlights;
      if (content !== undefined) project.content = content;
      if (order !== undefined) project.order = Number(order);
      if (isFeatured !== undefined) project.isFeatured = Boolean(isFeatured);
      if (isActive !== undefined) project.isActive = Boolean(isActive);
      project.updatedAt = new Date();

      await project.save();
    }

    // Update fallback JSON
    let allProjects = getProjects();
    const idx = allProjects.findIndex(p => p.id === id || p.slug === id || p._id === id);
    if (idx !== -1) {
      allProjects[idx] = {
        ...allProjects[idx],
        ...(title !== undefined ? { title: title.trim() } : {}),
        ...(slug !== undefined ? { slug: slug.trim() } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(categoryName !== undefined ? { categoryName } : {}),
        ...(badge !== undefined ? { badge } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(imageUrl !== undefined ? { image: imageUrl } : {}),
        ...(cloudinaryId !== undefined ? { cloudinaryId } : {}),
        ...(parsedGallery !== undefined ? { gallery: parsedGallery } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(client !== undefined ? { client } : {}),
        ...(scale !== undefined ? { scale } : {}),
        ...(contractType !== undefined ? { contractType } : {}),
        ...(timeline !== undefined ? { timeline } : {}),
        ...(year !== undefined ? { year } : {}),
        ...(overview !== undefined ? { overview } : {}),
        ...(parsedScope !== undefined ? { scope: parsedScope } : {}),
        ...(parsedHighlights !== undefined ? { highlights: parsedHighlights } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(order !== undefined ? { order: Number(order) } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
        updatedAt: new Date().toISOString()
      };
      saveProjects(allProjects);
    }

    res.json({
      success: true,
      message: 'Cập nhật bài viết dự án thành công!',
      data: project || allProjects[idx]
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật dự án: ' + err.message });
  }
});

// 5. PATCH /api/projects/:id/toggle-active - Bật / Tắt hiển thị lên website (Enable / Disable)
app.patch('/api/projects/:id/toggle-active', async (req, res) => {
  try {
    const { id } = req.params;
    let project = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        project = await Project.findById(id);
      }
      if (!project) {
        project = await Project.findOne({ $or: [{ id: id }, { slug: id }] });
      }
      if (project) {
        project.isActive = project.isActive !== false ? false : true;
        project.updatedAt = new Date();
        await project.save();
        return res.json({
          success: true,
          isActive: project.isActive,
          message: project.isActive ? 'Đã BẬT hiển thị dự án lên website!' : 'Đã TẮT hiển thị (tạm ẩn) dự án khỏi website!'
        });
      }
    }

    let allProjects = getProjects();
    const p = allProjects.find(item => item.id === id || item.slug === id);
    if (!p) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dự án!' });
    }
    p.isActive = p.isActive !== false ? false : true;
    saveProjects(allProjects);

    res.json({
      success: true,
      isActive: p.isActive,
      message: p.isActive ? 'Đã BẬT hiển thị dự án lên website!' : 'Đã TẮT hiển thị (tạm ẩn) dự án khỏi website!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi chuyển đổi trạng thái hiển thị!' });
  }
});

// 6. DELETE /api/projects/:id - Xóa dự án
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = null;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        deleted = await Project.findByIdAndDelete(id);
      }
      if (!deleted) {
        deleted = await Project.findOneAndDelete({ $or: [{ id: id }, { slug: id }] });
      }
    }

    if (deleted) {
      // Destroy main image on Cloudinary
      await destroyCloudinaryImage(deleted.cloudinaryId || deleted.image);
      // Destroy gallery images on Cloudinary
      if (deleted.gallery && Array.isArray(deleted.gallery)) {
        for (const imgUrl of deleted.gallery) {
          if (imgUrl && imgUrl.startsWith('http')) {
            await destroyCloudinaryImage(imgUrl);
          }
        }
      }
    }

    // Sync JSON
    let allProjects = getProjects();
    const beforeLen = allProjects.length;
    allProjects = allProjects.filter(p => p.id !== id && p.slug !== id && p._id !== id);
    if (allProjects.length < beforeLen) {
      saveProjects(allProjects);
    }

    res.json({
      success: true,
      message: 'Đã xóa dự án thành công!'
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa dự án: ' + err.message });
  }
});

// 6. PATCH /api/projects/:id/toggle-featured - Bật/Tắt Tiêu Điểm
app.patch('/api/projects/:id/toggle-featured', async (req, res) => {
  try {
    const { id } = req.params;

    let project = null;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        project = await Project.findById(id);
      }
      if (!project) {
        project = await Project.findOne({ $or: [{ id: id }, { slug: id }] });
      }
      if (project) {
        project.isFeatured = !project.isFeatured;
        project.updatedAt = new Date();
        await project.save();
        return res.json({
          success: true,
          isFeatured: project.isFeatured,
          message: project.isFeatured ? 'Đã đánh dấu dự án Tiêu Điểm!' : 'Đã bỏ đánh dấu Tiêu Điểm!'
        });
      }
    }

    let allProjects = getProjects();
    const p = allProjects.find(item => item.id === id || item.slug === id);
    if (!p) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dự án!' });
    }
    p.isFeatured = !p.isFeatured;
    saveProjects(allProjects);

    res.json({
      success: true,
      isFeatured: p.isFeatured,
      message: p.isFeatured ? 'Đã đánh dấu dự án Tiêu Điểm!' : 'Đã bỏ đánh dấu Tiêu Điểm!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi đổi trạng thái tiêu điểm!' });
  }
});

// 7. POST /api/projects/reset-seed - Reset 9 dự án ban đầu
app.post('/api/projects/reset-seed', async (req, res) => {
  try {
    let seedProjects = [];
    if (fs.existsSync(PROJECTS_FILE)) {
      try {
        seedProjects = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
      } catch (e) {}
    }

    if (mongoose.connection.readyState === 1) {
      await Project.deleteMany({});
      if (seedProjects.length > 0) {
        await Project.insertMany(seedProjects);
      }
    }

    res.json({
      success: true,
      message: 'Đã khôi phục 9 dự án tiêu biểu ban đầu thành công trên MongoDB Atlas!',
      count: seedProjects.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi khôi phục dự án: ' + err.message });
  }
});

// ==========================================
// EXISTING MOCK APIS
// ==========================================
app.post('/api/contact', (req, res) => {
  const { name, phone, email, service, message } = req.body;
  console.log('[LIÊN HỆ MỚI]:', { name, phone, email, service, message, receivedAt: new Date().toISOString() });
  
  res.json({
    success: true,
    message: 'Cảm ơn quý khách đã gửi thông tin. Đội ngũ Kỹ sư & Tư vấn Thành Phú sẽ liên hệ lại trong vòng 24h làm việc!'
  });
});

app.post('/api/apply', (req, res) => {
  const { name, phone, email, position, note } = req.body;
  console.log('[ỨNG TUYỂN MỚI]:', { name, phone, email, position, note, receivedAt: new Date().toISOString() });

  res.json({
    success: true,
    message: 'Hồ sơ ứng tuyển của bạn đã được tiếp nhận. Bộ phận Nhân sự Thành Phú sẽ liên hệ sớm nhất!'
  });
});

// Start Server after connecting to MongoDB
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 THÀNH PHÚ CONSTRUCTION SERVER RUNNING!`);
    console.log(`📍 Website: http://localhost:${PORT}`);
    console.log(`🛠️  Admin CMS: http://localhost:${PORT}/admin`);
    console.log(`📰 API Articles: http://localhost:${PORT}/api/articles`);
    console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME || 'Chưa cấu hình'}`);
    console.log(`🗄️  MongoDB Database: ${mongoose.connection.name || 'Chờ kết nối'}`);
    console.log(`====================================================`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

module.exports = app;

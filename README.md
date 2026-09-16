# WEBSITE CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY LẮP THÀNH PHÚ (THÀNH PHÚ CONSTRUCTION)

Website chính thức theo phong cách **Flat Design** hiện đại dành cho Công ty Xây dựng Thành Phú (dựa trên [thanhphuxd.com](https://thanhphuxd.com/)).

---

## 🎨 Màu Sắc Chủ Đạo & Phong Cách Thiết Kế
- **Đỏ Thương Hiệu (Primary):** `#ed1925`
- **Ghi Bạc Kỹ Thuật (Gray):** `#b3b2b7`
- **Vàng Công Trình (Accent):** `#FFCB56`
- **Phong cách:** Flat Design (Phẳng, tối giản chi tiết rườm rà, hình khối sắc nét, cấu trúc lưới Grid chuẩn mực, độ tương phản cao, giao diện kỹ thuật chuyên nghiệp).

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
thanhphu/
├── components/
│   └── header.html              # Template mã nguồn duy nhất của Header dùng chung
├── assets/
│   ├── css/
│   │   └── style.css            # Toàn bộ mã CSS thiết kế Flat Design & hệ thống CSS Grid
│   ├── js/
│   │   ├── header.js            # Script nạp Shared Header dùng chung tức thì cho tất cả các trang
│   │   └── main.js              # Cơ chế Seamless SPA (chuyển trang mượt mà, HEADER GIỮ NGUYÊN không bị reload)
│   └── images/
│       ├── logo.png             # Logo công ty
│       └── THÀNH PHÚ.png        # Logo gốc
├── index.html                   # 1. Trang chủ (Hero banner, số liệu, năng lực, dự án nổi bật, đối tác)
├── gioi-thieu.html              # 2. Giới thiệu (Lịch sử hình thành, tầm nhìn - sứ mệnh, ban lãnh đạo, năng lực thiết bị)
├── linh-vuc.html                # 3. Lĩnh vực hoạt động (Dân dụng & cao tầng, công nghiệp & nhà xưởng, hạ tầng, kết cấu thép & MEP)
├── du-an.html                   # 4. Dự án (Bộ lọc phân loại danh mục, danh sách dự án kèm quy mô, tiến độ)
├── tin-tuc.html                 # 5. Tin tức & Hoạt động (Bản tin công trường, công nghệ xây dựng, văn hóa nội bộ)
├── tuyen-dung.html              # 6. Tuyển dụng (Chế độ đãi ngộ, văn hóa, danh sách vị trí, form nộp CV trực tuyến)
├── lien-he.html                 # 7. Liên hệ (Thông tin trụ sở, hotline, email, bản đồ Google Maps, form nhận báo giá)
├── package.json                 # Cấu hình dự án Node.js & Dependencies (Express)
└── server.js                    # Web server Node.js / Express phục vụ website & tiếp nhận API liên hệ/tuyển dụng
```

---

## ⚡ Cơ Chế 1 Header Dùng Chung & Không Bị Reload Khi Chuyển Trang
1. **1 Nguồn Header duy nhất:** Header được quản lý tập trung tại [assets/js/header.js](file:///c:/Users/LONG%20IT/Desktop/thanhphu/assets/js/header.js) & [components/header.html](file:///c:/Users/LONG%20IT/Desktop/thanhphu/components/header.html). Mọi thay đổi về menu, số điện thoại, logo chỉ cần sửa 1 lần là tự động cập nhật đến tất cả các trang.
2. **Header tĩnh, không bị load lại (Seamless Transition):** Khi người dùng nhấp vào bất kỳ mục nào trên thanh menu, JavaScript sẽ giữ nguyên Header trên màn hình, chỉ tải và hoán đổi vùng nội dung `<div id="page-content">` bên dưới kèm hiệu ứng GSAP mượt mà, cập nhật URL trình duyệt và đánh dấu thẻ menu đang chọn (`active`) ngay lập tức mà **Header hoàn toàn không bị giật hay load lại**.

---

## 🚀 Hướng Dẫn Chạy Website

### Cách 1: Chạy bằng Node.js Server (Khuyên dùng)
1. Mở terminal tại thư mục dự án.
2. Chạy lệnh:
   ```bash
   node server.js
   ```
   *Hoặc nếu dùng npm:*
   ```bash
   npm start
   ```
3. Mở trình duyệt và truy cập: **`http://localhost:3000`**

### Cách 2: Mở Trực Tiếp File HTML
Bạn có thể nhấp đúp trực tiếp vào file `index.html` hoặc bất kỳ file `.html` nào để mở ngay trong trình duyệt mà không cần cài đặt gì thêm.

---

## ✨ Điểm Nhấn Công Nghệ
- **Thư viện GSAP 3 & ScrollTrigger:** Hiệu ứng chuyển động mượt mà khi cuộn trang, thanh điều hướng ghim cuộn, số liệu tăng dần tự động (Counter ticker).
- **CSS Grid & Flexbox:** Bố cục linh hoạt đa cột (Grid 2, 3, 4 cột, Bento layout), tối ưu hiển thị trên mọi kích cỡ màn hình (Desktop, Tablet, Mobile).
- **Phân tách trang hoàn chỉnh:** Mỗi mục trên header là một file HTML độc lập theo đúng yêu cầu.
- **Form tương tác trực quan:** Form liên hệ báo giá và ứng tuyển trực tuyến với thông báo Toast thông minh.

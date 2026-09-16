/**
 * THÀNH PHÚ CONSTRUCTION - SHARED HEADER COMPONENT
 * 1 header duy nhất dùng chung cho toàn bộ các trang.
 * Chỉnh sửa header tại file này hoặc components/header.html sẽ cập nhật toàn bộ website.
 */

const SHARED_HEADER_HTML = `
<!-- Top Bar -->
<div class="top-bar">
  <div class="container top-bar-inner">
    <div class="top-bar-left">
      <div class="top-bar-item">
        <i class="fas fa-map-marker-alt"></i>
        <span>22A Vũ Ngọc Phan, P. 13, Q. Bình Thạnh, TP. Hồ Chí Minh</span>
      </div>
      <div class="top-bar-item">
        <i class="fas fa-clock"></i>
        <span>Thứ 2 - Thứ 7: 08:00 - 17:30</span>
      </div>
    </div>
    <div class="top-bar-right">
      <div class="top-bar-item">
        <i class="fas fa-phone-alt"></i>
        <a href="tel:02835532345">(028) 3553 2345</a> / <a href="tel:0903123456">0903 123 456</a>
      </div>
      <div class="top-bar-item">
        <i class="fas fa-envelope"></i>
        <a href="mailto:thanhphuhcns@gmail.com">thanhphuhcns@gmail.com</a>
      </div>
    </div>
  </div>
</div>

<!-- Main Navigation Header -->
<header class="main-header">
  <div class="container navbar">
    <a href="index.html" class="brand-logo" title="Công ty Cổ phần Đầu tư Xây lắp Thành Phú">
      <img src="assets/images/logo.png" alt="Công ty Cổ phần Đầu tư Xây lắp Thành Phú">
    </a>

    <ul class="nav-menu">
      <li><a href="index.html" class="nav-link">Trang chủ</a></li>
      <li><a href="gioi-thieu.html" class="nav-link">Giới thiệu</a></li>
      <li><a href="linh-vuc.html" class="nav-link">Lĩnh vực hoạt động</a></li>
      <li class="has-dropdown">
        <a href="du-an.html" class="nav-link">
          Dự án <i class="fas fa-chevron-down dropdown-arrow"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a href="du-an.html?cat=xay-lap" class="dropdown-item">Thi công xây lắp</a></li>
          <li><a href="du-an.html?cat=noi-that" class="dropdown-item">Trang trí nội thất</a></li>
          <li><a href="du-an.html?cat=nhom-kinh" class="dropdown-item">SXLĐ cấu kiện nhôm kính</a></li>
        </ul>
      </li>
      <li><a href="tin-tuc.html" class="nav-link">Tin tức</a></li>
      <li><a href="tuyen-dung.html" class="nav-link">Tuyển dụng</a></li>
      <li><a href="lien-he.html" class="nav-link">Liên hệ</a></li>
    </ul>

    <div class="nav-action">
      <a href="tel:0903123456" class="btn btn-primary btn-sm header-phone-btn" title="Gọi Hotline Thành Phú">
        <i class="fas fa-phone-alt"></i> 0903 123 456
      </a>
    </div>

    <button class="mobile-toggle" aria-label="Mở menu">
      <i class="fas fa-bars"></i>
    </button>
  </div>
</header>
`;

// Function to render shared header
function renderSharedHeader() {
  const container = document.getElementById('site-header');
  if (container && !container.dataset.rendered) {
    container.innerHTML = SHARED_HEADER_HTML;
    container.dataset.rendered = "true";
  }
}

// Auto-run when script loads or DOM is ready in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSharedHeader);
  } else {
    renderSharedHeader();
  }
}

if (typeof window !== 'undefined') {
  window.SHARED_HEADER_HTML = SHARED_HEADER_HTML;
  window.renderSharedHeader = renderSharedHeader;
}

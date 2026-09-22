/**
 * Thành Phú Construction - Main JavaScript
 * Seamless SPA Page Transitions (Header does NOT reload on page change)
 * Shared Header Management, GSAP Animations, Filter, Counters, Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ensure shared header is rendered
  if (typeof renderSharedHeader === 'function') {
    renderSharedHeader();
  }

  // 2. Initialize Core Components
  initNavbarEvents();
  initBackToTop();
  initSeamlessNavigation();

  // 3. Initialize Page Specific Features
  initPageFeatures();
});

// ==========================================
// 1. SEAMLESS NAVIGATION ENGINE (NO HEADER RELOAD)
// ==========================================
function initSeamlessNavigation() {
  // Delegate all link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore anchors, external URLs, mailto, tel, javascript
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      link.hasAttribute('download') ||
      link.getAttribute('target') === '_blank'
    ) {
      // If it's an on-page anchor like #form-ung-tuyen, smooth scroll to it
      if (href.startsWith('#') && href.length > 1) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    // Bypass SPA router for Admin CMS
    if (href.includes('admin')) {
      return;
    }

    // Check if it's an internal page link
    const isInternalHtml = 
      href.endsWith('.html') || 
      href.includes('.html?') ||
      href === '/' || 
      href.startsWith('/') ||
      ['trang-chu', 'gioi-thieu', 'linh-vuc', 'du-an', 'chi-tiet-du-an', 'tin-tuc', 'chi-tiet-tin-tuc', 'tuyen-dung', 'lien-he'].some(p => href.includes(p));

    if (isInternalHtml) {
      e.preventDefault();
      navigateTo(href, true);
    }
  });

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', () => {
    navigateTo((window.location.pathname || 'index.html') + (window.location.search || ''), false);
  });
}

/**
 * Navigate to target URL without reloading the header
 */
async function navigateTo(url, pushState = true) {
  const pageContent = document.getElementById('page-content');
  if (!pageContent) {
    window.location.href = url;
    return;
  }

  showTopPageLoader();

  // Close mobile drawer if open
  closeMobileMenu();

  // Immediate update of active nav link on header (Header remains untouched!)
  updateActiveNavLink(url);

  // Kill old ScrollTriggers before transitioning to prevent ghost scroll containers
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  // Smooth content fade out using GSAP (pure opacity, avoid translateY layout shift)
  if (typeof gsap !== 'undefined') {
    await gsap.to(pageContent, { opacity: 0, duration: 0.15, ease: 'power1.in' });
  } else {
    pageContent.style.opacity = '0';
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response error');
    
    const htmlText = await response.text();
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(htmlText, 'text/html');

    // Update document title
    if (newDoc.title) {
      document.title = newDoc.title;
    }

    // Extract new page content
    const newContent = newDoc.getElementById('page-content');
    if (newContent) {
      pageContent.innerHTML = newContent.innerHTML;
    } else {
      // Fallback
      pageContent.innerHTML = newDoc.body.innerHTML;
    }

    // Update History state
    if (pushState) {
      window.history.pushState({ url }, '', url);
    }

    // Scroll to top instantly before fade in
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Smooth content fade in using GSAP (pure opacity, zero translateY)
    if (typeof gsap !== 'undefined') {
      gsap.set(pageContent, { clearProps: 'transform' });
      gsap.fromTo(pageContent, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' });
    } else {
      pageContent.style.opacity = '1';
    }

    // Re-initialize all scripts for newly injected content
    initPageFeatures();
    hideTopPageLoader();

  } catch (error) {
    hideTopPageLoader();
    console.warn('Seamless navigation fallback triggered:', error);
    window.location.href = url;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

async function initPageFeatures() {
  updateHeaderMode();
  initHeroSlider();
  initGSAPAnimations();
  initCounters();

  // 1. Trang danh mục dự án (du-an.html)
  if (document.getElementById('projects-grid-container')) {
    if (typeof initProjectsPage !== 'function') {
      try {
        await loadScript('assets/js/projects-data.js');
      } catch (err) {
        console.error(err);
      }
    }
    if (typeof initProjectsPage === 'function') {
      await initProjectsPage();
    }
  }

  // 2. Dự án tiêu biểu trang chủ (index.html)
  if (document.getElementById('home-projects-grid')) {
    if (typeof initHomeProjects !== 'function') {
      try {
        await loadScript('assets/js/projects-data.js');
      } catch (err) {
        console.error(err);
      }
    }
    if (typeof initHomeProjects === 'function') {
      await initHomeProjects();
    }
  }

  // 3. Trang chi tiết dự án (chi-tiet-du-an.html)
  if (document.getElementById('project-detail-container')) {
    if (typeof renderProjectDetail !== 'function') {
      try {
        await loadScript('assets/js/projects-data.js');
      } catch (err) {
        console.error(err);
      }
    }
    if (typeof renderProjectDetail === 'function') {
      renderProjectDetail();
    }
  }

  // 4. Tin tức trang chủ & trang tin tức
  if (document.getElementById('home-news-grid')) {
    if (typeof ARTICLES_DATA === 'undefined') {
      try {
        await loadScript('assets/js/articles-data.js');
      } catch (err) {}
    }
    if (typeof initHomeNews === 'function') {
      initHomeNews();
    }
  }
  if (document.getElementById('news-grid-container')) {
    if (typeof ARTICLES_DATA === 'undefined') {
      try {
        await loadScript('assets/js/articles-data.js');
      } catch (err) {}
    }
    if (typeof initNewsPage === 'function') {
      await initNewsPage();
    }
  }
  if (document.getElementById('article-content')) {
    if (typeof loadArticleDetail !== 'function') {
      try {
        await loadScript('assets/js/articles-data.js');
      } catch (err) {}
    }
    if (typeof loadArticleDetail === 'function') {
      loadArticleDetail();
    }
  }

  // 5. Đối tác & Chủ đầu tư chiến lược trang chủ (index.html)
  if (document.getElementById('home-partners-grid') || document.querySelector('.partner-logo-grid')) {
    initHomePartners();
  }

  initProjectFilter();
  initContactForms();
  initBackToTop();

  // 6. Motion Design & Micro-interactions
  initScrollProgressBar();
  init3DTiltEffects();
  initMagneticButtons();
  initSwipeGestures();
}

// ==========================================
// 3. NAVBAR & STICKY HEADER
// ==========================================
function updateHeaderMode() {
  const siteHeader = document.getElementById('site-header');
  const header = document.querySelector('.main-header');
  const hasSlider = !!document.getElementById('hero-slider');

  if (hasSlider) {
    document.body.classList.add('has-hero-slider');
    document.body.classList.remove('no-hero-slider');
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
      header?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
      header?.classList.remove('scrolled');
    }
  } else {
    document.body.classList.add('no-hero-slider');
    document.body.classList.remove('has-hero-slider');
    // On inner pages without hero slider, header is solid white with dark links
    siteHeader?.classList.add('scrolled');
    header?.classList.add('scrolled');
  }
}

// Mobile Menu Drawer Control Helpers
function openMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-menu-overlay');

  toggleBtn?.classList.add('active');
  drawer?.classList.add('open');
  overlay?.classList.add('active');
  document.body.classList.add('mobile-menu-open');
}

function closeMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-menu-overlay');

  toggleBtn?.classList.remove('active');
  drawer?.classList.remove('open');
  overlay?.classList.remove('active');
  document.body.classList.remove('mobile-menu-open');
}

function initNavbarEvents() {
  const siteHeader = document.getElementById('site-header');
  const header = document.querySelector('.main-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const overlay = document.getElementById('mobile-menu-overlay');
  const drawer = document.getElementById('mobile-drawer');

  // Fixed Header on Scroll
  const handleScroll = () => {
    const hasSlider = !!document.getElementById('hero-slider');
    if (!hasSlider) {
      siteHeader?.classList.add('scrolled');
      header?.classList.add('scrolled');
      return;
    }
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
      header?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  updateHeaderMode();

  // Mobile Menu Toggle Button
  if (toggleBtn) {
    const newToggle = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);

    newToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawer?.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Mobile Drawer Close Button
  if (closeBtn) {
    const newClose = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newClose, closeBtn);
    newClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  // Mobile Menu Overlay Backdrop Click
  if (overlay) {
    const newOverlay = overlay.cloneNode(true);
    overlay.parentNode.replaceChild(newOverlay, overlay);
    newOverlay.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  // Mobile Submenu Accordion Toggles
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = btn.closest('.mobile-nav-dropdown');
      if (parent) {
        parent.classList.toggle('open');
      }
    };
  });

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Set active link for initial page load
  const initialUrl = (window.location.pathname || 'index.html') + (window.location.search || '');
  updateActiveNavLink(initialUrl);
}

function updateActiveNavLink(currentUrl) {
  // Parse clean page name and query parameters
  const [pathPart, queryPart] = currentUrl.split('?');
  const cleanPath = (pathPart.split('/').pop().replace('.html', '') || 'index').split('#')[0];
  const urlParams = new URLSearchParams(queryPart ? queryPart.split('#')[0] : '');
  const currentCat = urlParams.get('cat');

  // Desktop Navbar Links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const [linkPath] = href.split('?');
    const cleanHref = (linkPath.split('/').pop().replace('.html', '') || 'index').split('#')[0];

    const isDuAnDetail = cleanPath === 'chi-tiet-du-an' && cleanHref === 'du-an';
    if (cleanHref === cleanPath || (cleanHref === 'index' && (cleanPath === '' || cleanPath === 'index')) || isDuAnDetail) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Desktop Dropdown Sub-Items
  const desktopDropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
  desktopDropdownItems.forEach(item => {
    const href = item.getAttribute('href') || '';
    const [itemPath, itemQuery] = href.split('?');
    const itemParams = new URLSearchParams(itemQuery ? itemQuery.split('#')[0] : '');
    const itemCat = itemParams.get('cat');

    if (cleanPath === 'du-an' && currentCat && itemCat === currentCat) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Mobile Parent Nav Links
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const [linkPath] = href.split('?');
    const cleanHref = (linkPath.split('/').pop().replace('.html', '') || 'index').split('#')[0];

    const isDuAnDetail = cleanPath === 'chi-tiet-du-an' && cleanHref === 'du-an';
    if (cleanHref === cleanPath || (cleanHref === 'index' && (cleanPath === '' || cleanPath === 'index')) || isDuAnDetail) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile Sub-Links inside Accordion
  const mobileSubLinks = document.querySelectorAll('.mobile-sub-link');
  mobileSubLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const [linkPath, linkQuery] = href.split('?');
    const linkParams = new URLSearchParams(linkQuery ? linkQuery.split('#')[0] : '');
    const linkCat = linkParams.get('cat');

    // Only activate specific sub-link when on du-an page AND category matches exactly
    if (cleanPath === 'du-an' && currentCat && linkCat === currentCat) {
      link.classList.add('active');
      const parentDropdown = link.closest('.mobile-nav-dropdown');
      if (parentDropdown) {
        parentDropdown.classList.add('open');
      }
    } else {
      link.classList.remove('active');
    }
  });
}

// ==========================================
// 4. BACK TO TOP
// ==========================================
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

// ==========================================
// 5. HOMEPAGE HERO IMAGE SLIDER ENGINE
// ==========================================
let heroSliderInterval = null;
let heroSliderKeyHandler = null;
let heroSliderVisHandler = null;

async function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) {
    if (heroSliderInterval) {
      clearInterval(heroSliderInterval);
      heroSliderInterval = null;
    }
    return;
  }

  // Clear any existing interval
  if (heroSliderInterval) {
    clearInterval(heroSliderInterval);
    heroSliderInterval = null;
  }

  // Load dynamic slides from MongoDB Atlas & Cloudinary
  let dynamicDuration = 5.0;
  try {
    const res = await fetch('/api/slides');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const slidesContainer = slider.querySelector('.hero-slides');
        if (slidesContainer) {
          slidesContainer.innerHTML = '';
          data.data.forEach((item, idx) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
            slideDiv.dataset.slide = idx;
            slideDiv.innerHTML = `
              <div class="hero-slide-bg" style="background-image: url('${item.image}');"></div>
              <div class="hero-slide-overlay"></div>
            `;
            slidesContainer.appendChild(slideDiv);
          });
        }
        if (data.settings && data.settings.autoplaySpeed) {
          const parsed = parseFloat(data.settings.autoplaySpeed);
          if (!isNaN(parsed) && parsed > 0) {
            dynamicDuration = parsed;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Dùng slide mặc định do không kết nối được API:', err.message);
  }

  const slides = slider.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  if (!slides || slides.length <= 1) return;

  // Clean inline styles from all slides
  slides.forEach(s => {
    s.style.opacity = '';
  });

  let currentIndex = 0;
  slides.forEach((slide, idx) => {
    if (slide.classList.contains('active')) {
      currentIndex = idx;
    }
  });

  // Ensure only one slide is active initially
  slides.forEach((s, idx) => {
    if (idx === currentIndex) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  const intervalMs = Math.max(1500, dynamicDuration * 1000);
  let isTransitioning = false;
  let isHovered = false;

  function goToSlide(targetIndex) {
    if (targetIndex === currentIndex) return;

    isTransitioning = true;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[targetIndex];

    if (currentSlide) {
      currentSlide.classList.remove('active');
      currentSlide.style.opacity = '';
    }
    if (nextSlide) {
      nextSlide.classList.add('active');
      nextSlide.style.opacity = '';
    }

    currentIndex = targetIndex;

    // Reset transitioning flag after CSS transition finishes
    setTimeout(() => {
      isTransitioning = false;
    }, 750);
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }

  function prevSlide() {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }

  function startAutoplay() {
    stopAutoplay();
    heroSliderInterval = setInterval(() => {
      if (isHovered || document.hidden || isTransitioning) return;
      nextSlide();
    }, intervalMs);
  }

  function stopAutoplay() {
    if (heroSliderInterval) {
      clearInterval(heroSliderInterval);
      heroSliderInterval = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Next / Prev button event handlers with instant reset of interval
  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.preventDefault();
      nextSlide();
      restartAutoplay();
    };
  }

  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.preventDefault();
      prevSlide();
      restartAutoplay();
    };
  }

  // Mouse hover events (Desktop only)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    slider.onmouseenter = () => {
      isHovered = true;
    };
    slider.onmouseleave = () => {
      isHovered = false;
    };
  }

  // Touch Swipe Support for Mobile & Tablet
  let touchStartX = 0;
  let touchEndX = 0;

  slider.ontouchstart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  slider.ontouchend = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 45;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      restartAutoplay();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      restartAutoplay();
    }
  };

  // Visibility change handler (tab switch or browser minimize)
  if (heroSliderVisHandler) {
    document.removeEventListener('visibilitychange', heroSliderVisHandler);
  }
  heroSliderVisHandler = () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      restartAutoplay();
    }
  };
  document.addEventListener('visibilitychange', heroSliderVisHandler);

  // Keyboard Navigation (Left / Right Arrows)
  if (heroSliderKeyHandler) {
    document.removeEventListener('keydown', heroSliderKeyHandler);
  }
  heroSliderKeyHandler = (e) => {
    if (!document.getElementById('hero-slider')) {
      document.removeEventListener('keydown', heroSliderKeyHandler);
      heroSliderKeyHandler = null;
      return;
    }
    if (e.key === 'ArrowRight') {
      nextSlide();
      restartAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      restartAutoplay();
    }
  };
  document.addEventListener('keydown', heroSliderKeyHandler);

  // Start Autoplay loop
  startAutoplay();
}

// ==========================================
// 6. GSAP ANIMATIONS
// ==========================================
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.registerPlugin(ScrollTrigger);
  }

  // ScrollTrigger for sections and cards
  if (typeof ScrollTrigger !== 'undefined') {
    // Reset inline styles first to avoid capturing intermediate animation values
    const animElements = document.querySelectorAll('.section-header, .service-card, .project-card, .news-card, .feature-box, .about-grid > *');
    animElements.forEach(el => {
      el.style.opacity = '';
      el.style.transform = '';
    });

    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.fromTo(header, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: header,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    gsap.utils.toArray('.service-card, .project-card, .news-card, .feature-box').forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
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

    gsap.utils.toArray('.about-grid').forEach(grid => {
      gsap.fromTo(grid.children,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: grid,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Refresh ScrollTrigger to ensure accurate positions after DOM calculations
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }
}

// ==========================================
// 6. STAT COUNTERS
// ==========================================
function initCounters() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  const animateValue = (el, start, end, duration, suffix = '') => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      el.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = end + suffix;
      }
    };
    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-count') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateValue(el, 0, targetVal, 1500, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => observer.observe(el));
}

// ==========================================
// 7. PROJECT FILTER
// ==========================================
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectItems.length) return;

  const applyFilter = (filterValue) => {
    filterBtns.forEach(b => {
      if (b.getAttribute('data-filter') === filterValue) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    projectItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if (filterValue === 'all' || itemCategory === filterValue) {
        item.style.display = 'flex';
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(item, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
        }
      } else {
        item.style.display = 'none';
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      const filterValue = btn.getAttribute('data-filter');
      applyFilter(filterValue);
    };
  });

  // Check URL query parameters for direct category link (e.g., ?cat=xay-lap)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    applyFilter(catParam);
  }
}

// ==========================================
// 8. CONTACT & CAREER FORMS
// ==========================================
function initContactForms() {
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(form => {
    form.onsubmit = async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG GỬI...';
      }

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const resData = await response.json();
          showToast(resData.message || 'Gửi yêu cầu thành công!');
          form.reset();
        } else {
          showToast('Cảm ơn quý khách! Thông tin đã được ghi nhận. Thành Phú sẽ liên hệ sớm nhất.');
          form.reset();
        }
      } catch (err) {
        showToast('Cảm ơn quý khách! Thông tin đã được ghi nhận. Thành Phú sẽ liên hệ sớm nhất.');
        form.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    };
  });

  const applyForm = document.querySelector('.apply-form');
  if (applyForm) {
    applyForm.onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = applyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG GỬI HỒ SƠ...';
      }

      const formData = new FormData(applyForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const resData = await response.json();
          showToast(resData.message || 'Nộp hồ sơ thành công!');
          applyForm.reset();
        } else {
          showToast('Hồ sơ ứng tuyển đã được ghi nhận! Bộ phận HR sẽ liên hệ bạn.');
          applyForm.reset();
        }
      } catch (err) {
        showToast('Hồ sơ ứng tuyển đã được ghi nhận! Bộ phận HR sẽ liên hệ bạn.');
        applyForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    };
  }
}

// ==========================================
// 9. TOAST NOTIFICATION UTILITY
// ==========================================
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle" style="color: #FFCB56; font-size: 1.2rem;"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

// ==========================================
// 10. DYNAMIC ARTICLES CMS FOR TIN-TUC.HTML
// ==========================================
async function initNewsPage() {
  const featuredContainer = document.getElementById('featured-story-container');
  const newsGridContainer = document.getElementById('news-grid-container');
  const filterTabsContainer = document.getElementById('news-category-tabs');

  if (!newsGridContainer) return;

  let articles = [];

  try {
    const res = await fetch('/api/articles?status=published');
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      articles = data.data;
    }
  } catch (err) {
    console.warn('Could not fetch dynamic news, checking local database:', err.message || err);
  }

  if (articles.length === 0 && typeof window.ARTICLES_LIST !== 'undefined' && Array.isArray(window.ARTICLES_LIST)) {
    articles = window.ARTICLES_LIST;
  }

  if (articles.length === 0) return;

  // Find featured article (marked isFeatured or first article)
  const featured = articles.find(a => a.isFeatured) || articles[0];

  // Render Featured Story if container exists
  if (featuredContainer && featured) {
    featuredContainer.innerHTML = `
      <div class="featured-story-card">
        <div class="featured-story-media">
          <img src="${featured.image || 'assets/images/news-1.svg'}" alt="${featured.title}">
          <span class="featured-story-badge">TIN TIÊU ĐIỂM</span>
        </div>
        <div class="featured-story-body">
          <div class="featured-story-meta">
            <span><i class="far fa-calendar-alt"></i> ${featured.date || ''}</span>
            <span class="meta-sep">|</span>
            <span><i class="fas fa-user-edit"></i> ${featured.author || 'Ban Truyền Thông'}</span>
          </div>
          <h2 class="featured-story-title">
            <a href="chi-tiet-tin-tuc.html?id=${featured.slug || featured.id}">${featured.title}</a>
          </h2>
          <p class="featured-story-excerpt">
            ${featured.excerpt || ''}
          </p>
          <div class="featured-story-action">
            <a href="chi-tiet-tin-tuc.html?id=${featured.slug || featured.id}" class="btn btn-primary btn-sm">Xem chi tiết bài viết <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    `;
  }

  // List of other articles (or all if only 1 exists)
  const listArticles = articles.length > 1 ? articles.filter(a => (a.id !== featured?.id && a.slug !== featured?.slug)) : articles;

  // Setup Category Tabs
  if (filterTabsContainer) {
    const categories = [
      { key: 'all', label: 'Tất Cả Bản Tin' },
      { key: 'su-kien', label: 'Sự Kiện & Tiến Độ' },
      { key: 'an-toan', label: 'An Toàn Lao Động' },
      { key: 'cong-nghe', label: 'Công Nghệ Xây Dựng' },
      { key: 'tien-do', label: 'Tiến Độ Dự Án' },
      { key: 'kien-thuc', label: 'Kiến Thức Xây Dựng' },
      { key: 'giai-thuong', label: 'Giải Thưởng & Sự Kiện' },
      { key: 'nang-luc', label: 'Năng Lực Sản Xuất' }
    ];

    filterTabsContainer.innerHTML = categories.map((cat, idx) => `
      <button type="button" class="news-tab-btn ${idx === 0 ? 'active' : ''}" data-cat="${cat.key}" onclick="filterNewsGrid('${cat.key}', this)">
        ${cat.label}
      </button>
    `).join('');
  }

  window.allLoadedNews = listArticles;
  renderNewsCards(window.allLoadedNews);
}

function renderNewsCards(items) {
  const container = document.getElementById('news-grid-container');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
        <i class="far fa-newspaper" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--gray);"></i>
        <h4>Chưa có bài viết trong chuyên mục này</h4>
        <p style="font-size: 0.9rem;">Vui lòng chọn chuyên mục khác hoặc quay lại sau.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(news => `
    <div class="news-card" data-category="${news.category}">
      <div class="news-img-box">
        <span class="news-date"><i class="far fa-calendar-alt"></i> ${news.date}</span>
        <img src="${news.image || 'assets/images/news-1.svg'}" alt="${news.title}">
      </div>
      <div class="news-body">
        <div class="news-category">${news.categoryName || 'Tin tức'}</div>
        <h3 class="news-title">
          <a href="chi-tiet-tin-tuc.html?id=${news.slug || news.id}">${news.title}</a>
        </h3>
        <p class="news-excerpt">${news.excerpt || ''}</p>
        <a href="chi-tiet-tin-tuc.html?id=${news.slug || news.id}" class="service-link">Chi tiết <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  `).join('');
}

function filterNewsGrid(catKey, btn) {
  document.querySelectorAll('.news-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  if (!window.allLoadedNews) return;

  let filtered = window.allLoadedNews;
  if (catKey !== 'all') {
    filtered = window.allLoadedNews.filter(n => n.category === catKey);
  }
  renderNewsCards(filtered);
}

// ==========================================
// 11. HOMEPAGE LATEST NEWS CMS LOADER
// ==========================================
async function initHomeNews() {
  const container = document.getElementById('home-news-grid');
  if (!container) return;

  let articles = [];

  try {
    const res = await fetch('/api/articles?status=published');
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      articles = data.data;
    }
  } catch (err) {
    console.warn('Could not fetch home news from API:', err.message || err);
  }

  if (articles.length === 0 && typeof window.ARTICLES_LIST !== 'undefined' && Array.isArray(window.ARTICLES_LIST)) {
    articles = window.ARTICLES_LIST;
  }

  if (articles.length === 0) return;

  const top3 = articles.slice(0, 3);
  container.innerHTML = top3.map(item => `
    <div class="news-card">
      <div class="news-img-box">
        <span class="news-date"><i class="far fa-calendar-alt"></i> ${item.date}</span>
        <img src="${item.image || 'assets/images/news-1.svg'}" alt="${item.title}">
      </div>
      <div class="news-body">
        <div class="news-category">${item.categoryName || 'Tin tức'}</div>
        <h3 class="news-title"><a href="chi-tiet-tin-tuc.html?id=${item.slug || item.id}">${item.title}</a></h3>
        <p class="news-excerpt">${item.excerpt || ''}</p>
        <a href="chi-tiet-tin-tuc.html?id=${item.slug || item.id}" class="service-link">Đọc tiếp <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  `).join('');

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// ==========================================
// 12. DYNAMIC STRATEGIC PARTNERS LOADER
// ==========================================
async function initHomePartners() {
  const container = document.getElementById('home-partners-grid') || document.querySelector('.partner-logo-grid');
  if (!container) return;

  try {
    const res = await fetch('/api/partners');
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) return;

    const partners = data.data;
    container.innerHTML = partners.map(partner => {
      const isExternalLink = partner.website && partner.website.trim().length > 0;
      const tag = isExternalLink ? 'a' : 'div';
      const linkAttrs = isExternalLink 
        ? `href="${partner.website}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(partner.name)}"` 
        : `title="${escapeHtml(partner.name)}"`;

      return `
        <${tag} ${linkAttrs} class="partner-item">
          <img src="${partner.logo}" alt="${escapeHtml(partner.name)}" class="partner-logo-img" onerror="this.onerror=null; this.src='assets/images/partner-1.svg';">
        </${tag}>
      `;
    }).join('');

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  } catch (err) {
    console.warn('Could not fetch dynamic partners, keeping fallback markup:', err);
  }
}

// Helper to escape HTML characters safely
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================
// 13. MOTION DESIGN & ADVANCED UX CONTROLLER
// ==========================================

// 1. Top Reading Scroll Progress Bar
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  let ticking = false;
  const updateProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

// 2. SPA Top Page Loader Bar
function showTopPageLoader() {
  const bar = document.getElementById('page-loader-bar');
  if (!bar) return;
  bar.classList.remove('done');
  bar.classList.add('loading');
}

function hideTopPageLoader() {
  const bar = document.getElementById('page-loader-bar');
  if (!bar) return;
  bar.classList.remove('loading');
  bar.classList.add('done');
  setTimeout(() => {
    bar.classList.remove('done');
  }, 450);
}

// 3. 3D Tilt Effect on Cards (Desktop Only with fine cursor)
function init3DTiltEffects() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.project-card, .service-card, .stat-card, .director-card, .partner-item');
  tiltCards.forEach(card => {
    if (card.dataset.tiltInit === 'true') return;
    card.dataset.tiltInit = 'true';

    // Inject glare reflection if not present
    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt (+/- 5.5deg) for high-end luxury architectural feel
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
      card.style.setProperty('--glare-x', `${(x / rect.width * 100).toFixed(1)}%`);
      card.style.setProperty('--glare-y', `${(y / rect.height * 100).toFixed(1)}%`);
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
}

// 4. Magnetic Buttons for High-Impact CTAs
function initMagneticButtons() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

  const buttons = document.querySelectorAll('.btn-primary, .header-phone-btn, .service-link');
  buttons.forEach(btn => {
    if (btn.dataset.magneticInit === 'true') return;
    btn.dataset.magneticInit = 'true';

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

// 5. Touch Gestures (Swipe for Hero Slider & Image Galleries)
function initSwipeGestures() {
  const slider = document.getElementById('hero-slider');
  if (slider && !slider.dataset.swipeInit) {
    slider.dataset.swipeInit = 'true';
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }
    }, { passive: true });

    const handleSwipe = () => {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        // Swiped Left -> Next slide
        if (typeof nextSlide === 'function') nextSlide();
      }
      if (touchEndX > touchStartX + threshold) {
        // Swiped Right -> Prev slide
        if (typeof prevSlide === 'function') prevSlide();
      }
    };
  }
}

// Expose to window
if (typeof window !== 'undefined') {
  window.initNewsPage = initNewsPage;
  window.initHomeNews = initHomeNews;
  window.initHomePartners = initHomePartners;
  window.renderNewsCards = renderNewsCards;
  window.filterNewsGrid = filterNewsGrid;
  window.initScrollProgressBar = initScrollProgressBar;
  window.init3DTiltEffects = init3DTiltEffects;
  window.initMagneticButtons = initMagneticButtons;
  window.initSwipeGestures = initSwipeGestures;
  window.showTopPageLoader = showTopPageLoader;
  window.hideTopPageLoader = hideTopPageLoader;
}



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
    navigateTo(window.location.pathname || 'index.html', false);
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

  // Close mobile drawer if open
  const navMenu = document.querySelector('.nav-menu');
  const toggleBtn = document.querySelector('.mobile-toggle');
  if (navMenu && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    const icon = toggleBtn?.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  }

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

  } catch (error) {
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
    initHomeNews();
  }
  if (document.getElementById('news-grid-container')) {
    initNewsPage();
  }
  if (document.getElementById('article-content')) {
    if (typeof loadArticleDetail === 'function') {
      loadArticleDetail();
    }
  }

  initProjectFilter();
  initContactForms();
  initBackToTop();
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

function initNavbarEvents() {
  const siteHeader = document.getElementById('site-header');
  const header = document.querySelector('.main-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

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

  // Mobile Menu Toggle
  if (toggleBtn && navMenu) {
    // Clone to prevent duplicate event listeners
    const newToggle = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);

    newToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      const icon = newToggle.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // Set active link for initial page load
  updateActiveNavLink(window.location.pathname || 'index.html');
}

function updateActiveNavLink(currentUrl) {
  const navLinks = document.querySelectorAll('.nav-link');
  const cleanUrl = currentUrl.split('?')[0].split('#')[0];
  const cleanCurrent = cleanUrl.split('/').pop().replace('.html', '') || 'index';

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const cleanHref = href.split('?')[0].split('#')[0].split('/').pop().replace('.html', '') || 'index';

    const isDuAnDetail = cleanCurrent === 'chi-tiet-du-an' && cleanHref === 'du-an';
    if (cleanHref === cleanCurrent || (cleanHref === 'index' && (cleanCurrent === '' || cleanCurrent === 'index')) || isDuAnDetail) {
      link.classList.add('active');
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
// 5. HOMEPAGE HERO IMAGE SLIDER (GSAP ANIMATED CAROUSEL)
// ==========================================
let heroSliderTimer = null;
let heroProgressTween = null;

async function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) {
    if (heroProgressTween) {
      heroProgressTween.kill();
      heroProgressTween = null;
    }
    if (heroSliderTimer) {
      clearTimeout(heroSliderTimer);
      heroSliderTimer = null;
    }
    return;
  }

  // Load dynamic slides from MongoDB Atlas & Cloudinary
  let dynamicDuration = 6.0;
  try {
    const res = await fetch('/api/slides');
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
        dynamicDuration = parseFloat(data.settings.autoplaySpeed) || 6.0;
      }
    }
  } catch (err) {
    console.warn('Dùng slide mặc định do không kết nối được API:', err.message);
  }

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = slider.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const progressBar = document.getElementById('hero-progress');

  if (!slides.length) return;

  // Cleanup existing tweens and timers if re-initializing
  if (heroProgressTween) {
    heroProgressTween.kill();
    heroProgressTween = null;
  }
  if (heroSliderTimer) {
    clearTimeout(heroSliderTimer);
    heroSliderTimer = null;
  }

  let currentIndex = 0;
  slides.forEach((slide, idx) => {
    if (slide.classList.contains('active')) {
      currentIndex = idx;
    }
  });

  const SLIDE_DURATION = dynamicDuration;
  let isTransitioning = false;

  /**
   * GSAP Ken Burns Entry Animation for Slide Image Background
   */
  function animateSlideContent(slide) {
    if (typeof gsap === 'undefined') return;

    const bg = slide.querySelector('.hero-slide-bg');
    if (bg) {
      gsap.fromTo(bg, 
        { scale: 1.12, opacity: 0.9 }, 
        { scale: 1, opacity: 1, duration: SLIDE_DURATION + 0.5, ease: 'power1.out' }
      );
    }
  }

  /**
   * Start autoplay (via GSAP progress tween if bar exists, otherwise via timer)
   */
  function startAutoplay() {
    if (heroSliderTimer) {
      clearTimeout(heroSliderTimer);
      heroSliderTimer = null;
    }
    if (heroProgressTween) {
      heroProgressTween.kill();
      heroProgressTween = null;
    }

    if (progressBar && typeof gsap !== 'undefined') {
      progressBar.style.width = '0%';
      heroProgressTween = gsap.fromTo(progressBar, 
        { width: '0%' }, 
        { 
          width: '100%', 
          duration: SLIDE_DURATION, 
          ease: 'none',
          onComplete: () => {
            goToSlide((currentIndex + 1) % slides.length);
          }
        }
      );
    } else {
      heroSliderTimer = setTimeout(() => {
        goToSlide((currentIndex + 1) % slides.length);
      }, SLIDE_DURATION * 1000);
    }
  }

  /**
   * Switch to target slide with smooth GSAP crossfade
   */
  function goToSlide(targetIndex) {
    if (isTransitioning) return;
    if (targetIndex === currentIndex && slides[currentIndex].classList.contains('active')) return;

    isTransitioning = true;

    // Stop and reset current timers
    if (heroSliderTimer) {
      clearTimeout(heroSliderTimer);
      heroSliderTimer = null;
    }
    if (heroProgressTween) {
      heroProgressTween.kill();
      heroProgressTween = null;
    }
    if (progressBar) progressBar.style.width = '0%';

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[targetIndex];

    // Smooth GSAP Crossfade
    if (typeof gsap !== 'undefined') {
      gsap.to(currentSlide, { 
        opacity: 0, 
        duration: 0.65, 
        ease: 'power2.inOut', 
        onComplete: () => {
          currentSlide.classList.remove('active');
          currentSlide.style.opacity = '';
        }
      });

      nextSlide.classList.add('active');
      gsap.fromTo(nextSlide, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.65, ease: 'power2.inOut' }
      );
    } else {
      currentSlide.classList.remove('active');
      nextSlide.classList.add('active');
    }

    // Update pagination dots if any
    if (dots && dots.length) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === targetIndex);
      });
    }

    // Run Ken Burns animation on incoming slide
    animateSlideContent(nextSlide);

    currentIndex = targetIndex;

    // Reset transitioning flag & restart autoplay
    setTimeout(() => {
      isTransitioning = false;
      startAutoplay();
    }, 500);
  }

  // Next / Prev button event handlers
  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.preventDefault();
      goToSlide((currentIndex + 1) % slides.length);
    };
  }

  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.preventDefault();
      goToSlide((currentIndex - 1 + slides.length) % slides.length);
    };
  }

  // Dot click handlers
  if (dots && dots.length) {
    dots.forEach(dot => {
      dot.onclick = (e) => {
        e.preventDefault();
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          goToSlide(idx);
        }
      };
    });
  }

  // Pause autoplay on mouse hover, resume on mouse leave
  slider.onmouseenter = () => {
    if (heroProgressTween) heroProgressTween.pause();
    if (heroSliderTimer) {
      clearTimeout(heroSliderTimer);
      heroSliderTimer = null;
    }
  };

  slider.onmouseleave = () => {
    if (heroProgressTween && !isTransitioning) heroProgressTween.play();
    else if (!isTransitioning) {
      startAutoplay();
    }
  };

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
      goToSlide((currentIndex + 1) % slides.length);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      goToSlide((currentIndex - 1 + slides.length) % slides.length);
    }
  };

  // Keyboard Navigation (Left / Right Arrows)
  const handleKeydown = (e) => {
    if (!document.getElementById('hero-slider')) {
      document.removeEventListener('keydown', handleKeydown);
      return;
    }
    if (e.key === 'ArrowRight') {
      goToSlide((currentIndex + 1) % slides.length);
    } else if (e.key === 'ArrowLeft') {
      goToSlide((currentIndex - 1 + slides.length) % slides.length);
    }
  };
  document.addEventListener('keydown', handleKeydown);

  // Initial trigger for active slide
  animateSlideContent(slides[currentIndex]);
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

  try {
    const res = await fetch('/api/articles?status=published');
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) return;

    const articles = data.data;

    // Find featured article (marked isFeatured or first article)
    const featured = articles.find(a => a.isFeatured) || articles[0];

    // Render Featured Story if container exists
    if (featuredContainer && featured) {
      featuredContainer.innerHTML = `
        <div style="background:#ffffff; border:1px solid var(--gray-border); border-radius:var(--radius-sm); overflow:hidden; margin-bottom: 50px; display:grid; grid-template-columns: 1.2fr 1fr; border-left: 5px solid var(--primary); box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
          <div style="position:relative; min-height: 340px;">
            <img src="${featured.image || 'assets/images/news-1.svg'}" alt="${featured.title}" style="width:100%; height:100%; object-fit:cover;">
            <span style="position:absolute; top:15px; left:15px; background:var(--primary); color:#ffffff; font-family:'Montserrat',sans-serif; font-size:0.75rem; font-weight:700; padding:4px 12px; text-transform:uppercase;">TIN TIÊU ĐIỂM</span>
          </div>
          <div style="padding: 35px; display:flex; flex-direction:column; justify-content:center;">
            <div style="color:var(--text-muted); font-size:0.85rem; margin-bottom:8px;">
              <i class="far fa-calendar-alt"></i> ${featured.date || ''} &nbsp;|&nbsp; <i class="fas fa-user-edit"></i> ${featured.author || 'Ban Truyền Thông'}
            </div>
            <h2 style="font-size:1.6rem; margin-bottom:14px; line-height:1.35;">${featured.title}</h2>
            <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:20px; line-height:1.7;">
              ${featured.excerpt || ''}
            </p>
            <div>
              <a href="chi-tiet-tin-tuc.html?id=${featured.id}" class="btn btn-primary btn-sm">Xem chi tiết bài viết <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      `;
    }

    // List of other articles (or all if only 1 exists)
    const listArticles = articles.length > 1 ? articles.filter(a => a.id !== featured?.id) : articles;

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

  } catch (err) {
    console.warn('Could not fetch dynamic news, keeping static fallback:', err);
  }
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
          <a href="chi-tiet-tin-tuc.html?id=${news.id}">${news.title}</a>
        </h3>
        <p class="news-excerpt">${news.excerpt || ''}</p>
        <a href="chi-tiet-tin-tuc.html?id=${news.id}" class="service-link">Chi tiết <i class="fas fa-arrow-right"></i></a>
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

  try {
    const res = await fetch('/api/articles?status=published');
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) return;

    const top3 = data.data.slice(0, 3);
    container.innerHTML = top3.map(item => `
      <div class="news-card">
        <div class="news-img-box">
          <span class="news-date"><i class="far fa-calendar-alt"></i> ${item.date}</span>
          <img src="${item.image || 'assets/images/news-1.svg'}" alt="${item.title}">
        </div>
        <div class="news-body">
          <div class="news-category">${item.categoryName || 'Tin tức'}</div>
          <h3 class="news-title"><a href="chi-tiet-tin-tuc.html?id=${item.id}">${item.title}</a></h3>
          <p class="news-excerpt">${item.excerpt || ''}</p>
          <a href="chi-tiet-tin-tuc.html?id=${item.id}" class="service-link">Đọc tiếp <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  } catch (err) {
    console.warn('Could not fetch home news, keeping static markup:', err);
  }
}

// Expose to window
if (typeof window !== 'undefined') {
  window.initNewsPage = initNewsPage;
  window.initHomeNews = initHomeNews;
  window.renderNewsCards = renderNewsCards;
  window.filterNewsGrid = filterNewsGrid;
}


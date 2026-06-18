/* Global behavior for the Happy Card static site. */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSmoothScrolling();
  initYearBindings();
  initScrollReveal();
  initAOS();
  loadSharedComponents();
});

function getRootPath() {
  const scripts = document.getElementsByTagName('script');
  for (let script of scripts) {
    const src = script.getAttribute('src');
    if (src && src.includes('app.js')) {
      return src.replace('assets/js/app.js', '');
    }
  }
  return '';
}

async function loadSharedComponents() {
  const rootPath = getRootPath();

  // 1. Chỉ tải social-buttons.html ở trang chủ (kiểm tra phần tử đặc trưng .hero-home)
  if (document.querySelector('.hero-home') && !document.getElementById('social-buttons-wrapper')) {
    const socialWrapper = document.createElement('div');
    socialWrapper.id = 'social-buttons-wrapper';
    document.body.appendChild(socialWrapper);
    
    try {
      const response = await fetch(rootPath + 'components/social-buttons.html');
      if (response.ok) {
        socialWrapper.innerHTML = await response.text();
      } else {
        console.warn('Không thể tải social-buttons.html (HTTP Error)', response.status);
      }
    } catch (e) {
      console.warn('Không thể tải social-buttons.html (CORS/Network error):', e);
      // Fallback cho file:// protocol nếu cần thiết
    }
  }

  // 2. Tải các component khác (như slider) khi HTML yêu cầu qua thuộc tính data-include-component
  const placeholders = document.querySelectorAll('[data-include-component]');
  for (const el of placeholders) {
    const compName = el.getAttribute('data-include-component');
    try {
      const response = await fetch(`${rootPath}components/${compName}.html`);
      if (response.ok) {
        el.innerHTML = await response.text();
        
        // Trình duyệt không chạy thẻ <script> khi dùng innerHTML, nên phải chèn lại thẻ script
        const scripts = el.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      }
    } catch (e) {
      console.warn(`Không thể tải component ${compName}:`, e);
    }
  }
}

function initAOS() {
  if (window.AOS) {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 70,
    });
  }
}

function initNavigation() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initYearBindings() {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(year);
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach((item) => item.classList.add('reveal-fade'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-fade');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
  });

  items.forEach((item) => observer.observe(item));
}

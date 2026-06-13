/* Template-specific effects: Swiper, countdown, hearts, and fireworks. */
document.addEventListener('DOMContentLoaded', () => {
  initSwiper();
  initWeddingCountdown();
  initLoveHearts();
  initNewYearFireworks();
});

function initSwiper() {
  const containers = document.querySelectorAll('.template-swiper');
  if (!window.Swiper || containers.length === 0) {
    return;
  }

  containers.forEach((container) => {
    new Swiper(container, {
      loop: true,
      speed: 850,
      spaceBetween: 18,
      autoplay: {
        delay: 3300,
        disableOnInteraction: false,
      },
      pagination: {
        el: container.querySelector('.swiper-pagination'),
        clickable: true,
      },
      navigation: {
        nextEl: container.querySelector('.swiper-button-next'),
        prevEl: container.querySelector('.swiper-button-prev'),
      },
    });
  });
}

function initWeddingCountdown() {
  const timer = document.querySelector('[data-countdown]');
  if (!timer) {
    return;
  }

  const target = new Date('2027-02-14T18:00:00');

  const update = () => {
    const diff = Math.max(target.getTime() - Date.now(), 0);
    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    setCountdownValue('days', days);
    setCountdownValue('hours', hours);
    setCountdownValue('minutes', minutes);
    setCountdownValue('seconds', secs);
  };

  const setCountdownValue = (name, value) => {
    const node = timer.querySelector(`[data-countdown-${name}]`);
    if (node) {
      node.textContent = String(value).padStart(2, '0');
    }
  };

  update();
  window.setInterval(update, 1000);
}

function initLoveHearts() {
  const field = document.querySelector('[data-heart-field]');
  if (!field) {
    return;
  }

  const createHeart = () => {
    const heart = document.createElement('span');
    heart.className = 'heart-particle';
    heart.innerHTML = '<i class="fa-solid fa-heart"></i>';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = `${20 + Math.random() * 22}%`;
    heart.style.fontSize = `${12 + Math.random() * 20}px`;
    heart.style.animationDuration = `${4 + Math.random() * 3}s`;
    field.appendChild(heart);

    window.setTimeout(() => heart.remove(), 7000);
  };

  for (let index = 0; index < 18; index += 1) {
    window.setTimeout(createHeart, index * 180);
  }

  window.setInterval(createHeart, 900);
}

function initNewYearFireworks() {
  const field = document.querySelector('[data-fireworks-field]');
  if (!field) {
    return;
  }

  const createFirework = () => {
    const firework = document.createElement('span');
    firework.className = 'firework';
    firework.style.left = `${12 + Math.random() * 76}%`;
    firework.style.top = `${18 + Math.random() * 58}%`;
    firework.style.animationDuration = `${0.9 + Math.random() * 0.8}s`;
    field.appendChild(firework);

    window.setTimeout(() => firework.remove(), 1500);
  };

  for (let index = 0; index < 8; index += 1) {
    window.setTimeout(createFirework, index * 450);
  }

  window.setInterval(createFirework, 1200);
  field.addEventListener('click', createFirework);
}

/* ============================================
   Al-Khawarizmi — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // 1. NAVBAR — Scroll & Mobile Toggle
  // ========================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close nav on link click (mobile)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // ========================================
  // 2. SMOOTH SCROLL — Active nav highlight
  // ========================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinkItems = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navLinkItems.forEach(link => {
      link.style.color = '';
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) {
        link.style.color = 'var(--gold-light)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ========================================
  // 3. SCROLL REVEAL (AOS-like)
  // ========================================
  const aosElements = document.querySelectorAll('[data-aos]');
  const karyaCards = document.querySelectorAll('.karya-card');
  const warisanItems = document.querySelectorAll('.warisan-item');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  aosElements.forEach(el => revealObserver.observe(el));

  const karyaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('aos-visible');
        }, Array.from(karyaCards).indexOf(entry.target) * 100);
      }
    });
  }, { threshold: 0.1 });

  karyaCards.forEach(card => karyaObserver.observe(card));
  warisanItems.forEach(item => revealObserver.observe(item));

  // ========================================
  // 4. COUNTER ANIMATION (Warisan section)
  // ========================================
  const counters = document.querySelectorAll('.warisan-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, 0, target, 2000);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.floor(eased * (end - start) + start);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = end.toLocaleString();
      }
    };
    requestAnimationFrame(update);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // ========================================
  // 5. GALERI LIGHTBOX
  // ========================================
  const galeriItems = document.querySelectorAll('.galeri-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  let currentGaleriIndex = 0;
  const galeriData = [];

  galeriItems.forEach((item, i) => {
    const imgEl = item.querySelector('.galeri-img-real');
    const title = item.dataset.title;
    const overlaySpan = item.querySelector('.galeri-overlay span');
    const overlayP = item.querySelector('.galeri-overlay p');
    galeriData.push({
      title: title,
      src: imgEl ? imgEl.getAttribute('src') : '',
      alt: imgEl ? imgEl.getAttribute('alt') : '',
      label: overlaySpan ? overlaySpan.textContent : '',
      desc: overlayP ? overlayP.textContent : ''
    });

    item.addEventListener('click', () => {
      currentGaleriIndex = i;
      openLightbox(i);
    });
  });

  function openLightbox(index) {
    const data = galeriData[index];
    // Clear previous content
    lightboxImg.innerHTML = '';
    const img = document.createElement('img');
    img.src = data.src;
    img.alt = data.alt;
    img.style.cssText = 'width:100%; height:100%; object-fit:contain; border-radius:4px;';
    lightboxImg.appendChild(img);
    lightboxCaption.textContent = data.title;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', () => {
    currentGaleriIndex = (currentGaleriIndex - 1 + galeriData.length) % galeriData.length;
    openLightbox(currentGaleriIndex);
  });

  lightboxNext.addEventListener('click', () => {
    currentGaleriIndex = (currentGaleriIndex + 1) % galeriData.length;
    openLightbox(currentGaleriIndex);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // ========================================
  // 6. QUOTES CAROUSEL
  // ========================================
  const quoteSlides = document.querySelectorAll('.quote-slide');
  const dots = document.querySelectorAll('.dot');
  const quotePrev = document.getElementById('quotePrev');
  const quoteNext = document.getElementById('quoteNext');

  let currentQuote = 0;
  let autoQuoteTimer = null;

  function showQuote(index) {
    quoteSlides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    quoteSlides[index].classList.add('active');
    dots[index].classList.add('active');
    currentQuote = index;
  }

  function nextQuote() {
    const next = (currentQuote + 1) % quoteSlides.length;
    showQuote(next);
  }

  function prevQuote() {
    const prev = (currentQuote - 1 + quoteSlides.length) % quoteSlides.length;
    showQuote(prev);
  }

  function startAutoQuote() {
    stopAutoQuote();
    autoQuoteTimer = setInterval(nextQuote, 5000);
  }

  function stopAutoQuote() {
    if (autoQuoteTimer) {
      clearInterval(autoQuoteTimer);
      autoQuoteTimer = null;
    }
  }

  quoteNext.addEventListener('click', () => {
    nextQuote();
    startAutoQuote(); // restart timer
  });

  quotePrev.addEventListener('click', () => {
    prevQuote();
    startAutoQuote();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showQuote(i);
      startAutoQuote();
    });
  });

  startAutoQuote();

  // ========================================
  // 7. PARALLAX EFFECT for Hero ornaments
  // ========================================
  const heroOrnaments = document.querySelectorAll('.hero-ornament');
  const medallion = document.querySelector('.medallion');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroOrnaments.forEach((orn, i) => {
        const speed = i % 2 === 0 ? 0.15 : 0.1;
        orn.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  });

  // ========================================
  // 8. HOVER PARTICLE EFFECT on Karya Cards
  // ========================================
  karyaCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ========================================
  // 9. BISMILLAH STAR DECORATION
  // ========================================
  const bismillah = document.querySelector('.bismillah');
  if (bismillah) {
    const stars = ['✦', '✧', '⁕', '✦'];
    stars.forEach((star, i) => {
      const el = document.createElement('span');
      el.textContent = star;
      el.style.cssText = `
        position: absolute;
        color: var(--gold);
        font-size: ${8 + Math.random() * 8}px;
        opacity: ${0.3 + Math.random() * 0.4};
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        pointer-events: none;
        animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate;
        animation-delay: ${Math.random() * 2}s;
      `;
    });
  }

  // ========================================
  // 10. TIMELINE: staggered reveal
  // ========================================
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('aos-visible');
        }, 100);
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  timelineItems.forEach(item => timelineObserver.observe(item));

  // ========================================
  // 11. PAGE LOAD: subtle entrance
  // ========================================
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 50);
  });

  // ========================================
  // 12. BACK TO TOP on footer click
  // ========================================
  const footerTitle = document.querySelector('.footer-title');
  if (footerTitle) {
    footerTitle.style.cursor = 'pointer';
    footerTitle.title = 'Kembali ke atas';
    footerTitle.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================================
  // 13. ACTIVE SECTION HIGHLIGHT in Timeline dots
  // ========================================
  function addTwinkleStyle() {
    if (!document.getElementById('twinkle-style')) {
      const style = document.createElement('style');
      style.id = 'twinkle-style';
      style.textContent = `
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(0.8); }
          to { opacity: 0.8; transform: scale(1.2); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  addTwinkleStyle();

  console.log('🕌 Al-Khawarizmi Website — Loaded Successfully');
  console.log('خوارزمي — الجبر والمقابلة');
});

/**
 * SALONI YOGI (JAISHREE MODEL) - PORTFOLIO INTERACTION ENGINE
 * Vanilla JavaScript (ES6+)
 * High-End Fashion Editorial Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavigation();
  initGalleryFilter();
  initLightbox();
  initScrollEffects();
  initCompCardPrint();
  initBackToTop();
  initBookingForm();
});

/* --------------------------------------------------------------------------
   1. CUSTOM EDITORIAL CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const circle = document.getElementById('cursorCircle');

  if (!dot || !circle) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let circleX = mouseX;
  let circleY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth lagging circle follower
  function animateCircle() {
    circleX += (mouseX - circleX) * 0.15;
    circleY += (mouseY - circleY) * 0.15;
    circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    requestAnimationFrame(animateCircle);
  }
  animateCircle();

  // Hover expansion on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .gallery-item, input, select, textarea');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      circle.style.width = '55px';
      circle.style.height = '55px';
      circle.style.borderColor = 'rgba(184, 151, 104, 0.9)';
      circle.style.backgroundColor = 'rgba(184, 151, 104, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
      circle.style.width = '32px';
      circle.style.height = '32px';
      circle.style.borderColor = 'rgba(184, 151, 104, 0.5)';
      circle.style.backgroundColor = 'transparent';
    });
  });
}

/* --------------------------------------------------------------------------
   2. HEADER & MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle drawer
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. GALLERY CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hide');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hide');
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. FULLSCREEN EDITORIAL LIGHTBOX
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightbox || !lightboxImg) return;

  let visibleGalleryItems = [];
  let currentIndex = 0;

  function updateVisibleItems() {
    visibleGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not(.hide)'));
  }

  function openLightbox(index) {
    updateVisibleItems();
    if (visibleGalleryItems.length === 0) return;

    currentIndex = index;
    const targetItem = visibleGalleryItems[currentIndex];
    const imgSrc = targetItem.getAttribute('data-src');
    const caption = targetItem.getAttribute('data-caption');

    lightboxImg.src = imgSrc;
    lightboxCaption.innerHTML = caption || '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${visibleGalleryItems.length}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    updateVisibleItems();
    currentIndex = (currentIndex + 1) % visibleGalleryItems.length;
    openLightbox(currentIndex);
  }

  function showPrevImage() {
    updateVisibleItems();
    currentIndex = (currentIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
    openLightbox(currentIndex);
  }

  // Attach click listener to each gallery item
  const allItems = document.querySelectorAll('.gallery-item');
  allItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      updateVisibleItems();
      const visibleIndex = visibleGalleryItems.indexOf(item);
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex);
      }
    });
  });

  // Modal controls
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-image-wrapper')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });
}

/* --------------------------------------------------------------------------
   5. SCROLL REVEAL EFFECTS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const revealElements = document.querySelectorAll('.editorial-header, .spec-card, .exp-card, .skill-item-card, .comp-card-wrapper, .contact-card-highlight, .contact-form-panel');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(35px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   6. COMP CARD PRINTING / EXPORT
   -------------------------------------------------------------------------- */
function initCompCardPrint() {
  const printBtn = document.getElementById('printCompCardBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* --------------------------------------------------------------------------
   7. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   8. DIRECT BOOKING FORM SUBMISSION
   -------------------------------------------------------------------------- */
function initBookingForm() {
  window.handleBookingSubmit = function(event) {
    event.preventDefault();
    const form = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('formStatusMsg');

    const clientName = document.getElementById('clientName').value;
    const projectType = document.getElementById('projectType').value;

    // Simulate sending state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Processing Request...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      statusMsg.className = 'form-status-msg success';
      statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${clientName}</strong>! Your inquiry for <strong>${projectType}</strong> has been received. Our agency booking team will review your project details and respond promptly.`;

      form.reset();

      setTimeout(() => {
        statusMsg.style.display = 'none';
      }, 10000);
    }, 1200);

    return false;
  };
}

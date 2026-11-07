/* --------------------------------------------------------------------------
   LOVE MEMORY GALLERY & LIGHTBOX POPUP CONTROLLER
   Images are loaded asynchronously via ImageProvider.
   Gallery HTML uses data-image-key attributes instead of src paths.
   -------------------------------------------------------------------------- */

const GalleryController = (function() {
  'use strict';

  let lightboxModal, lightboxImg, lightboxTitle, lightboxDesc, closeBtn;
  let prevBtn, nextBtn, counterEl;
  let activeImages = [];
  let activeIndex = 0;

  /**
   * Hydrates all gallery <img> elements by resolving their data-image-key
   * through ImageProvider. Non-blocking — errors are logged silently.
   */
  async function hydrateImages() {
    const galleryImgs = document.querySelectorAll('.gallery-img[data-image-key]');
    const provider = (typeof ImageProvider !== 'undefined' ? ImageProvider : (typeof window !== 'undefined' ? window.ImageProvider : null));

    const tasks = Array.from(galleryImgs).map(async (img) => {
      const key = img.dataset.imageKey;
      if (!key || (img.src && img.src.startsWith('blob:'))) return;

      try {
        if (key.startsWith('./') || key.startsWith('/') || key.startsWith('http')) {
          img.src = key;
          img.classList.add('loaded');
          return;
        }
        if (provider && typeof provider.get === 'function') {
          const objectUrl = await provider.get(key);
          if (objectUrl) {
            img.src = objectUrl;
            img.classList.add('loaded');
          }
        }
      } catch (err) {
        console.error(`[Gallery] Failed to load image "${key}":`, err);
      }
    });

    await Promise.all(tasks);
  }

  async function resolveImageSrc(keyOrUrl) {
    if (!keyOrUrl) return '';
    if (keyOrUrl.startsWith('blob:') || keyOrUrl.startsWith('http') || keyOrUrl.startsWith('data:')) {
      return keyOrUrl;
    }
    const provider = (typeof ImageProvider !== 'undefined' ? ImageProvider : (typeof window !== 'undefined' ? window.ImageProvider : null));
    if (provider && typeof provider.get === 'function') {
      try {
        const objectUrl = await provider.get(keyOrUrl);
        if (objectUrl) return objectUrl;
      } catch (err) {
        console.error('[Gallery] Failed to resolve key:', keyOrUrl, err);
      }
    }
    return keyOrUrl;
  }

  async function setLightboxImage(index) {
    if (!activeImages.length) return;
    activeIndex = (index + activeImages.length) % activeImages.length;
    const raw = activeImages[activeIndex];
    const currentSrc = await resolveImageSrc(raw);

    if (lightboxImg) {
      lightboxImg.src = currentSrc;
      lightboxImg.style.display = 'block';
    }

    if (counterEl) {
      if (activeImages.length > 1) {
        counterEl.style.display = 'block';
        counterEl.textContent = `Ảnh ${activeIndex + 1} / ${activeImages.length}`;
      } else {
        counterEl.style.display = 'none';
      }
    }

    if (prevBtn && nextBtn) {
      const showNav = activeImages.length > 1 ? 'flex' : 'none';
      prevBtn.style.display = showNav;
      nextBtn.style.display = showNav;
    }
  }

  function init() {
    lightboxModal = document.getElementById('lightbox-modal');
    lightboxImg   = document.getElementById('lightbox-img');
    lightboxTitle = document.getElementById('lightbox-title');
    lightboxDesc  = document.getElementById('lightbox-desc');
    closeBtn      = document.getElementById('lightbox-close');
    prevBtn       = document.getElementById('lightbox-prev');
    nextBtn       = document.getElementById('lightbox-next');
    counterEl     = document.getElementById('lightbox-counter');

    if (lightboxModal && lightboxModal.parentNode !== document.body) {
      document.body.appendChild(lightboxModal);
    }

    const cards = document.querySelectorAll('.gallery-card');

    cards.forEach(card => {
      // 3D Card Parallax Tilt Effect
      card.addEventListener('mousemove', (e) => {
        const rect     = card.getBoundingClientRect();
        const x        = e.clientX - rect.left - rect.width / 2;
        const y        = e.clientY - rect.top - rect.height / 2;
        const rotateX  = (-y / rect.height) * 20;
        const rotateY  = (x / rect.width) * 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });

      // Lightbox Click Event
      card.addEventListener('click', async () => {
        const img   = card.querySelector('.gallery-img');
        const title = card.querySelector('.gallery-card-title, .placeholder-title');
        const desc  = card.querySelector('.gallery-card-desc, .placeholder-desc');

        if (lightboxModal) {
          const rawImages = card.dataset.images;
          if (rawImages) {
            activeImages = rawImages.split(',').map(s => s.trim()).filter(Boolean);
          } else if (img && img.dataset.imageKey) {
            activeImages = [img.dataset.imageKey];
          } else if (img && img.src && !img.src.startsWith('data:image/svg')) {
            activeImages = [img.src];
          } else {
            activeImages = [];
          }

          if (activeImages.length > 0) {
            if (lightboxTitle) lightboxTitle.textContent = title ? title.textContent : '';
            if (lightboxDesc)  lightboxDesc.textContent  = desc  ? desc.textContent  : '';
            await setLightboxImage(0);
            openLightbox();
          } else {
            // Placeholder state
            if (lightboxImg) {
              lightboxImg.removeAttribute('src');
              lightboxImg.style.display = 'none';
            }
            if (counterEl) counterEl.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (lightboxTitle) lightboxTitle.textContent = title ? title.textContent : 'Khung Ký Ức';
            if (lightboxDesc)  lightboxDesc.textContent  = desc ? desc.textContent : 'Khoảnh khắc ngọt ngào của hai đứa mình ♥';
            openLightbox();
          }
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setLightboxImage(activeIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setLightboxImage(activeIndex + 1);
      });
    }

    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft' && activeImages.length > 1) {
        setLightboxImage(activeIndex - 1);
      } else if (e.key === 'ArrowRight' && activeImages.length > 1) {
        setLightboxImage(activeIndex + 1);
      }
    });
  }

  function openLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      document.body.classList.add('lightbox-active');
      if (window.AudioEngine && typeof window.AudioEngine.playSound === 'function') {
        window.AudioEngine.playSound('open');
      }
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.classList.remove('lightbox-active');
      if (lightboxImg) {
        lightboxImg.style.display = 'block';
      }
    }
  }

  async function openPhoto(src, title, desc, images) {
    if (!lightboxModal) {
      lightboxModal = document.getElementById('lightbox-modal');
      lightboxImg   = document.getElementById('lightbox-img');
      lightboxTitle = document.getElementById('lightbox-title');
      lightboxDesc  = document.getElementById('lightbox-desc');
      prevBtn       = document.getElementById('lightbox-prev');
      nextBtn       = document.getElementById('lightbox-next');
      counterEl     = document.getElementById('lightbox-counter');
    }
    if (!lightboxModal) return;

    if (images && Array.isArray(images) && images.length > 0) {
      activeImages = images;
    } else if (src && !src.startsWith('data:image/svg')) {
      activeImages = [src];
    } else {
      activeImages = [];
    }

    if (activeImages.length > 0) {
      if (lightboxTitle) lightboxTitle.textContent = title || '';
      if (lightboxDesc)  lightboxDesc.textContent  = desc  || '';
      await setLightboxImage(0);
    } else {
      if (lightboxImg) {
        lightboxImg.removeAttribute('src');
        lightboxImg.style.display = 'none';
      }
      if (counterEl) counterEl.style.display = 'none';
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (lightboxTitle) lightboxTitle.textContent = title || 'Khung Ký Ức';
      if (lightboxDesc)  lightboxDesc.textContent  = desc || 'Khoảnh khắc ngọt ngào của hai đứa mình ♥';
    }
    openLightbox();
  }

  const api = {
    init,
    hydrateImages,
    open: openPhoto,
    close: closeLightbox
  };
  if (typeof window !== 'undefined') window.GalleryController = api;
  return api;
})();

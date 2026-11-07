/* --------------------------------------------------------------------------
   SHARE - DOCK BUTTON & QR CARD MODAL
   Opens a small dialog with the QR card (scan from another phone), a native
   share-sheet button where supported, copy-link and download-card actions.
   -------------------------------------------------------------------------- */

const ShareController = (function() {
  'use strict';

  function getShareUrl() {
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      return window.location.origin + window.location.pathname;
    }
    return 'https://ngimnee.github.io/milove/';
  }

  const SHARE_TITLE = 'Trâm iuu — Sinh Nhật & 2000 Ngày Yêu Nhau';
  const SHARE_TEXT = 'Món quà đặc biệt dành cho sinh nhật bà chã iuu và hành trình 2000 ngày bên nhau 💌✨';

  let modal = null;
  let entryBtn = null;
  let closeBtn = null;
  let copyBtn = null;
  let copyResetTimer = null;

  function init() {
    modal = document.getElementById('share-modal');
    entryBtn = document.getElementById('share-entry-btn');
    closeBtn = document.getElementById('share-close-btn');
    copyBtn = document.getElementById('share-copy-btn');
    const nativeBtn = document.getElementById('share-native-btn');

    if (!modal || !entryBtn) return;

    entryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      open();
    });

    if (closeBtn) closeBtn.addEventListener('click', close);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) close();
    });

    // Native share sheet (Zalo, Messenger, ...) only exists on some browsers, mostly mobile
    if (nativeBtn && typeof navigator.share === 'function') {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', shareNative);
    }

    if (copyBtn) copyBtn.addEventListener('click', copyLink);
  }

  function isOpen() {
    return modal && modal.classList.contains('active');
  }

  function open() {
    if (isOpen()) return;
    playSound('open');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    SmoothScrollEngine.lock();
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!isOpen()) return;
    playSound('click');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    SmoothScrollEngine.unlock();
    entryBtn.focus();
  }

  async function shareNative() {
    playSound('click');
    const shareUrl = getShareUrl();
    try {
      await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: shareUrl });
    } catch (err) {
      // AbortError = the viewer closed the share sheet; nothing to do
      if (err && err.name !== 'AbortError') copyLink();
    }
  }

  async function copyLink() {
    playSound('click');
    const shareUrl = getShareUrl();
    const label = copyBtn.querySelector('.share-action-label');
    const icon = copyBtn.querySelector('.share-action-icon i');
    try {
      await navigator.clipboard.writeText(shareUrl);
      label.textContent = 'Đã sao chép!';
      icon.className = 'fas fa-check';
      copyBtn.classList.add('copied');
    } catch (err) {
      window.prompt('Sao chép liên kết:', shareUrl);
    }
    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      label.textContent = 'Sao chép liên kết';
      icon.className = 'fas fa-link';
      copyBtn.classList.remove('copied');
    }, 2000);
  }

  function playSound(name) {
    if (window.AudioEngine && typeof window.AudioEngine.playSound === 'function') {
      window.AudioEngine.playSound(name);
    }
  }

  return {
    init,
    open,
    close
  };
})();

/* --------------------------------------------------------------------------
   ROMANTIC QUOTES & WISHES GENERATOR
   -------------------------------------------------------------------------- */

const QuotesEngine = (function() {
  'use strict';

  const ROMANTIC_QUOTES = [
    "2000 ngày bên nhau — 2000 lần mỗi sớm mai thức dậy, anh thầm cảm ơn vì đã có Em trong đời.",
    "Chúc mừng sinh nhật cô gái anh yêu nhất. Cảm ơn em đã sinh ra và bước vào cuộc đời anh, biến những ngày bình thường thành những chương kỷ niệm rực rỡ.",
    "Em không cần phải trở thành ai khác để được yêu thương. Chỉ cần em là chính em, đã là món quà quý giá nhất đối với anh.",
    "2000 ngày đã đi qua, tình yêu không chỉ là những khoảnh khắc lãng mạn, mà là từng ngày mình cùng lắng nghe, cùng bao dung và chọn ở bên nhau.",
    "Tuổi mới chúc em luôn an yên, nụ cười luôn rạng rỡ, và hãy nhớ rằng dù thế nào đi nữa, vòng tay anh vẫn luôn là chốn bình yên của em.",
    "Chúng mình đã cùng nhau đi qua 2000 ngày. Những chương tiếp theo phía trước, người duy nhất anh muốn nắm tay viết tiếp vẫn mãi là em.",
    "Cảm ơn em vì đã cùng anh tạo nên 2000 ngày tuyệt diệu. Happy Birthday & Happy 2000 Days of Us!"
  ];

  let quoteTextEl, nextBtn;
  let currentIndex = 0;
  let isAnimating = false;

  function init() {
    quoteTextEl = document.getElementById('quote-text');
    nextBtn = document.getElementById('quote-next-btn');

    if (!quoteTextEl || !nextBtn) return;

    displayQuote(currentIndex);

    nextBtn.addEventListener('click', () => {
      if (isAnimating) return;
      AudioEngine.playSound('click');
      MeteorEngine.triggerManual();
      changeQuote();
    });
  }

  function changeQuote() {
    isAnimating = true;
    quoteTextEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    quoteTextEl.style.opacity = '0';
    quoteTextEl.style.transform = 'translateY(10px)';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % ROMANTIC_QUOTES.length;
      displayQuote(currentIndex);
      quoteTextEl.style.opacity = '1';
      quoteTextEl.style.transform = 'translateY(0)';
      isAnimating = false;
    }, 420);
  }

  function displayQuote(index) {
    if (quoteTextEl) {
      quoteTextEl.textContent = `"${ROMANTIC_QUOTES[index]}"`;
    }
  }

  return {
    init
  };
})();

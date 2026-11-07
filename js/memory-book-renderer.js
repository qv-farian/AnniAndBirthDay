/* --------------------------------------------------------------------------
   MEMORY BOOK - RENDERER MODULE
   Dynamic DOM creation for the 3D Leather Album & Smart Image Preloading.
   Supports multiple photos per memory page (1, 2, 3, 4 photos or placeholder).
   Integrates with Lightbox popup for full-screen photo zooming.
   -------------------------------------------------------------------------- */

const MemoryBookRenderer = (function () {
  'use strict';

  // Album Data Pages Definition (Including Cover Front & Cover Back)
  // Each memory page has its corresponding photos from assets/images/memories/
  const PAGES_DATA = [
    {
      type: 'cover-front',
      title: 'MiLove',
      subtitle: 'Kỷ Niệm 2000 Ngày & Sinh Nhật Bã chã iuu',
      date: '17.05.2021 — 2000 Ngày',
      description: 'Chạm nút tiếp theo để mở trang đầu tiên'
    },
    {
      type: 'memory',
      title: 'Những Ngày Đầu Cấp 3 Ngồi Cạnh Nhau',
      date: 'Thanh Xuân Bắt Đầu',
      images: [
        './assets/images/memories/1.png'
      ],
      description: 'Những ngày đầu cấp 3 gặp em, hai đứa được xếp ngồi cạnh nhau. Từng ánh mắt, nụ cười ngô nghê thuở ấy chính là lúc hạt mầm tình yêu đầu tiên bắt đầu chớm nở.'
    },
    {
      type: 'memory',
      title: 'Lần Đầu Tiên Anh Chở Em Đi Chơi',
      date: 'Đêm Trung Thu Kỷ Niệm',
      images: [
        './assets/images/memories/2.1.png',
        './assets/images/memories/2.2.png'
      ],
      description: 'Dịp Trung thu năm ấy, dù đi cùng cả nhóm bạn nhưng đây là lần đầu tiên anh lấy hết can đảm chở em sau xe. Cảm giác bối rối, ngập ngừng mà tim đập rộn ràng suốt cả dọc đường.'
    },
    {
      type: 'memory',
      title: 'Những Đêm Call Chung Học Bài',
      date: 'Từng Giờ Khắc Êm Đềm',
      images: [
        './assets/images/memories/3.1.png',
        './assets/images/memories/3.2.png'
      ],
      description: 'Những đêm bật call cùng nhau học bài thâu đêm, cùng giải từng bài toán, động viên nhau qua màn hình điện thoại... Có em đồng hành, áp lực thi cử bỗng hóa ngọt ngào.'
    },
    {
      type: 'memory',
      title: 'Cùng Nhau Đi Học Mỗi Ngày',
      date: 'Con Đường Thân Quen',
      images: [
        './assets/images/memories/4.1.png',
        './assets/images/memories/4.2.png',
        './assets/images/memories/4.3.png'
      ],
      description: 'Mỗi sớm mai đến lớp, con đường đi học quen thuộc trở nên rực rỡ và mong chờ hơn bao giờ hết vì ở đó luôn có hình bóng người anh thương.'
    },
    {
      type: 'memory',
      title: 'Những Buổi Hẹn hò năm cấp 3',
      date: 'Góc Phố Kỷ Niệm',
      images: [
        './assets/images/memories/5.1.png',
        './assets/images/memories/5.2.png',
        './assets/images/memories/5.3.png'
      ],
      description: 'Những buổi chiều tan trường hẹn hò, cùng em rong ruổi khắp phố phường trên con xe 50 nhỏ bé của anh. Chiếc xe chậm rãi chở đầy ắp tiếng cười và những câu chuyện không bao giờ hết.'
    },
    {
      type: 'memory',
      title: 'Chúng Mình Đi Chơi Ở Vincom',
      date: 'Những Ngày Vui Rộn Rã',
      images: [
        './assets/images/memories/6.1.png',
        './assets/images/memories/6.2.png'
      ],
      description: 'Những buổi chiều cùng em dạo quanh Vincom, ngắm nghía đồ xinh, ăn những món em thích và lưu giữ những khoảnh khắc lí lắc, đáng yêu nhất của hai đứa.'
    },
    {
      type: 'memory',
      title: 'Những Lần Đầu Tiên Đi Xem Phim Cùng Nhau',
      date: 'Khoảnh Khắc Ngại Ngùng',
      images: [
        './assets/images/memories/7.1.png',
        './assets/images/memories/7.2.png'
      ],
      description: 'Lần đầu tiên hai đứa cùng ngồi cạnh nhau trong rạp phim, ánh đèn mờ ảo, ngập ngừng chẳng dám nắm tay nhưng trong lòng thì ngập tràn bối rối và hạnh phúc.'
    },
    {
      type: 'memory',
      title: 'Lần Đầu Tiên Đón Sinh Nhật Anh Cùng Nhau',
      date: 'Sinh Nhật Đầu Tiên Bên Em',
      images: [
        './assets/images/memories/8.png'
      ],
      description: 'Sinh nhật đầu tiên của anh kể từ khi hai đứa yêu nhau. Cảm giác hạnh phúc và ấm áp ngập tràn khi nhận được những lời chúc ngọt ngào và sự quan tâm dịu dàng từ người con gái anh yêu.'
    },
    {
      type: 'memory',
      title: 'Lần Thứ 2 Đón Sinh Nhật Của Em',
      date: 'Sinh Nhật Tuổi Mới Bên Nhau',
      images: [
        './assets/images/memories/9.png'
      ],
      description: 'Năm thứ hai được cùng em thổi nến sinh nhật. Cảm ơn em vì đã lớn lên thật dịu dàng và tiếp tục chọn anh làm người đồng hành trong tuổi mới.'
    },
    {
      type: 'memory',
      title: 'Giải Bóng Chuyền Lớp 12',
      date: 'Nhiệt Huyết Tuổi Trẻ',
      images: [
        './assets/images/memories/10.1.png',
        './assets/images/memories/10.2.png'
      ],
      description: 'Những trận bóng chuyền nảy lửa năm lớp 12, có tiếng reo hò của bạn bè và ánh mắt cổ vũ dịu dàng của em bên lề sân — nguồn động lực lớn nhất của anh.'
    },
    {
      type: 'memory',
      title: 'Chúng Mình Những Ngày Cuối Cấp 3',
      date: 'Tạm Biệt Mái Trường',
      images: [
        './assets/images/memories/11.1.png',
        './assets/images/memories/11.2.png',
        './assets/images/memories/11.3.png'
      ],
      description: 'Những ngày cuối cấp 3 đầy lưu luyến, tiếng ve gọi hè, trang lưu bút và những cái ôm tạm biệt. Tình yêu học trò khép lại để mở ra một trang mới trưởng thành hơn bên em.'
    },
    {
      type: 'memory',
      title: 'Lần Đầu Tiên Đi Du Lịch Cùng Nhau',
      date: 'Chuyến Đi Đầu Tiên',
      images: [
        './assets/images/memories/12.png'
      ],
      description: 'Chuyến du lịch xa đầu tiên chỉ có hai đứa mình, cùng khám phá vùng đất mới, cùng dậy sớm đón bình minh và cùng tạo nên những kỷ niệm vô giá.'
    },
    {
      type: 'memory',
      title: 'Lần Thứ 3 Đón Sinh Nhật Em Cùng Nhau',
      date: 'Thêm Một Tuổi Mới Yêu Thương',
      images: [
        './assets/images/memories/13.1.png',
        './assets/images/memories/13.2.png',
        './assets/images/memories/13.3.png'
      ],
      description: 'Sinh nhật lần thứ 3 bên em, hai đứa đã cùng nhau trải qua bao đổi thay khi bước vào đại học. Nhưng tình cảm dành cho em thì chỉ ngày một đong đầy hơn.'
    },
    {
      type: 'memory',
      title: 'Kỷ Niệm 1000 Ngày Yêu — Dịp Tết 2024',
      date: 'Tết 2024 · 1000 Ngày Yêu',
      images: [
        './assets/images/memories/14.1.png',
        './assets/images/memories/14.2.png',
        './assets/images/memories/14.3.png'
      ],
      description: 'Cột mốc 1000 ngày yêu nhau thật ý nghĩa khi rơi vào đúng dịp Tết Nguyên Đán 2024. Giữa không khí xuân rộn ràng, anh có em là món quà đầu năm trọn vẹn nhất.'
    },
    {
      type: 'memory',
      title: 'Lần Thứ 2 Đón Sinh Nhật Anh Cùng Nhau',
      date: 'Tuổi Mới Thêm Gắn Kết',
      images: [
        './assets/images/memories/15.png'
      ],
      description: 'Năm thứ hai đón sinh nhật cùng em. Tình cảm của hai đứa ngày càng gắn kết, có em ở bên cạnh biến ngày sinh nhật của anh thành ngày ngập tràn niềm vui và bình yên.'
    },
    {
      type: 'memory',
      title: 'Cùng Nhau Đi Hội An',
      date: 'Phố Cổ Lung Linh Ánh Đèn',
      images: [
        './assets/images/memories/16.1.png',
        './assets/images/memories/16.2.png'
      ],
      description: 'Cùng em dạo bước dưới những con hẻm vàng đặc trưng của phố cổ, ngắm lồng đèn rực rỡ bên dòng sông Hoài thơ mộng và thưởng thức những món ăn thân thương.'
    },
    {
      type: 'memory',
      title: 'Đi Du Lịch Huế Cùng Nhau',
      date: 'Cố Đô Mộng Mơ',
      images: [
        './assets/images/memories/17.1.png',
        './assets/images/memories/17.2.png'
      ],
      description: 'Hành trình về với mảnh đất cố đô trầm mặc, dạo quanh Đại Nội, ngắm sông Hương êm đềm và cùng em tận hưởng sự bình yên rất đỗi ngọt ngào.'
    },
    {
      type: 'memory',
      title: 'Về Quê Đi Biển Picnic Với Thầy Trung',
      date: 'Chuyến Đi Đầy Ắp Tiếng Cười',
      images: [
        './assets/images/memories/18.png'
      ],
      description: 'Chuyến về quê picnic bên bờ biển lộng gió cùng thầy Trung và mọi người. Từng làn gió biển mát rượi, những bữa ăn ấm cúng và bao kỷ niệm rạng rỡ tiếng cười.'
    },
    {
      type: 'memory',
      title: 'Mình Đi Chơi Khắp Đà Nẵng',
      date: 'Thành Phố Tình Yêu',
      images: [
        './assets/images/memories/19.1.png',
        './assets/images/memories/19.2.png',
        './assets/images/memories/19.3.png'
      ],
      description: 'Rong ruổi khắp các cung đường Đà Nẵng, qua những cây cầu rực rỡ về đêm, lên bán đảo Sơn Trà ngắm biển trời mênh mông cùng bà chã hơm iuu.'
    },
    {
      type: 'memory',
      title: 'Về Nhà Bé Chơi',
      date: 'Góc Nhỏ Thân Thương',
      images: [
        './assets/images/memories/20.1.png',
        './assets/images/memories/20.2.png'
      ],
      description: 'Những lần về nhà bé chơi, được ở bên em trong không gian thân thuộc nhất, giản dị, ấm áp và luôn tràn ngập cảm giác bình yên của một gia đình.'
    },
    {
      type: 'memory',
      title: 'Tết 2025 Với Bộ Ảnh Để Đời',
      date: 'Tết 2025 Rực Rỡ',
      images: [
        './assets/images/memories/21.png'
      ],
      description: 'Mùa Tết 2025 rạng rỡ với bộ ảnh kỷ niệm cực phẩm của hai đứa. Em mặc đồ Tết xinh đẹp như một nàng thơ, lưu lại những khung hình đẹp nhất thanh xuân.'
    },
    {
      type: 'memory',
      title: 'Lần Thứ 3 Đón Sinh Nhật Anh Cùng Nhau',
      date: 'Hạnh Phúc Giản Đơn',
      images: [
        './assets/images/memories/22.png'
      ],
      description: 'Mùa sinh nhật thứ 3 bên em, hai đứa đã cùng nhau đi qua bao kỷ niệm đẹp. Cảm ơn em vì đã luôn chu đáo, dành cho anh sự dịu dàng và thương yêu trọn vẹn nhất.'
    },
    {
      type: 'memory',
      title: 'Kỳ Nghỉ Lễ 30/4 - 1/5 Bên Nhau',
      date: '30 Tháng 4 & 01 Tháng 5',
      images: [
        './assets/images/memories/23.png'
      ],
      description: 'Những ngày nghỉ lễ thảnh thơi dành trọn thời gian cho nhau, tạm gác lại những bộn bề học tập và công việc để cùng nhau tận hưởng trọn vẹn từng khoảnh khắc.'
    },
    {
      type: 'memory',
      title: 'Tiếp Tục Đi Hội An Như Cơm Bữa',
      date: 'Góc Phố Thân Quen',
      images: [
        './assets/images/memories/24.1.png',
        './assets/images/memories/24.2.png'
      ],
      description: 'Hội An đi hoài không biết chán, đi nhiều đến mức quen từng góc quán, từng con ngõ nhỏ. Cứ rảnh rỗi là hai đứa lại đèo nhau về phố cổ hít hà không khí bình yên.'
    },
    {
      type: 'memory',
      title: 'Lần Thứ 4 Đón Sinh Nhật Bé Cùng Nhau',
      date: 'Sinh Nhật Lần Thứ 4',
      images: [
        './assets/images/memories/25.1.png',
        './assets/images/memories/25.2.png'
      ],
      description: 'Bốn mùa sinh nhật trôi qua, anh vẫn may mắn là người đầu tiên gửi lời chúc mừng đến em. Chúc em tuổi mới luôn là cô gái hạnh phúc nhất trên đời!'
    },
    {
      type: 'memory',
      title: 'Tết 2026 Cùng Nhau',
      date: 'Mùa Xuân Gắn Kết',
      images: [
        './assets/images/memories/26.png'
      ],
      description: 'Lại thêm một mùa Tết trọn vẹn nữa hai đứa đồng hành bên nhau. Tình yêu ngày càng chín muồi, sâu đậm và gắn kết hơn qua từng năm tháng.'
    },
    {
      type: 'memory',
      title: 'Cùng Nhau Đón Sinh Nhật Của Anh Lần Thứ 4',
      date: 'Sinh Nhật Lần Thứ 4 Bên Em',
      images: [
        './assets/images/memories/27.1.png',
        './assets/images/memories/27.2.png'
      ],
      description: 'Mỗi mùa sinh nhật có em bên cạnh, anh nhận ra món quà lớn nhất và quý giá nhất cuộc đời mình vẫn luôn là nụ cười hạnh phúc của em.'
    },
    {
      type: 'memory',
      title: 'Đi Lý Sơn Cùng Nhau',
      date: 'Biển Xanh & Nắng Vàng Lý Sơn',
      images: [
        './assets/images/memories/28.1.png',
        './assets/images/memories/28.2.png'
      ],
      description: 'Hành trình đến hòn đảo Lý Sơn xinh đẹp, đắm mình trong làn nước biển trong vắt như ngọc, ngắm hoàng hôn trên Cổng Tò Vò và lưu giữ những thước phim tuyệt mỹ.'
    },
    {
      type: 'memory',
      title: 'Kỷ Niệm Cột Mốc 5 Năm Bên Nhau',
      date: 'Hành Trình Nửa Thập Kỷ',
      images: [
        './assets/images/memories/29.1.png',
        './assets/images/memories/29.2.png',
        './assets/images/memories/29.3.png'
      ],
      description: 'Nửa thập kỷ yêu thương — 5 năm với biết bao thăng trầm, thử thách nhưng hai đứa vẫn luôn nắm chặt tay nhau để cùng trưởng thành và yêu nhau nhiều hơn.'
    },
    {
      type: 'memory',
      title: 'Đi Suối Chụp Choẹt Đồ Xinh',
      date: 'Hòa Mình Cùng Thiên Nhiên',
      images: [
        './assets/images/memories/30.1.png',
        './assets/images/memories/30.2.png'
      ],
      description: 'Chuyến đi suối hòa mình vào thiên nhiên trong lành, cùng em lội nước mát rượi, cười đùa rộn rã và có cả một bộ sưu tập ảnh \'chụp choẹt\' siêu đáng yêu.'
    },
    {
      type: 'memory',
      title: 'Mới Đây Chụp Photobooth Nè',
      date: 'Khoảnh Khắc Gần Nhất',
      images: [
        './assets/images/memories/31.1.png',
        './assets/images/memories/31.2.png',
        './assets/images/memories/31.3.png'
      ],
      description: 'Những khung hình photobooth ngộ nghĩnh, hài hước và đong đầy tình cảm vừa mới chụp gần đây. Tình yêu của chúng mình luôn tươi mới như ngày đầu tiên!'
    },
    {
      type: 'cover-back',
      title: 'Trái Tim Anh Luôn Có Em ♥',
      subtitle: 'Chúc Mừng Sinh Nhật Bà Chã Iuu',
      date: 'Bìa Sau Album',
      description: 'MiLove &bull; 31 Cột Mốc Kỷ Niệm Yêu Thương Của Chúng Mình'
    }
  ];

  // ── Helper: Normalizes images array for a page ───────────────────────────
  function _normalizeImages(page) {
    if (Array.isArray(page.images)) {
      return page.images.map(item => {
        if (typeof item === 'string') return { src: item, caption: '' };
        if (item && typeof item === 'object') return { src: item.src || '', caption: item.caption || '' };
        return { src: '', caption: '' };
      }).filter(item => Boolean(item.src));
    }
    if (page.image) {
      return [{ src: page.image, caption: '' }];
    }
    return [];
  }

  function _getInitialSrc(src) {
    if (src && (src.startsWith('./') || src.startsWith('http') || src.startsWith('/') || src.startsWith('data:image/'))) {
      return src;
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";
  }

  // ── Image Loading & Preloading ──────────────────────────────────────────

  /** Returns all encrypted keys that need to be requested via ImageProvider */
  function getImageKeys() {
    const keys = [];
    PAGES_DATA.forEach(page => {
      const imgs = _normalizeImages(page);
      imgs.forEach(item => {
        const src = item.src;
        if (src && !src.startsWith('http') && !src.startsWith('./') && !src.startsWith('/') && !src.startsWith('data:')) {
          keys.push(src);
        }
      });
    });
    return [...new Set(keys)];
  }

  /**
   * Preloads images around current visible page
   * @param {number} currentIndex
   */
  function preloadImagesAround(currentIndex) {
    const total = PAGES_DATA.length;
    [
      currentIndex,
      (currentIndex + 1) % total,
      (currentIndex - 1 + total) % total,
      (currentIndex + 2) % total,
      (currentIndex - 2 + total) % total,
    ].forEach(_hydratePageImage);

    const keys = getImageKeys();
    if (keys.length > 0 && window.ImageProvider && typeof ImageProvider.preload === 'function') {
      ImageProvider.preload(keys);
    }
  }

  /**
   * Resolves photos on a page (supports direct file URLs and encrypted keys)
   * @param {number} pageIndex
   */
  async function _hydratePageImage(pageIndex) {
    const page = PAGES_DATA[pageIndex];
    if (!page) return;

    const pageNode = document.querySelector(`[data-page-index="${pageIndex}"]`);
    if (!pageNode) return;

    const imgElements = pageNode.querySelectorAll('.page-photo');
    if (!imgElements || imgElements.length === 0) return;

    for (const img of imgElements) {
      const key = img.getAttribute('data-image-key');
      if (!key) continue;

      // Skip if already loaded with real content
      if (img.src && !img.src.startsWith('data:image/svg')) continue;

      // Case 1: Direct file path or data URI
      if (
        key.startsWith('http://') ||
        key.startsWith('https://') ||
        key.startsWith('./') ||
        key.startsWith('/') ||
        key.startsWith('data:image/')
      ) {
        img.src = key;
        img.style.opacity = '1';
        continue;
      }

      // Case 2: Encrypted key via ImageProvider
      if (window.ImageProvider && typeof ImageProvider.get === 'function') {
        try {
          const objectUrl = await ImageProvider.get(key);
          if (objectUrl) {
            img.src = objectUrl;
            img.style.opacity = '1';
          }
        } catch (err) {
          console.error(`[Renderer] Failed to load image "${key}":`, err);
        }
      }
    }
  }

  // ── DOM Rendering ───────────────────────────────────────────────────────

  /** Renders the modal & album structure into DOM */
  function renderAlbum() {
    if (document.getElementById('memory-book-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'memory-book-modal';
    modal.className = 'memory-book-modal';

    modal.innerHTML = `
      <div id="album-golden-light" class="album-golden-light"></div>
      
      <button id="memory-book-close-btn" class="album-close-btn" aria-label="Đóng Album Kỷ Niệm" tabindex="0">
        <i class="fas fa-times"></i>
      </button>

      <div class="album-stage">
        <div class="album-3d-wrapper">
          <div id="memory-book-album" class="album-book">
            
            <!-- Leather Front Cover Overlay -->
            <div class="album-cover album-cover-front">
              <div class="cover-gold-border">
                <div class="cover-content">
                  <div class="cover-emblem"><i class="fas fa-heart"></i></div>
                  <h2 class="cover-title">MiLove</h2>
                  <p class="cover-subtitle">Album Kỷ Niệm Tình Yêu</p>
                  <div class="cover-badge">31 Cột Mốc Thanh Xuân</div>
                </div>
              </div>
              <!-- Ribbed Bookmark -->
              <div class="album-bookmark" id="album-ribbon-bookmark">
                <span class="bookmark-ribbon"></span>
                <i class="fas fa-bookmark bookmark-icon"></i>
              </div>
            </div>

            <!-- Inside Pages Container: perspective wrapper outside overflow:hidden -->
            <div class="album-pages-perspective">
              <div class="album-pages-container" id="album-pages-container">
                ${_renderPagesHTML()}
              </div>
            </div>

            <!-- Back Cover Overlay -->
            <div class="album-cover album-cover-back">
              <div class="cover-gold-border"></div>
            </div>
          </div>
        </div>

        <!-- Combined Navigation Pill (Placed below book with safe margin) -->
        <div class="album-controls">
          <button id="album-prev-btn" class="album-nav-btn prev" aria-label="Trang trước" tabindex="0">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div id="album-page-indicator" class="album-page-indicator">Trang Bìa</div>
          <button id="album-next-btn" class="album-nav-btn next" aria-label="Trang tiếp theo" tabindex="0">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Bind Photo Frame & Placeholder clicks for Lightbox view
    _bindPhotoLightboxClicks(modal);
  }

  /** Binds click on photo frames to open full-screen lightbox */
  function _bindPhotoLightboxClicks(container) {
    container.addEventListener('click', (e) => {
      // Check if clicked inside a photo frame
      const frame = e.target.closest('.page-photo-frame');
      if (frame) {
        const img = frame.querySelector('.page-photo');
        const src = (img && img.src && !img.src.startsWith('data:image/svg')) ? img.src : frame.getAttribute('data-photo-src');
        const title = frame.getAttribute('data-photo-title') || 'Khoảnh Khắc Kỷ Niệm';
        const desc = frame.getAttribute('data-photo-desc') || '';

        if (window.GalleryController && typeof GalleryController.open === 'function') {
          GalleryController.open(src, title, desc);
        }
        return;
      }

      // Check if clicked on an empty placeholder frame
      const placeholder = e.target.closest('.page-placeholder-frame');
      if (placeholder) {
        const title = placeholder.getAttribute('data-placeholder-title') || 'Khung Ký Ức';
        const desc = placeholder.getAttribute('data-placeholder-desc') || '';
        if (window.GalleryController && typeof GalleryController.open === 'function') {
          GalleryController.open('', title, desc);
        }
      }
    });
  }

  /**
   * Generates static HTML for all pages.
   */
  function _renderPagesHTML() {
    return PAGES_DATA.map((page, index) => {
      const activeClass = index === 0 ? 'active' : '';

      if (page.type === 'cover-front') {
        return `
          <div class="album-page page-type-cover-front ${activeClass}" data-page-index="${index}">
            <div class="page-cover-paper">
              <div class="cover-gold-border">
                <div class="cover-content">
                  <div class="cover-emblem"><i class="fas fa-heart"></i></div>
                  <h2 class="cover-title">MiLove</h2>
                  <p class="cover-subtitle">${page.subtitle}</p>
                  <div class="cover-badge">${page.date}</div>
                  <p class="cover-hint-text"><i class="fas fa-hand-pointer"></i> Bấm nút tiếp tục bên dưới để lật trang</p>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      if (page.type === 'cover-back') {
        return `
          <div class="album-page page-type-cover-back ${activeClass}" data-page-index="${index}">
            <div class="page-cover-paper">
              <div class="cover-gold-border">
                <div class="cover-content">
                  <div class="cover-emblem"><i class="fas fa-infinity"></i></div>
                  <h2 class="cover-title">${page.title}</h2>
                  <p class="cover-subtitle">${page.subtitle}</p>
                  <p class="cover-desc-text">${page.description}</p>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // Content memory pages: render dynamic photos layout
      const photosLayoutHTML = _renderPhotosLayout(page, index);

      return `
        <div class="album-page ${activeClass}" data-page-index="${index}">
          ${_renderTornPaperBgHTML(index)}
          <div class="page-paper">
            <div class="page-header">
              <span class="page-date"><i class="far fa-calendar-alt"></i> ${page.date}</span>
              <h3 class="page-title"><span class="memory-number-badge">#${index}</span> ${page.title}</h3>
            </div>
            ${photosLayoutHTML}
            <div class="page-body">
              <p class="page-desc">${page.description}</p>
            </div>
            <div class="page-footer">
              <span class="page-number">- ${index} / ${PAGES_DATA.length - 2} -</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Generates torn-paper background element matching the authentic ripped paper design.
   * Alternates horizontal flip (scaleX -1) for odd and even pages to create an undulating panoramic wave.
   */
  function _renderTornPaperBgHTML(pageIndex) {
    const isAlt = pageIndex % 2 === 0;
    const altClass = isAlt ? 'alt-flip' : '';
    return `<div class="page-torn-paper-bg ${altClass}" aria-hidden="true"></div>`;
  }

  /**
   * Renders layout according to the number of images on the page
   * Supports 0 (placeholder), 1, 2, 3, 4 photos.
   */
  function _renderPhotosLayout(page, pageIndex) {
    const imgs = _normalizeImages(page);
    const count = imgs.length;

    // Case 0: Empty placeholder
    if (count === 0) {
      return `
        <div class="page-photos-layout layout-empty">
          <div class="page-placeholder-frame" data-placeholder-title="Mục ${pageIndex}: ${page.title}" data-placeholder-desc="${page.description}">
            <div class="photo-tape top-left"></div>
            <div class="photo-tape top-right"></div>
            <div class="placeholder-icon-wrap">
              <i class="fas fa-camera-retro"></i>
            </div>
            <h4 class="placeholder-title">Mục ${pageIndex}: ${page.title}</h4>
            <p class="placeholder-hint"><i class="fas fa-heart"></i> Chờ thêm ảnh kỷ niệm</p>
          </div>
        </div>
      `;
    }

    // Case 1: 1 Photo
    if (count === 1) {
      const item = imgs[0];
      const imgSrc = _getInitialSrc(item.src);
      return `
        <div class="page-photos-layout layout-1">
          <div class="page-photo-frame" data-photo-src="${item.src}" data-photo-title="Mục ${pageIndex}: ${page.title}" data-photo-desc="${item.caption || page.description}">
            <div class="photo-tape top-left"></div>
            <div class="photo-tape top-right"></div>
            <img src="${imgSrc}" alt="${page.title}" class="page-photo" data-image-key="${item.src}" loading="lazy">
            <div class="photo-zoom-hint"><i class="fas fa-search-plus"></i></div>
            ${item.caption ? `<span class="photo-frame-caption">${item.caption}</span>` : ''}
          </div>
        </div>
      `;
    }

    // Case 2: 2 Photos
    if (count === 2) {
      return `
        <div class="page-photos-layout layout-2">
          ${imgs.map((item, i) => {
            const rotClass = i === 0 ? 'rot-left' : 'rot-right';
            const imgSrc = _getInitialSrc(item.src);
            return `
              <div class="page-photo-frame ${rotClass}" data-photo-src="${item.src}" data-photo-title="Mục ${pageIndex}.${i + 1}: ${page.title}" data-photo-desc="${item.caption || page.description}">
                <div class="photo-tape top-center mini-tape"></div>
                <img src="${imgSrc}" alt="${page.title} (${i + 1})" class="page-photo" data-image-key="${item.src}" loading="lazy">
                <div class="photo-zoom-hint"><i class="fas fa-search-plus"></i></div>
                ${item.caption ? `<span class="photo-frame-caption">${item.caption}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Case 3: 3 Photos
    if (count === 3) {
      const rotClasses = ['rot-left', 'rot-center', 'rot-right'];
      return `
        <div class="page-photos-layout layout-3">
          ${imgs.map((item, i) => {
            const imgSrc = _getInitialSrc(item.src);
            return `
              <div class="page-photo-frame ${rotClasses[i] || ''}" data-photo-src="${item.src}" data-photo-title="Mục ${pageIndex}.${i + 1}: ${page.title}" data-photo-desc="${item.caption || page.description}">
                <div class="photo-tape top-center mini-tape"></div>
                <img src="${imgSrc}" alt="${page.title} (${i + 1})" class="page-photo" data-image-key="${item.src}" loading="lazy">
                <div class="photo-zoom-hint"><i class="fas fa-search-plus"></i></div>
                ${item.caption ? `<span class="photo-frame-caption">${item.caption}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Case 4+: 4 Photos (or more in grid)
    return `
      <div class="page-photos-layout layout-4">
        ${imgs.slice(0, 4).map((item, i) => {
          const imgSrc = _getInitialSrc(item.src);
          return `
            <div class="page-photo-frame" data-photo-src="${item.src}" data-photo-title="Mục ${pageIndex}.${i + 1}: ${page.title}" data-photo-desc="${item.caption || page.description}">
              <div class="photo-tape top-center mini-tape"></div>
              <img src="${imgSrc}" alt="${page.title} (${i + 1})" class="page-photo" data-image-key="${item.src}" loading="lazy">
              <div class="photo-zoom-hint"><i class="fas fa-search-plus"></i></div>
              ${item.caption ? `<span class="photo-frame-caption">${item.caption}</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ── Page Display & Hydration ────────────────────────────────────────────

  function updatePageDisplay(currentIndex, totalPages) {
    const pageNodes = document.querySelectorAll('.album-page');
    pageNodes.forEach((node, idx) => {
      if (idx === currentIndex) {
        node.classList.add('active');
        node.classList.remove('turned-prev', 'turned-next');
      } else if (idx < currentIndex) {
        node.classList.remove('active');
        node.classList.add('turned-prev');
        node.classList.remove('turned-next');
      } else {
        node.classList.remove('active');
        node.classList.add('turned-next');
        node.classList.remove('turned-prev');
      }
    });

    updatePageIndicator(currentIndex, totalPages);
    preloadImagesAround(currentIndex);
  }

  function updatePageIndicator(currentIndex, totalPages) {
    const indicator = document.getElementById('album-page-indicator');
    if (!indicator) return;

    const pageData = PAGES_DATA[currentIndex];
    const totalContentPages = totalPages - 2;

    if (pageData && pageData.type === 'cover-front') {
      indicator.textContent = 'Trang Bìa';
    } else if (pageData && pageData.type === 'cover-back') {
      indicator.textContent = 'Trang Kết';
    } else {
      indicator.textContent = `Mục ${currentIndex} / ${totalContentPages}`;
    }
  }

  return {
    renderAlbum,
    updatePageDisplay,
    updatePageIndicator,
    preloadImagesAround,
    getImageKeys,
    getPagesCount: () => PAGES_DATA.length
  };
})();

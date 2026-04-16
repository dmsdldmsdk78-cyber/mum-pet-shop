// 상단 배너 닫기 버튼 요소 선택
const bannerCloseButton = document.querySelector(".top-banner-close");

// 상단 배너 전체 영역 선택
const topBanner = document.querySelector(".top-banner");

// hero 이미지 슬라이드들
const heroImageSlides = document.querySelectorAll(".hero-image-slide");

// hero 점 버튼들
const heroImageDots = document.querySelectorAll(".hero-image-dot");

// 상품 탭 버튼들 전부 선택
const tabButtons = document.querySelectorAll(".tab-btn");

// 탭에 따라 보여줄 상품 영역들 전부 선택
const tabPanels = document.querySelectorAll(".product-panel");


// 배너 닫기 버튼과 배너가 둘 다 존재할 때만 실행
if (bannerCloseButton && topBanner) {
  bannerCloseButton.addEventListener("click", () => {
    // 클릭하면 상단 배너를 화면에서 숨김
    topBanner.style.display = "none";
  });
}

// 현재 보이는 이미지 번호
let currentHeroImage = 0;

// 자동 슬라이드용 변수
let heroImageInterval = null;


// 특정 이미지 보여주기
function showHeroImage(index) {
  heroImageSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });

  heroImageDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });

  currentHeroImage = index;
}


// 다음 이미지 보여주기
function nextHeroImage() {
  const nextIndex = (currentHeroImage + 1) % heroImageSlides.length;
  showHeroImage(nextIndex);
}


// 자동 재생 시작
function startHeroImageSlide() {
  if (heroImageSlides.length < 2) return;
  heroImageInterval = setInterval(nextHeroImage, 4000);
}


// 자동 재생 멈춤
function stopHeroImageSlide() {
  clearInterval(heroImageInterval);
}


// 점 버튼 클릭 시 해당 이미지로 이동
heroImageDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const targetIndex = Number(dot.dataset.heroSlide);
    showHeroImage(targetIndex);
    stopHeroImageSlide();
    startHeroImageSlide();
  });
});


// 첫 번째 이미지부터 시작
if (heroImageSlides.length > 0) {
  showHeroImage(0);
  startHeroImageSlide();
}


// 탭 버튼 각각에 클릭 이벤트 추가
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // 클릭한 버튼의 data-tab 값 가져오기
    const targetTab = button.dataset.tab;

    // 모든 탭 버튼을 돌면서 활성화 상태 다시 설정
    tabButtons.forEach((tabButton) => {
      // 지금 보고 있는 버튼이 클릭한 버튼인지 확인
      const isSelected = tabButton === button;

      // 클릭한 버튼만 is-active 추가
      // 나머지는 제거
      tabButton.classList.toggle("is-active", isSelected);

      // 접근성용 aria-selected도 함께 변경
      tabButton.setAttribute("aria-selected", String(isSelected));
    });

    // 모든 탭 패널을 돌면서
    tabPanels.forEach((panel) => {
      // data-panel 값이 클릭한 탭 이름과 같으면 보여주고
      // 아니면 숨김
      panel.classList.toggle("is-active", panel.dataset.panel === targetTab);
    });
  });
});

const curationSection = document.querySelector("#curationSection");
const curationGrid = document.querySelector("#curationGrid");

if (curationSection && curationGrid) {
  let currentX = 0;
  let maxX = 0;
  let isDesktop = window.innerWidth > 768;

  function updateCurationRange() {
    const viewport = curationSection.querySelector(".curation-viewport");
    if (!viewport) return;
    maxX = Math.max(0, curationGrid.scrollWidth - viewport.clientWidth);
  }

  function setCurationX(value) {
    currentX = Math.max(0, Math.min(value, maxX));
    curationGrid.style.transform = `translateX(-${currentX}px)`;
  }

  function isCurationVisible() {
    const rect = curationSection.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
  }

  function handleCurationWheel(event) {
    if (!isDesktop) return;
    if (!isCurationVisible()) return;

    updateCurationRange();

    if (maxX <= 0) return;

    const movingDown = event.deltaY > 0;
    const movingUp = event.deltaY < 0;
    const atStart = currentX <= 0;
    const atEnd = currentX >= maxX;

    if (movingDown && !atEnd) {
      event.preventDefault();
      setCurationX(currentX + Math.abs(event.deltaY));
    }

    if (movingUp && !atStart) {
      event.preventDefault();
      setCurationX(currentX - Math.abs(event.deltaY));
    }
  }

  window.addEventListener("wheel", handleCurationWheel, { passive: false });

  window.addEventListener("resize", () => {
    isDesktop = window.innerWidth > 768;
    updateCurationRange();

    if (!isDesktop) {
      currentX = 0;
      curationGrid.style.transform = "none";
    } else {
      setCurationX(currentX);
    }
  });

  updateCurationRange();
}
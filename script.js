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

// 큐레이션 섹션 전체 영역 선택
const curationSection = document.querySelector("#curationSection");

// 실제 가로로 움직일 카드 묶음 선택
const curationGrid = document.querySelector("#curationGrid");

// 섹션과 카드 묶음이 둘 다 있을 때만 실행
if (curationSection && curationGrid) {
  // 현재 가로로 이동한 거리
  let currentX = 0;

  // 최대로 이동할 수 있는 거리
  let maxX = 0;

  // 현재 화면이 데스크탑인지 확인
  // 768px 초과면 데스크탑으로 간주
  let isDesktop = window.innerWidth > 768;

  // 현재 화면 크기 기준으로
  // 큐레이션 카드들이 얼마나 더 가로로 이동할 수 있는지 계산
  function updateCurationRange() {
    // 화면에 보이는 영역(뷰포트) 선택
    const viewport = curationSection.querySelector(".curation-viewport");

    // 없으면 함수 종료
    if (!viewport) return;

    // 전체 카드 너비 - 현재 보이는 영역 너비
    // 즉, 오른쪽으로 더 밀 수 있는 최대 거리
    maxX = Math.max(0, curationGrid.scrollWidth - viewport.clientWidth);
  }

  // 가로 이동값을 실제로 적용하는 함수
  function setCurationX(value) {
    // 0보다 작아지지 않게, maxX보다 커지지 않게 제한
    currentX = Math.max(0, Math.min(value, maxX));

    // translateX로 카드들을 왼쪽으로 이동
    // 값이 커질수록 더 많이 넘어감
    curationGrid.style.transform = `translateX(-${currentX}px)`;
  }

  // 현재 큐레이션 섹션이 화면 안에 어느 정도 보이는지 확인
  function isCurationVisible() {
    // 현재 섹션의 위치 정보 가져오기
    const rect = curationSection.getBoundingClientRect();

    // 섹션의 윗부분이 화면 아래쪽 80% 안에 들어오고
    // 섹션의 아랫부분이 화면 위쪽 20% 아래에 있으면
    // "지금 보고 있는 중"이라고 판단
    return rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
  }

  // 마우스 휠로 큐레이션을 가로 이동시키는 함수
  function handleCurationWheel(event) {
    // 모바일이면 실행하지 않음
    if (!isDesktop) return;

    // 지금 큐레이션 섹션이 화면에 안 보이면 실행하지 않음
    if (!isCurationVisible()) return;

    // 현재 화면 크기에 맞게 최대 이동 거리 다시 계산
    updateCurationRange();

    // 더 이상 움직일 공간이 없으면 종료
    if (maxX <= 0) return;

    // 휠을 아래로 내리는지 확인
    const movingDown = event.deltaY > 0;

    // 휠을 위로 올리는지 확인
    const movingUp = event.deltaY < 0;

    // 현재 맨 처음 위치인지 확인
    const atStart = currentX <= 0;

    // 현재 맨 끝 위치인지 확인
    const atEnd = currentX >= maxX;

    // 아래로 휠을 내렸고, 아직 끝에 도달하지 않았다면
    if (movingDown && !atEnd) {
      // 기본 세로 스크롤을 막고
      event.preventDefault();

      // deltaY 값만큼 가로로 더 이동
      setCurationX(currentX + Math.abs(event.deltaY));
    }

    // 위로 휠을 올렸고, 아직 시작점이 아니라면
    if (movingUp && !atStart) {
      // 기본 세로 스크롤을 막고
      event.preventDefault();

      // deltaY 값만큼 가로로 반대로 이동
      setCurationX(currentX - Math.abs(event.deltaY));
    }
  }

  // 윈도우 전체에 휠 이벤트 등록
  // passive: false 여야 preventDefault 사용 가능
  window.addEventListener("wheel", handleCurationWheel, { passive: false });

  // 화면 크기가 바뀔 때 실행
  window.addEventListener("resize", () => {
    // 현재가 데스크탑인지 다시 판별
    isDesktop = window.innerWidth > 768;

    // 최대 이동 거리 다시 계산
    updateCurationRange();

    // 모바일로 바뀌면
    if (!isDesktop) {
      // 이동값 초기화
      currentX = 0;

      // CSS transform 제거
      // 모바일에서는 손가락 스와이프용 overflow-x 방식 사용
      curationGrid.style.transform = "none";
    } else {
      // 다시 데스크탑이 되면 현재 위치 기준으로 transform 재적용
      setCurationX(currentX);
    }
  });

  // 처음 실행 시 최대 이동 거리 계산
  updateCurationRange();
}
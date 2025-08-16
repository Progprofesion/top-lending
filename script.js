document.addEventListener("DOMContentLoaded", () => {
  const carouselContent = document.querySelector(".tournMembers__content");
  const prevButton = document.querySelector(".tournMembers__prev");
  const nextButton = document.querySelector(".tournMembers__next");
  const indicator = document.querySelector(".tournMembers__indicator");

  // Данные участников
  const members = [
    "Хозе-Рауль Капабланка",
    "Эммануил Ласкер",
    "Александр Алехин",
    "Арон Нимцович",
    "Рихард Рети",
    "Остап Бендер",
  ];

  const rank = [
    "Чемпион мира по шахматам",
    "Чемпион мира по шахматам",
    "Чемпион мира по шахматам",
    "Чемпион мира по шахматам",
    "Чемпион мира по шахматам",
    "Гроссмейстер",
  ];

  // Копии для бесконечной карусели
  const clonedMembers = [...members, ...members, ...members];
  const clonedRanks = [...rank, ...rank, ...rank];

  let itemsHTML = "";
  clonedMembers.forEach((member, index) => {
    const originalIndex = index % members.length;
    itemsHTML += `
            <div class="tournMembers__item" data-original-index="${originalIndex}">
                <div class="tournMembers__card">
                    <img class="tournMembers__cardImg" src="assets/imgTournMembers.png" alt="Мужчина с шахматами" />
                    <p class="tournMembers__member">${member}</p>
                    <p class="tournMembers__rank">${clonedRanks[index]}</p>
                    <button>Подробнее</button>
                </div>
            </div>
        `;
  });
  carouselContent.innerHTML = itemsHTML;

  const totalItems = members.length;
  let currentPosition = 0;
  let autoSlideInterval;
  let visibleItems = 3; // По умолчанию 3 элемента
  let step = 3; // По умолчанию шаг 3

  // Функция для определения количества видимых элементов и шага
  function updateVisibleItems() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 932) {
      visibleItems = 1;
      step = 1;
    } else if (screenWidth <= 1306) {
      visibleItems = 2;
      step = 2;
    } else {
      visibleItems = 3;
      step = 3;
    }
    updateCarousel();
  }

  // Функция обновления позиции карусели
  function updateCarousel() {
    const itemWidth = 100 / visibleItems;
    const offset = -currentPosition * itemWidth;
    carouselContent.style.transform = `translateX(${offset}%)`;

    updateIndicator();
  }

  function updateIndicator() {
    const displayIndex = (currentPosition % totalItems) + visibleItems;
    indicator.innerHTML = `${displayIndex}<span>/${totalItems}<span/>`;
  }

  function nextSlide() {
    currentPosition = (currentPosition + step) % (totalItems * 2);
    updateCarousel();

    if (currentPosition >= totalItems) {
      setTimeout(() => {
        carouselContent.style.transition = "none";
        currentPosition = currentPosition % totalItems;
        updateCarousel();
        setTimeout(() => {
          carouselContent.style.transition = "transform 0.5s ease";
        }, 50);
      }, 500);
    }
  }

  function prevSlide() {
    currentPosition =
      (currentPosition - step + totalItems * 2) % (totalItems * 2);
    updateCarousel();

    if (currentPosition < 0 || currentPosition >= totalItems) {
      setTimeout(() => {
        carouselContent.style.transition = "none";
        currentPosition = (currentPosition % totalItems) + totalItems;
        updateCarousel();
        setTimeout(() => {
          carouselContent.style.transition = "transform 0.5s ease";
        }, 50);
      }, 500);
    }
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Инициализация карусели
  updateVisibleItems();
  startAutoSlide();

  nextButton.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  prevButton.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  // Адаптация при изменении размера окна
  window.addEventListener("resize", () => {
    updateVisibleItems();
  });

  // Якорные кнопки
  document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("data-scroll");
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // --- Код для мобильной карусели (.carousel) ---
  const carouselSlides = document.querySelector(".carousel__slides");
  const prevButton1 = document.querySelector(".carousel__button--prev");
  const nextButton1 = document.querySelector(".carousel__button--next");
  const dotsContainer = document.querySelector(".carousel__dots");

  let isCarouselActive = false;

  // Проверяем мобильный размер экрана
  function isMobile() {
    return window.matchMedia("(max-width: 567px)").matches;
  }

  function createCarouselSlides() {
    const gridItems = document.querySelectorAll(".stage__gridItem");
    const planeImgMobile = document.querySelector(".stage__planeImgMobile");

    const slideGroups = [
      [gridItems[0], gridItems[1]],
      [gridItems[2]],
      [gridItems[3], gridItems[4]],
      [gridItems[5]],
      [gridItems[6]],
    ];

    carouselSlides.innerHTML = "";

    slideGroups.forEach((group, index) => {
      const slide = document.createElement("div");
      slide.className = "carousel__slide";

      const slideContent = document.createElement("div");
      slideContent.className = "slide__content";

      group.forEach((item) => {
        // Клонируем элемент, чтобы не перемещать оригинальный
        const clone = item.cloneNode(true);
        slideContent.appendChild(clone);
      });

      if (index === 4 && planeImgMobile) {
        const planeClone = planeImgMobile.cloneNode(true);
        slideContent.appendChild(planeClone);
      }

      slide.appendChild(slideContent);
      carouselSlides.appendChild(slide);
    });

    createDots(slideGroups.length);

    updateButtons(0, slideGroups.length);
  }

  // Инициализация мобильной карусели
  function initMobileCarousel() {
    createCarouselSlides();

    prevButton1.addEventListener("click", () => {
      const currentIndex = getCurrentSlideIndex();
      goToSlide(currentIndex - 1);
    });

    nextButton1.addEventListener("click", () => {
      const currentIndex = getCurrentSlideIndex();
      goToSlide(currentIndex + 1);
    });
  }

  function destroyMobileCarousel() {
    carouselSlides.innerHTML = "";
    dotsContainer.innerHTML = "";
    carouselSlides.style.transform = "translateX(0%)";
  }

  // Проверка и обновление карусели
  function checkMobileCarousel() {
    if (isMobile()) {
      if (!isCarouselActive) {
        initMobileCarousel();
        isCarouselActive = true;
      }
    } else {
      if (isCarouselActive) {
        destroyMobileCarousel();
        isCarouselActive = false;
      }
    }
  }

  // Debounce для ресайза (чтобы избежать слишком частых вызовов)
  let resizeTimeout;
  function debouncedCheckMobileCarousel() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(checkMobileCarousel, 200);
  }

  // Создаем точки для навигации
  function createDots(count) {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      dot.className = "carousel__dot";
      if (i === 0) dot.classList.add("active");
      dot.dataset.index = i;
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Переход к определенному слайду
  function goToSlide(index) {
    const slides = document.querySelectorAll(".carousel__slide");
    if (index < 0 || index >= slides.length) return;

    carouselSlides.style.transform = `translateX(-${index * 100}%)`;

    // Обновляем активную точку
    document.querySelectorAll(".carousel__dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    updateButtons(index, slides.length);
  }

  function updateButtons(currentIndex, totalSlides) {
    prevButton1.disabled = currentIndex === 0;
    nextButton1.disabled = currentIndex === totalSlides - 1;
  }

  function getCurrentSlideIndex() {
    return Array.from(document.querySelectorAll(".carousel__dot")).findIndex(
      (dot) => dot.classList.contains("active")
    );
  }

  checkMobileCarousel();

  // Обработчик ресайза с debounce
  window.addEventListener("resize", debouncedCheckMobileCarousel);
});

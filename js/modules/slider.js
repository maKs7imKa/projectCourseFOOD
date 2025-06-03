function slider() {
    
    //^==============================
    //^           Slider 
    //^==============================

    // === Отримання елементів DOM ===
    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        slideValue = document.querySelector('#current'),
        slideTotal = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidewField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    // === Функція для активного стилю точки ===
    function dotActileView() {
        dots.forEach(dot => dot.style.opacity = '.5')
        dots[slideIndex - 1].style.opacity = '1';
    }

    // === Збереження поточного стану в localStorage ===
    function saveLocalStorage() {
        localStorage.setItem('slideValue', slideIndex);
        localStorage.setItem('offset', offset);
    }

    function viewChangesOnPage() {
        slideValue.textContent = slideIndex;
        slidewField.style.transform = `translateX(-${offset}px)`;
    }

    // === Ініціалізація змінних та зчитування з localStorage ===
    let slideIndex = +localStorage.getItem('slideValue') || 1;
    let offset = +localStorage.getItem('offset') || 0;

    // === Налаштування стилів для слайдера ===
    slidewField.style.width = 100 * slides.length + '%';
    slidewField.style.display = 'flex';
    slidewField.style.transition = '0.5s all';
    slidewField.style.background = 'white';
    slidesWrapper.style.overflow = 'hidden';

    // === Задання ширини і відступу для кожного слайду ===
    slides.forEach(slide => {
        slide.style.width = width;
        slide.style.margin = '20px 0 20px 0';
    });

    // === Налаштування обгортки слайдера ===
    slider.style.position = 'relative';

    // === Створення елементів індикаторів (точок) ===
    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    // === Генерація точок індикатора ===
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == slideIndex - 1) dot.style.opacity = '1';
        indicators.append(dot);
        dots.push(dot)
    }

    // === Відображення поточного стану слайдера ===
    slideTotal.textContent = slides.length;
    slideValue.textContent = slideIndex;
    slidewField.style.transform = `translateX(-${offset}px)`;

    // === Перехід до наступного слайду ===
    next.addEventListener('click', () => {
        slideIndex++;
        if (slideIndex > slides.length) slideIndex = 1;

        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }
        viewChangesOnPage()
        dotActileView()
        saveLocalStorage()
    });

    // === Перехід до попереднього слайду ===
    prev.addEventListener('click', () => {
        slideIndex--;
        if (slideIndex < 1) slideIndex = slides.length;

        if (offset == 0) {
            offset += +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }
        viewChangesOnPage()
        dotActileView()
        saveLocalStorage()
    });

    // === Обробка кліків по точках індикатора ===
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);

            viewChangesOnPage()
            dotActileView()
            saveLocalStorage()
        })
    })
}

module.exports = slider;
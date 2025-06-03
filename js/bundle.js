/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

function calc() {
    
    //  =====================================================
    //                 Калькулятор калорій
    //  =====================================================

    // для жінок: (вага (кг) x 10) + (зріст (см) x 6,25) - (вік (років) x 5) - 161;
    // для чоловіків: (вага (кг) x 10) + (зріст (см) x 6,25) - (вік (років) x 5) + 5;
    const result = document.querySelector('.calculating__result span');
    let sex, height, weidht, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = '1.375';
        localStorage.setItem('ratio', '1.375');
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        })
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || !weidht || !age || !ratio) {
            result.textContent = ':) _____ ';
            return;
        }

        if (sex === 'female') {
            result.textContent = (((weidht * 10) + (height * 6.25) - (age * 5) - 161) * ratio).toFixed(1);
        } else {
            result.textContent = (((weidht * 10) + (height * 6.25) - (age * 5) + 5) * ratio).toFixed(1);
        }
    }

    calcTotal();

    function getStaticInformarion(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);


        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio')
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'))
                } else {  
                    sex = e.target.getAttribute('id')
                    localStorage.setItem('sex', e.target.getAttribute('id'))

                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass)
                })
    
                e.target.classList.add(activeClass)
                calcTotal();
            })
        })

    }

    getStaticInformarion('#gender', 'calculating__choose-item_active');
    getStaticInformarion('.calculating__choose_big', 'calculating__choose-item_active')

    function getDynamicInformation(selector){
        const input = document.querySelector(selector);

      

        input.addEventListener('input', () => {
            switch(input.getAttribute('id')) {
                case "height": 
                    height = +input.value;
                    break;
                case 'weight': 
                    weidht = +input.value;
                    break;
                case 'age':
                    age = +input.value; 
                    break;
            }
            calcTotal();
        })
    }

    getDynamicInformation('#height')
    getDynamicInformation('#weight')
    getDynamicInformation('#age')

}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards(){
    //==============================
    //     класи для карточок
    //==============================

    class MenuCard {
        constructor(src, alt, title, descr, price, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const div = document.createElement("div");
            div.classList.add("menu__item");
            this.classes.forEach(className => {
                div.classList.add(className);
            });
            div.innerHTML = `
            <img src=${this.src} alt=${this.alt}/>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день
                </div>
            </div>
            `;
            document.querySelector(".menu .container").append(div);
        }
    }

    const getData = async (url) => {
        const res = await fetch(url)

        if (res.status !== 200) {
            throw new Error(`could not fetch ${url} , status ${res.status}`)
        }

        return await res.json();
    }

    // getData('http://localhost:3000/menu')
    //     .then(data => {
    // data.forEach(({img, altimg, title, descr, price}) =>{
    //     new MenuCard(img, altimg, title, descr, price).render()
    // })
    //     })


    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price).render()
            })
        })

}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
     //==============================
    //            Forms
    //==============================

    const forms = document.querySelectorAll("form");
    const message = {
        loading: 'img/form/spinner.svg',
        seccess: 'спасиба скоро з вами зважемся',
        failed: 'щось пішло не так...'
    }

    forms.forEach(item => {
        bindPostData(item);
    })

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        })

        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: auto;
            `;

            form.after(statusMessage);


            const formData = new FormData(form);
            const object = {}

            formData.forEach(function (value, index) {
                object[index] = value;
            })

            postData('http://localhost:3000/requests', JSON.stringify(object))
                // .then(data => data.text())
                .then(data => {
                    console.log(data);
                    showThanksModal(message.seccess);
                    statusMessage.remove();
                })
                .catch(error => {
                    console.log(error);
                    showThanksModal(message.failed);
                })
                .finally(() => {
                    form.reset();

                })

        })
    }


    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        // prevModalDialog.style.display = 'none'

        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <disv data-close class="modal__close">&times;</disv>
                <div class="modal__title"> ${message} </div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000)

    }

    //==============================

    // fetch('http://localhost:3000/menu')
    //     .then(response => response.json())
    //     .then(json => console.log(json))
}

module.exports = forms;


/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
    
    //==============================
    //           modal
    //==============================

    const modalWindow = document.querySelector(".modal"), // вікно
        modalOpen = document.querySelectorAll("[data-modal]") // кнопка відкрити

    // Функція сховати модальне вікно
    function closeModal() {
        modalWindow.style.display = "none";
        document.body.classList.remove("scroll");
    }

    // Функція зробити модальне вікно видимим
    function openModal() {
        modalWindow.style.display = "flex";
        document.body.classList.add("scroll");
        clearTimeout(modalTimer);
    }
    // Відкриття модального вікна на всіх кнопках " Звязатись з нами "
    modalOpen.forEach((open) => {
        open.addEventListener("click", () => {
            openModal();
        });
    });


    // Закрити модальне вікно на пусте місце поза вікном
    window.addEventListener("click", (event) => {
        if (event.target === modalWindow || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    // Закрити модальне вікно на " Escape "
    document.addEventListener("keydown", (event) => {
        if (
            event.code === "Escape" &&
            document.body.classList.contains("scroll")
        ) {
            closeModal();
        }
    });

    const modalTimer = setTimeout(openModal, 20000);

    function showModalByScroll() {
        if (
            window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight
        ) {
            openModal();
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

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

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
    //==============================
    //           tabs
    //==============================

    const tabs = document.querySelectorAll(".tabheader__item");
    const tabsConstent = document.querySelectorAll(".tabcontent");
    const tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent() {
        tabsConstent.forEach((divPhoto) => {
            divPhoto.style.display = "none";
        });
        tabs.forEach((tab) => {
            tab.classList.remove("tabheader__item_active");
        });
    }

    function showTabContent(i = 0) {
        tabsConstent[i].style.display = "block";
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (event) => {
        const target = event.target;

        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer(){
    
    //==============================
    //           timer
    //==============================

    const deadline = "2025-06-20";

    function getTimeRemaining(endTime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endTime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            (days = Math.floor(t / (1000 * 60 * 60 * 24))),
                (hours = Math.floor((t / (1000 * 60 * 60)) % 24)),
                (minutes = Math.floor((t / (1000 * 60)) % 60)),
                (seconds = Math.floor((t / 1000) % 60));
        }

        return {
            total: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        };
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector);
        (days = timer.querySelector("#days")),
            (hours = timer.querySelector("#hours")),
            (minutes = timer.querySelector("#minutes")),
            (seconds = timer.querySelector("#seconds")),
            (timeIterval = setInterval(updateClock, 1000));

        updateClock();

        function getZero(num) {
            if (num >= 0 && num < 10) {
                return `0${num}`;
            } else {
                return num;
            }
        }

        function updateClock() {
            const t = getTimeRemaining(endTime);

            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);

            if (t.total < 1) {
                clearInterval(timeIterval);
            }
        }
    }

    setClock(".timer", deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener("DOMContentLoaded", () => {
   const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
        timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
        slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
        modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
        forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
        cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
        calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js")


    tabs()
    timer()
    slider()
    modal()
    forms()
    cards()
    calc()
   






    // json-server db.json


});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
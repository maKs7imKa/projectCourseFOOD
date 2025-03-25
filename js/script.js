window.addEventListener("DOMContentLoaded", () => {
    // tabs
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

    // timer
    const deadline = "2025-03-20";

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

    // modal
    const modalWindow = document.querySelector(".modal"), // вікно
        modalOpen = document.querySelectorAll("[data-modal]"), // кнопка відкрити
        modalClose = document.querySelector("[data-close]"); // кнопка закрити

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

    // Закрити бодальне вікно на кнопку
    modalClose.addEventListener("click", closeModal);

    // Закрити модальне вікно на пусте місце поза вікном
    window.addEventListener("click", (event) => {
        if (event.target === modalWindow) {
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

    const modalTimer = setTimeout(openModal, 7000);

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


    // класи для карточок

    class MenuCard {
        constructor(src, alt, title, descr, price) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;    
        }

        render() {
            const div = document.createElement("div");
            div.classList.add("menu__item");
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

    const div = new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Менюключительно полезные ингредbhvuhblhbrf re fver f er f s gf sd fds fggsdfg иенты',
        9, 
    );
    div.render();


});

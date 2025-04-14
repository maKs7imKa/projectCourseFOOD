window.addEventListener("DOMContentLoaded", () => {
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
    //==============================
    //           timer
    //==============================

    const deadline = "2025-04-20";

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
        if (event.target === modalWindow || event.target.getAttribute('data-close') == '' ) {
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

        if (res.status !== 200){
            throw new Error(`could not fetch ${url} , status ${res.status}`)
        }

        return await res.json();
    }

    getData('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) =>{
                new MenuCard(img, altimg, title, descr, price).render()
            })
        })

   

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

    function bindPostData(form){
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

            formData.forEach(function(value, index) {
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


    function showThanksModal(message){
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

    fetch('http://localhost:3000/menu')
        .then(response => response.json())
        .then(json => console.log(json))
    

});

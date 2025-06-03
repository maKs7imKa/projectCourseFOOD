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
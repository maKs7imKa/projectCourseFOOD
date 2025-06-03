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

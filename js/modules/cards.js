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
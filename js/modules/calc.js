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
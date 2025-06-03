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
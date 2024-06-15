const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

const hour = qs(".hour"),
    min = qs(".min"),
    sec = qs(".sec"),
    totalHours = qs(".totalHours"),
    wrapper = qs(".wrapper"),
    timeWrapper = qs(".timeWrapper"),
    reset = qs(".reset"),
    totalDaysCount = qs(".totalDaysCount"),
    totalHoursCount = qs(".totalHoursCount"),
    totalMinsCount = qs(".totalMinsCount"),
    themeToggle = qs(".themeToggle");

let secCount = 0,
    minCount = 0,
    hourCount = 0,
    counterStopperFun = undefined,
    isCounting = false;

//* code for prev data
const prevCountData = localStorage.getItem("pervCountData");
let permanentData = localStorage.getItem("permanentData");
let addedPervCountData = localStorage.getItem("addedPervCountData");

if (!addedPervCountData) {
    console.log("I ran");
    localStorage.setItem(
        "addedPervCountData",
        (addedPervCountData = JSON.stringify({
            minCount: 0,
            hourCount: 0,
        }))
    );
}

if (prevCountData) {
    const data = JSON.parse(prevCountData);
    initialRender(data);
}

//* initial call for showing the total Time
showTotalTime("initial");

//* start pause code
timeWrapper.addEventListener("click", () => {
    isCounting = !isCounting;
    wrapper.classList.toggle("counting");
    if (!wrapper.classList.contains("counting")) showTotalTime();

    if (!counterStopperFun) {
        counterStopperFun = startCounting();
    } else {
        clearInterval(counterStopperFun);
        counterStopperFun = undefined;
    }
});

//* contains sec counting
function startCounting() {
    return setInterval(() => {
        if (secCount >= 59) {
            secCount = 0;
            minFun();
        }
        secCount = render(sec, secCount);
    }, 1000);
}

//* min code
function minFun() {
    if (minCount >= 59) {
        minCount = 0;
        hourFun();
    }
    minCount = render(min, minCount);
}

//* min code
function hourFun() {
    hourCount = render(hour, hourCount);
}

//* show total time
function showTotalTime(state) {
    if (!permanentData) {
        console.log("no data found", permanentData);
        localStorage.setItem(
            "permanentData",
            (permanentData = JSON.stringify({
                daysCount: 0,
                hoursCount: 0,
                minsCount: 0,
            }))
        );
        return;
    }

    const data = JSON.parse(permanentData);
    const addedData = JSON.parse(addedPervCountData);

    if (state == "initial") {
        totalDaysCount.innerText = data.daysCount.toString().padStart(2, "0");
        totalHoursCount.innerText = data.hoursCount.toString().padStart(2, "0");
        totalMinsCount.innerText = data.minsCount.toString().padStart(2, "0");
        return;
    }

    let s = minCount - addedData.minCount;
    console.log(addedData);

    const totalMins = data.minsCount + s;

    const totalHours =
        data.hoursCount -
        addedData.hourCount +
        hourCount +
        Math.trunc(totalMins / 60);

    const daysCount = Math.trunc(totalHours / 24) + data.daysCount;
    const hoursCount = totalHours % 24;
    const minsCount = totalMins % 60;

    localStorage.setItem(
        "permanentData",
        (permanentData = JSON.stringify({
            daysCount,
            hoursCount,
            minsCount,
        }))
    );

    localStorage.setItem(
        "addedPervCountData",
        (addedPervCountData = JSON.stringify({ minCount, hourCount }))
    );

    totalDaysCount.innerText = daysCount.toString().padStart(2, "0");
    totalHoursCount.innerText = hoursCount.toString().padStart(2, "0");
    totalMinsCount.innerText = minsCount.toString().padStart(2, "0");
}

//* saves data to the storage
setInterval(() => {
    if (!isCounting) return;
    localStorage.setItem(
        "pervCountData",
        JSON.stringify({
            secCount,
            minCount,
            hourCount,
        })
    );
}, 60000);

//* rendering helper function
function render(element, count) {
    const newTime = [...`${++count}`.padStart(2, "0")];
    element.innerHTML = newTime.reduce((before, item) => {
        return before + `<span>${item}</span>`;
    }, "");
    return count;
}

function initialRender(data) {
    //* subtracting with 1 is important because render function adds 1 to the variable automatically
    secCount = data.secCount;
    render(sec, secCount - 1);
    minCount = data.minCount;
    render(min, minCount - 1);
    hourCount = data.hourCount;
    render(hour, hourCount - 1);
}

//* reset code
reset.addEventListener("dblclick", () => {
    secCount = minCount = hourCount = 0;
    const data = {
        secCount,
        minCount,
        hourCount,
    };
    localStorage.setItem(
        "addedPervCountData",
        (addedPervCountData = JSON.stringify({
            minCount: 0,
            hourCount: 0,
        }))
    );

    localStorage.setItem("pervCountData", JSON.stringify(data));
    initialRender(data);
});

//* dark mode white mode code
let mode = localStorage.getItem("mode");
if (!mode) localStorage.setItem("mode", "light");
switchMode(mode);

function switchMode(m) {
    mode = m;
    if (m == "dark") {
        document.querySelector("html").classList.add("dark");
        themeToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M479.9-111.521q-153.491 0-260.935-107.444Q111.521-326.409 111.521-479.9q0-153.491 107.473-261.318Q326.467-849.044 480-849.044q12.304 0 24.674.717 12.369.718 24.239 2.718-34.217 31.261-55.043 74.652-20.826 43.391-20.826 92.869 0 94.004 66.132 159.807 66.133 65.802 160.608 65.802 49.347 0 92.521-20.543t73.869-54.76q1.435 11.869 2.153 23.508.717 11.639.717 23.709 0 153.391-107.826 261.217Q633.391-111.521 479.9-111.521Zm.1-106.002q73.304 0 134.26-37.195 60.956-37.195 93.521-98.803-14.348 2.739-28.695 4.044-14.348 1.304-28.13.173-120.739-9.609-205.826-93.283-85.087-83.673-95.826-208.934-.566-13.783.456-28.13 1.022-14.348 4.326-28.13-61.043 33.131-98.803 94.087T217.523-480q0 108.741 76.868 185.609Q371.259-217.523 480-217.523Zm-17.348-245.129Z"/></svg>`;
    } else {
        document.querySelector("html").classList.remove("dark");
        themeToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-386.001q39.26 0 66.63-27.37Q573.999-440.74 573.999-480q0-39.26-27.369-66.63-27.37-27.369-66.63-27.369-39.26 0-66.629 27.369-27.37 27.37-27.37 66.63 0 39.26 27.37 66.629 27.369 27.37 66.629 27.37ZM480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM80-426.999q-22.087 0-37.544-15.457Q27-457.913 27-480q0-22.087 15.457-37.544Q57.913-533.001 80-533.001h80q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H80Zm720 0q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h80q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-80Zm-320-320q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-80q0-22.087 15.457-37.544 15.457-15.457 37.544-15.457 22.087 0 37.544 15.457 15.457 15.457 15.457 37.544v80q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457Zm0 720q-22.087 0-37.544-15.457Q426.999-57.913 426.999-80v-80q0-22.087 15.457-37.544 15.457-15.457 37.544-15.457 22.087 0 37.544 15.457 15.457 15.457 15.457 37.544v80q0 22.087-15.457 37.544Q502.087-27 480-27ZM216.956-668.391l-43-42q-15.957-14.957-15.457-37.044.5-22.087 15.457-38.609 15.392-15.957 37.479-15.957t37.609 15.957l42.565 43q14.957 15.392 14.674 36.761-.282 21.37-14.674 37.327-14.957 15.957-36.826 16.022-21.87.065-37.827-15.457Zm494 494.435-42.565-43q-14.957-15.392-14.957-36.979t14.957-37.109q14.957-15.957 36.826-15.457 21.87.5 37.827 15.457l43 41.435q15.957 14.957 15.457 37.044-.5 22.087-15.457 38.609-15.392 15.957-37.479 15.957t-37.609-15.957Zm-42-494.435q-15.957-14.957-15.457-36.826.5-21.87 15.457-37.827l41.435-43q14.957-15.957 37.044-15.457 22.087.5 38.609 15.457 15.957 15.392 15.957 37.479t-15.957 37.609l-43 42.565q-15.392 14.957-36.761 14.674-21.37-.282-37.327-14.674Zm-495 494.435q-15.957-15.392-15.957-37.479t15.957-37.609l43-42.565q15.392-14.957 36.979-14.957t37.109 14.957q15.957 14.957 15.457 36.826-.5 21.87-15.457 37.827l-41.435 43q-14.957 15.957-37.044 15.457-22.087-.5-38.609-15.457ZM480-480Z"/></svg>`;
    }
}

themeToggle.addEventListener("click", () => {
    if (mode == "light") switchMode("dark");
    else switchMode("light");
    localStorage.setItem("mode", mode);
});

window.addEventListener("keydown", (e) => {
    if (e.key == "f") {
        document.querySelector("html").requestFullscreen();
    }

    if (e.key == " ") {
        timeWrapper.click();
    }
});

const keysWords = [
    "Time is ticking...",
    "Every second counts",
    "Sands are slipping away",
];

setInterval(() => {
    const ranNum = Math.floor(Math.random() * 3);
    const quote = keysWords[ranNum];
    qs("title").innerText = quote;
}, 5000);

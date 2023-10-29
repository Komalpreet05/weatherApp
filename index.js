const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessBtn = document.querySelector("[data-grantAccess]");
let searchInput = document.querySelector("[data-searchInput]");

//initial variables reuqired
let currentTab = userTab;
const API_key = "dba92b871b8469679ec9371db91132d6";
currentTab.classList.add("current-tab");

//pending something

//switch tab logic
function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //currently in search tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    switchTab(userTab);
})

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
})

//check if coordinates are already pressent in session storage or not
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinate");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    //remove grant container from UI
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        //calling func to render data values to UI
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        //h.w.
        //console.log("Error" + err);
    }
}

function renderWeatherInfo(weatherInfo) {
    //fetch elements where we want to display data
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weather info object and put into UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windspeed = weatherInfo?.wind?.speed;
    humidity = weatherInfo?.main?.humidity;
    cloudiness = weatherInfo?.clouds?.all;

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //h.w.  show an alert for no geolocation
        alert("No Support available");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

//listener on grant access button to make user have access on location
grantAccessBtn.addEventListener("click", getLocation);

// search form event listener
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searchInput.value === "") {
        return;
    }
    else {
        fetchSearchWeatherInfo(searchInput.value);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {

    }
}














































// console.log("Komalpreet");
// const API_key = "dba92b871b8469679ec9371db91132d6";
// async function showWeather() {
//     // let latitude = 15.333;
//     // let longitude = 74.0833;
//     let city = "Brampton";
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
//     console.log("Response ");
//     const data = await response.json();
//     console.log(data);

//     //let json = JSON.parse(data);
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} c`;
//     let newPara2 = document.createElement('p');
//     newPara2.textContent = data["main"].temp;
//     document.body.appendChild(newPara);
//     document.body.appendChild(newPara2);

// }
// showWeather();
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessBtn = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");
const errorMsg1 = document.querySelector("[data-errorMsg1]");
const errorMsg2 = document.querySelector("[data-errorMsg2]");

//initial variables reuqired
let currentTab = userTab;
const API_key = "dba92b871b8469679ec9371db91132d6";
currentTab.classList.add("current-tab");

//pending something
getFromSessionStorage();

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
            //if currently in search tab
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
        errorMsg1.classList.remove("active");

        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        console.log(coordinates);
    }
    console.log(localCoordinates);
    //console.log(localCoordinates.JSON());
    console.log(JSON.parse(localCoordinates));
}

async function fetchUserWeatherInfo(coordinates) {
    console.log(coordinates);
    const { lat, lon } = coordinates;
    console.log(lat, lon);
    //remove grant container from UI
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        errorMsg1.classList.remove("active");

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        console.log(response);
        const data = await response.json();
        //console.log("Fetched data: " + JSON.stringify(data));
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        //calling func to render data values to UI
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        errorMsg2.classList.add("active");

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
    console.log(weatherInfo);
    //fetch values from weather info object and put into UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //show an alert for no geolocation
        alert("No Support available");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinate", JSON.stringify(userCoordinates));
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
        errorMsg1.classList.remove("active");

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        console.log(!data.sys);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        console.log("Error city not found " + err);
        loadingScreen.classList.remove("active");
        errorMsg1.classList.add("active");

    }
}


//or this way

// async function fetchSearchWeatherInfo(city) {
//     loadingScreen.classList.add("active");
//     userInfoContainer.classList.remove("active");
//     grantAccessContainer.classList.remove("active");

//     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`).then(response => response.json()).then((response) => { renderWeatherInfo(response) }).then(loadingScreen.classList.remove("active")).then(userInfoContainer.classList.add("active")).catch(err => console.error(err)
//     );


// try {
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
//     const data = await response.json();
//     loadingScreen.classList.remove("active");
//     userInfoContainer.classList.add("active");
//     renderWeatherInfo(data);
// }
// catch (err) {
//     let p = document.createElement('p');
//     p.textContent = "TESTING";
//     document.body.appendChild(p);
//     console.log("Error city not found " + err);
// }
//}
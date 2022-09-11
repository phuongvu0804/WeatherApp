

import { convertKelvinToCel, convertFahToCel, convertCelToFah } from "./constants.js";


//For profile page
const { pathname } = window.location;
let isCelcius = true;

const profileBtn = document.querySelector(".app-foot__btn.app-foot__btn--profile");
const searchHistory = document.querySelector(".profile__search-history-list");
const displayCurrentLocation = (data) => {
    //Display current location's weather
    document.querySelector(".profile__weather-card--curent .weather-card__title").innerText = data.location;
    document.querySelector(".profile__weather-card--curent .weather-card__content").innerText = `${convertKelvinToCel(data.temp)}°C`;
};

const renderHTMLs = () => {
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    return searchHistory.map(location => `
        <div class="profile__weather-card">
            <p class="weather-card__title">${location.location}</p>
            <span class="weather-card__content">${convertKelvinToCel(location.temp)}°C</span>
        </div>`).join("");
    
};


if (pathname === "/profile.html") {
    profileBtn.classList.add("active");

    //Get user info from local storage
    const currentLocation = JSON.parse(localStorage.getItem("currentLocation"));
    displayCurrentLocation(currentLocation);

    const htmls = renderHTMLs();
    searchHistory.innerHTML = htmls;
};

const historyCard = document.querySelectorAll(".profile__weather-card");
historyCard.forEach(item => {
    item.onclick = () => {
        if (isCelcius) {
            isCelcius = !isCelcius;
            const locationName = item.querySelector(".weather-card__content");
            const temp = locationName.innerText.slice(0, -2);
    
            const fahTemp = convertCelToFah(temp);
            locationName.innerText = `${fahTemp}°F`;
        } else {
            isCelcius = !isCelcius;
            const locationName = item.querySelector(".weather-card__content");
            const temp = locationName.innerText.slice(0, -2);
    
            const celTemp = convertFahToCel(temp);
            locationName.innerText = `${celTemp}°C`;
        };
    };
});
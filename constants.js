const apiKeyWeather = "770de780ae88163d36266e3e2b0835f2";
const apiKeyLocation = "T5LHuF1z6+qQ3rY3oJ993w==NG6SjZHK9qkF26q6";

const app = document.querySelector(".weather-app");
const currentLocation = document.querySelector(".content__location");
const currentWeather = document.querySelector(".main-info__content h2");
const currentTemp = document.querySelector(".main-info__content p");
const windData = document.querySelector(".sub-info.sub-info--wind .sub-info__content h3");
const cloudData = document.querySelector(".sub-info.sub-info--cloud .sub-info__content h3");
const feelLikeData = document.querySelector(".sub-info.sub-info--feel-like .sub-info__content h3");
const locationSelection = document.querySelector(".location__input");
const errorMsg = document.querySelector(".app__msg--error");
const mainContent = document.querySelector(".content__main-info");
const profileBtn = document.querySelector(".app-foot__btn.app-foot__btn--profile");
const searchHistory = document.querySelector(".profile__search-history-list");

const convertKelvinToCel = (temp) => {
    return Math.round(temp - 273.15);
};

const convertFahToCel = (temp) => {
    return Math.round((temp - 32) * 5/9);
};

const convertKelvinToFah = (temp) => {
    return Math.round((temp - 273.15) * 9/5 + 32);
}; 

const convertCelToFah = (temp) => {
    return Math.round((temp * 9/5) + 32);
}; 

const convertToKmPerHour = (speed) => {
    return Math.round(speed * 3.6);
};

export { 
    apiKeyWeather,
    apiKeyLocation,
    app, 
    currentLocation, 
    currentWeather, 
    currentTemp, 
    windData, 
    cloudData, 
    feelLikeData, 
    locationSelection, 
    errorMsg, 
    mainContent,
    convertKelvinToCel,
    convertFahToCel, 
    convertCelToFah, 
    convertKelvinToFah, 
    convertToKmPerHour,
    profileBtn,
    searchHistory
};
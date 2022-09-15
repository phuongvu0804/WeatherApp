const apiKeyWeather = "770de780ae88163d36266e3e2b0835f2";
const apiKeyLocation = "T5LHuF1z6+qQ3rY3oJ993w==NG6SjZHK9qkF26q6";

const app = document.querySelector(".weather-app");
const currentTemp = document.querySelector(".main-info__content p");
const locationSelection = document.querySelector(".location__input");
const errorMsg = document.querySelector(".app__msg--error");
const mainContent = document.querySelector(".content__main-info");
const profileBtn = document.querySelector(".app-foot__btn.app-foot__btn--profile");
const searchHistory = document.querySelector(".profile__search-history-list");
const searchBtn = document.querySelector(".location__btn");
const lightThemeBtn = document.querySelector(".theme__select-btn.theme__select-btn--light");
const darkThemeBtn = document.querySelector(".theme__select-btn.theme__select-btn--dark");

let darkTheme = true;

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

//Change dark/light theme
const handleStyleTheme = () => {
    if (darkTheme) {
        darkThemeBtn.classList.add("active");
        lightThemeBtn.classList.remove("active");
    } else {
        darkThemeBtn.classList.remove("active");
        lightThemeBtn.classList.add("active");
    }

};

const handleChangeTheme = (theme) => {   
    if (theme) {
        darkTheme = true;
        handleStyleTheme();
        document.querySelector(".weather-app").classList.remove("light");

    } else {
        darkTheme = false;
        handleStyleTheme();
        document.querySelector(".weather-app").classList.add("light");
    };
};

export { 
    apiKeyWeather,
    apiKeyLocation,
    app, 
    currentTemp, 
    locationSelection, 
    errorMsg, 
    mainContent,
    convertKelvinToCel,
    convertFahToCel, 
    convertCelToFah, 
    convertKelvinToFah, 
    convertToKmPerHour,
    profileBtn,
    searchHistory,
    searchBtn,
    handleStyleTheme,
    handleChangeTheme,
    lightThemeBtn,
    darkThemeBtn
};
const apiKeyWeather = "770de780ae88163d36266e3e2b0835f2";
const apiKeyLocation = "T5LHuF1z6+qQ3rY3oJ993w==NG6SjZHK9qkF26q6";

const app = document.getElementById("weather-app");
const currentLocation = document.querySelector(".content__location");
const currentWeather = document.querySelector(".main-info__content h2");
const currentTemp = document.querySelector(".main-info__content p");
const windData = document.querySelector(".sub-info.sub-info--wind .sub-info__content h3");
const cloudData = document.querySelector(".sub-info.sub-info--cloud .sub-info__content h3");
const feelLikeData = document.querySelector(".sub-info.sub-info--feel-like .sub-info__content h3");
const locationSelection = document.querySelector(".location__input");
const errorMsg = document.querySelector(".app__msg--error");
const mainContent = document.querySelector(".content__main-info");

let currentTempData = {};
let isCelcius = true;
let isLoading = true;
let darkTheme = true;

const convertTempToCel = (temp) => {
    return Math.round(temp - 273.15);
};

const convertTempToFah = (temp) => {
    return Math.round((temp - 273.15) * 9/5 + 32);
}; 

const convertToKmPerHour = (speed) => {
    return Math.round(speed * 3.6);
};

const handleDisplayData = (data) => {
    currentLocation.innerText = data.name;
    currentTemp.innerText = `${convertTempToCel(data.main.temp)}°C`;
    currentWeather.innerText = data.weather[0].main

    windData.innerText = `${convertToKmPerHour(data.wind.speed)} km/h`;
    cloudData.innerText = `${data.clouds.all}%`;
    feelLikeData.innerText = `${convertTempToCel(data.main.feels_like)}°C`;
}

const handleDisplayError = (error) => {
    errorMsg.classList.add("d-block");
    errorMsg.innerText = error;
};

const handleStyleButton = (buttonClass) => {
    const buttons = document.querySelectorAll(".app-foot__btn");
    buttons.forEach((button) => {
        if (button.className.includes("active")) {
            button.classList.remove("active")
        };
    });
    document.querySelector(buttonClass).classList.add("active");
};

const fetchWeatherData = (lat, lon) => {
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}`

    fetch(weatherApi)
        .then((response) => response.json())
        .then((data) => {
            isLoading = false;

            handleLoading();
            currentTempData = {
                location: data.name,
                temp: data.main.temp,
                weather: data.weather[0].main,
                wind: data.wind.speed,
                cloud: data.clouds.all,
                feelLike: data.main.feels_like
            }
            handleDisplayData(data);
        })
        .catch((error) => {
            handleDisplayError(error);
        });
}

const getCurrentWeatherData = () => {
      //If user allows to locate position
      if(navigator.geolocation) {
        let lon;
        let lat;
        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            
            fetchWeatherData(lat, lon)
        }, (error) => errorMsg.innerText = error);
    };  
};

window.addEventListener("load", () => {
    isLoading = true;
    getCurrentWeatherData();
});


//Search location
document.querySelector(".app-foot__btn.app-foot__btn--search").onclick = () => {
    handleStyleButton(".app-foot__btn.app-foot__btn--search");
    locationSelection.focus();
};

const handleSearchLocation = () => {
    isLoading = true;
    handleLoading();

    const searchInput = document.querySelector(".location__input").value;
    const locationApi = `https://api.api-ninjas.com/v1/city?name=${searchInput}`;
    fetch(locationApi, { 
        method: 'GET',
        headers: {
            "X-Api-Key": apiKeyLocation
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.length) {
                const location = data[0];
                fetchWeatherData(location.latitude, location.longitude);
            }
        })
        .catch((error) => handleDisplayError(error));
};

//Change from Celsius to Fahrenheit
mainContent.onclick = () => { 
    if (isCelcius) {
        isCelcius= !isCelcius;
        const fahTemp = convertTempToFah(currentTempData.temp);
        currentTemp.innerText = fahTemp + "°F";
    } else {
        isCelcius = !isCelcius;
        const celTemp = convertTempToCel(currentTempData.temp);
        currentTemp.innerText = celTemp + "°C";

    }
};


//Back to home function
document.querySelector(".app-foot__btn.app-foot__btn--home").onclick = () => {
    handleStyleButton(".app-foot__btn.app-foot__btn--home");
    getCurrentWeatherData();
};


//Change dark/light theme
const handleStyleTheme = () => {
    if (darkTheme) {
        document.querySelector(".theme__select-btn#dark").classList.add("active");
        document.querySelector(".theme__select-btn#light").classList.remove("active");
    } else {
        document.querySelector(".theme__select-btn#dark").classList.remove("active");
        document.querySelector(".theme__select-btn#light").classList.add("active");
    }

};

handleStyleTheme();

const handleChangeTheme = (theme) => {   

    if (theme) {
        darkTheme = true;
        handleStyleTheme();
        document.querySelector("#weather-app").classList.remove("light");

    } else {
        darkTheme = false;
        handleStyleTheme();
        document.querySelector("#weather-app").classList.add("light");

    };
};

//Handle page's loading
const handleLoading = () => {    
    const loader = document.querySelector(".loader");
    if (isLoading) {
        if (!loader) {
            const loader = document.createElement("div");
            loader.classList.add("loader");
            app.insertBefore(loader, app.children[1]);
            document.querySelector(".app__content").style.display = "none";
        }
    } else {
        document.querySelector(".app__content").style.display = "block";
        if (loader) {
            app.removeChild(loader)
        };

    };
};

handleLoading();

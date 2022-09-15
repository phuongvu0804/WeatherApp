import { 
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
    convertKelvinToFah, 
    convertToKmPerHour
} from "./constants.js";


let currentTempData = {};
let searchHistory = [];
let isCelcius = true;
let isLoading = true;
let darkTheme = true;


const handleDisplayData = (data) => {
    currentLocation.innerText = data.name;
    currentTemp.innerText = `${convertKelvinToCel(data.main.temp)}°C`;
    currentWeather.innerText = data.weather[0].main

    windData.innerText = `${convertToKmPerHour(data.wind.speed)} km/h`;
    cloudData.innerText = `${data.clouds.all}%`;
    feelLikeData.innerText = `${convertKelvinToCel(data.main.feels_like)}°C`;
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

const handleCheckHistory = (locationName) => {
    const localStorageHistory = JSON.parse(localStorage.getItem("searchHistory"));

    let isExisted = false;
    console.log(localStorageHistory.indexOf(locationName))
    localStorageHistory.forEach((item) => {
        if (item.location === locationName) {
            return isExisted = true;
        }
    })
    return isExisted;
}

const fetchWeatherData = (lat, lon, type) => {
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}`

    fetch(weatherApi)
        .then((response) => response.json())
        .then((data) => {
            isLoading = false;

            handleLoading();

            if (type === "current") {
                currentTempData = {
                    location: data.name,
                    temp: data.main.temp,
                    weather: data.weather[0].main,
                    wind: data.wind.speed,
                    cloud: data.clouds.all,
                    feelLike: data.main.feels_like
                }
    
                //Save info about current location's weather to local storage
                localStorage.setItem("currentLocation", JSON.stringify(currentTempData))
            } else if (type === "search") {
                const localStorageHistory = JSON.parse(localStorage.getItem("searchHistory"));

                //Check if user has searched before
                if (localStorageHistory) {
                    const isExisted = handleCheckHistory(data.name);
                    console.log(isExisted)
                    if (!isExisted) {
                        console.log("not existed")
                        searchHistory = [...localStorageHistory, {
                            location: data.name,
                            temp: data.main.temp,
                            weather: data.weather[0].main,
                            wind: data.wind.speed,
                            cloud: data.clouds.all,
                            feelLike: data.main.feels_like
                        }];
        
                        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                    };

                } else {
                    console.log("no ls")
                    searchHistory = [{
                        location: data.name,
                        temp: data.main.temp,
                        weather: data.weather[0].main,
                        wind: data.wind.speed,
                        cloud: data.clouds.all,
                        feelLike: data.main.feels_like
                    }];
    
                    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                };


            };

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
            
            fetchWeatherData(lat, lon, "current")
        }, (error) => errorMsg.innerText = error);
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

window.addEventListener("load", () => {
    isLoading = true;
    getCurrentWeatherData();
});


//Search location
document.querySelector(".app-foot__btn.app-foot__btn--search").onclick = () => {
    handleStyleButton(".app-foot__btn.app-foot__btn--search");
    locationSelection.focus();
};

document.querySelector(".location__btn").onclick = () => {
    isLoading = true;
    handleLoading();

    const searchInput = document.querySelector(".location__input").value.replaceAll(" ","");
    //Get searched info
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
        
                //Save searching data to local storage
                fetchWeatherData(location.latitude, location.longitude, "search");
            }
        })
        .catch((error) => handleDisplayError(error));
};

//Change from Celsius to Fahrenheit
mainContent.onclick = () => { 
    if (isCelcius) {
        isCelcius= !isCelcius;
        const fahTemp = convertKelvinToFah(currentTempData.temp);
        currentTemp.innerText = fahTemp + "°F";
    } else {
        isCelcius = !isCelcius;
        const celTemp = convertKelvinToCel(currentTempData.temp);
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
    console.log(theme)
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

document.querySelector(".theme__select-btn#light").onclick = () => handleChangeTheme(false);
document.querySelector(".theme__select-btn#dark").onclick = () => handleChangeTheme(true);

import { 
    apiKeyWeather,
    apiKeyLocation,
    app, 
    currentTemp, 
    locationSelection, 
    errorMsg, 
    mainContent,
    convertKelvinToCel,
    convertKelvinToFah, 
    convertToKmPerHour,
    searchBtn,
    handleStyleTheme,
    handleChangeTheme,
    lightThemeBtn,
    darkThemeBtn
} from "./constants.js";


let currentTempData = {};
let searchHistory = [];
let isCelcius = true;
let isLoading = true;


const handleDisplayData = (data) => {
    document.querySelector(".app__content").innerHTML = `
        <h1 class="content__title">Today's report</h1>
        <p class="content__location">${data.name}</p>
        <div class="app__msg--error alert alert-danger" role="alert"></div>
        <div class="content__main-info">
            <div class="main-info__img">
                <img src="https://ssl.gstatic.com/onebox/weather/64/sunny_s_cloudy.png" alt="">
            </div>
            <div class="main-info__content">
                <h2>${data.weather[0].main}</h2>
                <p>${convertKelvinToCel(data.main.temp)}°C</p>
            </div>
        </div>
        <ul class="content__sub-info">
            <li class="sub-info sub-info--wind">
                <div class="sub-info__img">
                    <i class="fa-sharp fa-solid fa-wind"></i>
                </div>
                <div class="sub-info__content">
                    <h3>${convertToKmPerHour(data.wind.speed)} km/h</h3>
                    <p>Wind</p>
                </div>
            </li>
            <li class="sub-info sub-info--cloud">
                <div class="sub-info__img">
                    <i class="fa-solid fa-cloud"></i>
                </div>
                <div class="sub-info__content">
                    <h3>${data.clouds.all}%</h3>
                    <p>Cloud</p>
                </div>
            </li>
            <li class="sub-info sub-info--feel-like">
                <div class="sub-info__img">
                    <i class="fa-solid fa-temperature-quarter"></i>
                </div>
                <div class="sub-info__content">
                    <h3>${convertKelvinToCel(data.main.feels_like)}°C</h3>
                    <p>Feel like</p>
                </div>
            </li>
            
        </ul>
    `;
};

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
    localStorageHistory.forEach((item) => {
        if (item.location === locationName) {
            return isExisted = true;
        }
    })
    return isExisted;
}

//Get weather info based on longitude and latitude
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
                    if (!isExisted) {
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

//Get current longitude and latitude
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

searchBtn.onclick = () => {
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
            //If location is found
            if (data.length > 0) {
                const location = data[0];
        
                //Save searching data to local storage
                fetchWeatherData(location.latitude, location.longitude, "search");
            } else { //If no location is found
                isLoading = false;
                handleLoading();

                // const h3 = document.createElement("h3");
                // h3.textContent = "No location is found";
                document.querySelector(".app__content").innerHTML = "<h3>No location is found</h3>";
            };

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
handleStyleTheme();

lightThemeBtn.onclick = () => handleChangeTheme(false);
darkThemeBtn.onclick = () => handleChangeTheme(true);

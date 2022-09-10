const apiKey = "770de780ae88163d36266e3e2b0835f2"

const locationsArray = [ "Hanoi", "Espoo", "Berlin"]

const currentLocation = document.querySelector(".content__location");
const currentWeather = document.querySelector(".main-info__content h2");
const currentTemp = document.querySelector(".main-info__content p");
const windData = document.querySelector(".sub-info.sub-info--wind .sub-info__content h3");
const cloudData = document.querySelector(".sub-info.sub-info--cloud .sub-info__content h3");
const feelLikeData = document.querySelector(".sub-info.sub-info--feel-like .sub-info__content h3");
const locationSelection = document.querySelector(".location__input")
const selectInput = locationSelection.options[locationSelection.selectedIndex]

locationSelection.innerHTML = locationsArray.map(location => `<option>${location}</option>`).join("")

const convertTempToCel = (temp) => {
    return Math.round(temp - 273.15)
} 

const convertTempToFah = (temp) => {
    return Math.round((temp - 273.15) * 9/5 + 32)
} 

const convertToKmPerHour = (speed) => {
    return Math.round(speed * 3.6)
}

const handleDisplayData = (data) => {
    currentLocation.innerText = data.name;
    currentTemp.innerText = `${convertTempToCel(data.main.temp)}°C`;
    currentWeather.innerText = data.weather[0].main

    windData.innerText = `${convertToKmPerHour(data.wind.speed)} km/h`
    cloudData.innerText = `${data.clouds.all}%`
    feelLikeData.innerText = `${convertTempToCel(data.main.feels_like)}°C`
}

window.addEventListener("load", () => {

    //If user allows to locate position
    if(navigator.geolocation) {

        let lon;
        let lat;
        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
            
            fetch(weatherApi)
                .then((response) => response.json())
                .then((data) =>{
                    handleDisplayData(data)
                    console.log(data)
                    
                    //Change location input
                    locationSelection.value = data.name

                })
                .catch((error) => alert(error))
        }, (error) => alert(error))
    }
})



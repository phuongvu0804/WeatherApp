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

export {convertKelvinToCel, convertFahToCel, convertCelToFah, convertKelvinToFah, convertToKmPerHour};
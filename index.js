const userTab = document.querySelector("[data-userWeather")
const searchTab = document.querySelector("[data-searchWeather")

const userContainer = document.querySelector(".weather-container")

const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector(".form-container")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")



// 404 Error Handling

const errorContainer = document.querySelector(".errorContainer")



let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage()

function switchTab(clickedTab){

    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab
        currentTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active")) {

            // -----------
            searchTab.style.pointerEvents = "none"
            userTab.style.pointerEvents = "all"
            // -----------
            
            grantAccessContainer.classList.remove("active")
            userInfoContainer.classList.remove("active")
            searchForm.classList.add("active")
            errorContainer.classList.remove("active")

            // -------------------------------------------------------------------------

            // searchTab.addEventListener("click", (e) => {

            //     e.preventDefault()
            //     let cityName = searchInput.value
            
            //     if(cityName === ""){
            //         return
            //     }
            //     else{
            //         fetchSearchWeatherInfo(cityName)
            //     }
            // })

            // --------------------------------------------------------------------------
        }
        else {
            
            searchForm.classList.remove("active")
            userInfoContainer.classList.remove("active")
            loadingScreen.classList.remove("active")
            errorContainer.classList.remove("active")


            // -----------
            searchTab.style.pointerEvents = "all"
            userTab.style.pointerEvents = "none"
            // -----------
            

            getfromSessionStorage()
        }
    }
    else{
        errorContainer.classList.remove("active")
    }
}

searchTab.addEventListener("click", () => {

    // e.preventDefault()
    let cityName = searchInput.value

    if(cityName === ""){
        return
    }
    else{
        fetchSearchWeatherInfo(cityName)
    }
})


userTab.addEventListener("click",() => {

    switchTab(userTab)           // pass clicked tab as input parameter
})

searchTab.addEventListener("click",() => {

    switchTab(searchTab)         // pass clicked tab as input parameter
})

function getfromSessionStorage() {

    const localCoordinates = sessionStorage.getItem("user-coordinates")

    if(!localCoordinates) {
        grantAccessContainer.classList.add("active")
    }
    else {
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates) {

    const {lat , lon} = coordinates

    grantAccessContainer.classList.remove("active")
    loadingScreen.classList.add("active")

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        )
        const data = await response.json()

        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")

        renderWeatherInfo(data)
    }
    catch(err) {
        loadingScreen.classList.remove("active")

        // add something
    }
}

function renderWeatherInfo(weatherInfo) {

    let city_code = weatherInfo?.cod
    if(city_code === "404"){
        errorContainer.classList.add("active")
        userInfoContainer.classList.remove("active")
    }
    else{
        
        errorContainer.classList.remove("active")

        const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    cityName.innerText = weatherInfo?.name


    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerText = weatherInfo?.weather?.[0]?.description
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText = `${weatherInfo?.main?.temp} °C`
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`
    humidity.innerText = `${weatherInfo?.main?.humidity}%`
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`
    }

    // --------------------------

    // const city_code = weatherInfo?.cod

    // --------------------------
}

function getLocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        // HW - show an alert for no geolocation support available
    }
}

function showPosition(position){

    const userCoordinates = {

        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}

const grantAccessButton = document.querySelector("[data-grantAccess]")
grantAccessButton.addEventListener("click", getLocation)

const searchInput = document.querySelector("[data-searchInput]")



searchForm.addEventListener("submit", (e) => {


    e.preventDefault()
    let cityName = searchInput.value

    
        if(cityName === ""){
            return
        }
        // else if(cityName === undefined){
    
        //     errorContainer.classList.add("active")
        // }
        else{
            errorContainer.classList.remove("active")
            
            fetchSearchWeatherInfo(cityName)
        }
    
})

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )
        const data = await response.json()

        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)

        
    }
    catch(err) {
        // HW -  handle this error

        // grantAccessContainer.classList.add("active")
    }
}








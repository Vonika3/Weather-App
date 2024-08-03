const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".data-loadingContainer");
const userInfoContainer=document.querySelector(".user-info-container");

let currentTab=userTab;
const API_KEY="f7abc7745748aa9d6d1c6b10f3610083";
currentTab.classList.add("current-tab")
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        // console.log("I have changed");
        if(!searchForm.classList.contains("active")){
            // Is searchForm container Invisible? 
            // If yes then make it visible.
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // I was earlier on searchtab but now yourWeather tab should be visible
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // Now I am inside your weather so,
            // Now I have to make yourWeather location visible
            // So lets cheack local storage for coordinates, if we have saved them there.
            getfromSessionStorage();
        }
    }
}

// searchTab.addEventListener("click",()=>{
//     console.log("I am beeing clicked");
// });

userTab.addEventListener("click",()=>{
    // passing clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    // passing clicked tab as input parameter
    switchTab(searchTab);
});

//  to check if coordinates are already present in seesion storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // if local coordinates are not present
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    // const city=FoundCity(lat,lon);

    // make grantcontainer Invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");
    // API CALL
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`); //&units=metric
        const data=await response.json();
        loadingScreen.classList.remove("active");   
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active"); 
        // HW
        console.log("API call mai error ayein hai");
    }
}

function renderWeatherInfo(weatherInfo){
    // console.log(weatherInfo);
    // Firstly we have to fetch the elements

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    // fetch values from weatherInfo object and put it UI elements
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    const tempKelvin=weatherInfo?.main?.temp;
    const tempCelcius=tempKelvin-273.15;
    temp.innerText=`${tempCelcius.toFixed(2)}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
    
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // Show an alert for no geolocation support available
        alert('geolocation not availavle');
    }
}

function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName === "") return;
    else{
        fetchSearchWeatherInfo(cityName);
    }

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response =await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log("City API call error");
    }
}
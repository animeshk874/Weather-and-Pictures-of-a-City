"use strict";

var keys = {
    img: "<Your Pixabay key here>",
    weather: "<Your Open Weather Map key here>"
}

//Cache the DOM Elements

var DOMElements = {
    cityDropdown: document.getElementById("city-dropdown"),
    form: document.getElementById("form"),
    imgGallery: document.getElementById("img-gallery"),
    submitButton: document.getElementById("submit"),
    $weatherContainer: $(".weather-container"),
    $cityName: $("#city-name"),
    $temperature: $("#temperature"),
    $weatherType: $("#weather-type"),
    weatherIcon: document.getElementById("weather-icon"),
    $maxTemp: $(".max-temp .temperature-value"),
    $minTemp: $(".min-temp .temperature-value"),
    $windSpeed: $("#wind-speed"),
    $humidity: $(".humidity-container .text"),
    $loader: $(".loader")
};


DOMElements.form.addEventListener("submit", function publishFormSubmitted(e){
    e.preventDefault();
    DOMElements.submitButton.setAttribute("disabled", "disabled");
    DOMElements.$loader.show();
    var data = DOMElements.cityDropdown.value;
    $.publish("formSubmitted", {cityName: data});
});


//All the subscriptions here

$.subscribe("formSubmitted", fetchWeather);
$.subscribe("formSubmitted", fetchImages);
$.subscribe("weatherResponseRecieved", handleWeatherResponse);
$.subscribe("imageResponseRecieved", handleImageResponse);


//Function implementations here

function fetchWeather(ev, data){
    $.getJSON("http://api.openweathermap.org/data/2.5/weather", {
            appid: keys.weather,
            q: data.cityName,
            units: "metric" //for celsius temperature
        }, function publishWeatherResponeRecieved(res){ $.publish("weatherResponseRecieved", res); }
    );
}


function handleWeatherResponse(ev, res){
    DOMElements.$cityName.text(DOMElements.cityDropdown.value);
    DOMElements.$temperature.html((Number(res.main.temp)).toFixed(0) + "&deg;");
    DOMElements.$weatherType.text(res.weather[0].main);
    DOMElements.weatherIcon.className = "wi wi-owm-" + res.weather[0].id;
    DOMElements.$maxTemp.html((Number(res.main.temp_max)).toFixed(0) + "&deg;");
    DOMElements.$minTemp.html((Number(res.main.temp_min)).toFixed(0) + "&deg;");
    DOMElements.$windSpeed.text((Number(res.wind.speed)).toFixed(0) + " m/s");
    DOMElements.$humidity.text((Number(res.main.humidity)).toFixed(0) + " %");
    DOMElements.$weatherContainer.fadeIn(200);
}


function fetchImages(ev, data){
    //remove existing images
    $(".gallery-img-container").hide().remove();

    $.getJSON("https://pixabay.com/api/", {
            key: keys.img,
            q: data.cityName,
            image_type: "photo",
            pretty: true
        }, function publishImageResponeRecieved(res){ $.publish("imageResponseRecieved", res); }
    );
}


function handleImageResponse(ev, res){
    var loadedCount = 0;
    $(".img-gallery").hide();
    console.log(res);
    for(let i = 0; i < res.hits.length; i++){
        count++;
        let img;
        let el = document.createElement("div");
        el.className = "gallery-img-container";
        img = document.createElement("img");
        img.src = res.hits[i].previewURL;
        img.alt = "";
        img.className = "blurred-img gallery-img";
        img.setAttribute("data-src", res.hits[i].largeImageURL);
        el.appendChild(img);
        DOMElements.imgGallery.appendChild(el);
        
        var count = 0;
        $(img).on("load", function(){
            count++;
            if(count == 20){
                $(".img-gallery").show();
                DOMElements.$loader.hide();
                $(".gallery-img").addClass("zoomIn");
                setTimeout(loadHighResImages, 450);
            }
        })

        function loadHighResImages(){
            var smallImages = document.getElementsByClassName("gallery-img");
            var count = 0;
            for(let i = 0; i < smallImages.length; i++){
                let src = smallImages[i].getAttribute("data-src");
                let bigImg = document.createElement("img");
                bigImg.src = src;
                $(bigImg).on("load", function(){
                    count++;
                    smallImages[i].src = src;
                    $(smallImages[i]).off("load");
                    smallImages[i].className = "gallery-img";

                    if(count == smallImages.length){
                        DOMElements.submitButton.removeAttribute("disabled");
                    }
                });
            }
        }
    }
}


function showImages(){
    console.log("entered");
    $(".gallery-img-container")
        .css({"display": "block"})
        .addClass("zoomIn");
}
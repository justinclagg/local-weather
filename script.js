$(document).ready(function() {
	"use strict";

	var currTempK, currTempC, currTempF;

	// Parameters for getCurrentPosition()
	var geoOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 30000
	};

	if (navigator.geolocation) {
		// Get current position if geolocation API is supported
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
	}
	else {
		// Otherwise use IP to approximate location
		weatherByIP();
	}

	function geoSuccess(position) {
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		displayWeather(lat, long);
	}

	function geoError() {
		weatherByIP();
	}

	// If geolocation fails, use the IP location
	function weatherByIP() {
		$.ajax({
			dataType: "json",
			url: "https://freegeoip.net/json/"
		})
		.done(function(json) {
			displayWeather(json.latitude, json.longitude);
		});
	}
  
	function displayWeather(lat, long) {
		var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=837f371adf5a889d3380e7bf5f1f4e27";
		$.ajax({
			dataType: "json",
			url: weatherAPI
		})
		.done(function(json) {
			// Display the city name
			$("#location").html(json.name);
			// Calculate and display temperature values
			currTempK = json.main.temp;
			currTempC = Math.round(currTempK - 273.15);
			currTempF = Math.round(currTempK * 9 / 5 - 459.67);        
			$("#currentTemp").html(currTempF);
			// Background images
			var clearSkyDay = "./img/clearSky_day.jpg",
				clearSkyNight = "./img/clearSky_night.jpg",
				fewCloudsDay = "./img/fewClouds_day.jpg",
				fewCloudsNight = "./img/fewClouds_day.jpg",
				brokenCloudsDay = "./img/brokenClouds_day.jpg",
				brokenCloudsNight = "./img/brokenClouds_day.jpg",
				rainDay = "./img/rain_night.jpg",
				rainNight = "./img/rain_night.jpg",
				thunderstormDay = "./img/rain_night.jpg",
				thunderstormNight = "./img/rain_night.jpg",
				snowDay = "./img/snow_day.jpg",
				snowNight = "./img/snow_day.jpg";
			// Display the appropriate background image and weather description
			switch (json.weather[0].icon) { 
			case "01d":
				$("body").css("background-image", "url('" + clearSkyDay + "')");
				$("#description").html("Clear Skies");
				break;
			case "01n":
				$("body").css("background-image", "url('" + clearSkyNight + "')");
				$("#description").html("Clear Skies");
				break;
			// Combine few clouds and scattered clouds
			case "02d":
			case "03d":
				$("body").css("background-image", "url('" + fewCloudsDay + "')");
				$("#description").html("Scattered Clouds");
				break;
			case "02n":
			case "03n":
				$("body").css("background-image", "url('" + fewCloudsNight + "')");
				$("#description").html("Scattered Clouds");
				break;
			case "04d":
				$("body").css("background-image", "url('" + brokenCloudsDay + "')");
				$("#description").html("Cloudy");
				break;
			case "04n":
				$("body").css("background-image", "url('" + brokenCloudsNight + "')");
				$("#description").html("Cloudy");
				break;
			case "09d":
				$("body").css("background-image", "url('" + rainDay + "')");
				$("#description").html("Scattered Showers");
				break;
			case "09n":
				$("body").css("background-image", "url('" + rainNight + "')");
				$("#description").html("Scattered Showers");
				break;
			case "10d":
				$("body").css("background-image", "url('" + rainDay + "')");
				$("#description").html("Rain");
				break;
			case "10n":
				$("body").css("background-image", "url('" + rainNight + "')");
				$("#description").html("Rain");
				break;
			case "11d":
				$("body").css("background-image", "url('" + thunderstormDay + "')");
				$("#description").html("Thunderstorm");
				break;
			case "11n":
				$("body").css("background-image", "url('" + thunderstormNight + "')");
				$("#description").html("Thunderstorm");
				break;
			case "13d":
				$("body").css("background-image", "url('" + snowDay + "')");
				$("#description").html("Snow");
				break;
			case "13n":
				$("body").css("background-image", "url('" + snowNight + "')");
				$("#description").html("Snow");
				break;
			}
			// Displays the weather data once loaded
			$(".weather-box").removeClass("loading");
		});
	}

	// Switch from Fahrenheit to Celsius
	$("#celsius").on("click", function() {
		$("#currentTemp").html(currTempC);
		$(this).addClass("active").removeAttr("href");
		$("#fahrenheit").removeClass("active").attr("href", "#");
	});

	// Switch from Celsius to Fahrenheit
	$("#fahrenheit").on("click", function() {
		$("#currentTemp").html(currTempF);
		$(this).addClass("active").removeAttr("href");
		$("#celsius").removeClass("active").attr("href", "#");
	});

});

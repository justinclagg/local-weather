// Webpack entry

require('./main.css');

$(document).ready(function () {
	'use strict';

	// Parameters for getCurrentPosition()
	const geoOptions = {
		enableHighAccuracy: true,
		timeout: 2000,
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
		const lat = position.coords.latitude;
		const lon = position.coords.longitude;
		getCity(lat, lon);
	}

	function geoError() {
		weatherByIP();
	}

	// If geolocation fails, use the IP location
	function weatherByIP() {
		$.ajax({
			dataType: 'json',
			url: 'https://freegeoip.net/json/'
		})
		.done(json => {
			displayWeather(json.lat, json.lon, json.city);
		});
	}

	// Darksky.net does not provide city name, so Google's API is used
	function getCity(lat, lon) {
		$.ajax({
			dataType: 'json',
			url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_KEY}`
		})
		.done(json => {
			const city = json.results[0].address_components[2].long_name;
			displayWeather(lat, lon, city);
		});
	}

	let currTempC, currTempF;

	function displayWeather(lat, lon, city) {
		const weatherAPI = `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET}/${lat},${lon}?exclude=minutely,hourly,daily,alerts,flags`;
		$.ajax({
			dataType: 'jsonp',
			url: weatherAPI
		})
		.done(function (json) {
			$('#location').html(city);
			// Calculate and display temperature values
			currTempF = Math.round(json.currently.temperature);
			currTempC = Math.round((currTempF - 32) * 5 / 9);
			$('#currentTemp').html(currTempF);
			// Background images
			const clearSkyDay = './img/clearSky_day.jpg';
			const clearSkyNight = './img/clearSky_night.jpg';
			const fewCloudsDay = './img/fewClouds_day.jpg';
			const fewCloudsNight = './img/fewClouds_day.jpg';
			const rainDay = './img/rain_night.jpg';
			const thunderstormDay = './img/rain_night.jpg';
			const snowDay = './img/snow_day.jpg';
			/* Possible future backgrounds */
			// const brokenCloudsDay = './img/brokenClouds_day.jpg';
			// const brokenCloudsNight = './img/brokenClouds_day.jpg';
			// const rainNight = './img/rain_night.jpg';
			// const thunderstormNight = './img/rain_night.jpg';
			// const snowNight = './img/snow_day.jpg';

			// Display the appropriate background image and weather description
			switch (json.currently.icon) {
			case 'clear-day':
				$('body').css('background-image', 'url(\'' + clearSkyDay + '\')');
				$('#description').html('Clear Skies');
				break;
			case 'clear-night':
				$('body').css('background-image', 'url(\'' + clearSkyNight + '\')');
				$('#description').html('Clear Skies');
				break;
			case 'partly-cloudy-day':
				$('body').css('background-image', 'url(\'' + fewCloudsDay + '\')');
				$('#description').html('Scattered Clouds');
				break;
			case 'partly-cloudy-night':
				$('body').css('background-image', 'url(\'' + fewCloudsNight + '\')');
				$('#description').html('Scattered Clouds');
				break;
			case 'rain':
				$('body').css('background-image', 'url(\'' + rainDay + '\')');
				$('#description').html('Scattered Showers');
				break;
			case 'thunderstorm':
				$('body').css('background-image', 'url(\'' + thunderstormDay + '\')');
				$('#description').html('Thunderstorm');
				break;
			case 'snow':
				$('body').css('background-image', 'url(\'' + snowDay + '\')');
				$('#description').html('Snow');
				break;
			default:
				$('body').css('background-image', 'url(\'' + fewCloudsDay + '\')');
				$('#description').html(json.currently.summary);
			}
			// Displays the weather data once loaded
			$('#loadingScreen').addClass('hidden');
			$('.weather-box').removeClass('hidden');
		});
	}

	// Switch from Fahrenheit to Celsius
	$('#celsius').on('click', () => {
		$('#currentTemp').html(currTempC);
		$(this).addClass('active').removeAttr('href');
		$('#fahrenheit').removeClass('active').attr('href', '#');
	});

	// Switch from Celsius to Fahrenheit
	$('#fahrenheit').on('click', () => {
		$('#currentTemp').html(currTempF);
		$(this).addClass('active').removeAttr('href');
		$('#celsius').removeClass('active').attr('href', '#');
	});
});
// import preact
import { h, Component } from 'preact';
import 'regenerator-runtime/runtime'

// import required Components from 'components/'
import Iphone from './iphone';
import Temperature from './temperature';
import CitySelect from './CitySelect';
import Clothing from './clothing';


const APICALLS = {
	ONECALL: "onecall",
	WEATHER: "weather"
}

const PAGES = {
	HOME: "/",
	ADDCITY: "/addcity",
	CLOTHING: "/clothing",
	TEMPERATURE: "/temperature"
}

export default class App extends Component {
	//var App = React.createClass({

	// a constructor with initial set states
	constructor(props) {
		super(props);
		this.setState({
			APIkey: "6f2a47f265451205fd36bba4ca28ada0",
			latitude: 0,
			longitude: 0,
			refreshAPI: true,
			isUsersCurrentLocation: false,
			parsedtemperatureData: {},
			clothingItems: [],
			responses: {
				weather: {},
				onecall: {}
			},
			currentPage: "/",
			// Populate the cities with random data
			cities: [{ key: this.key(), county: 'London', country: 'GB' }, { key: this.key(), county: 'Clarksville', country: 'US' }, { key: this.key(), county: 'Dubai', country: 'AE' }, { key: this.key(), county: 'Beijing', country: 'CN' }]
		});
		this.refreshWeatherData();
	}

	refreshWeatherData = () => {
		//Periodically re-call the API so the weather data is up to date with the current weather conditions.
		setTimeout(() => {

			if (this.state.isUsersCurrentLocation) {
				this.setLocationByUsersCurrentPosition();
				this.setState({ refreshAPI: true });
			} else {
				this.setState({ refreshAPI: true });
			}

			this.refreshWeatherData();
		}, 1000 * 600);
	}

	setLocationByUsersCurrentPosition = () => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				// console.log("Position: ");
				// console.log(position);
				this.setLocationByCoords(position.coords.latitude, position.coords.longitude, true);
			});
		}
	}

	//This function accepts a city by name (e.g. Hackney) and fetches the coordinates for that city, then sets the weather location to those coordinates.
	setLocationByName = (cityname) => {
		this.fetchGeoCoordinates(cityname) //<-- Returns latitude and longitude coordinates in exchange for a city name.
			.then((response) => {

				this.setLocationByCoords(response[0].lat, response[0].lon);

			}, (error) => {

				alert(error);
				console.error(error);

			});
	}

	setLocationByCoords = (latitude, longitude, isUsersCurrentLocation = false) => {
		this.setState({
			latitude: latitude,
			longitude: longitude,
			refreshAPI: true,
			isUsersCurrentLocation: isUsersCurrentLocation
		});
	}

	//A function that converts city or town names into latitude and longitude coordinates.
	fetchGeoCoordinates = (cityName, countryCode = null) => {
		const APIkey = this.state.APIkey;
		let response = null;

		if (countryCode) {
			response = fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&appid=${APIkey}`)
				.then(response => response.json());
		} else {
			response = fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIkey}`)
				.then(response => response.json());
		}

		return response.then((response) => {
			//Did the api return any cities or is it just an empty array?
			if (response.length > 0) {
				return response;
			} else {
				throw new Error(`No cities with the name ${cityName} found.`);
			}

		}, (error) => {
			console.error('API call failed: ' + error);
		});

		// if (stateCode) {}
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData(APIname) {
		let latitude = this.state.latitude;
		let longitude = this.state.longitude;
		const APIkey = this.state.APIkey;

		return fetch(`https://api.openweathermap.org/data/2.5/${APIname}?lat=${latitude}&lon=${longitude}&units=${"metric"}&appid=${APIkey}`)
			.then(response => response.json())
			.then(response => {
				//Debug
				console.log(APIname);
				console.log(response);
				return { APIname: APIname, response: response };
			}, (error => {
				console.error('API call failed ' + error);
			}));
	}

	switchPageTo = (page) => {
		// window.location.href = window.location.origin + page;
		this.setState({ currentPage: page });
	}

	key = () => {
		return Math.random() * 9999;
	}

	/*
		A render method to display the required Component on screen (iPhone or iPad) : selected by checking component's isTablet state
	*/
	render() {

		//Gets data from the API(s) and set it in state, if the data needs refreshing.
		if (this.state.refreshAPI) {
			Promise.all([this.fetchWeatherData(APICALLS.WEATHER),
				this.fetchWeatherData(APICALLS.ONECALL)])
				.then((responses) => {
					this.setState({
						responses: {
							...this.state.responses,
							[responses[0].APIname]: responses[0].response,
							[responses[1].APIname]: responses[1].response
						}
					});
					this.parseResponse(responses[1].response);
				});

			this.setState({
				refreshAPI: false
			});
		}

		const currentPage = this.state.currentPage
		const runTemperature = Object.keys(this.state.parsedtemperatureData).length > 0 ? true : false;
		const runiPhone = Object.keys(this.state.responses.weather).length > 0 ? true : false;
		return (
			<div id="app">

				{currentPage == PAGES.TEMPERATURE && runTemperature
					? <Temperature {...this.state.parsedtemperatureData}
						getCurrentHour={this.getCurrentHour}
						switchPageTo={this.switchPageTo}
						PAGES={PAGES} />
					: null}

				{currentPage == PAGES.CLOTHING
					? <Clothing clothingItems={this.state.clothingItems}
						switchPageTo={this.switchPageTo}
						PAGES={PAGES} />
					: null}

				{currentPage == PAGES.HOME && runiPhone
					? <Iphone {...this.state.responses.weather}
						setLocationByUsersCurrentPosition={this.setLocationByUsersCurrentPosition}
						switchPageTo={this.switchPageTo}
						PAGES={PAGES}
						isUsersCurrentLocation={this.state.isUsersCurrentLocation} /> : null}

				{currentPage == PAGES.ADDCITY
					? <CitySelect fetchGeoCoordinates={this.fetchGeoCoordinates}
						setLocationByName={this.setLocationByName}
						cities={this.state.cities} updateCities={this.updateCities}
						switchPageTo={this.switchPageTo}
						PAGES={PAGES} />
					: null}
			</div>
		)
	}

	//Populate the cities list with random data

	updateCities = (cities) => {
		this.setState({ cities: [...cities] });
	}

	//This function returns the current hour.
	getCurrentHour() {
		var today = new Date();
		return today.getHours();
	}

	parseResponse(parsed_json) {
		// set states for fields so they could be rendered later on
		this.setState({
			parsedtemperatureData: {
				city: this.state.responses.weather ? this.state.responses.weather.name : '...',
				currentTemp: parsed_json['current']['temp'],
				windSpeed: parsed_json['current']['wind_speed'],
				rain: parsed_json['current']['rain'] ? parsed_json['current']['rain']['1h'] : 0,
				//Hourly Temp:
				hour1Temp: Math.round(parsed_json['hourly'][this.getCurrentHour()]['temp']), //The function getCurrentHour() is used in order to access the correct index of the API response.
				hour2Temp: Math.round(parsed_json['hourly'][this.getCurrentHour() + 1]['temp']),  //Incrementing getCurrentHour() allows us to retrieve the temperature for the next 4 hours.
				hour3Temp: Math.round(parsed_json['hourly'][this.getCurrentHour() + 2]['temp']),
				hour4Temp: Math.round(parsed_json['hourly'][this.getCurrentHour() + 3]['temp']),
				hour5Temp: Math.round(parsed_json['hourly'][this.getCurrentHour() + 4]['temp']),
				//Hourly Icon:
				hour1Icon: parsed_json['hourly'][this.getCurrentHour()]['weather'][0]['icon'], //Current hour's forecast and below is the next 4 hours.
				hour2Icon: parsed_json['hourly'][this.getCurrentHour() + 1]['weather'][0]['icon'],
				hour3Icon: parsed_json['hourly'][this.getCurrentHour() + 2]['weather'][0]['icon'],
				hour4Icon: parsed_json['hourly'][this.getCurrentHour() + 3]['weather'][0]['icon'],
				hour5Icon: parsed_json['hourly'][this.getCurrentHour() + 4]['weather'][0]['icon'],
				//Daily Temp:
				daily1Temp: Math.round(parsed_json['daily'][1]['temp']['day']), //Tomorrow's forecast.
				daily2Temp: Math.round(parsed_json['daily'][2]['temp']['day']),
				daily3Temp: Math.round(parsed_json['daily'][3]['temp']['day']),
				daily4Temp: Math.round(parsed_json['daily'][4]['temp']['day']),
				daily5Temp: Math.round(parsed_json['daily'][5]['temp']['day']),
				//Daily Icon:
				daily1Icon: parsed_json['daily'][1]['weather'][0]['icon'],
				daily2Icon: parsed_json['daily'][2]['weather'][0]['icon'],
				daily3Icon: parsed_json['daily'][3]['weather'][0]['icon'],
				daily4Icon: parsed_json['daily'][4]['weather'][0]['icon'],
				daily5Icon: parsed_json['daily'][5]['weather'][0]['icon']

			}
		}, this.generateClothing);
	}

	//This function returns an array containing clothing items which are suitable for the user based on the current weather conditions provided by the API response.
	generateClothing() {
		//This inventory array contains the clothing items as objects with fields such as name and description, as well as criteria such as minTemp and minWind.
		const clothesInventory = [
			{
				name: "Base Layer", minTemp: -50, maxTemp: 14, minWind: 1, precipitation: 0, url: "base layer.png",
				desc: "Keep yourself insulated with multiple thin layers.", brandLogo: "decathlon.png", brandUrl: "https://www.decathlon.co.uk/browse/c0-sports/c1-cycling/c3-cycling-base-layers/_/N-1ea1pdp"
			},

			{
				name: "Glasses", minTemp: -50, maxTemp: 35, minWind: 8, precipitation: 0, url: "glasses.png",
				desc: "Protect against dust and insects.", brandLogo: "rayBans.jpg", brandUrl: "https://www.ray-ban.com/uk"
			},

			{
				name: "Gloves", minTemp: -50, maxTemp: 7, minWind: 1, precipitation: 0, url: "gloves.png",
				desc: "Keeping your hands nice and toasty.", brandLogo: "wiggle.png", brandUrl: "https://www.wiggle.co.uk/cycle/gloves"
			},

			{
				name: "Helmet", minTemp: -51, maxTemp: 35, minWind: 0, precipitation: 0, url: "helmet.png",
				desc: "An essential to protect your head.", brandLogo: "alpina.png", brandUrl: "https://www.alpina-sports.com/uk/bike-helmets/"
			},

			{
				name: "Winter Jacket", minTemp: -50, maxTemp: 11, minWind: 0, precipitation: 0, url: "jacket.png",
				desc: "Insulate your upper body with a winter jacket.", brandLogo: "north-face.png", brandUrl: "https://www.thenorthface.co.uk/"
			},

			{
				name: "Raincoat", minTemp: 11, maxTemp: 28, minWind: 0, precipitation: 10, url: "raincoat.png",
				desc: "Keep dry with a lightweight rain jacket.", brandLogo: "parka.png", brandUrl: "https://www.parkalondon.com/the-journal/waterproof-raincoat-types-materials/"
			},

			{
				name: "Scarf", minTemp: -50, maxTemp: 10, minWind: 3, precipitation: 0, url: "scarf.png",
				desc: "Prevent the chill getting any further with a scarf.", brandLogo: "jd.png", brandUrl: "https://www.jdsports.co.uk/search/scarves/"
			},

			{
				name: "T-Shirt", minTemp: 15, maxTemp: 35, minWind: 0, precipitation: 0, url: "shirt.png",
				desc: "Cooler in these warmer conditions.", brandLogo: "nike.png", brandUrl: "https://www.nike.com/gb/w/tops-t-shirts-9om13"
			},

			{
				name: "Shorts", minTemp: 11, maxTemp: 35, minWind: 0, precipitation: 0, url: "short.png",
				desc: "Why not wear a pair of shorts for your ride.", brandLogo: "go-outdoors.png", brandUrl: "https://www.gooutdoors.co.uk/walking/clothing/trousers-and-shorts/shorts/"
			},

			{
				name: "Waterproof Trousers", minTemp: -50, maxTemp: 35, minWind: 0, precipitation: 15, url: "waterproof.png",
				desc: "Stay dry with a pair of waterproof trousers.", brandLogo: "cotswold-outdoor.png", brandUrl: "https://www.cotswoldoutdoor.com/c/clothing/trousers/waterproof.html"
			},

			{
				name: "Winter Hat", minTemp: -50, maxTemp: 13, minWind: 1, precipitation: 0, url: "winter-hat.png",
				desc: "Keeping your ears and head warm.", brandLogo: "blacks.jpg", brandUrl: "https://www.blacks.co.uk/collections/winter-essentials/accessories/beanies/"
			},

			{
				name: "Water Bottle", minTemp: -51, maxTemp: 40, minWind: 0, precipitation: 0, url: "water.png",
				desc: "Remember to keep yourself hydrated!", brandLogo: "chillys.png", brandUrl: "https://www.chillys.com/uk/categories/bottles"
			}
		];

		//Gets precipitation, currentTemp and windSpeed from the component state.

		let currentTemp = this.state.parsedtemperatureData.currentTemp;
		let windSpeed = this.state.parsedtemperatureData.windSpeed;
		let precipitation = this.state.parsedtemperatureData.rain;

		const clothes = [];

		//Based on the current weather conditions, the for loop below iterates through the inventory to check if an item is suitable for recommendation.
		//Using the criteria for each object such as minTemp and comparing it with the weather data from the API.

		for (let i = 0; i < clothesInventory.length; i++) {
			if (currentTemp >= clothesInventory[i].minTemp && currentTemp <= clothesInventory[i].maxTemp) //Checks if the current weather is between min and max temp of the item.
			{
				if (windSpeed >= clothesInventory[i].minWind)// Checks wind speed.
				{
					if (precipitation >= clothesInventory[i].precipitation) // checks precipitation levels.
					{
						console.log(clothesInventory[i].name);
						clothes.push(clothesInventory[i]); // Pushes the item if it is suitable, to a clothes array.
					}
				}
			}

			//This 'if' statement limits the amount of recommendations to 6, in order to prevent overwhelming the user.
			if (clothes.length == 6) {
				return clothes;
			}
		}

		this.setState({ clothingItems: clothes });
		return clothes; //Returns an array containing items which can be recommended to the user.

	}
}
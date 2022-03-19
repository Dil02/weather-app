// import preact
import { h, Component } from 'preact';
import 'regenerator-runtime/runtime'

// import required Components from 'components/'
import Iphone from './iphone';
import Ipad from './ipad';
import Temperature from './temperature';
import CitySelect from './CitySelect';
//import Temperature from './temperature';
import Clothing from './clothing';


const APICALLS = {
	ONECALL: "onecall",
	WEATHER: "weather"
}

export default class App extends Component {
	//var App = React.createClass({

	// a constructor with initial set states
	constructor(props) {
		super(props);
		this.setState({
			APIkey: "d7821ed13f437d8e5db4955a777c8a33",
			latitude: 0,
			longitude: 0,
			locationChanged: false,
			isUsersCurrentLocation: false,
			parsedtemperatureData: {},
			clothingItems: [],
			responses: {
				weather: {},
				onecall: {}
			}
		});
		this.getUserCurrentLocation();
	}

	getUserCurrentLocation = () => {
		//Perform some commands to get the user's current location.
		setTimeout(() => {
			this.getUserCurrentLocation();
		}, 1000 * 600);

		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					locationChanged: true,
					isUsersCurrentLocation: true
				});
				console.log("Position: ");
				console.log(position);
			})
		}
	}

	setLocationByName = (cityname, isUsersCurrentLocation) => {
		this.fetchGeoCoordinates(cityname)
			.then((response) => {

				this.setLocationByCoords(response[0].lat, response[0].lon, isUsersCurrentLocation);

			}, (error) => {

				alert(error);
				console.error(error);

			});
	}

	setLocationByCoords = (latitude, longitude, isUsersCurrentLocation) => {
		this.setState({
			latitude: latitude,
			longitude: longitude,
			locationChanged: true,
			isUsersCurrentLocation: isUsersCurrentLocation
		});
	}

	//A function that converts city and town names into latitude and longitude coordinates.
	fetchGeoCoordinates = (cityName, countryCode = null) => {
		let APIkey = this.state.APIkey;
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
		let APIkey = this.state.APIkey;

		fetch(`https://api.openweathermap.org/data/2.5/${APIname}?lat=${latitude}&lon=${longitude}&units=${"metric"}&appid=${APIkey}`)
			.then(response => response.json())
			.then(response => {
				this.setState({
					responses: {
						...this.state.responses,
						[APIname]: response
					}
				});
				APIname == APICALLS.ONECALL ? this.parseResponse(response) : null;
				
				//Debug
				console.log(APIname);
				console.log(response);
			}, (error => {
				console.error('API call failed ' + error);
			}));
	}

	parseResponse(parsed_json) {
		// set states for fields so they could be rendered later on
		this.setState({
			parsedtemperatureData: {
				city: this.state.responses.weather ? this.state.responses.weather.name : '...',
				currentTemp: parsed_json['current']['temp'],
				//Hourly Temp:
				hour1Temp: Math.round(parsed_json['hourly'][this.getCurrentHour()]['temp']), //The function getCurrentHour() is used in order to access the correct index of the API response.
				hour2Temp: Math.round(parsed_json['hourly'][this.getCurrentHour() + 1]['temp']),  //Incrementing getCurrentHour() allows us to retrieve the temperature for the next 4 hours.
				hour3Temp: Math.round(parsed_json['hourly'][this.getCurrentHour() + 2]['temp']),
				hour4Temp: Math.round(parsed_json['hourly'][this.getCurrentHour() + 3]['temp']),
				hour5Temp: Math.round(parsed_json['hourly'][this.getCurrentHour() + 4]['temp']),
				//Hourly Icon:
				hour1Icon: parsed_json['hourly'][this.getCurrentHour()]['weather'][0]['icon'],
				hour2Icon: parsed_json['hourly'][this.getCurrentHour() + 1]['weather'][0]['icon'],
				hour3Icon: parsed_json['hourly'][this.getCurrentHour() + 2]['weather'][0]['icon'],
				hour4Icon: parsed_json['hourly'][this.getCurrentHour() + 3]['weather'][0]['icon'],
				hour5Icon: parsed_json['hourly'][this.getCurrentHour() + 4]['weather'][0]['icon'],
				hoursTemps: [
					parsed_json['hourly'][0]['temp'],
					parsed_json['hourly'][1]['temp'],
					parsed_json['hourly'][2]['temp'],
					parsed_json['hourly'][3]['temp'],
					parsed_json['hourly'][4]['temp']
				],
				//Hourly Icon:
				hoursIcons: [
					parsed_json['hourly'][0]['weather'][0]['icon'],
					parsed_json['hourly'][1]['weather'][0]['icon'],
					parsed_json['hourly'][2]['weather'][0]['icon'],
					parsed_json['hourly'][3]['weather'][0]['icon'],
					parsed_json['hourly'][4]['weather'][0]['icon']
				],
				//Daily Temp:
				daily1Temp: Math.round(parsed_json['daily'][0]['temp']['day']),
				daily2Temp: Math.round(parsed_json['daily'][1]['temp']['day']),
				daily3Temp: Math.round(parsed_json['daily'][2]['temp']['day']),
				daily4Temp: Math.round(parsed_json['daily'][3]['temp']['day']),
				daily5Temp: Math.round(parsed_json['daily'][4]['temp']['day']),
				//Daily Icon:
				daily1Icon: parsed_json['daily'][0]['weather'][0]['icon'],
				daily2Icon: parsed_json['daily'][1]['weather'][0]['icon'],
				daily3Icon: parsed_json['daily'][2]['weather'][0]['icon'],
				daily4Icon: parsed_json['daily'][3]['weather'][0]['icon'],
				daily5Icon: parsed_json['daily'][4]['weather'][0]['icon']

			}


		});

	}

	// parseWeatherData(response) {
	// 	// set states for fields so they could be rendered later on
	// 	let wd = {
	// 		tempuratureCNow: response["current"]["temp"],
	// 		conditions: parsed_json['weather']['0']['description'],
	// 		maxTemperature: parsed_json['main']['temp_max'] - 273.15,
	// 		minTemperature: parsed_json['main']['temp_min'] - 273.15,
	// 		wind_speed: parsed_json['wind']['speed'],
	// 		precipitation: parsed_json.list,
	// 	}
	// };

	// once the components are loaded, checks if the url bar has a path with "ipad" in it, if so sets state of tablet to be true
	componentDidMount() {
		const urlBar = window.location.href;
		if (urlBar.includes("ipad")) {
			this.setState({
				"isTablet": true
			});
		} else {
			this.setState({
				"isTablet": false
			});
		}
	}

	/*
		A render method to display the required Component on screen (iPhone or iPad) : selected by checking component's isTablet state
	*/
	render() {

		if (this.state.locationChanged) {
			this.fetchWeatherData(APICALLS.WEATHER);
			this.fetchWeatherData(APICALLS.ONECALL);

			this.setState({
				clothingItems: this.generateClothing(),
				locationChanged: false
			});
		}
		let runTemperature = Object.keys(this.state.parsedtemperatureData).length > 0 ? true :false;
		if (this.state.isTablet) {
			return (
				<div id="app">
					{runTemperature ? <Temperature {...this.state.parsedtemperatureData} 
					getCurrentHour={this.getCurrentHour}/> : null}
					

					{/* //I commented out Temperature in order to work on Clothing.
				//Make sure to comment in and out the respective style sheets at the top to display the components. */}

					<Clothing clothingItems={this.state.clothingItems}
					/>
				</div>
			);
		}
		else {
			return (
				<div id="app">
					{/* {Object.keys(this.state.responses.weather).length ? <Iphone {...this.state.responses.weather}
					getUserCurrentLocation={this.getUserCurrentLocation}
					{...this.state.userLocation}/> : null} */}
					<CitySelect fetchGeoCoordinates={this.fetchGeoCoordinates} setLocationByName={this.setLocationByName} />
				</div>
			);
		}
	}


	//This function returns the current hour.
	getCurrentHour() {
		var today = new Date();
		return today.getHours();
	}

	//This function returns an array containing clothing items which are suitable for the user based on the current weather conditions provided by the API response.
	generateClothing() {
		//This inventory array contains the clothing items as objects with fields such as name and description.
		const clothesInventory = [
			{ name: "Base Layer", minTemp: -50, maxTemp: 14, minWind: 1, precipitation: 0, url: "base layer.png", desc: "Keep yourself insulated with multiple thin layers." },
			{ name: "Glasses", minTemp: -50, maxTemp: 35, minWind: 5, precipitation: 10, url: "glasses.png", desc: "Protect against dust and insects." },
			{ name: "Gloves", minTemp: -50, maxTemp: 7, minWind: 1, precipitation: 0, url: "gloves.png", desc: "Keeping your hands warm." },
			{ name: "Helmet", minTemp: -51, maxTemp: 35, minWind: 0, precipitation: 0, url: "helmet.png", desc: "An essential to protect your head." },
			{ name: "Winter Jacket", minTemp: -50, maxTemp: 11, minWind: 1, precipitation: 0, url: "jacket.png", desc: "Insulate your upper body with a quality winter jacket." },
			{ name: "Raincoat", minTemp: 12, maxTemp: 28, minWind: 0, precipitation: 20, url: "raincoat.png", desc: "Keep yourself dry with a lightweight rain jacket." },
			{ name: "Scarf", minTemp: -50, maxTemp: 10, minWind: 3, precipitation: 0, url: "scarf.png", desc: "Prevent the chill getting any further with a scarf." },
			{ name: "T-Shirt", minTemp: 15, maxTemp: 35, minWind: 0, precipitation: 0, url: "shirt.png", desc: "A light layer to keep you cool in these warmer conditions." },
			{ name: "Shorts", minTemp: 7, maxTemp: 35, minWind: 0, precipitation: 0, url: "short.png", desc: "Why not wear a pair of shorts for your ride." },
			{ name: "Water Bottle", minTemp: -51, maxTemp: 40, minWind: 0, precipitation: 0, url: "water.png", desc: "Remember to keep hydrated!" },
			{ name: "Waterproof Trousers", minTemp: -50, maxTemp: 35, minWind: 0, precipitation: 20, url: "waterproof.png", desc: "Keep yourself dry with a lightweight pair of waterproof trousers." },
			{ name: "Winter Hat", minTemp: -50, maxTemp: 13, minWind: 1, precipitation: 0, url: "winter-hat.png", desc: "Keeping your ears and head warm." }
		];

		//Get windSpeed and precipitation from the API.
		//Hard Coded Wind Speed and Precipitation:
		let currentTemp = this.state.parsedtemperatureData.currentTemp;
		let windSpeed = 5;
		let precipitation = 10;

		const clothes = [];

		//Based on the current weather conditions, the for loop below iterates through the inventory to check if an item is suitable for recommendation.

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
		}
		return clothes; //Returns an array containing items which can be recommended to the user.

	}




}
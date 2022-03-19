// import preact
import { h, Component } from 'preact';

// import required Components from 'components/'
import Iphone from './iphone';
import Ipad from './ipad';
import Temperature from './temperature';
import gpsUnlocated from '../assets/icons/gpsUnlocated.png'
import gpsLocated from '../assets/icons/gps.png'

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
			images: {
				gps: gpsUnlocated
			},
			latitude: 0,
			longitude: 0,
			APIkey: "d7821ed13f437d8e5db4955a777c8a33",
			locationChanged: 0,
			parsedtemperatureData: {},
			responses: {
				weather: {},
				onecall: {}
			}
		});
		this.getUserCurrentLocation();
		this.getUserCurrentLocation = this.getUserCurrentLocation.bind(this);
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
				console.log('API call failed ' + error);
			}));
	}

	parseResponse(parsed_json) {
		// set states for fields so they could be rendered later on
		this.setState({
			// location: parsed_json['city']['name'],
			// temperatureC: parsed_json['list']['0']['main']['temp'],
			// conditions : parsed_json['weather']['0']['description'],
			// maxTemperature : parsed_json['main']['temp_max'],
			// minTemperature : parsed_json['main']['temp_min'],
			// wind_speed : parsed_json['wind']['speed'],
			// precipitation : parsed_json.list,
			parsedtemperatureData: {
				city: 'need to figure out how to display city using Onecall API',
				currentTemp: parsed_json['current']['temp'],
				//Hourly Temp:
				hour1Temp: parsed_json['hourly'][0]['temp'],
				hour2Temp: parsed_json['hourly'][1]['temp'],
				hour3Temp: parsed_json['hourly'][2]['temp'],
				hour4Temp: parsed_json['hourly'][3]['temp'],
				hour5Temp: parsed_json['hourly'][4]['temp'],
				//Hourly Icon:
				hour1Icon: parsed_json['hourly'][0]['weather'][0]['icon'],
				hour2Icon: parsed_json['hourly'][1]['weather'][0]['icon'],
				hour3Icon: parsed_json['hourly'][2]['weather'][0]['icon'],
				hour4Icon: parsed_json['hourly'][3]['weather'][0]['icon'],
				hour5Icon: parsed_json['hourly'][4]['weather'][0]['icon'],
				//Daily Temp:
				daily1Temp: parsed_json['daily'][0]['temp']['day'],
				daily2Temp: parsed_json['daily'][1]['temp']['day'],
				daily3Temp: parsed_json['daily'][2]['temp']['day'],
				daily4Temp: parsed_json['daily'][3]['temp']['day'],
				daily5Temp: parsed_json['daily'][4]['temp']['day'],
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

	getUserCurrentLocation = () => {
		//Perform some commands to get the user's current location.

		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					lastUpdate: position.timestamp,
					locationChanged: 1
				});
				console.log("Position: ");
				console.log(position);
			})
		}

	}

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
				locationChanged: 0
			});
		}
		if (this.state.isTablet) {
			return (
				<div id="app">
					<Temperature {...this.state.parsedtemperatureData} />;
				</div>
			);
		}
		else {
			return (
				<div id="app">
					{Object.keys(this.state.responses.weather).length ? <Iphone {...this.state.responses.weather} getUserCurrentLocation={this.getUserCurrentLocation}/> : null}
				</div>
			);
		}
	}




}
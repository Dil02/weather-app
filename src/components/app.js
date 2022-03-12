// import preact
import { h, Component } from 'preact';

// import required Components from 'components/'
import Iphone from './iphone';
import Ipad from './ipad';
import Temperature from './temperature';
import gpsUnlocated from '../../assets/icons/gpsUnlocated.png'
import gpsLocated from '../../assets/icons/gps.png'

export default class App extends Component {
//var App = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		this.setState({
			images: {
				gps: gpsUnlocated
			},
			latitude: 0,
			longitude: 0,
			APIkey: "d7821ed13f437d8e5db4955a777c8a33",
			locationChanged: 0
		});
		this.getUserCurrentLocation();
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData() {
		this._fetchWeatherData(this.state.latitude, this.state.longitude, this.state.APIkey);
	}
	_fetchWeatherData(latitude, longitude, APIkey) {
		fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}`)
			.then(response => response.json())
			.then(response => {
				this.parseResponse(response);
				console.log(response);
			}, (error => {
				console.log('API call failed ' + error);
			}));
	}

	parseResponse(parsed_json) {
		// set states for fields so they could be rendered later on
		this.setState({
			location: parsed_json['name'],
			temperatureC: parsed_json['main']['temp'] - 273.15,
			conditions : parsed_json['weather']['0']['description'],
			maxTemperature : parsed_json['main']['temp_max'] - 273.15,
			minTemperature : parsed_json['main']['temp_min'] - 273.15,
			wind_speed : parsed_json['wind']['speed'],
			precipitation : parsed_json.list,
			images: {
				gps: gpsLocated
			}
		});      
	}

	// once the components are loaded, checks if the url bar has a path with "ipad" in it, if so sets state of tablet to be true
	componentDidMount() {
		const urlBar = window.location.href;
		if(urlBar.includes("ipad")) {
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
	render(){
		if(this.state.isTablet){
			return (
				<div id="app">
					<Temperature/ >
				</div>   				
			);
		} 
		else {
			return (
				<div id="app">
					<Iphone/ >
				</div>
			);
		}
	}


}
// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';

import style_iphone from '../button/style_iphone';
// import the Button component
import Button from '../button';
//import the temperature component
import Temperature from '../temperature';
//icons
import gpsUnlocated from '../../assets/icons/gpsUnlocated.png'
import gpsLocated from '../../assets/icons/gps.png'

export default class Iphone extends Component {
//var Iphone = React.createClass({

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

	getUserCurrentLocation() {
		//Perform some commands to get the user's current location.

		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					lastUpdate: position.timestamp,
					locationChanged: 1
				});
				console.log(position);
			})
		}
		
	}

	// the main render method for the iphone component
	render() {
		if (this.state.locationChanged) {
			this.fetchWeatherData();
			this.setState({
				locationChanged: 0
			});
		}
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		
		// display all weather data
		// change the style sheet for the max and min temperatures.
		return (
			<div class={ style.container }>
				<div class={ style.header }>
					<div id="header" class={ style.city }>
						<img src={this.state.images.gps} onClick={() => this.getUserCurrentLocation()} style={{"pointer-events": "all"}}/>
						<div>{ this.state.location }</div>
						<h6>Change (clickabble later)</h6>
					</div>

					<section class= { style.section }>
						<div class={ style.conditions }>{ this.state.cond }</div>
						<span class={ tempStyles }>{ this.state.temp }</span>
						<div class={ style.conditions }>highest: { this.state.temp_max}  lowest: { this.state.temp_min} </div>
						<div>Tips</div>
					</section>
				</div>
				
				<div class={ style.footer }>
					<div class={ style.group1 }>Precipitation: {this.state.precipitation }</div>
					<div class={ style.group1 }>Wind Speed: { this.state.wind_speed }</div>
					<div class={ style.group1 }>More information</div>
				</div>
				<div class={ style.details }></div>
				<div class= { style_iphone.container }> 
					{ this.state.display ? <button class={ style_iphone.button } onClick={""}/> : null }
				</div>
			</div>
		);
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
}

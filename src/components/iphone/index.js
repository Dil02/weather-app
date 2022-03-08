// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
//import the temperature component
import Temperature from '../temperature';
//hello
export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ display: true });
		this.fetchWeatherData();
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=77e99b5d05925f288eb80c06b0ef1be5";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: true });
	}

	

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		
		// display all weather data
		// change the style sheet for the max and min temperatures.
		return (
			<div class={ style.container }>
				<div class={ style.header }>
					<div class={ style.city }>{ this.state.locate }</div>
					<section class= { style.section }>
						<div class={ style.conditions }>{ this.state.cond }</div>
						<span class={ tempStyles }>{ this.state.temp }</span>
						<div class={ style.conditions }>highest: { this.state.temp_max} lowest: { this.state.temp_min} </div>
						<div>Tips</div>
					</section>
				</div>
				<div class={ style.footer}>
					<div class={ style.group1}>Precipitation: {this.state.precipitation}</div>
					<div class={ style.group1}>Wind Speed: { this.state.wind_speed}</div>
					<div class={ style.group1}>More information</div>
				</div>
				<div class={ style.details }></div>
				<div class= { style_iphone.container }> 
					{ this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/ > : null }
				</div>
			</div>
		);
	}


	parseResponse = (parsed_json) => {
		let location = parsed_json['name'];
		let temp_c = parsed_json['main']['temp'];
		let conditions = parsed_json['weather']['0']['description'];
		let tempMax = parsed_json['main']['temp_max'];
		let tempMin = parsed_json['main']['temp_min'];
		let precipitation = parsed_json.list;
		let windSpeed = parsed_json['wind']['speed'];
		


		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions,
			temp_max : tempMax,
			temp_min : tempMin,
			wind_speed : windSpeed,
			precipitation : precipitation
	



		});      
	}
}

// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import '../../fonts/Bitter-VariableFont_wght.ttf';

import style_iphone from '../button/style_iphone';
// import the Button component
import Button from '../button';
//import the temperature component
import Temperature from '../temperature';

import Strip from '../strip';

//icons
import gpsUnlocated from '../../assets/icons/gpsUnlocated.png';
import gpsLocated from '../../assets/icons/gpsLocated.png';
import plus from "../../assets/icons/plus.png";

import information from "../../assets/icons/information.png";
import raindrop from "../../assets/icons/raindrop.png";
import wind from "../../assets/icons/wind.png";
import CitySelect from '../CitySelect';
import { timers } from 'jquery';

export default class Iphone extends Component {
	//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props) {
		super(props);
		this.setState({
			windspeedL: `${this.props.wind.speed}mph at ${this.props.wind.deg} degrees`,
			temperature: roundToNearestHalf(this.props.main.temp),
			minTemperature: roundToNearestHalf(this.props.main.temp_min),
			maxTemperature: roundToNearestHalf(this.props.main.temp_max),
			humidity: this.props.main.humidity,
			sunriseTime: new Date(this.props.sys.sunrise * 1000)
			.toLocaleTimeString(navigator.language, {
				hour: "2-digit",
				minute: "2-digit"
			}),
			sunsetTime: new Date(this.props.sys.sunset * 1000)
			.toLocaleTimeString(navigator.language, {
				hour: "2-digit",
				minute: "2-digit"
			}),
			rain1h: "..."
		});
		this.handleChangeClick = this.handleChangeClick.bind(this);
	}

	handleChangeClick(e) {
		//This function takes the user to a screen where they can change their citiy/county.
		
	}

	selectTip() {
		if (Date.now > this.state.sunsetTime) {

		}
	}

	// the main render method for the iphone component
	render() {
		// Extract all the pertinent data from the returned JSON data
		let windspeed = `${this.props.wind.speed}mph at ${this.props.wind.deg} degrees`;
		let temperature = roundToNearestHalf(this.props.main.temp);
		let minTemperature = roundToNearestHalf(this.props.main.temp_min);
		let maxTemperature = roundToNearestHalf(this.props.main.temp_max);
		let humidity = this.props.main.humidity;
		let sunriseTime = new Date(this.props.sys.sunrise * 1000)
			.toLocaleTimeString(navigator.language, {
				hour: "2-digit",
				minute: "2-digit"
			});

		let sunsetTime = new Date(this.props.sys.sunset * 1000)
			.toLocaleTimeString(navigator.language, {
				hour: "2-digit",
				minute: "2-digit"
			});

		let rain1h = "..."
		if (this.props.rain) {
			rain1h = this.props.rain["1h"];
			// rain3h = this.props.rain["3h"];
		} else {
			rain1h = "0%";
		}

		return (
			<div class={style.container}>
				<div class={style.header}>
					<div id="header" class={style.city}>
						<div>
							<img className={style.gpsicon} src={this.props.userLocation ? gpsUnlocated : gpsLocated} alt='gps icon'
								style={{ "pointer-events": "all" }} />
							<h2 class={style.cityName}>{this.props.name}</h2>
							<h6 class={style.countryCode}>{this.props.sys.country}</h6>
						</div>
						<img className={style.addcityicon} src={plus} alt='Add a city' onClick={(e) => this.handleChangeClick(e)} />
					</div>

					<section class={style.section}>
						<div class={style.conditions}>
							<h1 className={style.weather_description}>
								{this.props.weather[0].description}
							</h1>
							<span className={`${style.degree} ${style.temperature}`}>{temperature}</span>
						</div>

						{/* Highest and Lowest temperatures of the day displayer */}
						<div className={style.highest_lowest}>
							<p className={style.degree2}>
								Highest: {maxTemperature}
							</p>
							<p className={style.degree2}>
								Lowest: {minTemperature}
							</p>
						</div>

						<span class={style.sunBox}>
							<div /*sunset/sunrise time class box */>
								<h5>Sunrise Time:</h5>
								<p>{sunriseTime}</p>
							</div>
							<div /*sunset/sunrise time class box */>
								<h5>Sunset Time:</h5>
								<p>{sunsetTime}</p>
							</div>
						</span>

						<img className={style.weather_icon} src={`http://openweathermap.org/img/wn/${this.props.weather[0].icon}@4x.png`} alt='' />
						<div>
							Tips
						</div>
					</section>
				</div>

				<div class={style.footer}>
					<Strip img={raindrop} text={"Precipitation:"} data={rain1h} />
					{/* <Strip img={humidity} text={"Humidity:"} data={`${humidity}%`} /> */}
					<Strip img={wind} text={"Wind Speed:"} data={windspeed} />
					<Strip img={information} text={"More information"} data={"Bike shops. (Click here)"} />
				</div>
				<div class={style.details}></div>
				<div class={style_iphone.container}>
					{this.state.display ? <button class={style_iphone.button} onClick={""} /> : null}
				</div>
			</div>
		);
	}
}

function roundToNearestHalf(number) {
	return Math.round(number * 2) / 2
}
// import preact
import { h, render, Component } from 'preact';
// import stylesheets for this component
import style from './style';
//fonts
import '../../fonts/Bitter-VariableFont_wght.ttf';
//import components -->
import Strip from '../strip';

//icons
import gpsUnlocated from '../../assets/icons/gpsUnlocated.png';
import gpsLocated from '../../assets/icons/gpsLocated.png';
import plus from "../../assets/icons/plus.png";

import danger from "../../assets/icons/danger.png";
import informationIcon from "../../assets/icons/information.png";
import raindropIcon from "../../assets/icons/raindrop.png";
import windIcon from "../../assets/icons/wind.png";
import humidityIcon from "../../assets/icons/humidity.png";
import fashionIcon from "../../assets/icons/fashion-designer.png";

export default class Iphone extends Component {

	constructor(props) {
		super(props);
		this.parseProps(this.props);
	}

	//Runs before the render method.
	componentWillReceiveProps(nextProps) {
		this.parseProps(nextProps);
	}

	//A function to extract and compute data from the props and place it into this Component's state.
	parseProps = (props) => {
		let windspeed = roundToNearestHalf(props.wind.speed);
		let direction = degreesToCompass(props.wind.deg);

		this.setState({
			windspeedL: `${windspeed}mph from the ${direction}`,
			windspeed: props.wind.speed,
			temperature: roundToNearestHalf(props.main.temp),
			minTemperature: roundToNearestHalf(props.main.temp_min),
			maxTemperature: roundToNearestHalf(props.main.temp_max),
			humidity: props.main.humidity,
			sunriseTimeUnix: props.sys.sunrise,
			sunsetTimeUnix: props.sys.sunset,
			sunriseTime: new Date(props.sys.sunrise * 1000)
				.toLocaleTimeString(navigator.language, {
					hour: "2-digit",
					minute: "2-digit"
				}),
			sunsetTime: new Date(props.sys.sunset * 1000)
				.toLocaleTimeString(navigator.language, {
					hour: "2-digit",
					minute: "2-digit"
				}),
			rain1h: props.rain ? props.rain['1h'] : 0
		});
	}

	//This function changes the screen of the app.
	switchPageTo = (page) => {
		this.props.switchPageTo(page);
	}

	// Returns an array of tips that may be displayed in the "tips" section.
	selectTip() {
		//Each tip is composed of an array of object comprising of; 
		// the tip-text and conditions that must be met in order for the tip to be displayed.
		let weatherConditionTips = [
			{
				minWind: undefined, minimumUVI: 6, minRain: undefined,
				minSnow: undefined, isSnowing: undefined, minTemp: undefined,
				tip: "The UV index is high today, remember to wear sunscreen especially if you have lighter skin.",
			}, {
				minWind: undefined, minimumUVI: undefined, minRain: undefined,
				minSnow: undefined, isSnowing: true, minTemp: undefined,
				tip: "Consider sticking to main roads during snowy conditions, they are more likely to be gritted and clear of snow.",
			}, {
				minWind: undefined, minimumUVI: undefined, minRain: 1,
				minSnow: undefined, isSnowing: true, minTemp: undefined,
				tip: "Consider fitting knobbly or studded tyres to improve grip.",
			}, {
				minWind: undefined, minimumUVI: undefined, minRain: 1,
				minSnow: undefined, isSnowing: true, minTemp: undefined,
				tip: "Travel extra care when turning as conditions may be slippery.",
			}, {
				minWind: undefined, minimumUVI: undefined, minRain: undefined,
				minSnow: undefined, isSnowing: undefined, minTemp: 25,
				tip: "Drink plenty of water to avoid dehydration.",
			}, {
				minWind: undefined, minimumUVI: undefined, minRain: undefined,
				minSnow: undefined, isSnowing: undefined, minTemp: 26, minHumidity: 60,
				tip: "Consider wearing a sweat wicking sports shirt in hot and humid conditions.",
			}, {
				minWind: undefined, minimumUVI: undefined, minRain: undefined,
				minSnow: undefined, isSnowing: undefined, minTemp: 25,
				tip: "Drink plenty of water to avoid dehydration.",
			}, {
				minWind: 20, minimumUVI: undefined, minRain: undefined,
				minSnow: undefined, isSnowing: undefined, minTemp: undefined,
				tip: "Sudden gusts of wind may reduce stability, travel at slower speeds and keep well back from tall vehicles.",
			}, {
				minWind: undefined, minimumUVI: undefined, minRain: undefined,
				minSnow: undefined, isSnowing: undefined, minTemp: undefined, maxVisibillity: 1000,
				tip: "Take extra care due to poor visibility, make sure your lights are switched on.",
			}
		];

		// An array of safety tips, not based on weather conditions.
		let safetyTips = [
			"Remember to wear a helmet.",
			"Obey traffic lights and signs.",
			"Don’t cycle on the pavement unless it’s a designated cycle path.",
			"Make your intentions to turn clear using hand signals.",
			"Position yourself in front of road traffic at traffic lights.",
			"Consider taking a adult cycle skills course offered by Queen Mary or other universities.",
			"Use a bell as not all pedestrians may see you.",
			"Be sure to secure your bicycle when leaving it unattended to prevent theft.",
			"Check your bicycle is in good condition, including brake pads and tyres."
		];

		//Check which tips meet the weather conditions to be shown to the user.
		weatherConditionTips = weatherConditionTips.filter(v => {

			if (this.props.snow) {
				let snowMM = this.props.snow["1h"];
				if (v.isSnowing) { return true }
				if (snowMM > v.minSnow) { return true }
			}

			if (this.props.rain) {
				let rainMM = this.props.rain["1h"];
				if (v.minRain > rainMM) { return true }
			}

			if (this.props.main.temp > v.minTemp) {
				return true;
			}

			if (this.props.wind.speed > v.minWind) {
				return true;
			}

			if (this.props.visibility < v.maxVisibillity) {
				return true;
			}

			return false;
		});
		weatherConditionTips = weatherConditionTips.map(v => v.tip);

		//Checks if it is currently night time.
		if (this.props.isNightTime) {
			safetyTips.push(...[
				"When travelling at night let a friend or relative know your destination and likely time of arrival.",
				"Remember to switch-on your front and rear bicycle lights at night.",
				"Wearing reflective clothing can help you be seen by others, even in darkness."
			]);
		}
		let combinedTips = [...weatherConditionTips, ...safetyTips];
		let randomTip = combinedTips[getRandomIntInclusive(0, combinedTips.length - 1)]; //Randomly select a tip to display.

		return randomTip;
	}

	//The main render method for the iphone component
	render() {
		let tip = this.selectTip();
		// Extract all the pertinent data from the returned JSON data
		let windspeed = this.state.windspeedL;
		let temperature = this.state.temperature;
		let minTemperature = this.state.minTemperature;
		let maxTemperature = this.state.maxTemperature;
		let humidity = this.props.main.humidity;
		let sunriseTime = this.state.sunriseTime;
		let sunsetTime = this.state.sunsetTime;

		let rain1h;
		if (this.props.rain) {
			rain1h = this.props.rain["1h"];
		} else {
			rain1h = "0";
		}
		
		// Set the background image according to weather conditions.
		let bgImage;
		if (this.props.isNightTime) {
			bgImage = style.nightBg;
		} else if (this.props.rain) {
			bgImage = style.rainBg;
		} else {
			bgImage = style.clearBg;
		}

		return (
			<div class={`${style.container} ${bgImage}`}>
				<div class={style.header}>
					{/* Displays the area name and "add a city" button */}
					<div id="header" class={style.city}>

						<div>
							<img className={style.gpsicon}
								src={this.props.isUsersCurrentLocation ? gpsLocated : gpsUnlocated}
								alt='Set to my location'
								onClick={this.props.setLocationByUsersCurrentPosition} />
							<h2 class={style.cityName}>{this.props.name}</h2>
							<p class={style.countryCode}>{this.props.sys.country}</p>
						</div>
						<img className={style.addcityicon} src={plus} alt='Add a city' onClick={() => this.switchPageTo(this.props.PAGES.ADDCITY)} />

					</div>

					<section class={style.midsection}>
						{/* Weather description and current temperature */}
						<div class={style.conditions}>
							<h1 className={style.weather_description}>
								{this.props.weather[0].description}
							</h1>
							<p className={`${style.degree} ${style.temperature}`}>{temperature}</p>
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

						<div class={style.sunBox}>
							<div /*sunset/sunrise time class box */>
								<p>Sunrise:</p>
								<p>{sunriseTime}</p>
							</div>
							<div /*sunset/sunrise time class box */>
								<p>Sunset:</p>
								<p>{sunsetTime}</p>
							</div>
						</div>

						{/* Main weather icon (Sun, Moon, Clouds) */}
						<img className={style.weather_icon} src={`http://openweathermap.org/img/wn/${this.props.weather[0].icon}@4x.png`} alt='' />

						<div className={style.tips}>
							<div>
								<img src={danger} alt='' />
								<h6>Tips</h6>
							</div>
							<p>
								{tip}
							</p>
						</div>

					</section>
				</div>

				{/* Section with horizonal stripes of information */}
				<div class={style.footer}>
					<Strip img={raindropIcon} text={"Precipitation:"} data={`${rain1h}mm/h`} />
					<Strip img={humidityIcon} text={"Humidity:"} data={`${humidity}%`} />
					<Strip img={windIcon} text={"Wind Speed:"} data={windspeed} />
					<Strip img={informationIcon} text={"More information!"} data={"Future forcasts"}
						onClick={() => this.switchPageTo(this.props.PAGES.TEMPERATURE)} />
					<Strip img={fashionIcon} text={"Get Cool clothing!"} data={"Click here"}
						onClick={() => this.switchPageTo(this.props.PAGES.CLOTHING)} />
				</div>
			</div>
		);
	}
}

function roundToNearestHalf(number) {
	return Math.round(number * 2) / 2
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the min
}

function degreesToCompass(num) {
	var val = Math.floor((num / 45) + 0.5);
	// var arr = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
	var arr = ["North", "North East", "East", "South East", "South", "South West", "West", "North West"];
	return arr[(val % 8)];
}
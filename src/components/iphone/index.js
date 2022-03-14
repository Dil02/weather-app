// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';

import style_iphone from '../button/style_iphone';
// import the Button component
import Button from '../button';
//import the temperature component
import Temperature from '../temperature';

import Strip from '../strip';

//icons
import gpsUnlocated from '../../assets/icons/gpsUnlocated.png';
import gpsLocated from '../../assets/icons/gps.png';
import information from "../../assets/icons/information.png";
import raindrop from "../../assets/icons/raindrop.png";
import wind from "../../assets/icons/wind.png";

export default class Iphone extends Component {
	//var Iphone = React.createClass({

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
			locationChanged: 0
		});
		this.handleChangeClick = this.handleChangeClick.bind(this);
	}

	handleChangeClick(e) {
		// console.log('this is:', this);
		// console.log(e);
	}

	// the main render method for the iphone component
	render() {
		// display all weather data
		// change the style sheet for the max and min temperatures.
		let windspeed = `${this.props.wind.speed}mph at ${this.props.wind.deg} degrees`;
		return (
			<div class={style.container}>
				<div class={style.header}>
					<div id="header" class={style.city}>
						<img src={this.state.images.gps/*change based on if user loc found or not */} onClick={() => this.props.getUserCurrentLocation()} style={{ "pointer-events": "all" }} />
						{this.props.name}
						<h6 onClick={(e) => this.handleChangeClick(e)}/*Make apparent this can be clicked on */>Change</h6>
					</div>

					<section class={style.section}>
						<div class={style.conditions}>
							<h1>{this.props.weather ? this.props.weather[0].description : "..."}</h1>
							<span class={`${style.filled} ${style.temperature}`}>{this.props.main.temp}</span>
						</div>
						
						<div class={style.conditions}>highest: {this.props.main.temp_max}  lowest: {this.props.main.temp_min} </div>
						<img src={`http://openweathermap.org/img/wn/${this.props.weather[0].icon}@4x.png`} alt=''/>
						<div>
							Tips
						</div>
					</section>
				</div>

				<div class={style.footer}>
					<Strip img={raindrop} text={"Precipitation:"} data={"123"/* Data is conditional in the API response?*/}/>
					<Strip img={wind} text={"Wind Speed:"} data={windspeed}/>
					<Strip img={information} text={"More information"} data={"abc 123 abc 123 abc 123 abc 123 abc 123 "}/>
				</div>
				<div class={style.details}></div>
				<div class={style_iphone.container}>
					{this.state.display ? <button class={style_iphone.button} onClick={""} /> : null}
				</div>
			</div>
		);
	}


	
}

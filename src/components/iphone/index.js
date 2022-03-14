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
	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;

		// display all weather data
		// change the style sheet for the max and min temperatures.
		return (
			<div class={style.container}>
				<div class={style.header}>
					<div id="header" class={style.city}>
						<img src={this.state.images.gps} onClick={() => this.getUserCurrentLocation()} style={{ "pointer-events": "all" }} />
						{this.props.name}
						<h6>Change (clickabble later)</h6>
					</div>

					<section class={style.section}>
						<div class={style.conditions}>
							<h1>{this.props.weather ? this.props.weather[0].description : "..."}</h1>
							<span class={`${style.filled} ${style.temperature}`}>{this.props.main.temp}</span>
						</div>
						
						<div class={style.conditions}>highest: {this.props.main.temp_max}  lowest: {this.props.main.temp_min} </div>
						<div>Tips</div>
					</section>
				</div>

				<div class={style.footer}>
					<Strip img={raindrop} text={"Precipitation:"} data={"123"}/>
					<Strip img={wind} text={"Wind Speed:"} data={"123"}/>
					<Strip img={information} text={"More information"} data={"123"}/>
				</div>
				<div class={style.details}></div>
				<div class={style_iphone.container}>
					{this.state.display ? <button class={style_iphone.button} onClick={""} /> : null}
				</div>
			</div>
		);
	}


	
}

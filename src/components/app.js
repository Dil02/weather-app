// import preact
import { h, Component } from 'preact';

// import required Components from 'components/'
import Iphone from './iphone';
//import Ipad from './ipad';
import Temperature from './temperature';
import gpsUnlocated from '../assets/icons/gpsUnlocated.png'
import gpsLocated from '../assets/icons/gps.png'
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
			images: {
				gps: gpsUnlocated
			},
			latitude: 0,
			longitude: 0,
			APIkey: "77e99b5d05925f288eb80c06b0ef1be5",
			locationChanged: 0,
			windSpeed: 0,
			parsedtemperatureData: {},
			clothingItems: [],
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
				this.setState({
					clothingItems: this.generateClothing()
				})
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
			parsedtemperatureData: {
				city: 'need to get city from API.',
				currentTemp: parsed_json['current']['temp'],
				windSpeed: parsed_json['current']['wind_speed'],
				//Hourly Temp:
				hour1Temp: Math.round(parsed_json['hourly'][this.getCurrentHour()]['temp']), //The function getCurrentHour() is used in order to access the correct index of the API response.
				hour2Temp: Math.round(parsed_json['hourly'][this.getCurrentHour()+1]['temp']),  //Incrementing getCurrentHour() allows us to retrieve the temperature for the next 4 hours.
				hour3Temp: Math.round(parsed_json['hourly'][this.getCurrentHour()+2]['temp']),
				hour4Temp: Math.round(parsed_json['hourly'][this.getCurrentHour()+3]['temp']),
				hour5Temp: Math.round(parsed_json['hourly'][this.getCurrentHour()+4]['temp']),
				//Hourly Icon:
				hour1Icon: parsed_json['hourly'][this.getCurrentHour()]['weather'][0]['icon'], //Current hour's forecast and below is the next 4 hours.
				hour2Icon: parsed_json['hourly'][this.getCurrentHour()+1]['weather'][0]['icon'],
				hour3Icon: parsed_json['hourly'][this.getCurrentHour()+2]['weather'][0]['icon'],
				hour4Icon: parsed_json['hourly'][this.getCurrentHour()+3]['weather'][0]['icon'],
				hour5Icon: parsed_json['hourly'][this.getCurrentHour()+4]['weather'][0]['icon'],
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
				// <div id="app">
				// 	<Temperature {...this.state.parsedtemperatureData} 
				// 		getCurrentHour={() => this.getCurrentHour()}
				// 	/>
				// </div>

				//I commented out Temperature in order to work on Clothing.
				//Make sure to comment in and out the respective style sheets at the top to display the components.
				
				<div id="app"> 
					<Clothing clothingItems={this.state.clothingItems}
					/>
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


	//This function returns the current hour.
	getCurrentHour()
	{
		var today = new Date();
		return today.getHours();
	}

	//This function returns an array containing clothing items which are suitable for the user based on the current weather conditions provided by the API response.
	generateClothing()
    {
		//This inventory array contains the clothing items as objects with fields such as name and description, as well as criteria such as minTemp and minWind.
        const clothesInventory =[
            {name : "Base Layer", minTemp: -50, maxTemp : 14, minWind : 1, precipitation : 0, url : "base layer.png", 
			desc: "Keep yourself insulated with multiple thin layers.", brandLogo : "decathlon.png", brandUrl : "https://www.decathlon.co.uk/browse/c0-sports/c1-cycling/c3-cycling-base-layers/_/N-1ea1pdp" },

            {name : "Glasses", minTemp: -50, maxTemp : 35, minWind : 8, precipitation : 0, url : "glasses.png", 
			desc : "Protect against dust and insects.", brandLogo : "rayBans.jpg", brandUrl: "https://www.ray-ban.com/uk"},

            {name : "Gloves",  minTemp: -50, maxTemp : 7, minWind : 1, precipitation: 0, url : "gloves.png", 
			desc : "Keeping your hands nice and toasty.", brandLogo : "wiggle.png", brandUrl: "https://www.wiggle.co.uk/cycle/gloves"},

            {name : "Helmet", minTemp: -51, maxTemp : 35, minWind : 0, precipitation: 0, url : "helmet.png", 
			desc : "An essential to protect your head.", brandLogo : "alpina.png", brandUrl: "https://www.alpina-sports.com/uk/bike-helmets/"},

            {name : "Winter Jacket", minTemp: -50, maxTemp: 11, minWind : 0, precipitation: 0, url : "jacket.png", 
			desc : "Insulate your upper body with a winter jacket.", brandLogo : "north-face.png", brandUrl: "https://www.thenorthface.co.uk/"},

            {name : "Raincoat", minTemp: 11, maxTemp: 28, minWind : 0, precipitation: 10, url : "raincoat.png", 
			desc : "Keep dry with a lightweight rain jacket.", brandLogo : "parka.png", brandUrl: "https://www.parkalondon.com/the-journal/waterproof-raincoat-types-materials/"},

            {name : "Scarf", minTemp: -50, maxTemp: 10, minWind: 3, precipitation: 0, url : "scarf.png", 
			desc : "Prevent the chill getting any further with a scarf.", brandLogo: "jd.png" , brandUrl: "https://www.jdsports.co.uk/search/scarves/"},

            {name : "T-Shirt", minTemp: 15, maxTemp: 35, minWind:0, precipitation: 0, url : "shirt.png", 
			desc : "Cooler in these warmer conditions.", brandLogo: "nike.png", brandUrl: "https://www.nike.com/gb/w/tops-t-shirts-9om13"},

            {name : "Shorts", minTemp: 11, maxTemp: 35, minWind:0, precipitation: 0, url : "short.png", 
			desc : "Why not wear a pair of shorts for your ride.", brandLogo: "go-outdoors.png" , brandUrl: "https://www.gooutdoors.co.uk/walking/clothing/trousers-and-shorts/shorts/"},

			{name : "Waterproof Trousers", minTemp: -50, maxTemp: 35, minWind:0, precipitation:15, url : "waterproof.png", 
			desc : "Stay dry with a pair of waterproof trousers.", brandLogo: "cotswold-outdoor.png", brandUrl:"https://www.cotswoldoutdoor.com/c/clothing/trousers/waterproof.html"},

            {name : "Winter Hat", minTemp: -50, maxTemp: 13, minWind : 1, precipitation : 0, url : "winter-hat.png", 
			desc: "Keeping your ears and head warm.", brandLogo: "blacks.jpg", brandUrl: "https://www.blacks.co.uk/collections/winter-essentials/accessories/beanies/"},

			{name : "Water Bottle", minTemp: -51, maxTemp: 40, minWind:0, precipitation: 0, url: "water.png", 
			desc : "Remember to keep yourself hydrated!", brandLogo: "chillys.png", brandUrl: "https://www.chillys.com/uk/categories/bottles"}
        ];

		//Gets precipitation, currentTemp and windSpeed from the component state.
		//HARD CODED PRECIPITATION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:
		console.log(this.state.parsedtemperatureData.windSpeed);
		let currentTemp = this.state.parsedtemperatureData.currentTemp;
		let windSpeed = this.state.parsedtemperatureData.windSpeed;
		let precipitation = 0;

		const clothes=[];

		//Based on the current weather conditions, the for loop below iterates through the inventory to check if an item is suitable for recommendation.
		//Using the criteria for each object such as minTemp and comparing it with the weather data from the API.

        for(let i=0; i<clothesInventory.length; i++)
        {
            if(currentTemp>=clothesInventory[i].minTemp && currentTemp <=clothesInventory[i].maxTemp) //Checks if the current weather is between min and max temp of the item.
            {
                if(windSpeed >= clothesInventory[i].minWind)// Checks wind speed.
                {
                    if(precipitation >= clothesInventory[i].precipitation) // checks precipitation levels.
                    {
                        console.log(clothesInventory[i].name);
						clothes.push(clothesInventory[i]); // Pushes the item if it is suitable, to a clothes array.
                    }
                }
            }

			//This 'if' statement limits the amount of recommendations to 6, in order to prevent overwhelming the user.
			if(clothes.length==6)
			{
				return clothes;
			}
        }
		return clothes; //Returns an array containing items which can be recommended to the user.

    }


}
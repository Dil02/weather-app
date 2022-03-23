// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';

//icons
import remove from "../../assets/icons/remove.png";
import leftArrow from "../../assets/icons/left-arrow-white.png";

export default class CitySelect extends Component {
    // a constructor with initial set states
    constructor(props) {
        super(props);
        this.setState({
            isButtonDisabled: true,
            cities: [...this.props.cities],
            userInputtedCity: null
        });
    }

    componentWillUnmount() {
        //Save the list of cities in the parent's state
        this.props.updateCities(this.state.cities);
    }

    goToHome = () => {
        this.props.switchPageTo(this.props.PAGES.HOME);
    }

    //Check if the city exists by attempting to GET its coordinates
    // If it exists then add it to the list of cities.
    handleAddCity = async (e) => {

        if (!this.state.userInputtedCity) { return }
        this.setState({ isButtonDisabled: true });

        this.props.fetchGeoCoordinates(this.state.userInputtedCity)
            .then((response) => {
                console.log(this.props);
                this.setState({
                    cities: [{ key: this.props.keygen(), county: response[0].name, country: response[0].country }
                        , ...this.state.cities],
                    userInputtedCity: ""
                });
                console.log(response);

            }, (error) => {

                alert(error);
                console.error(error);

            })
            .finally(() => this.setState({ isButtonDisabled: false }));
    }

    //This function runs every time the text in the city search textbox changes.
    //The value of is updated to match the value in the textbox.
    handleUpdateState = (e) => {
        if (e.target.value == "") {
            this.setState({ isButtonDisabled: true });
        } else {
            this.setState({ isButtonDisabled: false });
        }
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // Sets the weather conditions to a new city.
    handleChangeCity = (county) => {
        this.props.setLocationByName(county);
        this.props.switchPageTo(this.props.PAGES.HOME);
    }

    //Removes a city from the list.
    handleRemoveCity = (e, key) => {
        e.stopPropagation();
        this.setState({
            cities: this.state.cities.filter((v) => v.key != key)
        });
    }

    render() {
        let cities = this.state.cities;

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
            <div className={`${style.container} ${bgImage}`}>

                {/* Title section */}

                <div className={style.title}>
                    <img id={style.backArrow} onClick={this.goToHome} src={leftArrow} />
                    <label className={style.citysearchLabel} for='userInputtedCity'>Enter a city, area, district, etcetera:</label>
                </div>

                {/* Search box section */}
                
                <div className={style.citysearchBox}>
                    <input type='search' id={style.citysearch} name='userInputtedCity'
                        value={this.state.userInputtedCity}
                        onInput={(e) => this.handleUpdateState(e)}
                        onKeyDown={(e) => { e.key == "Enter" ? this.handleAddCity(e) : null }} />
                    <input type='button' id={style.addcitybutton} value="Add City"
                        onClick={(e) => this.handleAddCity(e)} disabled={this.state.isButtonDisabled} />
                </div>

                {this.displayCities(cities)}

            </div>
        );
    }

    // Maps the array of cities into a human-readable list of cities.
    displayCities = (cities) => {
        return cities.map((val) => {
            return (
                <div key={val.key} className={style.city} onClick={() => this.handleChangeCity(val.county)}>
                    <div>
                        <h2>{val.county}</h2>
                        <p>{val.country}</p>
                    </div>
                    <img className={style.removeIcon} src={remove} alt="deleteButton" onClick={(e) => this.handleRemoveCity(e, val.key)} />
                </div>
            )
        });
    }
}
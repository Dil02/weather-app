// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';

//icons
import information from "../../assets/icons/information.png";
import raindrop from "../../assets/icons/raindrop.png";
import wind from "../../assets/icons/wind.png";
import { error } from 'jquery';

export default class CitySelect extends Component {
    // a constructor with initial set states
    constructor(props) {
        super(props);
        this.setState({
            //Some random cities to populate the list
            cities: [{ key: this.key(), county: 'London', country: 'GB' },
            { key: this.key(), county: 'Paris', country: 'FR' },
            { key: this.key(), county: 'Dubai', country: 'AE' },
            { key: this.key(), county: 'Beijing', country: 'CN' }],
            userInputtedCity: null
        });
    }

    key() {
        return Math.random() * 9999;
    }

    handleUpdate = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSearch = async (e) => {
        if (!this.state.userInputtedCity) { return }

        this.props.fetchGeoCoordinates(this.state.userInputtedCity)
        .then((response) => {

            this.setState({
                cities: [...this.state.cities,
                { key: this.key(), county: response[0].name, country: response[0].country }]
            });
            console.log(response);

        }, (error) => {

            alert(error);
            console.error(error);

        });
    }

    handleRemove = (e, key) => {
        this.setState({
            cities: this.state.cities.filter((v) => v.key != key)
        });
    }

    handleChange = (county) => {
        this.props.setLocationByName(county);
    }

    render() {
        let cities = this.state.cities;
        console.log(this.state);
        return (
            <div>
                <label for='citysearch'>Enter a city, area, district, etcetera:</label>
                <input type='search' id={style.citysearch} name='userInputtedCity'
                    onInput={(e) => this.handleUpdate(e)}
                    onKeyDown={(e) => { e.key == "Enter" ? this.handleSearch(e) : null }} />
                <input type='button' value="Add City" onClick={(e) => this.handleSearch(e)} />

                {cities.map((val) => {
                    return (
                        <section className={style.city} onClick={() => this.handleChange(val.county)}>
                            <h3>{val.county}</h3>
                            <p>{val.country}</p>
                            <button type="button" id='deleteButton' name="deleteButton" onClick={(e) => this.handleRemove(e, val.key)}>Delete</button>
                        </section>
                    )
                })}
            </div>
        );
    }
}
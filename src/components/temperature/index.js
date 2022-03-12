// import preact
import { h, render, Component } from 'preact';

import style from './style';

export default class Temperature extends Component {
    //Renders the temperature screen.
    render(){
        return(
            <div class={ style.container }>
                <header>
                    <h2 id="return" style="color: #fa9d13;">&#8592;</h2>
                    <h3>The city is{this.props.city}</h3>
                </header>
                <section>
                    
                </section>
                <footer>
                    <ul>
                        <li><p>{this.dayOfWeek(1)}</p><img>{this.props.icon}</img><em>{this.props.temp}</em></li>
                        <li><p>{this.dayOfWeek(2)}</p><img>{this.props.icon}</img><em>{this.props.temp}</em></li>
                        <li><p>{this.dayOfWeek(3)}</p><img>{this.props.icon}</img><em>{this.props.temp}</em></li>
                        <li><p>{this.dayOfWeek(4)}</p><img>{this.props.icon}</img><em>{this.props.temp}</em></li>
                        <li><p>{this.dayOfWeek(5)}</p><img>{this.props.icon}</img><em>{this.props.temp}</em></li>
                    </ul>
                </footer>
            </div>
        );
    }

    //This function calculates the date of the next five days and returns the name of the weekday.
    dayOfWeek(dayNumber)
    {
        let date = new Date();
        let newDate=date.setDate(date.getDate()+dayNumber);// Adds the current date and a value from 1-5.
        return new Date(newDate).toLocaleString('en-uk',{weekday: 'short'}); //creates a new Date object from the 'newDate' and returns the name of the weekday.
    }
}
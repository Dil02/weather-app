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
                    <h3>{this.props.city}</h3>
                </header>
                <section>
                    <ul>
                        <li><p>{this.props.hour1Temp}</p><img src={"http://openweathermap.org/img/w/"+this.props.hour1Icon+".png"}></img></li>
                        <li><p>{this.props.hour2Temp}</p><img src={"http://openweathermap.org/img/w/"+this.props.hour2Icon+".png"}></img></li>
                        <li><p>{this.props.hour3Temp}</p><img src={"http://openweathermap.org/img/w/"+this.props.hour3Icon+".png"}></img></li>
                        <li><p>{this.props.hour4Temp}</p><img src={"http://openweathermap.org/img/w/"+this.props.hour4Icon+".png"}></img></li>
                        <li><p>{this.props.hour5Temp}</p><img src={"http://openweathermap.org/img/w/"+this.props.hour5Icon+".png"}></img></li>
                    </ul>
                </section>
                <footer>
                    <ul>
                        <li><p>{this.dayOfWeek(1)}</p><img src={"http://openweathermap.org/img/w/"+this.props.daily1Icon+".png"}></img><em>{this.props.daily1Temp}</em></li>
                        <li><p>{this.dayOfWeek(2)}</p><img src={"http://openweathermap.org/img/w/"+this.props.daily2Icon+".png"}></img><em>{this.props.daily2Temp}</em></li>
                        <li><p>{this.dayOfWeek(3)}</p><img src={"http://openweathermap.org/img/w/"+this.props.daily3Icon+".png"}></img><em>{this.props.daily3Temp}</em></li>
                        <li><p>{this.dayOfWeek(4)}</p><img src={"http://openweathermap.org/img/w/"+this.props.daily4Icon+".png"}></img><em>{this.props.daily4Temp}</em></li>
                        <li><p>{this.dayOfWeek(5)}</p><img src={"http://openweathermap.org/img/w/"+this.props.daily5Icon+".png"}></img><em>{this.props.daily5Temp}</em></li>
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
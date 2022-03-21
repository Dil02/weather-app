// import preact
import { h, render, Component } from 'preact';

import style from './styleNight';

export default class Temperature extends Component {

    //Renders the temperature screen.
    render(){
        return(
            <div class={ style.containerT }>
                <header class={style.headerT}>
                    <img id={style.returnT} src="../../assets/icons/left-arrow-orange.png"></img>
                    <h3 id={style.cityT}>{this.props.city}</h3>
                </header>
                <section id={style.hourInfoMain}>
                    <ul class={style.listT}>
                        <li class={style.hourInfo} id={style.currentTemp}>
                            <p class={style.hourlyTemp}>{this.props.hour1Temp}&#8451;</p>
                            <img class={style.hourImage} src={"http://openweathermap.org/img/wn/"+this.props.hour1Icon+".png"}></img>
                            <p class={style.timeT}>{this.getCurrentHour(0)}:00</p>
                        </li>
                        <li class={style.hourInfo}>
                            <p class={style.hourlyTemp}>{this.props.hour2Temp}&#8451;</p>
                            <img class={style.hourImage} src={"http://openweathermap.org/img/wn/"+this.props.hour2Icon+".png"}></img>
                            <p class={style.timeT}>{this.getCurrentHour(1)}:00</p>
                        </li>
                        <li class={style.hourInfo}>
                            <p class={style.hourlyTemp}>{this.props.hour3Temp}&#8451;</p>
                            <img class={style.hourImage} src={"http://openweathermap.org/img/wn/"+this.props.hour3Icon+".png"}></img>
                            <p class={style.timeT}>{this.getCurrentHour(2)}:00</p>
                        </li>
                        <li class={style.hourInfo}>
                            <p class={style.hourlyTemp}>{this.props.hour4Temp}&#8451;</p>
                            <img class={style.hourImage} src={"http://openweathermap.org/img/wn/"+this.props.hour4Icon+".png"}></img>
                            <p class={style.timeT}>{this.getCurrentHour(3)}:00</p>
                        </li>
                        <li class={style.hourInfo}>
                            <p class={style.hourlyTemp}>{this.props.hour5Temp}&#8451;</p>
                            <img class={style.hourImage} src={"http://openweathermap.org/img/wn/"+this.props.hour5Icon+".png"}></img>
                            <p class={style.timeT}>{this.getCurrentHour(4)}:00</p>
                        </li>
                    </ul>
                </section>
                <footer id={style.dayInfoMain}>
                    <ul class={style.listT}>
                        <li class={style.dayInfo}>
                            <p class={style.date}>{this.dayOfWeek(1)}</p>
                            <img class={style.dailyImage} src={"http://openweathermap.org/img/wn/"+this.props.daily1Icon+".png"}></img>
                            <p class={style.dailyTemp}>{this.props.daily1Temp}&#8451;</p>
                        </li>
                        <li class={style.dayInfo}>
                            <p class={style.date}>{this.dayOfWeek(2)}</p>
                            <img class={style.dailyImage} src={"http://openweathermap.org/img/wn/"+this.props.daily2Icon+".png"}></img>
                            <p class={style.dailyTemp}>{this.props.daily2Temp}&#8451;</p>
                        </li>
                        <li class={style.dayInfo}>
                            <p class={style.date}>{this.dayOfWeek(3)}</p>
                            <img class={style.dailyImage} src={"http://openweathermap.org/img/wn/"+this.props.daily3Icon+".png"}></img>
                            <p class={style.dailyTemp}>{this.props.daily3Temp}&#8451;</p>
                        </li>
                        <li class={style.dayInfo}>
                            <p class={style.date}>{this.dayOfWeek(4)}</p>
                            <img class={style.dailyImage} src={"http://openweathermap.org/img/wn/"+this.props.daily4Icon+".png"}></img>
                            <p class={style.dailyTemp}>{this.props.daily4Temp}&#8451;</p>
                        </li>
                        <li class={style.dayInfo}>
                            <p class={style.date}>{this.dayOfWeek(5)}</p>
                            <img class={style.dailyImage} src={"http://openweathermap.org/img/wn/"+this.props.daily5Icon+".png"}></img>
                            <p class={style.dailyTemp}>{this.props.daily5Temp}&#8451;</p>
                        </li>
                    </ul>
                </footer>
            </div>
        );
    }

    //This function calculates the date of the next five days and returns the name and date of the weekday.
    dayOfWeek(dayNumber)
    {
        let date = new Date();
        let newDate=date.setDate(date.getDate()+dayNumber);// Adds the current date and a value from 1-5.

        let weekdayString= new Date(newDate).toLocaleString('en-uk',{weekday: 'short'}); //creates a new Date object from the 'newDate' and returns the name of the weekday.
        
        //The code below retrives the date of the month and returns the weekday, date of the month and correct suffix ('rd','th','nd','st') concatenated together.

        const lastDigit=date.getDate()%10; //extracts the last digit of the date.
        const bothDigits=date.getDate()%100;

        if(lastDigit==1 && bothDigits!=11) //dates ending with a 1 have the 'st' suffix apart from 11.
        {
            return weekdayString + " " + date.getDate() + "st";
        }
        else if(lastDigit==2 && bothDigits!=12) //dates ending with a 2 have the 'nd' suffix apart from 12.
        {
            return weekdayString + " " + date.getDate() + "nd";
        }
        else if(lastDigit==3 && bothDigits!=13) //dates ending with a 3 have the 'rd' suffix apart from 13.
        {
            return weekdayString + " " + date.getDate() + "rd"; 
        }
        else //all other dates end with the 'th' suffix.
        {
            return weekdayString + " " + date.getDate() + "th"; 
        }
 
    }

    //This function returns the current hour with the increment value added to it.
    //Necessary because time is from 00:00 - 23:59, not modifying the date object would lead to times of 24:00 etc which is incorrect.
    getCurrentHour(increment)
    {
        let date = new Date();
        date.setHours(date.getHours()+increment);

        return date.getHours();
    }

}
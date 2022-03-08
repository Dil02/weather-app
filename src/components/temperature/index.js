// import preact
import { h, render, Component } from 'preact';

export default class Temperature extends Component {
    //Renders the temperature screen.
    render(){
        return(
                <p>This is the temperature for the next 5 days.</p>
        );
    }
}
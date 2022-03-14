// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';

//icons


export default class Strip extends Component {

    // a constructor with initial set states
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <div class={style.strip}>
                <span>
                    <img src={this.props.img} alt='' />
                    <p>{this.props.text}</p>
                </span>
                <span>
                    <p>{this.props.data}</p>
                </span>

            </div>
        );
    }
}
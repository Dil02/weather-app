// import preact
import { h, render, Component } from 'preact';
//import fonts
import '../../fonts/PermanentMarker-Regular.ttf';
// import stylesheets
import style from './style';

export default class Strip extends Component {

    // a constructor with initial set states
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class={`${style.strip} ${this.props.onClick ? style.clickabble : null}`}
            onClick={this.props.onClick ? () => this.props.onClick() : null}>
                <span class={style.stripLeft}>
                    <img src={this.props.img} alt='' />
                    <p className={style.font_face_pm}>{this.props.text}</p>
                </span>
                <span class={style.stripRight}>
                    <p>{this.props.data}</p>
                </span>

            </div>
        );
    }
}
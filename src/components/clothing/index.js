// import preact
import { h, render, Component } from 'preact';

import style from './style';

export default class Clothing extends Component{    
    //renders the clothing component
    render(){
        return(
            <div class={ style.container }>
                <header>
                    <h4>Recommended Clothing and Accessories</h4>
                    <h6>Swipe Across</h6>
                </header>
                <section id={style.clothingDisplay}>
                    {this.displayItems(this.props.clothingItems)}
                </section>
                <footer>
                    <p>Retailers</p>
                </footer>
            </div>
        );
    }

    // This function is used to display the clothing items.
    displayItems(items){
        //The map function returns a clothing item's name, image and description in their respective html tags all wrapped within an <article>.
        return items.map(item => (
            <article class={style.clothingItems}>
                <h5>{item.name}</h5>
                <img src={"../../assets/icons/clothingIcons/" + item.url}></img>
                <p>{item.desc}</p>
            </article>


        ));
    }
    

}

//GUI TO DO:
//Make app dynamic goes dark once sunset occurs.
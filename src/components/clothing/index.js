// import preact
import { h, render, Component } from 'preact';

import style from "./style";
//images
import leftArrow from '../../assets/icons/left-arrow-white.png';

export default class Clothing extends Component {

    //renders the clothing component
    render() {
        return (
            <div class={style.containerC}>
                <header class={style.headerC}>
                    <img id={style.returnC} 
                    src={leftArrow} 
                    onClick={() => this.props.switchPageTo(this.props.PAGES.HOME)} />
                    <h4 id={style.titleC}>Clothing and Accessories</h4>
                </header>
                <section id={style.clothingDisplay}>
                    <ul class={style.listC}>
                        {console.log("The amount of items is: " + this.props.clothingItems.length)}
                        {this.displayItems(this.props.clothingItems)}
                    </ul>
                </section>

                <footer>

                </footer>
            </div>
        );
    }

    // This function is used to display the clothing items.
    displayItems(items) {
        //The map function returns a clothing item's name, image, description and brand logo in their respective html tags all wrapped within an <li>.
        //The function iterates through the clothing Items array, passed as a prop.
        return items.map(item => (
            <li class={style.clothingItems}>
                <h5 class={style.itemName}>{item.name}</h5>
                <img class={style.itemImage} src={"../../assets/icons/clothingIcons/" + item.url} alt="Clothing Item"></img>
                <div class={style.overlay}>
                    <p class={style.itemDesc}>{item.desc}</p>
                    <a href={item.brandUrl} target="_blank">
                        <img class={style.brandLogo} src={"../../assets/icons/brands/" + item.brandLogo} alt="Brand Logo"></img>
                    </a>
                </div>
            </li>
        ));
    }


}
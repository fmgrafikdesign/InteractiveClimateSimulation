import m from 'mithril';
import Nav from '../Nav';
import {options} from "../Terrain/Generators/GeneratorOptions/GeneratorOptions";
import * as mapBox from 'mapbox-gl';
import {MapLayerMouseEvent} from "mapbox-gl";

const items: Array<m.Vnode<any, any>> = generateMenuItems();


const App: m.Component = {
    oncreate: ({dom}) => {
        const map = new mapBox.Map({
            container: 'map', // Specify the container ID
            style: 'mapbox://styles/mapbox/outdoors-v11', // Specify which map style to use
            center: [14.515, 48.368], // Specify the starting position [lng, lat]
            zoom: 15.5, // Specify the starting zoom
            accessToken: 'pk.eyJ1IjoibXVlZ2dyb2dvbmRyb2xsYSIsImEiOiJjazJ4ZjEyY2kwYjBzM2dvbWVoYjF4MndnIn0.CkaTPt0RObUkNLIUiWSecg'
        });
		map.on("click", testFunction);
    },
    view: () =>
        m('.page',
            m(Nav),
            m("h1.Init-Menu-Headline", "Choose an option how the simulated terrain is being generated"),
            m("div.Init-Menu-Items-Container", items),
            //m("div.Map-Container", m("div#map"))
        )
};

function generateMenuItems(): Array<m.Vnode<any, any>> {
    const generatedItems: Array<m.Vnode<any, any>> = [];

    for (let i = 0; i < options.length; i++) {
        let itemID: string = "MenuItem" + i;
        generatedItems.push(
            m("div.Init-Menu-Item-Wrapper",
                //m(m.route.Link, {href: options[i].link}, // TODO: add the chosen type as a parameter
                m("div", {onclick: testFunction, id: itemID, class: "Init-Menu-Item", link: options[i].link, linkParameter: options[i].type},
                    m("h3", options[i].name))));
    }

    return generatedItems;
}

function testFunction(mouseEvent: MapLayerMouseEvent) {
    const lng = mouseEvent.lngLat.lng;
    const lat = mouseEvent.lngLat.lat;
    console.log(lng + ', ' + lat);

    console.log(mouseEvent);
    //m.route.set("/level");

    /*
	console.log(mouseEvent);
	removeSelectedPropertyOfAllItems();

	if (mouseEvent.target !== null)
	{
		let clickedElement: Element = mouseEvent.target as Element;

		if (clickedElement.classList.contains("Init-Menu-Item"))
		{
			clickedElement.classList.add("Selected");
			/*m.request({
				method: "POST",
				url: clickedElement.getAttribute("link") as string,
				params: {type: clickedElement.getAttribute("linkParameter")}
			});*

			m.route.set(clickedElement.getAttribute("link") as string + "/:type", {type: clickedElement.getAttribute("linkParameter")});
		}
	}
	*/
}

function removeSelectedPropertyOfAllItems() {
    const items: Array<Element> = document.getElementsByClassName("Selected") as unknown as Array<Element>;

    for (const item of items) {
        if (item.classList.contains("Selected")) {
            item.classList.remove("Selected");
        }
    }
}

export default App;

import m from 'mithril';
import Nav from '../Nav';
import {GeneratorOptions} from "../Terrain/Generators/GeneratorOptions/GeneratorOptions";
import {IGeneratorOption} from "../Terrain/Generators/GeneratorOptions/IGeneratorOption";
import {RandomTerrainGenerator} from "../Terrain/Generators/GeneratorOptions/RandomTerrainGenerator";
import {RandomBuilderTerrainGenerator} from "../Terrain/Generators/GeneratorOptions/RandomBuilderTerrainGenerator";
import {PerlinNoiseTerrainGenerator} from "../Terrain/Generators/GeneratorOptions/PerlinNoiseTerrainGenerator";
import {MapTerrainGenerator} from "../Terrain/Generators/GeneratorOptions/MapTerrainGenerator";
import {CubeTerrainGenerator} from "../Terrain/Generators/GeneratorOptions/CubeTerrainGenerator";

const options: IGeneratorOption[] = [
    new RandomTerrainGenerator(),
    new RandomBuilderTerrainGenerator(),
    //new PerlinNoiseTerrainGenerator(),
    new MapTerrainGenerator(),
    new CubeTerrainGenerator()
];

const items: Array<m.Vnode<any, any>> = generateMenuItems();


const App: m.Component = {
    view: () =>
        m('.page', {onclick: testFunction},
            m(Nav),
            m("h1.Init-Menu-Headline", "Choose an option how the simulated terrain is being generated"),
            m("div.Init-Menu-Items-Container", items)
    )
};

function generateMenuItems() : Array<m.Vnode<any, any>>
{
    const generatedItems : Array<m.Vnode<any, any>> = [];

    for (let i = 0; i < options.length; i++) {
        let itemID : string = "MenuItem" + i;
        generatedItems.push(
            m("div.Init-Menu-Item-Wrapper",
                //m(m.route.Link, {href: options[i].link}, // TODO: add the chosen type as a parameter
                m("div", {onclick: testFunction, id: itemID, class: "Init-Menu-Item", link: options[i].link, linkParameter: options[i].type},
                    m("h3", options[i].name))));
    }

    return generatedItems;
}

function testFunction(mouseEvent : MouseEvent) {
    console.log(mouseEvent);
    removeSelectedPropertyOfAllItems();

    if (mouseEvent.target !== null)
    {
        let clickedElement : Element = mouseEvent.target as Element;

        if (clickedElement.classList.contains("Init-Menu-Item"))
        {
            clickedElement.classList.add("Selected");
            /*m.request({
                method: "POST",
                url: clickedElement.getAttribute("link") as string,
                params: {type: clickedElement.getAttribute("linkParameter")}
            });*/

            m.route.set(clickedElement.getAttribute("link") as string + "/:type", {type:  clickedElement.getAttribute("linkParameter")});
        }
    }
}

function removeSelectedPropertyOfAllItems()
{
    const items : Array<Element> = document.getElementsByClassName("Selected") as unknown as Array<Element>;

    for (const item of items) {
        if (item.classList.contains("Selected")) {
            item.classList.remove("Selected");
        }
    }
}

export default App;

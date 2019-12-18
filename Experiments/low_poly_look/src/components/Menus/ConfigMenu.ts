import m from 'mithril';
import {RandomBuilderTerrainGenerator} from "../Terrain/Generators/GeneratorOptions/RandomBuilderTerrainGenerator";
import {RandomTerrainBuilderGenerator} from "../Terrain/Generators/RandomTerrainBuilderGenerator";


const ConfigMenu: m.ClosureComponent = (vnode) => {
    return {
        oninit ({attrs}) {

            m("div", "Generating terrain");

            console.log("Attrs in oninit: ");
            console.log(attrs);
        },
        oncreate (vnode) {

            m("div", "Generating terrain");

            console.log("VNode in oncreate: ");
            console.log(vnode);

            m.route.set("/level"/*, {terrain: new RandomTerrainBuilderGenerator()}*/);

/*            const initMenuHeadline = document.createElement("h1");
            initMenuHeadline.classList.add("Init-Menu-Headline");
            initMenuHeadline.innerText = "Choose an option how the simulated terrain is being generated";

            const itemContainer = document.createElement("div");
            itemContainer.classList.add("Init-Menu-Items-Container");

            for (let i = 0; i < options.length; i++) {
                const itemWrapper = document.createElement("div");
                itemWrapper.classList.add("Init-Menu-Item-Wrapper");
                const itemLink = document.createElement("a");
                itemLink.setAttribute("href", options[i].link.attrs.href);
                itemLink.classList.add("Init-Menu-Item-Link");
                const item = document.createElement("div");
                item.classList.add("Init-Menu-Item");
                const title = document.createElement("h3");
                title.innerText = options[i].name;

                itemWrapper.appendChild(itemLink);
                itemLink.appendChild(item);
                item.appendChild(title);

                itemContainer.appendChild(itemWrapper);
            }

            document.body.appendChild(initMenuHeadline);
            document.body.appendChild(itemContainer);*/
        },
        view ({attrs}) {

            console.log("Attrs in view: ");
            console.log(attrs);

            m("div", "Generating terrain");
        }
    };
};

export default ConfigMenu;

import m from "mithril"
import {TerrainRendererInterface} from "./TerrainRenderer";
import StaticTerrainRenderer from "./StaticTerrainRenderer";
import * as mapBox from "mapbox-gl";
import {MapLayerMouseEvent} from "mapbox-gl";

export default function App(): m.Component {
    let container: HTMLElement | undefined;
    let canvas: HTMLCanvasElement | undefined;
    let renderer: TerrainRendererInterface;

    function generateTerrainWithLatLng(lat: number, lng: number) {
        StaticTerrainRenderer.generateTerrainWithLatLng(lat, lng);
    }

    function hideMap() {
        const map = document.getElementById("mapWrapper") as HTMLElement;
        map.classList.add("minimized");
        const helperInfo = document.getElementById("helperInfo") as HTMLElement;
        helperInfo.classList.add("minimized");

        const getMapButton = document.getElementById("MapGetterButton") as HTMLElement;
        getMapButton.classList.add("active");
        const returnMapButton = document.getElementById("MapReturnButton") as HTMLElement;
        returnMapButton.classList.remove("active");
    }

    function showMap() {
        const map = document.getElementById("mapWrapper") as HTMLElement;
        map.classList.remove("minimized");
        const helperInfo = document.getElementById("helperInfo") as HTMLElement;
        helperInfo.classList.remove("minimized");

        const getMapButton = document.getElementById("MapGetterButton") as HTMLElement;
        getMapButton.classList.remove("active");
        const returnMapButton = document.getElementById("MapReturnButton") as HTMLElement;
        returnMapButton.classList.add("active");
    }

    function clickOnMap(mouseEvent: MapLayerMouseEvent) {
        generateTerrainWithLatLng(mouseEvent.lngLat.lat, mouseEvent.lngLat.lng);

        hideMap();
    }

    return {
        oncreate({dom}) {
            const map = new mapBox.Map({
                container: 'map', // Specify the container ID
                style: 'mapbox://styles/mapbox/outdoors-v11', // Specify which map style to use
                center: [14.515, 48.368], // Specify the starting position [lng, lat]
                zoom: 15.5, // Specify the starting zoom
                accessToken: 'pk.eyJ1IjoibXVlZ2dyb2dvbmRyb2xsYSIsImEiOiJjazJ4ZjEyY2kwYjBzM2dvbWVoYjF4MndnIn0.CkaTPt0RObUkNLIUiWSecg'
            });
            map.on("click", clickOnMap);


            container = dom as HTMLElement;
            canvas = container.querySelector('canvas#terrain-canvas') as HTMLCanvasElement;

            // renderer = new TerrainRenderer(canvas);
            //renderer = StaticTerrainRenderer;
            StaticTerrainRenderer.init(canvas);


            // TODO Create resize event listener
        },

        onremove() {
            // TODO remove resize event listener
        },

        view() {
            return m('.app',
                [
                    m('#mapWrapper', m('div#map')),
                    m('.canvas-wrapper', m('canvas#terrain-canvas')),
                    m('.ui', [
                        // Arbitrary coordinates
                        m('.change-map-button', {onclick: () => generateTerrainWithLatLng(14.565, 48.378)}, 'Change Map'),
                        m('#MapGetterButton.Map-Button',
                            m('.Map-Button-Label.Map-Getter-Button-Label.UI-Element', {onclick: () => showMap()}, [
                                m('.icon', '/\\'),
                                m('.additional-info', 'change area')
                            ])),
                        m('#MapReturnButton.Map-Button.active',
                            m('.Map-Button-Label.Map-Return-Button-Label.UI-Element', {onclick: () => hideMap()}, [
                                m('.additional-info', 'return to 3D'),
                                m('.icon', '\\/')
                            ])),
                        m('#helperInfo', m('.UI-Element', 'click anywhere on the map to load this area in 3D'))
                    ])
                ]);
        }
    }
}
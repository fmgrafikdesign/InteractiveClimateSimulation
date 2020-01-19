import m from "mithril"
import {TerrainRendererInterface} from "./TerrainRenderer";
import StaticTerrainRenderer from "./StaticTerrainRenderer";
import * as mapBox from "mapbox-gl";
import {MapLayerMouseEvent} from "mapbox-gl";
import Simulation from "../Simulation/Simulation";
import DebugInfo from "../DebugInfo";

const MAP = 0;
const TERRAIN = 1;

export default function App(): m.Component {
    let container: HTMLElement | undefined;
    let canvas: HTMLCanvasElement | undefined;
    let renderer: TerrainRendererInterface;
    let state = MAP;

    function generateTerrainWithLatLng(lat: number, lng: number) {
        StaticTerrainRenderer.generateTerrainWithLatLng(lat, lng);
        Simulation.init(StaticTerrainRenderer.terrain);
        Simulation.start();
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
                accessToken: 'pk.eyJ1IjoibXVlZ2dyb2dvbmRyb2xsYSIsImEiOiJjazJ4ZjEyY2kwYjBzM2dvbWVoYjF4MndnIn0.CkaTPt0RObUkNLIUiWSecg',
                center: [14.515, 48.368], // Specify the starting position [lng, lat]
                container: 'map', // Specify the container ID
                style: 'mapbox://styles/mapbox/outdoors-v11', // Specify which map style to use
                zoom: 15.5 // Specify the starting zoom
            });
            map.on("click", clickOnMap);

            /*
            function clickOnMap(mouseEvent: MapLayerMouseEvent) {
                generateTerrainWithLatLng(mouseEvent.lngLat.lat, mouseEvent.lngLat.lng);
                state = TERRAIN;
                m.redraw();
                StaticTerrainRenderer.resize();
                const mapDOMelement = document.getElementById("mapWrapper") as HTMLElement;
                //mapDOMelement.classList.add("Map-minimized");
            }
*/
            container = dom as HTMLElement;
            canvas = container.querySelector('canvas#terrain-canvas') as HTMLCanvasElement;

            StaticTerrainRenderer.init(canvas);
        },

        onremove() {

        },

        view() {
            return m('.app',
                [
                    m('#mapWrapper', m('div#map')),
                    m('.canvas-wrapper', m('canvas#terrain-canvas')),
                    m('.ui', [
                        m('#MapGetterButton.Map-Button.UI-Element-Container',
                            m('.Map-Button-Label.Map-Getter-Button-Label.clickable', {onclick: () => showMap()}, [
                                m('.icon', '/\\'),
                                m('.additional-info', 'change area')
                            ])),
                        m('#MapReturnButton.Map-Button.UI-Element-Container',
                            m('.Map-Button-Label.Map-Return-Button-Label.clickable', {onclick: () => hideMap()}, [
                                m('.additional-info', 'return to 3D'),
                                m('.icon', '\\/')
                            ])),
                        m('#helperInfo.UI-Element-Container', m('', 'click anywhere on the map to load this area in 3D')),
                        m('#debug-info', m(DebugInfo))
                    ])
                ]);
        }
    };
}

/**
 view() {
            return m('.app',
                m('#mapWrapper', {class: state === TERRAIN ? 'd-none' : ''}, m('div#map')),
                m('.terrain-components-wrapper', {class: state === MAP ? 'd-none' : ''},
                    [
                        m('.canvas-wrapper', m('canvas#terrain-canvas')),
                        m('.ui', [
                            // Arbitrary coordinates
                            m('.change-map-button', {
                                onclick: () => {
                                    const mapDOMelement = document.getElementById("mapWrapper") as HTMLElement;
                                    //mapDOMelement.classList.toggle("Map-minimized");
                                    state = MAP;
                                    m.redraw();
                                }
                            }, 'Change Map')
                            //m('.choose-terrain', m('.choose-terrain-text', 'Choose your terrain'))
                        ])
                    ]));
        }
 **/

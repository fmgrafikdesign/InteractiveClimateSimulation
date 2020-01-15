import m from "mithril"
import TerrainRenderer, {TerrainRendererInterface} from "./TerrainRenderer";
import StaticTerrainRenderer from "./StaticTerrainRenderer";
import * as mapBox from "mapbox-gl";
import {MapLayerMouseEvent} from "mapbox-gl";

const MAP = 0;
const TERRAIN = 1;

export default function App(): m.Component {
    let container: HTMLElement | undefined;
    let canvas: HTMLCanvasElement | undefined;
    let renderer: TerrainRendererInterface;
    let state = MAP;

    function generateTerrainWithLatLng(lat: number, lng: number) {
        StaticTerrainRenderer.generateTerrainWithLatLng(lat, lng);
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

            function clickOnMap(mouseEvent: MapLayerMouseEvent) {
                generateTerrainWithLatLng(mouseEvent.lngLat.lat, mouseEvent.lngLat.lng);
                state = TERRAIN;
                m.redraw();
                StaticTerrainRenderer.resize();
                const mapDOMelement = document.getElementById("mapWrapper") as HTMLElement;
                //mapDOMelement.classList.add("Map-minimized");
            }

            container = dom as HTMLElement;
            canvas = container.querySelector('canvas#terrain-canvas') as HTMLCanvasElement;

            StaticTerrainRenderer.init(canvas);
        },

        onremove() {

        },

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
    };
}

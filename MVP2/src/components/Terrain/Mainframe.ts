import m from "mithril"
import TerrainRenderer, {TerrainRendererInterface} from "./TerrainRenderer";
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

    function clickOnMap(mouseEvent: MapLayerMouseEvent) {
        generateTerrainWithLatLng(mouseEvent.lngLat.lat, mouseEvent.lngLat.lng);
        const map = document.getElementById("mapWrapper") as HTMLElement;
        map.classList.add("Map-minimized");
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
                        m('.change-map-button', {onclick: () => generateTerrainWithLatLng(14.565, 48.378)}, 'Change Map')
                    ])
                ]);
        }
    }
}
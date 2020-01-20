import m from "mithril"
import {TerrainRendererInterface} from "./TerrainRenderer";
import StaticTerrainRenderer from "./StaticTerrainRenderer";
import * as mapBox from "mapbox-gl";
import {GeoJSONSource, Layer, LngLat, MapLayerMouseEvent, Marker} from "mapbox-gl";
import Simulation from "../Simulation/Simulation";
import DebugInfo from "../DebugInfo";
import LngLatTerrainGenerator from "./Generators/LngLatTerrainGenerator";
import {Layers, Vector3} from "three";
import MapboxMathUtils from "./Generators/MapboxMathUtils";
import HumidityColorModel from "./ColorModels/HumidityColorModel";
import {ITerrainColorModel} from "./ColorModels/ITerrainColorModel";
import TemperatureHumidityColorModel from "./ColorModels/TemperatureHumidityColorModel";
import HeightColorModel from "./ColorModels/HeightColorModel";
import TemperatureColorModel from "./ColorModels/TemperatureColorModel";

const MAP = 0;
const TERRAIN = 1;

export default function App(): m.Component {
    let container: HTMLElement | undefined;
    let canvas: HTMLCanvasElement | undefined;
    let renderer: TerrainRendererInterface;
    let state = MAP;

    /**
     * Hover UI elements -> for showing the tile, that is being currently hovered
     */
    let showTileBordersOnHover: boolean = true;
    let showTileBorderMarkers: boolean = false;
    let showTileFilled: boolean = true;
    let lastMarkerTileIndices: Vector3 = new Vector3();
    let currentMarkers: Array<Marker> = new Array<Marker>(); // workaround variable, because I do not know how to get all markers on a map and delete them

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
        const colorModelContainer = document.getElementById("colorModelContainer") as HTMLElement;
        colorModelContainer.classList.remove("active");

        if (Simulation.paused)
        {
            Simulation.pause();
        }
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
        const colorModelContainer = document.getElementById("colorModelContainer") as HTMLElement;
        colorModelContainer.classList.add("active");

        Simulation.pause();
    }

    function clickOnMap(mouseEvent: MapLayerMouseEvent) {
        generateTerrainWithLatLng(mouseEvent.lngLat.lat, mouseEvent.lngLat.lng);

        hideMap();
    }

    function hoverMap(mouseEvent: MapLayerMouseEvent) {

        if (showTileBordersOnHover)
        {
            let indices: Vector3 = MapboxMathUtils.getTileIndices(mouseEvent.lngLat.lng, mouseEvent.lngLat.lat);

            if (lastMarkerTileIndices.x != indices.x || lastMarkerTileIndices.y != indices.y)
            {
                lastMarkerTileIndices = indices;

                currentMarkers.forEach((item) => { item.remove(); });

                currentMarkers = [];

                const lngLat1: LngLat = MapboxMathUtils.getLongitudeLatitudeFromIndex(indices.x, indices.y, indices.z);
                const lngLat2: LngLat = MapboxMathUtils.getLongitudeLatitudeFromIndex(indices.x + 1, indices.y, indices.z);
                const lngLat3: LngLat = MapboxMathUtils.getLongitudeLatitudeFromIndex(indices.x, indices.y + 1, indices.z);
                const lngLat4: LngLat = MapboxMathUtils.getLongitudeLatitudeFromIndex(indices.x + 1, indices.y + 1, indices.z);

                if (showTileBorderMarkers) {
                    addMarker(lngLat1, mouseEvent);
                    addMarker(lngLat2, mouseEvent);
                    addMarker(lngLat3, mouseEvent);
                    addMarker(lngLat4, mouseEvent);
                }

                if (showTileFilled) {
                    addRectangle([lngLat1, lngLat2, lngLat4, lngLat3], mouseEvent);
                }

                console.debug("Setting marker for tile: [" + indices.x + "," + indices.y + "]");
                console.debug(MapboxMathUtils.getLongitudeLatitudeFromIndex(indices.x, indices.y, indices.z));
            }
        }
    }

    function changeColorModel(colorModelString: string) {
        let colorModel: ITerrainColorModel;

        switch (colorModelString) {
            case "height":
                colorModel = new HeightColorModel();
                break;
            case "humidity":
                colorModel = new HumidityColorModel();
                break;
            case "temperature":
                colorModel = new TemperatureColorModel();
                break;
            case "temperature-humidity":
            default:
                colorModel = new TemperatureHumidityColorModel();
                break;
        }

        Simulation.context.setColorModel(colorModel);
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
            map.on("mousemove", hoverMap);

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
                        m('#debug-info', m(DebugInfo)),
                        m('#colorModelContainer.UI-Element-Container', [
                            m('.colorModelButton.clickable', {onclick: () => changeColorModel("height")}, "Height"),
                            m('.colorModelButton.clickable', {onclick: () => changeColorModel("humidity")}, "Humidity"),
                            m('.colorModelButton.clickable', {onclick: () => changeColorModel("temperature")}, "Temperature"),
                            m('.colorModelButton.clickable', {onclick: () => changeColorModel("temperature-humidity")}, "Temperature & Humidity"),
                        ])
                    ])
                ]);
        }
    };


    /**
     * Helper and convenience functions
     */

    function addMarker(lngLat: LngLat, mouseEvent: MapLayerMouseEvent) {
        const marker = new Marker({'color': '#31cc4d'}).setLngLat(lngLat).addTo(mouseEvent.target);

        currentMarkers.push(marker);
    }

    function addRectangle(lngLats: Array<LngLat>, mouseEvent: MapLayerMouseEvent) {
        if (mouseEvent.target.getLayer('currentTile')) {
            mouseEvent.target.removeLayer('currentTile');
            mouseEvent.target.removeSource('currentTile');
        }
        mouseEvent.target.addLayer({
            'id': 'currentTile',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': lngLatArrayToNumbersArray(lngLats)
                    }
                }
            },
            'paint': {
                'fill-color': '#1d881c',
                'fill-opacity': 0.3,
            }
        });
    }

    function lngLatArrayToNumbersArray(lngLatArray: Array<LngLat>): number[][] {
        let targetArray: number[][] = [];

        lngLatArray.forEach((item) => { targetArray.push([item.lng, item.lat])});

        console.log(targetArray);

        return targetArray;
    }

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

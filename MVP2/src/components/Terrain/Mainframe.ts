import m from "mithril"
import TerrainRenderer, {TerrainRendererInterface} from "./TerrainRenderer";
import StaticTerrainRenderer from "./StaticTerrainRenderer";

export default function App(): m.Component {
    let container: HTMLElement | undefined;
    let canvas: HTMLCanvasElement | undefined;
    let renderer: TerrainRendererInterface;

    function generateTerrainWithLatLng(lat: number, lng: number) {
        StaticTerrainRenderer.generateTerrainWithLatLng(lat, lng);
    }

    return {
        oncreate({dom}) {
            container = dom as HTMLElement;
            canvas = container.querySelector('canvas#map-canvas') as HTMLCanvasElement;

            // renderer = new TerrainRenderer(canvas);
            //renderer = StaticTerrainRenderer;
            StaticTerrainRenderer.init(canvas);

            // TODO Create resize event listener
        },

        onremove() {
            // TODO remove resize event listener
        },

        view()  {
            return m('.app',
                [
                    m('.canvas-wrapper', m('canvas#map-canvas')),
                    m('.ui', [
                        // Arbitrary coordinates
                        m('.change-map-button', {onclick: () => generateTerrainWithLatLng(14.565, 48.378) } ,'Change Map')
                    ])
                ]);
    }
    }
}
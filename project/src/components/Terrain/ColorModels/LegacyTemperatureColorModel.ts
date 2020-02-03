import {ITerrainColorModel} from "./ITerrainColorModel";
import Terrain from "../TerrainFabian";
import ClimateVertex from "../Baseclasses/ClimateVertex";
import ITerrain from "../ITerrain";

export default class LegacyTemperatureColorModel implements ITerrainColorModel {
    updateMeshColors(terrain: ITerrain): void {
        const maxTemp = 40;
        const minTemp = -20;

        const geometry = terrain.getGeometry();
        geometry.faces.forEach((face, index) => {
            const a = geometry.vertices[face.a] as ClimateVertex;
            const b = geometry.vertices[face.b] as ClimateVertex;
            const c = geometry.vertices[face.c] as ClimateVertex;
            const temperature = (a.temperature + b.temperature + c.temperature) / 3;

            let r = 1 / (maxTemp - minTemp) * (temperature - minTemp);
            let g = 1;
            let b2 = 1 / (maxTemp - minTemp) * (maxTemp - temperature);

            r = .9 / (maxTemp - minTemp) * (temperature - minTemp);
            g = 0;
            b2 = .9 / (maxTemp - minTemp) * (maxTemp - temperature);

            const color = {r, g, b: b2};

            face.color.setRGB(color.r, color.g, color.b);
        });

    }
}
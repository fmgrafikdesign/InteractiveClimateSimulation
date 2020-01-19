import {ITerrainColorModel} from "./ITerrainColorModel";
import Terrain from "../TerrainFabian";
import ClimateVertex from "../Baseclasses/ClimateVertex";

export default class TemperatureColorModel implements ITerrainColorModel {
    updateMeshColors(terrain: Terrain): void {
        let maxTemp = 40;
        let minTemp = -20;

        terrain.geometry.faces.forEach((face, index) => {
            const a = terrain.geometry.vertices[face.a] as ClimateVertex;
            const b = terrain.geometry.vertices[face.b] as ClimateVertex;
            const c = terrain.geometry.vertices[face.c] as ClimateVertex;
            const temperature = (a.temperature + b.temperature + c.temperature) / 3;

            let r = 1 / (maxTemp - minTemp) * (temperature - minTemp);
            let g = 0;
            let b2 = 1 / (maxTemp - minTemp) * (maxTemp - temperature);

            const color = {r, g, b: b2};

            face.color.setRGB(color.r, color.g, color.b);
        });

    }
}
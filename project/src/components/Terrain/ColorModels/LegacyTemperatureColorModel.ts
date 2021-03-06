import {ITerrainColorModel} from "./ITerrainColorModel";
import Terrain from "../TerrainFabian";
import ClimateVertex from "../Baseclasses/ClimateVertex";
import ITerrain from "../ITerrain";

export default class LegacyTemperatureColorModel implements ITerrainColorModel {
    updateMeshColors(terrain: ITerrain): void {
        const maxTemp = 50;
        const minTemp = -25;

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

            let color = {r, g, b: b2};

            const threshold = 1;
            if (Math.abs(a.y) < threshold || Math.abs(b.y) < threshold || Math.abs(c.y) < threshold) {
                color = {r: 1, g: 0, b: 0};
            }

            face.color.setRGB(color.r, color.g, color.b);
        });

    }
}
import {ITerrainColorModel} from "./ITerrainColorModel";
import Terrain from "../TerrainFabian";
import ClimateVertex from "../Baseclasses/ClimateVertex";

export default class TemperatureHumidityColorModel implements ITerrainColorModel {
    updateMeshColors(terrain: Terrain): void {
        const maxTemp = 40;
        const minTemp = -20;

        terrain.geometry.faces.forEach((face, index) => {
            const a = terrain.geometry.vertices[face.a] as ClimateVertex;
            const b = terrain.geometry.vertices[face.b] as ClimateVertex;
            const c = terrain.geometry.vertices[face.c] as ClimateVertex;
            const temperature = (a.temperature + b.temperature + c.temperature) / 3;
            const humidity = (a.humidity + b.humidity + c.humidity) / 3;
            // r = 1 -> trocken, r = 0 -> nass
            // b = 1 -> kalt, b = 0 -> warm
            let r = .9 - (humidity * .9);
            let g = .9;
            let b2 = .9 / (maxTemp - minTemp) * (maxTemp - temperature);

            const color = {r, g, b: b2};

            face.color.setRGB(color.r, color.g, color.b);
        });

    }
}
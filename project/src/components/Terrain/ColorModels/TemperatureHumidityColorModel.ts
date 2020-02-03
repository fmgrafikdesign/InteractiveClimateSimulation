import {ITerrainColorModel} from "./ITerrainColorModel";
import ClimateVertex from "../Baseclasses/ClimateVertex";
import ITerrain from "../ITerrain";

export default class TemperatureHumidityColorModel implements ITerrainColorModel {
    updateMeshColors(terrain: ITerrain): void {
        const maxTemp = 40;
        const minTemp = -20;

        const geometry = terrain.getGeometry();
        geometry.faces.forEach((face, index) => {
            const a = geometry.vertices[face.a] as ClimateVertex;
            const b = geometry.vertices[face.b] as ClimateVertex;
            const c = geometry.vertices[face.c] as ClimateVertex;
            const temperature = (a.temperature + b.temperature + c.temperature) / 3;
            const humidity = (a.humidity + b.humidity + c.humidity) / 3;
            // r = 1 -> trocken, r = 0 -> nass
            // b = 1 -> kalt, b = 0 -> warm
            let r = .9 - (humidity * .9);
            let g = .9;
            let b2 = .9 / (maxTemp - minTemp) * (maxTemp - temperature);

            let color = {r, g, b: b2};


            const threshold = 1;
            if (Math.abs(a.y) < threshold || Math.abs(b.y) < threshold || Math.abs(c.y) < threshold) {
                color = {r: 0, g: 1, b: 0};
            }

            face.color.setRGB(color.r, color.g, color.b);
        });

    }
}
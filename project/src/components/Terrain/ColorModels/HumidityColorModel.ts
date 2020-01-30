import {ITerrainColorModel} from "./ITerrainColorModel";
import Terrain from "../TerrainFabian";
import ClimateVertex from "../Baseclasses/ClimateVertex";
import Helpers from "../../Helpers";

export default class TemperatureHumidityColorModel implements ITerrainColorModel {
    private nrOfQuantizeSteps: number = 10;

    updateMeshColors(terrain: Terrain): void {
        terrain.geometry.faces.forEach((face) => {
            const a = terrain.geometry.vertices[face.a] as ClimateVertex;
            const b = terrain.geometry.vertices[face.b] as ClimateVertex;
            const c = terrain.geometry.vertices[face.c] as ClimateVertex;
            const humidity = (a.humidity + b.humidity + c.humidity) / 3;
            // r = 1 -> trocken, r = 0 -> nass
            // b = 1 -> kalt, b = 0 -> warm

            const averageTemp = (a.temperature + b.temperature + c.temperature) / 3;

            let r = .9 - (humidity * .9);
            let g = .9 - (humidity * .9);
            let b2 = .9 * humidity;

            // coloring for snow
            if (averageTemp <= 0) {
                // TODO: needing some kind of biome information here to know how to default color the face
                r = humidity * .9;
                g = humidity * .9;
                b2 = .9 * humidity;
            }

            r = Helpers.quantize(r, 0, 1, this.nrOfQuantizeSteps);
            g = Helpers.quantize(g, 0, 1, this.nrOfQuantizeSteps);
            b2 = Helpers.quantize(b2, 0, 1, this.nrOfQuantizeSteps);

            const color = {r, g, b: b2};

            face.color.setRGB(color.r, color.g, color.b);
        });

    }
}
import {ITerrainColorModel} from "./ITerrainColorModel";
import ClimateVertex from "../Baseclasses/ClimateVertex";
import StaticDefines from "../../StaticDefines";
import Helpers from "../../Helpers";
import ITerrain from "../ITerrain";

export default class TemperatureColorModel implements ITerrainColorModel {
    updateMeshColors(terrain: ITerrain): void {
        const maxTemp = 50 + StaticDefines.zeroCelsiusInKelvin;
        const minTemp = -20 + StaticDefines.zeroCelsiusInKelvin;

        const geometry = terrain.getGeometry();
        geometry.faces.forEach((face, index) => {
            const a = geometry.vertices[face.a] as ClimateVertex;
            const b = geometry.vertices[face.b] as ClimateVertex;
            const c = geometry.vertices[face.c] as ClimateVertex;
            const temperature = (a.temperature + b.temperature + c.temperature) / 3;

            let r = Helpers.quantize(Helpers.clamp(1 / (maxTemp - minTemp) * (temperature - minTemp), 0, 1), 0, 1);
            let g = 1;
            let b2 = Helpers.quantize(Helpers.clamp(1 / (maxTemp - minTemp) * (maxTemp - temperature), 0, 1), 0, 1);

            let color = {r, g, b: b2};

            const threshold = 1;
            if (Math.abs(a.y) < threshold || Math.abs(b.y) < threshold || Math.abs(c.y) < threshold) {
                color = {r: 0, g: 0, b: 0};
            }

            face.color.setRGB(color.r, color.g, color.b);
        });

    }
}
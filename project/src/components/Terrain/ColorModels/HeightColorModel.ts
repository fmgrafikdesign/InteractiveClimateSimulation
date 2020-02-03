// Sets mesh color according to height

import {ITerrainColorModel} from "./ITerrainColorModel";
import ITerrain from "../ITerrain";
import TerrainUtilities from "../TerrainUtilities";
import Helpers from "../../Helpers";

export default class HeightColorModel implements ITerrainColorModel{
    updateMeshColors(terrain: ITerrain) {

        const geometry = terrain.getGeometry();
        geometry.faces.forEach((face) => {
            const a = geometry.vertices[face.a];
            const b = geometry.vertices[face.b];
            const c = geometry.vertices[face.c];

            const average = (a.y + b.y + c.y) / 3;
            if (average <= 0) {
                a.y = 0;
                b.y = 0;
                c.y = 0;
            }

            // Assign color based on highest point of the face
            const max = Math.max(a.y, Math.max(b.y, c.y));

            let r = 1 - Helpers.map(max, terrain.getMinHeight(), terrain.getMaxHeight(), 1, 0);
            let g = 1 - Helpers.map(max, terrain.getMinHeight(), terrain.getMaxHeight(), 1, 0);
            let b2 = Helpers.map(max, terrain.getMinHeight(), terrain.getMaxHeight(), 0, 1);

            //r = Helpers.quantize(r, 0, 100);
           // g = Helpers.quantize(g, 0, 100);
            //b2 = Helpers.quantize(b2, 0, 100);

            let color = {r, g, b: b2};

            const threshold = 1;
            if (Math.abs(a.y) < threshold || Math.abs(b.y) < threshold || Math.abs(c.y) < threshold) {
                color = {r: 0.8, g: 0.8, b: 0.8};
            }

            face.color.setRGB(color.r, color.g, color.b);
        });

        // console.log("variable: ", terrain.getMinHeight(), terrain.getMaxHeight());
        // console.log("computed jit: ", TerrainUtilities.getMinHeight(terrain), TerrainUtilities.getMaxHeight(terrain))
    }
}
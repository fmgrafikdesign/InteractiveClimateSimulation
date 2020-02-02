// Sets mesh color according to height

import {ITerrainColorModel} from "./ITerrainColorModel";
import ITerrain from "../ITerrain";
import TerrainUtilities from "../TerrainUtilities";

export default class HeightColorModel implements ITerrainColorModel{
    updateMeshColors(terrain: ITerrain) {

        // let min_height = MapboxMathUtils.getHeightFromRGBA(255, 255, 255);
        // let max_height = 0;

        let min_height = TerrainUtilities.getMinHeight(terrain);
        let max_height = TerrainUtilities.getMaxHeight(terrain);

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

            // TODO use min and max heights to get a better idea on what colors to use (for height-based representation)
            // Store min and max heights
            if (min_height > average) min_height = average;
            if (max_height < average) max_height = average;

            // Assign color based on highest point of the face
            const max = Math.max(a.y, Math.max(b.y, c.y));

            if (max <= 60) {
                return face.color.set(0x44ccff);
            } else if (max <= 70) {
                return face.color.set(0x66cc44);
            } else if (max <= 90) {
                return face.color.set(0xeecc44);
            } else if (max <= 110) {
                return face.color.set(0xcccccc);
            }

        });

        console.log(min_height, max_height);
    }
}
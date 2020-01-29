// Sets mesh color according to height

import {ITerrainColorModel} from "./ITerrainColorModel";
import Terrain from "../TerrainFabian";
import MapboxMathUtils from "../Generators/MapboxMathUtils";

export default class HeightColorModel implements ITerrainColorModel{
    updateMeshColors(terrain: Terrain) {

        let min_height = MapboxMathUtils.getHeightFromRGBA(255, 255, 255);
        let max_height = 0;

        terrain.geometry.faces.forEach((face) => {
            const a = terrain.geometry.vertices[face.a];
            const b = terrain.geometry.vertices[face.b];
            const c = terrain.geometry.vertices[face.c];

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
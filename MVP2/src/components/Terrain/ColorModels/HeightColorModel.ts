// Sets mesh color according to height

import {ITerrainColorModel} from "./ITerrainColorModel";
import LngLatTerrainGenerator from "../Generators/LngLatTerrainGenerator";
import {Geometry} from "three";
import Terrain from "../TerrainFabian";

export default class HeightColorModel implements ITerrainColorModel{
    updateMeshColors(terrain: Terrain) {

        let min_height = LngLatTerrainGenerator.getHeightFromRGBA(255, 255, 255);
        let max_height = 0;

        terrain.geometry.faces.forEach((face) => {
            const a = terrain.geometry.vertices[face.a];
            const b = terrain.geometry.vertices[face.b];
            const c = terrain.geometry.vertices[face.c];

            const average = (a.z + b.z + c.z) / 3;
            if (average <= 0) {
                a.z = 0;
                b.z = 0;
                c.z = 0;
            }

            // TODO use min and max heights to get a better idea on what colors to use (for height-based representation)
            // Store min and max heights
            if (min_height > average) min_height = average;
            if (max_height < average) max_height = average;

            // Assign color based on highest point of the face
            const max = Math.max(a.z, Math.max(b.z, c.z));

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
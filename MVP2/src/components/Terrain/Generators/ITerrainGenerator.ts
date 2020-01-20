//import {Terrain} from "../TerrainMatthias";
import {Terrain} from "../TerrainFabian";
import ITerrain from "../ITerrain";

export interface ITerrainGenerator {
    generate: (...args: any[]) => ITerrain;
}
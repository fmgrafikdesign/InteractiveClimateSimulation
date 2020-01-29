//import {Terrain} from "../TerrainMatthias";
import ITerrain from "../ITerrain";

export interface ITerrainGenerator {
    generate: (...args: any[]) => ITerrain;
}
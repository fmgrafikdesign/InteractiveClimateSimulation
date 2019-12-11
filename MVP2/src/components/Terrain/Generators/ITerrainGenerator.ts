//import {Terrain} from "../TerrainMatthias";
import {Terrain} from "../TerrainFabian";


export interface ITerrainGenerator {
    generate(): Terrain;
}
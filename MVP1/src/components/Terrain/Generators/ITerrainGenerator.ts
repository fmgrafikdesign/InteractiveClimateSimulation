import {Terrain} from "../TerrainMatthias";


export interface ITerrainGenerator {
    generate(): Terrain;
}
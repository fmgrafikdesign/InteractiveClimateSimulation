import {IGeneratorOption} from "./IGeneratorOption";
import {RandomTerrainGenerator} from "./RandomTerrainGenerator";
import {RandomBuilderTerrainGenerator} from "./RandomBuilderTerrainGenerator";
import {MapTerrainGenerator} from "./MapTerrainGenerator";
import {CubeTerrainGenerator} from "./CubeTerrainGenerator";

export enum GeneratorOptions {
    Random,
    RandomlyBuilt,
    FromMap,
    Perlin,
    ManipulationCube
}


export const options: IGeneratorOption[] = [
    new RandomTerrainGenerator(),
    new RandomBuilderTerrainGenerator(),
    //new PerlinNoiseTerrainGenerator(),
    new MapTerrainGenerator(),
    new CubeTerrainGenerator()
];
import {IGeneratorOption} from "./IGeneratorOption";
import {GeneratorOptions} from "./GeneratorOptions";

export class MapTerrainGenerator implements IGeneratorOption {
    description: string = "generates a terrain from a map part you can choose";
    link: string = "/generatorConfig";
    linkParameter: string = "map";
    name: string = "Map extraction";
    type: GeneratorOptions = GeneratorOptions.FromMap;
}

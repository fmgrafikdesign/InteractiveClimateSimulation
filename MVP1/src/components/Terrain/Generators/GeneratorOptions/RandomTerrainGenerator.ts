import {IGeneratorOption} from "./IGeneratorOption";
import {GeneratorOptions} from "./GeneratorOptions";

export class RandomTerrainGenerator implements IGeneratorOption {
    description: string = "generates a terrain, where the elevation of each vertex is randomly chosen";
    link: string = "/generatorConfig";
    linkParameter: string = "random";
    name: string = "Random";
    type: GeneratorOptions = GeneratorOptions.Random;
}

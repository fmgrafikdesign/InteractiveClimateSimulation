import {IGeneratorOption} from "./IGeneratorOption";
import {GeneratorOptions} from "./GeneratorOptions";

export class PerlinNoiseTerrainGenerator implements IGeneratorOption {
    description: string = "generates a terrain by applying a perlin noise function";
    link: string = "/generatorConfig";
    linkParameter: string = "perlin";
    name: string = "Perlin noise";
    type: GeneratorOptions = GeneratorOptions.Perlin;
}

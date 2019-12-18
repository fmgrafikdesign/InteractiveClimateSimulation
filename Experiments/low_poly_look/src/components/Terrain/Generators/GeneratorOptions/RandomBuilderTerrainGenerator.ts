import {IGeneratorOption} from "./IGeneratorOption";
import {GeneratorOptions} from "./GeneratorOptions";

export class RandomBuilderTerrainGenerator implements IGeneratorOption {
    description: string = "generates a terrain, where hills and valleys are added randomly to a blank terrain";
    link: string = "/generatorConfig";
    linkParameter: string = "randomBuilder";
    name: string = "Random terrain builder";
    type: GeneratorOptions = GeneratorOptions.RandomlyBuilt;
}

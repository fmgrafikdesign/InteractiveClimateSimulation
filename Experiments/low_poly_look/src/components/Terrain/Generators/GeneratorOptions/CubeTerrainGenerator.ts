import {IGeneratorOption} from "./IGeneratorOption";
import {GeneratorOptions} from "./GeneratorOptions";

export class CubeTerrainGenerator implements IGeneratorOption {
    description: string = "Manipulation test cube, that works with MIDI input";
    link: string = "/generatorConfig";
    linkParameter: string = "cube";
    name: string = "Plain old manipulation cube :P";
    type: GeneratorOptions = GeneratorOptions.ManipulationCube;
}

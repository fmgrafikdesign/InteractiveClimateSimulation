import {GeneratorOptions} from "./GeneratorOptions";
import {ITerrainGenerator} from "../ITerrainGenerator";

export interface IGeneratorOption {
    type: GeneratorOptions;
    name: string;
    link: string;
    linkParameter: string;
    description: string;
}

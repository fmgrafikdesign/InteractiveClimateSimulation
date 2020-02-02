import StaticDefines from "./StaticDefines";
import {CurveUtils} from "three";

const Helpers = {
    map: (val: number, oldMin: number, oldMax: number, newMin: number, newMax: number) => {
        const t = (val - oldMin) / (oldMax - oldMin);
        return (newMax - newMin) * t + newMin;
    },

    /**
     * Quantizes a value in a given range with a given amount of steps
     * @param value The value to be quantized
     * @param min The min value of the range
     * @param max The max value of the range
     * @param nrOfSteps The number of steps, the range is divided into
     */
    quantize: (value: number, min: number, max: number, nrOfSteps: number = StaticDefines.nrOfColorSteps): number => {
        return Math.floor((max - min) * nrOfSteps * (value - min)) / nrOfSteps;
    },

    /**
     * Clamps a given value in the given boundaries
     * @param value The value to be clamped
     * @param min The min possible value
     * @param max The max possible value
     */
    clamp: (value: number, min: number, max: number): number => { return Math.min(Math.max(value, min), max); },


    /**
     * Interpolates linear between two given values
     * @param value1
     * @param value2
     * @param strength
     */
    interpolateLinear: (value1: number, value2: number, strength: number): number => { return (1 - strength) * value1 + strength * value2; },
};

export default Helpers;

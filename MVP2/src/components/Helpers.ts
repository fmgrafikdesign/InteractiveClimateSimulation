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
    quantize: (value: number, min: number, max: number, nrOfSteps: number) => {
        return Math.floor((max - min) * nrOfSteps * (value - min)) / nrOfSteps;
    }
};

export default Helpers;

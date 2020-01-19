const Helpers = {
    map: (val: number, oldMin: number, oldMax: number, newMin: number, newMax: number) => {
        const t = (val - oldMin) / (oldMax - oldMin);
        return (newMax - newMin) * t + newMin;
    }
};

export default Helpers;

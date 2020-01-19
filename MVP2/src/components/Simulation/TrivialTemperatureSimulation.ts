import ISimulation from "./ISimulation";
import Simulation from "./Simulation";
import Helpers from "../Helpers";

// Areas higher up are slower to heat up than areas further down. That's about it.
export default class TrivialTemperatureSimulation implements ISimulation {
    minHeight: number = 999999;
    maxHeight: number = 0;
    setup(): void {
        let minHeight = 999999;
        let maxHeight = 0;
        Simulation.terrain.vertices.forEach((vertex, index) => {
            if (minHeight > vertex.y && vertex.y > 1) {
                // console.log('vertice # ', index, 'was smaller than the previous minimum. (with ', vertex.y, ')')
                minHeight = vertex.y;
            }
            if (maxHeight < vertex.y) {
                maxHeight = vertex.y;
            }
        });
        this.minHeight = Math.round(minHeight);
        this.maxHeight = Math.round(maxHeight);
        console.log(this.minHeight, this.maxHeight);

        Simulation.terrain.vertices.forEach((vertex) => {

            const computedTemperature = Helpers.map(vertex.y, this.minHeight, this.maxHeight, 10, -10);
            vertex.temperature = computedTemperature;
        });
    }

    tick(): void {
        this.changeTemperatur();
    }

    // Trivial temperature change. Considers terrain height.
    public changeTemperatur() {
        Simulation.terrain.vertices.forEach((vertex) => {

            const relativeVertexHeight = Helpers.map(vertex.y, this.minHeight, this.maxHeight, 1, 0);
            vertex.temperature += Simulation.temperatureChangePerTick * relativeVertexHeight;
        });
    }

}
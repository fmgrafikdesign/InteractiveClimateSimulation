import ISimulation from "./ISimulation";
import Simulation from "./Simulation";

export default class SimpleClimateSimulation implements ISimulation {
    setup(): void {
    }

    tick(): void {
        this.addSunEnergy();
        this.rain();
        this.createAirFlow();
        this.calculateEnergyLevels();
    }

    public addSunEnergy() {
        Simulation.terrain.vertices.forEach((vertex) => {
            vertex.temperature += Simulation.temperatureChangePerTick;
        });
    }

    public rain() {
        // TODO: decide, if it rains (if yes, add some humidity to every vertex)
    }

    public createAirFlow() {
        // TODO: calculate the average air flow of each vertex (e.g. with the general air flow and height differences to neighbour vertices and sun input) and write it into the vertex
    }

    public calculateEnergyLevels() {
        // TODO: calculate the current energy level for each vertex (with the sun input, air flow, ...) and write it into the vertex
    }
}
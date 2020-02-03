import ISimulation from "./ISimulation";
import Simulation from "./Simulation";
import Helpers from "../Helpers";
import TerrainUtilities from "../Terrain/TerrainUtilities";

// Areas higher up are slower to heat up than areas further down. That's about it.
export default class TrivialTemperatureHumiditySimulation implements ISimulation {
    minHeight: number = 999999;
    maxHeight: number = 0;
    setup(): void {
        // this.minHeight = TerrainUtilities.getMinHeight(Simulation.terrain);
        // this.maxHeight = TerrainUtilities.getMaxHeight(Simulation.terrain);
        this.initalizeVertexTemperatureBasedOnHeight();
        this.initalizeVertexHumidityBasedOnHeight();
    }

    tick(): void {
        // console.log(Simulation.terrain.getMinHeight(), Simulation.terrain.getMaxHeight())
        Simulation.terrain.getVertices().forEach((vertex) => {

            const relativeVertexHeight = Helpers.map(vertex.y, Simulation.terrain.getMinHeight(), Simulation.terrain.getMaxHeight(), 1, 0);
            vertex.temperature += Simulation.temperatureChangePerTick * relativeVertexHeight;

            vertex.humidity = Math.min(Math.max((vertex.humidity + Simulation.humidityChangePerTick), 0), 1);
        });
    }

    private initalizeVertexTemperatureBasedOnHeight() {
        Simulation.terrain.getVertices().forEach((vertex) => {
            vertex.temperature = Helpers.map(vertex.y, Simulation.terrain.getMinHeight(), Simulation.terrain.getMaxHeight(), 40, -20);
        });
    }

    private initalizeVertexHumidityBasedOnHeight() {
        Simulation.terrain.getVertices().forEach((vertex) => {
            vertex.humidity = Helpers.map(vertex.y, Simulation.terrain.getMinHeight(), Simulation.terrain.getMaxHeight(), 1, 0);
        });
    }
}

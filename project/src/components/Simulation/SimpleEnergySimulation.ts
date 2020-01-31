import ISimulation from "./ISimulation";
import Simulation from "./Simulation";
import TerrainUtilities from "../Terrain/TerrainUtilities";

// Areas higher up are slower to heat up than areas further down. That's about it.
export default class SimpleEnergySimulation implements ISimulation {

    /**
     * The initial temperature of the lowest point of the terrain
     */
    private startingGroundTemperature: number = 20;
    private energyIncreasePerMeterHeight: number = -0.1;

    setup(): void {
        this.initializeVertexEnergy(TerrainUtilities.getMinHeight(Simulation.terrain));
    }

    tick(): void {
        // TODO: change the energy for every vertex considering their height, the energy input (from the sun mostly)
        this.changeEnergy();
    }

    /**
     * Calculates an energy value for every vertex of the terrain and initializes the respective vertex with its energy value.
     * The calculation is done by looking at how much higher the vertex is compared to the lowest one
     * @param baseHeight The height of the lowest vertex of the terrain
     */
    private initializeVertexEnergy(baseHeight: number) {
        Simulation.terrain.getVertices().forEach((vertex) => {
            vertex.humidity = 0.5;

            vertex.temperature = this.startingGroundTemperature + (vertex.y - baseHeight) * this.energyIncreasePerMeterHeight;
        });
    }

    private changeEnergy() {

        Simulation.terrain.getVertices().forEach((vertex, index) => {
            // TODO: add the suns energy
            // TODO: do some fancy stuff when adding the energy like considering the position of vertex relative to the sun ray (considering shadows)
            // TODO: take away a part of the humidity, depending on the energy input (verdunsten)
            // TODO: radiate away some of the energy stored in this vertex
        });
    }
}
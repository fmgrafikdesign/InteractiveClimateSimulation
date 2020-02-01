import ISimulation from "./ISimulation";
import Simulation from "./Simulation";
import TerrainUtilities from "../Terrain/TerrainUtilities";
import StaticDefines from "../StaticDefines";
import Helpers from "../Helpers";

// Areas higher up are slower to heat up than areas further down. That's about it.
export default class SimpleEnergySimulation implements ISimulation {

    /**
     * The initial temperature of the lowest point of the terrain
     */
    private startingGroundTemperature: number = 20;
    private temperatureIncreasePerMeterHeight: number = -0.1;

    private simulatedTime: number = 0;
    private tickCounter: number = 0;

    setup(): void {
        this.initializeVertexEnergy(TerrainUtilities.getMinHeight(Simulation.terrain));
    }

    tick(deltaTime: number): void {
        // TODO: change the energy for every vertex considering their height, the energy input (from the sun mostly)

        this.simulatedTime += deltaTime * 200;
        this.changeEnergy(deltaTime * 200);
    }

    /**
     * Calculates an energy value for every vertex of the terrain and initializes the respective vertex with its energy value.
     * The calculation is done by looking at how much higher the vertex is compared to the lowest one
     * @param baseHeight The height of the lowest vertex of the terrain
     */
    private initializeVertexEnergy(baseHeight: number) {
        console.debug("Base height: " + baseHeight);
        let minTemperature = 999;
        let maxTemperature = -999;
        Simulation.terrain.getVertices().forEach((vertex) => {
            vertex.humidity = 0.5;
            vertex.temperature = this.startingGroundTemperature + StaticDefines.zeroCelsiusInKelvin + (vertex.y - baseHeight) * this.temperatureIncreasePerMeterHeight;

            minTemperature = Math.min(minTemperature, vertex.temperature);
            maxTemperature = Math.max(maxTemperature, vertex.temperature);
        });

        console.debug("Min temperature: " + minTemperature);
        console.debug("Max temperature: " + maxTemperature);
    }

    private changeEnergy(deltaTime: number) {

        // vary the sun energy with a sine function ranging from 0 to 1 with a wavelength of one minute
        let sunEnergyCoefficient = Math.sin(this.simulatedTime * 2 * Math.PI / 60) / 2 + 0.5;
        let currentGeneralSunEnergyInput: number = Simulation.sunEnergyInput * sunEnergyCoefficient * deltaTime;

        Simulation.terrain.getVertices().forEach((vertex, index) => {
            let energyDifference: number = 0;

            energyDifference += currentGeneralSunEnergyInput;
            // TODO: do some fancy stuff when adding the energy like considering the position of vertex relative to the sun ray (considering shadows)


            // TODO: make the verdunsten more realistic
            vertex.humidity -= Helpers.clamp(vertex.humidity * 0.01 * currentGeneralSunEnergyInput / vertex.currentThermalConductivity, 0, 0.05);
            // TODO: do something to condense water if it is colder (e.g. at night)

            // TODO: implement a version, that is a little more robust than that
            //const radiationEnergy: number = Math.pow(vertex.energy / 220, 1) * deltaTime;
            const radiationEnergy: number = Math.pow(vertex.energy / 7800, 2) * deltaTime;
            //const radiationEnergy: number = Math.pow(vertex.energy / 51000, 4) * deltaTime;
            energyDifference -= radiationEnergy;

            vertex.energy += energyDifference;
        });

        if (this.tickCounter++ > 10) {
            this.tickCounter = 0;
            console.debug("Sun coefficient: " + sunEnergyCoefficient + ", Temperature at vertex 0: " + (Simulation.terrain.getVertices()[0].temperature - StaticDefines.zeroCelsiusInKelvin));
        }
    }
}
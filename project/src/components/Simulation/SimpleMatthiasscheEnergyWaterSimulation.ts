import ISimulation from "./ISimulation";
import Simulation from "./Simulation";
import ClimateVertex from "../Terrain/Baseclasses/ClimateVertex";
import ITerrain from "../Terrain/ITerrain";
import StaticDefines from "../StaticDefines";
import Helpers from "../Helpers";
import TerrainUtilities from "../Terrain/TerrainUtilities";

// Areas higher up are slower to heat up than areas further down. That's about it.
export default class SimpleWaterSimulation implements ISimulation {

    /**
     * The initial temperature of the lowest point of the terrain
     */
    private startingGroundTemperature: number = 20;
    private temperatureIncreasePerMeterHeight: number = -0.1;

    private simulatedTime: number = 0;
    private tickCounter: number = 0;

    private raining: boolean = false;

    setup(): void {
        //this.computeMinMaxHumidity();
        this.initializeVertexHumidity();
        this.initializeVertexEnergy(TerrainUtilities.getMinHeight(Simulation.terrain));
    }

    tick(deltaTime: number): void {
        // always simulating 1s per ms delta time
        let simulatedDeltaTime = deltaTime * 1000;

        this.determineRaining(simulatedDeltaTime);

        this.changeHumidity(simulatedDeltaTime);

        this.simulatedTime += simulatedDeltaTime;
        this.changeEnergy(simulatedDeltaTime);
    }

    private initializeVertexHumidity() {
        Simulation.terrain.getVertices().forEach((vertex) => {
            vertex.humidity = 0.5;
        });
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
            vertex.temperature = this.startingGroundTemperature + StaticDefines.zeroCelsiusInKelvin + (vertex.y - baseHeight) * this.temperatureIncreasePerMeterHeight;

            minTemperature = Math.min(minTemperature, vertex.temperature);
            maxTemperature = Math.max(maxTemperature, vertex.temperature);
        });

        console.debug("Min temperature: " + minTemperature);
        console.debug("Max temperature: " + maxTemperature);
    }

    // Trivial temperature change. Considers terrain height.
    public changeHumidity(deltaTime: number) {
        Simulation.terrain.getVertices().forEach((vertex, index) => {

            if (vertex.humidity > 0.001) {
                const lowestNeighbour = this.getLowestNeighborVertex(vertex);

                // only transfer humidity to the lowest neighbour, if it is not the vertex itself and the temperature is above 0° (we assume then there is snow) or the height difference is high enough, that the snow "slides down"
                if (lowestNeighbour != vertex && (vertex.temperature > 0 || vertex.y - lowestNeighbour.y > 5)) {
                    // transfer humidity to the lowest neighbour vertex based on the height difference between the vertices, but maximal 95% of the current vertices humidity
                    let humidityExchange = Math.max(0, Math.min(vertex.humidity * 0.99, vertex.humidity * 0.99 * (vertex.y - lowestNeighbour.y) * deltaTime));
                    // TODO: exchange humidity also based on the current humidity quadratically

                    lowestNeighbour.humidity += humidityExchange;
                    vertex.humidity -= humidityExchange;
                }
            }

            /**
             * Section for when it is raining
             * Water is added  with a slight random offset (0.05 - 0.15) per vertex
             */
            if (this.raining) {
                const humidityAddition = 0.05 + Math.random() * 0.1 - 0.05;

                vertex.humidity += humidityAddition;
            }

            /**
             * Remove water, that is going into the ground (versickern)
             * In this very simple case, 3% of the current humidity level are vanished
             */
            vertex.humidity *= 0.97 * deltaTime;
        });
    }

    private getLowestNeighborVertex(vertex: ClimateVertex): ClimateVertex {
        let lowestVertex: ClimateVertex = vertex;
        const terrain: ITerrain = Simulation.terrain;

        for (let y = vertex.indexY - 1; y <= vertex.indexY + 1; y++) {
            for (let x = vertex.indexX - 1; x <= vertex.indexX + 1; x++) {

                if (x != vertex.indexX || y != vertex.indexY) {
                    let vertexToCompare = terrain.getVertex(x, y);
                    if (vertexToCompare != null && vertexToCompare.y < lowestVertex.y) {
                        lowestVertex = vertexToCompare as ClimateVertex;
                    }
                }
            }
        }

        return lowestVertex;
    }

    private changeEnergy(deltaTime: number) {

        // vary the sun energy with a sine function ranging from 0 to 1 with a wavelength of one minute
        let sunEnergyCoefficient = Math.sin(this.simulatedTime * 2 * Math.PI / 60) / 2 + 0.5;
        let currentGeneralSunEnergyInput: number = Simulation.sunEnergyInput * sunEnergyCoefficient * deltaTime;

        Simulation.terrain.getVertices().forEach((vertex, index) => {
            let energyDifference: number = 0;

            energyDifference += (this.raining) ? currentGeneralSunEnergyInput / 2 : currentGeneralSunEnergyInput;
            // TODO: do some fancy stuff when adding the energy like considering the position of vertex relative to the sun ray (considering shadows)


            // TODO: make the verdunsten more realistic
            vertex.humidity -= Helpers.clamp(vertex.humidity * 0.01 * currentGeneralSunEnergyInput / vertex.currentThermalConductivity, 0, 0.05);
            // TODO: do something to condense water if it is colder (e.g. at night)

            // TODO: implement a version, that is a little more robust than that
            //const radiationEnergy: number = Math.pow(vertex.energy / 220, 1) * deltaTime;
            const radiationEnergy: number = Math.pow(vertex.energy / 8000, 2) * deltaTime;
            //const radiationEnergy: number = Math.pow(vertex.energy / 51000, 4) * deltaTime;
            energyDifference -= radiationEnergy;

            vertex.energy += energyDifference;
        });

        if (this.tickCounter++ > 10) {
            this.tickCounter = 0;
            //console.debug("Sun coefficient: " + sunEnergyCoefficient + ", Temperature at vertex 0: " + (Simulation.terrain.getVertices()[0].temperature - StaticDefines.zeroCelsiusInKelvin));
        }
    }

    private determineRaining(deltaTime: number): void {
        const rainToggleProbability: number = (this.raining) ? (1 - Simulation.rainfallProbability) / Simulation.averageRainDuration : Simulation.rainfallProbability / Simulation.averageRainDuration;

        if (Math.random() < rainToggleProbability) {
            this.raining = !this.raining;
            let message: string = "Toggling rain " + (this.raining ? "on" : "off");
            console.log(message);
        }
    }
}
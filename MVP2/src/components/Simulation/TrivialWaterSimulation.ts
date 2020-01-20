import ISimulation from "./ISimulation";
import Simulation from "./Simulation";
import Helpers from "../Helpers";
import ClimateVertex from "../Terrain/Baseclasses/ClimateVertex";
import ITerrain from "../Terrain/ITerrain";
import {Terrain} from "../Terrain/TerrainMatthias";

// Areas higher up are slower to heat up than areas further down. That's about it.
export default class TrivialWaterSimulation implements ISimulation {
    minHumidity: number = 999999;
    maxHumidity: number = 0;

    setup(): void {
        this.computeMinMaxHumidity();
        this.initalizeVertexTemperatureBasedOnHeight();
    }

    tick(): void {
        this.changeHumidity();
    }

    private computeMinMaxHumidity() {
        let minHumidity = 999999;
        let maxHumidity = 0;
        Simulation.terrain.getVertices().forEach((vertex, index) => {
            if (minHumidity > vertex.humidity) {
                minHumidity = vertex.humidity;
            }
            if (maxHumidity < vertex.humidity) {
                maxHumidity = vertex.humidity;
            }
        });
        this.minHumidity = Math.round(minHumidity);
        this.maxHumidity = Math.round(maxHumidity);
    }

    private initalizeVertexTemperatureBasedOnHeight() {
        Simulation.terrain.getVertices().forEach((vertex) => {
            vertex.temperature = Helpers.map(vertex.y, this.minHumidity, this.maxHumidity, 20, -20);
        });
    }

    // Trivial temperature change. Considers terrain height.
    public changeHumidity() {
        this.computeMinMaxHumidity();

        Simulation.terrain.getVertices().forEach((vertex) => {
            const relativeVertexHeight = Helpers.map(vertex.y, this.minHumidity, this.maxHumidity, 1, 0);
            vertex.temperature += Simulation.temperatureChangePerTick * relativeVertexHeight;

            const lowestNeighbour = this.getLowestNeighborVertex(vertex);

            if (lowestNeighbour != vertex) {
                // transfer humidity to the lowest neighbour vertex based on the height difference between the vertices, but maximal 85% of the current vertices humidity
                const humidityExchange = Math.max(0, Math.min(vertex.humidity * 0.85, (vertex.humidity * 0.5 * (vertex.y - lowestNeighbour.y))));
                lowestNeighbour.humidity += humidityExchange;
                vertex.humidity -= humidityExchange;
            }
        });
    }

    private getLowestNeighborVertex(vertex: ClimateVertex): ClimateVertex {
        let lowestVertex: ClimateVertex = vertex;
        const terrain: ITerrain = Simulation.terrain as Terrain;

        for (let z = vertex.z - 1; z < vertex.z + 1; z++) {
            for (let x = vertex.x - 1; x < vertex.x + 1; x++) {
                if (terrain.getVertex(x, z).z < lowestVertex.z)
                {
                    lowestVertex = terrain.getVertex(x, z);
                }
            }
        }

        return lowestVertex;
    }

}
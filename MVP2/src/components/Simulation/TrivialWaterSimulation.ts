import ISimulation from "./ISimulation";
import Simulation from "./Simulation";
import Helpers from "../Helpers";
import ClimateVertex from "../Terrain/Baseclasses/ClimateVertex";
import ITerrain from "../Terrain/ITerrain";

// Areas higher up are slower to heat up than areas further down. That's about it.
export default class TrivialWaterSimulation implements ISimulation {
    minHumidity: number = 999999;
    maxHumidity: number = 0;

    private rainProbability: number = 0.15;

    setup(): void {
        //this.computeMinMaxHumidity();
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
            //vertex.temperature = Helpers.map(vertex.y, this.minHumidity, this.maxHumidity, 20, -20);
            vertex.humidity = 1;
        });
    }

    // Trivial temperature change. Considers terrain height.
    public changeHumidity() {
        //this.computeMinMaxHumidity();
        let raining: boolean = false;
        if (Math.random() < this.rainProbability) {
            raining = true;
        }

        Simulation.terrain.getVertices().forEach((vertex) => {

            if (vertex.humidity > 0.001) {
                const lowestNeighbour = this.getLowestNeighborVertex(vertex);

                if (lowestNeighbour != vertex) {
                    // transfer humidity to the lowest neighbour vertex based on the height difference between the vertices, but maximal 85% of the current vertices humidity
                    const humidityExchange = Math.max(0, Math.min(vertex.humidity * 0.5, (vertex.humidity * 0.0005 * (vertex.y - lowestNeighbour.y))));
                    lowestNeighbour.humidity += humidityExchange;
                    vertex.humidity -= humidityExchange;
                }
            }

            if (raining) {
                vertex.humidity += 0.1;
            }
        });
    }

    private getLowestNeighborVertex(vertex: ClimateVertex): ClimateVertex {
        let lowestVertex: ClimateVertex = vertex;
        const terrain: ITerrain = Simulation.terrain;

        for (let y = vertex.indexY - 1; y < vertex.indexY + 1; y++) {
            for (let x = vertex.indexX - 1; x < vertex.indexX + 1; x++) {

                if (terrain.getVertex(x, y).y < lowestVertex.y)
                {
                    lowestVertex = terrain.getVertex(x, y);
                }
            }
        }

        return lowestVertex;
    }

}
import ISimulation from "./ISimulation";
import Simulation from "./Simulation";
import ClimateVertex from "../Terrain/Baseclasses/ClimateVertex";
import ITerrain from "../Terrain/ITerrain";

// Areas higher up are slower to heat up than areas further down. That's about it.
export default class SimpleWaterSimulation implements ISimulation {

    private rainProbability: number = 0.15;

    setup(): void {
        //this.computeMinMaxHumidity();
        this.initializeVertexHumidity();
    }

    tick(deltaTime: number): void {
        this.changeHumidity();
    }

    private initializeVertexHumidity() {
        Simulation.terrain.getVertices().forEach((vertex) => {
            vertex.humidity = 0.5;
            vertex.temperature = 10;
        });
    }

    // Trivial temperature change. Considers terrain height.
    public changeHumidity() {
        //this.computeMinMaxHumidity();
        let raining: boolean = false;
        if (Math.random() < this.rainProbability) {
            raining = true;
        }

        Simulation.terrain.getVertices().forEach((vertex, index) => {

            if (vertex.humidity > 0.001) {
                const lowestNeighbour = this.getLowestNeighborVertex(vertex);

                // only transfer humidity to the lowest neighbour, if it is not the vertex itself and the temperature is above 0° (we assume then there is snow) or the height difference is high enough, that the snow "slides down"
                if (lowestNeighbour != vertex && (vertex.temperature > 0 || vertex.y - lowestNeighbour.y > 5)) {
                    // transfer humidity to the lowest neighbour vertex based on the height difference between the vertices, but maximal 95% of the current vertices humidity
                    let humidityExchange = Math.max(0, Math.min(vertex.humidity * 0.95, (vertex.humidity * 0.95 * (vertex.y - lowestNeighbour.y))));
                    // TODO: exchange humidity also based on the current humidity quadratically

                    lowestNeighbour.humidity += humidityExchange;
                    vertex.humidity -= humidityExchange;
                }
            }

            /**
             * Section for when it is raining
             * Water is added  with a slight random offset (0.05 - 0.15) per vertex
             */
            if (raining) {
                const humidityAddition = 0.15 + Math.random() * 0.1 - 0.05;

                vertex.humidity += humidityAddition;
            }

            /**
             * Remove water, that is going into the ground (versickern)
             * In this very simple case, 3% of the current humidity level are vanished
             */
            vertex.humidity *= 0.97;
        });
    }

    private getLowestNeighborVertex(vertex: ClimateVertex): ClimateVertex {
        let lowestVertex: ClimateVertex = vertex;
        const terrain: ITerrain = Simulation.terrain;

        for (let y = vertex.indexY - 1; y <= vertex.indexY + 1; y++) {
            for (let x = vertex.indexX - 1; x <= vertex.indexX + 1; x++) {

                let vertexToCompare = terrain.getVertex(x, y);
                if (vertexToCompare != null && vertexToCompare.y < lowestVertex.y) {
                    lowestVertex = vertexToCompare as ClimateVertex;
                }
            }
        }

        return lowestVertex;
    }
}
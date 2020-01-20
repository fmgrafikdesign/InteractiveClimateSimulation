import {Vector3} from "three";
import ITerrain from "../Terrain/ITerrain";
import Terrain from "../Terrain/TerrainFabian";
import ClimateVertex from "../Terrain/Baseclasses/ClimateVertex";
import SimulationContext from "./SimulationContext";
import TrivialTemperatureSimulation from "./TrivialTemperatureSimulation";
import TrivialTemperatureHumiditySimulation from "./TrivialTemperatureHumiditySimulation";

// The strategy pattern is used to allow quick switching between strategies.
const strategy = new TrivialTemperatureHumiditySimulation();

/**
 * Things that would be great to simulate in a true climate simulation:
 * - Insolation and radiation
 * - Temperature
 * - Lateral convection
 * - Density and vertical convection
 *
 * Optional:
 * - Coriolis effect
 * - Lateral diffusion
 * - Precipitation
 * - Groundwater, surface water, erosion
 */

/**
 * Things we could settle for for now in our /weather/ simulation
 * - Rain
 * - Temperature
 * - Wind
 */

export default class Simulation {

    static context = new SimulationContext();

    static paused: boolean = false;
    static milliSecondsPerTick: number = 200;
    static currentTick: number = 0;
    static currentTickFinished: boolean = true;
    static lastTickTime: number = 0;
    static averageTickTime: number = 0;
    static totalTickTime: number = 0;

    static intervalHandler: number;
    /**
     * The unhindered average energy input from the sun (without clouds, light shattering etc.)
     */
    static sunEnergyInput: number;
    static temperatureChangePerTick: number = .2;
    static humidityChangePerTick: number = .01;

    /**
     * The average air movement coming from outside the world boundaries
     */
    static outerAirFlow: Vector3;

    /**
     * The amount of rain
     */
    static rainfallProbability: number;

    /**
     * Instance of the terrain (or shall we keep an instance of the terrain controller?) to be able to quickly access all needed properties
     */
    static terrain: ITerrain;

    static init(terrain: ITerrain, milliSecondsPerTick?: number) {
        if (milliSecondsPerTick) {
            this.milliSecondsPerTick = milliSecondsPerTick;
        }
        this.terrain = terrain;
        this.sunEnergyInput = 1;
        this.outerAirFlow = new Vector3(1, 1, 0);
        this.rainfallProbability = 0.5;

        this.context.setStrategy(strategy);
        this.context.setupStrategy();
    }

    // Resets the simulation
    static reset() {

    }

    static start() {
        this.paused = false;
        clearInterval(this.intervalHandler);
        this.intervalHandler = setInterval(Simulation.update, this.milliSecondsPerTick);
        console.log("Started the simulation with ", this.milliSecondsPerTick, "ms per tick");
    }

    static pause() {
        this.paused = !this.paused;
        console.log(this.paused);
    }

    static update() {
        if (Simulation.paused || !Simulation.currentTickFinished) {
            console.log(Simulation.paused);
            console.log(Simulation.currentTickFinished);
            return;
        }
        Simulation.tick();
    }

    static tick() {
        const startTime = this.startCollectingTickInfo();

        this.context.executeStrategy();


        this.terrain.updateMeshColors(this.context.getColorModel());

        this.currentTick++;
        this.finishCollectingTickInfo(startTime);
        this.currentTickFinished = true;
    }

    private static finishCollectingTickInfo(startTime: number) {
        this.lastTickTime = Date.now() - startTime;
        this.totalTickTime += this.lastTickTime;
        this.averageTickTime = this.totalTickTime / this.currentTick;
    }

    private static startCollectingTickInfo() {
        const startTime = Date.now();
        this.currentTickFinished = false;
        return startTime;
    }
}

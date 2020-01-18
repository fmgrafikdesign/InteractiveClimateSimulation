import {Vector3} from "three";
import ITerrain from "../Terrain/ITerrain";

export default class Simulation {

    /**
     * The unhindered average energy input from the sun (without clouds, light shattering etc.)
     */
    private sunEnergyInput: number;

    /**
     * The average air movement coming from outside the world boundaries
     */
    private outerAirFlow: Vector3;

    /**
     * The chance of rain to fall on a simulated day from 0 - 1
     */
    private rainfallProbability: number;

    /**
     * Instance of the terrain (or shall we keep an instance of the terrain controller?) to be able to quickly access all needed properties
     */
    private terrain: ITerrain;


    constructor() {
        this.sunEnergyInput = 10;
        this.outerAirFlow = new Vector3(1, 1, 0);
        this.rainfallProbability = 0.5;
    }


    public update(deltaTime: number)
    {
        this.createAirFlow();
        this.rain();
        this.addSunEnergy();

        this.calculateEnergyLevels();
    }

    private rain()
    {
        // TODO: decide, if it rains (if yes, add some humidity to every vertex)
    }

    private addSunEnergy()
    {
        // TODO: add the energy of the sun to every vertex of the terrain (maybe consider clouds to reduce the energy, that reaches the ground)
    }

    private createAirFlow()
    {
        // TODO: calculate the average air flow of each vertex (e.g. with the general air flow and height differences to neighbour vertices and sun input) and write it into the vertex
    }

    private calculateEnergyLevels()
    {
        // TODO: calculate the current energy level for each vertex (with the sun input, air flow, ...) and write it into the vertex
    }
};

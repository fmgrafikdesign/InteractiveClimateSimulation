import {Vector3} from "three";
import StaticDefines from "../../StaticDefines";
import Helpers from "../../Helpers";

export default class ClimateVertex extends Vector3 {

    private _airFlow: Vector3;
    private _humidity: number;
    private _energy: number;

    /**
     * The original height of this vertex. This is stored, because the actual height might change over the course of the simulation.
     * e.g. when this vertex is only water and the water level rises
     */
    private _originalHeight: number;

    /**
     * The x index of this vertex in the over all terrain.
     */
    private _indexX: number;
    /**
     * The y index of this vertex in the over all terrain.
     */
    private _indexY: number;

    private _currentThermalConductivity: number;

    constructor(x?: number, y?: number, z?: number, indexX?: number, indexY?: number) {
        super(x, y, z);
        this._humidity = 0;
        this._energy = 0;
        this._airFlow = new Vector3();
        this._originalHeight = y as number;

        this._indexX = (indexX) ? indexX : 0;
        this._indexY = (indexY) ? indexY : 0;

        this._currentThermalConductivity = StaticDefines.thermalConductivityDirtMoist;
    }

    get humidity(): number {
        return this._humidity;
    }

    /**
     * Sets the humidity of the vertex and executes a little additional logic
     * if the vertex would be "overfilled" (the water level would be over 1), the height of the vertex increases and also the other way around
     *
     * @param value the new value for the humidity
     */
    set humidity(value: number) {
        if (value > 1) {
            this.y += (value - 1) * StaticDefines.heightIncreasePerWaterUnit;
            this._humidity = 1;
        }
        else if (this._humidity == 1 && value < 1 && this.y > this._originalHeight) {
            // decrease the current height, but maximal to the original height
            this.y = Math.max(this._originalHeight, this.y - (1 - value) * StaticDefines.heightIncreasePerWaterUnit);
        }
        else {
            this._humidity = value;
        }

        this.updateCurrentThermalConductivity();
    }

    get energy(): number {
        return this._energy;
    }

    set energy(value: number) {
        this._energy = Math.max(0, value);
    }

    get airFlow(): Vector3 {
        return this._airFlow;
    }

    set airFlow(value: Vector3) {
        this._airFlow = value;
    }

    /**
     * Returns the current temperature of this vertex in Kelvin
     */
    get temperature(): number {
        return this.energy / this._currentThermalConductivity;
    }

    /**
     * Sets the amount of energy in the current vertex to how much is need for the wanted temperature -> ergo sets the temperature of this vertex
     * @param value The wanted temperature in Kelvin
     */
    set temperature(value: number) {
        this.energy += this._currentThermalConductivity * (value - this.temperature);
    }

    get originalHeight(): number {
        return this._originalHeight;
    }

    set originalHeight(value: number) {
        this._originalHeight = value;
    }

    get indexX(): number {
        return this._indexX;
    }

    set indexX(value: number) {
        this._indexX = value;
    }

    get indexY(): number {
        return this._indexY;
    }

    set indexY(value: number) {
        this._indexY = value;
    }

    get currentThermalConductivity(): number {
        return this._currentThermalConductivity;
    }

    private updateCurrentThermalConductivity(): void {
        if (this.humidity < 0.2) {
            this._currentThermalConductivity = StaticDefines.thermalConductivityDirtVeryDry;
        }
        else if (this.humidity < 0.4) {
            this._currentThermalConductivity = Helpers.interpolateLinear(StaticDefines.thermalConductivityDirtDry, StaticDefines.thermalConductivityDirtVeryDry, (0.4 - this.humidity) / 0.2);
        }
        else if (this.humidity < 0.6) {
            this._currentThermalConductivity = Helpers.interpolateLinear(StaticDefines.thermalConductivityDirtMoist, StaticDefines.thermalConductivityDirtDry, (0.6 - this.humidity) / 0.2);
        }
        else if (this.humidity < 0.9) {
            this._currentThermalConductivity = Helpers.interpolateLinear(StaticDefines.thermalConductivityDirtVeryMoist, StaticDefines.thermalConductivityDirtMoist, (0.9 - this.humidity) / 0.3);
        }
        else {
            this._currentThermalConductivity = Helpers.interpolateLinear(StaticDefines.thermalConductivityWater, StaticDefines.thermalConductivityDirtVeryMoist, (1 - this.humidity) / 0.1);
        }

        // TODO: implement some system, that saves what ground type this vertex is (dirt, stone, water, ...) and take this also as calculation basis for the current thermal conductivity
    }
}
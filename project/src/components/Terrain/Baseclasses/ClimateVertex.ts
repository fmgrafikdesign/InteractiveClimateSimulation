import {Vector3} from "three";
import StaticDefines from "../../StaticDefines";

export default class ClimateVertex extends Vector3 {

    private _airFlow: Vector3;
    private _humidity: number;
    private _energy: number;
    private _originalHeight: number;

    private _indexX: number;
    private _indexY: number;

    private currentThermalConductivity: number;

    constructor(x?: number, y?: number, z?: number, indexX?: number, indexY?: number) {
        super(x, y, z);
        this._humidity = 0;
        this._energy = 0;
        this._airFlow = new Vector3();
        this._originalHeight = z as number;

        this._indexX = (indexX) ? indexX : 0;
        this._indexY = (indexY) ? indexY : 0;

        this.currentThermalConductivity = StaticDefines.thermalConductivityDirtMoist;
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
        this._energy = value;
    }

    get airFlow(): Vector3 {
        return this._airFlow;
    }

    set airFlow(value: Vector3) {
        this._airFlow = value;
    }

    get temperature(): number {
        return this.energy / this.currentThermalConductivity - StaticDefines.zeroCelsiusInKelvin;
    }

    set temperature(value: number) {
        this.energy += this.currentThermalConductivity;
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

    private updateCurrentThermalConductivity(): void {
        if (this.humidity < 0.2) {
            this.currentThermalConductivity = StaticDefines.thermalConductivityDirtVeryDry;
        }
        else if (this.humidity < 0.4) {
            this.currentThermalConductivity = StaticDefines.thermalConductivityDirtDry;
        }
        else if (this.humidity < 0.6) {
            this.currentThermalConductivity = StaticDefines.thermalConductivityDirtMoist;
        }
        else if (this.humidity < 0.9) {
            this.currentThermalConductivity = StaticDefines.thermalConductivityDirtVeryMoist;
        }
        else {
            this.currentThermalConductivity = StaticDefines.thermalConductivityWater;
        }

        // TODO: implement some system, that saves what ground type this vertex is (dirt, stone, water, ...) and take this also as calculation basis for the current thermal conductivity
    }
}
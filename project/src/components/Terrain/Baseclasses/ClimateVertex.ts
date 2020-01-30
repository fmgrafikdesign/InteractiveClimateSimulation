import {Color, Vector3} from "three";

export default class ClimateVertex extends Vector3 {

    private _airFlow: Vector3;
    private _humidity: number;
    private _energy: number;
    private _temperature: number;
    private _originalHeight: number;

    private _indexX: number;
    private _indexY: number;

    /**
     * Defines, by how much the vertex rises for each water unit, that is additionally put onto it if this vertex already is completely wet
     */
    private heightIncreasePerWaterUnit: number = 0.2;

    constructor(x?: number, y?: number, z?: number, indexX?: number, indexY?: number) {
        super(x, y, z);
        this._humidity = 0;
        this._energy = 0;
        this._temperature = 0;
        this._airFlow = new Vector3();
        this._originalHeight = z as number;

        this._indexX = (indexX) ? indexX : 0;
        this._indexY = (indexY) ? indexY : 0;
    }

    public getColor(): Color {

        // TODO: add calculation to return a color based on the height, humidity and current energy of the vertex
        return new Color(1, 1, 1);
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
            this.y += (value - 1) * this.heightIncreasePerWaterUnit;
            this._humidity = 1;
        }
        else if (this._humidity == 1 && value < 1 && this.y > this._originalHeight) {
            // decrease the current height, but maximal to the original height
            this.y = Math.max(this._originalHeight, this.y - (1 - value) * this.heightIncreasePerWaterUnit);
        }
        else {
            this._humidity = value;
        }
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
        return this._temperature;
    }

    set temperature(value: number) {
        this._temperature = value;
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
}
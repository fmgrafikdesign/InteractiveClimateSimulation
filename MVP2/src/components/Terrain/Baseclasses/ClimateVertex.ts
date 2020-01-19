import {Color, Vector3} from "three";

export default class ClimateVertex extends Vector3 {

    private _airFlow: Vector3 = new Vector3();
    private _humidity: number = 0;
    private _energy: number = 0;
    private _temperature: number = 0;

    constructor(x?: number, y?: number, z?: number) {
        super(x, y, z);
        this._humidity = 0;
        this._energy = 0;
        this._airFlow = new Vector3();
    }

    public getColor(): Color {

        // TODO: add calculation to return a color based on the height, humidity and current energy of the vertex
        return new Color(1, 1, 1);
    }

    get humidity(): number {
        return this._humidity;
    }

    set humidity(value: number) {
        this._humidity = value;
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
}
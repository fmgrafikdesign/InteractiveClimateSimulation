import {Color, Vector3} from "three";

export default class ClimateVertex {
    private _position: Vector3;
    private _airFlow: Vector3;
    private _humidity: number;
    private _energy: number;

    constructor(position?: Vector3) {
        if (!position)
        {
            position = new Vector3();
        }

        this._position = position;
        this._humidity = 0;
        this._energy = 0;
        this._airFlow = new Vector3();
    }

    public getColor(): Color {

        // TODO: add calculation to return a color based on the height, humidity and current energy of the vertex
        return new Color(1, 1, 1);
    }

    get position(): Vector3 {
        return this._position;
    }

    set position(value: Vector3) {
        this._position = value;
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
}
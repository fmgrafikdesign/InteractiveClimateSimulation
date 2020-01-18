import ClimateVertex from "./Baseclasses/ClimateVertex";
import {PlaneGeometry} from "three";


export default interface ITerrain {

    getVertex(indexX: number, indexY: number): ClimateVertex;

    getWidth(): number;

    getHeight(): number;

    updateMesh(geometry: PlaneGeometry): void;

    updateMeshColors(): void;
}
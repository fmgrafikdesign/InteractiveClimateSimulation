import ClimateVertex from "./Baseclasses/ClimateVertex";
import {Mesh, PlaneGeometry} from "three";
import {ITerrainColorModel} from "./ColorModels/ITerrainColorModel";


export default interface ITerrain {

    getVertex(indexX: number, indexY: number): ClimateVertex | null;

    updateMesh(geometry: PlaneGeometry): void;

    updateMeshColors(colorModel: ITerrainColorModel): void;

    getVertices(): ClimateVertex[];

    getGeometry(): PlaneGeometry;

    getMesh(): Mesh;
}
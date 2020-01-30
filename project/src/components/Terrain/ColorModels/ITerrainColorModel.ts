import ITerrain from "../ITerrain";

export interface ITerrainColorModel {
    updateMeshColors(terrain: ITerrain): void;
}
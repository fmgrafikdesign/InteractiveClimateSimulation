import Terrain from "../TerrainFabian";

export interface ITerrainColorModel {
    updateMeshColors(terrain: Terrain): void;
}
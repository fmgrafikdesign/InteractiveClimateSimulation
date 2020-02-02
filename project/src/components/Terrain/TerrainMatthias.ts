import {Mesh, MeshLambertMaterial, PlaneGeometry, Vector3, VertexColors} from "three";
import ClimateVertex from "./Baseclasses/ClimateVertex";
import ITerrain from "./ITerrain";
import {ITerrainColorModel} from "./ColorModels/ITerrainColorModel";
import Simulation from "../Simulation/Simulation";
import TerrainUtilities from "./TerrainUtilities";

export default class Terrain implements ITerrain {
    private readonly nrOfVerticesX: number;
    private readonly nrOfVerticesY: number;

    private geometry: PlaneGeometry;
    private _mesh: Mesh;

    constructor(geometry: PlaneGeometry, nrOfVerticesX: number = 50, nrOfVerticesY: number = 50) {
        this.nrOfVerticesX = nrOfVerticesX;
        this.nrOfVerticesY = nrOfVerticesY;

        this.geometry = geometry;
        this._mesh = new Mesh();

        this.updateMesh(geometry);
    }

    public setVertex(indexX: number, indexY: number, data: Vector3) {
        const index: number = this.getVertexPositionInArray(indexX, indexY);
        this.geometry.vertices[index].x = data.x;
        this.geometry.vertices[index].y = data.y;
        this.geometry.vertices[index].z = data.z;

        this.geometry.verticesNeedUpdate = true;
        this.geometry.elementsNeedUpdate = true;
        this.geometry.colorsNeedUpdate = true;
        this.geometry.uvsNeedUpdate = true;
        this.geometry.normalsNeedUpdate = true;
        this.geometry.groupsNeedUpdate = true;
        this.geometry.lineDistancesNeedUpdate = true;
    }

    public setZValue(indexX: number, indexY: number, z: number) {
        this.setVertex(indexX, indexY, new Vector3(this.geometry.vertices[this.getVertexPositionInArray(indexX, indexY)].x, this.geometry.vertices[this.getVertexPositionInArray(indexX, indexY)].y, z));
    }

    public getVertex(indexX: number, indexY: number): ClimateVertex | null {
        return (this.isInBounds(indexX, indexY)) ? this.geometry.vertices[this.getVertexPositionInArray(indexX, indexY)] as ClimateVertex : null;
    }

    private getVertexPositionInArray(x: number, y: number): number {
        return x + y * this.nrOfVerticesX;
    }

    private ZeroAllVertices() {
        for (let i = 0; i < this.nrOfVerticesY; i++) {
            for (let j = 0; j < this.nrOfVerticesX; j++) {
                this.setZValue(i, j, 0);
            }
        }
    }

    private ConvertGeometryVerticesToClimateVertices() {
        for (let i = 0; i < this.geometry.vertices.length; i++) {
            let vertex: Vector3 = this.geometry.vertices[i];
            this.geometry.vertices[i] = new ClimateVertex(vertex.x, vertex.y, vertex.z, i % this.nrOfVerticesX, Math.floor(i / this.nrOfVerticesX));
        }
    }

    updateMeshColors(colorModel: ITerrainColorModel): void {
        colorModel.updateMeshColors(this);

        this.geometry.colorsNeedUpdate = true;
        this.geometry.verticesNeedUpdate = true;

        // Flat shading normal computing
        //this.geometry.computeFlatVertexNormals();
    }

    updateMesh(geometry: PlaneGeometry): void {
        if (geometry.vertices.length != 0 && geometry.vertices.length != this.geometry.vertices.length) {
            console.log("Unequal number of vertices detected. Trying to fit the new geometry on the old.");

            geometry = TerrainUtilities.fitGeometryInBounds(geometry, TerrainUtilities.getWidth(this.geometry as PlaneGeometry), TerrainUtilities.getDepth(this.geometry as PlaneGeometry));
            geometry = TerrainUtilities.interpolateShrinkVertexDensity(geometry, this.nrOfVerticesX, this.nrOfVerticesY);
        }

        this.geometry.dispose();
        this.geometry = geometry;

        // Rotate mesh so Z is the new Y coordinate.
        this.geometry.rotateX(-Math.PI / 2);

        this.ConvertGeometryVerticesToClimateVertices();

        this.geometry.verticesNeedUpdate = true;

        // Flat shading normal computing
        this.geometry.computeFlatVertexNormals();

        const material = new MeshLambertMaterial({
            wireframe: false,
            flatShading: true,
            vertexColors: VertexColors
        });


        this._mesh = new Mesh(this.geometry, material);

        // Restart the simulation after updating the mesh
        Simulation.reset();
        Simulation.context.setupStrategy();
    }

    getVertices(): ClimateVertex[] {
        return this.geometry.vertices as ClimateVertex[];
    }

    getGeometry(): PlaneGeometry {
        return this.geometry;
    }

    getMesh(): Mesh {
        return this._mesh;
    }

    /*
    adjustVertexHeights(): void {
        let vertexChanged: boolean = false;
        this.geometry.vertices.forEach((vertex) => {
            const currentVertex: ClimateVertex = vertex as ClimateVertex;

            if (currentVertex.y != currentVertex.targetHeight) {
                if (Math.abs(currentVertex.y - currentVertex.targetHeight) < 0.1) {
                    currentVertex.y = currentVertex.targetHeight;
                }
                else {
                    currentVertex.y += Helpers.clamp((currentVertex.y - currentVertex.targetHeight) * 0.5, 0.1, 1);
                }

                vertexChanged = true;
            }
        });

        if (vertexChanged) {
            this.geometry.verticesNeedUpdate = true;

            // Flat shading normal computing
            this.geometry.computeFlatVertexNormals();
        }
    }
     */

    private isInBounds(indexX: number, indexY: number): boolean {
        return indexX >= 0 && indexX < this.nrOfVerticesX && indexY >= 0 && indexY < this.nrOfVerticesY;
    }
}
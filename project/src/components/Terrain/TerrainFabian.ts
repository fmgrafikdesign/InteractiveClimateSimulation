import * as THREE from "three";
import {Geometry, Mesh, PlaneGeometry} from "three";
import {ITerrainColorModel} from "./ColorModels/ITerrainColorModel";
import Simulation from "../Simulation/Simulation";
import ClimateVertex from "./Baseclasses/ClimateVertex";
import ITerrain from "./ITerrain";

export default class Terrain implements ITerrain {
    mesh: Mesh;
    geometry: Geometry;
    vertices: ClimateVertex[];
    private readonly width: number;
    private readonly height: number;
    private readonly verticesX: number;
    private readonly verticesY: number;

    constructor(geometry: PlaneGeometry, verticesX: number = 50, verticesY: number = 50, width: number = 100, height: number = 100) {
        this.verticesX = verticesX;
        this.verticesY = verticesY;
        this.width = width;
        this.height = height;

        this.vertices = [];
        this.geometry = geometry;

        this.convertVerticesToClimateVertices();
        this.mesh = new Mesh();

        this.updateMesh(geometry);
    }

    private convertVerticesToClimateVertices() {
        this.geometry.vertices.forEach((vertex, index) => {
            this.geometry.vertices[index] = new ClimateVertex(vertex.x, vertex.y, vertex.z);
        });
        this.vertices = this.geometry.vertices as ClimateVertex[];
    }

    updateMesh(geometry: PlaneGeometry) {
    // Calculate colors for each face
        this.geometry.dispose();
        this.geometry = geometry;
        // this.updateMeshColors();

        this.convertVerticesToClimateVertices();
        this.geometry.verticesNeedUpdate = true;

        // Flat shading normal computing
        this.geometry.computeFlatVertexNormals();

        const material = new THREE.MeshLambertMaterial({
            wireframe: false,
            flatShading: true,
            vertexColors: THREE.VertexColors
        });

        // Rotate mesh so Z is the new Y coordinate.
        this.geometry.rotateX(-Math.PI / 2);

        this.mesh = new Mesh(this.geometry, material);

        // Restart the simulation after updating the mesh
        Simulation.reset();
        Simulation.context.setupStrategy();
    }

    updateMeshColors(colorModel: ITerrainColorModel) {
        colorModel.updateMeshColors(this);
        this.geometry.colorsNeedUpdate = true;
    }

    getMesh(): Mesh {
        return this.mesh;
    }

    public getVertex(indexX: number, indexY: number): ClimateVertex {
        return (this.isInBounds(indexX, indexY)) ? this.vertices[this.getVertexPositionInArray(indexX, indexY)] : new ClimateVertex();
    }

    private getVertexPositionInArray(x: number, y: number): number {
        return x + y * this.verticesX;
    }

    getVertices(): ClimateVertex[] {
        return this.vertices;
    }

    getGeometry(): PlaneGeometry {
        return this.geometry as PlaneGeometry;
    }

    private isInBounds(indexX: number, indexY: number): boolean {
        return indexX >= 0 && indexX < this.verticesX && indexY >= 0 && indexY < this.verticesY;
    }
}

import * as THREE from "three";
import {Geometry, Mesh, PlaneGeometry, Vector3} from "three";
import {ITerrainColorModel} from "./ColorModels/ITerrainColorModel";
import HeightColorModel from "./ColorModels/HeightColorModel";
import TemperatureColorModel from "./ColorModels/TemperatureColorModel";
import Simulation from "../Simulation/Simulation";
import ClimateVertex from "./Baseclasses/ClimateVertex";
import TemperatureHumidityColorModel from "./ColorModels/TemperatureHumidityColorModel";

// What model to use for coloring the terrain
const colorModel = new TemperatureHumidityColorModel();

export class Terrain {
    mesh: Mesh;
    geometry: Geometry;
    ColorModel: ITerrainColorModel = colorModel;
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
        this.updateMeshColors();

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

    updateMeshColors() {
        this.ColorModel.updateMeshColors(this);
        this.geometry.colorsNeedUpdate = true;
    }
}

export default Terrain;

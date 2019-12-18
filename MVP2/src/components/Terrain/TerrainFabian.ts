import * as THREE from "three";
import {Color, Vector3, MeshPhongMaterial, PlaneGeometry, Mesh, Geometry, Material} from "three";

export class Terrain {
    private vertices: Vector3[];
    private readonly width: number;
    private readonly height: number;
    private readonly verticesX: number;
    private readonly verticesY: number;
    mesh: Mesh;
    geometry: Geometry;
    
    // debug
    waterThreshold: number = 65;

    setWaterThreshold(threshold: number) {
        this.waterThreshold = threshold;
        this.updateMeshColors();
    }

    constructor(geometry: PlaneGeometry, verticesX: number = 50, verticesY: number = 50, width: number = 100, height: number = 100) {
        this.verticesX = verticesX;
        this.verticesY = verticesY;
        this.width = width;
        this.height = height;
        this.vertices = geometry.vertices;
        this.geometry = geometry;
        this.mesh = new Mesh();

        this.updateMesh(geometry);
    }

    updateMesh(geometry: PlaneGeometry) {
    // Calculate colors for each face
        this.geometry.dispose();
        this.geometry = geometry;
        this.updateMeshColors();

        this.geometry.verticesNeedUpdate = true;

        // Flat shading normal computing
        this.geometry.computeFlatVertexNormals();

        const material = new THREE.MeshLambertMaterial({
            wireframe: false,
            flatShading: true,
            vertexColors: THREE.VertexColors
        });

        this.mesh = new Mesh(this.geometry, material);
        // console.log("Terrain mesh has been updated.");
        // console.log(this.geometry);
        // console.log(this.mesh);
    }

    private updateMeshColors() {
        this.geometry.faces.forEach((face) => {
            const a = this.geometry.vertices[face.a];
            const b = this.geometry.vertices[face.b];
            const c = this.geometry.vertices[face.c];

            const averageHeight = (a.z + b.z + c.z) / 3;
            if (averageHeight <= 0) {
                a.z = 0;
                b.z = 0;
                c.z = 0;
            }

            // Assign color based on highest point of the face
            const max = Math.max(a.z, Math.max(b.z, c.z));

            if (max <= this.waterThreshold) {
                return face.color.set(0x44ccff);
            } else if (max <= 70) {
                return face.color.set(0x66cc44);
            } else if (max <= 90) {
                return face.color.set(0xeecc44);
            } else if (max <= 110) {
                return face.color.set(0xcccccc);
            }

        });

        this.geometry.colorsNeedUpdate = true;
    }

    setVertex(indexX: number, indexY: number, data: Vector3) {
        this.vertices[this.getVertexPositionInArray(indexX, indexY)] = data;
    }

    getVertex(indexX: number, indexY: number) {
        return this.vertices[this.getVertexPositionInArray(indexX, indexY)];
    }

    getVertexPositionInArray(x: number, y: number) {
        return x + y * this.verticesX;
    }

    ZeroAllVertices() {
        this.vertices = [];

        const stepSizeX = this.width / this.verticesX;
        const stepSizeY = this.height / this.verticesY;

        for (let i = 0; i < this.verticesY; i++) {
            for (let j = 0; j < this.verticesX; j++) {
                this.vertices.push(new Vector3(j * stepSizeX, i * stepSizeY, 0));
            }
        }
    }
}

export default Terrain;

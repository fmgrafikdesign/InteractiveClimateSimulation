import {Color, Geometry, Material, Mesh, MeshLambertMaterial, MeshPhongMaterial, PlaneGeometry, Vector3, VertexColors} from "three";
import ClimateVertex from "./Baseclasses/ClimateVertex";
import ITerrain from "./ITerrain";
import LngLatTerrainGenerator from "./Generators/LngLatTerrainGenerator";

export class Terrain implements ITerrain {
    private readonly nrOfVerticesX: number;
    private readonly nrOfVerticesY: number;

    private geometry: Geometry;
    private _mesh: Mesh;
    private vertices: ClimateVertex[];

    constructor(geometry: Geometry, nrOfVerticesX: number = 50, nrOfVerticesY: number = 50) {
        this.nrOfVerticesX = nrOfVerticesX;
        this.nrOfVerticesY = nrOfVerticesY;

        this.geometry = geometry;

        // dummy material -> gets overridden in TerrainViewMatthias.tsiew.ts
        const material: Material = new MeshPhongMaterial({color: new Color(1, 1, 1)});

        this._mesh = new Mesh(geometry, material);

        this.GetVerticesFromGeometry();
    }

	public setVertex(indexX: number, indexY: number, data: Vector3) {
        const index: number = this.getVertexPositionInArray(indexX, indexY);
        this.vertices[index].x = data.x;
        this.vertices[index].y = data.y;
        this.vertices[index].z = data.z;
        this.geometry.vertices[index] = this.vertices[index];

        this.geometry.verticesNeedUpdate = true;
        this.geometry.elementsNeedUpdate = true;
        this.geometry.colorsNeedUpdate = true;
        this.geometry.uvsNeedUpdate = true;
        this.geometry.normalsNeedUpdate = true;
        this.geometry.groupsNeedUpdate = true;
        this.geometry.lineDistancesNeedUpdate = true;
    }

	public setZValue(indexX: number, indexY: number, z: number) {
        this.setVertex(indexX, indexY, new Vector3(this.vertices[this.getVertexPositionInArray(indexX, indexY)].x, this.vertices[this.getVertexPositionInArray(indexX, indexY)].y, z));
    }

	public getVertex(indexX: number, indexY: number): ClimateVertex {
        return this.vertices[this.getVertexPositionInArray(indexX, indexY)];
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

	private GetVerticesFromGeometry() {
		this.vertices = [];
		this.geometry.vertices.forEach((value, index) => {
			this.vertices.push(new ClimateVertex(value.x, value.y, value.z, index % this.nrOfVerticesX, Math.floor(index / this.nrOfVerticesX)));
		});
	}

	public smooth(radius: number, strength: number, iterations: number = 5) {
        for (let iteration = 0; iteration < iterations; iteration++) {
            const verticesBefore = (this._mesh.geometry as Geometry).vertices;

            for (let y = 0; y < this.nrOfVerticesY; y++) {
                for (let x = 0; x < this.nrOfVerticesX; x++) {
                    let zSum = 0;
                    let counter = 0;

                    for (let ySmoothing = y - radius; ySmoothing < y + radius; ySmoothing++) {
                        for (let xSmoothing = x - radius; xSmoothing < x + radius; xSmoothing++) {
                            if (ySmoothing >= 0 && ySmoothing < this.nrOfVerticesY && xSmoothing >= 0 && xSmoothing < this.nrOfVerticesX && !(x === xSmoothing && y === ySmoothing)) {
                                zSum += verticesBefore[xSmoothing + ySmoothing * this.nrOfVerticesX].z;
                                counter++;
                            }
                        }
                    }

                    if (counter > 0) {
                        const zBefore = verticesBefore[x + y * this.nrOfVerticesX].z;
                        const zMiddle = zSum / counter;
                        const newZValue = zBefore + (zMiddle - zBefore) * Math.max(0, Math.min(1, strength));
                        this.setZValue(x, y, newZValue);
                    }
                }
            }
        }

        // console.info("Smoothing done");
    }

	public get mesh(): Mesh {
        return this._mesh;
    }

	public set mesh(meshToSet: Mesh) {
        this._mesh = meshToSet;
    }

    public getWidth(): number {
        this._mesh.geometry.computeBoundingBox();

        let size: Vector3 = new Vector3();
        return (this._mesh.geometry as Geometry).boundingBox.getSize(size).x;
    }

	public getHeight(): number {
        this._mesh.geometry.computeBoundingBox();

        let size: Vector3 = new Vector3();
        return (this._mesh.geometry as Geometry).boundingBox.getSize(size).y;
    }

    public getHighestPoint(): number {
        let maxHeight = this.geometry.vertices[0].z;

        this.geometry.vertices.forEach(value => {
            if (value.z > maxHeight) {
                maxHeight = value.z;
            }
        });

        return maxHeight;
    }

	updateMeshColors(): void {
		this.geometry.faces.forEach((face) => {
			// TODO: set the color of the face depending on the colors of the three vertices it is made up of
		});

		this.geometry.colorsNeedUpdate = true;
	}

	updateMesh(geometry: PlaneGeometry): void {
		this.geometry.dispose();
		this.geometry = geometry;
		this.updateMeshColors();

		this.geometry.verticesNeedUpdate = true;

		// Flat shading normal computing
		this.geometry.computeFlatVertexNormals();

		const material = new MeshLambertMaterial({
			wireframe: false,
			flatShading: true,
			vertexColors: VertexColors
		});

		// Rotate mesh so Z is the new Y coordinate.
		this.geometry.rotateX(-Math.PI / 2);

		this.mesh = new Mesh(this.geometry, material);

		this.GetVerticesFromGeometry();
	}

    getVertices(): ClimateVertex[] {
        return this.vertices;
    }

    getMesh(): Mesh {
        return this._mesh;
    }
}
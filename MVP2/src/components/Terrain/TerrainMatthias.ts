import {Color, Vector3, MeshPhongMaterial, PlaneGeometry, Mesh, Geometry, Material, MeshBasicMaterial, WireframeGeometry} from "three";
import IMessageReceiver from "../MessageSystem/IMessageReceiver";
import IMessage from "../MessageSystem/IMessage";
import IMessageSender from "../MessageSystem/IMessageSender";
import VariableChangedMessage from "../MessageSystem/VariableChangedMessage";
import CustomImageData from "./Generators/CustomImageData";
import {MapTerrainGenerator} from "./Generators/MapTerrainGenerator";


export class Terrain implements IMessageReceiver {
    constructor(vertices: Vector3[] = [], verticesX: number = 50, verticesY: number = 50, width: number = 100, height: number = 100) {
        this.vertices = vertices;
        this.verticesX = verticesX;
        this.verticesY = verticesY;
        this.width = width;
        this.height = height;
        this._mesh = new Mesh();

        if (vertices === []) {
            this.ZeroAllVertices();
        }
    }

    private vertices: Vector3[];
    private readonly width: number;
    private readonly height: number;
    private readonly verticesX: number;
    private readonly verticesY: number;
    private _mesh: Mesh;

    generateMesh() {
        const planeGeometry: Geometry = new PlaneGeometry(this.width, this.height, this.verticesX - 1, this.verticesY - 1);
        //let material = new THREE.MeshLambertMaterial({color: new Color(1, 0.8, 0.6)});
        const material: Material = new MeshPhongMaterial({color: new Color(1, 0.9, 0.7), wireframe: true});

        if (this.vertices !== [] && this.vertices !== null) {
            for (let i = 0; i < this.verticesX * this.verticesY; i++) {
                planeGeometry.vertices[i].z = this.vertices[i].z;
            }
            //planeGeometry.vertices = this.vertices;
        }

        planeGeometry.computeVertexNormals();
        this._mesh = new Mesh(planeGeometry, material);
    }

    setVertex(indexX: number, indexY: number, data: Vector3) {
        const geometry : Geometry = this._mesh.geometry as Geometry;
        const arrayIndex = this.getVertexPositionInArray(indexX, indexY);
        this.vertices[arrayIndex] = data;
        geometry.vertices[arrayIndex] = data;
    }

    setZValue(indexX: number, indexY: number, z: number) {
        this.setVertex(indexX, indexY, new Vector3(
            (this._mesh.geometry as Geometry).vertices[this.getVertexPositionInArray(indexX, indexY)].x,
            (this._mesh.geometry as Geometry).vertices[this.getVertexPositionInArray(indexX, indexY)].y,
            z));
    }

    getVertex(indexX: number, indexY: number) {
        return (this._mesh.geometry as Geometry).vertices[this.getVertexPositionInArray(indexX, indexY)];
    }

    getVertexPositionInArray(x: number, y: number) {
        return x + y * this.verticesX;
    }

    ZeroAllVertices() {
        this.vertices = [];
        const geometry : Geometry = this._mesh.geometry as Geometry;

        let stepSizeX = this.width / this.verticesX;
        let stepSizeY = this.height / this.verticesY;

        for (let i = 0; i < this.verticesY; i++) {
            for (let j = 0; j < this.verticesX; j++) {
                this.vertices.push(new Vector3(j * stepSizeX, i * stepSizeY, 0));
                geometry.vertices[this.getVertexPositionInArray(j, i)].z = 0;
            }
        }
    }

    smooth(radius: number, strength: number, iterations: number = 5) {
        for (let iteration = 0; iteration < iterations; iteration++) {
            const verticesBefore = this.vertices;

            for (let y = 0; y < this.verticesY; y++) {
                for (let x = 0; x < this.verticesX; x++) {
                    let zSum = 0;
                    let counter = 0;

                    for (let ySmoothing = y - radius; ySmoothing < y + radius; ySmoothing++) {
                        for (let xSmoothing = x - radius; xSmoothing < x + radius; xSmoothing++) {
                            if (ySmoothing >= 0 && ySmoothing < this.verticesY && xSmoothing >= 0 && xSmoothing < this.verticesX) {
                                zSum += verticesBefore[xSmoothing + ySmoothing * this.verticesX].z;
                                counter++;
                            }
                        }
                    }

                    const zMiddle = zSum / counter;
                    this.vertices[x + y * this.verticesX].z += (zMiddle - verticesBefore[x + y * this.verticesX].z) * Math.max(0, Math.min(1, strength));
                }
            }
        }
    }


    get mesh(): Mesh {
        return this._mesh;
    }

    receiveMessage(message: IMessage, sender : IMessageSender) : void {
        console.log("Received message!");
        console.log(message);

        console.log(sender);

        const convertedMessage : VariableChangedMessage = message as VariableChangedMessage;

        if (convertedMessage.variablesThatChanged[0] === "dun")
        {
            const imageData : CustomImageData = sender as CustomImageData;

            let pixelsPerIndexX = imageData.getWidth() / this.verticesX;
            let pixelsPerIndexY = imageData.getHeight() / this.verticesY;

            for (let y = 0; y < this.verticesY; y++) {
                for (let x = 0; x < this.verticesX; x++) {
                    //console.log(x * pixelsPerIndexX + ", " + y * pixelsPerIndexY + ": " + imageData.getValueAt(x * pixelsPerIndexX, y * pixelsPerIndexY));
                    let height = MapTerrainGenerator.getHeightFromRGBA(imageData.getValueAt(x * pixelsPerIndexX, y * pixelsPerIndexY));
                    this.setZValue(x, y, height);
                    //console.log(x * pixelsPerIndexX + ", " + y * pixelsPerIndexY + ": " + height);
                }
            }

            //this.generateMesh();

            //this._mesh.geometry.setFromPoints(this.vertices);
            this._mesh.geometry.computeVertexNormals();
        }
    }
}
import * as THREE from "three";
import {Color, Vector3, MeshPhongMaterial, PlaneGeometry, Mesh, Geometry, Material} from "three";


export class Terrain
{
    private vertices : Vector3[];
    private readonly width : number;
    private readonly height : number;
    private readonly verticesX : number;
    private readonly verticesY : number;
    private _mesh : Mesh;

    constructor(geometry : PlaneGeometry, verticesX : number = 50, verticesY : number = 50, width : number = 100, height : number = 100)
    {
        this.verticesX = verticesX;
        this.verticesY = verticesY;
        this.width = width;
        this.height = height;
        this.vertices = geometry.vertices;

        // Calculate colors for each face
        geometry.faces.forEach( face => {
            const a = geometry.vertices[face.a];
            const b = geometry.vertices[face.b];
            const c = geometry.vertices[face.c];

            const averageHeight = (a.z + b.z + c.z) / 3;
            if(averageHeight <= 0) {
                a.z = 0;
                b.z = 0;
                c.z = 0;
            }

            // Assign color based on highest point of the face
            let max = Math.max(a.z, Math.max(b.z, c.z));

            if(max <=  0)   return face.color.set(0x44ccff);
            if(max <= 20)   return face.color.set(0x66cc44);
            if(max <= 45)   return face.color.set(0xeecc44);
            if(max <= 65)   return face.color.set(0xcccccc);
        });

        geometry.colorsNeedUpdate = true;
        geometry.verticesNeedUpdate = true;

        // Flat shading normal computing
        geometry.computeFlatVertexNormals();

        const material = new THREE.MeshLambertMaterial({
            vertexColors: THREE.VertexColors,
            //wireframe: true,
            flatShading: true
        });

        this._mesh = new Mesh(geometry, material);
    }
    
    setVertex(indexX : number, indexY : number, data : Vector3)
    {
        this.vertices[this.getVertexPositionInArray(indexX, indexY)] = data;
    }
    
    getVertex(indexX : number, indexY : number)
    {
        return this.vertices[this.getVertexPositionInArray(indexX, indexY)];
    }
    
    getVertexPositionInArray(x : number, y : number)
    {
        return x + y * this.verticesX;
    }
    
    ZeroAllVertices()
    {
        this.vertices = [];
        
        let stepSizeX = this.width / this.verticesX;
        let stepSizeY = this.height / this.verticesY;
    
        for (let i = 0; i < this.verticesY; i++)
        {
            for (let j = 0; j < this.verticesX; j++)
            {
                this.vertices.push(new Vector3(j * stepSizeX, i * stepSizeY, 0))
            }
        }
    }

    generateMesh()
    {
        console.log("This should not get called.");
    }


    get mesh() : Mesh
    {
        return this._mesh;
    }
}

export default Terrain;
import {Color, Vector3, MeshPhongMaterial, PlaneGeometry, Mesh, Geometry, Material} from "three";


export class Terrain
{
    constructor(vertices : Vector3[] = [], verticesX : number = 50, verticesY : number = 50, width : number = 100, height : number = 100)
    {
        this.vertices = vertices;
        this.verticesX = verticesX;
        this.verticesY = verticesY;
        this.width = width;
        this.height = height;
        this._mesh = new Mesh();
        
        if (vertices === [])
        {
            this.ZeroAllVertices();
        }
    }

    private vertices : Vector3[];
    private readonly width : number;
    private readonly height : number;
    private readonly verticesX : number;
    private readonly verticesY : number;
    private _mesh : Mesh;

    generateMesh()
    {
        const planeGeometry: Geometry = new PlaneGeometry(this.width, this.height, this.verticesX - 1, this.verticesY - 1);
        //let material = new THREE.MeshLambertMaterial({color: new Color(1, 0.8, 0.6)});
        const material: Material = new MeshPhongMaterial({color: new Color(1, 0.8, 0.6), wireframe: false});

        //planeGeometry.setFromPoints(this.vertices);

        if (this.vertices !== [] && this.vertices !== null)
        {
            for (let i = 0; i < this.verticesX * this.verticesY; i++)
            {
                planeGeometry.vertices[i].z = this.vertices[i].z;
            }
            //planeGeometry.vertices = this.vertices;
        }

        planeGeometry.computeVertexNormals();
        this._mesh = new Mesh(planeGeometry, material);
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


    get mesh() : Mesh
    {
        return this._mesh;
    }
}
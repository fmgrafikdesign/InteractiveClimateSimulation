import {Color, Geometry, Material, Mesh, MeshPhongMaterial, Vector3} from "three";
import IMessageReceiver from "../MessageSystem/IMessageReceiver";
import IMessage from "../MessageSystem/IMessage";
import IMessageSender from "../MessageSystem/IMessageSender";
import VariableChangedMessage from "../MessageSystem/VariableChangedMessage";
import CustomImageData from "./Generators/CustomImageData";
import {MapTerrainGenerator} from "./Generators/MapTerrainGenerator";
import AbstractMessageSender from "../MessageSystem/AbstractMessageSender";

export class Terrain extends AbstractMessageSender implements IMessageReceiver
{
	constructor(geometry: Geometry, nrOfVerticesX: number = 50, nrOfVerticesY: number = 50)
	{
		super();
		this.nrOfVerticesX = nrOfVerticesX;
		this.nrOfVerticesY = nrOfVerticesY;
		
		this.geometry = geometry;

		// dummy material -> gets overridden in TerrainViewMatthias.tsiew.ts
		const material: Material = new MeshPhongMaterial({color: new Color(1, 1, 1)});

		this._mesh = new Mesh(geometry, material);
	}
	
	private readonly nrOfVerticesX: number;
	private readonly nrOfVerticesY: number;
	
	private readonly geometry: Geometry;
	private _mesh: Mesh;
	
	setVertex(indexX: number, indexY: number, data: Vector3)
	{
		const geometry: Geometry = this._mesh.geometry as Geometry;
		geometry.vertices[this.getVertexPositionInArray(indexX, indexY)] = data;
		
		geometry.verticesNeedUpdate = true;
		geometry.elementsNeedUpdate = true;
		geometry.colorsNeedUpdate = true;
		geometry.uvsNeedUpdate = true;
		geometry.normalsNeedUpdate = true;
		geometry.groupsNeedUpdate = true;
		geometry.lineDistancesNeedUpdate = true;
	}
	
	setZValue(indexX: number, indexY: number, z: number)
	{
		this.setVertex(indexX, indexY, new Vector3(
			(this._mesh.geometry as Geometry).vertices[this.getVertexPositionInArray(indexX, indexY)].x,
			(this._mesh.geometry as Geometry).vertices[this.getVertexPositionInArray(indexX, indexY)].y,
			z));
	}
	
	getVertex(indexX: number, indexY: number)
	{
		return (this._mesh.geometry as Geometry).vertices[this.getVertexPositionInArray(indexX, indexY)];
	}
	
	getVertexPositionInArray(x: number, y: number)
	{
		return x + y * this.nrOfVerticesX;
	}
	
	ZeroAllVertices()
	{
		const geometry: Geometry = this._mesh.geometry as Geometry;
		
		let stepSizeX = this.getWidth() / this.nrOfVerticesX;
		let stepSizeY = this.getHeight() / this.nrOfVerticesY;
		
		for (let i = 0; i < this.nrOfVerticesY; i++)
		{
			for (let j = 0; j < this.nrOfVerticesX; j++)
			{
				// geometry.vertices[this.getVertexPositionInArray(j * stepSizeX, i * stepSizeY)].z = 0;
				geometry.vertices[this.getVertexPositionInArray(j, i)].z = 0;
			}
		}
	}
	
	smooth(radius: number, strength: number, iterations: number = 5)
	{
		for (let iteration = 0; iteration < iterations; iteration++)
		{
			const verticesBefore = (this._mesh.geometry as Geometry).vertices;
			
			for (let y = 0; y < this.nrOfVerticesY; y++)
			{
				for (let x = 0; x < this.nrOfVerticesX; x++)
				{
					let zSum = 0;
					let counter = 0;
					
					for (let ySmoothing = y - radius; ySmoothing < y + radius; ySmoothing++)
					{
						for (let xSmoothing = x - radius; xSmoothing < x + radius; xSmoothing++)
						{
							if (ySmoothing >= 0 && ySmoothing < this.nrOfVerticesY && xSmoothing >= 0 && xSmoothing < this.nrOfVerticesX && !(x === xSmoothing && y === ySmoothing))
							{
								zSum += verticesBefore[xSmoothing + ySmoothing * this.nrOfVerticesX].z;
								counter++;
							}
						}
					}
					
					if (counter > 0)
                    {
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
	
	
	get mesh(): Mesh
	{
		return this._mesh;
	}
	
	set mesh(meshToSet: Mesh)
	{
		this._mesh = meshToSet;
	}
	
	receiveMessage(message: IMessage, sender: IMessageSender): void
	{
		// console.log("Received message!");
		// console.log(message);
		
		// console.log(sender);
		
		const convertedMessage: VariableChangedMessage = message as VariableChangedMessage;
		
		if (convertedMessage.variablesThatChanged[0] === "dun")
		{
			const imageData: CustomImageData = sender as CustomImageData;
			
			let pixelsPerIndexX = imageData.getWidth() / this.nrOfVerticesX;
			let pixelsPerIndexY = imageData.getHeight() / this.nrOfVerticesY;
			
			// console.log("Starting to apply height information to the mesh");
			
			for (let y = 0; y < this.nrOfVerticesY; y++)
			{
				for (let x = 0; x < this.nrOfVerticesX; x++)
				{
					const height = MapTerrainGenerator.getHeightFromRGBA(imageData.getValueAt(x * pixelsPerIndexX, y * pixelsPerIndexY));
					this.setZValue(x, y, height);
				}
			}
			// console.log("Done manipulating the mesh");
			
			// console.log("Mesh width: " + this.getWidth());
			// console.log("Mesh height: " + this.getHeight());
   
			// smooth the terrain over several iterations with increasing radius
            for (let i = 1; i < 8; i++) {
                this.smooth(i, 0.01, 1);
            }

			//this._mesh.geometry.computeVertexNormals();
            (this._mesh.geometry as Geometry).computeFlatVertexNormals();
			this.sendMessage(new VariableChangedMessage(["mesh"]));
			
			//this.generateMesh();
			
			//this._mesh.geometry.setFromPoints(this.vertices);
			//this._mesh.geometry.computeVertexNormals();
		}
	}

	private getWidth(): number
	{
		this._mesh.geometry.computeBoundingBox();
		
		let size: Vector3 = new Vector3();
		return (this._mesh.geometry as Geometry).boundingBox.getSize(size).x;
	}
	
	private getHeight(): number
	{
		this._mesh.geometry.computeBoundingBox();
		
		let size: Vector3 = new Vector3();
		return (this._mesh.geometry as Geometry).boundingBox.getSize(size).y;
	}
	
	public getHighestPoint(): number
	{
		let maxHeight = (this._mesh.geometry as Geometry).vertices[0].z;
		
		(this._mesh.geometry as Geometry).vertices.forEach(value =>
		{
			if (value.z > maxHeight)
			{ maxHeight = value.z; }
		});
		
		return maxHeight;
	}
}
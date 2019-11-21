
import {Vector3} from "../three";
import {Terrain} from "../Terrain";
import {ITerrainGenerator} from "./ITerrainGenerator";


export class RandomTerrainGenerator implements ITerrainGenerator
{
	constructor ()
	{

	}

	private vertices;
	private width;
	private height;
	private verticesX;
	private verticesY;

	generate(width = 100, height = 100, verticesX = 50, verticesY = 50) : Terrain
	{
		//this.vertices = new Array(verticesX * verticesY);
		this.vertices = [];
		this.width = width;
		this.height = height;
		this.verticesX = verticesX;
		this.verticesY = verticesY;
		
		let minZ = 0;
		let maxZ = 5;
		
		let stepSizeX = this.width / this.verticesX;
		let stepSizeY = this.height / this.verticesY;
		
		for (let y = 0; y < this.verticesY; y++)
		{
			for (let x = 0; x < this.verticesX; x++)
			{
				let zValue = Math.random() * (maxZ - minZ + 1) + minZ;
				this.vertices.push(new Vector3(-this.width / 2 + x * stepSizeX, -this.height / 2 + y * stepSizeY, zValue));
			}
		}
		
		return new Terrain(this.vertices, this.verticesX, this.verticesY, this.width, this.height);
	}
}
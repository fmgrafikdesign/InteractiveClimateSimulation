import {PlaneGeometry, Vector2, Vector3} from "three";
import {ITerrainGenerator} from "./ITerrainGenerator";
//import {Terrain} from "../TerrainMatthias";
import {Terrain} from "../TerrainFabian";


export class RandomTerrainBuilderGenerator implements ITerrainGenerator
{
	private vertices : Vector3[];
	private width : number;
	private height : number;
	private verticesX : number;
	private verticesY : number;

	constructor()
	{
		this.vertices = [];
		this.width = 1;
		this.height = 1;
		this.verticesX = 1;
		this.verticesY = 1;
	}

	generate(width : number = 1000, height : number = 1000, verticesX : number = 1000, verticesY : number = 1000) : Terrain
	{
		//this.vertices = new Array(verticesX * verticesY);
		this.vertices = [];
		this.width = width;
		this.height = height;
		this.verticesX = verticesX;
		this.verticesY = verticesY;

		const minZ = 0;
		const maxZ = 5;

		const stepSizeX = this.width / this.verticesX;
		const stepSizeY = this.height / this.verticesY;

		for (let y = 0; y < this.verticesY; y++)
		{
			for (let x = 0; x < this.verticesX; x++)
			{
				const zValue = Math.random() * (maxZ - minZ + 1) + minZ;
				this.vertices.push(new Vector3(-this.width / 2 + x * stepSizeX, -this.height / 2 + y * stepSizeY, zValue));
			}
		}


		// TODO: add hills and valleys randomly over multiple iterations
		do
		{
			this.addCosineHill(Math.random() * width, Math.random() * height);
		}
		while (Math.random() > 0.1);

		this.smoothTerrain(8, 0.5);

		console.info("Smoothing done");

		//return new Terrain(this.vertices, this.verticesX, this.verticesY, this.width, this.height);
		return new Terrain(new PlaneGeometry(), this.verticesX, this.verticesY, this.width, this.height);
	}

	addCosineHill(hillCenterX : number, hillCenterY : number)
	{
		const maxHillHeight = 80;
		const minHillHeight = 20;

		const maxHillDiameter = 1500;
		const minHillDiameter = 100;

		const hillHeight = Math.random() * (maxHillHeight - minHillHeight) + minHillHeight;
		const hillDiameter = Math.random() * (maxHillDiameter - minHillDiameter) + minHillDiameter;

		console.info("Adding hill: Center: " + hillCenterX + ", " + hillCenterY + "; Height: " + hillHeight + "; Diameter: " + hillDiameter);

		for (let y = 0; y < this.verticesY; y++)
		{
			for (let x = 0; x < this.verticesX; x++)
			{
				const currentVector = this.vertices[x + y * this.verticesX];
				const distance = new Vector2(hillCenterX, hillCenterY).distanceTo(new Vector2(currentVector.x, currentVector.y));
				currentVector.z += (Math.abs(distance) < hillDiameter / 2) ? ((Math.cos(Math.abs(distance) * Math.PI * 2 / hillDiameter) + 1) * hillHeight) : 0;
			}
		}
	}

	smoothTerrain(radius : number, strength : number, iterations = 5)
	{
		for (let iteration = 0; iteration < iterations; iteration++)
		{
			const verticesBefore = this.vertices;

			for (let y = 0; y < this.verticesY; y++)
			{
				for (let x = 0; x < this.verticesX; x++)
				{
					let zSum = 0;
					let counter = 0;

					for (let ySmoothing = y - radius; ySmoothing < y + radius; ySmoothing++)
					{
						for (let xSmoothing = x - radius; xSmoothing < x + radius; xSmoothing++)
						{
							if (ySmoothing >= 0 && ySmoothing < this.verticesY && xSmoothing >= 0 && xSmoothing < this.verticesX)
							{
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
}
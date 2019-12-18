
import {Vector3} from "three";
import Terrain from "../TerrainFabian";
import {ITerrainGenerator} from "./ITerrainGenerator";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";

let simplex = new SimplexNoise();
function map(val: number, smin: number, smax: number, emin: number, emax: number) {
	const t =  (val-smin)/(smax-smin)
	return (emax-emin)*t + emin
}
function noise(nx: number, ny: number) {
	// Re-map from -1.0:+1.0 to 0.0:1.0
	return map(simplex.noise2D(nx,ny),-1,1,0,1)
}
//stack some noisefields together
function octave(nx: number,ny: number,octaves: number) {
	let val = 0;
	let freq = 1;
	let max = 0;
	let amp = 1;
	for(let i=0; i<octaves; i++) {
		val += noise(nx*freq,ny*freq)*amp;
		max += amp;
		amp /= 2;
		freq  *= 2;
	}
	return val/max;
}

//generate grayscale image of noise
function generateTexture(width: number, height: number) {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const c = canvas.getContext('2d')
	if(!c) return;

	c.fillStyle = 'black'
	c.fillRect(0,0,canvas.width, canvas.height)

	for(let i=0; i<canvas.width; i++) {
		for(let j=0; j<canvas.height; j++) {
			let v =  octave(i/canvas.width,j/canvas.height,16)
			const per = (100*v).toFixed(2)+'%'
			c.fillStyle = `rgb(${per},${per},${per})`
			c.fillRect(i,j,1,1)
		}
	}
	return c.getImageData(0,0,canvas.width,canvas.height)
}

export class RandomTerrainGenerator implements ITerrainGenerator
{
	constructor ()
	{
		this.vertices = [];
		this.width = 1;
		this.height = 1;
		this.verticesX = 1;
		this.verticesY = 1;
	}

	private vertices : Vector3[];
	private width : number;
	private height : number;
	private verticesX : number;
	private verticesY : number;

	generateHeightsArray (length: number, peak: number = 40)
	{
		const array = [];
		for(let i = 0; i < length; i++) {
			array[i] = Math.random() * peak;
		}

		return array;
	}

	generateMeshFromTexture(data: any, width = 512, height = 512, widthSegments = 60, heightSegments = 60) {
		this.vertices = [];
		this.width = width;
		this.height = height;
		this.verticesX = widthSegments;
		this.verticesY = heightSegments;

//make plane geometry
		const geo = new THREE.PlaneGeometry(width, height,data.width,data.height)


		for(let j=0; j<data.height; j++) {
			for (let i = 0; i < data.width; i++) {
				const n = (j*(data.width)+i);
				const nn = (j*(data.width+1)+i);
				const col = data.data[n*4];
				const v1 = geo.vertices[nn];
				v1.z = map(col,0,255,-50,80);
				//jitter x and y
				// v1.x += map(Math.random(),0,1,-0.5,0.5)
				// v1.y += map(Math.random(),0,1,-0.5,0.5)
			}
		}

		return geo;
	}

	generate(width = 512, height = 512, widthSegments = 30, heightSegments = 30) : Terrain
	{
		//this.vertices = new Array(verticesX * verticesY);
		this.vertices = [];
		this.width = width;
		this.height = height;
		this.verticesX = widthSegments;
		this.verticesY = heightSegments;

		const heightmap = this.generateHeightsArray((widthSegments) * (heightSegments));

		const texture = generateTexture(widthSegments, heightSegments);

		const geometry = this.generateMeshFromTexture(texture);
		/*
		let geometry = new THREE.PlaneGeometry(width,height, widthSegments, heightSegments);

		for(let i = 0, l = geometry.vertices.length; i < l; i++) {
			geometry.vertices[i].z = heightmap[i];
		}
		*/
		return new Terrain(geometry);
	}
}
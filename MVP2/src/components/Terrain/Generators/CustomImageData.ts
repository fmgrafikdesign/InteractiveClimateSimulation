import IMessage from "../../MessageSystem/IMessage";
import VariableChangedMessage from "../../MessageSystem/VariableChangedMessage";
import AbstractMessageSender from "../../MessageSystem/AbstractMessageSender";


export default class CustomImageData extends AbstractMessageSender
{
	private imageWidth: number;
	private imageHeight: number;
	private data: Uint8ClampedArray[];
	
	private dun: boolean;
	
	constructor(width: number, height: number)
	{
		super();
		
		this.imageWidth = width;
		this.imageHeight = height;
		this.dun = false;
		
		this.data = new Array(width * height);
	}
	
	public getValueAt(x: number, y: number): Uint8ClampedArray
	{
		if (x > this.imageWidth) { x = this.imageWidth; }
		if (y > this.imageHeight) { y = this.imageHeight; }

		return ((x === Math.floor(x) && y === Math.floor(y)) ? this.data[this.getIndex(x, y)] : this.interpolateBilinear(x, y));
	}
	
	public setValueAt(x: number, y: number, value: Uint8ClampedArray)
	{
		this.data[this.getIndex(x, y)] = value;
	}
	
	private getIndex(x: number, y: number): number
	{
		return x + y * this.imageWidth;
	}
	
	public setDun(isItDun: boolean = true)
	{
		this.dun = isItDun;
		
		if (isItDun)
		{
			const message : IMessage = new VariableChangedMessage(["dun"]);
			
			this.sendMessage(message);
		}
	}
	
	public isDun(): boolean
	{
		return this.dun;
	}
	
	public getWidth()
	{
		return this.imageWidth;
	}
	
	public getHeight()
	{
		return this.imageHeight;
	}

	private interpolateBilinear(x: number, y: number): Uint8ClampedArray
	{
		const lowerLeftData : Uint8ClampedArray = this.getValueAt(Math.floor(x), Math.ceil(y));
		const lowerRightData : Uint8ClampedArray = this.getValueAt(Math.ceil(x), Math.ceil(y));
		const upperLeftData : Uint8ClampedArray = this.getValueAt(Math.floor(x), Math.floor(y));
		const upperRightData : Uint8ClampedArray = this.getValueAt(Math.ceil(x), Math.floor(y));

		const strengthX : number = x - Math.floor(x);
		const strengthY : number = y - Math.floor(y);

		const upperInterpolatedValues = this.interpolateUintArray(upperLeftData, upperRightData, strengthX);
		const lowerInterpolatedValues = this.interpolateUintArray(lowerLeftData, lowerRightData, strengthX);

		return this.interpolateUintArray(upperInterpolatedValues, lowerInterpolatedValues, strengthY);
	}

	private interpolateUintArray(value1: Uint8ClampedArray, value2: Uint8ClampedArray, strength: number): Uint8ClampedArray
	{
		const interpolatedValue = value1;
		interpolatedValue[0] = this.interpolateLinear(value1[0], value2[0], strength);
		interpolatedValue[1] = this.interpolateLinear(value1[1], value2[1], strength);
		interpolatedValue[2] = this.interpolateLinear(value1[2], value2[2], strength);
		interpolatedValue[3] = this.interpolateLinear(value1[3], value2[3], strength);

		return interpolatedValue;
	}

	private interpolateLinear(value1: number, value2: number, strength: number): number
	{
		return (1 - strength) * value1 + strength * value2;
	}
}
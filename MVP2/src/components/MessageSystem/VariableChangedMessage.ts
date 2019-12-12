import IMessage from "./IMessage";


export default class VariableChangedMessage implements IMessage
{
	public variablesThatChanged : Array<string>;
	
	constructor(changedVariable : Array<string>)
	{
		this.variablesThatChanged = changedVariable;
	}
}
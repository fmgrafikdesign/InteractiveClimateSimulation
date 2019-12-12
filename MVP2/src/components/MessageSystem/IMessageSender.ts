import IMessageReceiver from "./IMessageReceiver";
import IMessage from "./IMessage";


export default interface IMessageSender
{
	sendMessage(message : IMessage, sender : IMessageSender) : void;
	
	addReceiver(receiver : IMessageReceiver) : void;
	
	removeReceiver(receiver : IMessageReceiver) : void;
}
import IMessage from "./IMessage";
import IMessageSender from "./IMessageSender";


export default interface IMessageReceiver
{
	receiveMessage(message : IMessage, sender : IMessageSender) : void;
}
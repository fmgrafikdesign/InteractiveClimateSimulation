import IMessageReceiver from "./IMessageReceiver";
import IMessage from "./IMessage";
import IMessageSender from "./IMessageSender";


export default class AbstractMessageSender implements IMessageSender {
    protected receivers: Array<IMessageReceiver>;

    constructor() {
        this.receivers = [];
    }


    sendMessage(message: IMessage, sender : IMessageSender = this) {
        this.receivers.forEach((receiver) => {
            receiver.receiveMessage(message, sender);
        });
    }

    addReceiver(receiver: IMessageReceiver): void {
        this.receivers.push(receiver);
    }

    removeReceiver(receiver: IMessageReceiver): void {
        this.receivers.splice(this.receivers.indexOf(receiver));
    }
}
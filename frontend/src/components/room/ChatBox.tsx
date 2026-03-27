import type { Message } from "../../types/Chat"
type ChatBoxProp={
    message:Message,
    isOwn:boolean
}
export default function ChatBox({message,isOwn}:ChatBoxProp) {
    return(
        <div className={isOwn?"self-end":"self-start"}>
            {message.text}
            <span>  :   </span>
            <span>{message.sender}</span>
        </div>
    )
};

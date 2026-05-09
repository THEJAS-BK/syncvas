type ChatBoxProp={
    message:string,
    isOwn:boolean
}
export default function ChatBox({message,isOwn}:ChatBoxProp) {
    return(
        <div className={isOwn?"self-end":"self-start"}>
            {message}
        </div>
    )
};
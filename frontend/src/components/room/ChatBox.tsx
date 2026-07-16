type ChatBoxProp={
    message:string,
    isOwn:boolean
}
export default function ChatBox({message,isOwn}:ChatBoxProp) {
    return(
        <div className={`px-4 py-2 rounded-lg ${isOwn ? "bg-blue-500 text-white self-end" : "bg-gray-700 text-white self-start"}`}>
            {message}
        </div>
    )
};
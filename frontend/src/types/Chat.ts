export type Message={
    text:string,
    sender:string,
}

export type RecieveMessage={
    roomId:string,
    userId:string,
    name:string,
    data:string,
    timeStamp:string
}
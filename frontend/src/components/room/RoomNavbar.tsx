interface RoomNavProp {
  setCursorDash: (value: boolean) => void;
  cursorDash: boolean;
  floatChatInterface:boolean;
  setFloatChatInterface: (value: boolean) => void;
}

export default function RoomNavbar({ setCursorDash, cursorDash,floatChatInterface,setFloatChatInterface }: RoomNavProp) {
  return (
    <>
      <div className="bg-blue-200 h-16 flex justify-between align-middle">
       <div>
         <h1>Room Navbar</h1>
        <span>Code : 453433</span>
       </div>

        <button onClick={() => setCursorDash(!cursorDash)}>
          open multiBoard
        </button>
         <div>
        <button onClick={()=>setFloatChatInterface(!floatChatInterface)}>Float</button>
      </div>
      </div>
     
    </>
  );
}


export default function RoomNavbar({setCursorDash,cursorDash}:{setCursorDash: (value:boolean)=>void,cursorDash:boolean}) {
    return(
        <div className="bg-blue-200 h-16">
            <h1>Room Navbar</h1>
            <span>Code : 453433</span>

            <button onClick={()=>setCursorDash(!cursorDash)}>open multiBoard</button>
        </div>
    )
};

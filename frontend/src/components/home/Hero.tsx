import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
//type
type CreateRoomResponse = {
  success: boolean;
  message?: string;
};
//hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//services
import { socket } from "../../services/socket";

//utils
import { generateRoomId } from "../../utils/RoomId";

export default function Hero() {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [roomId,setRoomId]=useState("")

  //invalid room id
  const [Toast,setToast]=useState({open:false,message:""});

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  const handleCreateRoom = () => {
    const tryCreate = () => {
      const roomId = generateRoomId();

      socket.emit("create-room", roomId, (res: CreateRoomResponse) => {
        if (!res.success) {
          tryCreate();
        }
        navigate(`/room/${roomId}`);
      });
    };
    tryCreate();
  };

  const handleOpenJoinRoom = () => {
    setShowConfirm(true);
  };
  const handleJoinRoom = (e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
   const roomCode=roomId;
   if(!roomCode){
    setToast({open:true,message:"Please enter a room code"});
    setRoomId("")
    return
   }

    socket.emit("join-room",roomCode,(res:CreateRoomResponse)=>{
      if(!res.success){
        setToast({open:true,message:"Room not found"});    
        setRoomId("") 
      }else{
         navigate(`/room/${roomCode}`);
      }
    })
  };

  return (
    <>
    {Toast&&(
      <div className="z-999 m-auto">
        {Toast.message}
      </div>
    )}
      {showConfirm && (
        <form onSubmit={handleJoinRoom} className="fixed inset-0 bg-black/30 backdrop-blur-sm  z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Enter Room code:</p>
            <input
            onChange={(e)=>setRoomId(e.target.value.toUpperCase())}
              type="text"
              value={roomId}
              placeholder="Room code"
              className="border border-gray-300 p-2 rounded-lg mt-2"
            />
            <Stack spacing={2} direction="row" className="mx-auto mt-4">
              <Button variant="outlined" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
              >
                Join Room
              </Button>
            </Stack>
          </div>
        </form>
      )}
      <div className="flex flex-col flex-1 items-center">
        <div className="flex flex-col mt-60 border-2 items-center p-4 rounded-lg">
          <div className="mx-auto text-center pb-7">
            <h2 className="text-4xl font-bold mb-5">
              Welcome to the Hero Section
            </h2>
            <Button variant="contained">Get whiteboard</Button>
          </div>
          <Stack spacing={2} direction="row" className="mx-auto">
            <Button variant="outlined" onClick={handleOpenJoinRoom}>
              join Room
            </Button>
            <p>Or</p>
            <Button
              onClick={handleCreateRoom}
              variant="contained"
              color="success"
            >
              create Room
            </Button>
          </Stack>
        </div>
      </div>
    </>
  );
}

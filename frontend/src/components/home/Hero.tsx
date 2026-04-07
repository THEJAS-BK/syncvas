import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../services/socket";
export default function Hero() {
  const navigate = useNavigate();
//   useEffect(() => {
//   if (!socket.connected) {
//     socket.connect();
//   }
// }, []);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleCreateRoom = () => {
    socket.emit("create_room",(roomId:string)=>{
      console.log("This is room id",roomId)
        navigate(`/room/${roomId}`)
    });
   
  };

  const handleOpenJoinRoom = () => {
    setShowConfirm(true);
  };
  const handleJoinRoom=()=>{
    const roomCode = (document.querySelector('input[placeholder="Room code"]') as HTMLInputElement)?.value;
    navigate(`/room/${roomCode}`)
  }
  return (
    <>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm  z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Enter Room code:</p>
            <input
              type="text"
              placeholder="Room code"
              className="border border-gray-300 p-2 rounded-lg mt-2"
            />
            <Stack spacing={2} direction="row" className="mx-auto mt-4">
              <Button variant="outlined" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleJoinRoom} variant="contained" color="success">
                Join Room
              </Button>
            </Stack>
          </div>
        </div>
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

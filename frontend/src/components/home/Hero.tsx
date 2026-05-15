import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
//type
type CreateRoomResponse = {
  success: boolean;
  message?: string;
};
//hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//services
import { socket } from "../../services/socket";

//utils
import { generateRoomId } from "../../utils/RoomId";

function connectSocket(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (socket.connected) return resolve();
    socket.connect();
    socket.once("connect", resolve);
    socket.once("connect_error", reject);
  });
}

export default function Hero() {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [roomId, setRoomId] = useState("");

  //invalid room id
  const [Toast, setToast] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    setLoading("connecting");
    try {
      await connectSocket();
      setLoading("creating room");
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
    } catch {
      setLoading(null);
      setToast({ open: true, message: "connection failed try again" });
    }
  };

  const handleOpenJoinRoom = () => {
    setShowConfirm(true);
  };
  const handleJoinRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roomCode = roomId;
    if (!roomCode) {
      setToast({ open: true, message: "Please enter a room code" });
      setRoomId("");
      return;
    }
    try {
      await connectSocket();
      setShowConfirm(false);
      setLoading("joining room");
      socket.emit("join-room", roomCode, (res: CreateRoomResponse) => {
        if (!res.success) {
          setLoading(null);
          setToast({ open: true, message: "Room not found" });
          setRoomId("");
        } else {
          navigate(`/room/${roomCode}`);
        }
      });
    } catch {
      setLoading(null);
      setToast({ open: true, message: "connection failed try again" });
    }
  };

  return (
    <>
      {Toast.open && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-99 cursor-pointer"
          onClick={() => setToast({ open: false, message: "" })}
        >
          {Toast.message}
        </div>
      )}
      {showConfirm && (
        <form
          onSubmit={handleJoinRoom}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm  z-50 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg">
            <p>Enter Room code:</p>
            <input
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              type="text"
              value={roomId}
              placeholder="Room code"
              className="border border-gray-300 p-2 rounded-lg mt-2"
            />
            <Stack spacing={2} direction="row" className="mx-auto mt-4">
              <Button variant="outlined" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="success">
                Join Room
              </Button>
            </Stack>
          </div>
        </form>
      )}

      {/* loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg font-medium">{loading}</p>
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

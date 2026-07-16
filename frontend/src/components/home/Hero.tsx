import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Footer from "./Footer";
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
import MyBoards from "./MyBoards";

function connectSocket(maxAttempts = 5): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    const tryConnect = () => {
      attempt++;

      const onConnect = () => {
        cleanup();
        resolve();
      };
      const onError = (err: Error) => {
        cleanup();
        if (attempt >= maxAttempts) {
          reject(err);
          return;
        }
        setTimeout(tryConnect, attempt * 1000);
      };
      const cleanup = () => {
        socket.off("connect", onConnect);
        socket.off("connect_error", onError);
      };

      socket.once("connect", onConnect);
      socket.once("connect_error", onError);

      if (!socket.connected) socket.connect();
    };

    if (socket.connected) {
      resolve();
      return;
    }

    tryConnect();
  });
}

export default function Hero() {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [roomId, setRoomId] = useState("");

  const [Toast, setToast] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState<string | null>(null);

  const handleCreateRoom = async () => {
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
      {showConfirm && (
        <form
          onSubmit={handleJoinRoom}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm  z-50 flex items-center justify-center"
        >
          <div className="bg-gray-950 p-6 rounded-lg">
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

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg font-medium">{loading}</p>
        </div>
      )}
      {Toast.open && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-99 cursor-pointer"
          onClick={() => setToast({ open: false, message: "" })}
        >
          {Toast.message}
        </div>
      )}
      <div className="h-screen overflow-y-auto bg-white">
        <div className="flex flex-col h-[80%] items-center justify-center text-center px-6 pt-40 pb-20 max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold tracking-tight text-[#101820] leading-[1.1]">
            Collaborate visually,
            <br />
            in real time
          </h1>
          <p className="text-lg text-gray-500 mt-5 max-w-lg">
            The easiest way for remote teams to brainstorm, design and plan
            together on a shared digital canvas.
          </p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleCreateRoom}
              className="bg-[#101820] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1c2733] transition-colors"
            >
              Create room
            </button>
            <button
              onClick={handleOpenJoinRoom}
              className="border border-gray-300 text-[#101820] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Join room
            </button>
          </div>
        </div>

        <MyBoards />
         <Footer/>
      </div>
    </>
  );
}

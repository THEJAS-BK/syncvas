import { useParams } from "react-router-dom";
import { socket } from "../../services/socket";

type BoardImage = {
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

interface RoomNavProp {
  setCursorDash: (value: boolean) => void;
  cursorDash: boolean;
  floatChatInterface: boolean;
  setFloatChatInterface: (value: boolean) => void;
  images: React.RefObject<BoardImage[]>;
    setRedrawVersion: React.Dispatch<React.SetStateAction<number>>;
}

export default function RoomNavbar({
  setCursorDash,
  cursorDash,
  images,
  floatChatInterface,
  setFloatChatInterface,
  setRedrawVersion,
}: RoomNavProp) {
  const { roomId } = useParams();
 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const base64 = reader.result as string;
    const id = crypto.randomUUID(); 

    const imageData = {
      id,          
      image: base64,
      x: 100,
      y: 100,
      width: 400,
      height: 300,
    };

    images.current?.push(imageData);
    setRedrawVersion((v) => v + 1);

    socket.emit("image-upload", { roomId, ...imageData }); 
  };

  reader.readAsDataURL(file);
};
  return (
    <>
      <div className="bg-blue-200 h-16 flex justify-between align-middle">
        <div>
          <h1>Room Navbar</h1>
          <span>Code : 453433</span>
        </div>

        <div>
          <button onClick={() => setCursorDash(!cursorDash)}>
            open multiBoard
          </button>

          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div>
          <button onClick={() => setFloatChatInterface(!floatChatInterface)}>
            Float
          </button>
        </div>
      </div>
    </>
  );
}

import { MicOff } from "lucide-react";
import { useEffect, useRef } from "react";

export default function VideoCard({
  stream,
  muted = false,
  isVideoMuted,
  isMicMuted,
  name,
  openCursor,
}: {
  stream: MediaStream;
  muted?: boolean;
  isVideoMuted?: boolean;
  isMicMuted?: boolean;
  name?: string;
  openCursor?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {

    console.log(stream)
    if (!ref.current || !stream) return;
    ref.current.srcObject = stream;

    ref.current
      .play()
      .then(() => {})
      .catch((err) => {
        console.error("video play failed:", err);
      });

    return () => {
      if (ref.current) {
        ref.current.srcObject = null;
      }
    };
  }, [stream]);

  const initial = (name?.trim()?.[0] ?? "z").toUpperCase();

  return (
    <div className="relative w-full h-[95%]">
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        className={`w-full h-[95%] object-cover rounded-lg ${
          isVideoMuted ? "invisible" : ""
        }`}
      />

      {isVideoMuted && (
        <div className="absolute inset-0 h-[95%] flex items-center justify-center rounded-lg bg-neutral-800">
          <span className="text-4xl font-semibold text-white">{initial}</span>
        </div>
      )}

      {isVideoMuted && (
        <div className="absolute top-1 left-1 flex items-center justify-center bg-black/60 rounded-full p-1.5">
          <MicOff size={15} className="text-white" />
          <p className="text-white text-sm ml-2">thejas</p>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef } from "react";

export default function VideoCard({
  stream,
  muted = false,
  isVideoMuted,
  openCursor
}: {
  stream: MediaStream;
  muted?: boolean;
  isVideoMuted?: boolean;
  openCursor?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current || !stream) return;
    ref.current.srcObject = stream;

    // play video
    ref.current
      .play()
      .then(() => {
      })
      .catch((err) => {
        console.error("video play failed:", err);
      });

    // cleanup
    return () => {
      if (ref.current) {
        ref.current.srcObject = null;
      }
    };
  }, [stream]);

  return (
     <video
      ref={ref}
      autoPlay
      playsInline
    />
  );
}
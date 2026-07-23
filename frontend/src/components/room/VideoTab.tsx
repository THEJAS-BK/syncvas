import { useWebRtcContext } from "../../context/WebRtcContext";
import VideoCard from "./VideoCard";
import OptionsFooter from "./OptionsFooter";
import { useEffect } from "react";

import { socket } from "../../services/socket";
interface VideoTabProps {
  roomId: string;
  localStream: React.MutableRefObject<MediaStream | null>;
  remoteStreams: { [socketId: string]: MediaStream };
  isReady: boolean;
  isVideoMuted: boolean;
  openCursor: boolean;
}
export default function VideoTab({
  roomId,
  localStream,
  remoteStreams,
  isReady,
  isVideoMuted,
  openCursor,
}: VideoTabProps) {

  const participantCount =
    (isReady && localStream.current ? 1 : 0) +
    Object.keys(remoteStreams).length;

  const { remoteVideoMuted, remoteAudioMuted, isAudioMuted, users, mySocketId } =
    useWebRtcContext();


  const getTileSize = (count: number) => {
    if (count <= 1) return "w-full h-[90%] max-w-4xl";
    if (count === 2)
      return "w-[calc(50%-0.25rem)] h-[90%] min-[1000px]:max-w-[520px]";
    if (count === 3)
      return "w-[calc(50%-0.25rem)] h-[calc(50%-0.25rem)] min-[1000px]:w-[calc(33.333%-0.34rem)] min-[1000px]:h-[90%] min-[1000px]:max-w-[440px]";
    if (count === 4)
      return "w-[calc(50%-0.25rem)] h-[calc(50%-0.25rem)] min-[1000px]:max-w-[440px]";
    return "w-[calc(33.333%-0.34rem)] h-[calc(50%-0.25rem)] min-[1000px]:max-w-[380px]";
  };
  return (
    <>
      {!openCursor && (
        <div
          className={`bg-zinc-900 flex flex-wrap h-full w-full  items-center justify-center content-center gap-2 `}
        >
          {isReady && localStream.current && (
            <div className={getTileSize(participantCount)}>
              <VideoCard
                stream={localStream.current}
                isVideoMuted={isVideoMuted}
                isAudioMuted={isAudioMuted}
                openCursor={openCursor}
                users={users[mySocketId??""]}

              />
            </div>
          )}
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <div key={id} className={getTileSize(participantCount)}>
              <VideoCard
                stream={stream}
                isVideoMuted={remoteVideoMuted[id] ?? false}
                isAudioMuted={remoteAudioMuted[id] ?? false}
                openCursor={openCursor}
                users={users[id]}
              />
            </div>
          ))}
        </div>
      )}

      {openCursor && (
        <div
          className={`p-2 flex flex-col flex-wrap h-full w-full  items-center justify-center content-center gap-2 `}
        >
          {isReady && localStream.current && (
            <div>
              <VideoCard
                stream={localStream.current}
                isVideoMuted={isVideoMuted}
                isAudioMuted={isAudioMuted}
                openCursor={openCursor}
                 users={users[mySocketId??""]}
              />
            </div>
          )}
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <div key={id}>
              <VideoCard
                stream={stream}
                isVideoMuted={remoteVideoMuted[id] ?? false}
                isAudioMuted={remoteAudioMuted[id] ?? false}
                openCursor={openCursor}
                users={users[id]}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

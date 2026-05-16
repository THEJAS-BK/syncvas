import { Mic, MicOff, Video, VideoOff } from "lucide-react";
export default function VideoOptions({audioToggle,videoToggle,isAudioMuted,isVideoMuted}:{audioToggle:()=>void,videoToggle:()=>void,isAudioMuted:boolean,isVideoMuted:boolean}) {
  return (
    <div className="flex justify-center gap-5">
      <div onClick={audioToggle} >
        {isAudioMuted?<MicOff />:<Mic />}
      </div>
      <div onClick={videoToggle}>
        {isVideoMuted?<VideoOff />:<Video />}
      </div>
    </div>
  );
}

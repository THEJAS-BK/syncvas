import VideoTab from "./VideoTab";
import VideoOptions from "./VideoOptions";

export default function MainContent({roomId}:{roomId:string}) {
  return (
    <div className=" w-[70%] flex flex-col">
      <VideoTab roomId={roomId} />
      <VideoOptions />
    </div>
  );
}

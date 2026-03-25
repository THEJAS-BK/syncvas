import VideoTab from "./VideoTab";
import VideoOptions from "./VideoOptions";
export default function MainContent() {
  return (
    <div className=" w-[70%] flex flex-col">
      <VideoTab />
      <VideoOptions />
    </div>
  );
}

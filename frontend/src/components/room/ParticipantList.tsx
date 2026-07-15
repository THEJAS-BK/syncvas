import { Mic, MicOff } from "lucide-react";

export default function ParticipantList({roomId}:{roomId:string|null    }) {
  const participants = [
    { id: "you", name: "You", muted: false, isLocal: true },
    { id: "abc123", name: "User abc123", muted: false, isLocal: false },
    { id: "def456", name: "User def456", muted: true, isLocal: false },
  ];

  return (
    <div   onClick={(e) => e.stopPropagation()} className="absolute bottom-full left-0 mb-2 flex flex-col h-[400px] w-[280px] bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-700 text-sm font-medium text-white">
        Participants ({participants.length})
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800"
          >
            <span className="text-sm text-white truncate">
              {p.name} {p.isLocal && <span className="text-zinc-500">(you)</span>}
            </span>
            {p.muted ? (
              <MicOff size={16} className="text-zinc-400" />
            ) : (
              <Mic size={16} className="text-green-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
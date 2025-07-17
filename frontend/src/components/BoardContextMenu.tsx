// TODO: IMPLEMENT THIS FOR SIDEBAR
import { Trash } from "lucide-react";

export const BoardContextMenu = () => {
  return (
    <div className="absolute bg-background border-[1px] border-border px-3 py-2 rounded-md">
      <button className="flex gap-3 items-center">
        <Trash size={18} className="text-red-400" />
        Delete
      </button>
    </div>
  );
};

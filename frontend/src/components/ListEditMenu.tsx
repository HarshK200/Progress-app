import { useSetLists } from "@/store";
import { main } from "@wailsjs/go/models";
import { Trash } from "lucide-react";

interface ListEditMenuProps {
  list: main.List;
}
export const ListEditMenu = ({ list }: ListEditMenuProps) => {
  const setLists = useSetLists();

  function handleDelete() {
    setLists((prev) => {
      if (!prev) return undefined;
    });
  }

  return (
    <div className="z-10 absolute left-10 bg-background border-[1px] border-border rounded-md px-3 py-2 w-[150px]">
      <button
        className="flex items-center gap-2 text-red-400"
        onClick={handleDelete}
      >
        <Trash size={18} />
        <span>Delete</span>
      </button>
    </div>
  );
};

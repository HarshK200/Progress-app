import { useBoard, useSetLists } from "@/store";
import { main } from "@wailsjs/go/models";
import { Trash } from "lucide-react";

interface ListEditMenuProps {
  list: main.List;
}
export const ListEditMenu = ({ list }: ListEditMenuProps) => {
  const [board, setBoard] = useBoard(list.board_id);
  const setLists = useSetLists();

  function handleDelete() {
    setLists((prev) => {
      if (!prev) return undefined;

      const updatedLists = { ...prev };

      // updated prev list
      if (list.prev_list_id)
        updatedLists[list.prev_list_id] = {
          ...updatedLists[list.prev_list_id],
          next_list_id: list.next_list_id,
        };

      // updated next list
      if (list.next_list_id)
        updatedLists[list.next_list_id] = {
          ...updatedLists[list.next_list_id],
          prev_list_id: list.prev_list_id,
        };

      // delete the list
      delete updatedLists[list.id];

      // NOTE: remove from the board list_ids
      setBoard({
        ...board!,
        list_ids: board!.list_ids.filter((id) => id !== list.id),
      });

      return updatedLists;
    });
  }

  return (
    <div className="z-10 absolute -right-36 bg-background border-[1px] border-border rounded-md px-3 py-2 w-[150px]">
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

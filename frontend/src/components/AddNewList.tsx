import { useBoard, useSetLists } from "@/store";
import { main } from "@wailsjs/go/models";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export const AddNewList = ({ board_id }: { board_id: string }) => {
  const setLists = useSetLists();
  const [board, setBoard] = useBoard(board_id);

  function addNewList() {
    if (!board) return;

    const NewListData: main.List = {
      id: uuidv4(),
      title: "New List",
      card_ids: [],
      board_id: board_id,
      classname: "",
    };

    setLists((prev) => {
      if (!prev) return undefined;

      return { ...prev, [NewListData.id]: NewListData };
    });
    setBoard({ ...board, list_ids: [...board.list_ids, NewListData.id] });
  }

  return (
    <div
      className="flex items-center min-w-[254px] h-[48px] px-3 gap-2 cursor-pointer rounded-md bg-background-secondary hover:bg-background-secondary/50 transition-all"
      onClick={addNewList}
    >
      <Plus />
      <span className="text-nowrap">New List</span>
    </div>
  );
};

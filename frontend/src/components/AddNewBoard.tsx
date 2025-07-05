import { useSetBoards } from "@/store";
import { main } from "@wailsjs/go/models";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export const AddNewBoard = () => {
  const setBoards = useSetBoards();

  function addNewBoard() {
    const NewBoardData: main.Board = {
      id: uuidv4(),
      name: "New Board",
      list_ids: [],
    };

    setBoards((prev) => ({ ...prev, [NewBoardData.id]: NewBoardData }));
  }

  return (
    <Plus
      size={20}
      onClick={addNewBoard}
      className="absolute top-0.5 right-0.5 cursor-pointer hover:bg-background-secondary rounded-md m-1"
    />
  );
};

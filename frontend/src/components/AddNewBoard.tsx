import {
  UserAction,
  useSetBoards,
  useSetRedoActions,
  useSetUndoActions,
} from "@/store";
import { main } from "@wailsjs/go/models";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export const AddNewBoard = () => {
  const setBoards = useSetBoards();
  const setUndoActions = useSetUndoActions();
  const setRedoActions = useSetRedoActions();

  function addNewBoard(opts: {
    isRedo: boolean;
    generatedBoardId: string | null;
  }) {
    const newBoardData: main.Board = {
      id:
        opts.isRedo && opts.generatedBoardId ? opts.generatedBoardId : uuidv4(),
      name: "New Board",
      list_ids: [],
    };

    setBoards((prev) => ({ ...prev, [newBoardData.id]: newBoardData }));

    // =========================== Undo-Redo stuff ===========================

    // NOTE: if redo call return here
    if (opts.isRedo) return;

    // NOTE: push the action to undo-stack
    setUndoActions((prev) => {
      const updatedUndoActions = [...prev];

      const newUndoAction: UserAction = {
        type: "board-add-new",
        undoFunc: () => {
          // NOTE: remove the board from the boards map
          setBoards((prev) => {
            if (!prev) return undefined;
            const updatedBoards = { ...prev };

            // delete the newly created board
            delete updatedBoards[newBoardData.id];

            return updatedBoards;
          });
        },
        redoFunc: () => {
          addNewBoard({ isRedo: true, generatedBoardId: newBoardData.id });
        },
      };

      updatedUndoActions.push(newUndoAction);

      return updatedUndoActions;
    });

    // NOTE: flush the redo-stack
    setRedoActions([]);
  }

  return (
    <Plus
      size={20}
      onClick={() => addNewBoard({ isRedo: false, generatedBoardId: null })}
      className="absolute top-0.5 right-0.5 cursor-pointer hover:bg-background-secondary rounded-md m-1"
    />
  );
};

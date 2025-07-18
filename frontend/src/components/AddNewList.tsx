import {
  UserAction,
  useSetBoards,
  useSetLists,
  useSetRedoActions,
  useSetUndoActions,
} from "@/store";
import { main } from "@wailsjs/go/models";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export const AddNewList = ({
  board_id,
  prev_list_id,
}: {
  board_id: string;
  prev_list_id: string;
}) => {
  const setLists = useSetLists();
  const setBoards = useSetBoards();
  const setUndoActions = useSetUndoActions();
  const setRedoActions = useSetRedoActions();

  function addNewList(opts: {
    isRedo: boolean;
    generatedListId: string | undefined;
  }) {
    const newListData: main.List = {
      id: opts.isRedo && opts.generatedListId ? opts.generatedListId : uuidv4(),
      title: "New List",
      card_ids: [],
      board_id: board_id,
      classname: "",
      prev_list_id: prev_list_id,
      next_list_id: undefined,
    };

    // Add new list to list map
    setLists((prev) => {
      if (!prev) return undefined;

      return {
        ...prev,
        [prev_list_id]: { ...prev[prev_list_id], next_list_id: newListData.id },
        [newListData.id]: newListData,
      };
    });

    // add new list's id to the board it belongs to
    setBoards((prev) => {
      const updatedBoards = { ...prev };

      updatedBoards[board_id] = {
        ...updatedBoards[board_id],
        list_ids: [...updatedBoards[board_id].list_ids, newListData.id],
      };

      return updatedBoards;
    });

    // NOTE: return here if this is a redo call
    if (opts.isRedo) return;

    // NOTE: push this action to undo history
    setUndoActions((prev) => {
      const updatedUndoActions = [...prev];

      const newUndoAction: UserAction = {
        type: "list-add-new",
        undoFunc: () => {
          // NOTE: remove the list from list map
          setLists((prev) => {
            if (!prev) return;

            const updatedLists = { ...prev };
            updatedLists[prev_list_id] = {
              ...updatedLists[prev_list_id],
              next_list_id: undefined,
            };
            delete updatedLists[newListData.id];

            return updatedLists;
          });

          // NOTE: update the list's id board accordingly
          setBoards((prev) => {
            if (!prev) return;
            const updatedBoards = { ...prev };

            updatedBoards[board_id] = {
              ...updatedBoards[board_id],
              list_ids: [...updatedBoards[board_id].list_ids].filter(
                (list_id) => list_id !== newListData.id,
              ),
            };

            return updatedBoards;
          });
        },
        redoFunc: () => {
          addNewList({ isRedo: true, generatedListId: newListData.id });
        },
      };

      updatedUndoActions.push(newUndoAction);

      return updatedUndoActions;
    });

    // NOTE: flush the redo actions stack
    setRedoActions([]);
  }

  return (
    <div
      className="flex items-center min-w-[254px] h-[48px] px-3 gap-2 cursor-pointer rounded-md bg-background-secondary hover:bg-background-secondary/50 transition-all"
      onClick={() => addNewList({ isRedo: false, generatedListId: undefined })}
    >
      <Plus />
      <span className="text-nowrap">New List</span>
    </div>
  );
};

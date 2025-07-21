import {
  useBoard,
  UserAction,
  useSetLists,
  useSetRedoActions,
  useSetUndoActions,
} from "@/store";
import { main } from "@wailsjs/go/models";
import { Trash } from "lucide-react";

interface ListEditMenuProps {
  list: main.List;
}
export const ListEditMenu = ({ list }: ListEditMenuProps) => {
  const [board, setBoard] = useBoard(list.board_id);
  const setLists = useSetLists();
  const setUndoActions = useSetUndoActions();
  const setRedoActions = useSetRedoActions();

  function handleDelete(opts: { isRedo: boolean }) {
    setLists((prev) => {
      if (!prev) return undefined;
      const updatedLists = { ...prev };

      // NOTE: update prev list
      if (list.prev_list_id)
        updatedLists[list.prev_list_id] = {
          ...updatedLists[list.prev_list_id],
          next_list_id: list.next_list_id,
        };

      // NOTE: update next list
      if (list.next_list_id)
        updatedLists[list.next_list_id] = {
          ...updatedLists[list.next_list_id],
          prev_list_id: list.prev_list_id,
        };

      // NOTE: delete the list from lists map
      delete updatedLists[list.id];

      // NOTE: remove list's id from the board's list_ids
      setBoard({
        ...board!,
        list_ids: board!.list_ids.filter((id) => id !== list.id),
      });

      return updatedLists;
    });

    // =========================== Undo-Redo stuff ===========================
    if (opts.isRedo) return;

    // NOTE: push new userAction to undo stack
    setUndoActions((prev) => {
      const updatedUndoActions = [...prev];
      const newUserAction: UserAction = {
        type: "list-delete",

        // undo
        undoFunc: () => {
          setLists((prev) => {
            if (!prev) return;
            const updatedLists = { ...prev };

            // update prev list
            if (list.prev_list_id)
              updatedLists[list.prev_list_id] = {
                ...updatedLists[list.prev_list_id],
                next_list_id: list.id,
              };

            // update next list
            if (list.next_list_id)
              updatedLists[list.next_list_id] = {
                ...updatedLists[list.next_list_id],
                prev_list_id: list.id,
              };

            // add the list to lists map
            updatedLists[list.id] = list;

            return updatedLists;
          });

          // add list's id to the board's list_ids
          if (!board) return;
          setBoard({ ...board, list_ids: [...board.list_ids, list.id] });
        },

        // redo
        redoFunc: () => {
          handleDelete({ isRedo: true });
        },
      };

      updatedUndoActions.push(newUserAction);

      return updatedUndoActions;
    });

    // NOTE: flush the redo stack
    setRedoActions([]);
  }

  return (
    <div className="z-10 absolute -right-36 bg-background border-[1px] border-border rounded-md px-3 py-2 w-[150px]">
      <button
        className="flex items-center gap-2 text-red-400"
        onClick={() => handleDelete({ isRedo: false })}
      >
        <Trash size={18} />
        <span>Delete</span>
      </button>
    </div>
  );
};

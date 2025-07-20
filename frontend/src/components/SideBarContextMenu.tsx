import { cn } from "@/lib/utils";
import {
  useContextMenuDataValue,
  UserAction,
  useSetBoardLastOpenId,
  useSetBoards,
  useSetRedoActions,
  useSetUndoActions,
} from "@/store";
import { useEditingBoardIdAtom } from "@/store";

interface SidebarContextMenuProps {
  className?: string;
  style?: React.CSSProperties;
}
export const SidebarContextMenu = ({
  className,
  style,
}: SidebarContextMenuProps) => {
  const contextMenuData = useContextMenuDataValue();
  const setBoards = useSetBoards();
  const setBoardOpenId = useSetBoardLastOpenId();
  const [, setEditingBoardId] = useEditingBoardIdAtom();
  const setUndoActions = useSetUndoActions();
  const setRedoActions = useSetRedoActions();

  function handleRename() {
    setEditingBoardId(contextMenuData.board?.id ?? null);
  }

  function handleDelete(opts: { isRedo: boolean }) {
    // NOTE: delete the board for the boards map
    setBoards((prev) => {
      const updatedBoards = { ...prev };
      if (!contextMenuData.board) return updatedBoards;

      delete updatedBoards[contextMenuData.board.id];

      return updatedBoards;
    });

    // NOTE: update the currently open board state to empty
    setBoardOpenId("");

    if (opts.isRedo) return;

    // =========================== Undo-Redo stuff ===========================
    if (!contextMenuData.board) return;

    // NOTE: push the user action to the undo stack
    setUndoActions((prev) => {
      const updatedUndoActions = [...prev];
      if (!contextMenuData.board) return updatedUndoActions;

      const newUndoAction: UserAction = {
        type: "board-delete",
        undoFunc: () => {
          // NOTE: re-add the board to the board map
          setBoards((prev) => {
            if (!contextMenuData.board) return prev;
            return {
              ...prev,
              [contextMenuData.board.id]: contextMenuData.board,
            };
          });
        },
        redoFunc: () => {
          handleDelete({ isRedo: true });
        },
      };

      // push the new UserAction to the undo stack
      updatedUndoActions.push(newUndoAction);

      return updatedUndoActions;
    });

    // NOTE: flush the redo stack
    setRedoActions([]);
  }

  return (
    <div
      className={cn(
        "z-10 rounded-sm absolute bg-background-secondary border border-border",
        className,
      )}
      style={style}
    >
      <ul>
        <li className="px-6 py-1">
          <span
            className="cursor-pointer hover:opacity-70"
            onClick={handleRename}
          >
            Rename
          </span>
        </li>

        <li className="px-6 py-1 border-t border-t-border">
          <span
            className="cursor-pointer hover:opacity-70"
            onClick={() => handleDelete({ isRedo: false })}
          >
            Delete
          </span>
        </li>
      </ul>
    </div>
  );
};

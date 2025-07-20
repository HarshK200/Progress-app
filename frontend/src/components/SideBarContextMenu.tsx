import { cn } from "@/lib/utils";
import {
  useContextMenuDataValue,
  useSetBoardLastOpenId,
  useSetBoards,
} from "@/store";
import { useEditingBoardIdAtom } from "@/store/atoms/EditingBoardNameState";

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

  function handleRename() {
    setEditingBoardId(contextMenuData.board_id);
  }

  function handleDelete() {
    // NOTE: delete the board for the boards map
    setBoards((boards) => {
      const updatedBoards = { ...boards };
      if (!contextMenuData.board_id) return updatedBoards;

      delete updatedBoards[contextMenuData.board_id];

      return updatedBoards;
    });

    // NOTE: update the currently open board state to empty
    setBoardOpenId("");
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
            onClick={handleDelete}
          >
            Delete
          </span>
        </li>
      </ul>
    </div>
  );
};

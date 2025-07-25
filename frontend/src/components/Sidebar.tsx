import {
  useBoardLastOpenId,
  useBoardsValue,
  useContextMenuDataValue,
  UserAction,
  useSetBoards,
  useSetContextMenuData,
  useSetRedoActions,
  useSetUndoActions,
  useSidebarOpen,
  useTransitionAtom,
} from "@/store";
import { ChevronDown, ChevronUp, PanelLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { main } from "@wailsjs/go/models";
import { cn } from "@/lib/utils";
import { AddNewBoard } from "./AddNewBoard";
import { SidebarContextMenu } from "./SideBarContextMenu";
import { useEditingBoardIdAtom } from "@/store";
import invariant from "tiny-invariant";
import { SidebarSkeleton } from "./loading-skeleton/SidebarSkeleton";

const Sidebar = () => {
  const [sidebarOpen, setSideBarOpen] = useSidebarOpen();
  const [transitionEnabled] = useTransitionAtom();
  const boards = useBoardsValue();
  const contextMenuData = useContextMenuDataValue();

  // Sidebar Skeleton UI
  if (!boards) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="min-h-screen flex select-none">
      {/* NOTE: Toggle options */}
      <div className="bg-background z-10 min-h-screen w-min border-r-[1px] border-r-border px-3 py-3">
        <PanelLeft
          size={22}
          className="cursor-pointer"
          onClick={() => setSideBarOpen((prev) => !prev)}
        />
      </div>

      {/* NOTE: Re-tractable sidebar */}
      <aside
        className={`overflow-y-auto bg-background h-[100vh] p-3 flex flex-1 border-r-[1px] border-r-border ${transitionEnabled ? "transition-all" : ""} ${sidebarOpen ? "w-64 opacity-100" : "px-0 m-0 w-0 translate-x-[-200px] opacity-0"} scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent`}
      >
        {/* Boards Group */}
        <SidebarGroup name="Boards" classname="relative">
          {Object.values(boards).map((board) => (
            <SidebarBoardGroupItem key={board.id} board={board} />
          ))}
          <AddNewBoard />
        </SidebarGroup>
      </aside>

      {/* NOTE: Right-click Context Menu */}
      {contextMenuData.isOpen ? (
        <SidebarContextMenu
          style={{
            left: contextMenuData.pos?.clientX,
            top: contextMenuData.pos?.clientY,
          }}
        />
      ) : null}
    </div>
  );
};

interface SidebarGroupProps {
  name: string;
  classname?: string;
  children?: React.ReactNode;
  fakeHover?: boolean;
}
export const SidebarGroup = ({
  name,
  children,
  classname,
  fakeHover,
}: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={cn("w-full h-fit", classname)}>
      {/* Group-name */}
      <div
        className={`flex items-center gap-2 py-1 px-1 cursor-pointer hover:bg-background-secondary ${fakeHover && "bg-background-secondary"} rounded-md`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        <h1>{name}</h1>
      </div>

      {/* Group Childrens */}
      <ul
        className={`mx-3 flex flex-col gap-1 border-l-[1px] border-l-border ${!isOpen ? "hidden" : ""}`}
      >
        {children}
      </ul>
    </div>
  );
};

interface SidebarBoardGroupItemProps {
  board: main.Board;
}
const SidebarBoardGroupItem = ({ board }: SidebarBoardGroupItemProps) => {
  const [boardOpenId, setBoardOpenId] = useBoardLastOpenId();
  const [inputValue, setInputValue] = useState(board.name);
  const [editingBoardId, setEditingBoardId] = useEditingBoardIdAtom();
  const isCurrentBoardOpen = board.id === boardOpenId;
  const setContextMenuData = useSetContextMenuData();
  const setBoards = useSetBoards();
  const ref = useRef<HTMLInputElement | null>(null);
  const isEnterPressed = useRef<boolean>(false);

  const setUndoActions = useSetUndoActions();
  const setRedoActions = useSetRedoActions();

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    if (editingBoardId === board.id) {
      element.select();
    }
  }, [editingBoardId]);

  function handleOnClick() {
    setBoardOpenId(board.id);
  }

  function handleContextMenu(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();

    setContextMenuData({
      isOpen: true,
      pos: { clientX: e.clientX, clientY: e.clientY },
      board: board,
    });
  }

  function handleOnEscape() {
    // set the editingBoardName to null
    setEditingBoardId(null);

    // reset the input value to the first
    setInputValue(board.name);
  }

  function handleOnEnter() {
    // set the editingBoardName to null
    setEditingBoardId(null);
    // ignore if the update value is same as the prev
    if (inputValue === board.name) return;

    // update the boards state
    setBoards((prev) => {
      if (!prev) return;

      return {
        ...prev,
        [board.id]: { ...prev[board.id], name: inputValue },
      };
    });

    // NOTE: push new user action to undo stack
    setUndoActions((prev) => {
      const updatedUndoActions = [...prev];
      const newUserAction: UserAction = {
        type: "board-rename",

        // undo
        undoFunc: () => {
          // reset the boards map back to original
          setBoards((prev) => {
            if (!prev) return;
            const updatedBoards = { ...prev };
            updatedBoards[board.id] = {
              ...updatedBoards[board.id],
              name: board.name,
            };

            return updatedBoards;
          });

          // reset the inputValue back to original as well
          setInputValue(board.name);
        },

        // redo
        redoFunc: () => {
          // update the board state back to last change
          setBoards((prev) => {
            if (!prev) return;

            return {
              ...prev,
              [board.id]: { ...prev[board.id], name: inputValue },
            };
          });

          // reset the inputValue state back to last change
          setInputValue(inputValue);
        },
      };

      updatedUndoActions.push(newUserAction);

      return updatedUndoActions;
    });

    // NOTE: flush the redo stack
    setRedoActions([]);

    isEnterPressed.current = false;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // NOTE: reset the inputValue when escape pressed
    if (e.key.toLowerCase() === "escape") {
      // de-select the board name
      ref.current?.setSelectionRange(0, 0);
      ref.current?.blur();

      handleOnEscape();
    }

    if (e.key.toLowerCase() === "enter") {
      isEnterPressed.current = true;

      // de-select the board name
      ref.current?.setSelectionRange(0, 0);
      ref.current?.blur();

      handleOnEnter();
    }
  }

  function handleBlur() {
    if (!isEnterPressed.current) {
      setEditingBoardId(null);
      handleOnEnter();
    }
  }

  return (
    <input
      className={`outline-none relative mx-2 my-0.5 px-4 py-1 bg-background ${isCurrentBoardOpen ? "bg-background-secondary" : ""} hover:bg-background-secondary rounded-md cursor-pointer`}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onClick={handleOnClick}
      onDoubleClick={() => {
        setEditingBoardId(board.id);
      }}
      onContextMenu={handleContextMenu}
      readOnly={!(editingBoardId === board.id)}
      onKeyDown={handleKeyDown}
      ref={ref}
      onBlur={handleBlur}
    />
  );
};

export default Sidebar;

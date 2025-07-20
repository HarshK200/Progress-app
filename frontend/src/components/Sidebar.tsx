import {
  useBoardLastOpenId,
  useBoardsValue,
  useContextMenuDataValue,
  useSetBoards,
  useSetContextMenuData,
  useSidebarOpen,
  useTransitionAtom,
} from "@/store";
import { ChevronDown, ChevronUp, PanelLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { main } from "@wailsjs/go/models";
import { cn } from "@/lib/utils";
import { AddNewBoard } from "./AddNewBoard";
import { SidebarContextMenu } from "./SideBarContextMenu";
import { useEditingBoardIdAtom } from "@/store/atoms/EditingBoardNameState";
import invariant from "tiny-invariant";

const Sidebar = () => {
  const [sidebarOpen, setSideBarOpen] = useSidebarOpen();
  const [transitionEnabled] = useTransitionAtom();
  const boards = useBoardsValue();
  const contextMenuData = useContextMenuDataValue();

  if (!boards) {
    return (
      <div className="min-h-screen min-w-[303px] flex animate-pulse border-r-[1px] border-r-border">
        <div className="bg-background z-10 min-h-screen w-min border-r-[1px] border-r-border px-3 py-3">
          <PanelLeft size={22} className="cursor-pointer" />
        </div>
        <div className="flex h-fit w-full select-none bg-background py-3 px-2">
          <SidebarGroup name="" classname="animate-pulse" fakeHover>
            <div className="mx-2 mt-4 my-2 px-4 py-1 bg-background-secondary rounded-md"></div>
            <div className="mx-2 my-2 px-4 py-1 bg-background-secondary rounded-md"></div>
            <div className="mx-2 my-2 px-4 py-1 bg-background-secondary rounded-md"></div>
          </SidebarGroup>
        </div>
      </div>
    );
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
const SidebarGroup = ({
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
      board_id: board.id,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // NOTE: reset the inputValue when escape pressed
    if (e.key.toLowerCase() === "escape") {
      // set the editingBoardName to null
      setEditingBoardId(null);

      // reset the input value to the first
      setInputValue(board.name);
    }

    if (e.key.toLowerCase() === "enter") {
      // set the editingBoardName to null
      setEditingBoardId(null);

      // update the boards state
      setBoards((prev) => {
        if (!prev) return;
        const updatedBoards = { ...prev };
        updatedBoards[board.id] = {
          ...updatedBoards[board.id],
          name: inputValue,
        };

        return updatedBoards;
      });
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
    />
  );
};

export default Sidebar;

import {
  useBoardOpenId,
  useBoardsValue,
  useSidebarAtom,
  useTransitionAtom,
} from "@/store";
import { ChevronDown, ChevronUp, PanelLeft } from "lucide-react";
import { useState } from "react";
import { main } from "@wailsjs/go/models";
import { cn } from "@/lib/utils";
import { AddNewBoard } from "./AddNewBoard";
import { BoardContextMenu } from "./BoardContextMenu";

const Sidebar = () => {
  const [sidebarOpen, setSideBarOpen] = useSidebarAtom();
  const [transitionEnabled] = useTransitionAtom();
  const boards = useBoardsValue();

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
      {/* Toggle options */}
      <div className="bg-background z-10 min-h-screen w-min border-r-[1px] border-r-border px-3 py-3">
        <PanelLeft
          size={22}
          className="cursor-pointer"
          onClick={() => setSideBarOpen((prev) => !prev)}
        />
      </div>

      {/* Re-tractable sidebar */}
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
  const [boardOpenId, setBoardOpenId] = useBoardOpenId();
  const isCurrentBoardOpen = board.id === boardOpenId;

  function handleOnClick() {
    setBoardOpenId(board.id);
  }
  function handleContextMenu(e: React.MouseEvent<HTMLLIElement>) {
    e.preventDefault();
    alert("Implement edit(context) menu");
  }

  return (
    <li
      className={`relative mx-2 my-0.5 px-4 py-1 ${isCurrentBoardOpen ? "bg-background-secondary" : ""} hover:bg-background-secondary rounded-md cursor-pointer`}
      onClick={handleOnClick}
      onContextMenu={handleContextMenu}
    >
      {board.name}
    </li>
  );
};

export default Sidebar;

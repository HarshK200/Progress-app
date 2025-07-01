import {
  useBoardOpenId,
  useBoardsValue,
  useSidebarAtom,
  useTransitionAtom,
} from "@/store";
import { ChevronDown, ChevronUp, PanelLeft } from "lucide-react";
import { useState } from "react";
import { main } from "@wailsjs/go/models";

export default function Sidebar() {
  const [sidebarOpen, setSideBarOpen] = useSidebarAtom();
  const [transitionEnabled] = useTransitionAtom();
  const boards = useBoardsValue();

  if (!boards) {
    // TODO: make skeletal UI Component
    return <div>"loading"</div>;
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
        className={`bg-background h-full p-3 flex flex-1 border-r-[1px] border-r-border ${transitionEnabled ? "transition-all" : ""} ${sidebarOpen ? "w-64 opacity-100" : "px-0 m-0 w-0 translate-x-[-200px] opacity-0"}`}
      >
        {/* NOTE: Baords-Group */}
        <SidebarGroup name="Boards">
          {Object.values(boards).map((board) => (
            <SidebarBoardGroupItem key={board.id} board={board} />
          ))}
        </SidebarGroup>
      </aside>
    </div>
  );
}

interface SidebarGroupProps {
  name: string;
  children?: React.ReactNode;
}
function SidebarGroup({ name, children }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full">
      {/* Group-name */}
      <div
        className="flex items-center gap-2 py-1 px-1 cursor-pointer hover:bg-background-secondary rounded-md"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        <h1>{name}</h1>
      </div>

      {/* Board Childrens */}
      <ul
        className={`mx-3 flex flex-col gap-1 border-l-[1px] border-l-border ${!isOpen ? "hidden" : ""}`}
      >
        {children}
      </ul>
    </div>
  );
}

interface SidebarBoardGroupItemProps {
  board: main.Board;
}
// TODO: turn these into buttons that on click changes boardOpenStateAtom
function SidebarBoardGroupItem({ board }: SidebarBoardGroupItemProps) {
  const [boardOpenId, setBoardOpenId] = useBoardOpenId();
  const isCurrentBoardOpen = board.id === boardOpenId;

  function handleOnClick() {
    setBoardOpenId(board.id);
  }

  return (
    <li
      className={`mx-2 my-0.5 px-4 py-1 ${isCurrentBoardOpen ? "bg-background-secondary" : ""} hover:bg-background-secondary rounded-md cursor-pointer`}
      onClick={handleOnClick}
    >
      {board.name}
    </li>
  );
}

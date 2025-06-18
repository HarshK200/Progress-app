import { sidebarAtom, transitionAtom } from "@/store";
import { useAtom, useAtomValue } from "jotai";
import { ChevronDown, ChevronUp, PanelLeft } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [sidebarOpen, setSideBarOpen] = useAtom(sidebarAtom);
  const transitionEnabled = useAtomValue(transitionAtom);

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
        <SidebarGroup name="Boards" />
      </aside>
    </div>
  );
}

function SidebarGroup({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full">
      <div
        className="flex items-center gap-2 py-1 px-1 cursor-pointer hover:bg-background-secondary rounded-md"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        <h1>{name}</h1>
      </div>
      <ul
        className={`mx-3 flex flex-col gap-1 border-l-[1px] border-l-border ${!isOpen ? "hidden" : ""}`}
      >
        <SidebarGroupItem name="Board 1" />
      </ul>
    </div>
  );
}

// TODO: turn these into links that on click changes routes (use react router)
function SidebarGroupItem({ name }: { name: string }) {
  return (
    <li className="mx-2 px-4 hover:bg-background-secondary rounded-md">
      {name}
    </li>
  );
}

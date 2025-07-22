import { PanelLeft } from "lucide-react";
import { SidebarGroup } from "@/components/Sidebar";

export const SidebarSkeleton = () => {
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
};

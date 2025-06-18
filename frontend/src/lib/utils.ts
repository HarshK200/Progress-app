import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSetAtom } from "jotai";
import { sidebarAtom } from "@/store";
import { useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mountUnmoutKeybinds() {
  // getting all states
  const setSideBarOpen = useSetAtom(sidebarAtom);

  // binding keyboard shortcuts --- TODO: load these from file
  function handleKeyDown(e: KeyboardEvent) {
    // toggle sidebar with Ctrl + n
    if (e.ctrlKey && e.key == "n") {
      setSideBarOpen((prev) => !prev);
    }
  }
  function bindKeymaps() {
    window.addEventListener("keydown", handleKeyDown);
  }

  // unbinding for cleanup
  function unbindKeymaps() {
    window.removeEventListener("keydown", handleKeyDown);
  }

  useEffect(() => {
    bindKeymaps();

    return () => unbindKeymaps();
  }, []);
}

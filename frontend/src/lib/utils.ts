import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSetAtom } from "jotai";
import { sidebarAtom } from "@/store";
import { useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useMountUnmountKeybinds() {
  const keybindController = new AbortController();
  const setSideBarOpen = useSetAtom(sidebarAtom);

  // Keymaps ---  TODO: load these from file
  function handleKeyDown(e: KeyboardEvent) {
    // toggle sidebar
    if (e.ctrlKey && e.key == "n") {
      setSideBarOpen((prev) => !prev);
    }
  }

  function bindKeymaps() {
    window.addEventListener("keydown", handleKeyDown, {
      signal: keybindController.signal,
    });
  }
  function unbindKeymaps() {
    return keybindController.abort();
  }

  useEffect(() => {
    bindKeymaps();

    return unbindKeymaps();
  }, []);
}

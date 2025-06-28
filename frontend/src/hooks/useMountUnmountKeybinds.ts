import { sidebarAtom } from "@/store";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

export function useMountUnmountKeybinds() {
  const keybindController = useRef<AbortController | null>(null);
  const setSideBarOpen = useSetAtom(sidebarAtom);

  // Keymaps ---  TODO: load these from file
  function handleKeyDown(e: KeyboardEvent) {
    // toggle sidebar
    if (e.ctrlKey && e.key == "n") {
      setSideBarOpen((prev) => !prev);
    }
  }

  useEffect(() => {
    keybindController.current = new AbortController();

    // NOTE: Bind Keymaps
    window.addEventListener("keydown", handleKeyDown, {
      signal: keybindController.current.signal,
    });

    return () => keybindController.current?.abort();
  }, []);
}

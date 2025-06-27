import { sidebarAtom } from "@/store";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

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

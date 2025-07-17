import {
  sidebarAtom,
  useBoardsValue,
  useListCardsValue,
  useListsValue,
} from "@/store";
import { WriteUserData } from "@wailsjs/go/main/App";
import { main } from "@wailsjs/go/models";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export function useMountUnmountKeybinds() {
  const keybindController = useRef<AbortController | null>(null);
  const setSideBarOpen = useSetAtom(sidebarAtom);

  const boards = useBoardsValue();
  const lists = useListsValue();
  const list_cards = useListCardsValue();

  // Keymaps ---  TODO: load these from file
  function handleKeyDown(e: KeyboardEvent) {
    // NOTE: toggle sidebar
    if (e.ctrlKey && e.key == "n") {
      setSideBarOpen((prev) => !prev);
    }
  }

  // NOTE: Bind Keymaps
  useEffect(() => {
    keybindController.current = new AbortController();

    window.addEventListener("keydown", handleKeyDown, {
      signal: keybindController.current.signal,
    });

    return () => keybindController.current?.abort();
  }, []);

  // NOTE: bind save button
  const [saveLoading, setSaveLoading] = useState(false);
  useEffect(() => {
    function handleSaveData(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault(); // this is to prevent default save page behaviour

        setSaveLoading(false);
        saveLoading
          ? toast.loading("Saving user data", { position: "bottom-right" })
          : toast.success("Saved user data", { position: "bottom-right" });

        const userData: main.WriteUserDataRequest = {
          user_data: {
            boards: boards!,
            lists: lists!,
            list_cards: list_cards!,
            convertValues: () => {},
          },
          convertValues: () => {},
        };

        WriteUserData(userData).then(() => {
          setSaveLoading(false);
        });
      }
    }

    window.addEventListener("keydown", handleSaveData);

    // cleanup function
    return () => {
      window.removeEventListener("keydown", handleSaveData);
    };
  }, [boards, lists, list_cards]);
}

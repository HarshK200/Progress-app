import {
  sidebarAtom,
  useBoardsValue,
  useListCardsValue,
  useListsValue,
  useRedoActions,
  useUndoActions,
} from "@/store";
import { WriteUserData } from "@wailsjs/go/main/App";
import { main } from "@wailsjs/go/models";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function useMountUnmountKeybinds() {
  const setSideBarOpen = useSetAtom(sidebarAtom);

  const boards = useBoardsValue();
  const lists = useListsValue();
  const list_cards = useListCardsValue();

  const [undoActions, setUndoActions] = useUndoActions();
  const [redoActions, setRedoActions] = useRedoActions();

  // NOTE: Bind General Keymaps
  useEffect(() => {
    // Keymaps ---  TODO: load these from file
    function handleKeyDown(e: KeyboardEvent) {
      // toggle sidebar
      if (e.ctrlKey && e.key.toLowerCase() == "n" && !e.shiftKey) {
        e.preventDefault();
        setSideBarOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // NOTE: Bind undo-redo keybinds
  useEffect(() => {
    function handleUndoRedo(e: KeyboardEvent) {
      // NOTE: redo
      if (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === "z") {
        debugger;
        if (redoActions.length <= 0) {
          toast("Already at the lastest change", {
            position: "bottom-right",
            duration: 1000,
          });
          return;
        }

        // Call the redoFunc and push to undo stack
        setRedoActions((prev) => {
          const updatedRedoActions = [...prev];
          console.log("redo: ", [...updatedRedoActions]);
          const recentRedoAction = updatedRedoActions.pop();
          if (!recentRedoAction) {
            console.error("recentRedoAction is undefined");
            return prev;
          }
          recentRedoAction.redoFunc();

          setUndoActions((prev) => {
            const updatedUndoActions = [...prev];
            updatedUndoActions.push(recentRedoAction);

            return updatedUndoActions;
          });

          return updatedRedoActions;
        });
      }

      // NOTE: undo
      if (e.ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        // NOTE: if no undo actions in the stack
        if (undoActions.length <= 0) {
          toast("Already at the lastest change", {
            position: "bottom-right",
            duration: 1000,
          });
          return;
        }

        // Call the undoFunc and push to redo stack
        setUndoActions((prev) => {
          const updatedUndoActions = [...prev];
          console.log("undo: ", [...updatedUndoActions]);
          const recentUndoAction = updatedUndoActions.pop();
          if (!recentUndoAction) {
            console.error("recentUndoAction is undefined");
            return prev;
          }
          recentUndoAction.undoFunc();

          setRedoActions((prev) => {
            const updatedRedoActions = [...prev];
            updatedRedoActions.push(recentUndoAction);

            return updatedRedoActions;
          });

          return updatedUndoActions;
        });
      }
    }

    window.addEventListener("keydown", handleUndoRedo);

    return () => window.removeEventListener("keydown", handleUndoRedo);
  }, [undoActions, redoActions]);

  // NOTE: Bind save button
  const [saveLoading, setSaveLoading] = useState(false);
  useEffect(() => {
    function handleSaveData(e: KeyboardEvent) {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "s" &&
        !e.shiftKey
      ) {
        e.preventDefault(); // this is to prevent default save page behaviour

        setSaveLoading(false);
        saveLoading
          ? toast.loading("Saving user data", {
              position: "bottom-right",
            })
          : toast.success("Saved user data", {
              position: "bottom-right",
            });

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

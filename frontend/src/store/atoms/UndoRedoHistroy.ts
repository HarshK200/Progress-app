import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export interface UserAction {
  type: "list-update" | "listcard-update" | "board-update";
  undoFunc: () => void;
}

// NOTE: undo actions stack
export const UndoActionsAtom = atom<UserAction[]>([]);
// returns the undo stack
export function useUndoActions() {
  return useAtom(UndoActionsAtom);
}
export function useUndoActionsValue() {
  return useAtomValue(UndoActionsAtom);
}
export function useSetUndoActions() {
  return useSetAtom(UndoActionsAtom);
}

// NOTE: redo actions stack
export const RedoActionsAtom = atom<UserAction[]>([]);
// returns the undo stack
export function useRedoActions() {
  return useAtom(RedoActionsAtom);
}
export function useRedoActionsValue() {
  return useAtomValue(UndoActionsAtom);
}
export function useSetRedoActions() {
  return useSetAtom(UndoActionsAtom);
}

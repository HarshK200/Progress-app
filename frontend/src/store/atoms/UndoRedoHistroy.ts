import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export interface UserAction {
  type:
    | "list-rename"
    | "listcard-rename"
    | "board-rename"
    | "list-add-new"
    | "listcard-add-new"
    | "board-add-new"
    | "list-delete"
    | "listcard-delete"
    | "board-delete";
  undoFunc: () => void;
  redoFunc: () => void;
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

// HACK: undo-redo is not a tree here.
// The redo stack gets flushed on every push to the undo stack.
export const RedoActionsAtom = atom<UserAction[]>([]);
// returns the undo stack
export function useRedoActions() {
  return useAtom(RedoActionsAtom);
}
export function useRedoActionsValue() {
  return useAtomValue(RedoActionsAtom);
}
export function useSetRedoActions() {
  return useSetAtom(RedoActionsAtom);
}

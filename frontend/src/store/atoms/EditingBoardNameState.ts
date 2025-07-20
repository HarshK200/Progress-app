import { atom, useAtom } from "jotai";

export const editingBoardNameAtom = atom<string | null>(null);
export function useEditingBoardIdAtom() {
  return useAtom(editingBoardNameAtom);
}

import { main } from "@wailsjs/go/models";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily } from "jotai/utils";

// Boards Atom
export const boardsAtom = atom<Record<string, main.Board> | undefined>(
  undefined,
);
export function useBoardsValue() {
  return useAtomValue(boardsAtom);
}
export function useSetBoards() {
  return useSetAtom(boardsAtom);
}

// Lists Atom
export const listsAtom = atom<Record<string, main.List> | undefined>(undefined);
// Lists Atom Family
export const listAtomFamily = atomFamily((id: string) => {
  return atom(
    (get) => {
      const lists = get(listsAtom);
      return lists?.[id];
    },
    (get, set, updatedList: main.List) => {
      const lists = get(listsAtom);
      if (!lists) return;
      set(listsAtom, { ...lists, [id]: updatedList });
    },
  );
});

// ----------- For Hydration ------------
export function useListsValue() {
  return useAtomValue(listsAtom);
}
export function useSetLists() {
  return useSetAtom(listsAtom);
}
// -------- For per-list access ---------
export function useList(id: string) {
  return useAtom(listAtomFamily(id));
}



// Listcard Atom
export const listCardsAtom = atom<Record<string, main.ListCard> | undefined>(
  undefined,
);
// Listcard Atom Family
export const listCardAtomFamily = atomFamily((id: string) => {
  return atom(
    (get) => {
      const cards = get(listCardsAtom);
      return cards?.[id];
    },
    (get, set, updatedCard: main.ListCard) => {
      const cards = get(listCardsAtom);
      if (!cards) return;
      set(listCardsAtom, { ...cards, [id]: updatedCard });
    },
  );
});

// ----------- For Hydration ------------
export function useListCardsValue() {
  return useAtomValue(listCardsAtom);
}
export function useSetListCards() {
  return useSetAtom(listCardsAtom);
}

// -------- For per-card access ---------
export function useListCard(id: string) {
  return useAtom(listCardAtomFamily(id));
}

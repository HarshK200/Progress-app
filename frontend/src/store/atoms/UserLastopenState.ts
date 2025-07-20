import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const boardLastOpenIdAtom = atomWithStorage<string | null>(
  "boardLastOpenId",
  localStorage.getItem("boardLastOpenId") ?? null,
);
export function useBoardLastOpenId() {
  return useAtom(boardLastOpenIdAtom);
}
export function useBoardLastOpenIdValue() {
  return useAtomValue(boardLastOpenIdAtom);
}
export function useSetBoardLastOpenId() {
  return useSetAtom(boardLastOpenIdAtom);
}

export const sidebarAtom = atomWithStorage<boolean>("isSidebarOpen", false);
export function useSidebarOpen() {
  return useAtom(sidebarAtom);
}

interface contextMenuDataType {
  isOpen: boolean;
  pos: {
    clientX: number;
    clientY: number;
  } | null;
  board_id: string | null;
}
const contextMenuDataAtom = atom<contextMenuDataType>({
  isOpen: false,
  pos: null,
  board_id: null,
});
export const contextMenuDataDervied = atom(
  // getter
  (get) => get(contextMenuDataAtom),

  // settter
  (get, set, updatedValue: contextMenuDataType) => {
    // NOTE: if opening the contextMenu add the handler to remove it Random primary button click
    function handleBlurOnClick(e: MouseEvent) {
      if (e.button === 0) {
        set(contextMenuDataAtom, { isOpen: false, pos: null, board_id: null });
        window.removeEventListener("click", handleBlurOnClick);
      }
    }
    const previousValue = get(contextMenuDataAtom);
    if (updatedValue.isOpen && !previousValue.isOpen) {
      window.addEventListener("click", handleBlurOnClick);
    }

    set(contextMenuDataAtom, updatedValue);
  },
);
export function useContextMenuDataValue() {
  return useAtomValue(contextMenuDataDervied);
}
export function useSetContextMenuData() {
  return useSetAtom(contextMenuDataDervied);
}

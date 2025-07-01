import { useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const sidebarAtom = atomWithStorage<boolean>("isSidebarOpen", false);
export function useSidebarAtom() {
  return useAtom(sidebarAtom);
}

export const boardOpenIdAtom = atomWithStorage<string>(
  "boardOpen",
  "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
);
export function useBoardOpenIdValue() {
  return useAtomValue(boardOpenIdAtom);
}
export function useBoardOpenId() {
  return useAtom(boardOpenIdAtom);
}

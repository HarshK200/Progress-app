import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// HACK: this transitionAtom is temporary read this from file (also probably use jotai store for this?)
export const transitionAtom = atomWithStorage<boolean>(
  "isTransitionsEnabled",
  false,
);
export function useTransitionAtom() {
  return useAtom(transitionAtom);
};

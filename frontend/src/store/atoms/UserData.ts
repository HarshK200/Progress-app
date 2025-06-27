import { main } from "@wailsjs/go/models";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const dataStateAtom = atom<main.UserData | undefined>();

export function useDataStateAtom() {
  return useAtom(dataStateAtom);
}
export function useSetDataState() {
  return useSetAtom(dataStateAtom);
}
export function useDataStateValue() {
  return useAtomValue(dataStateAtom);
}

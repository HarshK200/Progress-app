import { BoardT, ListT, ListCardT } from "@/types";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export const BoardAtomFamily = atomFamily((id: string) =>
  atom<BoardT | undefined>(undefined),
);

import { atomWithStorage } from "jotai/utils";

export const sidebarAtom = atomWithStorage<boolean>("isSidebarOpen", false);

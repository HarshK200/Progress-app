import { DataState } from "@/types";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const DATA_STATE: DataState = {
  boards: {
    "251ab92d-ccff-4e74-ae4e-619ebb3b1752": {
      id: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      name: "Programming board",
      ListIds: ["1", "2", "3", "4"],
    },
  },

  lists: {
    "1": {
      id: "1",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      title: "Todo",
      CardIds: ["564799fc-798a-4994-b341-97ba70e3724a"],
    },
    "2": {
      id: "2",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      title: "Doing",
      CardIds: [
        "171883c6-621b-4fcc-b01b-0586dc2b0250",
        "60kw20dk2-16cc-43c4-b186-5cd714142f1e",
        "6969e000f2-16cc-43c4-b186-5cd714142f1e",
      ],
    },
    "3": {
      id: "3",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      title: "Done",
      CardIds: [
        "a01bd0c7-bd69-4ef7-88a9-c13f84173bf2",
        "62e000f2-16cc-43c4-b186-5cd714142f1e",
      ],
    },
    "4": {
      id: "4",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      title: "BackBurner",
      CardIds: [],
    },
  },

  cards: {
    "a01bd0c7-bd69-4ef7-88a9-c13f84173bf2": {
      id: "a01bd0c7-bd69-4ef7-88a9-c13f84173bf2",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      ListId: "3",
      title: "List component",
      isDone: true,
    },
    "171883c6-621b-4fcc-b01b-0586dc2b0250": {
      id: "171883c6-621b-4fcc-b01b-0586dc2b0250",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      ListId: "2",
      title: "Button to add a new card",
      isDone: false,
    },
    "564799fc-798a-4994-b341-97ba70e3724a": {
      id: "564799fc-798a-4994-b341-97ba70e3724a",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      ListId: "1",
      title: "Custom checkbox",
      isDone: false,
    },
    "19e300f2-16cc-43c4-b186-5cd714142f1e": {
      id: "19e300f2-16cc-43c4-b186-5cd714142f1e",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      ListId: "1",
      title: "Darg and drop functionality",
      isDone: false,
    },
    "62e000f2-16cc-43c4-b186-5cd714142f1e": {
      id: "62e000f2-16cc-43c4-b186-5cd714142f1e",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      ListId: "3",
      title: "Figure out the data structure for serialization",
      isDone: true,
    },
    "60kw20dk2-16cc-43c4-b186-5cd714142f1e": {
      id: "60kw20dk2-16cc-43c4-b186-5cd714142f1e",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      ListId: "2",
      title: "Write the board state to file and read it to state",
      isDone: false,
    },
    "6969e000f2-16cc-43c4-b186-5cd714142f1e": {
      id: "6969e000f2-16cc-43c4-b186-5cd714142f1e",
      BoardId: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      ListId: "2",
      title: "Install react-router and setup the sidebar",
      isDone: false,
    },
  },
};

const dataStateAtom = atom<DataState>(DATA_STATE);

export function useDataStateAtom() {
  return useAtom(dataStateAtom);
}

export function useSetDataState() {
  return useSetAtom(dataStateAtom);
}

export function useDataStateValue() {
  return useAtomValue(dataStateAtom);
}

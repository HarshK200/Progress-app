import { BoardT } from "@/types";
import { atom, useAtom } from "jotai";

const BOARD_DATA: BoardT[] = [
  {
    id: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
    name: "Programming board",
    lists: [
      {
        id: 1,
        title: "Todo",
        className: "bg-[#45475a]",
        CardIds: [
          "171883c6-621b-4fcc-b01b-0586dc2b0250",
          "564799fc-798a-4994-b341-97ba70e3724a",
        ],
      },
      {
        id: 2,
        title: "Doing",
        className: "bg-[#f9e2af]",
        CardIds: ["62e000f2-16cc-43c4-b186-5cd714142f1e"],
      },
      {
        id: 3,
        title: "Done",
        className: "bg-[#a6e3a1]",
        CardIds: ["a01bd0c7-bd69-4ef7-88a9-c13f84173bf2"],
      },
      {
        id: 4,
        title: "BackBurner",
        className: "bg-[#89b4fa]",
        CardIds: [],
      },
    ],
    listCards: [
      {
        id: "a01bd0c7-bd69-4ef7-88a9-c13f84173bf2",
        listId: 3,
        title: "List component",
        isDone: true,
      },
      {
        id: "171883c6-621b-4fcc-b01b-0586dc2b0250",
        listId: 1,
        title: "Button to add a new card",
        isDone: false,
      },
      {
        id: "564799fc-798a-4994-b341-97ba70e3724a",
        listId: 1,
        title: "Custom checkbox",
        isDone: false,
      },
      {
        id: "19e300f2-16cc-43c4-b186-5cd714142f1e",
        listId: 1,
        title: "Darg and drop functionality",
        isDone: false,
      },
      {
        id: "62e000f2-16cc-43c4-b186-5cd714142f1e",
        listId: 3,
        title: "Figure out the data structure for serialization",
        isDone: true,
      },
    ],
  },
];

const boardAtom = atom<BoardT[]>(BOARD_DATA);

// TODO: maybe take the board id as input so it would return that specific board data
export function useBoardAtom() {
  return useAtom(boardAtom);
}

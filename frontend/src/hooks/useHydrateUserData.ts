import { GetUserData } from "@wailsjs/go/main/App";
import { boardsAtom, listsAtom, listCardsAtom } from "@/store";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export function useHydrateUserDataState() {
  const setBoards = useSetAtom(boardsAtom);
  const setLists = useSetAtom(listsAtom);
  const setListCards = useSetAtom(listCardsAtom);

  useEffect(() => {
    GetUserData().then((data) => {
      if (data.status_code !== 200) {
        console.error(data.status);
      }

      setBoards(data.user_data.boards);
      setLists(data.user_data.lists);
      setListCards(data.user_data.list_cards);
    });
  }, []);
}

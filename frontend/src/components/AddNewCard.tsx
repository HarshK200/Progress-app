import { Plus } from "lucide-react";
import { main } from "@wailsjs/go/models";
import { useBoardOpenIdValue, useList, useSetListCards } from "@/store";
import { v4 as uuidv4 } from "uuid";

export const AddNewCard = ({ list_id }: { list_id: string }) => {
  const [list, setList] = useList(list_id);
  const setListCards = useSetListCards();
  const boardOpenId = useBoardOpenIdValue();

  function addNewCard() {
    const NewCardData: main.ListCard = {
      id: uuidv4(),
      title: "New Card",
      is_done: false,
      board_id: boardOpenId,
      list_id: list_id,
    };

    // NOTE: Add the new card_id to the current list
    setList({ ...list!, card_ids: [...list!.card_ids, NewCardData.id] });

    // NOTE: Add the card to listCards state
    setListCards((prev) => {
      if (!prev) return undefined;

      return { ...prev, [NewCardData.id]: NewCardData };
    });
  }

  return (
    <button
      className="flex px-2 py-1 rounded-md gap-2 items-center hover:bg-background/50 transition-all"
      onClick={addNewCard}
    >
      <Plus width={22} />
      <span>New</span>
    </button>
  );
};

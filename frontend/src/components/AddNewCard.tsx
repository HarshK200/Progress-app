import { Plus } from "lucide-react";
import { main } from "@wailsjs/go/models";
import { useList, useSetListCards } from "@/store";

export const AddNewCard = ({ list_id }: { list_id: string }) => {
  const [list, setList] = useList(list_id);
  const setListCards = useSetListCards();

  function addNewCard() {
    const DummyCardData: main.ListCard = {
      id: "rando-string-id" + Math.floor(Math.random() * 10000),
      title: "Konichiwaa :>",
      is_done: false,
      board_id: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      list_id: list_id,
    };

    // NOTE: Add the new card_id to the current list
    setList({ ...list!, card_ids: [...list!.card_ids, DummyCardData.id] });

    // NOTE: Add the card to listCards state
    setListCards((prev) => {
      if (!prev) return undefined;

      return { ...prev, [DummyCardData.id]: DummyCardData };
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

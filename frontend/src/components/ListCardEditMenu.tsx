import { useList, useSetListCards } from "@/store";
import { main } from "@wailsjs/go/models";
import { Trash } from "lucide-react";

interface ListCardEditMenuProps {
  listcard: main.ListCard;
}
export const ListCardEditMenu = ({ listcard }: ListCardEditMenuProps) => {
  const setListCards = useSetListCards();
  const [list, setList] = useList(listcard.list_id);

  function handleDelete() {
    if (!list) return;

    // remove the listcard_id from the list
    const newListCard_ids = list.card_ids.filter(
      (card_id) => card_id !== listcard.id,
    );
    setList({
      ...list,
      card_ids: newListCard_ids,
    });

    setListCards((prev) => {
      if (!prev) return undefined;

      // remove the list card from listCardsAtom
      const newListCards = Object.fromEntries(
        Object.entries(prev).filter(([_, card]) => card.id !== listcard.id),
      );

      // update the prevCard link (if exists)
      if (listcard.prev_card_id) {
        newListCards[listcard.prev_card_id] = {
          ...newListCards[listcard.prev_card_id],
          next_card_id: listcard.next_card_id,
        };
      }

      // update the next link (if exists)
      if (listcard.next_card_id) {
        newListCards[listcard.next_card_id] = {
          ...newListCards[listcard.next_card_id],
          prev_card_id: listcard.prev_card_id,
        };
      }

      return newListCards;
    });
  }

  return (
    <div className="absolute left-10 bg-background border-[1px] border-border rounded-md px-3 py-2 w-[150px]">
      <button
        className="flex items-center gap-2 text-red-400"
        onClick={handleDelete}
      >
        <Trash size={18} />
        <span>Delete</span>
      </button>
    </div>
  );
};

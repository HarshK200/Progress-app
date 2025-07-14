import { useList, useSetListCards } from "@/store";
import { main } from "@wailsjs/go/models";
import { Trash } from "lucide-react";

interface ListCardEditMenuProps {
  editMenuData: {
    card: main.ListCard;
    clientX: number;
    clientY: number;
  } | null;
  setIsCardEditMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCardEditMenuData: React.Dispatch<
    React.SetStateAction<{
      card: main.ListCard;
      clientX: number;
      clientY: number;
    } | null>
  >;
  relativeContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}
export const ListCardEditMenu = ({
  editMenuData,
  setIsCardEditMenuOpen,
  setCardEditMenuData,
  relativeContainerRef,
}: ListCardEditMenuProps) => {
  if (!editMenuData || !relativeContainerRef.current) return null;

  const listcard = editMenuData.card;
  const setListCards = useSetListCards();
  const [list, setList] = useList(listcard.list_id);

  const relativeContainer = relativeContainerRef.current;
  const containerRect = relativeContainer?.getBoundingClientRect();
  const relativeX = editMenuData.clientX - containerRect.left;
  const relativeY = editMenuData.clientY - containerRect.top;

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
      const newListCards = { ...prev };

      delete newListCards[listcard.id];

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

      // cleanup the open edit menu
      setIsCardEditMenuOpen(false);
      setCardEditMenuData(null);

      return newListCards;
    });
  }

  return (
    <div
      className="z-10 absolute bg-background border-[1px] border-border rounded-md w-[150px]"
      style={{
        top: relativeY,
        left: relativeX,
      }}
    >
      <button
        className="flex px-3 py-2 items-center gap-2 text-red-400 w-full h-full"
        onClick={handleDelete}
      >
        <Trash size={18} />
        <span>Delete</span>
      </button>
    </div>
  );
};

import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { useList, useListCard, useSetListCards } from "@/store";
import { main } from "@wailsjs/go/models";
import { SquarePen, Trash } from "lucide-react";
import { memo, useState } from "react";

interface ListCardProps {
  listcard_id: string;
}

export const ListCard = memo(({ listcard_id }: ListCardProps) => {
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [card, setCard] = useListCard(listcard_id);

  if (!card) {
    return (
      <div className="flex items-center w-full h-[42px] rounded-md bg-background animate-pulse"></div>
    );
  }

  function toggleCardIsDone(e: React.ChangeEvent<HTMLInputElement>) {
    if (!card) {
      return;
    }
    setCard({ ...card, is_done: e.target.checked });
  }

  return (
    <div className="group flex items-center w-full rounded-md bg-background">
      {/* TODO: add custom checkbox componenet */}

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={card.is_done}
        onChange={toggleCardIsDone}
        className={`px-2 ml-2 group-hover:opacity-100 opacity-0 transition-all duration-500`}
      />

      {/* Input component */}
      <TextareaAutoresize
        title={card.title}
        outlineOnClick={false}
        className="ml-3 my-3 rounded-md"
      />

      {/* Edit menu */}
      <div className="relative">
        <SquarePen
          size={20}
          className="group-hover:opacity-100 opacity-0 mx-3 cursor-pointer"
          onClick={() => setIsEditMenuOpen((prev) => !prev)}
        />
        {isEditMenuOpen && <ListCardEditMenu listcard={card} />}
      </div>
    </div>
  );
});

interface ListCardEditMenuProps {
  listcard: main.ListCard;
}
const ListCardEditMenu = ({ listcard }: ListCardEditMenuProps) => {
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

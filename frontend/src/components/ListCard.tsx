import { memo } from "react";
import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { useSetDataState } from "@/store";
import { main } from "@wailsjs/go/models";

export const ListCard = memo(({ card }: { card: main.ListCard }) => {
  const setDataState = useSetDataState();

  function toggleCardIsDone(e: React.ChangeEvent<HTMLInputElement>) {
    setDataState((prev) => {
      if (!prev) {
        return undefined;
      }

      const newUserData = new main.UserData();
      newUserData.boards = prev.boards;
      newUserData.lists = prev.lists;
      newUserData.list_cards = {
        ...prev.list_cards,
        [card.id]: { ...prev.list_cards[card.id], is_done: e.target.checked }, // INSERTING NEW DUMMY CARD
      };

      return newUserData;
    });
  }

  return (
    <div className="group flex items-center w-full rounded-md bg-background">
      {/* TODO: add custom checkbox componenet */}

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={card.is_done}
        onChange={toggleCardIsDone}
        className={`group-hover:px-4 group-hover:ml-3 group-hover:opacity-100 opacity-0 transition-all duration-500`}
      />

      {/* Input component */}
      <TextareaAutoresize
        title={card.title}
        outlineOnClick={false}
        className="p-3 rounded-md"
      />
    </div>
  );
});

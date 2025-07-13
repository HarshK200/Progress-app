import { Plus } from "lucide-react";
import { main } from "@wailsjs/go/models";
import { useBoardOpenIdValue, useList, useSetListCards } from "@/store";
import { v4 as uuidv4 } from "uuid";
import { forwardRef } from "react";

interface AddNewCardProps {
  list_id: string;
  prev_card_id: string | undefined;
  ref?: React.RefObject<HTMLButtonElement>;
}
export const AddNewCard = forwardRef<HTMLButtonElement, AddNewCardProps>(
  ({ list_id, prev_card_id }, ref) => {
    const [list, setList] = useList(list_id);
    const setListCards = useSetListCards();
    const boardOpenId = useBoardOpenIdValue();

    function addNewCard() {
      if (!list) return;

      const NewCardData: main.ListCard = {
        id: uuidv4(),
        title: "New Card",
        is_done: false,
        board_id: boardOpenId,
        list_id: list_id,
        prev_card_id: prev_card_id,
        next_card_id: undefined,
      };

      // NOTE: Add the new card_id to the current list
      setList({ ...list, card_ids: [...list.card_ids, NewCardData.id] });

      // NOTE: Add the card to listCards state
      setListCards((prev) => {
        if (!prev) return undefined;

        if (prev_card_id) {
          return {
            ...prev,
            [prev_card_id]: {
              ...prev[prev_card_id],
              next_card_id: NewCardData.id,
            },
            [NewCardData.id]: NewCardData,
          };
        } else {
          return { ...prev, [NewCardData.id]: NewCardData };
        }
      });
    }

    return (
      <button
        className="flex mb-2 mx-2 px-1 py-2 rounded-md gap-2 items-center hover:bg-background/50 transition-all"
        onClick={addNewCard}
        ref={ref}
      >
        <Plus width={22} />
        <span>New Card</span>
      </button>
    );
  },
);

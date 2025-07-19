import { Plus } from "lucide-react";
import { main } from "@wailsjs/go/models";
import {
  useBoardLastOpenIdValue,
  useList,
  UserAction,
  useSetListCards,
  useSetRedoActions,
  useSetUndoActions,
} from "@/store";
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
    const boardOpenId = useBoardLastOpenIdValue();
    const setUndoActions = useSetUndoActions();
    const setRedoActions = useSetRedoActions();

    function addNewCard(opts: {
      isRedo: boolean;
      generatedCardId: string | null;
    }) {
      if (!list) return;

      const newCardData: main.ListCard = {
        id:
          opts.isRedo && opts.generatedCardId ? opts.generatedCardId : uuidv4(),
        title: "New Card",
        is_done: false,
        board_id: boardOpenId,
        list_id: list_id,
        prev_card_id: prev_card_id,
        next_card_id: undefined,
      };

      // NOTE: Add the new card_id to the current list
      setList({ ...list, card_ids: [...list.card_ids, newCardData.id] });

      // NOTE: Add the card to listCards state
      setListCards((prev) => {
        if (!prev) return undefined;

        if (prev_card_id)
          return {
            ...prev,
            [prev_card_id]: {
              ...prev[prev_card_id],
              next_card_id: newCardData.id,
            },
            [newCardData.id]: newCardData,
          };
        else return { ...prev, [newCardData.id]: newCardData };
      });

      // =========================== Undo-Redo stuff ===========================

      // NOTE: return here if this is a redo call
      if (opts.isRedo) return;

      // NOTE: push this action to undo history
      setUndoActions((prev) => {
        const updatedUndoActions = [...prev];

        const newUndoAction: UserAction = {
          type: "listcard-add-new",
          undoFunc: () => {
            // NOTE: remove listCard from the listCards Map
            setListCards((prev) => {
              if (!prev) return;
              const updatedListCards = { ...prev };

              // update the prev listcard if exists
              if (prev_card_id)
                updatedListCards[prev_card_id] = {
                  ...updatedListCards[prev_card_id],
                  next_card_id: undefined,
                };
              // delete the newly created listcard
              delete updatedListCards[newCardData.id];

              return updatedListCards;
            });

            // NOTE: remove listcard's id from the list accordingly
            setList({
              ...list,
              card_ids: list.card_ids.filter(
                (card_id) => card_id !== newCardData.id,
              ),
            });
          },
          redoFunc: () => {
            addNewCard({ isRedo: true, generatedCardId: newCardData.id });
          },
        };

        updatedUndoActions.push(newUndoAction);

        return updatedUndoActions;
      });

      // NOTE: flush the redo stack
      setRedoActions([]);
    }

    return (
      <button
        className="flex mb-2 mx-2 px-1 py-2 rounded-md gap-2 items-center hover:bg-background/50 transition-all"
        onClick={() => addNewCard({ isRedo: false, generatedCardId: null })}
        ref={ref}
      >
        <Plus width={22} />
        <span>New Card</span>
      </button>
    );
  },
);

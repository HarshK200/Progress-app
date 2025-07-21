import {
  useList,
  UserAction,
  useSetListCards,
  useSetRedoActions,
  useSetUndoActions,
} from "@/store";
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
  const setUndoActions = useSetUndoActions();
  const setRedoActions = useSetRedoActions();

  const relativeContainer = relativeContainerRef.current;
  const containerRect = relativeContainer?.getBoundingClientRect();
  const relativeX = editMenuData.clientX - containerRect.left;
  const relativeY = editMenuData.clientY - containerRect.top;

  function handleDelete(opts: { isRedo: boolean }) {
    if (!list) return;

    setListCards((prev) => {
      if (!prev) return undefined;
      const updatedListCards = { ...prev };

      // NOTE: update the prev listcard (if exists)
      if (listcard.prev_card_id) {
        updatedListCards[listcard.prev_card_id] = {
          ...updatedListCards[listcard.prev_card_id],
          next_card_id: listcard.next_card_id,
        };
      }

      // NOTE: update the next listcard (if exists)
      if (listcard.next_card_id) {
        updatedListCards[listcard.next_card_id] = {
          ...updatedListCards[listcard.next_card_id],
          prev_card_id: listcard.prev_card_id,
        };
      }

      // NOTE: remove the list card from listCardsAtom
      delete updatedListCards[listcard.id];

      // NOTE: remove the listcard's id from the list's card_ids
      setList({
        ...list,
        card_ids: list.card_ids.filter((id) => id !== listcard.id),
      });

      // cleanup the open edit menu
      setIsCardEditMenuOpen(false);
      setCardEditMenuData(null);

      return updatedListCards;
    });

    // =========================== Undo-Redo stuff ===========================
    if (opts.isRedo) return;
    // NOTE: push new userAction to undo stack
    setUndoActions((prev) => {
      const updatedUndoActions = [...prev];
      const newUserAction: UserAction = {
        type: "listcard-delete",
        undoFunc: () => {
          setListCards((prev) => {
            if (!prev) return;
            const updatedListCards = { ...prev };

            // update prev listcard
            if (listcard.prev_card_id)
              updatedListCards[listcard.prev_card_id] = {
                ...updatedListCards[listcard.prev_card_id],
                next_card_id: listcard.id,
              };

            // update next listcard
            if (listcard.next_card_id)
              updatedListCards[listcard.next_card_id] = {
                ...updatedListCards[listcard.next_card_id],
                prev_card_id: listcard.id,
              };

            // add the listcard to listcards map
            updatedListCards[listcard.id] = listcard;

            return updatedListCards;
          });

          // add the listcard's id to list's card_ids
          setList({ ...list, card_ids: [...list.card_ids, list.id] });
        },
        redoFunc: () => {
          handleDelete({ isRedo: true });
        },
      };

      updatedUndoActions.push(newUserAction);

      return updatedUndoActions;
    });

    // NOTE: flush the redo stack
    setRedoActions([]);
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
        onClick={() => handleDelete({ isRedo: false })}
      >
        <Trash size={18} />
        <span>Delete</span>
      </button>
    </div>
  );
};

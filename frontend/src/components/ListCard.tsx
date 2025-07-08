import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { useList, useListCard } from "@/store";
import { Plus, SquarePen } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { ListCardEditMenu } from "@/components/ListCardEditMenu";
import { main } from "@wailsjs/go/models";

interface ListCardProps {
  listcard_id: string;
}

export const ListCard = memo(({ listcard_id }: ListCardProps) => {
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [card, setCard] = useListCard(listcard_id);
  // NOTE: loading skeleton UI
  if (!card) {
    return (
      <div className="flex items-center w-full h-[42px] rounded-md bg-background animate-pulse"></div>
    );
  }

  function toggleCardIsDone(e: React.ChangeEvent<HTMLInputElement>) {
    if (!card) return;
    setCard({ ...card, is_done: e.target.checked });
  }

  // NOTE: drag-and-drop logic

  const [list, setList] = useList(card.list_id);
  const [prevCard, setPrevCard] = useListCard(card.prev_card_id ?? "");
  const [nextCard, setNextCard] = useListCard(card.next_card_id ?? "");

  const listCardRef = useRef<HTMLDivElement | null>(null);
  const [dragIsAboutToStart, setDragIsAboutToStart] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [closestDroppableEdge, setClosestDroppableEdge] = useState("");

  useEffect(() => {
    const element = listCardRef.current;
    invariant(element);

    return combine(
      draggable({
        element: element,
        getInitialData: () => {
          return {
            card,
            setCard,
            list,
            setList,
            prevCard,
            setPrevCard,
            nextCard,
            setNextCard,
          };
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setDragIsAboutToStart(true);
        },
        onDragStart: () => {
          setDragIsAboutToStart(false);
          setDragging(true);
        },
        onDrop: () => {
          setDragging(false);
        },
      }),

      dropTargetForElements({
        element: element,

        onDragEnter: () => {
          setIsDraggedOver(true);
        },

        onDrag: ({ location }) => {
          // NOTE: decides which section the drag is top | bottom

          const rect = element.getBoundingClientRect();
          // no X position cause we only care about the Y
          const relativeY = location.current.input.clientY - rect.top;
          const percentageFromTop = (relativeY / rect.height) * 100;

          if (percentageFromTop > 50 && percentageFromTop <= 100) {
            setClosestDroppableEdge("bottom");
          } else if (percentageFromTop >= 0 && percentageFromTop <= 50) {
            setClosestDroppableEdge("top");
          }
        },

        onDragLeave: () => {
          setIsDraggedOver(false);
          setClosestDroppableEdge("");
        },

        onDrop: ({ source }) => {
          setIsDraggedOver(false);
          debugger;

          const cardDragging = source.data.card as main.ListCard;
          const setCardDragging = source.data.setCard as (
            updateCard: main.ListCard,
          ) => void;
          const isSameList = cardDragging.list_id === card.list_id;

          // card dropped before
          if (closestDroppableEdge === "top") {
            // ISSUE: handle two cards Swapping Edge case

            // NOTE: update card dragging's prev card
            const cardDraggingPrevCard = source.data.prevCard as main.ListCard;
            const setCardDraggingPrevCard = source.data.setPrevCard as (
              updatedCard: main.ListCard,
            ) => void;
            if (cardDraggingPrevCard)
              setCardDraggingPrevCard({
                ...cardDraggingPrevCard,
                next_card_id: cardDragging.next_card_id,
              });

            // NOTE: update card dragging's next card
            const cardDraggingNextCard = source.data.nextCard as main.ListCard;
            const setCardDraggingNextCard = source.data.setNextCard as (
              updatedCard: main.ListCard,
            ) => void;
            if (cardDraggingNextCard)
              setCardDraggingNextCard({
                ...cardDraggingNextCard,
                prev_card_id: cardDragging.prev_card_id,
              });

            // NOTE: updating card dragging's List
            if (!isSameList) {
              const cardDraggingList = source.data.list as main.List;
              const setCardDraggingList = source.data.setList as (
                updatedList: main.List,
              ) => void;
              setCardDraggingList({
                ...cardDraggingList,
                card_ids: cardDraggingList.card_ids.filter(
                  (card_id) => card_id !== cardDragging.id,
                ),
              });
            }

            // NOTE: update card dragging
            console.log("prev:", card.prev_card_id, "\nnext: ", card.id);
            setCardDragging({
              ...cardDragging,
              prev_card_id: card.prev_card_id,
              next_card_id: card.id,
              list_id: card.list_id,
            });

            // NOTE: updating card dropping's list
            if (!isSameList) {
              if (!list) return;
              setList({
                ...list,
                card_ids: [...list.card_ids, cardDragging.id],
              });
            }

            // NOTE: updating card dropping's prev card
            setPrevCard({ ...prevCard!, next_card_id: cardDragging.id });

            // NOTE: updating card dropping
            setCard({ ...card, prev_card_id: cardDragging.id });
          }

          // drop dropped after
          else if (closestDroppableEdge === "bottom") {
          }

          setClosestDroppableEdge("");
        },
      }),
    );
  }, [closestDroppableEdge, card, prevCard, nextCard]);

  return (
    /* List card */
    <div
      className={`relative group flex items-center w-full rounded-md bg-background ${dragging || dragIsAboutToStart ? "opacity-50" : ""} ${dragIsAboutToStart ? "rotate-6" : ""}`}
      ref={listCardRef}
    >
      {/* Dropable Area Hint Top */}
      <div
        className={`z-10 absolute w-full h-[2px] bg-blue-300 ${closestDroppableEdge === "top" ? "opacity-100" : "opacity-0"} -top-1`}
      >
        <Plus
          size={14}
          className="absolute text-white bg-blue-300 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

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
        onChange={(e) => setCard({ ...card, title: e.target.value })}
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

      {/* Dropable Area Hint Bottom */}
      <div
        className={`z-10 absolute w-full h-[2px] bg-blue-300 ${closestDroppableEdge === "bottom" ? "opacity-100" : "opacity-0"} -bottom-1`}
      >
        <Plus
          size={14}
          className="absolute text-white bg-blue-300 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
});

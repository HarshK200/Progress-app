import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { useList, useListCard, useSetListCards } from "@/store";
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
      <div className="py-[3px]">
        <div className="flex items-center w-full h-[42px] rounded-md bg-background animate-pulse"></div>
      </div>
    );
  }

  function toggleCardIsDone(e: React.ChangeEvent<HTMLInputElement>) {
    if (!card) return;
    setCard({ ...card, is_done: e.target.checked });
  }

  // NOTE: drag-and-drop logic
  const [list, setList] = useList(card.list_id);
  const setCards = useSetListCards();

  const listCardRef = useRef<HTMLDivElement | null>(null);
  const listCardWrapperRef = useRef<HTMLDivElement | null>(null);
  const [dragIsAboutToStart, setDragIsAboutToStart] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [closestDroppableEdge, setClosestDroppableEdge] = useState<
    "top" | "bottom" | null
  >(null);

  useEffect(() => {
    const elementWrapper = listCardWrapperRef.current;
    const element = listCardRef.current;
    invariant(element);
    invariant(elementWrapper);

    return combine(
      draggable({
        element: element,
        getInitialData: () => {
          return {
            type: "listcard",
            card,
            list,
            setList,
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

        // NOTE: this is just so that the drag doesn't trigger when dragging lists
        canDrop: ({ source }) => {
          if (source.data.type === "listcard") return true;
          return false;
        },

        onDrop: ({ source }) => {
          // card dragging
          const cardDragging = source.data.card as main.ListCard;

          // card dragging list
          const cardDraggingList = source.data.list as main.List;
          const setCardDraggingList = source.data.setList as (
            updatedList: main.List,
          ) => void;

          if (!closestDroppableEdge) return;

          // NOTE: attach card top-side
          if (closestDroppableEdge === "top") {
            // add the card to current list
            setList({
              ...list!,
              card_ids: [...list!.card_ids, cardDragging.id],
            });

            setCards((prev) => {
              const updatedCards = { ...prev! };

              // NOTE: Edge case 1 : when dropping card on the same position
              // NOTE: Edge case 2 : when the cardDragging and card are the same
              if (
                card.prev_card_id === cardDragging.id ||
                card.id === cardDragging.id
              ) {
                return updatedCards;
              }

              // NOTE: Edge case: when swapping two cards in the same list
              if (
                cardDragging.prev_card_id === card.id ||
                cardDragging.next_card_id === card.id
              ) {
                updatedCards[card.id] = {
                  ...card,
                  prev_card_id: cardDragging.id,
                  next_card_id: cardDragging.next_card_id,
                };
                updatedCards[cardDragging.id] = {
                  ...cardDragging,
                  prev_card_id: card.prev_card_id,
                  next_card_id: card.id,
                };
                if (card.prev_card_id)
                  updatedCards[card.prev_card_id] = {
                    ...updatedCards[card.prev_card_id],
                    next_card_id: cardDragging.id,
                  };
                if (cardDragging.next_card_id)
                  updatedCards[cardDragging.next_card_id] = {
                    ...updatedCards[cardDragging.next_card_id],
                    prev_card_id: card.id,
                  };

                // NOTE: early return for edge case
                return updatedCards;
              }

              if (cardDragging.prev_card_id) {
                // =========== Dragging card updates ===============

                // dragging card's prev update
                updatedCards[cardDragging.prev_card_id] = {
                  ...updatedCards[cardDragging.prev_card_id],
                  next_card_id: cardDragging.next_card_id,
                };
              }
              // dragging card's next update
              if (cardDragging.next_card_id) {
                updatedCards[cardDragging.next_card_id] = {
                  ...updatedCards[cardDragging.next_card_id],
                  prev_card_id: cardDragging.prev_card_id,
                };
              }

              // ================= Lists updates ===============

              // dragging list update
              setCardDraggingList({
                ...cardDraggingList,
                card_ids: cardDraggingList.card_ids.filter(
                  (id) => id !== cardDragging.id,
                ),
              });

              // dropping list update
              setList({
                ...list!,
                card_ids: [...list!.card_ids, cardDragging.id],
              });

              // =========== Dropping card updates ===============

              // card dropped-on's prev card update
              if (card.prev_card_id) {
                updatedCards[card.prev_card_id] = {
                  ...updatedCards[card.prev_card_id],
                  next_card_id: cardDragging.id,
                };
              }

              // dropping card update
              updatedCards[cardDragging.id] = {
                ...cardDragging,
                prev_card_id: card.prev_card_id,
                next_card_id: card.id,
                list_id: card.list_id,
              };

              // card dropped-on
              updatedCards[card.id] = {
                ...card,
                prev_card_id: cardDragging.id,
              };

              return updatedCards;
            });
          }

          // attach card bottom-side
          // WARN: i got lazy so this code is by chatgpt WARNING! this may contain bugs
          else if (closestDroppableEdge === "bottom") {
            setList({
              ...list!,
              card_ids: [...list!.card_ids, cardDragging.id],
            });

            setCards((prev) => {
              const updatedCards = { ...prev! };

              if (
                card.next_card_id === cardDragging.id ||
                card.id === cardDragging.id
              ) {
                return updatedCards;
              }

              if (
                cardDragging.prev_card_id === card.id ||
                cardDragging.next_card_id === card.id
              ) {
                updatedCards[card.id] = {
                  ...card,
                  next_card_id: cardDragging.id,
                  prev_card_id: cardDragging.prev_card_id,
                };
                updatedCards[cardDragging.id] = {
                  ...cardDragging,
                  next_card_id: card.next_card_id,
                  prev_card_id: card.id,
                };
                if (card.next_card_id)
                  updatedCards[card.next_card_id] = {
                    ...updatedCards[card.next_card_id],
                    prev_card_id: cardDragging.id,
                  };
                if (cardDragging.prev_card_id)
                  updatedCards[cardDragging.prev_card_id] = {
                    ...updatedCards[cardDragging.prev_card_id],
                    next_card_id: card.id,
                  };
                return updatedCards;
              }

              if (cardDragging.prev_card_id) {
                updatedCards[cardDragging.prev_card_id] = {
                  ...updatedCards[cardDragging.prev_card_id],
                  next_card_id: cardDragging.next_card_id,
                };
              }
              if (cardDragging.next_card_id) {
                updatedCards[cardDragging.next_card_id] = {
                  ...updatedCards[cardDragging.next_card_id],
                  prev_card_id: cardDragging.prev_card_id,
                };
              }

              setCardDraggingList({
                ...cardDraggingList,
                card_ids: cardDraggingList.card_ids.filter(
                  (id) => id !== cardDragging.id,
                ),
              });

              setList({
                ...list!,
                card_ids: [...list!.card_ids, cardDragging.id],
              });

              if (card.next_card_id) {
                updatedCards[card.next_card_id] = {
                  ...updatedCards[card.next_card_id],
                  prev_card_id: cardDragging.id,
                };
              }

              updatedCards[cardDragging.id] = {
                ...cardDragging,
                prev_card_id: card.id,
                next_card_id: card.next_card_id,
                list_id: card.list_id,
              };

              updatedCards[card.id] = {
                ...card,
                next_card_id: cardDragging.id,
              };

              return updatedCards;
            });
          }

          setClosestDroppableEdge(null);
        },
      }),

      // NOTE: decides which section the drag is top | bottom
      dropTargetForElements({
        element: elementWrapper,

        canDrop: ({ source }) => {
          if (source.data.type !== "listcard") return false;
          return true;
        },

        onDrag: ({ location, source }) => {
          const cardDragging = source.data.card as main.ListCard;
          if (cardDragging.id === card.id) {
            setClosestDroppableEdge(null);
            return;
          }

          const rect = elementWrapper.getBoundingClientRect();
          // no X position cause that is handled by onDragLeave
          const relativeY = location.current.input.clientY - rect.top;
          const percentageFromTop = (relativeY / rect.height) * 100;

          if (percentageFromTop > 50 && percentageFromTop <= 100) {
            setClosestDroppableEdge("bottom");
          } else if (percentageFromTop >= 0 && percentageFromTop <= 50) {
            setClosestDroppableEdge("top");
          }
        },

        onDragLeave: () => {
          setClosestDroppableEdge(null);
        },
      }),
    );
  }, [closestDroppableEdge, card, list]);
  // NOTE: the closestDroppableEdge, card and list are in the dependency array to prevent the closure issue

  return (
    // List card wrapper
    <div className="py-[3px]" ref={listCardWrapperRef}>
      {/* List card */}
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
          className="ml-3 my-3 rounded-md overflow-hidden"
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
    </div>
  );
});

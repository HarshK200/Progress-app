import { cn } from "@/lib/utils";
import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { ListCard } from "@/components/ListCard";
import {
  useList,
  useListCardGroup,
  useSetListCards,
  useSetLists,
} from "@/store";
import { memo, useEffect, useRef, useState } from "react";
import { AddNewCard } from "@/components/AddNewCard";
import { main } from "@wailsjs/go/models";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import invariant from "tiny-invariant";
import { Ellipsis } from "lucide-react";
import { ListCardEditMenu } from "@/components/ListCardEditMenu";
import { ListEditMenu } from "@/components/ListEditMenu";

interface ListProps {
  list_id: string;
}

export const List = memo(({ list_id }: ListProps) => {
  const [list, setList] = useList(list_id);
  if (!list) {
    return (
      <div className="flex flex-col min-w-[270px] text-foreground animate-pulse">
        Loding...
      </div>
    );
  }

  // NOTE: drag'n drop logic
  const listCardsDataMap = useListCardGroup(list.card_ids);
  const listCardsDataOrdered: main.ListCard[] = [];
  if (list.card_ids.length > 0) {
    let currentCard = listCardsDataMap[list.card_ids[0]];

    // push the current card
    listCardsDataOrdered.push(currentCard);

    // push all the previous cards
    while (currentCard.prev_card_id) {
      const prevCard = listCardsDataMap[currentCard.prev_card_id];
      listCardsDataOrdered.unshift(prevCard);
      currentCard = prevCard;
    }

    currentCard = listCardsDataMap[list.card_ids[0]];
    // push all the next cards
    while (currentCard.next_card_id) {
      const nextCard = listCardsDataMap[currentCard.next_card_id];
      listCardsDataOrdered.push(nextCard);
      currentCard = nextCard;
    }
  }

  const setCards = useSetListCards();
  const listRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const addNewBtnRef = useRef<HTMLButtonElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [listCardDragOver, setListCardDragOver] = useState(false);
  const [isDragAboutToStart, setDragIsAboutToStart] = useState(false);
  const listWrapperRef = useRef<HTMLDivElement | null>(null);
  const [closestDropEdge, setClosestDropEdge] = useState<
    "left" | "right" | null
  >(null);
  const setLists = useSetLists();

  useEffect(() => {
    const listElement = listRef.current;
    const listElementWrapper = listWrapperRef.current;
    const cardsContainerScroll = cardsContainerRef.current;
    const addNewBtnElement = addNewBtnRef.current;
    invariant(listElement);
    invariant(listElementWrapper);
    invariant(cardsContainerScroll);
    invariant(addNewBtnElement);

    return combine(
      draggable({
        element: listElement,
        getInitialData: () => {
          return { type: "list", list: list };
        },
        onGenerateDragPreview() {
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

      // NOTE: drop only for listCard ONLY when list is empty
      dropTargetForElements({
        element: listElement,

        canDrop: ({ source }) => {
          if (source.data.type === "listcard" && list.card_ids.length === 0) {
            return true;
          }
          return false;
        },

        onDragEnter: () => {
          setListCardDragOver(true);
        },

        onDragLeave: () => {
          setListCardDragOver(false);
        },

        // NOTE:  list-card drop logic
        onDrop: ({ source }) => {
          setListCardDragOver(false);

          const cardDragging = source.data.card as main.ListCard;
          // card dragging list
          const cardDraggingList = source.data.list as main.List;
          const setCardDraggingList = source.data.setList as (
            updatedList: main.List,
          ) => void;

          setCards((prev) => {
            const updatedCards = { ...prev! };

            // update the cards prev and next cards
            if (cardDragging.prev_card_id)
              updatedCards[cardDragging.prev_card_id] = {
                ...updatedCards[cardDragging.prev_card_id],
                next_card_id: cardDragging.next_card_id,
              };
            if (cardDragging.next_card_id)
              updatedCards[cardDragging.next_card_id] = {
                ...updatedCards[cardDragging.next_card_id],
                prev_card_id: cardDragging.prev_card_id,
              };

            // update card dragging
            updatedCards[cardDragging.id] = {
              ...cardDragging,
              prev_card_id: undefined,
              next_card_id: undefined,
              list_id: list_id,
            };

            // remove it from the previous list
            setCardDraggingList({
              ...cardDraggingList,
              card_ids: cardDraggingList.card_ids.filter(
                (id) => id !== cardDragging.id,
              ),
            });

            // add it to this list
            setList({
              ...list,
              card_ids: [...list.card_ids, cardDragging.id],
            });

            return updatedCards;
          });
        },
      }),

      // NOTE: drop for lists
      dropTargetForElements({
        element: listElementWrapper,

        canDrop: ({ source }) => {
          if (source.data.type === "list") return true;
          return false;
        },

        // NOTE: decides which edge to drop at left | right
        onDrag: ({ location, source }) => {
          const listDragging = source.data.list as main.List;
          if (listDragging.id === list.id) {
            setClosestDropEdge(null);
            return;
          }

          const rect = listElementWrapper.getBoundingClientRect();
          // no Y position cause that is handled by onDragLeave
          const relativeX = location.current.input.clientX - rect.left;
          const precentageFromLeft = (relativeX / rect.width) * 100;

          if (precentageFromLeft > 50) {
            setClosestDropEdge("right");
          } else if (precentageFromLeft <= 50) {
            setClosestDropEdge("left");
          }
        },

        onDragLeave: () => {
          setClosestDropEdge(null);
        },

        onDrop: ({ source }) => {
          const listDragging = source.data.list as main.List;

          // NOTE: Edge case: when the listDragging and list are the same
          if (closestDropEdge === null || listDragging.id === list.id) return;

          setLists((prev) => {
            if (!prev) return undefined;
            const updatedLists = { ...prev };

            // for left drop
            if (closestDropEdge === "left") {
              // NOTE: Edge case: when dropping list on the same position
              if (listDragging.id === list.prev_list_id) {
                return updatedLists;
              }

              // NOTE: Edge case: swapping two lists
              if (
                listDragging.next_list_id === list.id ||
                listDragging.prev_list_id === list.id
              ) {
                updatedLists[listDragging.id] = {
                  ...updatedLists[listDragging.id],
                  prev_list_id: list.prev_list_id,
                  next_list_id: list.id,
                };

                updatedLists[list.id] = {
                  ...updatedLists[list.id],
                  prev_list_id: listDragging.id,
                  next_list_id: listDragging.next_list_id,
                };

                if (list.prev_list_id)
                  updatedLists[list.prev_list_id] = {
                    ...updatedLists[list.prev_list_id],
                    next_list_id: listDragging.id,
                  };

                if (listDragging.next_list_id)
                  updatedLists[listDragging.next_list_id] = {
                    ...updatedLists[listDragging.next_list_id],
                    prev_list_id: list.id,
                  };

                return updatedLists;
              }

              // =========== Dragging list updates ===============

              // dragging list's prev update
              if (listDragging.prev_list_id)
                updatedLists[listDragging.prev_list_id] = {
                  ...updatedLists[listDragging.prev_list_id],
                  next_list_id: listDragging.next_list_id,
                };

              // dragging list's next update
              if (listDragging.next_list_id)
                updatedLists[listDragging.next_list_id] = {
                  ...updatedLists[listDragging.next_list_id],
                  prev_list_id: listDragging.prev_list_id,
                };

              // =========== Dropping list updates ===============
              if (list.prev_list_id)
                updatedLists[list.prev_list_id] = {
                  ...updatedLists[list.prev_list_id],
                  next_list_id: listDragging.id,
                };

              // list dropped-on update
              updatedLists[list.id] = {
                ...updatedLists[list.id],
                prev_list_id: listDragging.id,
              };

              // list dragging update
              updatedLists[listDragging.id] = {
                ...updatedLists[listDragging.id],
                prev_list_id: list.prev_list_id,
                next_list_id: list.id,
              };
            }

            // For right drop
            else if (closestDropEdge === "right") {
              // NOTE: Edge casea: when dropping list on the same position
              if (listDragging.id === list.next_list_id) {
                return updatedLists;
              }

              // NOTE: Edge case: swapping two lists
              if (
                listDragging.next_list_id === list.id ||
                listDragging.prev_list_id === list.id
              ) {
                updatedLists[listDragging.id] = {
                  ...updatedLists[listDragging.id],
                  prev_list_id: list.id,
                  next_list_id: list.next_list_id,
                };

                updatedLists[list.id] = {
                  ...updatedLists[list.id],
                  prev_list_id: listDragging.prev_list_id,
                  next_list_id: listDragging.id,
                };

                if (listDragging.prev_list_id)
                  updatedLists[listDragging.prev_list_id] = {
                    ...updatedLists[listDragging.prev_list_id],
                    next_list_id: list.id,
                  };

                if (list.next_list_id)
                  updatedLists[list.next_list_id] = {
                    ...updatedLists[list.next_list_id],
                    prev_list_id: listDragging.id,
                  };

                return updatedLists;
              }

              // =========== Dragging list updates ===============

              // dragging list's prev update
              if (listDragging.prev_list_id)
                updatedLists[listDragging.prev_list_id] = {
                  ...updatedLists[listDragging.prev_list_id],
                  next_list_id: listDragging.next_list_id,
                };

              // draggins list's next update
              if (listDragging.next_list_id)
                updatedLists[listDragging.next_list_id] = {
                  ...updatedLists[listDragging.next_list_id],
                  prev_list_id: listDragging.prev_list_id,
                };

              // =========== Dropping list updates ===============
              if (list.next_list_id)
                updatedLists[list.next_list_id] = {
                  ...updatedLists[list.next_list_id],
                  prev_list_id: listDragging.id,
                };

              // list dropped-on update
              updatedLists[list.id] = {
                ...updatedLists[list.id],
                next_list_id: listDragging.id,
              };

              // list dragging update
              updatedLists[listDragging.id] = {
                ...updatedLists[listDragging.id],
                prev_list_id: list.id,
                next_list_id: list.next_list_id,
              };
            }

            return updatedLists;
          });

          setClosestDropEdge(null);
        },
      }),

      autoScrollForElements({
        element: cardsContainerScroll,
      }),

      // NOTE: disable drag for specific elements
      draggable({
        element: addNewBtnElement,
        canDrag: () => {
          return false;
        },
      }),
    );
  }, [closestDropEdge, list]);

  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isCardEditMenuOpen, setIsCardEditMenuOpen] = useState(false);
  const [cardEditMenuData, setCardEditMenuData] = useState<{
    card: main.ListCard;
    clientX: number;
    clientY: number;
  } | null>(null);

  return (
    // NOTE: List wrapper div
    <div ref={listWrapperRef}>
      <div
        className={`relative rounded-md bg-background-secondary flex flex-col min-w-[270px] max-w-[270px] h-fit text-foreground ${isDragAboutToStart && "opacity-50"} ${listCardDragOver ? "bg-border" : ""}`}
        ref={listRef}
      >
        {/* Dropable Edge Hint area left*/}
        <div
          className={`z-10 absolute left-[-7px] h-full w-[2px] bg-blue-300 ${closestDropEdge === "left" ? "opacity-100" : "opacity-0"}`}
        ></div>

        <div className="flex relative pt-2">
          {/* List Title */}
          <TextareaAutoresize
            title={list.title}
            outlineOnDoubleClick
            onChange={(e) => {
              setList({ ...list, title: e.target.value });
            }}
            className={`font-bold mx-4`}
          />

          {/* Edit Menu */}
          <Ellipsis
            className="mx-4 cursor-pointer"
            onClick={() => setIsEditMenuOpen((prev) => !prev)}
          />

          {isEditMenuOpen && <ListEditMenu list={list} />}
        </div>

        {/* List Cards */}
        <div
          className={cn(
            `max-h-[80vh] overflow-y-auto ${listCardDragOver && "bg-border"} flex flex-col px-2 py-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent`,
            list.classname,
          )}
          ref={cardsContainerRef}
        >
          {listCardsDataOrdered.map((card) => {
            if (!card) return null;
            return (
              <ListCard
                key={card.id}
                listcard_id={card.id}
                setIsCardEditMenuOpen={setIsCardEditMenuOpen}
                setCardEditMenuData={setCardEditMenuData}
              />
            );
          })}
        </div>

        {/* ListCard Edit menu (This is here because overflow-y-auto was causing weird behaviour with absolute positioning) */}
        {isCardEditMenuOpen && (
          <ListCardEditMenu
            editMenuData={cardEditMenuData}
            setIsCardEditMenuOpen={setIsCardEditMenuOpen}
            setCardEditMenuData={setCardEditMenuData}
            relativeContainerRef={listRef}
          />
        )}

        {/* Add List Card Button */}
        <AddNewCard
          ref={addNewBtnRef}
          list_id={list.id}
          prev_card_id={
            listCardsDataOrdered[listCardsDataOrdered.length - 1]?.id
          }
        />

        {/* Dropable Edge Hint area right*/}
        <div
          className={`z-10 absolute right-[-7px] h-full w-[2px] bg-blue-300 ${closestDropEdge === "right" ? "opacity-100" : "opacity-0"}`}
        ></div>
      </div>
    </div>
  );
});

import { cn } from "@/lib/utils";
import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { ListCard } from "@/components/ListCard";
import { useList, useListCardsGroup, useSetListCards } from "@/store";
import { memo, useEffect, useRef, useState } from "react";
import { AddNewCard } from "@/components/AddNewCard";
import { main } from "@wailsjs/go/models";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

interface ListProps {
  list_id: string;
}

export const List = memo(({ list_id }: ListProps) => {
  const [list, setList] = useList(list_id);
  if (!list) {
    return (
      <div className="flex flex-col min-w-[270px] max-w-[270px] text-foreground animate-pulse">
        Loding...
      </div>
    );
  }
  let listCardsDataMap = useListCardsGroup(list.card_ids);
  let listCardsDataOrdered: main.ListCard[] = [];
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

  // listcard drag and drop logic TODO: make this droppable for listcard only when empty
  const setCards = useSetListCards();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [listCardDragOver, setListCardDragOver] = useState(false);
  const [isDragAboutToStart, setDragIsAboutToStart] = useState(false);
  useEffect(() => {
    const element = listRef.current;
    invariant(element);

    return combine(
      draggable({
        element: element,
        getInitialData: () => {
          return { type: "list" };
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

      // NOTE: drop only for listCard ONLY when list is empty
      dropTargetForElements({
        element: element,
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
            setList({ ...list, card_ids: [...list.card_ids, cardDragging.id] });

            return updatedCards;
          });
        },
      }),
    );
  });

  return (
    <div
      className={`flex flex-col min-w-[270px] max-w-[270px] h-fit text-foreground ${isDragAboutToStart && "opacity-50"} `}
      ref={listRef}
    >
      {/* List Title */}
      <div
        className={`bg-background-secondary ${listCardDragOver && "bg-border"} pt-2 rounded-t-md`}
      >
        <TextareaAutoresize
          title={list.title}
          outlineOnDoubleClick
          onChange={(e) => {
            setList({ ...list, title: e.target.value });
          }}
          className={`font-bold mx-4`}
        />
      </div>

      {/* List Body */}
      <div
        className={cn(
          `bg-background-secondary ${listCardDragOver && "bg-border"} flex flex-col px-2 py-2 rounded-b-md gap-1.5`,
          list.classname,
        )}
      >
        {
          /* List Cards*/
          listCardsDataOrdered.map((card) => {
            if (!card) return null;
            return <ListCard key={card.id} listcard_id={card.id} />;
          })
        }

        {/* Add List Card Button*/}
        <AddNewCard
          list_id={list.id}
          prev_card_id={
            listCardsDataOrdered[listCardsDataOrdered.length - 1]?.id
          }
        />
      </div>
    </div>
  );
});

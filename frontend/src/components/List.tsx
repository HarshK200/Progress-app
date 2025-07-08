import { cn } from "@/lib/utils";
import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { ListCard } from "@/components/ListCard";
import { useList, useListCardsGroup } from "@/store";
import { memo } from "react";
import { AddNewCard } from "@/components/AddNewCard";
import { main } from "@wailsjs/go/models";

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
  // useEffect(() => {});

  return (
    <div className="flex flex-col min-w-[270px] max-w-[270px] text-foreground">
      {/* List Title */}
      <div className={`bg-background-secondary pt-2 rounded-t-md`}>
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
          `bg-background-secondary flex flex-col px-2 py-2 rounded-b-md gap-1.5`,
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

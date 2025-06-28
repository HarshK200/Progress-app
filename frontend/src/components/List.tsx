import { cn } from "@/lib/utils";
import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { ListCard } from "@/components/ListCard";
import { Plus } from "lucide-react";
import { main } from "@wailsjs/go/models";
import { useList, useSetListCards } from "@/store";
import { memo } from "react";

interface ListProps {
  list_id: string;
}

export const List = memo(({ list_id }: ListProps) => {
  const [list] = useList(list_id);
  if (!list) {
    return (
      <div className="flex flex-col w-[260px] text-foreground">Loding...</div>
    );
  }
  return (
    <div className="flex flex-col w-[260px] text-foreground">
      {/* List Title */}
      <div className={`bg-background-secondary pt-2 rounded-t-md`}>
        <TextareaAutoresize
          title={list.title}
          outlineOnDoubleClick
          className={`font-bold mx-4`}
        />
      </div>

      {/* ListCards */}
      <div
        className={cn(
          `bg-background-secondary flex flex-col px-2 py-2 rounded-b-md gap-1.5`,
          list.classname,
        )}
      >
        {/* List Cards */}
        {list.card_ids.map((card_id) => {
          return <ListCard key={card_id} listcard_id={card_id} />;
        })}

        {/* Add List Card Button*/}
        <AddNewCard list_id={list.id} />
      </div>
    </div>
  );
});

const AddNewCard = ({ list_id }: { list_id: string }) => {
  const [list, setList] = useList(list_id);
  const setListCards = useSetListCards();

  function addNewCard() {
    const DummyCardData: main.ListCard = {
      id: "rando-string-id" + Math.floor(Math.random() * 10000),
      title: "Konichiwaa :>",
      is_done: false,
      board_id: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      list_id: list_id,
    };

    // NOTE: Add the new card_id to the current list
    setList({ ...list!, card_ids: [...list!.card_ids, DummyCardData.id] });

    // NOTE: Add the card to listCards state
    setListCards((prev) => {
      if (!prev) return undefined;

      return { ...prev, [DummyCardData.id]: DummyCardData };
    });
  }

  return (
    <button
      className="flex px-2 py-1 rounded-md gap-2 items-center hover:bg-background/50 transition-all"
      onClick={addNewCard}
    >
      <Plus width={22} />
      <span>New</span>
    </button>
  );
};

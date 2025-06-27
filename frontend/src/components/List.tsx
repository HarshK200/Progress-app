import { cn } from "@/lib/utils";
import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { ListCard } from "@/components/ListCard";
import { Plus } from "lucide-react";
import { main } from "@wailsjs/go/models";
import { useSetDataState } from "@/store";

interface ListProps {
  list: main.List;
  cards: main.ListCard[];
}

export const List = ({ list, cards }: ListProps) => {
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
        {cards.map((card) => {
          return <ListCard key={card.id} card={card} />;
        })}

        {/* Add List Card Button*/}
        <AddNewCard list_id={list.id} />
      </div>
    </div>
  );
};

function AddNewCard({ list_id }: { list_id: string }) {
  const setDataState = useSetDataState();

  function addNewCard() {
    const DummyCardData: main.ListCard = {
      id: "rando-string-id" + Math.floor(Math.random() * 10000),
      title: "Konichiwaa :>",
      is_done: false,
      board_id: "251ab92d-ccff-4e74-ae4e-619ebb3b1752",
      list_id: list_id,
    };

    setDataState((prev) => {
      if (!prev) return undefined;

      const newUserData = new main.UserData();
      newUserData.boards = prev.boards;
      newUserData.lists = {
        ...prev.lists,
        [list_id]: {
          ...prev.lists[list_id],
          card_ids: [...prev.lists[list_id].card_ids, DummyCardData.id],
        },
      };
      newUserData.list_cards = {
        ...prev.list_cards,
        [DummyCardData.id]: DummyCardData, // INSERTING NEW DUMMY CARD
      };
      console.log("prev: ", prev);
      console.log("new: ", newUserData);

      return newUserData;
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
}

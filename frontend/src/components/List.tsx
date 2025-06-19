import { cn } from "@/lib/utils";
import { ListCardT, ListT } from "@/types";
import { EditableText } from "@/components/ui/EditableInput";
import { ListCard } from "@/components/ListCard";
import { Plus } from "lucide-react";

interface ListProps {
  list: ListT;
  cards: ListCardT[];
}

export function List({ list, cards }: ListProps) {
  // HACK: this is just for testing. This should be stored in the List informations like
  // as key listColor which user can set
  const LIST_BG_COLOR = "bg-background-secondary";

  return (
    <div className="flex flex-col w-fit text-foreground">
      {/* List Title */}
      <div className={`${LIST_BG_COLOR} pt-2 rounded-t-md`}>
        <EditableText
          title={list.title}
          outlineOnDoubleClick
          className={`font-bold mx-4`}
        />
      </div>

      <div
        className={cn(
          `${LIST_BG_COLOR} flex flex-col px-2 py-2 rounded-b-md gap-1.5 w-[260px]`,
          list.className,
        )}
      >
        {/* List Cards */}
        {cards.map((card) => {
          return <ListCard card={card} />;
        })}

        {/* Add List Card Button*/}
        <AddNewCard />
      </div>
    </div>
  );
}

function AddNewCard() {
  return (
    <button className="flex px-2 py-1 rounded-md gap-2 items-center hover:bg-background/50 transition-all">
      <Plus width={22} />
      <span>New</span>
    </button>
  );
}

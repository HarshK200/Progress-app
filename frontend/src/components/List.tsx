import { cn } from "@/lib/utils";
import { ListCardT, ListT } from "@/types";
import { EditableText } from "@/components/ui/EditableInput";
import { ListCard } from "@/components/ListCard";

interface ListProps {
  list: ListT;
  cards: ListCardT[];
}

export function List({ list, cards }: ListProps) {
  // HACK: this is just for testing. This should be stored in the List informations like
  // as key listColor which user can set
  const LIST_BG_COLOR = "bg-border";

  return (
    <div
      className={cn(
        `${LIST_BG_COLOR} flex flex-col px-2 py-2 rounded-md gap-1 w-[260px]`,
        list.className,
      )}
    >
      {/* List Heading */}
      <EditableText
        title={list.title}
        outlineOnDoubleClick
        className={`${LIST_BG_COLOR} text-white font-bold px-2`}
      />

      {/* Cards */}
      {cards.map((card) => {
        return <ListCard card={card} />;
      })}
    </div>
  );
}

// TODO: implement add card componenet
export function AddCard() {
  return <div></div>;
}

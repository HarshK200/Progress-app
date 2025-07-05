import { cn } from "@/lib/utils";
import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { ListCard } from "@/components/ListCard";
import { useList } from "@/store";
import { memo } from "react";
import { AddNewCard } from "@/components/AddNewCard";

interface ListProps {
  list_id: string;
}

export const List = memo(({ list_id }: ListProps) => {
  const [list] = useList(list_id);
  if (!list) {
    return (
      <div className="flex flex-col w-[270px] text-foreground">Loding...</div>
    );
  }
  return (
    <div className="flex flex-col w-[270px] text-foreground">
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

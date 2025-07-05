import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { useListCard } from "@/store";
import { SquarePen } from "lucide-react";

interface ListCardProps {
  listcard_id: string;
}

export const ListCard = ({ listcard_id }: ListCardProps) => {
  const [card, setCard] = useListCard(listcard_id);
  if (!card) {
    return (
      <div className="flex items-center w-full rounded-md bg-background">
        Loading...
      </div>
    );
  }

  function toggleCardIsDone(e: React.ChangeEvent<HTMLInputElement>) {
    if (!card) {
      return;
    }
    setCard({ ...card, is_done: e.target.checked });
  }

  return (
    <div className="group flex items-center w-full rounded-md bg-background">
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
        outlineOnClick={false}
        className="ml-3 my-3 rounded-md"
      />

      {/* Edit menu */}
      <SquarePen
        size={20}
        className="group-hover:opacity-100 opacity-0 mx-3 cursor-pointer"
      />
    </div>
  );
};

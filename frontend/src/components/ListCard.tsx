import { useState } from "react";
import { EditableText } from "@/components/ui/EditableInput";
import { ListCardT } from "@/types";
import { useSetDataState } from "@/store";

export function ListCard({ card }: { card: ListCardT }) {
  const [isHovering, setIsHovering] = useState(false);
  const setDataState = useSetDataState();

  function toggleCardIsDone() {
    setDataState((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [card.id]: {
          ...prev.cards[card.id],
          isDone: !prev.cards[card.id].isDone,
        },
      },
    }));
  }

  return (
    <div
      className="flex items-center w-full rounded-md bg-background"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* TODO: add custom checkbox componenet */}

{/* Checkbox */}
      <input
        type="checkbox"
        checked={card.isDone}
        onChange={toggleCardIsDone}
        className={`px-4 mx-2 transition-all duration-500 ${isHovering ? "" : "mx-0 opacity-0"}`}
      />

      {/* Input component */}
      <EditableText title={card.title} outlineOnClick={false} className="p-2" />
    </div>
  );
}

import { useState } from "react";
import { EditableText } from "@/components/ui/EditableInput";
import { ListCardT } from "@/types";

export function ListCard({ card }: { card: ListCardT }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="flex items-center w-full rounded-md bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* TODO: add custom checkbox componenet */}

      {/* Checkbox */}
      <input
        type="checkbox"
        className={`px-4 mx-2 transition-all duration-500 ${isHovering ? "" : "mx-0 opacity-0"}`}
      />

      {/* Input component */}
      <EditableText title={card.title} outlineOnClick={false} className="p-2" />
    </div>
  );
}

import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { TextareaAutoresize } from "@/components/ui/TextareaAutoresize";
import { useListCard } from "@/store";
import { SquarePen } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { ListCardEditMenu } from "@/components/ListCardEditMenu";

interface ListCardProps {
  listcard_id: string;
}

export const ListCard = memo(({ listcard_id }: ListCardProps) => {
  // NOTE: drag-and-drop logic
  const listCardRef = useRef(null);
  const [dragIsAboutToStart, setDragIsAboutToStart] = useState(false);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const element = listCardRef.current;
    invariant(element);

    return combine(
      draggable({
        element: element,
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
      dropTargetForElements({
        element: element,
      }),
    );
  }, []);

  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [card, setCard] = useListCard(listcard_id);
  // NOTE: loading skeleton UI
  if (!card) {
    return (
      <div className="flex items-center w-full h-[42px] rounded-md bg-background animate-pulse"></div>
    );
  }

  function toggleCardIsDone(e: React.ChangeEvent<HTMLInputElement>) {
    if (!card) return;
    setCard({ ...card, is_done: e.target.checked });
  }

  return (
    <>
      <div
        className={`group flex items-center w-full rounded-md bg-background ${dragging || dragIsAboutToStart ? "opacity-50" : ""}`}
        ref={listCardRef}
      >
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
          onChange={(e) => setCard({ ...card, title: e.target.value })}
          outlineOnClick={false}
          className="ml-3 my-3 rounded-md"
        />

        {/* Edit menu */}
        <div className="relative">
          <SquarePen
            size={20}
            className="group-hover:opacity-100 opacity-0 mx-3 cursor-pointer"
            onClick={() => setIsEditMenuOpen((prev) => !prev)}
          />
          {isEditMenuOpen && <ListCardEditMenu listcard={card} />}
        </div>
      </div>
    </>
  );
});

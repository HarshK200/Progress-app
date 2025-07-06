import { cn } from "@/lib/utils";
import { memo, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

interface TextareaAutoresizeProps {
  title: string;
  outlineOnClick?: boolean;
  outlineOnDoubleClick?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextareaAutoresize = memo(
  ({
    title,
    className,
    outlineOnDoubleClick = false,
    outlineOnClick = true,
    onChange,
  }: TextareaAutoresizeProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const textAreaRef = useRef<null | any>(null);
    let shiftIsPressed = false;

    const baseClass = `resize-none select-none border-none bg-inherit`;
    const outlineDblClass = `${!isEditing && outlineOnDoubleClick ? "outline-none" : ""}`;
    const outlineSingleClass = `${outlineOnClick ? "" : !outlineOnDoubleClick && "outline-none"}`;
    const finalClass = cn(
      baseClass,
      outlineSingleClass,
      outlineDblClass,
      className,
    );

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "Shift") {
        console.log("shift keyup: ", shiftIsPressed);
        shiftIsPressed = false;
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsEditing(false);
        shiftIsPressed = false;
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        return;
      }

      if (e.key === "Shift") {
        console.log("shift keydown: ", shiftIsPressed);
        shiftIsPressed = true;
        return;
      }

      if (e.key === "Enter" && !shiftIsPressed) {
        setIsEditing(false);
        shiftIsPressed = false;
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      }
    }

    return (
      <ReactTextareaAutosize
        ref={textAreaRef}
        value={title}
        onChange={onChange}
        className={finalClass}
        readOnly={!isEditing}
        onDoubleClick={() => {
          setIsEditing(true);
          window.addEventListener("keydown", handleKeyDown);
          window.addEventListener("keyup", handleKeyUp);
          textAreaRef.current.select();
        }}
        onBlur={() => {
          setIsEditing(false);
        }}
      />
    );
  },
);

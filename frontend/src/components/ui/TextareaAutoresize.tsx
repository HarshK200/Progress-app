import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

interface TextareaAutoresizeProps {
  title: string;
  outlineOnClick?: boolean;
  outlineOnDoubleClick?: boolean;
  className?: string;
}

export function TextareaAutoresize({
  title,
  className,
  outlineOnDoubleClick = false,
  outlineOnClick = true,
}: TextareaAutoresizeProps) {
  const [inputVal, setInputVal] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const textAreaRef = useRef<null | any>(null);

  const baseClass = `resize-none select-none border-none bg-inherit`;
  const outlineDblClass = `${!isEditing && outlineOnDoubleClick ? "outline-none" : ""}`;
  const outlineSingleClass = `${outlineOnClick ? "" : !outlineOnDoubleClick && "outline-none"}`;
  const finalClass = cn(
    baseClass,
    outlineSingleClass,
    outlineDblClass,
    className,
  );

  function handleEscKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      console.log("Escape key pressed while editing exiting editing mode");
      setIsEditing(false);
      window.removeEventListener("keydown", handleEscKeyDown);
    }
  }

  return (
    <ReactTextareaAutosize
      ref={textAreaRef}
      value={inputVal}
      onChange={(e) => setInputVal(e.target.value)}
      className={finalClass}
      readOnly={!isEditing}
      onDoubleClick={() => {
        setIsEditing(true);
        window.addEventListener("keydown", handleEscKeyDown);
        textAreaRef.current.select();
      }}
      onBlur={() => {
        setIsEditing(false);
      }}
    />
  );
}

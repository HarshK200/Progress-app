import { cn } from "@/lib/utils";
import { memo, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

export type onEnterFunc = (state: {
  prevTitleState: string;
  currentTitleState: string;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string>>;
}) => void;
export type onEscapeFunc = (state: {
  prevTitleState: string;
  currentTitleState: string;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string>>;
}) => void;
export type onBlurFunc = (state: {
  prevTitleState: string;
  currentTitleState: string;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string>>;
}) => void;

interface TextareaAutoresizeProps {
  title: string;
  outlineOnClick?: boolean;
  outlineOnDoubleClick?: boolean;
  className?: string;
  onEnter?: onEnterFunc; // onEnter is called after is editing is set to false
  onEscape?: onEnterFunc; // onEscape is called after is editing is set to false
  onBlur?: onEnterFunc; // onBlur is called after is editing is set to false
}

export const TextareaAutoresize = memo(
  ({
    title,
    className,
    outlineOnDoubleClick = false,
    outlineOnClick = true,
    onEnter,
    onEscape,
    onBlur,
  }: TextareaAutoresizeProps) => {
    const [textAreaValue, setTextAreaValue] = useState(title);
    const [isEditing, setIsEditing] = useState(false);
    const textAreaRef = useRef<null | any>(null);

    const baseClass = `resize-none border-none bg-inherit ${isEditing ? "cursor-text" : "select-none cursor-default"}`;
    const outlineDblClass = `${!isEditing && outlineOnDoubleClick ? "outline-none" : isEditing && "focus:outline-outline"}`;
    const outlineSingleClass = `${outlineOnClick ? isEditing && "focus:outline-outline" : !outlineOnDoubleClick && "outline-none"}`;
    const finalClass = cn(
      baseClass,
      outlineSingleClass,
      outlineDblClass,
      className,
    );

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key.toLowerCase() === "escape") {
        // make the textArea readOnly
        setIsEditing(false);

        // de-select the text
        textAreaRef.current.setSelectionRange(0, 0);
        textAreaRef.current.blur();

        // reset the input value to original title since update UserAction was canceled
        setTextAreaValue(title);

        onEscape?.({
          prevTitleState: title,
          currentTitleState: textAreaValue,
          setTextAreaValue: setTextAreaValue,
        });
        return;
      }

      if (e.key.toLowerCase() === "enter" && !e.shiftKey) {
        // de-select the text
        textAreaRef.current.setSelectionRange(0, 0);
        textAreaRef.current.blur();

        // make the textArea readOnly
        setIsEditing(false);

        onEnter?.({
          prevTitleState: title,
          currentTitleState: textAreaValue,
          setTextAreaValue: setTextAreaValue,
        });
        return;
      }
    }

    function handleBlur() {
      setIsEditing(false);

      onBlur?.({
        prevTitleState: title,
        currentTitleState: textAreaValue,
        setTextAreaValue: setTextAreaValue,
      });
    }

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      setTextAreaValue(e.target.value);
    }

    return (
      <ReactTextareaAutosize
        ref={textAreaRef}
        value={textAreaValue}
        onChange={handleChange}
        className={finalClass}
        readOnly={!isEditing}
        onDoubleClick={() => {
          setIsEditing(true);
          textAreaRef.current.select();
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    );
  },
);

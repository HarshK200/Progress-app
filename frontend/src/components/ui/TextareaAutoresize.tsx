import { cn } from "@/lib/utils";
import { memo, useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import invariant from "tiny-invariant";

export type onEnterFunc = (state: {
  prevTitleState: string;
  currentTitleState: string;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string>>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}) => void;
export type onEscapeFunc = (state: {
  prevTitleState: string;
  currentTitleState: string;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string>>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}) => void;
export type onBlurFunc = (state: {
  prevTitleState: string;
  currentTitleState: string;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string>>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
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
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const baseClass = `resize-none border-none bg-inherit ${isEditing ? "cursor-text" : "select-none cursor-default"}`;
    const outlineDblClass = `${!isEditing && outlineOnDoubleClick ? "outline-none" : isEditing && "focus:outline-outline"}`;
    const outlineSingleClass = `${outlineOnClick ? isEditing && "focus:outline-outline" : !outlineOnDoubleClick && "outline-none"}`;
    const finalClass = cn(
      baseClass,
      outlineSingleClass,
      outlineDblClass,
      className,
    );

    // NOTE: this is for the BUG fix i.e. the textAreaValue doesn't update when i use setTextAreaValue outside of this function by passing to onEnterFunc
    useEffect(() => {
      if (!isEditing) {
        setTextAreaValue(title);
      }
    }, [title, isEditing]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      invariant(textAreaRef.current);

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
          textAreaRef: textAreaRef,
        });
        return;
      }

      if (e.key.toLowerCase() === "enter" && !e.shiftKey) {
        // make the textArea readOnly
        setIsEditing(false);

        onEnter?.({
          prevTitleState: title,
          currentTitleState: textAreaValue,
          setTextAreaValue: setTextAreaValue,
          textAreaRef: textAreaRef,
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
        textAreaRef: textAreaRef,
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
          textAreaRef?.current?.select();
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    );
  },
);

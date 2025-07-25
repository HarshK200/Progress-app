import {
  onEnterFunc,
  onEscapeFunc,
  TextareaAutoresize,
} from "@/components/ui/TextareaAutoresize";
import {
  useList,
  useListCard,
  UserAction,
  useSetListCards,
  useSetLists,
  useSetRedoActions,
  useSetUndoActions,
} from "@/store";
import { Plus, SquarePen } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { main } from "@wailsjs/go/models";

interface ListCardProps {
  listcard_id: string;
  setIsCardEditMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCardEditMenuData: React.Dispatch<
    React.SetStateAction<{
      card: main.ListCard;
      clientX: number;
      clientY: number;
    } | null>
  >;
}

export const ListCard = memo(
  ({
    listcard_id,
    setIsCardEditMenuOpen,
    setCardEditMenuData,
  }: ListCardProps) => {
    const [card, setCard] = useListCard(listcard_id);
    // NOTE: loading skeleton UI
    if (!card) {
      return (
        <div className="py-[3px]">
          <div className="flex items-center w-full h-[42px] rounded-md bg-background animate-pulse"></div>
        </div>
      );
    }

    function toggleCardIsDone(e: React.ChangeEvent<HTMLInputElement>) {
      if (!card) return;
      setCard({ ...card, is_done: e.target.checked });
    }

    // NOTE: drag-and-drop logic
    const [list, setList] = useList(card.list_id);
    const setLists = useSetLists();
    const setCards = useSetListCards();

    const listCardRef = useRef<HTMLDivElement | null>(null);
    const listCardWrapperRef = useRef<HTMLDivElement | null>(null);
    const [dragIsAboutToStart, setDragIsAboutToStart] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [closestDroppableEdge, setClosestDroppableEdge] = useState<
      "top" | "bottom" | null
    >(null);
    const setUndoActions = useSetUndoActions();
    const setRedoActions = useSetRedoActions();

    useEffect(() => {
      const elementWrapper = listCardWrapperRef.current;
      const element = listCardRef.current;
      invariant(element);
      invariant(elementWrapper);

      return combine(
        draggable({
          element: element,
          getInitialData: () => {
            return {
              type: "listcard",
              card,
              list,
              setList,
            };
          },
          onGenerateDragPreview({}) {
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

        // NOTE: drop logic for listcard on listcard
        dropTargetForElements({
          element: element,

          // NOTE: this is just so that the drag doesn't trigger when dragging lists
          canDrop: ({ source }) => {
            if (source.data.type === "listcard") return true;
            return false;
          },

          onDrop: ({ source }) => {
            // card dragging
            const cardDragging = source.data.card as main.ListCard;

            // NOTE: Edge case: when the cardDragging and card are the same
            if (cardDragging.id === card.id) return;

            if (!list) return;
            if (!closestDroppableEdge) return;
            const newUserAction: UserAction = {
              type: "listcard-reorder",
              undoFunc: () => {},
              redoFunc: () => {},
            };

            // NOTE: attach card top-side
            if (closestDroppableEdge === "top") {
              // if moving card from one list to another (remove from prev and add to new)
              // else do nothing
              setLists((prevLists) => {
                const updatedLists = {
                  ...prevLists,
                };
                if (card.list_id !== cardDragging.list_id) {
                  updatedLists[list.id] = {
                    ...updatedLists[list.id],
                    card_ids: [
                      ...updatedLists[list.id].card_ids,
                      cardDragging.id,
                    ],
                  };
                  updatedLists[cardDragging.list_id] = {
                    ...updatedLists[cardDragging.list_id],
                    card_ids: updatedLists[
                      cardDragging.list_id
                    ].card_ids.filter((card_id) => card_id !== cardDragging.id),
                  };
                }

                setCards((prevCards) => {
                  if (!prevCards) return undefined;
                  const updatedCards = { ...prevCards };

                  // NOTE: Edge case: when dropping card on the same position
                  if (card.prev_card_id === cardDragging.id) {
                    return updatedCards;
                  }

                  // =========================== Undo Func (Common for top drop) ===========================
                  newUserAction.undoFunc = () => {
                    // reset the list
                    setLists(() => {
                      return { ...prevLists };
                    });

                    // reset the list cards
                    setCards(() => {
                      return { ...prevCards };
                    });
                  };

                  // NOTE: Edge case: when swapping two cards in the same list
                  if (
                    cardDragging.prev_card_id === card.id ||
                    cardDragging.next_card_id === card.id
                  ) {
                    updatedCards[card.id] = {
                      ...card,
                      prev_card_id: cardDragging.id,
                      next_card_id: cardDragging.next_card_id,
                    };
                    updatedCards[cardDragging.id] = {
                      ...cardDragging,
                      prev_card_id: card.prev_card_id,
                      next_card_id: card.id,
                    };
                    if (card.prev_card_id)
                      updatedCards[card.prev_card_id] = {
                        ...updatedCards[card.prev_card_id],
                        next_card_id: cardDragging.id,
                      };
                    if (cardDragging.next_card_id)
                      updatedCards[cardDragging.next_card_id] = {
                        ...updatedCards[cardDragging.next_card_id],
                        prev_card_id: card.id,
                      };

                    // =========================== Redo Func (swapping edge case TOP) ===========================
                    newUserAction.redoFunc = () => {
                      // if moving card from one list to another (remove from prev and add to new)
                      // else do nothing
                      if (card.list_id !== cardDragging.list_id) {
                        setLists(() => {
                          return { ...updatedLists };
                        });
                      }

                      // update the list cards
                      setCards(() => {
                        return { ...updatedCards };
                      });
                    };
                    setUndoActions((prevUndoActions) => {
                      const updatedUndoActions = [...prevUndoActions];
                      updatedUndoActions.push(newUserAction);
                      return updatedUndoActions;
                    });
                    // NOTE: flush the redo-stack
                    setRedoActions([]);

                    // NOTE: early return for edge case
                    return updatedCards;
                  }

                  if (cardDragging.prev_card_id) {
                    // =========== Dragging card updates ===============

                    // dragging card's prev update
                    updatedCards[cardDragging.prev_card_id] = {
                      ...updatedCards[cardDragging.prev_card_id],
                      next_card_id: cardDragging.next_card_id,
                    };
                  }
                  // dragging card's next update
                  if (cardDragging.next_card_id) {
                    updatedCards[cardDragging.next_card_id] = {
                      ...updatedCards[cardDragging.next_card_id],
                      prev_card_id: cardDragging.prev_card_id,
                    };
                  }

                  // =========== Dropping card updates ===============

                  // card dropped-on's prev card update
                  if (card.prev_card_id) {
                    updatedCards[card.prev_card_id] = {
                      ...updatedCards[card.prev_card_id],
                      next_card_id: cardDragging.id,
                    };
                  }

                  // card dropped-on update
                  updatedCards[card.id] = {
                    ...card,
                    prev_card_id: cardDragging.id,
                  };

                  // dropping card update
                  updatedCards[cardDragging.id] = {
                    ...cardDragging,
                    prev_card_id: card.prev_card_id,
                    next_card_id: card.id,
                    list_id: card.list_id,
                  };

                  // =========================== Redo Func (drop TOP) ===========================
                  newUserAction.redoFunc = () => {
                    // if moving card from one list to another (remove from prev and add to new)
                    // else do nothing
                    if (card.list_id !== cardDragging.list_id) {
                      setLists(() => {
                        return { ...updatedLists };
                      });
                    }

                    // reset the list cards
                    setCards(() => {
                      return { ...updatedCards };
                    });
                  };
                  setUndoActions((prevUndoActions) => {
                    const updatedUndoActions = [...prevUndoActions];
                    updatedUndoActions.push(newUserAction);
                    return updatedUndoActions;
                  });
                  // NOTE: flush the redo-stack
                  setRedoActions([]);

                  return updatedCards;
                });

                return updatedLists;
              });
            }

            // attach card bottom-side
            else if (closestDroppableEdge === "bottom") {
              // if moving card from one list to another (remove from prev and add to new)
              // else do nothing
              setLists((prevLists) => {
                const updatedLists = {
                  ...prevLists,
                };
                if (card.list_id !== cardDragging.list_id) {
                  updatedLists[list.id] = {
                    ...updatedLists[list.id],
                    card_ids: [
                      ...updatedLists[list.id].card_ids,
                      cardDragging.id,
                    ],
                  };
                  updatedLists[cardDragging.list_id] = {
                    ...updatedLists[cardDragging.list_id],
                    card_ids: updatedLists[
                      cardDragging.list_id
                    ].card_ids.filter((card_id) => card_id !== cardDragging.id),
                  };
                }

                setCards((prevCards) => {
                  const updatedCards = { ...prevCards! };

                  // NOTE: Edge case when card dropping is in the same position
                  if (
                    card.next_card_id === cardDragging.id ||
                    card.id === cardDragging.id
                  ) {
                    return updatedCards;
                  }

                  // =========================== Undo Func (Common for top drop) ===========================
                  newUserAction.undoFunc = () => {
                    // reset the list
                    setLists(() => {
                      return { ...prevLists };
                    });

                    // reset the list cards
                    setCards(() => {
                      return { ...prevCards };
                    });
                  };

                  // NOTE: swap edge case
                  if (
                    cardDragging.prev_card_id === card.id ||
                    cardDragging.next_card_id === card.id
                  ) {
                    updatedCards[card.id] = {
                      ...card,
                      next_card_id: cardDragging.id,
                      prev_card_id: cardDragging.prev_card_id,
                    };
                    updatedCards[cardDragging.id] = {
                      ...cardDragging,
                      next_card_id: card.next_card_id,
                      prev_card_id: card.id,
                    };
                    if (card.next_card_id)
                      updatedCards[card.next_card_id] = {
                        ...updatedCards[card.next_card_id],
                        prev_card_id: cardDragging.id,
                      };
                    if (cardDragging.prev_card_id)
                      updatedCards[cardDragging.prev_card_id] = {
                        ...updatedCards[cardDragging.prev_card_id],
                        next_card_id: card.id,
                      };

                    // =========================== Redo Func (swapping edge case BOTTOM) ===========================
                    newUserAction.redoFunc = () => {
                      // push the cardDragging's id to list's card_ids again
                      if (card.list_id !== cardDragging.list_id) {
                        setLists(() => {
                          return { ...updatedLists };
                        });
                      }

                      // update the list cards
                      setCards(() => {
                        return { ...updatedCards };
                      });
                    };
                    setUndoActions((prevUndoActions) => {
                      const updatedUndoActions = [...prevUndoActions];
                      updatedUndoActions.push(newUserAction);
                      return updatedUndoActions;
                    });
                    // NOTE: flush the redo-stack
                    setRedoActions([]);

                    return updatedCards;
                  }

                  // =========== Dragging card updates ===============

                  if (cardDragging.prev_card_id) {
                    updatedCards[cardDragging.prev_card_id] = {
                      ...updatedCards[cardDragging.prev_card_id],
                      next_card_id: cardDragging.next_card_id,
                    };
                  }
                  if (cardDragging.next_card_id) {
                    updatedCards[cardDragging.next_card_id] = {
                      ...updatedCards[cardDragging.next_card_id],
                      prev_card_id: cardDragging.prev_card_id,
                    };
                  }

                  // =========== Dropping card updates ===============

                  if (card.next_card_id) {
                    updatedCards[card.next_card_id] = {
                      ...updatedCards[card.next_card_id],
                      prev_card_id: cardDragging.id,
                    };
                  }

                  updatedCards[cardDragging.id] = {
                    ...cardDragging,
                    prev_card_id: card.id,
                    next_card_id: card.next_card_id,
                    list_id: card.list_id,
                  };

                  updatedCards[card.id] = {
                    ...card,
                    next_card_id: cardDragging.id,
                  };

                  // =========================== Redo Func (drop BOTTOM) ===========================
                  newUserAction.redoFunc = () => {
                    // push the cardDragging's id to list's card_ids again
                    if (card.list_id !== cardDragging.list_id)
                      setLists(() => {
                        return { ...updatedLists };
                      });

                    // update the list cards
                    setCards(() => {
                      return { ...updatedCards };
                    });
                  };
                  setUndoActions((prevUndoActions) => {
                    const updatedUndoActions = [...prevUndoActions];
                    updatedUndoActions.push(newUserAction);
                    return updatedUndoActions;
                  });
                  // NOTE: flush the redo-stack
                  setRedoActions([]);

                  return updatedCards;
                });
                return updatedLists;
              });
            }

            setClosestDroppableEdge(null);
          },
        }),

        // NOTE: decides which section the drag is top | bottom
        dropTargetForElements({
          element: elementWrapper,

          canDrop: ({ source }) => {
            if (source.data.type !== "listcard") return false;
            return true;
          },

          onDrag: ({ location, source }) => {
            const cardDragging = source.data.card as main.ListCard;
            if (cardDragging.id === card.id) {
              setClosestDroppableEdge(null);
              return;
            }

            const rect = elementWrapper.getBoundingClientRect();
            // no X position cause that is handled by onDragLeave
            const relativeY = location.current.input.clientY - rect.top;
            const percentageFromTop = (relativeY / rect.height) * 100;

            if (percentageFromTop > 50 && percentageFromTop <= 100) {
              setClosestDroppableEdge("bottom");
            }

            if (percentageFromTop >= 0 && percentageFromTop <= 50) {
              setClosestDroppableEdge("top");
            }
          },

          onDragLeave: () => {
            setClosestDroppableEdge(null);
          },

          onDrop: () => {
            setClosestDroppableEdge(null);
          },
        }),
      );
    }, [closestDroppableEdge, card, list]);
    // NOTE: the closestDroppableEdge, card and list are in the dependency array to prevent the closure issue

    const isEnterPressed = useRef<boolean>(false);

    const onEnterListCard: onEnterFunc = ({
      prevTitleState,
      currentTitleState,
      textAreaRef,
    }) => {
      if (prevTitleState === currentTitleState) return;

      invariant(textAreaRef.current);
      isEnterPressed.current = true;
      // NOTE:de-select the text
      textAreaRef.current.setSelectionRange(0, 0);
      textAreaRef.current.blur();

      // NOTE: update listcard's title in listcard map
      setCard({ ...card, title: currentTitleState });

      // NOTE: push new UserAction to undo stack
      setUndoActions((prev) => {
        const updatedUndoActions = [...prev];
        const newUserAction: UserAction = {
          type: "listcard-rename",

          // undo
          undoFunc: () => {
            // reset the listcard's title state
            setCard({ ...card, title: prevTitleState });
          },

          // redo
          redoFunc: () => {
            // update the listcard's title state back to current
            setCard({ ...card, title: currentTitleState });
          },
        };

        updatedUndoActions.push(newUserAction);

        return updatedUndoActions;
      });

      // NOTE: flush the redo stack
      setRedoActions([]);

      isEnterPressed.current = false;
    };
    const onBlurListCard: onEscapeFunc = (state) => {
      if (!isEnterPressed.current) {
        onEnterListCard(state);
      }
    };

    return (
      // List card wrapper
      <div className="py-[3px]" ref={listCardWrapperRef}>
        {/* List card */}
        <div
          className={`relative group flex items-center w-full rounded-md bg-background ${dragging || dragIsAboutToStart ? "opacity-50" : ""} ${dragIsAboutToStart ? "rotate-6" : ""}`}
          ref={listCardRef}
        >
          {/* Dropable Area Hint Top */}
          <div
            className={`z-10 absolute w-full h-[2px] bg-drop-hint ${closestDroppableEdge === "top" ? "opacity-100" : "opacity-0"} -top-1`}
            onDrag={() => {
              console.log("i'm dragged over");
            }}
            onDrop={() => {
              console.log("dropped on hint");
            }}
          >
            <Plus
              size={14}
              className="absolute text-white bg-drop-hint rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>

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
            onEnter={onEnterListCard}
            onBlur={onBlurListCard}
            outlineOnClick={false}
            className="ml-3 my-3 rounded-sm overflow-hidden"
          />

          {/* ListCard Edit Trigger */}
          <div>
            <SquarePen
              size={20}
              className="group-hover:opacity-100 opacity-0 mx-3 cursor-pointer"
              onClick={(e) => {
                setIsCardEditMenuOpen((prev) => {
                  // cleanup and close if already open
                  if (prev === true) {
                    setCardEditMenuData(null);
                    return false;
                  }

                  // set edit menu data
                  setCardEditMenuData({
                    card: card,
                    clientX: e.clientX,
                    clientY: e.clientY,
                  });

                  return true;
                });
              }}
            />
          </div>

          {/* Dropable Area Hint Bottom */}
          <div
            className={`z-10 absolute w-full h-[2px] bg-drop-hint ${closestDroppableEdge === "bottom" ? "opacity-100" : "opacity-0"} -bottom-1`}
          >
            <Plus
              size={14}
              className="absolute text-white bg-drop-hint rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
    );
  },
);

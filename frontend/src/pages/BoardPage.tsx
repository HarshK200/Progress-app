import { List } from "@/components/List";
import { useDataStateValue } from "@/store";

interface BoardPageProps {
  boardId: string;
}

export default function BoardPage({ boardId }: BoardPageProps) {
  const dataState = useDataStateValue();

  if (!dataState) {
    return (
      <main className="w-full min-h-screen flex p-4 gap-3 overflow-x-auto"></main>
    );
  }

  const board = dataState.boards[boardId];
  return (
    <main className="w-full min-h-screen flex p-4 gap-3 overflow-x-auto">
      {board.list_ids.map((list_id) => {
        const list = dataState.lists[list_id];
        const listCards = list.card_ids.map(
          (card_id) => dataState.list_cards[card_id],
        );

        return <List key={list.id} list={list} cards={listCards} />;
      })}
    </main>
  );
}

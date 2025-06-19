import { List } from "@/components/List";
import { useDataStateValue } from "@/store";

interface BoardPageProps {
  boardId: string;
}

export default function BoardPage({ boardId }: BoardPageProps) {
  const dataState = useDataStateValue();
  const board = dataState.boards[boardId];

  return (
    <main className="w-full h-full flex m-4 gap-3">
      {board.ListIds.map((listId) => {
        const list = dataState.lists[listId];
        const listCards = list.CardIds.map((cardId) => dataState.cards[cardId]);

        return <List key={list.id} list={list} cards={listCards} />;
      })}
    </main>
  );
}

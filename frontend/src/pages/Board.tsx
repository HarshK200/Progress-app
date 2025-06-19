import { List } from "@/components/List";
import { useDataStateValue } from "@/store";

interface BoardPageProps {
  boardId: string;
}

export default function BoardPage({ boardId }: BoardPageProps) {
  const dataState = useDataStateValue();

  const lists = Object.values(dataState.lists).filter(
    (list) => list.BoardId === boardId,
  );

  return (
    <main className="w-full h-full flex m-4 gap-3">
      {lists.map((list) => {
        const listCards = list.CardIds.map((cardId) => dataState.cards[cardId]);

        return <List list={list} cards={listCards} />;
      })}
    </main>
  );
}

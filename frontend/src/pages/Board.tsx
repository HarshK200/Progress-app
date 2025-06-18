import { List } from "@/components/List";
import { useBoardAtom } from "@/store";

export default function BoardPage() {
  const [boards] = useBoardAtom();

  return (
    <main className="w-full h-full flex m-4 gap-3">
      {boards[0].lists.map((list) => {
        const listCards = boards[0].listCards.filter(
          (card) => card.listId === list.id,
        );

        return <List list={list} cards={listCards} />;
      })}
    </main>
  );
}

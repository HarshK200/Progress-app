import { List } from "@/components/List";
import { useBoardsValue } from "@/store";

interface BoardPageProps {
  board_id: string;
}

const BoardPage = ({ board_id }: BoardPageProps) => {
  const boards = useBoardsValue();

  if (!boards) {
    return (
      <main className="w-full min-h-screen flex p-4 gap-3 overflow-x-auto">
        Loading...
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen flex p-4 gap-3 overflow-x-auto">
      {boards[board_id].list_ids.map((list_id) => {
        return <List key={list_id} list_id={list_id} />;
      })}
    </main>
  );
};

export default BoardPage;

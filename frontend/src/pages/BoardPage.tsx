import { AddNewList } from "@/components/AddNewList";
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
  if (!boards[board_id]) {
    return (
      <main className="w-full min-h-screen flex p-4 gap-3 overflow-x-auto">
        Invalid board Id
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen flex p-4 gap-3 overflow-x-auto">
      {
        /* Lists */
        boards[board_id].list_ids.map((list_id) => {
          return <List key={list_id} list_id={list_id} />;
        })
      }

      {/* Add New List */}
      <AddNewList board_id={board_id} />
    </main>
  );
};

export default BoardPage;

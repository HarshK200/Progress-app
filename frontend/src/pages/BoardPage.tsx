import { AddNewList } from "@/components/AddNewList";
import { List } from "@/components/List";
import { useBoardsValue, useListGroup } from "@/store";
import { main } from "@wailsjs/go/models";
import { useMemo } from "react";

interface BoardPageProps {
  board_id: string;
}

const BoardPage = ({ board_id }: BoardPageProps) => {
  const boards = useBoardsValue();
  const list_ids = useMemo(
    () => boards?.[board_id]?.list_ids ?? [],
    [boards, board_id],
  );
  const listsDataMap = useListGroup(list_ids);

  // loading skeleton UI
  if (!boards) {
    return (
      <main className="w-full min-h-screen flex p-4 gap-3 overflow-x-auto"></main>
    );
  }

  const board = boards[board_id];
  if (!board) {
    return (
      <main className="w-full min-h-screen flex p-4 gap-3 overflow-x-auto">
        Invalid board Id
      </main>
    );
  }

  const orderedLists: main.List[] = [];
  if (board.list_ids.length > 0) {
    let currentList = listsDataMap[board.list_ids[0]];
    orderedLists.push(currentList);

    // push the lists before
    while (currentList.prev_list_id) {
      const prev_list = listsDataMap[currentList.prev_list_id];
      orderedLists.unshift(prev_list);
      currentList = prev_list;
    }

    currentList = listsDataMap[board.list_ids[0]];

    // push the lists after
    while (currentList.next_list_id) {
      const next_list = listsDataMap[currentList.next_list_id];
      orderedLists.push(next_list);
      currentList = next_list;
    }
  }

  return (
    <main className="w-full min-h-screen flex p-4 gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-background-secondary scrollbar-track-transparent">
      {
        /* Lists */
        orderedLists.map((list) => {
          return <List key={list.id} list_id={list.id} />;
        })
      }

      {/* Add New List */}
      <AddNewList
        board_id={board_id}
        prev_list_id={orderedLists[orderedLists.length - 1]?.id}
      />
    </main>
  );
};

export default BoardPage;

export type DataState = {
  boards: Record<string, BoardT>;
  lists: Record<string, ListT>;
  cards: Record<string, ListCardT>;
};

export type BoardT = {
  id: string;
  name: string;
};

export type ListT = {
  id: string;
  BoardId: string;
  title: string;
  className?: string;
  CardIds: string[];
};

export type ListCardT = {
  id: string;
  BoardId: string;
  listId: string;
  title: string;
  isDone: boolean;
};

export type DataState = {
  boards: Record<string, BoardT>;
  lists: Record<string, ListT>;
  cards: Record<string, ListCardT>;
};

export type BoardT = {
  id: string;
  name: string;
  ListIds: string[];
};

export type ListT = {
  id: string;
  title: string;
  className?: string;
  BoardId: string;
  CardIds: string[];
};

export type ListCardT = {
  id: string;
  title: string;
  isDone: boolean;
  BoardId: string;
  ListId: string;
};

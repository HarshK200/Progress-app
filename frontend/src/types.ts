export type BoardT = {
  id: string;
  name: string;
  lists: ListT[];
  listCards: ListCardT[];
};

export type ListT = {
  id: number;
  title: string;
  className?: string;
  CardIds: string[];
};

export type ListCardT = {
  id: string;
  listId: number;
  title: string;
  isDone: boolean;
};

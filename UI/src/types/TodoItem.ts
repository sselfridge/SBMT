export interface TodoItem {
  id: number;
  name: string | null;
  isComplete: boolean;
  secret: string | null;
}

export interface TodoItemDTO {
  id: number;
  name: string | null;
  isComplete: boolean;
}

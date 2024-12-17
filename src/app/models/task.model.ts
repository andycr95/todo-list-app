export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string | null;
  emoji: string | null;
  priority?: 'high' | 'medium' | 'low' | null;
}

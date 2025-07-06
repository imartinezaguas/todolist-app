export interface TaskCategory {
  id: number;
  name: string;
  task:Tasks[]
}


export interface Tasks {
  id: number;
  title: string;
  complete: boolean;
  categoryId: number;
}

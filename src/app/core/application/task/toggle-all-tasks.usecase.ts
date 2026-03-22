import { Inject, Injectable } from "@angular/core";
import { TASK_REPOSITORY_TOKEN, TaskRepository } from "../../domain/repositories/task-respositories";
import { TodoTask } from "../../domain/entities/task";

@Injectable({ providedIn: 'root' })
export class ToggleAllTasksUseCase {
   constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepo: TaskRepository
  ) {}

  async execute(categoryId: string, completed: boolean): Promise<TodoTask[]> {
    return this.taskRepo.toggleAllTasks(categoryId, completed);
  }
}

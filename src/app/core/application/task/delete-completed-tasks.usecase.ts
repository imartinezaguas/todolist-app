import { Inject, Injectable } from "@angular/core";
import { TASK_REPOSITORY_TOKEN, TaskRepository } from "../../domain/repositories/task-respositories";
import { TodoTask } from "../../domain/entities/task";

@Injectable({ providedIn: 'root' })
export class DeleteCompletedTasksUseCase {
   constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepo: TaskRepository
  ) {}

  async execute(categoryId: string): Promise<TodoTask[]> {
    return this.taskRepo.deleteCompletedTasks(categoryId);
  }
}

import { Inject, Injectable } from "@angular/core";
import { TASK_REPOSITORY_TOKEN, TaskRepository } from "../../domain/repositories/task-respositories";
import { TodoTask } from "../../domain/entities/task";

@Injectable({ providedIn: 'root' })
export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepo: TaskRepository
  ) {}

  async execute(categoryId: string, index: number, newTitle: string): Promise<TodoTask[]> {
    return this.taskRepo.updateTask(categoryId, index, newTitle);
  }
}

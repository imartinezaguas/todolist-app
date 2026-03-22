import { InjectionToken } from '@angular/core';
import { TodoTask } from '../entities/task';

export interface TaskRepository {
  getTasks(categoryId: string): Promise<TodoTask[]>;
  addTask(categoryId: string, taskTitle: string): Promise<TodoTask[]>;
  toggleTask(categoryId: string, index: number): Promise<TodoTask[]>;
  deleteTask(categoryId: string, index: number): Promise<TodoTask[]>;
  deleteCompletedTasks(categoryId: string): Promise<TodoTask[]>;
  toggleAllTasks(categoryId: string, completed: boolean): Promise<TodoTask[]>;
  updateTask(categoryId: string, index: number, newTitle: string): Promise<TodoTask[]>;
}

export const TASK_REPOSITORY_TOKEN = new InjectionToken<TaskRepository>('TASK_REPOSITORY');

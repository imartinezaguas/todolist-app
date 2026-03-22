import { Injectable } from '@angular/core';
import { TodoTask } from '../../domain/entities/task';
import { StorageService } from '../services/storage.service';
import { TaskRepository } from '../../domain/repositories/task-respositories';
import { CATEGORY_KEY } from '../../presentation/constants/const';
import { Category } from '../../domain/entities/category';

@Injectable({ providedIn: 'root' })
export class StorageTaskRepository implements TaskRepository {
  constructor(private storage: StorageService) {}

  private async getCategories(): Promise<Category[]> {
    return (await this.storage.get<Category[]>(CATEGORY_KEY)) ?? [];
  }

  async getTasks(categoryId: string): Promise<TodoTask[]> {
    const categories = await this.getCategories();
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.tasks : [];
  }

  async addTask(categoryId: string, taskTitle: string): Promise<TodoTask[]> {
    const categories = await this.getCategories();
    const category = categories.find((c) => c.id === categoryId);

    if (!category) return [];

    const newTask: TodoTask = { title: taskTitle, completed: false };
    category.tasks.push(newTask);

    category.total = category.tasks.length;
    category.completed = category.tasks.filter((t) => t.completed).length;

    await this.storage.set(CATEGORY_KEY, categories);
    return category.tasks;
  }

  async toggleTask(categoryId: string, index: number): Promise<TodoTask[]> {
    const categories = await this.getCategories();
    const category = categories.find((c) => c.id === categoryId);

    if (!category || !category.tasks[index]) return [];

    category.tasks[index].completed = !category.tasks[index].completed;
    category.completed = category.tasks.filter((t) => t.completed).length;

    await this.storage.set(CATEGORY_KEY, categories);
    return category.tasks;
  }

  async deleteTask(categoryId: string, index: number): Promise<TodoTask[]> {
    const categories = await this.getCategories();
    const category = categories.find((c) => c.id === categoryId);

    if (!category) return [];

    category.tasks.splice(index, 1);


    category.total = category.tasks.length;
    category.completed = category.tasks.filter((t) => t.completed).length;

    await this.storage.set(CATEGORY_KEY, categories);
    return category.tasks;
  }
  async deleteCompletedTasks(categoryId: string): Promise<TodoTask[]> {
    const categories = await this.getCategories();
    const category = categories.find((c) => c.id === categoryId);

    if (!category) return [];

    category.tasks = category.tasks.filter(t => !t.completed);
    category.total = category.tasks.length;
    category.completed = 0;

    await this.storage.set(CATEGORY_KEY, categories);
    return category.tasks;
  }

  async toggleAllTasks(categoryId: string, completed: boolean): Promise<TodoTask[]> {
    const categories = await this.getCategories();
    const category = categories.find((c) => c.id === categoryId);

    if (!category) return [];

    category.tasks.forEach(t => t.completed = completed);
    category.completed = completed ? category.tasks.length : 0;

    await this.storage.set(CATEGORY_KEY, categories);
    return category.tasks;
  }

  async updateTask(categoryId: string, index: number, newTitle: string): Promise<TodoTask[]> {
    const categories = await this.getCategories();
    const category = categories.find((c) => c.id === categoryId);

    if (!category) return [];

    if (category.tasks[index]) {
      category.tasks[index].title = newTitle;
    }

    await this.storage.set(CATEGORY_KEY, categories);
    return category.tasks;
  }
}

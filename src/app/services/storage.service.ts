import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TaskCategory } from '../interface/ITaskBoard';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    this._storage = await this.storage.create();
  }

  private async ensureStorageReady() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  async saveCategory(name: string, addCategoryTask?: TaskCategory) {
    console.log("addCategoryTask")
    await this.ensureStorageReady();

    let newCategory: TaskCategory;

    if (addCategoryTask) {
      newCategory = addCategoryTask;

    } else {

      newCategory = {
        id: Date.now(),
        name: name,
        task: [],
      };
    }

    console.log(newCategory)
    await this._storage?.set(name, newCategory);
  }

  async getCategory(name: string): Promise<TaskCategory> {
    await this.ensureStorageReady();
    return await this._storage?.get(name);
  }

  async getAllCategories(): Promise<TaskCategory[]> {
    await this.ensureStorageReady();
    const keys = (await this._storage?.keys()) ?? [];
    const categorias: TaskCategory[] = [];
    for (const key of keys) {
      const categoria = await this._storage?.get(key) as TaskCategory;

      if (categoria) {
        categorias.push(categoria);
      }
    }

    return categorias;
  }


  async removeCategory(name: string): Promise<void> {
  await this.ensureStorageReady();
  await this._storage?.remove(name);
}

}

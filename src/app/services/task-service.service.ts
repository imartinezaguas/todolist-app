import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { TaskCategory } from '../interface/ITaskBoard';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceService {
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

loadCategory(): Observable<TaskCategory[]> {
  return defer(async () => {
    await this.ensureStorageReady();

    const keys = await this._storage?.keys() ?? [];
    const categories: TaskCategory[] = [];

    for (const key of keys) {
      const categoria = await this._storage?.get(key) as TaskCategory;
      if (categoria) {
        categories.push(categoria);
      }
    }

    return categories;
  });
}

saveCategory(name: string, addCategoryTask?: TaskCategory): Observable<void> {
  return defer(async () => {
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

    await this._storage?.set(name, newCategory);
  });
}

getCategory(name: string): Observable<TaskCategory> {
  return defer(async () => {
    await this.ensureStorageReady();
    return await this._storage?.get(name);
  });
}

}

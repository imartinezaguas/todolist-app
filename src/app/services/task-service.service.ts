import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { TaskCategory } from '../interface/ITaskBoard';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceService {
   // Almacenamiento interno de Ionic (tipo Storage)
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init(); // Inicializa el storage al construir el servicio
  }

    /**
   * Inicializa la instancia privada del almacenamiento (`_storage`)
   * Se llama automáticamente en el constructor.
   */

  private async init() {
    this._storage = await this.storage.create();
  }


     /**
   * Verifica que `_storage` esté disponible.
   * Si no lo está (por ejemplo, por primera vez), lo crea.
   * Se llama antes de cualquier operación de lectura/escritura.
   */

  private async ensureStorageReady() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

   /**
   * Carga todas las categorías almacenadas en Ionic Storage.
   * Devuelve un Observable que emite una vez con todas las categorías encontradas.
   */

  loadCategory(): Observable<TaskCategory[]> {
    return defer(async () => {
      await this.ensureStorageReady();

      const keys = (await this._storage?.keys()) ?? [];
      const categories: TaskCategory[] = [];

      for (const key of keys) {
        const categoria = (await this._storage?.get(key)) as TaskCategory;
        if (categoria) {
          categories.push(categoria);
        }
      }

      return categories;
    });
  }

    /**
   * Guarda una nueva categoría o actualiza una existente en el storage.
   * Devuelve un Observable que se ejecuta al momento de la suscripción.
   */

  saveCategory(name: string, addCategoryTask?: TaskCategory): Observable<void> {
    return defer(async () => {
      await this.ensureStorageReady();
      console.log(name)
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
    });
  }

    /**
   * Obtiene una categoría específica por su clave.
   * Devuelve un Observable que emite la categoría encontrada (o undefined si no existe).
   */

  getCategory(name: string): Observable<TaskCategory> {
    return defer(async () => {
      await this.ensureStorageReady();
      return await this._storage?.get(name);
    });
  }

    /**
   * Elimina una categoría del storage por su clave.
   * Devuelve un Observable<void>.
   */

  removeCategory(name: string): Observable<void> {
    return defer(async () => {
      await this.ensureStorageReady();
      await this._storage?.remove(name);
    });
  }

    /**
   * Cambia el nombre (clave) de una categoría existente.
   * Copia la categoría a una nueva clave, actualiza el nombre y borra la anterior.
   * Devuelve un Observable<void>.
   */

  editNameCategory(oldKey: string, newKey: string): Observable<void> {
    return defer(async () => {
      await this.ensureStorageReady();
      const value = await this._storage?.get(oldKey);

      if (value !== null) {
        value.name = newKey;
        await this._storage?.set(newKey, value);
        await this._storage?.remove(oldKey);
      }
    });
  }
}

/**
 * Servicio StorageService
 *
 * Este servicio maneja el almacenamiento persistente de categorías de tareas
 * utilizando Ionic Storage. Permite guardar, obtener, eliminar y listar todas
 * las categorías del tablero de tareas (TaskBoard).
 *
 * @author Ivan
 * @since 2025-07-07
 */

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TaskCategory } from '../interface/ITaskBoard';

@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Instancia del almacenamiento de Ionic.
   * Se inicializa de forma asincrónica.
   */
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Inicializa el almacenamiento de Ionic al instanciar el servicio.
   */
  private async init() {
    this._storage = await this.storage.create();
  }

  /**
   * Asegura que el almacenamiento esté listo antes de cualquier operación.
   * Se llama internamente desde todos los métodos públicos.
   */
  private async ensureStorageReady() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  /**
   * Guarda una categoría de tareas en el almacenamiento.
   *
   * @param name - Nombre de la categoría (clave de almacenamiento).
   * @param addCategoryTask - Objeto `TaskCategory` a guardar. Si no se proporciona,
   *                          se crea uno nuevo con el nombre y un ID generado.
   */
  async saveCategory(name: string, addCategoryTask?: TaskCategory): Promise<void> {
    await this.ensureStorageReady();

    let newCategory: TaskCategory;

    if (addCategoryTask) {
      newCategory = addCategoryTask;
    } else {
      newCategory = {
        id: Date.now(), // Se genera un ID único basado en timestamp
        name: name,
        task: [],
      };
    }

    await this._storage?.set(name, newCategory);
  }

  /**
   * Obtiene una categoría específica del almacenamiento.
   *
   * @param name - Nombre de la categoría (clave).
   * @returns Una promesa que resuelve con la categoría correspondiente.
   */
  async getCategory(name: string): Promise<TaskCategory> {
    await this.ensureStorageReady();
    return await this._storage?.get(name);
  }

  /**
   * Obtiene todas las categorías almacenadas.
   *
   * @returns Una promesa que resuelve con un arreglo de `TaskCategory`.
   */
  async getAllCategories(): Promise<TaskCategory[]> {
    await this.ensureStorageReady();

    const keys = (await this._storage?.keys()) ?? [];
    const categories: TaskCategory[] = [];

    for (const key of keys) {
      const categoria = await this._storage?.get(key) as TaskCategory;

      if (categoria) {
        categories.push(categoria);
      }
    }

    return categories;
  }

  /**
   * Elimina una categoría del almacenamiento.
   *
   * @param name - Nombre de la categoría a eliminar.
   */
  async removeCategory(name: string): Promise<void> {
    await this.ensureStorageReady();
    await this._storage?.remove(name);
  }
}

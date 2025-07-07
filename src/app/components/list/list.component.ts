/**
 * Componente ListComponent
 *
 * Representa una sola categoría de tareas dentro de la vista de listas.
 * Permite editar el nombre de la categoría, agregar nuevas tareas,
 * completar/eliminar tareas, y eliminar la categoría completa.
 *
 * También controla si la funcionalidad "Agregar tarea" está habilitada a través
 * de una bandera remota con Firebase Remote Config.
 *
 * @example
 * <app-list [todoList]="categoria" (onCategoryDeleted)="refrescarCategorias()"></app-list>
 *
 * @author Ivan
 * @since 2025-07-07
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { ENABLE_ADD_TASK } from 'src/app/const/config';
import { TaskCategory } from 'src/app/interface/ITaskBoard';
import { FeatureFlagServiceService } from 'src/app/services/feature-flag-service.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  imports: [IonicModule],
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  /**
   * Categoría de tareas que se va a renderizar.
   */
  @Input() todoList!: TaskCategory;

  /**
   * Evento emitido cuando se elimina una categoría.
   */
  @Output() onCategoryDeleted = new EventEmitter<void>();

  /**
   * Bandera que indica si la funcionalidad de agregar tarea está habilitada.
   */
  enableAddTask = false;

  /**
   * Controla la visibilidad de las tareas dentro de la categoría.
   */
  isExpanded: boolean = true;

  constructor(
    private alerCtrl: AlertController,
    private storage: StorageService,
    private featureFlag: FeatureFlagServiceService
  ) {}

  /**
   * Inicializa el componente y verifica si está habilitada
   * la funcionalidad para agregar tareas.
   */
  async ngOnInit() {
    this.enableAddTask = await this.featureFlag.isFeatureEnabled(ENABLE_ADD_TASK);
  }

  /**
   * Muestra un modal para editar el nombre de la categoría.
   * Si el nuevo nombre no existe ya, actualiza la categoría y elimina la antigua.
   */
  async editCategorie() {
    const alert = await this.alerCtrl.create({
      header: 'Edit Category',
      inputs: [
        {
          name: 'newName',
          type: 'text',
          placeholder: 'New name',
          value: this.todoList.name,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            const newName = data.newName.trim().toUpperCase();

            if (!newName || newName === this.todoList.name) return;

            const exist = await this.storage.getCategory(newName);
            if (exist) {
              const existsAlert = await this.alerCtrl.create({
                header: 'Error',
                message: `Don't exists that category "${newName}"`,
                buttons: ['OK'],
              });
              await existsAlert.present();
              return;
            }

            const category = await this.storage.getCategory(this.todoList.name);
            category.name = newName;

            await this.storage.saveCategory(newName, category);
            await this.storage.removeCategory(this.todoList.name);

            this.onCategoryDeleted.emit();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Muestra un modal para agregar una nueva tarea a la categoría actual.
   * La tarea se guarda solo si el título no está vacío.
   *
   * @param category - Categoría a la que se agregará la tarea.
   */
  async openModalTask(category: TaskCategory) {
    const task = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Add Task',
      mode: 'ios',
      inputs: [
        {
          name: 'key',
          type: 'text',
          placeholder: 'Name of task',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
          handler: () => {
            console.log('Confirm cancel');
          },
        },
        {
          text: 'Save',
          handler: async (data) => {
            const title = data.key.trim().toLowerCase();

            const catStorage = await this.storage.getCategory(category.name);

            if (title) {
              const newTask = {
                id: Date.now(),
                title: title,
                complete: false,
                categoryId: category.id,
              };

              catStorage.task.push(newTask);

              await this.storage.saveCategory(category.name, catStorage);
              this.todoList.task = [...catStorage.task];
            }
          },
        },
      ],
    });

    await task.present();
  }

  /**
   * Marca una tarea como completa o incompleta y actualiza el almacenamiento.
   *
   * @param task - Objeto de la tarea a actualizar.
   * @param status - Estado de completado (true/false).
   */
  async completeTask(task: any, status: boolean) {
    const category = await this.storage.getCategory(this.todoList.name);

    const tareaIndex = category.task.findIndex((t) => t.id === task.id);
    if (tareaIndex > -1) {
      category.task[tareaIndex].complete = status;
      await this.storage.saveCategory(this.todoList.name, category);

      this.todoList.task = [...category.task];
    }
  }

  /**
   * Elimina una tarea específica de la categoría.
   *
   * @param task - Objeto de la tarea a eliminar.
   */
  async deleteTask(task: any) {
    const category = await this.storage.getCategory(this.todoList.name);

    category.task = category.task.filter((t) => t.id !== task.id);

    await this.storage.saveCategory(this.todoList.name, category);
    this.todoList.task = [...category.task];
  }

  /**
   * Muestra una alerta para confirmar la eliminación de la categoría completa.
   * Si se confirma, la elimina del almacenamiento y emite el evento correspondiente.
   */
  async deleteCategory() {
    const alert = await this.alerCtrl.create({
      header: 'Delete category',
      message: `¿Surely you want to delete the category "${this.todoList.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.storage.removeCategory(this.todoList.name);
            this.onCategoryDeleted.emit();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Alterna la expansión o colapso visual de las tareas de la categoría.
   */
  toggleCategory() {
    this.isExpanded = !this.isExpanded;
  }
}

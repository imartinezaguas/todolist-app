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
  @Input() todoList!: TaskCategory;
  @Output() onCategoryDeleted = new EventEmitter<void>();
  enableAddTask = false;

  constructor(
    private alerCtrl: AlertController,
    private storage: StorageService,
    private featureFlag: FeatureFlagServiceService
  ) {}

  async ngOnInit() {
    this.enableAddTask = await this.featureFlag.isFeatureEnabled(ENABLE_ADD_TASK);
  }

  async editCategorie() {
    const alert = await this.alerCtrl.create({
      header: 'Editar Categoría',
      inputs: [
        {
          name: 'newName',
          type: 'text',
          placeholder: 'Nuevo nombre',
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
            const nuevoNombre = data.newName.trim().toUpperCase();

            if (!nuevoNombre || nuevoNombre === this.todoList.name) return;

            // Verificar si ya existe una categoría con ese nombre
            const existe = await this.storage.getCategory(nuevoNombre);
            if (existe) {
              const existsAlert = await this.alerCtrl.create({
                header: 'Error',
                message: `Ya existe una categoría con el nombre "${nuevoNombre}"`,
                buttons: ['OK'],
              });
              await existsAlert.present();
              return;
            }

            // Obtener categoría actual
            const categoria = await this.storage.getCategory(
              this.todoList.name
            );

            // Asignar nuevo nombre y guardar
            categoria.name = nuevoNombre;
            await this.storage.saveCategory(nuevoNombre, categoria);

            // Eliminar la vieja categoría
            await this.storage.removeCategory(this.todoList.name);

            // Emitir evento al padre para que refresque
            this.onCategoryDeleted.emit();
          },
        },
      ],
    });

    await alert.present();
  }

  async openModalTask(category: TaskCategory) {
    const task = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Add Task',
      mode: 'ios',
      inputs: [
        {
          name: 'key',
          type: 'text',
          placeholder: 'Name Of Task',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Save',
          handler: async (data) => {
            const title = data.key.trim();

            const catStorage: TaskCategory = await this.storage.getCategory(
              category.name
            );

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

  async completeTask(tarea: any, estado: boolean) {
    // Buscar la categoría actual desde storage
    const categoria = await this.storage.getCategory(this.todoList.name);

    // Buscar la tarea por ID y actualizar el estado
    const tareaIndex = categoria.task.findIndex((t) => t.id === tarea.id);
    if (tareaIndex > -1) {
      categoria.task[tareaIndex].complete = estado;
      await this.storage.saveCategory(this.todoList.name, categoria);

      // Actualizar la lista local para reflejar en pantalla
      this.todoList.task = [...categoria.task];
    }
  }

  async deleteTask(tarea: any) {
    const categoria = await this.storage.getCategory(this.todoList.name);

    // Filtrar tareas eliminando la seleccionada
    categoria.task = categoria.task.filter((t) => t.id !== tarea.id);

    // Guardar la categoría actualizada
    await this.storage.saveCategory(this.todoList.name, categoria);

    // Refrescar la UI
    this.todoList.task = [...categoria.task];
  }

  async deleteCategory() {
    const alert = await this.alerCtrl.create({
      header: 'Eliminar categoría',
      message: `¿Seguro que deseas eliminar la categoría "${this.todoList.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.storage.removeCategory(this.todoList.name);
            this.onCategoryDeleted.emit(); // Notifica al padre que refresque
          },
        },
      ],
    });

    await alert.present();
  }
}

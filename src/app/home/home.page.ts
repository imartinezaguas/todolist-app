/**
 * Componente HomePage
 *
 * Página principal de la aplicación. Permite visualizar las categorías de tareas
 * almacenadas localmente y añadir nuevas categorías mediante un modal de entrada.
 *
 * @example
 * <app-home></app-home>
 *
 * @author Ivan
 * @since 2025-07-07
 */

import { Component, OnInit } from '@angular/core';
import { TaskCategory } from '../interface/ITaskBoard';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { TaskServiceService } from '../services/task-service.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  /**
   * Lista de categorías de tareas que se muestran en pantalla.
   */
  public todoList: TaskCategory[] = [];
  fechaRecordatorio: string = '';

  constructor(
    private alerCtrl: AlertController,
    private storage: StorageService,
    private taskService: TaskServiceService
  ) {}

  /**
   * Método del ciclo de vida que se ejecuta al inicializar la página.
   * Carga todas las categorías almacenadas localmente.
   */
  async ngOnInit() {
    //this.todoList = await this.storage.getAllCategories();
    this.taskService.loadCategory().subscribe((ref) => {
      this.todoList = ref;
    });
  }

  /**
   * Abre un modal para agregar una nueva categoría.
   * Si el usuario introduce un nombre válido, se guarda la categoría
   * y se actualiza la lista mostrada.
   */
  async openModalCategory(): Promise<void> {
    const category = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Add Category',
      mode: 'ios',
      inputs: [
        {
          name: 'key',
          type: 'text',
          placeholder: 'Name Of Category',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
          handler: () => {},
        },
        {
          text: 'Save',
          handler: async (data) => {
            const nameCategory = data.key.trim().toUpperCase();

            if (nameCategory) {
              // Guarda la nueva categoría y recarga la lista
              //await this.storage.saveCategory(nameCategory);
              //this.todoList = await this.storage.getAllCategories();
              this.taskService.saveCategory(nameCategory).subscribe({
                next: () => {
                  this.taskService.loadCategory().subscribe((ref) => {
                    this.todoList = ref;
                  });
                },
                error: (err) => {
                  throw new Error(err)
                },
              });
            }
          },
        },
      ],
    });

    await category.present();
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import {
  COLOR_DANGER,
  DURATION_TOAST,
  ENABLE_ADD_TASK,
  MESSAGE_TASK_TOAST,
  POSITION_TOAST,
} from 'src/app/core/presentation/constants/const';
import { TodoTask } from 'src/app/core/domain/entities/task';

// Casos de uso (Application Layer)


// Servicio de feature flags (Infraestructura)
import { FeatureFlagServiceService } from 'src/app/core/infrastructure/services/feature.service';
import { AddTaskUseCase } from 'src/app/core/application/task/add-task.usecase';
import { ToggleTaskUseCase } from 'src/app/core/application/task/toggle-task.usecase';
import { DeleteTaskUseCase } from 'src/app/core/application/task/delete-task.usecase';
import { GetTasksByCategoryUseCase } from 'src/app/core/application/task/get-tasks-by-category.usecase';
import { UpdateTaskUseCase } from 'src/app/core/application/task/update-task.usecase';
import { DeleteCompletedTasksUseCase } from 'src/app/core/application/task/delete-completed-tasks.usecase';
import { ToggleAllTasksUseCase } from 'src/app/core/application/task/toggle-all-tasks.usecase';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./category-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailPage implements OnInit {
  categoryName = '';
  categoryId = '';
  newTask = '';
  tasks: TodoTask[] = [];
  searchTask = '';
  buttonTaskEnable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private featureFlag: FeatureFlagServiceService,

    // Inyección de casos de uso
    private getTasksUC: GetTasksByCategoryUseCase,
    private addTaskUC: AddTaskUseCase,
    private toggleTaskUC: ToggleTaskUseCase,
    private deleteTaskUC: DeleteTaskUseCase,
    private updateTaskUC: UpdateTaskUseCase,
    private deleteCompletedTasksUC: DeleteCompletedTasksUseCase,
    private toggleAllTasksUC: ToggleAllTasksUseCase,
    private cdr: ChangeDetectorRef
  ) {
    this.categoryName = this.route.snapshot.queryParamMap.get('title') ?? '';
    this.categoryId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  async ngOnInit() {
    this.tasks = await this.getTasksUC.execute(this.categoryId);
    this.buttonTaskEnable = await this.featureFlag.isFeatureEnabled(ENABLE_ADD_TASK);
    this.cdr.markForCheck();
  }

  trackByTask(index: number, task: TodoTask): string | number {
    return task.id || task.title;
  }

  get completedCount(): number {
    return this.tasks.filter((t) => t.completed).length;
  }

  get allCompleted(): boolean {
    return this.tasks.length > 0 && this.completedCount === this.tasks.length;
  }

  async toggleAll() {
    const newState = !this.allCompleted;
    const updatedTasks = await this.toggleAllTasksUC.execute(this.categoryId, newState);
    this.tasks = updatedTasks;
    this.cdr.markForCheck();
  }

  async addTask() {
    if (!this.newTask.trim()) {
      const toast = await this.toastCtrl.create({
        message: MESSAGE_TASK_TOAST,
        duration: DURATION_TOAST,
        color: COLOR_DANGER,
        position: POSITION_TOAST,
      });
      await toast.present();
      return;
    }
    const updatedTasks = await this.addTaskUC.execute(this.categoryId, this.newTask.trim());
    this.tasks = updatedTasks;
    this.cdr.markForCheck();
    this.newTask = '';
  }

  async toggleTask(index: number) {
    const updatedTasks = await this.toggleTaskUC.execute(this.categoryId, index);
    this.tasks = updatedTasks;
    this.cdr.markForCheck();
  }

  async deleteTask(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const updatedTasks = await this.deleteTaskUC.execute(this.categoryId, index);
            this.tasks = updatedTasks;
            this.cdr.markForCheck();
          }
        }
      ]
    });
    await alert.present();
  }

  get filteredTasks(): TodoTask[] {
    if (!this.searchTask.trim()) return this.tasks;
    return this.tasks.filter((t) =>
      t.title.toLowerCase().includes(this.searchTask.toLowerCase())
    );
  }

  async editTask(index: number, task: TodoTask) {
    const alert = await this.alertCtrl.create({
      header: 'Editar tarea',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: task.title,
          placeholder: 'Título de la tarea',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.title.trim()) return false;
            const updatedTasks = await this.updateTaskUC.execute(this.categoryId, index, data.title.trim());
            this.tasks = updatedTasks;
            this.cdr.markForCheck();
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteCompletedTasks() {
    if (this.completedCount === 0) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar Completadas',
      message: '¿Estás seguro de que deseas eliminar todas las tareas completadas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar Todas',
          role: 'destructive',
          handler: async () => {
            const updatedTasks = await this.deleteCompletedTasksUC.execute(this.categoryId);
            this.tasks = updatedTasks;
            this.cdr.markForCheck();
          }
        }
      ]
    });
    await alert.present();
  }
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AlertController, IonicModule, IonItemSliding } from '@ionic/angular';
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
  @Output() categoryDeleted = new EventEmitter<number>();
  @ViewChild(IonItemSliding) slidingItem!: IonItemSliding;
  @ViewChild(IonItemSliding) slidingRefCat!: IonItemSliding;
  enableAddTask = false;
  isExpanded: boolean = true;

  constructor(
    private alerCtrl: AlertController,
    private storage: StorageService,
    private featureFlag: FeatureFlagServiceService
  ) {}

  async ngOnInit() {
    this.enableAddTask = await this.featureFlag.isFeatureEnabled(
      ENABLE_ADD_TASK
    );
  }

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
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: async (data) => {
            const newName = data.newName.trim().toUpperCase();

            if (!newName) return;

            this.storage.editNameCategory(this.todoList.name,newName)
            this.todoList.name = newName;
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

  async completeTask(task: any, status: boolean) {
    const category = await this.storage.getCategory(this.todoList.name);

    const tareaIndex = category.task.findIndex((t) => t.id === task.id);
    if (tareaIndex > -1) {
      category.task[tareaIndex].complete = status;
      await this.storage.saveCategory(this.todoList.name, category);

      this.todoList.task = [...category.task];
    }
  }

  async deleteTask(task: any) {
    const category = await this.storage.getCategory(this.todoList.name);

    category.task = category.task.filter((t) => t.id !== task.id);
    await this.storage.saveCategory(this.todoList.name, category);
    this.todoList.task = [...category.task];
    await this.slidingItem.closeOpened();
  }

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
            this.categoryDeleted.emit(this.todoList.id);
            await this.slidingRefCat.closeOpened();
          },
        },
      ],
    });

    await alert.present();
  }


  toggleCategory() {
    this.isExpanded = !this.isExpanded;
  }

}

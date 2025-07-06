import { Component, OnInit } from '@angular/core';
import { TaskCategory } from '../interface/ITaskBoard';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  public todoList: TaskCategory[] = [];

  constructor(
    private alerCtrl: AlertController,
    private storage: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.todoList = await this.storage.getAllCategories();
  }

  async openModalCategory() {
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

              await this.storage.saveCategory(nameCategory);
              this.todoList = await this.storage.getAllCategories();
            }
          },
        },
      ],
    });

    await category.present();
  }
}

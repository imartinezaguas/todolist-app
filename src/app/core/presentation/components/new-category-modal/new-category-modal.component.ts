import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CANCEL, CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_KEY, COLOR_DANGER, COLOR_PRIMARY, COMFIRM, DURATION_TOAST, MESSAGE_CATEGORY_TOAST, POSITION_TOAST, SELECT_ICON } from 'src/app/core/presentation/constants/const';


@Component({
  selector: 'app-new-category-modal',
  templateUrl: './new-category-modal.component.html',
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./new-category-modal.component.scss'],
})
export class NewCategoryModalComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  name = '';
  selectedIcon = SELECT_ICON;
  selectedColor = COLOR_PRIMARY;

  colors = CATEGORY_COLORS;
  icons = CATEGORY_ICONS;

  dismiss() {
    this.modalCtrl.dismiss(null, CANCEL);
  }

  async confirm() {
    if (!this.name || !this.name.trim()) {
      const toast = await this.toastCtrl.create({
        message: MESSAGE_CATEGORY_TOAST,
        duration: DURATION_TOAST,
        position: POSITION_TOAST,
        color: COLOR_DANGER,
      });
      await toast.present();
      return;
    }

    const formattedName = this.name.trim().charAt(0).toUpperCase() + this.name.trim().slice(1);

    const newCategory = {
      id: Date.now().toString(),
      title: formattedName,
      tasks: [],
      total:0,
      completed: 0,
      color: this.selectedColor,
      icon: this.selectedIcon,
    };

    // Devolver al padre
    this.modalCtrl.dismiss(newCategory, COMFIRM);
  }
}

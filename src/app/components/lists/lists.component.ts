import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ListComponent } from '../list/list.component';
import { TaskCategory } from 'src/app/interface/ITaskBoard';
import { SearchComponent } from '../search/search.component';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  imports: [IonicModule, ListComponent, SearchComponent],
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit, OnChanges {
  @Input() todoLists: TaskCategory[] = [];
  filteredCategories: TaskCategory[] = [];

  constructor(private storage: StorageService ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todoLists']) {
      this.filteredCategories = [...this.todoLists];
    }
  }

  filterCategories(searchTerm: string) {
    this.filteredCategories = this.todoLists.filter((categories) =>
      categories.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async refrescarCategorias() {
    const categories = await this.storage.getAllCategories();
    this.filteredCategories = [...categories];
  }
}

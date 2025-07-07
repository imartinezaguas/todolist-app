/**
 * Componente ListsComponent
 *
 * Muestra una lista de categorías de tareas filtrables.
 * Escucha cambios en la lista de entrada (`todoLists`) y permite aplicar
 * filtros por búsqueda, así como refrescar las categorías desde el almacenamiento.
 *
 * Este componente utiliza `ListComponent` para renderizar cada categoría,
 * y `SearchComponent` para gestionar el texto de búsqueda.
 *
 * @example
 * <app-lists [todoLists]="categorias"></app-lists>
 *
 * @author Ivan
 * @since 2025-07-07
 */

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
  /**
   * Lista de categorías de tareas recibidas como entrada desde el componente padre.
   */
  @Input() todoLists: TaskCategory[] = [];

  /**
   * Lista de categorías que se muestran actualmente, ya sea filtrada o completa.
   */
  filteredCategories: TaskCategory[] = [];

  constructor(private storage: StorageService) {}

  /**
   * Método del ciclo de vida OnInit (no utilizado actualmente, pero preparado para inicialización).
   */
  ngOnInit(): void {}

  /**
   * Método del ciclo de vida OnChanges.
   * Se ejecuta cuando cambia la entrada `todoLists`.
   * Actualiza `filteredCategories` con la nueva lista recibida.
   *
   * @param changes - Objeto con los cambios detectados.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todoLists']) {
      this.filteredCategories = [...this.todoLists];
    }
  }

  /**
   * Filtra las categorías en función de un término de búsqueda.
   * El filtro se aplica sobre el nombre de la categoría en minúsculas.
   *
   * @param searchTerm - Texto ingresado por el usuario para filtrar categorías.
   */
  filterCategories(searchTerm: string): void {
    this.filteredCategories = this.todoLists.filter((categories) =>
      categories.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Refresca las categorías directamente desde el almacenamiento.
   * Útil cuando se desea recargar la lista completa desde la fuente de datos.
   */
  async refrescarCategorias(): Promise<void> {
    const categories = await this.storage.getAllCategories();
    this.filteredCategories = [...categories];
  }
}

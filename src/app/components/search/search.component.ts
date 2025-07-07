/**
 * Componente SearchComponent
 *
 * Componente de búsqueda reutilizable que emite eventos con el texto ingresado.
 * Puede activarse o desactivarse dinámicamente mediante una bandera remota (feature flag).
 *
 * @example
 * <app-search (onSearch)="filtrarTareas($event)"></app-search>
 *
 * Esta lógica es útil cuando la barra de búsqueda debe mostrarse solo si una
 * funcionalidad está habilitada desde Firebase Remote Config.
 *
 * @author Ivan
 * @since 2025-07-07
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ENABLE_SEARCH_BAR } from 'src/app/const/config';
import { FeatureFlagServiceService } from 'src/app/services/feature-flag-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [IonicModule],
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  /**
   * Evento emitido cada vez que el usuario escribe en la barra de búsqueda.
   * Se emite el valor limpio del texto (sin espacios).
   */
  @Output() onSearch = new EventEmitter<string>();

  /**
   * Determina si la barra de búsqueda debe mostrarse o no.
   * Su valor depende de una bandera remota.
   */
  searchBarEnabled = false;

  constructor(private featureFlag: FeatureFlagServiceService) {}

  /**
   * Verifica si la barra de búsqueda está habilitada desde configuración remota.
   * Se ejecuta al inicializar el componente.
   */
  async ngOnInit(): Promise<void> {
    this.searchBarEnabled = await this.featureFlag.isFeatureEnabled(ENABLE_SEARCH_BAR);
  }

  /**
   * Maneja el evento de entrada de texto del usuario.
   * Limpia el texto y lo emite a través del evento `onSearch`.
   *
   * @param event - Objeto del evento generado por el input de búsqueda.
   */
  handleInput(event: any): void {
    const value = event.detail.value.trim();
    this.onSearch.emit(value);
  }
}

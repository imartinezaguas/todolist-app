/**
 * Servicio FeatureFlagServiceService
 *
 * Este servicio permite consultar el estado de "feature flags" (banderas de funcionalidad)
 * utilizando Firebase Remote Config. Se utiliza para activar o desactivar funcionalidades
 * en tiempo real sin necesidad de desplegar una nueva versión de la aplicación.
 *
 * @example
 * const habilitado = await featureFlagService.isFeatureEnabled('nueva_funcionalidad');
 * if (habilitado) { mostrarNuevaVista(); }
 *
 * @author Ivan
 * @since 2025-07-07
 */

import { Injectable } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagServiceService {

  constructor(private remoteConfig: AngularFireRemoteConfig) {}

  /**
   * Verifica si una funcionalidad está habilitada según el valor
   * almacenado en Firebase Remote Config.
   *
   * @param flag - Nombre de la bandera que identifica la funcionalidad.
   * @returns Una promesa que resuelve en `true` si la bandera está activa, `false` en caso contrario.
   */
  async isFeatureEnabled(flag: string): Promise<boolean> {
    // Se asegura de obtener la configuración más actual antes de consultar el valor
    await this.remoteConfig.fetchAndActivate();

    const value = await this.remoteConfig.getValue(flag);

    return value.asBoolean();
  }
}

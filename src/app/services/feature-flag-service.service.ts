import { Injectable } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagServiceService {

  constructor(private remoteConfig: AngularFireRemoteConfig) {}

  async isFeatureEnabled(flag: string): Promise<boolean> {
    await this.remoteConfig.fetchAndActivate();
    const value = await this.remoteConfig.getValue(flag);
    return value.asBoolean();
  }


}





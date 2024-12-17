import { Injectable } from '@angular/core';
import { getValue, RemoteConfig } from '@angular/fire/remote-config';
import { fetchAndActivate } from 'firebase/remote-config';
import { Value } from '@firebase/remote-config-types';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {

  constructor(private remoteConfig: RemoteConfig) {
    this.remoteConfig.settings.minimumFetchIntervalMillis = 360000
  }
  

  // Get the remote config by flag boolean
  async getFeatureBooleanFlag(flag: string) {
    await fetchAndActivate(this.remoteConfig);
    const val: Value = getValue(this.remoteConfig, flag);
    return val.asBoolean();
  }
}

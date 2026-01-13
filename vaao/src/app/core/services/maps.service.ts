import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  async openMaps(mapsUrl: string): Promise<void> {

    if (Capacitor.getPlatform() === 'android') {
      await AppLauncher.openUrl({
        url: mapsUrl
      });
    } else {
      window.open(mapsUrl, '_blank');
    }
  }
}

/**
 * Created by nsingh on 10/28/2017.
 */

import { Injectable } from '@angular/core';
import { AlertController, Config } from '@ionic/angular';
import { NsCustomLoaderOptions } from './NsCustomLoader/NsCustomLoader';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppShared {
  private nsCustomLoading = new Subject<NsCustomLoaderOptions>();

  /**
   * @description This is AppShared Class used Globally in App.
   * @param config
   * @param alertCtrl
   */
  constructor(public config: Config, public alertCtrl: AlertController) {
  }

  nsCustomLoadingSubject(): Subject<NsCustomLoaderOptions> {
    return this.nsCustomLoading;
  }

  /**
   * @description show app loading indicator
   */
  public showLoading(content?: string) {
    const loadingOptions: NsCustomLoaderOptions = {
      content: content || 'Please wait...',
      show: true
    };
    this.nsCustomLoading.next(loadingOptions);
  }

  /**
   * @description hide app loading indicator
   */
  public hideLoading() {
    const loadingOptions: NsCustomLoaderOptions = {
      show: false
    };
    this.nsCustomLoading.next(loadingOptions);
  }

  public showAlert(header: string, subHeader: string, cssClass?: string) {
    this.alertCtrl.create({
      header,
      subHeader,
      buttons: ['OK'],
      cssClass
    }).then((alert) => {
      alert.present();
    });
  }

  /**
   * @description show some confirmation dialog
   * @param header
   * @param message
   * @param button
   * @param cssClass
   */
  public showConfirm(header: string, message: string, button: string[], cssClass?: string): Observable<boolean> {
    return new Observable((obs) => {
      this.alertCtrl.create({
        header,
        message,
        buttons: [
          {
            text: button[1],
            handler: () => {
              // not confirm
              obs.next(false);
              obs.complete();
            }
          },
          {
            text: button[0],
            handler: () => {
              // confirm
              obs.next(true);
              obs.complete();
            }
          }
        ],
        cssClass,
        backdropDismiss: false
      }).then((confirm) => {
        confirm.present();
      });
    });
  }
}
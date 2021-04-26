import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AppShared} from '../app.shared';
import {Config, GestureController} from '@ionic/angular';
import {Gesture} from '@ionic/core';

/**
 * Created by nsingh on 5/23/2017.
 */
@Component({
  selector: 'ns-custom-loader',
  styleUrls: ['./loading.scss'],
  template: `
    <div class="ns-custom-loader" *ngIf="show">
      <ion-backdrop [hidden]="!show"></ion-backdrop>
      <div class="loading-wrapper">
        <div class="loading-spinner" *ngIf="spinner!=='hide'">
          <ion-spinner [name]="spinner"></ion-spinner>
        </div>
        <div *ngIf="content" [innerHTML]="content" class="loading-content"></div>
      </div>
    </div>`,
})
export class NsCustomLoader implements OnInit, OnDestroy {
  public show: boolean;
  public spinner: string;
  public content: string;
  private gestureBlocker: Gesture;

  /**
   * @description class constructor dependency injection
   * @param appShared
   * @param config
   * @param gestureCtrl
   * @param elementRef
   * @param renderer
   */
  constructor(private appShared: AppShared, private config: Config, private gestureCtrl: GestureController, private elementRef: ElementRef, renderer: Renderer2) {
    renderer.setAttribute(elementRef.nativeElement, 'class', `loading-${config.get('mode')}`);
    this.gestureBlocker = gestureCtrl.create({el: elementRef.nativeElement, gestureName: 'loaderGesture'});
  }

  ngOnInit(): void {
    this.appShared.nsCustomLoadingSubject().subscribe((loadingOptions: NsCustomLoaderOptions) => {
      if (loadingOptions.show === true) {
        // show loading here
        this.spinner = loadingOptions.spinner;
        this.content = loadingOptions.content;
        this.show = true;
        this.gestureBlocker.enable(true);
      } else {
        // hide loading here
        this.show = false;
        this.gestureBlocker.destroy();
      }
    }, (error) => {
      console.error(error);
    });
  }

  ngOnDestroy(): void {
    this.gestureBlocker.destroy();
  }

}
export interface NsCustomLoaderOptions {
  content?: string;
  spinner?: string;
  show: boolean;
}

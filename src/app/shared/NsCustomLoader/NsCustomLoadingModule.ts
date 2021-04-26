/**
 * Created by nsingh on 5/24/2017.
 */
import {NgModule} from '@angular/core';
import {NsCustomLoader} from './NsCustomLoader';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [NsCustomLoader],
  imports: [CommonModule, IonicModule],
  exports: [NsCustomLoader],
  entryComponents: [NsCustomLoader]
})
export class NsCustomLoadingModule {

}

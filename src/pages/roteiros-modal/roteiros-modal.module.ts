import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoteirosModalPage } from './roteiros-modal';

@NgModule({
  declarations: [
    RoteirosModalPage,
  ],
  imports: [
    IonicPageModule.forChild(RoteirosModalPage),
  ],
  exports: [
    RoteirosModalPage
  ]
})
export class RoteirosModalPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PontosModalPage } from './pontos-modal';

@NgModule({
  declarations: [
    PontosModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PontosModalPage),
  ],
  exports: [
    PontosModalPage
  ]
})
export class PontosModalPageModule {}

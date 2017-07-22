import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PontoModalPage } from './ponto-modal';

@NgModule({
  declarations: [
    PontoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PontoModalPage),
  ],
  exports: [
    PontoModalPage
  ]
})
export class PontoModalPageModule {}

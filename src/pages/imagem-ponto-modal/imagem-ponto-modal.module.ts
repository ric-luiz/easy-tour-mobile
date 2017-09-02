import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImagemPontoModalPage } from './imagem-ponto-modal';

@NgModule({
  declarations: [
    ImagemPontoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ImagemPontoModalPage),
  ],
  exports: [
    ImagemPontoModalPage
  ]
})
export class ImagemPontoModalPageModule {}

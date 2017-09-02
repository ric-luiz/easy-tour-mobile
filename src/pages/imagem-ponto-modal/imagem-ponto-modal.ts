import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-imagem-ponto-modal',
  templateUrl: 'imagem-ponto-modal.html',
})
export class ImagemPontoModalPage {

  pontos: Array<any> = this.navParams.get('pontosRoteiro');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log(this.pontos);
  }

  fecharModal(){
    this.viewCtrl.dismiss();
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-ponto-modal',
  templateUrl: 'ponto-modal.html',
})
export class PontoModalPage {
  
  ponto: any = this.navParams.get('pontoRoteiro');

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {       
  }

  fecharModal(){
    this.viewCtrl.dismiss();
  }

}

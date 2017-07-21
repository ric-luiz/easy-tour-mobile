import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PontosModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pontos-modal',
  templateUrl: 'pontos-modal.html',
})
export class PontosModalPage {

  nomeRoteiro : string = this.navParams.get('nomeRoteiro').nome;
  pontos: Array<any> = this.navParams.get('pontosRoteiro');

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {    
  }

  fecharModal(){
    this.viewCtrl.dismiss();
  }

}

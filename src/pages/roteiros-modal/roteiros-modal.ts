import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the RoteirosModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-roteiros-modal',
  templateUrl: 'roteiros-modal.html',
})
export class RoteirosModalPage {  

  categoria: string = this.navParams.get('categoria').nome;
  roteiros: Array<any>  = this.navParams.get('roteiros');

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  fecharModal(){
    this.viewCtrl.dismiss();
  }

  fecharModalComRoteiroEscolhido(roteiroEscolhido){
    this.viewCtrl.dismiss(roteiroEscolhido);
  }

}

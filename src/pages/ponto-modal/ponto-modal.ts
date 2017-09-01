import { PontosModalPage } from './../pontos-modal/pontos-modal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-ponto-modal',
  templateUrl: 'ponto-modal.html',
})
export class PontoModalPage {
  
  ponto: any = this.navParams.get('pontoRoteiro');

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {       
  }

  fecharModal(){
    this.viewCtrl.dismiss();
  }

  abrirImagensPonto(){    
    let imagensPonto = [];    
    imagensPonto.push({ponto:{nome:this.ponto.nome,descricao:this.ponto.descricao}});
    imagensPonto.push({ponto:{nome:this.ponto.nome+" 2",descricao:this.ponto.descricao}});
    imagensPonto.push({ponto:{nome:this.ponto.nome+" 3",descricao:this.ponto.descricao}});    

    let modal = this.modalCtrl.create(PontosModalPage,{pontosRoteiro:imagensPonto,nomeRoteiro:this.ponto.nome});          
    modal.present(); 

  }

}

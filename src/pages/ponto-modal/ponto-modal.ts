import { ImagemPontoModalPage } from './../imagem-ponto-modal/imagem-ponto-modal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-ponto-modal',
  templateUrl: 'ponto-modal.html',
})
export class PontoModalPage {
  
  ponto: any = this.navParams.get('pontoRoteiro');
  audio: any = new Audio('assets/voz-guia.mp3');

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {       
  }

  fecharModal(){
    this.viewCtrl.dismiss();
  }

  abrirImagensPonto(){    
    let imagensPonto = [];    
    imagensPonto.push({ponto:{nome:this.ponto.id}});
    imagensPonto.push({ponto:{nome:this.ponto.id+"t2"}});
    imagensPonto.push({ponto:{nome:this.ponto.id+"t3"}});    

    let modal = this.modalCtrl.create(ImagemPontoModalPage,{pontosRoteiro:imagensPonto});          
    modal.present(); 

  }
  
  tocarAudio(){
    this.audio.pause();
    this.audio.currentTime = 0;    
    this.audio.play();
  }

}

import { PontosModalPage } from './../pontos-modal/pontos-modal';
import { HomeProvider } from './../../providers/home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ModalController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController, 
              public homeProvider:HomeProvider,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController) {
  }

  fecharModal(){
    this.viewCtrl.dismiss();
  }

  fecharModalComRoteiroEscolhido(roteiroEscolhido){
    this.viewCtrl.dismiss(roteiroEscolhido);
  }

  //vai recuperar as informações dos pontos de um roteiro para serem exibidas ao usuário
  visualizarInformacoesPontosRoteiro(roteiroEscolhido){
    this.homeProvider.recuperarPontosDoRoteiro(roteiroEscolhido).subscribe(
      data => {                
        if(data[0] != undefined){
          this.openModalPontos(data,roteiroEscolhido);
        } else {
          this.exibirToastAlert('Não existe pontos turísticos cadastrados para este roteiro',4000);
        }        
      },
      err => {
        console.log(err);
        this.exibirToastAlert('Ocorreu um erro ao buscar os pontos do roteiro. Verifique sua conexão com a intenet.',6000);
      }
    );
  }

  //abre o modal para exibir informações dos pontos do roteiro
  openModalPontos(pontosRoteiro,nomeRoteiro){    
    let modal = this.modalCtrl.create(PontosModalPage,{pontosRoteiro:pontosRoteiro,nomeRoteiro:nomeRoteiro});    
    modal.present();
  }

  //caso ocorra um erro exibe uma mensagem informando o usuario
  exibirToastAlert(msg,timeDuartion) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: timeDuartion,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

}

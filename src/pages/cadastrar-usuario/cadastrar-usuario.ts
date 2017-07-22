import { CadastrarUsuarioProvider } from './../../providers/cadastrar-usuario/cadastrar-usuario';
import { Usuario } from './../../models/Usuario';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cadastrar-usuario',
  templateUrl: 'cadastrar-usuario.html',
})
export class CadastrarUsuarioPage {

  usuario:Usuario;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public cadastrarUsuarioProvider:CadastrarUsuarioProvider,
              public toastCtrl: ToastController) {
    this.usuario = new Usuario();
  }

  voltarParaLogin(){
    this.navCtrl.pop();
  }  

  //Realiza o cadastro do usuario no app
  cadastrarUsuario(){    

    if(this.camposCadastroEmpty(this.usuario)){ //os campos foram preenchidos?
      this.exibirToastAlert("Todos os campos devem ser preenchidos!",5000);
      return;
    }

    if(!this.senhaConfirmada(this.usuario)){ //senhas são diferentes?
      this.exibirToastAlert("Senhas informadas diferentes!",5000);
      return;
    }

    this.cadastrarUsuarioProvider.casdtrarUsuario(
      this.usuario,
      () => {
        this.exibirToastAlertWithDismiss("Usuário cadastrado com sucesso! Faça o login e bom Easy Tour!",6000,()=>{this.voltarParaLogin()});
      },
      () => {
        this.exibirToastAlert("Aconteceu um erro ao cadastrar o usuário! Por favor cheque sua conexão com a internet.",6000);
      }
    );
  }

  //verifica se as senhas informadas são iguais
  senhaConfirmada(usuario){
    return usuario.senha == usuario.reSenha;
  }

  //verifica se algum campo foi deixado em branco
  camposCadastroEmpty(usuario){
    return usuario.email == undefined || usuario.login == undefined || usuario.senha == undefined || usuario.reSenha == undefined;
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

  //caso ocorra um erro exibe uma mensagem informando o usuario. Utiliza o evento dismiss
  exibirToastAlertWithDismiss(msg,timeDuartion,callback){

    let toast = this.toastCtrl.create({
      message: msg,
      duration: timeDuartion,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });    
    toast.present();
    toast.onDidDismiss(() => {
      callback();
    }); 

  }  

}

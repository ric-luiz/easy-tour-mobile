import { LoginProvider } from './../../providers/login/login';
import { Usuario } from './../../models/Usuario';
import { CadastrarUsuarioPage } from './../cadastrar-usuario/cadastrar-usuario';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  usuario: Usuario;
  token:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public login: LoginProvider,public toastCtrl: ToastController) {
    this.usuario = new Usuario();    
  }

  //manda o usuario para a pagina principal onde tem o mapa
  gotMainPage(){    
    this.navCtrl.setRoot(HomePage); //como esta pagina é a root, quando setamos um novo root o usuario ja vai direto para ela
  }

  //manda o usuario para a pagina de cadatro
  cadastrarUsuario(){
    this.navCtrl.push(CadastrarUsuarioPage);
  }

  logarUsuario(){
    //Se algum dos campos estiver vazio envia uma mensagem para o usuario
    if(this.usuario.email == undefined || this.usuario.senha == undefined){
      this.exibirToastAlert('Login e Senha devem ser preenchidos.',3000);
      return;
    }

    this.login.logarUsuario(this.usuario,(token) =>{ 
      if(token != undefined){
        this.token = token;
        this.gotMainPage();
      }     
    },() => {
      this.exibirToastAlert('Usuário não existe. Por favor, crie um usuário ou verifique sua caixa de email para ativa-lo.',6000);
    });
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

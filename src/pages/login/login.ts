import { LoginProvider } from './../../providers/login/login';
import { Usuario } from './../../models/Usuario';
import { CadastrarUsuarioPage } from './../cadastrar-usuario/cadastrar-usuario';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  usuario: Usuario;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public login: LoginProvider) {
    this.usuario = new Usuario();
  }

  gotMainPage(){    
    this.navCtrl.push(HomePage);    
    /*this.navCtrl.setRoot(HomePage);*/
  }

  cadastrarUsuario(){
    this.navCtrl.push(CadastrarUsuarioPage);
  }

  logarUsuario(){
    console.log(this.usuario);
    this.login.logarUsuario(this.usuario);
  }

}

import { CadastrarUsuarioProvider } from './../../providers/cadastrar-usuario/cadastrar-usuario';
import { Usuario } from './../../models/Usuario';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cadastrar-usuario',
  templateUrl: 'cadastrar-usuario.html',
})
export class CadastrarUsuarioPage {

  usuario:Usuario;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public cadastrarUsuarioProvider:CadastrarUsuarioProvider) {
    this.usuario = new Usuario();
  }

  voltarParaLogin(){
    this.navCtrl.pop();
  }

  cadastrarUsuario(){
    console.log(this.usuario); 
    this.cadastrarUsuarioProvider.casdtrarUsuario(this.usuario);
  }

}

import { HomeProvider } from './../../providers/home/home';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  categorias: Array<any>;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              public homeProvider: HomeProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarefaListPage');    
    this.recuperarCategorias();
  }

  recuperarCategorias(){
    return this.homeProvider.recuperarRoteiros().subscribe(
      data => {
        this.categorias = data;
        console.log(this.categorias);
      },
      err => {
        console.log(err);
      }
    );
  }

  toggleLeftMenu() {
    this.menuCtrl.toggle();
  }

  toggleRightMenu() {
    this.menuCtrl.toggle('right');
  }

}

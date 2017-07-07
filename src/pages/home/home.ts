import { Geolocation } from '@ionic-native/geolocation';
import { HomeProvider } from './../../providers/home/home';
import { Component,ViewChild,ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  categorias: Array<any>;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              public homeProvider: HomeProvider,
              public geolocation: Geolocation) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarefaListPage');    
    this.recuperarCategorias();
    this.loadMap();
  }

  loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP        
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.adicionarPosicaoAtual(latLng);
    }, (err) => {
      console.log(err);
    });    
  }

  //Pega a posicao atual do device
  adicionarPosicaoAtual(latLng){    

    let marcador = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: {url : 'imagem/myPositionIcon.png'},
    });

    let conteudo = "<h4>Você esta aqui</h4>";

    this.adicionarJanelaInformacao(marcador,conteudo); 
  }

  //Coloca posições customizadas
  adicionarMarcador(){

    let marcador = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let conteudo = "<h4>Informação</h4>";

    this.adicionarJanelaInformacao(marcador,conteudo); 
  }

  adicionarJanelaInformacao(marker, content){
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });
  
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
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

import { LocationTrackerProvider } from './../../providers/location-tracker/location-tracker';
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
  marcador: any;
  conteudo: string;

  categorias: Array<any>;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              public homeProvider: HomeProvider,
              public geolocation: Geolocation,
              public locationTrackerProvider: LocationTrackerProvider) {                    
  }

  start(){
    this.locationTrackerProvider.startTracking(() => {
      this.refreshMap();
    });    
  }

  stop(){
    this.locationTrackerProvider.stopTracking();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TarefaListPage');        
    this.loadMap();
    this.recuperarCategorias();   
    this.start();     
  }

  loadMap(){
    let latLng = new google.maps.LatLng(this.locationTrackerProvider.lat, this.locationTrackerProvider.lng);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP        
      }      

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);  
      this.adicionarPosicaoInicial();      
  }

  //Usada como callback para ficar dando refresh na posição do turista
  refreshMap(){
    let latLng = new google.maps.LatLng(this.locationTrackerProvider.lat, this.locationTrackerProvider.lng);    
    this.map.setCenter(latLng);    
    this.marcador.setPosition(latLng);
  }

  //Pega a posicao atual do device
  adicionarPosicaoInicial(){    

    this.marcador = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(this.locationTrackerProvider.lat,this.locationTrackerProvider.lng),
      icon: {url : 'imagem/myPositionIcon.png'},
    });

    this.conteudo = "<h4>Você esta aqui</h4>";

    this.adicionarJanelaInformacao(this.marcador, this.conteudo);  
  }

  adicionarJanelaInformacao(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });  
    infoWindow.open(this.map, marker);
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

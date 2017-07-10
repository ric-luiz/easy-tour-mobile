import { GoogleMapsClusterProvider } from './../../providers/google-maps-cluster/google-maps-cluster';
import { LocationTrackerProvider } from './../../providers/location-tracker/location-tracker';
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

  categorias: Array<any>; //lista de categorias
  roteiros: Array<any>;  //lista dos roteiros de uma categoria
  pontos: Array<any>; //lista de pontos de um roteiro

  servicoDirecao: any;
  mostrarDiracaoNoMapa: any;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              public homeProvider: HomeProvider,
              public locationTrackerProvider: LocationTrackerProvider,
              public googleMapsClusterProvider: GoogleMapsClusterProvider) {                    
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

  start(){
    this.locationTrackerProvider.startTracking(() => {
      this.refreshMap();
    });    
  }

  stop(){
    this.locationTrackerProvider.stopTracking();
  }

  //Usada como callback para ficar dando refresh na posição do turista
  refreshMap(){
    let latLng = new google.maps.LatLng(this.locationTrackerProvider.lat, this.locationTrackerProvider.lng);         
    this.marcador.setPosition(latLng);

    if(!this.locationTrackerProvider.centralizou){
      this.locationTrackerProvider.centralizou = true;      
      this.map.setCenter(latLng);
    }

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

  // Por enquanto eu estou sempre peguando o primeiro roteiro daquela categoria. Para fins de teste
  recuperarCategorias(){
    return this.homeProvider.recuperarCategorias().subscribe(
      data => {
        this.categorias = data;
        //console.log(this.categorias);
      },
      err => {
        console.log(err);
      }
    );
  }

  escolherRoteiroDeUmaCategoria(categoriaEscolhida){    
    this.homeProvider.recuperarRoteiros(categoriaEscolhida).subscribe(
      data => {
        this.roteiros = data;
        //console.log(this.roteiros);
        if(this.roteiros[0] != undefined){
          this.recuperarPontosRoteiro(this.roteiros[0]);
        }        
      },
      err => {
        console.log(err);
      }
    );    
  }

  recuperarPontosRoteiro(roteiroEscolhido){
    this.homeProvider.recuperarPontosDoRoteiro(roteiroEscolhido).subscribe(
      data => {
        this.pontos = data;
        //console.log(this.pontos);
        if(this.pontos[0] != undefined){
          this.limparRotaAntiga();
          this.googleMapsClusterProvider.preencherLocalizacaoPonto(this.pontos);
          this.googleMapsClusterProvider.adicionarCluster(this.map);
        }        
      },
      err => {
        console.log(err);
      }
    );
  }  

  tracarRotaEntrePontosDoRoteiro(){
    if(this.googleMapsClusterProvider.marcadoresCluster != undefined) {
      
      let latLng = new google.maps.LatLng(this.locationTrackerProvider.lat, this.locationTrackerProvider.lng);    
      let geoCoder = new google.maps.Geocoder();      
      geoCoder.geocode(
        {location:latLng},
        (results, status) => {
          if(status == google.maps.GeocoderStatus.OK) {
            this.exibirRotaNoMapa(results[0].formatted_address);
            this.googleMapsClusterProvider.removerpontosDoRoteirodoMapa();
          }
        }
      );
       
    }
  }

  exibirRotaNoMapa(enderecoPartida){    
    let ultimoPonto = this.googleMapsClusterProvider.pontosDoRoteiro.length - 1;

    let rotaOption = {
      origin: enderecoPartida,
      destination: this.googleMapsClusterProvider.pontosDoRoteiro[ultimoPonto].lat+","+this.googleMapsClusterProvider.pontosDoRoteiro[ultimoPonto].lng, // Novo endereço de chegada
      waypoints: this.montarWayPoints(),				   
      travelMode: google.maps.TravelMode.WALKING
    }
    
    this.limparRotaAntiga();

    this.servicoDirecao = new google.maps.DirectionsService();
    this.mostrarDiracaoNoMapa = new google.maps.DirectionsRenderer();
    
    this.mostrarDiracaoNoMapa.setMap(this.map);

    this.servicoDirecao.route(rotaOption,
      (resultado, status) => {
        if(status == google.maps.DirectionsStatus.OK){
          this.mostrarDiracaoNoMapa.setDirections(resultado);
        }
      }
    );

  }

  //tiramos a ultima rota traçada entre os pontos caso o usuario clique em outro roteiro
  limparRotaAntiga(){
    if(this.mostrarDiracaoNoMapa != undefined){
      //console.log(this.mostrarDiracaoNoMapa);
      this.mostrarDiracaoNoMapa.setMap(null);
    }
  }

  //Monta a estrtura de pontos correta para o WayPOints do google maps
  montarWayPoints(){
    let pontos = [];

    for(let i = 0; i < this.googleMapsClusterProvider.pontosDoRoteiro.length - 1; i++){
      pontos[i] = {location: this.googleMapsClusterProvider.pontosDoRoteiro[i].lat+","+this.googleMapsClusterProvider.pontosDoRoteiro[i].lng};
    }

    return pontos;
  }

  toggleLeftMenu() {
    this.menuCtrl.toggle();
  }

  toggleRightMenu() {
    this.menuCtrl.toggle('right');
  }

}

import { RoteirosModalPage } from './../roteiros-modal/roteiros-modal';
import { GoogleMapsClusterProvider } from './../../providers/google-maps-cluster/google-maps-cluster';
import { LocationTrackerProvider } from './../../providers/location-tracker/location-tracker';
import { HomeProvider } from './../../providers/home/home';
import { Component,ViewChild,ElementRef } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
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
  nomeCategoria: string = 'Easy Tour'; //nome que vai ser exibido no header da pagina

  categorias: Array<any>; //lista de categorias
  roteiros: Array<any>;  //lista dos roteiros de uma categoria
  pontos: Array<any>; //lista de pontos de um roteiro

  servicoDirecao: any;
  mostrarDiracaoNoMapa: any;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              public modalCtrl: ModalController,
              public homeProvider: HomeProvider,
              public locationTrackerProvider: LocationTrackerProvider,
              public googleMapsClusterProvider: GoogleMapsClusterProvider) {                    
  }  

  ionViewDidLoad() {                   
    this.loadMap();
    this.recuperarCategorias();       
    this.start();

  }

  loadMap(){    
    let latLng = new google.maps.LatLng(this.locationTrackerProvider.lat, this.locationTrackerProvider.lng);

      let mapOptions = {
        center: latLng,
        zoom: 15,        
        disableDefaultUI: true,
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

    if(!this.locationTrackerProvider.centralizou){ //caso ainda não tenha centralizado o usuario
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

    /*this.adicionarJanelaInformacao(this.marcador, this.conteudo);*/
  }

  //adiciona Um balão com informações em cima do Marcado passado como parametro
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
      },
      err => {
        console.log(err);
      }
    );
  }

  //recupera os roteiros de uma categoria escolhida
  escolherRoteiroDeUmaCategoria(categoriaEscolhida){    
    this.homeProvider.recuperarRoteiros(categoriaEscolhida).subscribe(
      data => {
        this.roteiros = data;        
        if(this.roteiros[0] != undefined){          
          this.openModalRoteiros(this.roteiros,categoriaEscolhida);
        }        
      },
      err => {
        console.log(err);
      }
    );
    this.nomeCategoria = 'Categoria '+categoriaEscolhida.nome;
    this.toggleRightMenu();    
  }

  //recupera todos os pontos do roteiro escolhido
  recuperarPontosRoteiro(roteiroEscolhido,categoriaEscolhida){ //a categoria serve para pegarmos a imagem correta para aqueles pontos
    this.homeProvider.recuperarPontosDoRoteiro(roteiroEscolhido).subscribe(
      data => {
        this.pontos = data;        
        if(this.pontos[0] != undefined){
          this.limparRotaAntiga();
          this.googleMapsClusterProvider.preencherLocalizacaoPonto(this.pontos);
          this.googleMapsClusterProvider.adicionarCluster(this.map,categoriaEscolhida);
        }        
      },
      err => {
        console.log(err);
      }
    );
  }  

  //Traca a rota entre os pontos do roteiro escolhido (caso tenha sido escolhido). Atualmente esta associado ao botão de play na pagina HOME
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

  //Vai exibir rota escolhida ao ativar o tracarRotaEntrePontosDoRoteiro
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

  //abre o modal que vai mostrar os roteiros daquela categoria
  openModalRoteiros(roteiros,categoria){    
    let modal = this.modalCtrl.create(RoteirosModalPage,{roteiros:roteiros,categoria:categoria});    
    modal.present(); 
    modal.onDidDismiss(roteiro => {      
      if(roteiro != undefined){        
        this.recuperarPontosRoteiro(roteiro,categoria);
      }
    });
  }

  toggleLeftMenu() {
    this.menuCtrl.toggle();
  }

  toggleRightMenu() {
    this.menuCtrl.toggle('right');
  }

}

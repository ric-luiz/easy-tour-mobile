import { PontoModalPage } from './../ponto-modal/ponto-modal';
import { RoteirosModalPage } from './../roteiros-modal/roteiros-modal';
import { GoogleMapsClusterProvider } from './../../providers/google-maps-cluster/google-maps-cluster';
import { LocationTrackerProvider } from './../../providers/location-tracker/location-tracker';
import { HomeProvider } from './../../providers/home/home';
import { Component,ViewChild,ElementRef } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { MenuController,ToastController } from 'ionic-angular';

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
  nomeCategoria: string = 'Sol e Mar'; //nome que vai ser exibido no header da pagina
  nomeImagemCategoria: string = 'assets/header/Sol e Mar.png'; //nome da imagem que sera colocada no header

  categorias: Array<any>; //lista de categorias
  roteiros: Array<any>;  //lista dos roteiros de uma categoria
  pontos: Array<any>; //lista de pontos de um roteiro
  
  roteiro: any; //recebe o roteiro escolhido pelo usuario
  distanciaMaximaPonto: number = 0.020; //distancia maxima que o turista deve esta de um ponto. Em Km.
  pontoProximo: any; //recebe o ponto mais proximo do turista de acordo com a distancia maxima
  modalPontoProximoAberto: boolean = false; //serve para evitar que o modal seja aberto 2 vezes ao ficar dando refresh em recuperar a posição do device

  servicoDirecao: any;
  mostrarDiracaoNoMapa: any;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              public modalCtrl: ModalController,
              public homeProvider: HomeProvider,
              public locationTrackerProvider: LocationTrackerProvider,
              public googleMapsClusterProvider: GoogleMapsClusterProvider,
              public toastCtrl: ToastController) {                    
  }  

  ionViewDidLoad() {                   
    this.loadMap();
    this.recuperarCategorias();       
    this.start();
    this.iniciarAplicativoComSolemar();
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

    this.verificarUsuarioPertoPonto();

  }

  //Usado para exibir primeiro roteiro da categoria sol e mar
  iniciarAplicativoComSolemar(){
    let categoria = {nome: "Sol e Mar"};
    let roteiro = {id:5};
    this.recuperarPontosRoteiro(roteiro,categoria);
  }

  //verifica se o usuario esta perto de algum ponto de um roteiro
  verificarUsuarioPertoPonto(){
    /*console.log("Recuperando os pontos proximos ao usuario");*/
    if(this.pontos != undefined && this.pontos.length > 0 && this.pontoProximo == undefined) { //se existe algum conjunto de pontos que o turista escolheu

      let latLng = {lat:this.locationTrackerProvider.lat,lng:this.locationTrackerProvider.lng};      
      this.homeProvider.recuperarPontosProximosAoUsuario(latLng,this.roteiro).subscribe(
        data => {                    

          for(let pontosProximidade of data){ //a mesma lista de pontos do turista, mas essa contém a distancia que o turista esta daquele ponto            
            if(pontosProximidade.distancia <= this.distanciaMaximaPonto && this.pontoProximoNosParaVisitar(pontosProximidade)){
              this.pontoProximo = pontosProximidade; //colocamos este ponto como o mais proximo
              this.modalPontoProximo();
              break;
            }

          }

        },
        err => {
          console.log(err);
        }
      );

    }
    
  }

  //Verifica se o ponto proximo esta no array de pontos do mapa. Somente pontos ainda não visitados aparecem são considerados
  pontoProximoNosParaVisitar(pontoProximo){
    for(let p of this.pontos){
      if(p.ponto.id == pontoProximo.id){
        return true;
      }
    }
    return false;
  }

  //abre o modal para exibir informações do ponto proximo
  modalPontoProximo(){
    let pontoProximo = this.pontoProximo;    
    if(pontoProximo != undefined && !this.modalPontoProximoAberto){ //abre se o ponto proximo tiver sido encontrado e não existir nenhum outro modal aberto
      this.modalPontoProximoAberto = true;

      let modal = this.modalCtrl.create(PontoModalPage,{pontoRoteiro:pontoProximo});          
      modal.present(); 

      modal.onDidDismiss(() => {   

        let novosPontos: Array<any> = new Array<any>();              

        for(let p of this.pontos){
          if(p.ponto.id != pontoProximo.id){
            novosPontos.push(p);
          }
        }                       

        this.pontoProximo = undefined;      
        this.pontos = novosPontos;        
        this.modalPontoProximoAberto = false; //informamos que não existe nenhum modal aberto

      });

    }
  }

  //centraliza a tela em cima da posição do usuário
  centralizarNoUsuario(){
    let latLng = new google.maps.LatLng(this.locationTrackerProvider.lat, this.locationTrackerProvider.lng);
    this.map.setCenter(latLng);
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
        } else {
          this.exibirToastAlert('Não existe roteiros cadastrados nesta categoria.',4000);
        }        
      },
      err => {
        console.log(err);
        this.exibirToastAlert('Ocorreu um erro ao buscar os roteiros. Verifique sua conexão com a intenet.',6000);
      }
    );
    this.nomeCategoria = categoriaEscolhida.nome;
    this.nomeImagemCategoria = 'assets/header/'+categoriaEscolhida.nome+'.png';
    this.toggleMenuCategorias()   
    this.pontos = new Array<any>(); //resetamos o array de pontos quando vamos escolher outro roteiro. É necessário para evitar que seja exibido o modal de outros pontos de outros roteiros       
  }

  //recupera todos os pontos do roteiro escolhido
  recuperarPontosRoteiro(roteiroEscolhido,categoriaEscolhida){ //a categoria serve para pegarmos a imagem correta para aqueles pontos
    this.homeProvider.recuperarPontosDoRoteiro(roteiroEscolhido).subscribe(
      data => {
        this.pontos = data;        
        if(this.pontos[0] != undefined){
          this.roteiro = roteiroEscolhido;
          this.limparRotaAntiga();
          this.googleMapsClusterProvider.preencherLocalizacaoPonto(this.pontos);
          this.googleMapsClusterProvider.adicionarCluster(this.map,categoriaEscolhida);
          this.googleMapsClusterProvider.centralizarVisualizacaoMapaNosPontos(this.map,this.pontos);
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
       
    } else {
      this.exibirToastAlert('É necessário escolher um roteiro primeiro para traçar a rota.',6000);
    }
  }
  
  //Vai exibir rota escolhida ao ativar o tracarRotaEntrePontosDoRoteiro
  exibirRotaNoMapa(enderecoPartida){    
    let ultimoPonto = this.googleMapsClusterProvider.pontosDoRoteiro.length - 1;

    let rotaOption = {
      origin: enderecoPartida,
      destination: this.googleMapsClusterProvider.pontosDoRoteiro[ultimoPonto].lat+","+this.googleMapsClusterProvider.pontosDoRoteiro[ultimoPonto].lng, // Novo endereço de chegada
      waypoints: this.montarWayPoints(),				   
      travelMode: google.maps.TravelMode.DRIVING
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

  //Vai a função de abrir e fechar o menu configurações
  toggleMenuConfiguracoes() {
    this.menuCtrl.enable(false,"categorias");
    this.menuCtrl.enable(true,"configuracoes");
    this.menuCtrl.toggle("configuracoes");
  }

  //Vai a função de abrir e fechar o menu categorias
  toggleMenuCategorias() {
    this.menuCtrl.enable(true,"categorias");
    this.menuCtrl.enable(false,"configuracoes");
    this.menuCtrl.toggle('categorias');
  }

}

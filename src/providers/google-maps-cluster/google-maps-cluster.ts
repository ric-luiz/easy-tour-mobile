import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import 'rxjs/add/operator/map';

declare var google;

@Injectable()
export class GoogleMapsClusterProvider {

  marcadoresCluster: any;  
  pontosDoRoteiro: any;
  infoBoxes: any; //array que recebe as caixas de informações referentes ao ponto do roteiro

  constructor(public http: Http) {    
    this.pontosDoRoteiro = []; 
    this.infoBoxes = [];   
  }


  /**
   * Vai preencher o array de pontos com todos os pontos de um roteiro
   * @author Ricardo Luiz <ricardoluiz508@gmail.com>
   * @param pontos Array de pontos do roteiro de uma categoria escolhida   
   */
  preencherLocalizacaoPonto(pontos){
    this.removerpontosDoRoteirodoMapa(); //remove os marcadores que ja estavam selecionado no roteiro (caso eles existam) 

    let j = 0;
    for(let i of pontos){      
      this.pontosDoRoteiro[j] = {
                                 id: i.ponto.id,
                                 lat: i.ponto.latitude, 
                                 lng:i.ponto.longitude, 
                                 nome: i.ponto.nome,
                                 descricao: i.ponto.descricao
                                };
      j++;
    }
    
  }

  /**
   * vai centralizar a visualização do mapa nos pontos do roteiro escolhido
   */
  centralizarVisualizacaoMapaNosPontos(map,pontos){
    if(map != undefined){      
      let latLngBounds = new google.maps.LatLngBounds();

      for(let i of pontos){ //montamos o array para o google saber como centralizar
        latLngBounds.extend(new google.maps.LatLng(i.ponto.latitude,i.ponto.longitude));        
      }
      
      //centralizando e mexendo no zoom
      map.setCenter(latLngBounds.getCenter());
      map.fitBounds(latLngBounds); 

    }
  }

  //Adiciano no mapa os marcadores. Usa-se os pontos para fazer Isso
  adicionarCluster(map,categoriaEscolhida){
    let iconeCategoriaName = 'easy-tour';
    if(categoriaEscolhida.nome != undefined){
      iconeCategoriaName = categoriaEscolhida.nome;
    }

    if(map){      
      let marcadoresPonto = this.pontosDoRoteiro.map((ponto) => {        
        
        let location = {lat:ponto.lat,lng:ponto.lng};

        let marcador = new google.maps.Marker({
          position: location,
          title: ponto.descricao,
          animation: google.maps.Animation.DROP,
          icon: {url : 'assets/icones/'+iconeCategoriaName+'.png'}
        });

        //controi o popup com informações do ponto
        let infoWindow = new google.maps.InfoWindow({
          content: '<p>'+ponto.nome+'</p> <p>'+ponto.descricao+'<\p>'
        });
        
        //evento de clique pra exibir informações do ponto ao clicar no marcador
        marcador.addListener('click', ()=>{
          infoWindow.open(map,marcador);
        });

        return marcador;
      });

      this.marcadoresCluster = new MarkerClusterer(map, marcadoresPonto,{imagePath: 'assets/m'});      
    } else {
      console.warn("O mapa deve ser carregado antes de adicionar os marcadores");
    }

  }

  //remove todos os marcadores de um roteiro dentro do mapa
  removerpontosDoRoteirodoMapa(){
    if(this.marcadoresCluster != undefined){
      //console.log(this.marcadoresCluster);
      this.marcadoresCluster.clearMarkers();
      this.pontosDoRoteiro = [];  
    }
  }
}

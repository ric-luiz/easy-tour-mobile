import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import 'rxjs/add/operator/map';

declare var google;

@Injectable()
export class GoogleMapsClusterProvider {

  marcadoresCluster: any;  
  pontosDoRoteiro: any;

  constructor(public http: Http) {    
    this.pontosDoRoteiro = [];    
  }

  preencherLocalizacaoPonto(pontos){
    this.removerpontosDoRoteirodoMapa(); //remove os marcadores que ja estavam selecionado no roteiro (caso eles existam) 

    let j = 0;
    for(let i of pontos){      
      this.pontosDoRoteiro[j] = {lat: i.ponto.latitude, lng:i.ponto.longitude };
      j++;
    }

    //console.log(this.pontosDoRoteiro);
  }

  adicionarCluster(map){
    
    if(map){      
      let marcadoresPonto = this.pontosDoRoteiro.map((location) => {
        return new google.maps.Marker({
          position: location,
          animation: google.maps.Animation.DROP,
          icon: {url : 'assets/easy-tour.png'}
        });
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

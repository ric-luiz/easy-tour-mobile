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
      this.pontosDoRoteiro[j] = {lat: i.ponto.latitude, 
                                 lng:i.ponto.longitude, 
                                 nome: i.ponto.nome,
                                 descricao: i.ponto.descricao
                                };
      j++;
    }

    //console.log(this.pontosDoRoteiro);
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
          animation: google.maps.Animation.DROP,
          icon: {url : 'assets/'+iconeCategoriaName+'.png'}
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

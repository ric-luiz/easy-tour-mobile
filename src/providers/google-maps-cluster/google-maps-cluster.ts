import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import 'rxjs/add/operator/map';

declare var google;

@Injectable()
export class GoogleMapsClusterProvider {

  marcadoresCluster: any;
  locations: any;

  constructor(public http: Http) {
    console.log('Hello GoogleMapsClusterProvider Provider');  
    this.locations = [];  
  }

  preencherLocalizacao(pontos){        
    let j = 0;
    for(let i of pontos){      
      this.locations[j] = {lat: i.ponto.latitude, lng:i.ponto.longitude };
      j++;
    }
    console.log(this.locations);
  }

  adicionarCluster(map){
    
    if(map){

      let marcadores = this.locations.map((location) => {
        return new google.maps.Marker({
          position: location,
          animation: google.maps.Animation.DROP,
          icon: {url : 'assets/sol-praia-icon.png'}
        });
      });

      this.marcadoresCluster = new MarkerClusterer(map, marcadores,{imagePath: 'assets/m'});

    } else {
      console.warn("O mapa deve ser carregado antes de adicionar os marcadores");
    }

  }

}

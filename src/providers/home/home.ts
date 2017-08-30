import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeProvider {
  static get parameters() {
    return [[Http]];
  }
  
  apiName = 'https://easy-tour-brasil-api.herokuapp.com';

  constructor(public http: Http) {    
  }

  //recupera a lista de categorias
  recuperarCategorias(){
    var url = this.apiName+'/categorias';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  //recupera roteiros de uma categoria
  recuperarRoteiros(categoria){
    var url = this.apiName+'/categorias/'+categoria.id+'/roteiros';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  recuperarPontosDoRoteiro(roteiro){
    var url = this.apiName+'/roteiros/'+roteiro.id+'/pontos';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  //vai recuperar os pontos que estão proximos do usuario
  recuperarPontosProximosAoUsuario(posicaoTurista,roteiroEscolhido){      
    var url = this.apiName+'/pontos/proximos?lat='+posicaoTurista.lat+'&lng='+posicaoTurista.lng+'&roteiroId='+roteiroEscolhido.id;    
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeProvider {
  static get parameters() {
    return [[Http]];
  }
  
  apiName = 'http://tour-easy-api.herokuapp.com';

  constructor(public http: Http) {    
  }

  //recupera a lista de categorias
  recuperarCategorias(){
    var url = this.apiName+'/categoria';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  //recupera roteiros de uma categoria
  recuperarRoteiros(categoria){
    var url = this.apiName+'/categoria/'+categoria.id+'/roteiro';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  recuperarPontosDoRoteiro(roteiro){
    var url = this.apiName+'/roteiro/'+roteiro.id+'/ponto';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  //vai recuperar os pontos que estão proximos do usuario
  recuperarPontosProximosAoUsuario(posicaoTurista,roteiroEscolhido){      
    var url = this.apiName+'/ponto/proximos?lat='+posicaoTurista.lat+'&lng='+posicaoTurista.lng+'&roteiroId='+roteiroEscolhido.id;    
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

}

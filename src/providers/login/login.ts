import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginProvider {

  apiName = 'https://tour-easy-api.herokuapp.com';  

  constructor(public http: Http) {    
  }

  logarUsuario(usuario,logarFunction,erroLogarFunction){
    var url = this.apiName+'/token';    
    var credenciais = usuario.email+':'+usuario.senha;        

    let headers = new Headers();        
    headers.append('Authorization', ['Basic',window.btoa(credenciais)].join(' '));    

    var response = this.http.get(url,{headers:headers}).subscribe(data => {
      var json = JSON.parse(data['_body']);      

      if(json.token != undefined){        
        logarFunction(json.token);
      }

    }, err =>{
      console.log(err);
      erroLogarFunction();
    });    
  }

}

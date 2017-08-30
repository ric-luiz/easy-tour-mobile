import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CadastrarUsuarioProvider {

  apiName = 'https://easy-tour-brasil-api.herokuapp.com';

  constructor(public http: Http) {    
  }

  casdtrarUsuario(usuario,callback1,callback2){
    var url = this.apiName+'/contas';    

    let headers = new Headers();
    headers.append("Accept",'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({headers: headers});

    let postUsuario = {email:usuario.email, login:usuario.login, senha:usuario.senha}; //somente estes 3 campos são necessários para efetuar o cadastro    

    this.http.post(url,postUsuario,options).subscribe(data => {      
      console.log(data);
      callback1();
    }, err =>{
      console.log(err);
      callback2();
    });    
  }

}

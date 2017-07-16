import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginProvider {

  apiName = 'http://tour-easy-api.herokuapp.com';

  constructor(public http: Http) {    
  }

  logarUsuario(usuario){
    var url = this.apiName+'/token';    

    let headers = new Headers();
    headers.append("Accept",'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({headers: headers});

    var response = this.http.get(url,options).subscribe(data => {
      console.log(data);
    }, err =>{
      console.log(err);
    });    
  }

}

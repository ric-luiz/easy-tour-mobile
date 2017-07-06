import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HomeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class HomeProvider {
  static get parameters() {
        return [[Http]];
    }


  constructor(public http: Http) {
    console.log('Hello HomeProvider Provider');
  }

  recuperarRoteiros(){
    var url = 'http://tour-easy-api.herokuapp.com/categoria';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

}

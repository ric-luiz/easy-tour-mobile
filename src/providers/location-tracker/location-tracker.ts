import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  constructor(public http: Http, public zone: NgZone, 
              public backgroundGeolocation: BackgroundGeolocation,
              public geolocation: Geolocation) {
    console.log('Hello LocationTrackerProvider Provider');
  }

  startTracking(funcao) {
      //Rastreando no background

      let config = {
        desiredAccuracy: 0,
        stationaryRadius: 20,
        distanceFilter: 10,         
        interval: 2000
      };

      this.backgroundGeolocation.configure(config).subscribe((location) => {

        console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

        //Roda a atualização na zona dentro do angular
        this.zone.run(()=>{
          this.lat = location.latitude;
          this.lng = location.longitude;
        });        
      }, (err) => {
        console.log(err);
      });

      //Liga o background-geolocation.
      this.backgroundGeolocation.start();
      
      //Foreground tracking
      let options = {
        frequency: 3000        
      }

      this.watch = this.geolocation.watchPosition(options).subscribe((position: Geoposition) => {
 
        console.log(position);
      
        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        });
      
        funcao();
      });      
  }
 
  stopTracking() {
    
    console.log('stopTracking');
 
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
 
  }

}

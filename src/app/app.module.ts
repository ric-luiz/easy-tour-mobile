import { RoteirosModalPage } from './../pages/roteiros-modal/roteiros-modal';
import { LoginPage } from './../pages/login/login';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HttpModule } from '@angular/http';
import { HomeProvider } from '../providers/home/home';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { GoogleMapsClusterProvider } from '../providers/google-maps-cluster/google-maps-cluster';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RoteirosModalPage
  ],
  imports: [
    BrowserModule,    
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RoteirosModalPage
  ],
  providers: [
    BackgroundGeolocation,        
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HomeProvider,
    Geolocation,
    LocationTrackerProvider,
    GoogleMapsClusterProvider,
  ]
})
export class AppModule {}

import { ImagestorageService } from './services/imagestorage.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Importamos la libreria de FirebaseCloudMessaging
import { FCM } from '@ionic-native/fcm/ngx';

//Importamos la libreria de ImagePicker para el uso de la galeria
import { ImagePicker } from '@ionic-native/image-picker/ngx';

//Importamos la libreria de HttpClient
import { HttpClientModule } from '@angular/common/http';
//Importamos todos las librerias de firebase
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';

//Clave key de aplicacion web de firebase
var firebaseConfig = {
  apiKey: "AIzaSyA7_ZucYugaKrje0b4F94fG17z9pF-uYpI",
  authDomain: "chatfirebase1-f45a1.firebaseapp.com",
  databaseURL: "https://chatfirebase1-f45a1.firebaseio.com",
  projectId: "chatfirebase1-f45a1",
  storageBucket: "chatfirebase1-f45a1.appspot.com",
  messagingSenderId: "1067459201561",
  appId: "1:1067459201561:web:3a8bc5a17575e65d"
};

// Inicializamos Firebase
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  //Importamos los modulos y entre ellos al modulo de HttpClient
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, AngularFireStorageModule],
  providers: [
    StatusBar,
    SplashScreen,
    //Como proveedor a ImagePicker
    ImagePicker,
    //Como proveedor a nuestro servicoi de imagenes
    ImagestorageService,
    //Como proveedor a FirebaseCloudMessaging
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

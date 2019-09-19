import { NotifiService } from './../services/notifi.service';
import { Component, OnInit } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(private fcm: FCM, public notifiService:NotifiService) {}

  ngOnInit(){
    
    this.fcm.getToken().then(token => {
      console.log('hola mundo')
      console.log(token)
    });
  }

  send(){
    var dataToSend = {
      "notification": {
        "title" : "Notificacion ChaTION LIMBERT",
        "body" : "Nuevo Mensaje en la app ChatION",
        "sound" : "default"
      },
      "to": "sY_SUBs:APA91bGiHiWW0EOVfOJzRKf5G6KaC10Z7BcG7hCzJorLK7ucKH3qChZSr768-gQzk2urIf93SvRLRFJ8c_BoPHrkjfytdGbeHd9y6x7kFra_lsde0nau1D767UJ7YL2k4ox4OzefVh75"
    };
    this.notifiService.saveData(dataToSend).subscribe((dataReturn) => {

    })
  }

}


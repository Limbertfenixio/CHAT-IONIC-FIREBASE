import { ImagestorageService } from './../../services/imagestorage.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { NotifiService } from './../../services/notifi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase'

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})

export class ChatsPage implements OnInit {

  @ViewChild(IonContent, null) content: IonContent;
  // Creamos una nueva fecha actual en el formato fecha ISO 
  d = new Date().toISOString();
  msg: string;
  messages = []
  private win : any = window;

  id = null;
  tel = null;
  nom = null;
  constructor(public activeRoute: ActivatedRoute, private router: Router,public notifiService:NotifiService,public imagePicker: ImagePicker, public imagePickerService: ImagestorageService) {}

  ngOnInit() {
    //Recuperamos los parametros que han sido enviados por la ruta
    this.id = this.activeRoute.snapshot.params.id;
    this.tel = this.activeRoute.snapshot.params.tel;
    this.nom = this.activeRoute.snapshot.params.nom;

    //Recuperamos el id_usuario y el telefono del destinatario
    var refTel = firebase.database().ref().child('usuarios');
    refTel.on('value' , (snap) => {
      var data = snap.val();
      var id_des;
      var mi_tel; 
      
      for(var key in data){
        if(data[key].telefono == this.tel){
          id_des = data[key].id_usuario;
        }
        if(data[key].id_usuario == this.id){
          mi_tel = data[key].telefono;
        }
      }
      // Obtenemos los mensajes del destinatario
      this.getMessage(id_des, mi_tel);
    }) 
  }

  /**
   * Metodo que se encarga de enviar el mensaje al destinatario
   */
  sendMessage(){
    var ref = firebase.database().ref('mensajes').push({
      id_usuario: this.id,
      telefono_des : this.tel,
      fecha: this.d,
      mensaje : this.msg,
      nombre_des : this.nom
    })
    //Recuperamos el token del destinatario
    this.getTokenId(this.tel);
    //Limpiamos el campo de texto msg
    this.msg = "";
    //Hacemos que el scroll baje al ultimo mensaje ingresado
    this.content.scrollToBottom(1000);
  }

  /**
   * Metodo que se encarga de obtener los mensajes del emisor y el receptor
   * @param id_des id del destinatario
   * @param tel_des telefono del destinatario
   */
  getMessage(id_des,tel_des){
    //Recuperamos los datos que existen en la rama mensajes
    var ref = firebase.database().ref().child('mensajes').orderByChild('date');
    ref.on('value', (snap) => {
      var data = snap.val();
      //Limpiamos la iteracion anterior
      this.messages = []
      for(var key in data){
        //Si los mensajes pertenecen al usuario emisor y al usuario receptor
        if(data[key].id_usuario == this.id && data[key].telefono_des == this.tel || data[key].id_usuario == id_des && data[key].telefono_des == tel_des){
          //Almacenamos todos los mensajes en el arreglo
          this.messages.push(data[key]);
        }
      }
    })
    this.content.scrollToBottom(1000);
  };

  /**
   * Metodo que se encarga de recuperar el Token_id del destinatario
   * @param tel telefono del destinatario
   */
  getTokenId(tel){
    //Recuperamos el token del usuario que este registrado con el telefono
    var ref = firebase.database().ref().child('usuarios');
    ref.on('value', (snap) => {
      var data = snap.val();
      for(var key in data){
        if(data[key].telefono == tel){
          this.sendNotifi(data[key].token_id);
        }
      }
    });
  }

  /**
   * Metodo que se encarga de enviar una peticion http al servicio de notificacion
   * con el token_id del destinatario
   * @param token token a ser enviado la notificacion del servicio
   */
  sendNotifi(token){
    //Enviamos en formato JSON la peticion http hacia el proveedor de servicios de notificaciones de fCM
    var dataToSend = {
      //En la propiedad notification enviamos todos los atributos que se mostraran en la notificacion
      "notification": {
        "title" : "Notificacion ChaTION LIMBERT",
        "subtitle" : "leer mensaje...",
        "body" : "Nuevo Mensaje en la app ChatION....",
        "sound" : "default",
        "icon" : "myicon",
        "color" : "#3CC333"
      },
      //En la propiedad to enviamos al token registrado para que reciba la notificacion
      "to": token
    };
    //Suscribimos la peticion http en el proveedor de servicios de notificaciones de FCM
    this.notifiService.saveData(dataToSend).subscribe((dataReturn) => {
    })
  }

  openImagePicker(){
    this.imagePicker.hasReadPermission()
    .then(async (result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns
        this.imagePicker.requestReadPermission();
      }
      else if(result == true){
        this.imagePicker.getPictures({
          maximumImagesCount: 1
        })
        .then((results) => {
          for (var i = 0; i < results.length; i++) {
            this.uploadImageToFirebase(results[i]);
          }
        }, (err) => console.log(err));
      }
    }, (err) => {
      console.log(err);
    });
  }

  uploadImageToFirebase(image){
    //image = normalizeURL(image);
    image = this.win.Ionic.WebView.convertFileSrc(image);
    //image = Capacitor.convertFileSrc(image);
    let imageNom =   (Math.random() * 100) + (Math.random() * 15);
    //uploads img to firebase storage
    this.imagePickerService.uploadImage(image,'/images/imagen' + imageNom).then( async (photoURL) => {
      console.log('path' + photoURL);
    
      this.getUrl(imageNom)
    }, (err) => {
      console.log('error' + err);
    })

    /**/
  }

  /**
   * Funcion que se encarga de obtener el url de las imagenes enviadas
   * @param path nombre de la imagen a buscar en la bd
   */
  getUrl(path){

    var refStorage = firebase.storage().ref().child('images').child('imagen' + path).getDownloadURL().then( (url) => {
      var ref = firebase.database().ref('mensajes').push({
        id_usuario: this.id,
        telefono_des : this.tel,
        fecha: this.d,
        uriImage : url,
        nombre_des : this.nom
      })
  
      //Recuperamos el token del destinatario
      this.getTokenId(this.tel);
      //Limpiamos el campo de texto msg
      this.msg = "";
      //Hacemos que el scroll baje al ultimo mensaje ingresado
      this.content.scrollToBottom(1000);
    })
    
  }


  /*getMessage(){
    var ref = firebase.database().ref().child('mensajes').orderByChild('date');
    ref.on('value', (snap) => {
      var data = snap.val();
      this.messages = []
      for(var key in data){
        if(data[key].id_usuario == this.id && data[key].telefono_des == this.tel){
          this.messages.push(data[key]);
        }
      }
    });

    var refTel = firebase.database().ref().child('usuarios');
    refTel.on('value' , (snap) => {
      var data = snap.val();
      var id_des;
      var mi_tel; 
      
      for(var key in data){
        if(data[key].telefono == this.tel){
          id_des = data[key].id_usuario;
        }
        if(data[key].id_usuario == this.id){
          mi_tel = data[key].telefono;
        }
      }
      this.getMessageRec(id_des, mi_tel);
    })
  }

  getMessageRec(id, tel){
    var ref = firebase.database().ref().child('mensajes').orderByChild('date');
    console.log('telefono destino '  + id);
    console.log('mi telefnon'  + tel);  
    ref.on('value', (snap) => {
      var data = snap.val();
      //this.messagesRec = []
      for(var key in data){
        if(data[key].id_usuario == id && data[key].telefono_des == tel){
          console.log('datos: '+ data[key])
          this.messages.push(data[key]);
        }
      }
    });
  }*/

}

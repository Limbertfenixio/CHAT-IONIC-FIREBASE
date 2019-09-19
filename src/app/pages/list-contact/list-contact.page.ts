import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
//Importamos la libreria Router para poder navegar entre las rutas
import { Router } from '@angular/router';
//Importamos la libreria ActivatedRoute para poder recibir los parametros que llegan a la ruta
import { ActivatedRoute } from '@angular/router';
//Importamos firebase
import * as firebase from 'firebase';


@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.page.html',
  styleUrls: ['./list-contact.page.scss'],
})
export class ListContactPage implements OnInit {

  contacts  = [];
  argumentos = null;

  constructor(public alertctrl: AlertController,public activeRoute: ActivatedRoute, private router: Router) { 
    
  }

  ngOnInit() {
    //Recibimos los argumentos que llegan a la ruta
    this.argumentos = this.activeRoute.snapshot.paramMap.get('id');
    //Mostramos los contactos existentes
    this.getContact();
  }

  /**
   * Funcion que se encarga de mostrar una alerta en la pantalla de forma asincrona
   */
  async presentAlert() {
    //Esperamos a que la alerta se cree
    const alert = await this.alertctrl.create({
      header: 'Agregar nuevo contacto',
      
      inputs: [
        {
          name: 'txtContacto',
          type: 'text',
          placeholder: 'Nombre del contacto'
        },
        {
          name: 'txtTel',
          type: 'number',
          id: 'name2-id',
          placeholder: 'Numero de telefono'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, 
        {
          text: 'Ok',
          handler: (data) => {
            //Agregamos el contacto con los datos ingresados dentro de la alerta
            this.addContact(data.txtContacto,data.txtTel);
            console.log('Confirm Ok');
          }
        }
      ]
    });
    //Mostramos la alerta en pantalla
    await alert.present();
  }

  /**
   * Metodo que se encarga de agregar nuevos contactos de usuario
   * @param nomContact Nombre del contacto
   * @param numTel Numero telefonico del contacto
   */
  addContact(nomContact,numTel){
    var ref = firebase.database().ref('contactos').push({
      id_usuario: this.argumentos,
      nombre: nomContact,
      telefono: numTel
    })
  }

  /**
   * Metodo que se encarga de obtener todos los contactos que tiene un usuario
   */
  getContact(){
    //Obtenemos los datos de la rama contactos
    var ref = firebase.database().ref().child('contactos')
  
    ref.on("value", (snap) => {
      var data = snap.val();
      this.contacts = [];
      for(var key in data){
        //Si el id del usuario es el mismo que el id actual
        if(data[key].id_usuario == this.argumentos){
          this.contacts.push(data[key]);
        }
      }
    });
  }

  /**
   * Metodo que se encarga de navegar hacia la ruta chats pasando 2 parametros
   * @param tel telefono del destinatario
   * @param nombre Nombre del destinatario
   */
  linkChat(tel,nombre){
    this.router.navigate(['/chats', this.argumentos, tel, nombre])
  }

}

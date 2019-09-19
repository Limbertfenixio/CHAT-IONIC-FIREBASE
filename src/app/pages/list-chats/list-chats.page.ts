//Importamos la libreria Router para poder navegar entre las rutas
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
//Importamos la libreria ActivatedRoute para poder recibir los parametros que llegan a la ruta
import { ActivatedRoute } from '@angular/router';
//Importamos firebase
import * as firebase from 'firebase';

@Component({
  selector: 'app-list-chats',
  templateUrl: './list-chats.page.html',
  styleUrls: ['./list-chats.page.scss'],
})
export class ListChatsPage implements OnInit {

  chats = [];
  id = null;
  mi_tel = null;
  //Variable de control para obtener el nombre
  estnom  = false;
  estmes = false;
  constructor(public activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    //Obtenemos los parametros que llegaron a la ruta
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.mi_tel = this.activeRoute.snapshot.paramMap.get('tel');
    //Mostramos los chats recientes
    this.getChats();
  }

  /**
   * Metodo que se encarga de verificar si el telefono esta registrado entre los contactos del usuario
   * @param tel telefono a buscar entre la lista de contactos de usuario
   */
  comContacts(tel){
    var ref = firebase.database().ref().child('contactos');
    ref.on('value', (snap) => {
      var data = snap.val();
      for(var key in data){
        //Si el id usuario es el mismo que id actual a buscar
        if(data[key].id_usuario == this.id){
          //Si el telefono es el mismo al telefono a buscar
          if(data[key].telefono == tel){
            this.estnom = true;
          }else{
            this.estnom = false;
          }
        }
      }      
    })
  }
  
  /**
  *  Metodo que se encarga de verificar si el id del destinatario pertenece algun usuario 
  */
  comid(id_des){
    //Obtenemos los datos de la rama usuarios
    var ref = firebase.database().ref().child('usuarios');
    ref.on('value' , (snap) => {
      var data = snap.val();
      for(var key in data){
        //Si el id usuario es igual al id destinatario a buscar
        if(data[key].id_usuario == id_des){
          //this.comContacts(data[key].telefono, 0);
        }
      }
    });
  }

  /**
   * Metodo que se encarga de obtener los ultimos mensajes que tiene el usuario
   */
  getChats(){
    //Obtenemos los datos de la rama mensajes
    var ref  = firebase.database().ref().child('mensajes').orderByChild('date');
    ref.on('value' , (snap) => {
      var data = snap.val();
      var nom = "";
      //Limpiamos el arreglo de una iteracion anterior
      this.chats = [];
      for (var key in data){
        //Si el id usuario el es mismo al id actual a buscar 
        if(data[key].id_usuario == this.id){
          //Si la variable nom no se repide mas de 2 veces
          if(nom != data[key].nombre_des){
            //Verificamos si el telefono existe entre los contactos de usuario
            this.comContacts(data[key].telefono_des);
            //Vaciamos los mensajes al arreglo
            this.chats.push(data[key]);
          }
          nom = data[key].nombre_des;  
        }
        /*if(data[key].telefono_des == this.mi_tel){
          this.comid(data[key].id_usuario);
        }*/
      }
    });
  }

  /**
   * Metodo que navega a la ruta list-contact y le pasa 1 parametro
   */
  addContact(){
    this.router.navigate(['/list-contact', this.id]);
  }

  /**
   * Metodo que navega a la ruta chats y le pasa 2 parametros
   * @param tel telefono del destinatario
   * @param nombre Nombre del destinatario
   */
  linkChat(tel,nombre){
    this.router.navigate(['/chats', this.id, tel, nombre])
  }

}

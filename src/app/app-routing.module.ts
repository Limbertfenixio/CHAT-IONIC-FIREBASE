import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'list-contact/:id', loadChildren: './pages/list-contact/list-contact.module#ListContactPageModule' },
  { path: 'list-chats/:id/:tel', loadChildren: './pages/list-chats/list-chats.module#ListChatsPageModule' },
  { path: 'chats/:id/:tel/:nom', loadChildren: './pages/chats/chats.module#ChatsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

import { Login } from './features/auth/login/login';
import { DocumentsList } from './features/documents/documents-list/documents-list';
import { EditorPageComponent } from './features/editor/editor-page/editor-page';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'documents',
    component: DocumentsList,
    canActivate: [authGuard],
  },
  {
    path: 'editor/:id',
    component: EditorPageComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

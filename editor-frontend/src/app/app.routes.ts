import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { DocumentsListComponent } from './features/documents/documents-list/documents-list';
import { EditorPageComponent } from './features/editor/editor-page/editor-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'documents',
    component: DocumentsListComponent,
  },
  {
    path: 'editor/:id',
    component: EditorPageComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

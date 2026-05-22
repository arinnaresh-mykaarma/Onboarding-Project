import { Routes } from '@angular/router';
import { UserList } from './features/users/pages/user-list/user-list';
import { GetUser } from './features/users/pages/get-user/get-user';
import { CreateUser } from './features/users/pages/create-user/create-user';
import { UpdateUser } from './features/users/pages/update-user/update-user';
import { DeleteUser } from './features/users/pages/delete-user/delete-user';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserList },
  { path: 'users/get', component: GetUser },
  { path: 'users/create', component: CreateUser },
  { path: 'users/update', component: UpdateUser },
  { path: 'users/delete', component: DeleteUser },
  { path: '**', redirectTo: 'users' }
];

import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddChannelComponent } from './components/admin/add-channel/add-channel.component';
import { PrivateChatsComponent } from './components/private-chats/private-chats.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'addChannel',
    component: AddChannelComponent,
    canActivate: [authGuard]
  },
  {
    path: 'app-private-chats',
    component: PrivateChatsComponent,
    canActivate: [authGuard]
  }
];

import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from '@angular/fire/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddChannelComponent } from './components/admin/add-channel/add-channel.component';
import { ChatPageComponent } from './components/admin/chat-page/chat-page.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addChannel',
    component: AddChannelComponent,
  },
  {
    path: 'groupChat/:channelName',
    component: ChatPageComponent
  }
];

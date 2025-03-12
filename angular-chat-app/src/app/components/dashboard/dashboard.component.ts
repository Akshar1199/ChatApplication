import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ChannelService } from '../../services/channel.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  channels: any[] = [];
  userId: string | null = null;

  constructor(
    private channelService: ChannelService,
    private auth: Auth,
    private authServ: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadChannels();
      }
    });
  }

  loadChannels() {
    this.channelService.getChannels().subscribe((channels) => {
      this.channels = channels;
    });
  }

  joinChannel(channelId: string) {
    if (this.userId) {
      this.channelService.joinChannel(channelId, this.userId).then(() => {
        console.log('Joined channel successfully!');
      });
    }
  }

  logout() {
    this.authServ.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('userName');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      },
    });
  }
}

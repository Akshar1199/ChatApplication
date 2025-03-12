import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ChannelService } from '../../services/channel.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Message, MessageService } from '../../services/message.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {

  channels: any[] = [];
  userId: string | null = null;
  isAdmin: boolean = false;
  userName: string | null = '';

  selectedChannel: any = null;
  messages: any[] = [];
  messageText: string = '';

  constructor(
    private channelService: ChannelService,
    private auth: Auth,
    private authServ: AuthService,
    private router: Router,
    private msgServ: MessageService
  ) {}

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadChannels();
      }
    });

    this.userName = sessionStorage.getItem('userName');
    this.userName === 'admin'
      ? (this.isAdmin = true) : (this.isAdmin = false);
  }

  selectChannel(channel: any) {
    this.selectedChannel = channel;
    this.msgServ.getMessages(channel.id);
    this.msgServ.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (!this.messageText?.trim()) {
      console.error("Cannot send an empty message");
      return;
    }

    const message: Message = {
      senderId: this.userId!,
      text: this.messageText,
      timestamp: Timestamp.now(),
      type: 'text'
    };

    this.msgServ.sendMessage(this.selectedChannel.id, message).subscribe({
      next: () => {
        console.log('Message sent!');
        this.messageText = '';
      },
      error: (err) => console.error('Failed to send message:', err)
    });
  }

  onFileSelected(event: any) {
    // const file = event.target.files[0];
    // if (file) {
    //   this.msgServ.uploadFile(this.selectedChannel.id, this.userId, file);
    // }
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

  goToAddChannel(){
    this.router.navigate(['/addChannel']);
  }

  goToGroup(channelName: string){
    const formatName = channelName.replace(/\s+/g, '');
    this.router.navigate([`/groupChat/${formatName}`]);
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

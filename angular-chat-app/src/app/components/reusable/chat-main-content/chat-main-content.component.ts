import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../../services/channel.service';
import { MessageService, Message } from '../../../services/message.service';

@Component({
  selector: 'app-chat-main-content',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-main-content.component.html',
  styleUrl: './chat-main-content.component.css'
})
export class ChatMainContentComponent {

  @Input() selectedChannel: any;
  @Input() messages: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() isAdmin: boolean = false;
  userId: string | null = null;
  userName: string | null = null;
  isJoined: boolean = false;

  adminUids: string[] = [];
  messageText: string = '';

  constructor(
      private channelService: ChannelService,
      private msgServ: MessageService,
    ) {}

  ngOnInit(){
    this.userId = sessionStorage.getItem('userId');
    this.userName = sessionStorage.getItem('userName');
  }

  sendMessage() {
    if (!this.isAdmin) {
      console.error("Only Admin can send messages.");
      return;
    }

    if (!this.messageText?.trim()) {
      console.error("Cannot send an empty message");
      return;
    }

    const message: Message = {
      senderId: this.userId!,
      senderName: this.userName!,
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

  onKeyPress(event: any) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  joinChannel(channelId: string) {
    this.isLoading = true;
    if (this.userId) {
      this.channelService.joinChannel(channelId, this.userId).then(() => {
        this.isLoading = false;
        this.isJoined = true;
        alert('Joined channel successfully!');
      });
    }
  }

  leaveChannel(channelId: string) {
    const ok = confirm('Are you sure you want to leave this channel?');
    if (!ok) {
      return;
    }

    this.isLoading = true;
    if (this.userId) {
      this.channelService.leaveChannel(channelId, this.userId).then(() => {
        this.isLoading = false;
        this.isJoined = false;
        alert('Left channel successfully!');
      });
    }
  }

  selectChannel(channel: any) {
    this.selectedChannel = channel;
    const isJoined = this.selectedChannel.members.find((member: any) => member === this.userId);

    if(!isJoined){
      this.isJoined = false;
    }
    else{
      this.isJoined = true;
    }

    this.msgServ.getMessages(channel.id);
    this.msgServ.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  onFileSelected(event: any) {
    console.log('File selected:', event.target.files[0]);
  }

}

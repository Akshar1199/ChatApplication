import { Component, ViewChild } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatSidebarComponent } from '../reusable/chat-sidebar/chat-sidebar.component';
import { ChatMainContentComponent } from '../reusable/chat-main-content/chat-main-content.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ChatSidebarComponent, ChatMainContentComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {

  channels: any[] = [];
  isAdmin: boolean = false;
  isLoading: boolean = false;
  userName: string | null = '';
  selectedChannel: any = null;
  messages: any[] = [];

  constructor(
    private channelService: ChannelService,
  ) {}

  @ViewChild(ChatMainContentComponent) chatMainContent!: ChatMainContentComponent;

  ngOnInit() {

    this.loadChannels();
    this.userName = sessionStorage.getItem('userName');
    this.isAdmin = this.userName === 'admin';
  }

  loadChannels() {
    this.channelService.getChannels().subscribe((channels) => {
      this.channels = channels;
    });
  }

  selectChannel(channel: any) {
    this.selectedChannel = channel;
    this.chatMainContent.selectChannel(this.selectedChannel);
  }


}

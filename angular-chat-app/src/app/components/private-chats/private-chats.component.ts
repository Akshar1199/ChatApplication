import { Component, ViewChild } from '@angular/core';
import { ChatSidebarComponent } from '../reusable/chat-sidebar/chat-sidebar.component';
import { ChatMainContentComponent } from '../reusable/chat-main-content/chat-main-content.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-private-chats',
  imports: [CommonModule, FormsModule,ChatSidebarComponent, ChatMainContentComponent],
  templateUrl: './private-chats.component.html',
  styleUrl: './private-chats.component.css'
})
export class PrivateChatsComponent {

  users: any[] = [];
  messages: any[] = [];

  constructor(private authServ: AuthService){}

  @ViewChild(ChatMainContentComponent) chatMainContent!: ChatMainContentComponent;

  searchUsers(searchText: string) {

    if(searchText === '') {
      this.users = [];
      return;
    }

    const userName = sessionStorage.getItem('userName') || '';

    this.authServ.searchUsers(searchText, userName).subscribe({
      next: (users) => {
        // console.log(this.users);
        this.users = users;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  selectedUser(channel: any) {
    this.chatMainContent.selectChannel(channel);
  }

  onCloseChat() {
    this.chatMainContent.closeChat();
  }
}

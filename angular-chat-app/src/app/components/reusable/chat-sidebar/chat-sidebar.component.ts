import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../../services/request.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.css'
})
export class ChatSidebarComponent {
  @Input() items: any[] = [];
  @Input() isPrivateChat!: boolean;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() searchQuery = new EventEmitter<string>();

  searchText: string = '';
  userId: string | null = '';
  pendingRequests: string[] = [];
  friends: string[] = [];

  constructor(private reqServ: RequestService, private authServ: AuthService) {}

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');

    if (this.userId) {
      this.authServ.listenForUserData(this.userId);

      this.authServ.getUserData().subscribe(userData => {
        if (userData) {
          this.pendingRequests = userData.pendingRequests || [];
          this.friends = userData.friends || [];
        }
      });
    }
  }

  selectChannel(channel: any) {
    this.itemSelected.emit(channel);
  }

  onSearchChange() {
    this.searchQuery.emit(this.searchText);
  }

  sendFriendRequest(item: any) {
    this.reqServ.sendFriendRequest(this.userId || '', item.uid).subscribe({
      next: () => {
        alert("Request sent successfully!");
        this.pendingRequests.push(item.uid);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  cancelFriendRequest(item: any) {
    this.reqServ.cancelFriendRequest(this.userId || '', item.uid).subscribe({
      next: () => {
        this.pendingRequests = this.pendingRequests.filter(id => id !== item.uid);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  removeFriend(item: any) {
    this.reqServ.removeFriend(this.userId || '', item.uid).subscribe({
      next: () => {
        this.friends = this.friends.filter(id => id !== item.uid);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}

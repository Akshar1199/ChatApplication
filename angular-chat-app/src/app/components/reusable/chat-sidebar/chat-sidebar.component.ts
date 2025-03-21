import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../../services/request.service';
import { AuthService } from '../../../services/auth.service';
import { timestamp } from 'rxjs';

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
  pendingRequests: any[] = [];
  friends: any[] = [];
  friendList: any[] = [];

  constructor(private reqServ: RequestService, private authServ: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');

    if (this.userId) {
      this.authServ.listenForUserData(this.userId);
      this.fetchUserData();
    }
  }

  fetchUserData() {
    this.authServ.getUserData().subscribe(userData => {
      if (userData) {
        this.pendingRequests = userData.pendingRequests ? userData.pendingRequests.map((req: { id: string }) => req.id) : [];
        this.friendList = userData.friends;
        this.friends = userData.friends ? userData.friends.map((friend: { uid: string }) => friend.uid) : [];
      }
    });
  }

  ngDoCheck(){
    if(this.isPrivateChat && this.searchText === ''){
      this.items = this.friendList;
    }
  }

  // isFriend(userId: string): boolean {
  //   return this.friends.some(friend => friend.uid === userId);
  // }

  // isPending(userId: string): boolean {
  //   return this.pendingRequests.some(friend => friend.uid === userId);
  // }

  selectChannel(channel: any) {
    // console.log("selected chat", channel);
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
        // this.authServ.listenForUserData(this.userId!);
        // this.fetchUserData();
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
        alert("Friend removed successfully!");
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}

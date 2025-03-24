import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-requests',
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css',
})
export class RequestsComponent {

  userId: string | null = '';
  incomingRequests: any[] = [];

  constructor(private authServ: AuthService, private reqServ: RequestService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');

    if (this.userId) {
      this.authServ.listenForUserData(this.userId);

      this.authServ.getUserData().subscribe((userData) => {
        if (userData) {
          const senderIds =
            userData.incomingRequests?.map((req: any) => req.id) || [];
          if (senderIds.length > 0) {
            this.fetchIncomingRequestUsers(senderIds);
          }
        }
      });
    }
  }

  fetchIncomingRequestUsers(senderIds: string[]) {
    const requests = senderIds.map((id) => this.authServ.getUserById(id));

    combineLatest(requests).subscribe((users) => {
      this.incomingRequests = users;
    });
  }

  acceptRequest(request: any){
    // console.log(request);
    this.reqServ.acceptRequest(this.userId || '', request.id).subscribe({
      next: () => {
        this.incomingRequests = this.incomingRequests.filter((r) => r.id !== request.id);
        console.log(this.incomingRequests);
        this.cdr.detectChanges();
        alert('Request accepted successfully!');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  rejectRequest(request: any) {
    console.log(request);
    this.reqServ.cancelFriendRequest(request.id, this.userId || '').subscribe({
      next: () => {
        this.incomingRequests = this.incomingRequests.filter((r) => r.id !== request.id);
        this.cdr.detectChanges();
        alert('Request rejected successfully!');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}

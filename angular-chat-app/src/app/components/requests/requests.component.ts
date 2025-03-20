import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-requests',
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})

export class RequestsComponent {

  userId: string | null = '';
  incomingRequests: any[] = [];

  constructor(private authServ: AuthService, private reqServ: RequestService) {}

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');

    if (this.userId) {
      this.authServ.listenForUserData(this.userId);

      this.authServ.getUserData().subscribe(userData => {
        if (userData) {
          const senderIds = userData.incomingRequests?.map((req: any) => req.id) || [];

          if (senderIds.length > 0) {
            this.fetchIncomingRequestUsers(senderIds);
          }
        }
      });
    }
  }

  fetchIncomingRequestUsers(senderIds: string[]) {
    const requests: Observable<any>[] = senderIds.map(id => this.authServ.getUserById(id));

    forkJoin(requests).subscribe(users => {
      this.incomingRequests = users;
    });
  }


  rejectRequest(request: any) {
    this.reqServ.cancelFriendRequest(request.id, this.userId || '').subscribe({
      next: () => {
        alert("Request rejected successfully!");
        // this.incomingRequests = this.incomingRequests.filter((r) => r.id !== request.id);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}

import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, arrayUnion, addDoc, arrayRemove } from '@angular/fire/firestore';
import { from, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private firestore: Firestore, private authServ: AuthService) {}

  addChannel(name: string, description: string): Observable<any> {
    return this.authServ.getAdminID().pipe(
      switchMap((adminUIDs) => {
        const channelsRef = collection(this.firestore, 'channels');
        return from(addDoc(channelsRef, {
          name,
          description,
          members: adminUIDs
        }));
      })
    );
  }

  getChannels(): Observable<any[]> {
    const channelsRef = collection(this.firestore, 'channels');
    return collectionData(channelsRef, { idField: 'id' });
  }

  joinChannel(channelId: string, userId: string): Promise<void> {
    const channelRef = doc(this.firestore, `channels/${channelId}`);
    return updateDoc(channelRef, {
      members: arrayUnion(userId)
    });
  }

  leaveChannel(channelId: string, userId: string): Promise<void> {
    const channelRef = doc(this.firestore, `channels/${channelId}`);
    return updateDoc(channelRef, {
      members: arrayRemove(userId)
    });
  }

}

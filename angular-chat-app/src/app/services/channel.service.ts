import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, arrayUnion, addDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  constructor(private firestore: Firestore) {}

  addChannel(name: string, description: string, adminUid: string): Observable<any> {
    const channelsRef = collection(this.firestore, 'channels');
    return from(addDoc(channelsRef, { name, description, members: [adminUid] }));
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
}

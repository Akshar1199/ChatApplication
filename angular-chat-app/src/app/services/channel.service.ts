import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  constructor(private firestore: Firestore) {}

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

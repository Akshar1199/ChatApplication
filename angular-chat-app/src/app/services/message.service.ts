import { Injectable } from '@angular/core';
import { Firestore, arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';

export interface Message {
  senderId: string;
  text?: string;
  timestamp: any;
  type: 'text' | 'image' | 'file';
  mediaUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(private firestore: Firestore) {}

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  sendMessage(channelId: string, message: Message): Observable<void> {
    try {
      const messagesDocRef = doc(this.firestore, `channels/${channelId}/messages/messagesDoc`);

      return from(
        getDoc(messagesDocRef).then((docSnap) => {

          if (docSnap.exists()) {
            return updateDoc(messagesDocRef, {
              messages: arrayUnion({ ...message, timestamp: new Date() })
            });
          }
          else {
            return setDoc(messagesDocRef, {
              messages: [{ ...message, timestamp: new Date() }]
            });
          }
        })
      );
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  getMessages(channelId: string): void {
    const messagesDocRef = doc(this.firestore, `channels/${channelId}/messages/messagesDoc`);

    onSnapshot(messagesDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const messages = docSnap.data()['messages'] as Message[];
        this.messagesSubject.next(messages);
      } else {
        this.messagesSubject.next([]);
      }
    });
  }


}

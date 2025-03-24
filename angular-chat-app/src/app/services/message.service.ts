import { Injectable } from '@angular/core';
import { Firestore, arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

export interface Message {
  senderId: string;
  senderName: string;
  text?: string;
  // timestamp: any;
  type: 'text' | 'image' | 'file';
  mediaUrl?: string;
  fileName?: string;
  fileType?: string;
}

@Injectable({
  providedIn: 'root',
})

export class MessageService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

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

  sendMessageToFriend(userId: string, friendId: string, message: Message): Observable<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${userId}`);
      const friendDocRef = doc(this.firestore, `users/${friendId}`);

      return from(
        Promise.all([getDoc(userDocRef), getDoc(friendDocRef)]).then(([userSnap, friendSnap]) => {
          if (userSnap.exists() && friendSnap.exists()) {
            const userData = userSnap.data();
            const friendData = friendSnap.data();

            const userFriends = userData['friends'] || [];
            const friendFriends = friendData['friends'] || [];

            const userFriendIndex = userFriends.findIndex((f: any) => f.uid === friendId);
            if (userFriendIndex !== -1) {
              userFriends[userFriendIndex].messages = userFriends[userFriendIndex].messages || [];
              userFriends[userFriendIndex].messages.push({ ...message, timestamp: new Date() });
            } else {
              console.error("Friend not found in sender's friends list.");
              throw new Error("Friend not found.");
            }

            const friendFriendIndex = friendFriends.findIndex((f: any) => f.uid === userId);
            if (friendFriendIndex !== -1) {
              friendFriends[friendFriendIndex].messages = friendFriends[friendFriendIndex].messages || [];
              friendFriends[friendFriendIndex].messages.push({ ...message, timestamp: new Date() });
            } else {
              console.error("Sender not found in recipient's friends list.");
              throw new Error("Sender not found.");
            }

            return Promise.all([
              updateDoc(userDocRef, { friends: userFriends }),
              updateDoc(friendDocRef, { friends: friendFriends })
            ]).then(() => {});
          } else {
            console.error("One or both user documents do not exist.");
            throw new Error("Users not found.");
          }
        })
      );
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  getMessagesOfFriend(userId: string, friendId: string): void {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const friend = userData?.['friends']?.find((f: any) => f.uid === friendId);
        if (friend) {
          this.messagesSubject.next(friend.messages || []);
        } else {
          this.messagesSubject.next([]);
        }
      } else {
        this.messagesSubject.next([]);
      }
    });
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

  async uploadFile(file: File, userId: string): Promise<string> {
    const filePath = `chat-files/${userId}/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async sendFileMessage(userId: string, friendId: string, file: File): Promise<void> {
    try {
      const downloadUrl = await this.uploadFile(file, userId);

      const message: Message = {
        senderId: userId,
        senderName: sessionStorage.getItem('userName') || '',
        // timestamp: new Date(),
        type: this.getFileType(file.type),
        mediaUrl: downloadUrl,
        fileName: file.name,
        fileType: file.type
      };

      return this.sendMessageToFriend(userId, friendId, message).toPromise();
    } catch (error) {
      console.error('Error sending file message:', error);
      throw error;
    }
  }

  private getFileType(mimeType: string): 'text' | 'image' | 'file' {
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType === 'application/pdf' || mimeType === 'text/plain') {
      return 'text';
    } else {
      return 'file';
    }
  }

}

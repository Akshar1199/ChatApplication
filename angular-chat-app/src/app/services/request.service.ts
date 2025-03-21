import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private firestore: Firestore) {}

  sendFriendRequest(
    senderId: string | null,
    targetId: string | null
  ): Observable<void> {
    if (!senderId || !targetId) {
      console.error('Invalid senderId or targetId:', { senderId, targetId });
      return from(Promise.reject('Invalid senderId or targetId.'));
    }

    const senderDocRef = doc(this.firestore, `users/${senderId}`);
    const targetDocRef = doc(this.firestore, `users/${targetId}`);

    const senderUpdate = updateDoc(senderDocRef, {
      pendingRequests: arrayUnion({ id: targetId, timestamp: new Date() }),
    });

    const targetUpdate = updateDoc(targetDocRef, {
      incomingRequests: arrayUnion({ id: senderId, timestamp: new Date() }),
    });

    return from(Promise.all([senderUpdate, targetUpdate]).then(() => {}));
  }

  cancelFriendRequest(
    senderId: string | null,
    targetId: string | null
  ): Observable<void> {
    if (!senderId || !targetId) {
      console.error('Invalid senderId or targetId:', { senderId, targetId });
      return from(Promise.reject('Invalid senderId or targetId.'));
    }

    const senderDocRef = doc(this.firestore, `users/${senderId}`);
    const targetDocRef = doc(this.firestore, `users/${targetId}`);

    return from(
      Promise.all([getDoc(senderDocRef), getDoc(targetDocRef)]).then(
        ([senderSnap, targetSnap]) => {
          if (!senderSnap.exists() || !targetSnap.exists()) {
            throw new Error('User not found');
          }

          const senderData = senderSnap.data();
          const targetData = targetSnap.data();

          const pendingRequestToRemove = senderData?.['pendingRequests']?.find(
            (req: any) => req.id === targetId
          );

          const incomingRequestToRemove = targetData?.[
            'incomingRequests'
          ]?.find((req: any) => req.id === senderId);

          if (!pendingRequestToRemove || !incomingRequestToRemove) {
            throw new Error('Request not found in lists');
          }

          return Promise.all([
            updateDoc(senderDocRef, {
              pendingRequests: arrayRemove(pendingRequestToRemove),
            }),
            updateDoc(targetDocRef, {
              incomingRequests: arrayRemove(incomingRequestToRemove),
            }),
          ]).then(() => {});
        }
      )
    );
  }

  acceptRequest(
    userId: string | null,
    senderId: string | null
  ): Observable<void> {
    if (!userId || !senderId) {
      console.error('Invalid userId or senderId:', { userId, senderId });
      return from(Promise.reject('Invalid userId or senderId.'));
    }

    const userDocRef = doc(this.firestore, `users/${userId}`);
    const senderDocRef = doc(this.firestore, `users/${senderId}`);

    return from(
      Promise.all([getDoc(userDocRef), getDoc(senderDocRef)]).then(
        ([userSnap, senderSnap]) => {
          if (!userSnap.exists() || !senderSnap.exists()) {
            throw new Error('User not found');
          }

          const userData = userSnap.data();
          const senderData = senderSnap.data();

          // Find the request objects to remove
          const incomingRequestToRemove = userData?.['incomingRequests']?.find(
            (req: any) => req.id === senderId
          );

          const pendingRequestToRemove = senderData?.['pendingRequests']?.find(
            (req: any) => req.id === userId
          );

          if (!incomingRequestToRemove || !pendingRequestToRemove) {
            throw new Error('Request not found in lists');
          }

          return Promise.all([
            updateDoc(userDocRef, {
              incomingRequests: arrayRemove(incomingRequestToRemove),
              friends: arrayUnion({
                uid: senderId,
                userName: senderData?.['userName'] || 'Unknown',
              }),
            }),
            updateDoc(senderDocRef, {
              pendingRequests: arrayRemove(pendingRequestToRemove),
              friends: arrayUnion({
                uid: userId,
                userName: userData?.['userName'] || 'Unknown',
              }),
            }),
          ]).then(() => {});
        }
      )
    );
  }

  removeFriend(userId: string | null, friendId: string | null): Observable<void> {
    if (!userId || !friendId) {
      console.error('Invalid userId or friendId:', { userId, friendId });
      return from(Promise.reject('Invalid userId or friendId.'));
    }

    const userDocRef = doc(this.firestore, `users/${userId}`);
    const friendDocRef = doc(this.firestore, `users/${friendId}`);

    return from(
      Promise.all([getDoc(userDocRef), getDoc(friendDocRef)]).then(
        ([userSnap, friendSnap]) => {
          if (!userSnap.exists() || !friendSnap.exists()) {
            throw new Error('User not found');
          }

          const userData = userSnap.data();
          const friendData = friendSnap.data();

          const userFriendToRemove = userData?.['friends']?.find(
            (friend: any) => friend.uid === friendId
          );

          const friendUserToRemove = friendData?.['friends']?.find(
            (friend: any) => friend.uid === userId
          );

          if (!userFriendToRemove || !friendUserToRemove) {
            throw new Error('Friendship not found in lists');
          }

          return Promise.all([
            updateDoc(userDocRef, {
              friends: arrayRemove(userFriendToRemove),
            }),
            updateDoc(friendDocRef, {
              friends: arrayRemove(friendUserToRemove),
            }),
          ]).then(() => {});
        }
      )
    );
  }

}

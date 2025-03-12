import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import {Firestore,  doc, getDoc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) {}

  register(email: string, password: string, userName: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async (userCredential) => {
        const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        await setDoc(userRef, { userName, email, uid: userCredential.user.uid });
        return userCredential;
      })
    );
  }

  // login(email: string, password: string): Observable<UserCredential> {
  //   return from(signInWithEmailAndPassword(this.auth, email, password));
  // }

  login(email: string, password: string): Observable<{userCredential: UserCredential, userName: string}> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(async (userCredential) => {
        const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          return { userCredential, userName: userData['userName'] };
        } else {
          throw new Error('User data not found');
        }
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}

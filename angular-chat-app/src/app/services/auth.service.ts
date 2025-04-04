import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import {Firestore,  doc, getDoc, setDoc, collection, getDocs, onSnapshot, docData } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private userData$ = new BehaviorSubject<any>(null);

  constructor(private auth: Auth, private firestore: Firestore) {}

  listenForUserData(userId: string) {
    if (!userId) return;

    const userDocRef = doc(this.firestore, `users/${userId}`);

    onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        this.userData$.next(docSnapshot.data());
      }
    });
  }

  getUserData() {
    return this.userData$.asObservable();
  }

  getUserById(userId: string): Observable<any> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return docData(userDocRef, { idField: 'id' });
  }

  register(email: string, password: string, userName: string, imageUrl: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async (userCredential) => {
        const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        await setDoc(userRef, { userName, email, uid: userCredential.user.uid, imageUrl });
        return userCredential;
      })
    );
  }

  // login(email: string, password: string): Observable<UserCredential> {
  //   return from(signInWithEmailAndPassword(this.auth, email, password));
  // }

  getAdminID(): Observable<string[]> {
    const adminsCollection = collection(this.firestore, 'admins');

    return from(
      getDocs(adminsCollection).then((querySnapshot) => {
        const adminUIDs: string[] = [];
        querySnapshot.forEach((doc) => {
          adminUIDs.push(doc.data()['uid']);
        });
        return adminUIDs;
      })
    );
  }

  login(email: string, password: string): Observable<{ userCredential: UserCredential; userName: string }> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(async (userCredential) => {

        const uid = userCredential.user.uid;
        console.log(uid);

        const adminRef = doc(this.firestore, `admins/${uid}`);
        console.log(adminRef);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          const adminData = adminSnap.data();
          return { userCredential, userName: adminData['userName'] };
        }

        const userRef = doc(this.firestore, `users/${uid}`);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

          const userData = userSnap.data();
          return { userCredential, userName: userData['userName'] };
        }
        else {

          console.log("users:",userCredential);
          if(userCredential.user.email !== email){
            console.log("User not found")
            throw new Error('User data not found');
          }
          else{
            console.log("User not found")
            throw new Error('Invalid Password');
          }
        }
      })
    );
  }

  searchUsers(searchText: string, userName: string): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'users');
    return from(
      getDocs(usersCollection).then((querySnapshot) => {
        const users: any[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData['userName'] === userName) {
            return;
          }
          if (userData['userName'].includes(searchText)) {
            users.push(userData);
          }
        });
        return users;
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}

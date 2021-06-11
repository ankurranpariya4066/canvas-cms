import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(public db: AngularFireDatabase, public store: AngularFirestore) { }

  /** Store Canvas To DB */
  public storeCanvas(userId: string, canvasString: string, email: string) {
	const itemRef = this.db.object('item');
  	itemRef.set({
  		id: this.store.createId(),
  		canvas: canvasString,
  		email: email,
  		userId: userId
  	});
  }

  /** Get Login User Canvase */
  public getCanvas(userId: string): Observable<any> {
     return this.db.object('item').valueChanges()
  }

  /** Share Canvas To External User*/
  public shareCanvas(canvasId: string, recipentId: string) {

  } 

  /** Retrive to login user shared canvas */
  public getSharedCanvas(userId:string) {

  }
}

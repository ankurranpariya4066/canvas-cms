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
	  const itemRef = this.db.object('usersCanvas/'+userId);
  	itemRef.set({
  		id: this.store.createId(),
  		canvas: canvasString,
  		email: email,
  		userId: userId
  	});
  }

  /** Get Login User Canvase */
  public getCanvas(userId: string): Observable<any> {
     return this.db.object('usersCanvas/'+userId).valueChanges()
  }

  /** Share Canvas To External User*/
  public async shareCanvas(canvasId: string, recipentEmailId: string) {
    const dataInerted = false;
    const configured_id = recipentEmailId.split('.').join("")
    const ref = await this.db.object('sharedCanvas/'+configured_id)
    ref.valueChanges().subscribe((data:any) => {
      if(dataInerted) return;

      let _data = data;
      if(!data || !data.length) {
        _data = [{canvasId: canvasId}]
      } else {
        const canvasAlreadyExists:boolean = _data.find((e)=>{
          return e.canvasId === canvasId
        })
        if(!canvasAlreadyExists)
          _data.push({canvasId: canvasId})
      }
      ref.set(_data)
    });
  } 

  /** Retrive to login user shared canvas */
  public getSharedCanvas(emailId:string): Observable<any> {
    const configured_id = emailId.split('.').join("")
    return this.db.object('sharedCanvas/'+configured_id).valueChanges()
  }
}

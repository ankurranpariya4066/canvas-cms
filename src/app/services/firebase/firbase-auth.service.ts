import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class FirbaseAuthService {

  	userData: any; // Save logged in user data

  	constructor(private authFire: AngularFireAuth, private router: Router) {}

	/* Returns true when user is looged in and email is verified */ 
	get isLoggedIn(): boolean {
		let user = JSON.parse(localStorage.getItem('user'));	     	
		return (user !== null && user.emailVerified !== false) ? true : false;
	}

	/* Sign in with Google */
	GoogleAuth() {
		return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
	} 

	/*  Auth logic to run auth providers */
	AuthLogin(provider) {
		return this.authFire.signInWithPopup(provider)
		.then((result) => {

			/* Saving user data in localstorage when logged in and setting up null when logged out */
				this.userData = result.user;
				localStorage.setItem('user', JSON.stringify(this.userData));
				JSON.parse(localStorage.getItem('user'));

			this.router.navigate(['dashboard']);
		}).catch((error) => {
			console.log(error)
		})

	}

	/** Singout */
	SignOut() {
		return this.authFire.signOut().then(() => {
			localStorage.removeItem('user');
			this.router.navigate(['/login']);
		})
	}

}

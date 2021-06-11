import { Component, OnInit } from '@angular/core';
import { FirbaseAuthService } from "../../services/firebase/firbase-auth.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: FirbaseAuthService, public router: Router) { }

  ngOnInit(): void {
  	if (this.authService.isLoggedIn == true){
  		this.router.navigate(['/dashboard'])
  	}
  }

}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirbaseAuthService } from "../firebase/firbase-auth.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

 constructor(
    public authService: FirbaseAuthService,
    public router: Router
  ){ }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  	
  	if(this.authService.isLoggedIn !== true) {
      this.router.navigate(['/login'])
    }
    return true;
  }
  
}

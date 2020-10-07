import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(): Observable<boolean>|Promise<boolean>|boolean  {
    return this.authService.isAuthenticated().then(userAuthenticated =>{
      if(userAuthenticated)
        return true;
      else{
        this.authService.login();
        return false;
      }
    });
  }
}

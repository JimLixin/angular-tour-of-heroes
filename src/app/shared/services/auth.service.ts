import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userManager: UserManager;
  private _user: User;
  private _loginChangedSubject = new Subject<boolean>();

  public loginChanged = this._loginChangedSubject.asObservable();

  private get idpSettings() : UserManagerSettings {
    return {
      authority: Constants.idpAuthority,
      client_id: Constants.clientId,
      redirect_uri: `${Constants.clientRoot}/signin-oidc`,
      scope: "openid profile",
      response_type: "id_token token",
      post_logout_redirect_uri: `${Constants.clientRoot}/signout-oidc`,
      filterProtocolClaims: true,
      loadUserInfo: true
    }
  }

  constructor() { 
    this._userManager = new UserManager(this.idpSettings);
  }

  public login = () => {
    return this._userManager.signinRedirect();
  }

  public isAuthenticated = (): Promise<boolean> => {
    return this._userManager.getUser()
    .then(user => {
      if(this._user !== user){
        this._loginChangedSubject.next(this.checkUser(user));
      }
      this._user = user;
        
      return this.checkUser(user);
      })
  }

  public finishLogin = (): Promise<User> => {
    return this._userManager.signinRedirectCallback(window.location.href)
    .then(user => {
      this._user = user;
      this._loginChangedSubject.next(this.checkUser(user));
      return user;
    })
  }
  
  private checkUser = (user : User): boolean => {
    return !!user && !user.expired;
  }
}
import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  public isLoggedIn: boolean = false;
  constructor(private heroService: HeroService, private _authService: AuthService) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.getHeroes();
  }

  getHeroes(): void{
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes.slice(1,5));
  };

  checkLoginStatus(): void{
    this._authService.isAuthenticated()
    .then(userAuthenticated => {
      this.isLoggedIn = userAuthenticated;
    })
  }

  public login = () => {
    this._authService.login();
  }

  public logout = () => {
    this._authService.logout();
  }

}

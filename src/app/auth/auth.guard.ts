
// guards can define methods which angular runs before it loads a route
// guards added to app.routing.module

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

// to check wheather it should proceed or do something else
@Injectable() // to inject services into services
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // return true to allow access to route
    // else false, redirect to some other page
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}

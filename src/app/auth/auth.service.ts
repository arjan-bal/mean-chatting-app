import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string;
  private authStatusListner = new Subject<boolean>();
  private isAuth: boolean = false;
  private tokenTimeout: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuth;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  async createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    const response = await this.http.post('http://localhost:3000/api/user/signup', authData).toPromise();
    this.router.navigate(['/login']);
  }

  async login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    const response = await this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData).toPromise();
    this.token = response.token;
    if (this.token) {
      this.isAuth = true;
      this.authStatusListner.next(true);
      this.setAuthTimer(response.expiresIn);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
      this.saveAuthData(this.token, expirationDate);
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimeout);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimeout = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // called in app.component.ts
  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return ;
    }
    // check if token is expired
    const now = new Date();
    const difference = authData.expirationDate.getTime() - now.getTime();
    if (difference <= 0) {
      return ;
    }
    this.token = authData.token;
    this.isAuth = true;
    this.authStatusListner.next(true);
    this.setAuthTimer(difference / 1000);
    this.router.navigate(['/']);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return ;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
}

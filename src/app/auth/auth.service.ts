import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/user`;

@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string;
  private authStatusListner = new Subject<boolean>();
  private isAuth: boolean = false;
  private tokenTimeout: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuth;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  async createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    try {
      const response = await this.http.post(`${BACKEND_URL}/signup`, authData).toPromise();
    } catch (err) {
      console.log(err);
      // emmiting false to disable spinner in signup component
      this.authStatusListner.next(false);
      return ;
    }
    this.router.navigate(['/login']);
  }

  async login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    let response;
    try {
      response = await this.http.post<{token: string, userId: string, expiresIn: number}>(`${BACKEND_URL}/login`, authData).toPromise();
    } catch(err) {
      // emmiting false to disable spinner in login component
      this.authStatusListner.next(false);
      return ;
    }
    this.token = response.token;
    if (this.token) {
      this.isAuth = true;
      this.userId = response.userId;
      this.authStatusListner.next(true);
      this.setAuthTimer(response.expiresIn);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
      this.saveAuthData(this.token, expirationDate, this.userId);
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.userId = null;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimeout);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('uesrId');
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
    this.userId = authData.userId;
    this.authStatusListner.next(true);
    this.setAuthTimer(difference / 1000);
    this.router.navigate(['/']);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return ;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}

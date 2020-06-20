import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  async createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    const response = await this.http.post('http://localhost:3000/api/user/signup', authData).toPromise();
    console.log(response);
  }

  async login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    const response = await this.http.post<{token: string}>('http://localhost:3000/api/user/login', authData).toPromise();
    console.log(response);
    this.token = response.token;
  }
}

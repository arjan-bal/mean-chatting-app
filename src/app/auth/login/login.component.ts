import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  isLoading: boolean = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  // for error handling, to hide spinner on failure
  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe(
      authStatus => {
        // false is emmited from authservice on failure
        if (!authStatus ) {
          this.isLoading = false;
        }
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return ;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}

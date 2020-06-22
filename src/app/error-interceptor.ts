import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ErrorComponent } from './error/error.component';

// added to providers in app.module
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // handle allows us to hook into response stream
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        // need to return an obeservable
        // returns a new observable to which we can pass error
        // alert(error.error.message);
        let errorMessage = 'An unknown error';
        if(error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {
          data: {
            message: errorMessage
          }
        });
        return throwError(error);
      })
    );
  }
}

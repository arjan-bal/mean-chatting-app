import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// added to providers in app.module
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // handle allows us to hook into response stream
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        // need to return an obeservable
        // returns a new observable to which we can pass error
        alert(error.error.message);
        return throwError(error);
      })
    );
  }
}

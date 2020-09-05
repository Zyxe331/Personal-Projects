import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import {
  Router
} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserProviderService } from '../services/user-provider.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private router: Router,
    public toastController: ToastController, private storage: Storage, private userServices: UserProviderService) { }

  /**
   * Interceptor used in order to add the access token and other headers to all
   * request. Also redirects to login page whenever an unauthorized error occurs
   *
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof TokenInterceptorService
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Get the access token in storage
    return from(this.storage.get('ACCESS_TOKEN'))
      .pipe(switchMap(token => {

        // If the token exists then add the authorization header
        if (token) {
          request = request.clone({
            setHeaders: {
              'Authorization': token
            }
          });
        }

        // If content type hasn't been added to the header then add it
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            setHeaders: {
              'content-type': 'application/json'
            }
          });
        }

        // Set the type as json
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json')
        });

        return next.handle(request).pipe(

          // If the request succeeds log the event
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              //console.log('event--->>>', event);
            }
            return event;
          }),

          // If the request returns 401 navigate to login page
          catchError((error: HttpErrorResponse) => {
            console.log(error)
            if (error.status === 401) {
              this.router.navigate(['login']);
            }
            return throwError(error);
          }));
      }))
  }
}

import { Injectable, Injector } from '@angular/core';
import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private injector: Injector) { }

  intercept(req, next) {
    let logser = this.injector.get(LoginService);
    if (localStorage.getItem('token')) {
      req = req.clone({
        setHeaders: {
          Authorization: localStorage.getItem('token')
        }
      })
    }
    return next.handle(req);
  }
}

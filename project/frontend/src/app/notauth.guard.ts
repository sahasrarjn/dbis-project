import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class NotauthGuard implements CanActivate {

  constructor(private _login: LoginService, private _router: Router) { }

  canActivate(): boolean {
    if (this._login.studentloggedIn() || this._login.teacherloggedIn()) {
      this._router.navigate(['']);
      return false;
    }
    else {
      return true;
    }
  }

}

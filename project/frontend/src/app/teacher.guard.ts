import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {
  constructor(private _login: LoginService, private _router: Router) { }

  canActivate(): boolean {
    if (this._login.teacherloggedIn()) {
      return true;
    }
    else {
      this._router.navigate(['/login']);
      return false;
    }
  }

}

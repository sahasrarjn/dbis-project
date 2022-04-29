import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AttemptedGuardGuard implements CanActivate {
  id;
  return_val = false;
  constructor(private _login: LoginService, private _router: Router, private http: HttpClient,
    private route: ActivatedRoute) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.id = parseInt(state.url.split('/')[2]);
    var user_id = parseInt(localStorage.getItem("user_id"));
    var return_val = false;
    if (this._login.studentloggedIn() || this._login.teacherloggedIn()) {
      let data_var;
       let x = await this.http.get("http://localhost:8081/get_attempted_questions/?sid=" + user_id);
       data_var = await firstValueFrom(x);

       console.log(data_var);

        for(var i = 0; i < (data_var as any).length; i++){
          if(data_var[i].question_id == this.id){
            return true;
          }
        }
        return false;
    }
    else {
      return false;
    }
  }
  
}

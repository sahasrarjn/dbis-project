import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './login/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  studentpostUrl = 'http://127.0.0.1:8081/auth/login/student';
  teacherpostUrl = 'http://127.0.0.1:8081/auth/login/teacher';

  constructor(private http: HttpClient, private _router: Router) { }

  httpOtions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  trylogin(user: User): Observable<any> {
    return this.http.post(this.studentpostUrl, user, this.httpOtions);
  }

  tryteacherlogin(user: User): Observable<any> {
    return this.http.post(this.teacherpostUrl, user, this.httpOtions);
  }

  studentloggedIn() {
    return (!!localStorage.getItem('token') && localStorage.getItem('type') == 'student');
  }

  teacherloggedIn() {
    return (!!localStorage.getItem('token') && localStorage.getItem('type') == 'teacher');
  }

  loggedIn() {
    return this.studentloggedIn() || this.teacherloggedIn();
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('type');
    this._router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getType() {
    return localStorage.getItem('type');
  }

}

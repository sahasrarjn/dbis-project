import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewTeacherUser, NewUser } from './register/newuser';

@Injectable({
  providedIn: 'root'
})
export class RegService {

  poststudentUrl = 'http://127.0.0.1:8081/auth/register/student';
  postteacherUrl = 'http://127.0.0.1:8081/auth/register/teacher';
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  tryreg(user: NewUser): Observable<any> {
    return this.http.post(this.poststudentUrl, user, this.httpOptions);
  }

  tryregteacher(user: NewTeacherUser): Observable<any> {
    return this.http.post(this.postteacherUrl, user, this.httpOptions);
  }
}

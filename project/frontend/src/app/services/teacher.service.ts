import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  baseurl = 'http://localhost:8081/';

  constructor(private http:HttpClient) { }

  getTeacherById(tid:any){
    return this.http.get(this.baseurl + 'get_teacher?tid=' + tid);
  }

  getAllTeachers(){
    return this.http.get(this.baseurl + 'get_all_teachers');
  }
}

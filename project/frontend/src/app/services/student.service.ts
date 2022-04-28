import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  baseurl = 'http://localhost:8081/';

  constructor(private http : HttpClient) { }

  getStudentbyId(sid:any){
    return this.http.get(this.baseurl + 'get_student?sid=' + sid);
  }

  getReportCard(sid:any, eid:any){
    return this.http.get(this.baseurl + 'get_report_card?sid=' + sid + '&eid=' + eid);
  }

  getAttemptedExams(sid:any){
    return this.http.get(this.baseurl + 'get_attempted_exams?sid=' + sid);
  }

  getAttemptedQues(sid:any){
    return this.http.get(this.baseurl + 'get_attempted_questions?sid=' + sid);
  }

}

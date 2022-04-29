import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  baseurl = 'http://localhost:8081/';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getExamTypes() {
    return this.http.get(this.baseurl + 'exam_types');
  }

  getAllExams() {
    return this.http.get(this.baseurl + 'get_all_exams');
  }

  getExamData(exam_id: any) {
    return this.http.get(this.baseurl + 'get_exam_data?exam_id=' + exam_id);
  }

  createRandomExam(exam_name: any, exam_type: any, min_diff: any, max_diff: any, tags: any, author: any) {
    var JSONdata = {
      'exam_name': exam_name,   // string
      'exam_type': exam_type,   // int
      'min_diff': min_diff,     // int
      'max_diff': max_diff,     // int
      'tags': tags,             // list of int (or string?? todo)
      'author': author          // string 
    }

    return this.http.post(this.baseurl + 'create_random_exam', JSONdata, this.httpOptions);
  }

  createManualExam(exam_name: any, exam_type: any, qid: any, author: any) {
    var JSONdata = {
      'exam_name': exam_name,   // string
      'exam_type': exam_type,   // int
      'qids': qid,               // list of int
      'author': author          // string
    }

    return this.http.post(this.baseurl + 'create_manual_exam', JSONdata, this.httpOptions);
  }

  submitExam(exam_id, user_id){
    var JSONdata = {
      'eid': exam_id,
      'sid': user_id,
    };

    return this.http.post(this.baseurl + 'attempt_exam', JSONdata, this.httpOptions);
  }

  getStartTime(exam_id, user_id){
      return this.http.get(this.baseurl + 'get_start_time?eid=' + exam_id + '&sid=' + user_id);
  }

  startExam(exam_id, user_id){
    var JSONdata = {
      'eid': exam_id, 
      'sid': user_id,
      'stime': new Date().toISOString().slice(0, 19).replace("T", " ")
    };

    return this.http.post(this.baseurl + 'start_exam',JSONdata , this.httpOptions);
  }
}

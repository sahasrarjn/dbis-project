import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  baseurl = 'http://localhost8081/';

  constructor(private http : HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getQuestions(){
    return this.http.get(this.baseurl + 'questions');
  }

  getQuestionData(id : any){
    console.log("Getting question data for qid: ", id);
    return this.http.get(this.baseurl + 'question_data?qid=' + id);
  }
}

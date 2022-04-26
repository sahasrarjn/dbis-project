import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  baseurl = 'http://localhost:8081/';

  constructor(private http : HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getTags(){
    return this.http.get(this.baseurl + 'tags_list');
  }

  getQuestions(){
    // TODO: Update for `var { diff_lower, diff_upper, author_id, tags } = req.query;`
    return this.http.get(this.baseurl + 'questions');
  }

  getQuestionData(id : any){
    console.log(this.baseurl + 'question_data?qid=' + id);
    return this.http.get(this.baseurl + 'question_data?qid=' + id);
  }

  
}

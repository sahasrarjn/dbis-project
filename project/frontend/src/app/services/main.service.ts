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

  getQuestions(diff_lower:any, diff_upper:any, tags:any, author_id:any){
    // TODO: Update for `var { diff_lower, diff_upper, author_id, tags } = req.query;`
    var url = this.baseurl + 'questions?diff_lower=' + diff_lower + '&diff_upper=' + diff_upper + '&author_id=' + author_id;
    for (var i = 0; i < tags.length; i++) {
      url += '&tags=' + tags[i];
    }
    // console.log(url);
    return this.http.get(url);
  }

  getQuestionData(id : any){
    // console.log(this.baseurl + 'question_data?qid=' + id);
    return this.http.get(this.baseurl + 'question_data?qid=' + id);
  }

  addQuestion(qtext:any, diff:any, ans:any, tc:any, auth:any, tags:any){
    var JSONdata = {
      "qtext": qtext,
      "diff": diff,
      "ans": ans,
      "tc": tc,
      "auth": auth,
      "tags": tags
    }
    console.log(JSONdata);
    return this.http.post(this.baseurl + 'dd_question', JSON.stringify(JSONdata), this.httpOptions);
  }

  
}

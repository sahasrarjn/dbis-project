import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstituteService {
  baseurl = 'http://localhost:8081/';

  constructor(private http:HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getAllInstitutes(){
    return this.http.get(this.baseurl + 'get_all_insti');
  }

  getInsituteById(id){
    return this.http.get(this.baseurl + 'get_insti?iid=' + id);
  }
}

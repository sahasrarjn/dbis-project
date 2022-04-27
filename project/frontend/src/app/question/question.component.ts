import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  questions : any;
  selectedQuestion : string = "";

  constructor(private route : ActivatedRoute, private ms : MainService) { }

  start = 0;
  all_questions;
  // todo (gucci) : handle pagination of data (questions)
  ngOnInit(): void {
    this.ms.getQuestions().subscribe(data => {
      // get 10 from data
      this.all_questions = data;
        this.questions = (data as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
      }
    );
  }

  prev(){
    this.start = Math.max(this.start-1, 0);
    this.questions = (this.all_questions as Array<any>).slice(this.start * 10, this.start * 10 + 10);
  }

  next(){
    this.start = Math.min(this.start+1, Math.ceil(this.all_questions.length)/10);
    this.questions = (this.all_questions as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
  }

}

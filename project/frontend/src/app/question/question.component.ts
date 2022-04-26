import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../main.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  questions : any;
  selectedQuestion : string = "";

  constructor(private route : ActivatedRoute, private ms : MainService) { }
  // todo (gucci) : handle pagination of data (questions)
  ngOnInit(): void {
    this.ms.getQuestions().subscribe(data => {
      // get 10 from data
        this.questions = (data as Array<any>).slice(0, 10);
        console.log(this.questions);
      }
    );
  }

}

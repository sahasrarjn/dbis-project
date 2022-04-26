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

  ngOnInit(): void {
    this.ms.getQuestions().subscribe(data => {
        this.questions = data;
      }
    );
  }

}

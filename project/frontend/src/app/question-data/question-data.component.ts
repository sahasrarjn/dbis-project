import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-question-data',
  templateUrl: './question-data.component.html',
  styleUrls: ['./question-data.component.scss']
})
export class QuestionDataComponent implements OnInit {
  id : any;
  question : any;

  constructor(private route : ActivatedRoute, private ms : MainService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.ms.getQuestionData(this.id).subscribe(data => {
      this.question = data;
      console.log(this.question);
    });
  }
}

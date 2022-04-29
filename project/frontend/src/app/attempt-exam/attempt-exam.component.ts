import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../services/exam.service';

@Component({
  selector: 'app-attempt-exam',
  templateUrl: './attempt-exam.component.html',
  styleUrls: ['./attempt-exam.component.scss']
})
export class AttemptExamComponent implements OnInit {

  id;
  exam;
  examForm = new FormGroup({});
  remaining_time = 0;
  constructor(private route:ActivatedRoute, private es:ExamService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.es.getExamData(this.id).subscribe(data => {
      this.exam = data;
      this.remaining_time = this.exam.overall.duration * 60;
      setInterval(() => {
          this.remaining_time--;
          if(this.remaining_time <= 0) this.onSubmit();
      }, 1000);
      console.log("Attempt Exam", data);

      for (let i = 0; i < this.exam.questions.length; i++) {
        this.examForm.addControl('ques' + this.exam.questions[i].question_id, new FormControl(''));
      }
    });

    let user_id = parseInt(localStorage.getItem("user_id"));
    this.es.startExam(this.id, user_id);
  }

  getMins(){return Math.floor(this.remaining_time / 60);}
  getSeconds(){return this.remaining_time % 60;}

  onSubmit(){
    let answers = [];
    for (let i = 0; i < this.exam.questions.length; i++) {
      answers.push({
        question_id: this.exam.questions[i].question_id,
        answer: this.examForm.get('ques' + this.exam.questions[i].question_id).value
      });
    }

    let user_id = parseInt(localStorage.getItem("user_id"));

    this.es.getStartTime(this.id, user_id).subscribe((data) => {
      // TODO: FIX THIS 
      var duration = data;
      this.es.submitExam(this.id, user_id, duration).subscribe(data => {
        console.log("Submit Exam", data);
        this.router.navigate(['report-card'], {queryParams: {eid: this.id, sid: user_id}});
      });
    })
  }



}

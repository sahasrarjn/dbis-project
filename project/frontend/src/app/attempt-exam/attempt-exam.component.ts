import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../services/exam.service';
import { StudentService } from '../services/student.service';
import { templates } from './templates';

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
  student_template: any;
  code_template: any;

  constructor(private ss: StudentService, private route: ActivatedRoute, private es: ExamService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.es.getExamData(this.id).subscribe(data => {
      this.exam = data;
      this.remaining_time = this.exam.overall.duration * 60;
      setInterval(() => {
        this.remaining_time--;
      }, 1000);
      console.log("Attempt Exam", data);

      for (let i = 0; i < this.exam.questions.length; i++) {
        this.examForm.addControl('ques' + this.exam.questions[i].question_id, new FormControl(''));
      }
    });
    this.ss.getStudentTemplate(localStorage.getItem('user_id')).subscribe(
      res => {
        this.student_template = res['base_code'];
        console.log(this.student_template);
        this.get_code_template(this.student_template);
      },
      err => {
        console.log(err);
      }
    );
  }

  get_code_template(template) {
    this.code_template = templates[template];
  }

  getMins() { return Math.floor(this.remaining_time / 60); }
  getSeconds() { return this.remaining_time % 60; }

  onSubmit() {
    let user_id = parseInt(localStorage.getItem("user_id"));
    this.es.submitExam(this.id, user_id).subscribe(data => {
      this.router.navigate(['report-card'], { queryParams: { eid: this.id, sid: user_id } });
    });
  }



}

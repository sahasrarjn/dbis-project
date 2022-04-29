import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../services/exam.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-attempt-exam',
  templateUrl: './attempt-exam.component.html',
  styleUrls: ['./attempt-exam.component.scss']
})
export class AttemptExamComponent implements OnInit {

  id;
  exam;
  examForm;
  remaining_time = 0;
  student_template: any;

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
    });
    this.ss.getStudentTemplate(this.id).subscribe(
      res => {
        console.log("Student Template", res);
      },
      err => {
        console.log(err);
      }
    );
  }

  getMins() { return Math.floor(this.remaining_time / 60); }
  getSeconds() { return this.remaining_time % 60; }

  onSubmit() {

  }



}

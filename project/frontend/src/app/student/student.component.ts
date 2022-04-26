import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  sid : any = 20309; // todo: get it from auth/login compoment
  // todo: get student details, (prabs): backend se user data return kara de

  attempted_exams : any;
  attempted_ques : any; // todo: what to do with this?
  constructor(private route:ActivatedRoute, private ss:StudentService) { }

  ngOnInit(): void {
    this.ss.getAttemptedQues(this.sid).subscribe(data => {
      this.attempted_ques = data;
    });

    this.ss.getAttemptedExams(this.sid).subscribe(data => {
      this.attempted_exams = data;
    });
  }

}

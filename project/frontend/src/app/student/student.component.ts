import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  sid : any; // todo: get it from auth/login compoment
  // todo: get student details, (prabs): backend se user data return kara de
  student : any;
  attempted_exams : any;
  attempted_ques : any; // todo: what to do with this?
  table_idx = 0;
  max_table_idx = 0;
  constructor(private route:ActivatedRoute, private ss:StudentService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.sid = params['id'] });

    this.ss.getStudentbyId(this.sid).subscribe(data => {
      this.student = data;
    })

    this.ss.getAttemptedQues(this.sid).subscribe(data => {
      this.attempted_ques = data;
    });

    this.ss.getAttemptedExams(this.sid).subscribe(data => {
      this.attempted_exams = data;
      console.log("ae", data);
      this.max_table_idx = this.attempted_exams.length % 10 == 0 ? Math.floor(this.attempted_exams.length / 10) - 1 : Math.floor(this.attempted_exams.length / 10);
    });
  }

  navigate_to_rc(eid){
    this.router.navigate(['report-card'], {queryParams: {eid: eid, sid: this.sid}});
  }

  start(){
    this.table_idx = 0;
  }

  next(){
    this.table_idx = Math.min(this.table_idx+ 1, Math.floor(this.attempted_exams.length / 10));
  }

  prev(){
    this.table_idx = Math.max(this.table_idx- 1, 0);
  } 
}

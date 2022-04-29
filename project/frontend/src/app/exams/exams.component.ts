import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../services/exam.service';
import { LoginService } from '../services/login.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {
  exams : any;
  all_exams : any;
  start : any = 0;
  sid : any = 0;
  is_student : any = false;

  is_attempted : any = {};
  attempted_exams : any;

  constructor(private route:ActivatedRoute, private es:ExamService, private ss : StudentService, private _login : LoginService) { }

  ngOnInit(): void {
    this.sid = localStorage.getItem('user_id'); // will be used only for student
    
    if(this._login.studentloggedIn()){
      this.is_student = true;
    }

    this.es.getAllExams().subscribe(data => {
      this.all_exams = data;
      this.exams = (data as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
      this.start = 0;
      
      var defaultBool = true;
      
      if(this.is_student){
        defaultBool = false;
      }

      for(let i=0; i<this.all_exams.length; i++) {
        this.is_attempted[this.all_exams[i].exam_id] = defaultBool;
      }
    });    


    if(this.is_student){
      this.handleQuesButton();
    }
  }

  handleQuesButton(){
    // console.log("handleQuesButton");
    var sid = localStorage.getItem('user_id');
    this.ss.getAttemptedExams(sid).subscribe(data => {
      this.attempted_exams = data;
      for(let i=0; i<this.attempted_exams.length; i++) {
        this.is_attempted[this.attempted_exams[i].exam_id] = true;
      }    
      // console.log(this.is_attempted);
    });
  }

  goto_start(){
    this.start = 0;
    this.exams = (this.all_exams as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
  }

  prev(){
    this.start = Math.max(this.start-1, 0);
    this.exams = (this.all_exams as Array<any>).slice(this.start * 10, this.start * 10 + 10);
  }

  next(){
    this.start = Math.min(this.start+1, Math.ceil(this.all_exams.length)/10);
    this.exams = (this.all_exams as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
  }

}

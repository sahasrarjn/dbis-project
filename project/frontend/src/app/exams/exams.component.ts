import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../services/exam.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {
  exams : any;
  all_exams : any;
  start : any = 0;

  constructor(private route:ActivatedRoute, private es:ExamService) { }

  ngOnInit(): void {
    this.es.getAllExams().subscribe(data => {
      this.all_exams = data;
      this.exams = (data as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
      this.start = 0;
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

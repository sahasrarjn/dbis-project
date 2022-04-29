import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../services/teacher.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  tid : any;
  teacher : any;
  questions_added : any;
  students : any;
  table_idx = 0;
  max_table_idx = 0;

  constructor(private route:ActivatedRoute, private ts:TeacherService, private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.tid = params['id'] });
    this.ts.getTeacherById(this.tid).subscribe(data => {
      this.teacher = data['teacher'];
      this.questions_added = data['questions'];
      this.students = data['students']
    });
  }

  navigate(url){
    this.router.navigate([url]);
  }

  start(){
    this.table_idx = 0;
  }

  next(){
    this.table_idx = Math.min(this.table_idx+ 1, Math.floor(this.questions_added.length / 10));
  }

  prev(){
    this.table_idx = Math.max(this.table_idx- 1, 0);
  } 

}

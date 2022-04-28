import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../services/exam.service';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss']
})
export class ExamDetailComponent implements OnInit {
  id : any;
  exam : any;
  constructor(private route:ActivatedRoute, private es:ExamService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.es.getExamData(this.id).subscribe(data => {
      this.exam = data;
    });
  }

  navigate(id){
    this.router.navigate(['question/' + id]);
  }
}

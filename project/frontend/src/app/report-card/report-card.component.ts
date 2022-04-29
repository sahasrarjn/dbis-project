import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss']
})
export class ReportCardComponent implements OnInit {
  student_id : any; // todo: get this from backend
  exam_id : any;

  report_data : any;

  constructor(private route:ActivatedRoute, private ss:StudentService, private router: Router) { }


  // TODO: student_id is fixed and will be decide by login component, exam_id will be decided by url
  // Todo: or instead get the list of exams in which student appeared then that will link to this page. That can be on student's homepage.

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      this.exam_id = params['eid'];
      this.student_id = params['sid'];
    });
    this.getReportCard();
  }
  
  getReportCard(){
    this.ss.getReportCard(this.student_id, this.exam_id).subscribe(
      data => {
        this.report_data = data;
    });
  }

  navigate(url){
    this.router.navigate([url]);
  }

}

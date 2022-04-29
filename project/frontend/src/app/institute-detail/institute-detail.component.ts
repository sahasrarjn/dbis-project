import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstituteService } from '../services/institute.service';

@Component({
  selector: 'app-institute-detail',
  templateUrl: './institute-detail.component.html',
  styleUrls: ['./institute-detail.component.scss']
})
export class InstituteDetailComponent implements OnInit {
  id : any;
  institute : any;
  table_idx = 0;
  max_table_idx = 100;

  constructor(private route:ActivatedRoute, private is:InstituteService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.is.getInsituteById(this.id).subscribe(data => {
      this.institute = data;
      this.max_table_idx = Math.floor(this.institute.exams.length / 10);
    });
  }

  navigate(url){
    this.router.navigate([url]);
  }

  next(){
    this.table_idx = Math.min(this.table_idx+1, Math.floor(this.institute.exams.length / 10));
  }

  prev(){
    this.table_idx = Math.max(this.table_idx -1 , 0);
  }

  start(){
    this.table_idx = 0;
  }

}

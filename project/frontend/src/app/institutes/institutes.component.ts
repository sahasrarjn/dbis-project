import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstituteService } from '../services/institute.service';

@Component({
  selector: 'app-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.scss']
})
export class InstitutesComponent implements OnInit {
  institutes : any;
  all_institutes : any;
  start : any = 0;

  constructor(private route:ActivatedRoute, private is:InstituteService) { }

  ngOnInit(): void {
    this.is.getAllInstitutes().subscribe(data => {
      this.all_institutes = data;
      this.institutes = (data as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
      this.start = 0;
    });    
  }

  goto_start(){
    this.start = 0;
    this.institutes = (this.all_institutes as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
  }

  prev(){
    this.start = Math.max(this.start-1, 0);
    this.institutes = (this.all_institutes as Array<any>).slice(this.start * 10, this.start * 10 + 10);
  }

  next(){
    this.start = Math.min(this.start+1, Math.ceil(this.all_institutes.length)/10);
    this.institutes = (this.all_institutes as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
  }
}

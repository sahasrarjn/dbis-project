import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstituteService } from '../services/institute.service';

@Component({
  selector: 'app-institute-detail',
  templateUrl: './institute-detail.component.html',
  styleUrls: ['./institute-detail.component.scss']
})
export class InstituteDetailComponent implements OnInit {
  id : any;
  institute : any;

  constructor(private route:ActivatedRoute, private is:InstituteService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.is.getInsituteById(this.id).subscribe(data => {
      this.institute = data;
    });
  }

}

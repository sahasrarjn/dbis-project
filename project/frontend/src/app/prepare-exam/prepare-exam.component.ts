import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { MainService } from '../main.service';

@Component({
  selector: 'app-prepare-exam',
  templateUrl: './prepare-exam.component.html',
  styleUrls: ['./prepare-exam.component.scss']
})
export class PrepareExamComponent implements OnInit {
  all_exam_types : any;
  all_tags : any;
  
  // params for the form

  // common params
  exam_name : any;
  exam_type : any;
  author : any; // set it to username (todo : siba auth ke time dekh lena ye)

  // Random exam
  min_difficulty : any; // todo (prabs): need to get range of this from backend
  max_difficulty : any;
  tags : any; // todo: select from tag list (optional: add new tags from frontend side)

  // Manual exam
  qid : any;


  // todo : create post form to create exam

  constructor(private route : ActivatedRoute, private es : ExamService, private ms : MainService) { }

  ngOnInit(): void {
    this.es.getExamTypes().subscribe(data => {
      this.all_exam_types = data;
    });

    this.ms.getTags().subscribe(data => {
      this.all_tags = data;
    });
  }

}

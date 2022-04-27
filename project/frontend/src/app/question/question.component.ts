import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  questions : any;
  selectedQuestion : string[] = [];

  diff_lower : string = "";
  diff_upper : string = "";
  author_id : string = "";

  tags : any;
  selectedTags : string[] = [];

  constructor(private route : ActivatedRoute, private ms : MainService) { }

  start = 0;
  all_questions;
  // todo (gucci) : handle pagination of data (questions)
  ngOnInit(): void {
    this.ms.getTags().subscribe(data => {
      this.tags = data;
      this.toggle_all_tags();
      this.get_questions();
    });
    
  }

  get_questions(){
    this.ms.getQuestions(this.diff_lower, this.diff_upper, this.selectedTags, this.author_id).subscribe(data => {
      // get 10 from data
      this.all_questions = data;
        this.questions = (data as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
    });
  }

  toggle_all_tags(){
    if(this.selectedTags.length > 0){
      this.selectedTags = [];
    }else{
      this.selectedTags = [];
      for(let i=0; i < this.tags.length; i++){
        this.selectedTags.push(this.tags[i].tag_id);
      }
    }
  }

  tags_select(){
    this.get_questions();
  }

  onNgModelChange(event : any){

  }

  prev(){
    this.start = Math.max(this.start-1, 0);
    this.questions = (this.all_questions as Array<any>).slice(this.start * 10, this.start * 10 + 10);
  }

  next(){
    this.start = Math.min(this.start+1, Math.ceil(this.all_questions.length)/10);
    this.questions = (this.all_questions as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
  }

}

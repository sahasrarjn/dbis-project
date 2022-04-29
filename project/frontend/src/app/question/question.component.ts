import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { FormControl } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { StudentService } from '../services/student.service';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  questions : any;
  selectedQuestion : string[] = [];
  author_filter : any;
  authors = new Set();

  diff_lower : string = "";
  diff_upper : string = "";
  author_id : string = "";

  tags : any;
  selectedTags : string[] = [];

  mindiff = new FormControl('');
  maxdiff = new FormControl('');

  direct_ques : any;
  indirect_ques : any;
  check_next_disabled = false;

  constructor(private route : ActivatedRoute, 
              private ms : MainService) { }

  start = 0;
  all_questions;
  curr_ques = 'direct';
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
      this.direct_ques = this.all_questions['direct'];
      this.indirect_ques = this.all_questions['related'];
      this.all_questions = this.all_questions['direct'];
      for(let i = 0; i < this.all_questions.length; i++){
        this.authors.add(this.all_questions[i].author);
      }
      this.questions = this.all_questions.slice(this.start * 10 , this.start * 10 + 10);
      this.start = 0;

      if(this.all_questions.length <= 10){
        this.check_next_disabled = true;
      }
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

  toggleQues(){
    if(this.curr_ques == 'direct'){
      this.all_questions = this.indirect_ques;
      this.curr_ques = 'indirect';
    }
    else{
      this.all_questions = this.direct_ques;
      this.curr_ques = 'direct';
    }

    this.goto_start();
  }

  tags_select(){
    this.get_questions();
  }

  onNgModelChange(event : any){

  }
  goto_start(){
    this.start = 0;
    this.questions = (this.all_questions as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
    if(this.all_questions.length <= 10){
      this.check_next_disabled = true;
    }
  }

  prev(){
    this.start = Math.max(this.start-1, 0);
    this.questions = (this.all_questions as Array<any>).slice(this.start * 10, this.start * 10 + 10);
  }

  next(){
    this.start = Math.min(this.start+1, Math.ceil(this.all_questions.length)/10);
    this.questions = (this.all_questions as Array<any>).slice(this.start * 10 , this.start * 10 + 10);
    if(this.start*10 + 10 >= this.all_questions.length){
      this.check_next_disabled = true;
    }
  }

  filter(){
    let min = this.mindiff.value;
    let max = this.maxdiff.value;
    if(!min && !max){
      return;
    }
    if(!min) min = 0;
    if(!max) max = 300000;
    this.diff_lower = min;
    this.diff_upper = max;
    this.get_questions();
  }

  changeAuthorFilter(author_){
    let author = author_.value;
    this.questions = this.all_questions.filter(question => {
      question.author == author
    });

    return this.questions;
  }

}

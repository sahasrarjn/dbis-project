import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../services/exam.service';
import { MainService } from '../services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EXAM_TYPE_DATA } from './data';

@Component({
  selector: 'app-prepare-exam',
  templateUrl: './prepare-exam.component.html',
  styleUrls: ['./prepare-exam.component.scss']
})
export class PrepareExamComponent implements OnInit {
  all_exam_types: any;
  all_tags: any;
  all_tags_in_form: any = Array(100);
  EXAM_TYPE_DATA = EXAM_TYPE_DATA;

  tooltip_text = "State exam: 30 mins for 2 ques\nEducational exam: 60 mins for 3 ques\nStandard exam: 90 mins for 4 questions\nNational exam: 120 mins for 6 questions";

  //exam

  created_exam: any;
  // params for the form

  // common params
  error_ques = false;
  error_diff = false;
  error_numtags = false;
  submitted = false;
  error_range = false;
  author = localStorage.getItem('user_id'); // set it to username (todo : siba auth ke time dekh lena ye)

  // Random exam
  min_difficulty: any = new FormControl(''); // todo (prabs): need to get range of this from backend
  max_difficulty: any = new FormControl('');
  tags: any = new FormControl(''); // todo: select from tag list (optional: add new tags from frontend side)

  // Manual exam
  qid: any = new FormControl('');
  all_questions: any;
  selectedTags: string[] = [];
  num_ques = 0;
  final_questions: any = [];
  req_ques: any;

  //map tagid to tagname

  tagmap: any = {};
  final_tagids: any = [];
  exam_map: any = {};
  final_exam_type: any;
  exam_num_ques: any = {};


  // todo : create post form to create exam

  profileForm = new FormGroup({
    examName: new FormControl('', Validators.required),
    examType: new FormControl('', Validators.required),
    max_diff: new FormControl('', Validators.required),
    min_diff: new FormControl('', Validators.required)
  });

  manualForm = new FormGroup({
    examName: new FormControl('', Validators.required),
    examType: new FormControl('', Validators.required)
  });

  constructor(private route: ActivatedRoute, private es: ExamService, private ms: MainService, private _router: Router) { }

  ngOnInit(): void {
    this.es.getExamTypes().subscribe(data => {
      this.all_exam_types = data;
      for (let i = 0; i < this.all_exam_types.length; i++) {
        this.exam_map[this.all_exam_types[i].type] = this.all_exam_types[i].id;
        this.exam_num_ques[this.all_exam_types[i].type] = this.all_exam_types[i].num_ques;
      }
      console.log("all_exam_types", data)
      console.log("exam_map", this.exam_map)
    });

    this.ms.getTags().subscribe(data => {
      this.all_tags = data;

      console.log("all_tags", data);

      // console.log("there");

      for (let i = 0; i < this.all_tags.length; i++) {
        this.tagmap[this.all_tags[i]['tag_name']] = this.all_tags[i]['tag_id'];
        this.selectedTags.push(this.all_tags[i]['tag_id']);
      }

      this.getQuestions();

      for (let i = 0; i < this.all_tags_in_form.length; i++) {
        this.profileForm.addControl(this.all_tags[i].tag_name, new FormControl(false));
      }
    });

  }

  getQuestions() {
    this.ms.getQuestions("", "", this.selectedTags, "").subscribe(data => {
      // get 10 from data
      this.all_questions = data;
      console.log(this.all_questions)

      this.all_questions = this.all_questions['direct'];

      for (let i = 0; i < this.all_questions.length; i++) {
        this.manualForm.addControl(this.all_questions[i].question_id, new FormControl(false));
      }

    });
  }


  onManualSubmit() {
    this.error_ques = false;
    let item = this.manualForm.value;

    this.num_ques = 0;

    for (let i = 0; i < this.all_questions.length; i++) {
      if (item[this.all_questions[i].question_id]) {
        this.final_questions.push(this.all_questions[i].question_id);
        this.num_ques++;
      }
    }

    this.final_exam_type = this.exam_map[item.examType];

    if (this.num_ques != this.exam_num_ques[item.examType]) {
      this.error_ques = true;
      return;
    }

    this.es.createManualExam(item.examName, this.final_exam_type, this.final_questions, this.author).
      subscribe(
        res => {
          console.log(res);
          this._router.navigate(['/exam/' + res['exam_id']]);
        },
        err => {
          console.log(err);
        });

    this.submitted = true;
    this.manualForm.reset();

  }


  onSubmit() {
    this.error_diff = false;
    this.error_numtags = false;
    this.submitted = false;
    this.error_range = false;
    let item = this.profileForm.value;
    console.log(item);
    let min_diff = item.min_diff;
    let max_diff = item.max_diff;
    let num_tags = 0;
    if (max_diff - min_diff < 300) {
      this.error_diff = true;
      return;
    }
    if (min_diff < 1000 || max_diff > 2000) {
      this.error_range = true;
      return;
    }

    for (let i = 0; i < this.all_tags.length; i++) {
      if (this.profileForm.get(this.all_tags[i].tag_name).value) {
        num_tags++;
        this.final_tagids.push(this.tagmap[this.all_tags[i]['tag_name']]);
      }
    }

    if (num_tags < 2) {
      this.error_numtags = true;
      return;
    }

    this.final_exam_type = this.exam_map[item.examType];

    this.es.createRandomExam(item.examName, this.final_exam_type, min_diff,
      max_diff, this.final_tagids, this.author)
      .subscribe(
        res => {
          console.log(res);
          this._router.navigate(['/exam/' + res['exam_id']]);
        },
        err => {
          console.log(err);
        }
      )


    this.submitted = true;
    this.profileForm.reset();
  }

}

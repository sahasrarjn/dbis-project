import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  author_id: any;
  all_tags: any;
  all_tags_in_form: any = Array(100);
  error_numtags: any = false;
  submitted: any = false;

  createForm = new FormGroup({
    qtext: new FormControl('', Validators.required),
    diff: new FormControl('', Validators.required),
    ans: new FormControl('', Validators.required),
    tc: new FormControl('', Validators.required)
  });

  constructor(private _router: Router, private route: ActivatedRoute, private ms: MainService) {
    this.author_id = localStorage.getItem('user_id');
    console.log(this.author_id);
    this.ms.getTags().subscribe(data => {
      this.all_tags = data;
      for (let i = 0; i < this.all_tags_in_form.length; i++) {
        this.createForm.addControl(this.all_tags[i].tag_name, new FormControl(false));
      }
      console.log("all_tags", data)
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.error_numtags = false;
    this.submitted = false;
    var num_tags = 0;
    let item = this.createForm.value;
    for (let i = 0; i < this.all_tags.length; i++) {
      if (this.createForm.get(this.all_tags[i].tag_name).value) {
        num_tags++;
      }
    }

    if (num_tags < 2) {
      this.error_numtags = true;
      return;
    }

    this.submitted = true;
    var tags = [];
    for (let i = 0; i < this.all_tags.length; i++) {
      if (this.createForm.get(this.all_tags[i].tag_name).value) {
        tags.push(this.all_tags[i].tag_id);
      }
    }
    console.log(tags);
    this.ms.addQuestion(item.qtext, item.diff, item.ans, item.tc, this.author_id, tags).subscribe(data => {
      console.log(data);
      this._router.navigate(['/question/' + data['qid']]);
    });
    this.createForm.reset();
  }


}

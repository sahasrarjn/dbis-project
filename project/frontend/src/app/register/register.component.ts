import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegService } from '../reg.service';
import { NewTeacherUser, NewUser } from './newuser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  mynewuser: NewUser;
  mynewteacher: NewTeacherUser;

  is_student: Boolean = false;
  is_teacher: Boolean = false;

  visible = true;

  errormessage: String = "";

  regForm = new FormGroup({
    student_id: new FormControl('', Validators.required),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    date_of_birth: new FormControl('', Validators.required),
    user_name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    student_template: new FormControl('', Validators.required),
    institute: new FormControl('', Validators.required),
    facad: new FormControl('', Validators.required),
  })

  regFormTeacher = new FormGroup({
    teacher_id: new FormControl('', Validators.required),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    date_of_birth: new FormControl('', Validators.required),
    user_name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private regserv: RegService, private _router: Router, private http: HttpClient) { }

  ngOnInit(): void {
  }

  validate(): Boolean {
    if (this.regForm.get('student_id').value == "" ||
      this.regForm.get('first_name').value == "" ||
      this.regForm.get('last_name').value == "" ||
      this.regForm.get('date_of_birth').value == "" ||
      this.regForm.get('user_name').value == "" ||
      this.regForm.get('password').value == "" ||
      this.regForm.get('student_template').value == ""
      || this.regForm.get('institute').value == "" ||
      this.regForm.get('facad').value == "") {
      this.errormessage = "Please fill all the fields";
      return false;
    }
    else {
      return true;
    }
  }

  validate2(): Boolean {
    if (this.regFormTeacher.get('teacher_id').value == "" ||
      this.regFormTeacher.get('first_name').value == "" ||
      this.regFormTeacher.get('last_name').value == "" ||
      this.regFormTeacher.get('date_of_birth').value == "" ||
      this.regFormTeacher.get('user_name').value == "" ||
      this.regFormTeacher.get('password').value == "") {
      this.errormessage = "Please fill all the fields";
      return false;
    }
    else {
      return true;
    }
  }

  onSubmit() {
    this.mynewuser = {
      student_id: this.regForm.get('student_id').value,
      first_name: this.regForm.get('first_name').value,
      last_name: this.regForm.get('last_name').value,
      date_of_birth: this.regForm.get('date_of_birth').value,
      user_name: this.regForm.get('user_name').value,
      password: this.regForm.get('password').value,
      student_template: this.regForm.get('student_template').value,
      institute: this.regForm.get('institute').value,
      facad: this.regForm.get('facad').value,
    }

    this.regserv.tryreg(this.mynewuser)
      .subscribe(
        res => {
          this.errormessage = "";
          this._router.navigate(['/login']);
        },
        err => {
          console.log(err);
          this.errormessage = err;
        }
      )
  }

  onTeacherSubmit() {
    this.mynewteacher = {
      teacher_id: this.regFormTeacher.get('teacher_id').value,
      first_name: this.regFormTeacher.get('first_name').value,
      last_name: this.regFormTeacher.get('last_name').value,
      date_of_birth: this.regFormTeacher.get('date_of_birth').value,
      user_name: this.regFormTeacher.get('user_name').value,
      password: this.regFormTeacher.get('password').value,
    }

    this.regserv.tryregteacher(this.mynewteacher)
      .subscribe(
        res => {
          this.errormessage = "";
          this._router.navigate(['/login']);
        },
        err => {
          console.log(err);
          this.errormessage = err;
        }
      )
  }

  activateStudentreg() {
    this.is_student = true;
    this.is_teacher = false;
  }

  activateTeacherreg() {
    this.is_student = false;
    this.is_teacher = true;
  }
}

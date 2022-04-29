import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegService } from '../services/reg.service';
import { NewTeacherUser, NewUser } from './newuser';
import * as shajs from 'sha.js';
import { InstituteService } from '../services/institute.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  mynewuser: NewUser;
  mynewteacher: NewTeacherUser;

  templates: any[] = [
    { id: 0, name: "C++" },
    { id: 1, name: "Python" },
  ];

  institutes: any;
  facads: any;
  students: any;

  is_student: Boolean = false;
  is_teacher: Boolean = false;

  visible = true;

  st_id: any;
  inst_id: any;
  fac_id: any;

  max_st_id: any;
  max_t_id: any;

  errormessage: String = "";

  regForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    date_of_birth: new FormControl('', Validators.required),
    user_name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    // student_template: new FormControl('', Validators.required),
    institute: new FormControl('', Validators.required),
    facad: new FormControl('', Validators.required),
  })

  regFormTeacher = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    date_of_birth: new FormControl('', Validators.required),
    user_name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private is: InstituteService, private regserv: RegService, private _router: Router, private http: HttpClient) { }

  ngOnInit(): void {

    this.is.getAllInstitutes().subscribe(
      res => {
        console.log(res);
        this.institutes = res;
      },
      err => {
        console.log(err);
      }
    )

    this.is.getAllFacads().subscribe(
      res => {
        this.facads = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  validate(): Boolean {
    if (this.regForm.get('first_name').value == "" ||
      this.regForm.get('last_name').value == "" ||
      this.regForm.get('date_of_birth').value == "" ||
      this.regForm.get('user_name').value == "" ||
      this.regForm.get('password').value == ""
      // this.regForm.get('student_template').value == "" ||
      // this.regForm.get('institute').value == "" ||
      // this.regForm.get('facad').value == "") {
    ) {
      this.errormessage = "Please fill all the fields";
      return false;
    }
    else {
      return true;
    }
  }

  validate2(): Boolean {
    if (this.regFormTeacher.get('first_name').value == "" ||
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
    let password = this.regForm.get('password').value;
    let pass_hash = shajs('sha256').update({ password }).digest('hex');
    this.mynewuser = {
      first_name: this.regForm.get('first_name').value,
      last_name: this.regForm.get('last_name').value,
      date_of_birth: this.regForm.get('date_of_birth').value,
      user_name: this.regForm.get('user_name').value,
      password: pass_hash,
      student_template: this.st_id,
      institute: this.inst_id,
      facad: this.fac_id,
    }

    console.log(this.mynewuser);

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
    let password = this.regFormTeacher.get('password').value;
    let pass_hash = shajs('sha256').update({ password }).digest('hex');
    this.mynewteacher = {
      first_name: this.regFormTeacher.get('first_name').value,
      last_name: this.regFormTeacher.get('last_name').value,
      date_of_birth: this.regFormTeacher.get('date_of_birth').value,
      user_name: this.regFormTeacher.get('user_name').value,
      password: pass_hash
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

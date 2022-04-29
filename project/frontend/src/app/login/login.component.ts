import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from './user';
import * as shajs from 'sha.js';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  myuser: User;
  notsuccess: string = "";
  is_teacher: boolean = false;
  is_student: boolean = false;

  token: any;
  user_id: any;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  teacherloginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private logserv: LoginService,
    private _router: Router,
    private locallogserv: LoginService,
  ) { }

  ngOnInit(): void {
  }

  activateStudentLogin() {
    this.is_student = true;
    this.is_teacher = false;
  }

  activateTeacherLogin() {
    this.is_teacher = true;
    this.is_student = false;
  }
  onSubmit() {
    let password =  this.loginForm.get('password').value;
    let pass_hash = shajs('sha256').update({password}).digest('hex');
    this.myuser = {
      user_name: this.loginForm.get('username').value,
      password: pass_hash,
    }

    this.logserv.trylogin(this.myuser)
      .subscribe(
        (res: any) => {
          // console.log(res)
          this.notsuccess = "";
          // this.localcall();
          if (res.success) {
            console.log(res);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user_name', this.myuser.user_name);
            localStorage.setItem('type', 'student');
<<<<<<< HEAD
            this._router.navigate(['']);
=======
            localStorage.setItem('user_id', res.data.user_id);
            this._router.navigate(['/questions']);
>>>>>>> 86dfa2770f681807c9191ff0a86bb4ca554a6cf8
          }
          else {
            alert("Invalid credentials. Try Again!")
          }

        },
        err => {
          // this.notsuccess = "fail";
          alert("Invalid credentials. Try Again!")
          console.log(err);

        }
      )
  }

  onTeacherSubmit() {
    let password =  this.teacherloginForm.get('password').value;
    let pass_hash = shajs('sha256').update({password}).digest('hex');
    this.myuser = {
      user_name: this.teacherloginForm.get('username').value,
      password: pass_hash
    }
// Nancy1999/10/02
    this.logserv.tryteacherlogin(this.myuser)
      .subscribe(
        (res: any) => {
          // console.log(res)
          this.notsuccess = "";
          // this.localcall();
          if (res.success) {
            this.token = res.data.token;
            this.user_id = res.data.user_id;

            localStorage.setItem('token', this.token);
            localStorage.setItem('user_name', this.myuser.user_name);
            localStorage.setItem('type', 'teacher');
<<<<<<< HEAD
            this._router.navigate(['']);
=======
            localStorage.setItem('user_id', this.user_id);
            this._router.navigate(['/prepare-exam']);
>>>>>>> 86dfa2770f681807c9191ff0a86bb4ca554a6cf8
          }
          else {
            alert("Invalid credentials. Try Again!")
          }

        },
        err => {
          // this.notsuccess = "fail";
          alert("Invalid credentials. Try Again!")
          console.log(err);
        }
      )
  }
}

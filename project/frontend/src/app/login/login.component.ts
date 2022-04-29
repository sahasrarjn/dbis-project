import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from './user';

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
    this.myuser = {
      user_name: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    }

    this.logserv.trylogin(this.myuser)
      .subscribe(
        (res: any) => {
          // console.log(res)
          this.notsuccess = "";
          // this.localcall();
          if (res.success) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_name', this.myuser.user_name);
            localStorage.setItem('type', 'student');
            this._router.navigate(['']);
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
    this.myuser = {
      user_name: this.teacherloginForm.get('username').value,
      password: this.teacherloginForm.get('password').value,
    }
// Nancy1999/10/02
    this.logserv.tryteacherlogin(this.myuser)
      .subscribe(
        (res: any) => {
          // console.log(res)
          this.notsuccess = "";
          // this.localcall();
          if (res.success) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_name', this.myuser.user_name);
            localStorage.setItem('type', 'teacher');
            this._router.navigate(['']);
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

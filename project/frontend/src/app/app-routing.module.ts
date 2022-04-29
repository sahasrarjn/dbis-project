import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { LoginComponent } from './login/login.component';
import { ExamsComponent } from './exams/exams.component';
import { InstituteDetailComponent } from './institute-detail/institute-detail.component';
import { InstitutesComponent } from './institutes/institutes.component';
import { PrepareExamComponent } from './prepare-exam/prepare-exam.component';
import { QuestionDataComponent } from './question-data/question-data.component';
import { QuestionComponent } from './question/question.component';
import { RegisterComponent } from './register/register.component';
import { ReportCardComponent } from './report-card/report-card.component';
import { StudentComponent } from './student/student.component';
import { TeacherGuard } from './teacher.guard';
import { TeacherComponent } from './teacher/teacher.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'questions', component: QuestionComponent, canActivate: [AuthGuard] },
  { path: 'question/:id', component: QuestionDataComponent, canActivate: [AuthGuard] },

  { path: 'exams', component: ExamsComponent, canActivate: [AuthGuard] },
  { path: 'exam/:id', component: ExamDetailComponent, canActivate: [AuthGuard] },
  { path: 'prepare-exam', component: PrepareExamComponent, canActivate: [TeacherGuard] }, // Todo: Left to implement

  { path: 'institutes', component: InstitutesComponent, canActivate: [AuthGuard] },
  { path: 'institute/:id', component: InstituteDetailComponent, canActivate: [AuthGuard] },

  { path: 'report-card', component: ReportCardComponent, canActivate: [] },
  { path: 'student/:id', component: StudentComponent, canActivate: [TeacherGuard] }, // Todo: Update this to profile, and redirect to relevant component based on role
  { path: 'teacher/:id', component: TeacherComponent, canActivate: [AuthGuard] }, // Todo: empty component, this is a public page, any user can access and see all exams prepared by teacher and other details
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



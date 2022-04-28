import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { LoginComponent } from './login/login.component';
import { PrepareExamComponent } from './prepare-exam/prepare-exam.component';
import { QuestionDataComponent } from './question-data/question-data.component';
import { QuestionComponent } from './question/question.component';
import { RegisterComponent } from './register/register.component';
import { ReportCardComponent } from './report-card/report-card.component';
import { StudentComponent } from './student/student.component';
import { TeacherGuard } from './teacher.guard';
import { TeacherComponent } from './teacher/teacher.component';

const routes: Routes = [
  { path: '', redirectTo: 'questions', pathMatch: 'full' },
  { path: 'questions', component: QuestionComponent, canActivate: [AuthGuard] },
  { path: 'question/:id', component: QuestionDataComponent },
  { path: 'exam-detail/:id', component: ExamDetailComponent },
  { path: 'prepare-exam', component: PrepareExamComponent, canActivate: [TeacherGuard] }, // Todo (gucci): left to implement (form banana hai)
  { path: 'report-card/:eid', component: ReportCardComponent },
  { path: 'student', component: StudentComponent }, // Todo: Update this to profile, and redirect to relevant component based on role
  { path: 'teacher/:id', component: TeacherComponent }, // Todo: empty component, this is a public page, any user can access and see all exams prepared by teacher and other details
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



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
import { AddQuestionComponent } from './add-question/add-question.component';
import { NotauthGuard } from './notauth.guard';
import { AttemptExamComponent } from './attempt-exam/attempt-exam.component';
import { EditorComponent } from './editor/editor.component';
import { AttemptedGuardGuard } from './attempted-guard.guard';

const routes: Routes = [
  { path: 'questions', component: QuestionComponent, canActivate: [AuthGuard] },
  { path: 'question/:id', component: QuestionDataComponent, canActivate: [AuthGuard, AttemptedGuardGuard] },

  { path: 'exams', component: ExamsComponent, canActivate: [AuthGuard] },
  { path: 'exam/:id', component: ExamDetailComponent, canActivate: [AuthGuard] },
  { path: 'prepare-exam', component: PrepareExamComponent, canActivate: [TeacherGuard] }, // Todo: Left to implement
  { path: 'attempt-exam/:id', component: AttemptExamComponent, canActivate: [AuthGuard] },

  { path: 'institutes', component: InstitutesComponent, canActivate: [AuthGuard] },
  { path: 'institute/:id', component: InstituteDetailComponent, canActivate: [AuthGuard] },

  { path: 'report-card', component: ReportCardComponent, canActivate: [AuthGuard] },
  { path: 'student/:id', component: StudentComponent, canActivate: [TeacherGuard] },
  { path: 'teacher/:id', component: TeacherComponent, canActivate: [AuthGuard] },

  { path: 'add-question', component: AddQuestionComponent, canActivate: [TeacherGuard] },

  { path: 'login', component: LoginComponent, canActivate: [NotauthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotauthGuard] },
  { path: 'editor', component: EditorComponent },
  { path: '**', component: HomeComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



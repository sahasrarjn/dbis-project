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
  { path: '', component: HomeComponent },
  { path: 'questions', component: QuestionComponent },
  { path: 'question/:id', component: QuestionDataComponent },

  { path: 'exams', component: ExamsComponent },
  { path: 'exam/:id', component: ExamDetailComponent },
  { path: 'prepare-exam', component: PrepareExamComponent }, // Todo (gucci): left to implement (form banana hai)

  { path: 'institutes', component: InstitutesComponent },
  { path: 'institute/:id', component: InstituteDetailComponent },

  { path: 'report-card/:eid', component: ReportCardComponent },
  { path: 'student/:id', component: StudentComponent }, // Todo: Update this to profile, and redirect to relevant component based on role
  { path: 'teacher/:id', component: TeacherComponent }, // Todo: empty component, this is a public page, any user can access and see all exams prepared by teacher and other details
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



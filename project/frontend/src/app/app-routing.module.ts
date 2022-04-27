import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { PrepareExamComponent } from './prepare-exam/prepare-exam.component';
import { QuestionDataComponent } from './question-data/question-data.component';
import { QuestionComponent } from './question/question.component';
import { ReportCardComponent } from './report-card/report-card.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [
  {path: '', redirectTo: 'questions', pathMatch: 'full'},
  {path: 'questions', component: QuestionComponent},
  {path: 'question/:id', component: QuestionDataComponent},
  {path: 'exam-detail/:id', component: ExamDetailComponent},
  {path: 'prepare-exam', component: PrepareExamComponent}, // Todo (gucci): left to implement (form banana hai)
  {path: 'report-card/:eid', component: ReportCardComponent},
  {path: 'student', component: StudentComponent}, // Todo: Update this to profile, and redirect to relevant component based on role
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



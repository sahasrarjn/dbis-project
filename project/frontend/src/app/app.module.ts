import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { QuestionDataComponent } from './question-data/question-data.component';
import { PrepareExamComponent } from './prepare-exam/prepare-exam.component';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { HttpClientModule } from '@angular/common/http';

// Angular material
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ReportCardComponent } from './report-card/report-card.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';


@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    QuestionDataComponent,
    PrepareExamComponent,
    ExamDetailComponent,
    ReportCardComponent,
    StudentComponent,
    TeacherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule,
    HttpClientModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

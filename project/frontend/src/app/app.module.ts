import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { QuestionDataComponent } from './question-data/question-data.component';
import { PrepareExamComponent } from './prepare-exam/prepare-exam.component';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    QuestionDataComponent,
    PrepareExamComponent,
    ExamDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

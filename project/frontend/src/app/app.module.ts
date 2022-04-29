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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReportCardComponent } from './report-card/report-card.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';
import { ExamsComponent } from './exams/exams.component';
import { NgChartsModule } from 'ng2-charts';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegService } from './services/reg.service';
import { LoginService } from './services/login.service';
import { InstitutesComponent } from './institutes/institutes.component';
import { InstituteDetailComponent } from './institute-detail/institute-detail.component';
import { HomeComponent } from './home/home.component';





@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    QuestionDataComponent,
    PrepareExamComponent,
    ExamDetailComponent,
    ReportCardComponent,
    StudentComponent,
    TeacherComponent,
    ExamsComponent,
    LoginComponent,
    RegisterComponent,
    InstitutesComponent,
    InstituteDetailComponent,
    HomeComponent,
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
    MatIconModule,
    NgChartsModule,
    FormsModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule
  ],
  providers: [RegService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }

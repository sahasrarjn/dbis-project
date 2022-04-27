import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-question-data',
  templateUrl: './question-data.component.html',
  styleUrls: ['./question-data.component.scss']
})
export class QuestionDataComponent implements OnInit {
  id : any;
  question : any;



  constructor(private route : ActivatedRoute, private ms : MainService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.ms.getQuestionData(this.id).subscribe(data => {
      this.question = data;
      console.log(this.question);
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ [ 'Download' ], [ 'In Store Sales' ], 'Mail Sales' ],
    datasets: [ {
      data: [ 300, 500, 100 ]
    } ]
  };
  public pieChartType: ChartType = 'pie';


}


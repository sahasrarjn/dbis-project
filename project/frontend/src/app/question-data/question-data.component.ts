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

  public timeTakenChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public timeTakenChartLabels: string[] = [ 'Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running' ];

  public timeTakenChartData: ChartData<'scatter'> = {
    labels: this.timeTakenChartLabels,
    datasets: [
      {
        data: [
          { x: 1, y: 1 },
          { x: 2, y: 3 },
          { x: 3, y: -2 },
          { x: 4, y: 4 },
          { x: 5, y: -3 },
        ],
        label: 'Series A',
        pointRadius: 10,
      },
    ]
  };
  public timeTakenChartType: ChartType = 'scatter';


  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(private route : ActivatedRoute, private ms : MainService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.ms.getQuestionData(this.id).subscribe(data => {
      this.question = data;
      console.log(this.question);
    });
  }




}


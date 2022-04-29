import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-question-data',
  templateUrl: './question-data.component.html',
  styleUrls: ['./question-data.component.scss']
})

export class QuestionDataComponent implements OnInit {
  id : any;
  question : any;
  current_insti : any;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {}
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public time_taken_data: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Number of students vs Time taken' }
    ]
  };

  public marks_data: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Number of students vs Marks obtained' }
    ]
  };

  public relevance_data: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Number of students vs Relevance' }
    ]
  };

  

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }
  constructor(private route : ActivatedRoute, private ms : MainService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.ms.getQuestionData(this.id).subscribe(data => {
      this.question = data;
      console.log(this.question)
      this.setTimeTakenData(data['student_data']);
      this.setMarksData(data['student_data']);
      this.setRelevanceData(data['student_data']);
    });
  }

  navigate(url){
    this.router.navigate([url]);
  }

  setTimeTakenData(data){
    var map = new Map();

    for(let i = 0; i < data.length; i++){
      var d = data[i];
      var key : number = parseInt(d['time_taken']);
      if(map.has(key)){
        map.set(key, map.get(key) + 1);
      }else{
        map.set(key, 1);
      }
    }

    var arr = Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
    for (let entry of arr){
      this.time_taken_data.labels.push(entry[0]);
      this.time_taken_data.datasets[0].data.push(entry[1]);
    }
  }

  setMarksData(data){
    var map = new Map();

    for(let i = 0; i < data.length; i++){
      var d = data[i];
      var key : number = parseFloat(d['marks']);
      if(map.has(key)){
        map.set(key, map.get(key) + 1);
      }else{
        map.set(key, 1);
      }
    }

    var arr = Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
    for (let entry of arr){
      this.marks_data.labels.push(entry[0]);
      this.marks_data.datasets[0].data.push(entry[1]);
    }
  }

  setRelevanceData(data){
    var map = new Map();

    for(let i = 0; i < data.length; i++){
      var d = data[i];
      var key : number = parseInt(d['relevance']);
      if(map.has(key)){
        map.set(key, map.get(key) + 1);
      }else{
        map.set(key, 1);
      }
    }

    var arr = Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
    for (let entry of arr){
      this.relevance_data.labels.push(entry[0]);
      this.relevance_data.datasets[0].data.push(entry[1]);
    }
  }



}


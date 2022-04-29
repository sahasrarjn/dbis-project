import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstituteService } from '../services/institute.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-institute-detail',
  templateUrl: './institute-detail.component.html',
  styleUrls: ['./institute-detail.component.scss']
})
export class InstituteDetailComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  id : any;
  institute : any;
  table_idx = 0;
  max_table_idx = 100;
  barChartData: any = {
    labels: [],
    datasets: [
      {data: [], label: 'Number of best ranks in the given rank range'}
    ]
  };

  barChartOptions = {
    reponsive: true,
    scales: {
			y: {
				title:{
					display: true,
					text: 'Frequency',
				}
			},
			x: {
				title:{
					display: true,
					text: 'Rank',
				}
			}
		}
  };

  avgTimeData = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };

  avgMarksData = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };


  constructor(private route:ActivatedRoute, private is:InstituteService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.is.getInsituteById(this.id).subscribe(data => {
      this.institute = data;
      console.log(this.institute)
      this.max_table_idx = Math.floor(this.institute.exams.length / 10);
      this.graphAverageTime();
      this.graphAverageMarks();
      this.graphRanks();
    });
  }

  navigate(url){
    this.router.navigate([url]);
  }

  next(){
    this.table_idx = Math.min(this.table_idx+1, Math.floor(this.institute.exams.length / 10));
  }

  prev(){
    this.table_idx = Math.max(this.table_idx -1 , 0);
  }

  start(){
    this.table_idx = 0;
  }

  graphAverageTime(){
    let times = [];
    for(var i = 0; i < this.institute.exams.length; i++){
      times.push(parseFloat(this.institute.exams[i].avg_time));
    }
    let max_time = Math.max(...times);
    let max_label = Math.floor((max_time-1) / 10);
    for(var i = 0; i <= max_label; i++){
      this.avgTimeData.labels.push(`${i*10}-${(i+1)*10}`);
      this.avgTimeData.datasets[0].data.push(times.filter(time => time >= i*10 && time < (i+1)*10).length);
    }
    this.chart?.update();
  }

  graphAverageMarks(){
    let marks = [];
    for(var i = 0; i < this.institute.exams.length; i++){
      marks.push(parseFloat(this.institute.exams[i].avg_marks));
    }
    let max_marks = Math.max(...marks);
    if(!Number.isInteger(max_marks)) max_marks = Math.ceil(max_marks);

    for(var i = 0; i <= max_marks; i++){
        this.avgMarksData.labels.push(`${i} - ${i+1}`);
        this.avgMarksData.datasets[0].data.push(marks.filter(mark => mark >= i && mark < i+1).length);
    }

    this.chart?.update();
  }

  graphRanks(){
    let ranks = [];
    for(var i = 0; i < this.institute.exams.length; i++){
      ranks.push(parseFloat(this.institute.exams[i].best_rank));
    }

    let max_rank = Math.max(...ranks);

    for(var i = 0; i <= max_rank; i++){
      this.barChartData.labels.push(`${i} - ${i+10}`);
      this.barChartData.datasets[0].data.push(ranks.filter(rank => rank >= i && rank < i+10).length);
    }
  }

}

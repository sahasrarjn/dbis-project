import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../services/exam.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss']
})
export class ExamDetailComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  id : any;
  exam : any;
  barChartData: any = {
    labels: [],
    datasets: [
      {data: [], label: 'Number of students for given marks'}
    ]
  };

  instituteMarksGraph = {
    labels: [],
    datasets: [
      {data: [], label: 'Number of institutes for given marks'}
    ]
  };

  barChartOptions = {
    reponsive: true,
    scales: {
			y: {
				title:{
					display: true,
					text: 'Number of Students',
				}
			},
			x: {
				title:{
					display: true,
					text: 'Marks',
				}
			}
		}
  };

  instituteMarksOptions = {
    reponsive: true,
    scales: {
			y: {
				title:{
					display: true,
					text: 'Number of Institutes',
				}
			},
			x: {
				title:{
					display: true,
					text: 'Marks',
				}
			}
		}
  };

  pieChartData = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };

  constructor(private route:ActivatedRoute, private es:ExamService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { this.id = params['id'] });
    this.es.getExamData(this.id).subscribe(data => {
      this.exam = data;
      console.log(data);
      this.getStudentMarksGraphData();
      this.getInstituteMarksGraphData();
      this.getPieChartData();
    });
  }

  navigate(id){
    this.router.navigate(['question/' + id]);
  }

  getStudentMarksGraphData(){
    let marks = [];
    for(var i = 0; i < this.exam.students.length; i++){
      marks.push(parseInt(this.exam.students[i].marks));
    }
    let max_marks = Math.max(...marks);
    for(var i = 1; i <= max_marks; i++){
      this.barChartData.labels.push(i);
      this.barChartData.datasets[0].data.push(marks.filter(x => x == i).length);
      this.chart?.update();
    }
  }

  getInstituteMarksGraphData(){
    let marks = [];
    for(var i = 0; i < this.exam.institutes.length; i++){
      marks.push(parseInt(this.exam.institutes[i].avg_marks));
    }
    let max_marks = Math.max(...marks);

    for(var i = 1; i <= max_marks; i++){
      this.instituteMarksGraph.labels.push(i);
      this.instituteMarksGraph.datasets[0].data.push(marks.filter(x => x == i).length);
      this.chart?.update();
    }
  }

  getPieChartData(){
    let times = [];
    for(var i = 0; i < this.exam.institutes.length; i++){
      times.push(parseFloat(this.exam.institutes[i].avg_time));
    }
    let max_time = Math.max(...times);
    let max_label = Math.floor(max_time/10);

    for(var i = 0; i <= max_label; i++){
      this.pieChartData.labels.push(`${i*10} - ${(i+1)*10}`);
      this.pieChartData.datasets[0].data.push(times.filter(x => ((x < i*10 + 10) && (x >= i*10))).length);
      this.chart?.update();
    }
  }

}

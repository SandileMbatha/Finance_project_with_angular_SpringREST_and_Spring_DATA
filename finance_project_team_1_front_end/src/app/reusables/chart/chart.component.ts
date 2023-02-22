import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  @Input() xAxis!: number[];
  @Input() yAxis!: number[];

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
    }
  }

  ngOnInit(): void {}

  createChart() {
    let htmlRef = this.elementRef.nativeElement.querySelector('#chart');
    return new Chart(htmlRef, {
      type: 'line',
      data: {
        labels: this.xAxis,
        datasets: [
          {
            fill: false,
            label: 'Closing Balance (R)',
            pointStyle: 'circle',
            pointRadius: 1,
            backgroundColor: '#9b330f',
            borderColor: '#e74c16',
            pointHoverRadius: 15,
            data: this.yAxis,
          },
        ],
      },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              align: 'center',
              text: 'Amount (R)',
              padding: 25,

              font: {
                weight: 'bold',
                size: 20,
              },
            },
          },

          x: {
            title: {
              display: true,
              align: 'center',
              text: 'Month',
              padding: 25,

              font: {
                weight: 'bold',
                size: 20,
              },
            },
          },
        },
      },
    });
  }
}

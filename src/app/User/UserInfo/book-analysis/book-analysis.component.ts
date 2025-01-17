import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import ApexCharts from 'apexcharts';
import { EBookService } from '../../../reading-section/e-book/e-book.service';
import { UserServices } from '../../user.service';

@Component({
  selector: 'app-book-analysis',
  templateUrl: './book-analysis.component.html',
  styleUrls: ['./book-analysis.component.css']
})
export class BookAnalysisComponent implements OnInit, AfterViewInit {
  commentsAnalysis: number[] = [0, 0]; // Initialize with zeros
  BookAnalysis: number[] = [];
  barChart: ApexCharts | null = null;
  areaChart: ApexCharts | null = null;
  Numbers: any;

  constructor(private route: ActivatedRoute, private bookService: EBookService, private userService: UserServices, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.bookService.getBookById(id).subscribe(
          (data: any) => {

          }, (error) => {

            this.router.navigate(['**']);
          }
        )
        this.bookService.getCommentAnalysis(id).subscribe(
          (data: any) => {
            this.commentsAnalysis = [data.positive_precision, data.negative_precision];
            this.initializeBarChart(); // Initialize the bar chart after data is fetched
          },
          (error) => {
            console.error('Error fetching comment analysis:', error);
            this.commentsAnalysis = [0, 0]; // Set to zeros on error
            this.initializeBarChart(); // Initialize the bar chart with zeros
          }
        );

        this.bookService.geteBookAnalysis(id).subscribe(
          (data: any) => {
            this.BookAnalysis = data.map((item: any) => {
              const progress = (item.highest_progress / item.totalPages) * 100;
              return parseInt(progress.toFixed(0), 10); // Convert the string to number
            });
            this.initializeAreaChart(); // Initialize the area chart after data is fetched
          },
          (error) => {
            console.error('Error fetching book analysis:', error);
          }
        );

        const token = sessionStorage.getItem('Token');
        if (token) {
          this.userService.userProfile(token).subscribe(
            (userData: any) => {
              this.userService.BooksAnalysisNumbers(userData.id.toString(), id).subscribe(
                (data: any) => {
                  this.Numbers = data;
                },
                (error) => {
                  console.error('Error fetching book analysis Numbers:', error);
                }
              );
            },
            (error) => {
              console.error('Error fetching user profile:', error);
            }
          );
        }
      } else {
        console.error('Invalid book ID');
      }
    });
  }

  ngAfterViewInit() {
    // Initialization of the chart will be done after data is fetched in ngOnInit
  }

  initializeBarChart() {
    const barChartOptions = {
      series: [
        {
          data: this.commentsAnalysis,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: ['#32cd32', '#cc3c43'],
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 4,
          horizontal: false,
          columnWidth: '20%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: ['Positive', 'Negative'],
      },
      yaxis: {
        title: {
          text: 'Percentage',
        },
      },
    };

    const barChartElement = document.querySelector('#bar-chart');
    if (barChartElement) {
      this.barChart = new ApexCharts(barChartElement, barChartOptions);
      this.barChart.render();
    } else {
      console.error("Element with id 'bar-chart' not found");
    }
  }

  initializeAreaChart() {
    const areaChartOptions = {
      series: [
        {
          name: 'Reader Progress',
          data: this.BookAnalysis,
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      colors: ['#4f35a1'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: this.BookAnalysis.map((_, index) => `Reader ${index + 1}`),
        title: {
          text: 'Readers',
        },
      },
      yaxis: {
        title: {
          text: 'Progress (%)',
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    };

    const areaChartElement = document.querySelector('#area-chart');
    if (areaChartElement) {
      this.areaChart = new ApexCharts(areaChartElement, areaChartOptions);
      this.areaChart.render();
    } else {
      console.error("Element with id 'area-chart' not found");
    }
  }

  updateBarChart() {
    if (this.barChart) {
      this.barChart.updateSeries([
        {
          data: this.commentsAnalysis,
        },
      ]);
    }
  }

  updateAreaChart() {
    if (this.areaChart) {
      this.areaChart.updateSeries([
        {
          name: 'Reader Progress',
          data: this.BookAnalysis,
        },
      ]);
    }
  }
}

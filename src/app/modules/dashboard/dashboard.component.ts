import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { DashboardStats } from '../../core/models/models';
import { LocalizationService } from '../../core/services/localization.service';
import { ThemeService } from '../../core/services/theme.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { DashboardService } from './services/dashboard.service';
import { Observable, take, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardModule,
    ChartModule,
    TableModule,
    ButtonModule,
    TagModule,
    SelectButtonModule,
    FormsModule,
    RouterLink,
  ],
  styles: [
    `
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.25rem;
        margin-bottom: 2rem;
      }
      .charts-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }
      @media (max-width: 1024px) {
        .charts-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  template: `
    <div class="page-header">
      <h1>{{ 'DASHBOARD.TITLE' | translate }}</h1>
      <div class="header-actions">
        <p-select-button [options]="periods" [(ngModel)]="selectedPeriod" optionLabel="label" />
      </div>
    </div>

    <!-- KPI Cards -->
    @if (stats$ | async; as stats) {
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue"><i class="pi pi-receipt"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalSales }}</div>
            <div class="stat-label">{{ 'DASHBOARD.TOTAL_SALES' | translate }}</div>
            <div class="stat-change up">↑ 12% this week</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="pi pi-dollar"></i></div>
          <div class="stat-content">
            <div class="stat-value">
              {{ stats.totalRevenue | currency: 'EG' : 'symbol' : '1.2-2' }}
            </div>
            <div class="stat-label">{{ 'DASHBOARD.TOTAL_REVENUE' | translate }}</div>
            <div class="stat-change up">↑ 8.3% this week</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><i class="pi pi-box"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalProducts }}</div>
            <div class="stat-label">{{ 'DASHBOARD.TOTAL_PRODUCTS' | translate }}</div>
            <div class="stat-change up">↑ 2 new today</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple"><i class="pi pi-users"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">{{ 'DASHBOARD.TOTAL_USERS' | translate }}</div>
            <div class="stat-change up">↑ 1 this month</div>
          </div>
        </div>
      </div>
    }

    <!-- Charts Row -->
    <div class="charts-grid">
      <div class="card">
        <h3 style="margin-bottom: 1rem; font-weight: 600;">
          {{ 'DASHBOARD.SALES_TREND' | translate }}
        </h3>
        <p-chart type="line" [data]="lineChartData" [options]="lineChartOptions" height="260px" />
      </div>
      <div class="card">
        <h3 style="margin-bottom: 1rem; font-weight: 600;">Revenue Split</h3>
        <p-chart type="doughnut" [data]="doughnutData" [options]="doughnutOptions" height="260px" />
      </div>
    </div>

    <!-- Top Products Table -->
    @if (stats$ | async; as stats) {
      <div class="card">
        <div
          style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;"
        >
          <h3 style="font-weight: 600;">{{ 'DASHBOARD.TOP_PRODUCTS' | translate }}</h3>
          <p-button
            label="View All"
            icon="pi pi-arrow-right"
            iconPos="right"
            [text]="true"
            [routerLink]="['/products']"
            size="small"
          />
        </div>
        <p-table [value]="stats.topProducts" [rows]="5">
          <ng-template pTemplate="header">
            <tr>
              <th>#</th>
              <th>{{ 'PRODUCTS.PRODUCT_NAME' | translate }}</th>
              <th>{{ 'SALES.ITEMS' | translate }}</th>
              <th>{{ 'SALES.TOTAL' | translate }}</th>
              <th>Performance</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item let-i="rowIndex">
            <tr>
              <td>
                <span style="font-weight: 700; color: var(--p-primary-500);">#{{ i + 1 }}</span>
              </td>
              <td>
                <span style="font-weight: 500;">{{ item.productName }}</span>
              </td>
              <td>{{ item.sold }}</td>
              <td style="font-weight: 600;">{{ item.revenue | currency }}</td>
              <td>
                <div
                  style="background: var(--surface-200); border-radius: 4px; height: 6px; width: 100%; overflow: hidden;"
                >
                  <div
                    [style.width.%]="(item.revenue / 60) * 100"
                    style="height: 100%; background: var(--primary-400); border-radius: 4px;"
                  ></div>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  stats$: Observable<DashboardStats>;
  selectedPeriod: any = { label: 'Week', value: 'week' };
  periods = [
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  lineChartData: any;
  lineChartOptions: any;
  doughnutData: any;
  doughnutOptions: any;

  constructor(
    private dashboardService: DashboardService,
  ) {}

  ngOnInit() {

    this.stats$ = this.dashboardService.getDashboardData().pipe(
      tap((data) => {
        console.log(data);
        // this.buildCharts(data);
      }),
    );
  }

  buildCharts(s: DashboardStats) {
    this.lineChartData = {
      labels: s.salesTrend.map((x) => x.label),
      datasets: [
        {
          label: 'Revenue (SAR)',
          data: s.salesTrend.map((x) => x.value),
          fill: true,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          tension: 0.4,
          pointBackgroundColor: '#3B82F6',
        },
      ],
    };
    this.lineChartOptions = {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } },
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    this.doughnutData = {
      labels: s.topProducts.slice(0, 3).map((p) => p.productName),
      datasets: [
        {
          data: s.topProducts.slice(0, 3).map((p) => p.totalQuantity),
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
          hoverBackgroundColor: ['#2563EB', '#059669', '#D97706'],
        },
      ],
    };
    this.doughnutOptions = {
      plugins: { legend: { position: 'bottom' } },
      responsive: true,
      maintainAspectRatio: false,
    };
  }
}

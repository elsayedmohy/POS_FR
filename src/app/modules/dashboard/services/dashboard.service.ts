import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { Observable, take } from 'rxjs';
import { DashboardStats } from '../../../core/models/models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  REPORT_URL: string = 'reports/';

  constructor(private apiService: ApiService) {}

  getDashboardData(): Observable<DashboardStats> {
    return this.apiService.get(this.REPORT_URL + 'dashboard');
  }
}

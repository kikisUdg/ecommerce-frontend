import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  health() {
    return this.http.get<{ status: string; framework: string }>(
      `${environment.apiUrl}/health`
    );
  }
}
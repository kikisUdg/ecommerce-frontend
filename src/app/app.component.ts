import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true, // importante mantener standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ecommerce-frontend';
  backendStatus = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.health().subscribe({
      next: (res) => {
        console.log('Health endpoint:', res);
        this.backendStatus = `${res.framework} está funcionando correctamente`;
      },
      error: (err) => {
        console.error('Error al conectar con backend:', err);
        this.backendStatus = 'Error al conectar con el servidor';
      }
    });
  }
}
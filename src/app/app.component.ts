import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { AuthService } from './pages/auth/service/auth.service'; 

import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

declare const $: any;
declare global {
  interface Window { HOMEINIT?: (jq?: any) => void; $?: any; jQuery?: any; }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ecommerce-frontend';
  backendStatus = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,    
    private router: Router        
  ) {}

  ngOnInit(): void {
    // inicializa token/usuario desde localStorage
    this.auth.initAuth();

    // (opcional) si ya hay sesión y estás en /login o /register, manda a Home
    // const url = this.router.url;
    // if (this.auth.isAuthenticated() && (url === '/login' || url === '/register')) {
    //   this.router.navigateByUrl('/');
    // }

    // ping a backend
    this.api.health().subscribe({
      next: (res: any) => {
        console.log('Health endpoint:', res);
        this.backendStatus = `${res.framework} está funcionando correctamente`;
      },
      error: (err) => {
        console.error('Error al conectar con backend:', err);
        this.backendStatus = 'Error al conectar con el servidor';
      },
    });
  }

  ngAfterViewInit(): void {
    // PreLoader
    $(window).on('load', () => $('#loading').fadeOut(500));

    // jQuery global
    if (typeof window.$ === 'undefined' && typeof $ !== 'undefined') {
      window.$ = $; window.jQuery = $;
    }

    // Inicializa scripts del template
    setTimeout(() => {
      if (typeof window.HOMEINIT === 'function') {
        window.HOMEINIT(window.$ ?? $);
      }
    }, 0);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, throwError, tap } from 'rxjs';
import { environment } from 'environments/environment';

interface LoginResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  user?: any;
}

export interface RegisterPayload {
  name: string;
  surname?: string;
  email: string;
  password: string;
  password_confirmation?: string;
  phone?: string;
  avatar?: string;
  type_user?: number; // opcional; el backend lo pone en 2 por defecto
}

interface RegisterResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = environment.apiUrl;
  token: string = '';
  user: any = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initAuth();
  }

  /** Lee token/usuario de localStorage al inicializar el servicio */
  initAuth(): void {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    this.token = t ?? '';
    this.user = u ? JSON.parse(u) : null;
  }

  /** Login — devuelve la respuesta completa (útil para depurar) */
  login(email: string, password: string) {
    const url = `${this.API}/auth/login_ecommerce`;
    return this.http.post<LoginResponse>(url, { email, password }).pipe(
      tap((resp) => console.log('🟢 Login resp:', resp)),
      map((resp) => {
        const ok = this.saveLocalStorage(resp);
        if (!ok) throw new Error('Respuesta inválida (sin access_token)');
        return resp;
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('🔴 Error en login:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url,
          errorBody: err.error,
        });
        return throwError(() => err);
      })
    );
  }

  /**
   * Registro — ahora SOLO crea la cuenta y envía el correo.
   * NO guarda token, NO inicia sesión.
   * Devuelve el objeto { message: string } que manda Laravel.
   */
  register(data: RegisterPayload) {
    const url = `${this.API}/auth/register`;
    return this.http.post<RegisterResponse>(url, data).pipe(
      tap((resp) => console.log('🟢 Register resp:', resp)),
      // 👇 ya NO hacemos map ni saveLocalStorage: el backend no manda access_token
      catchError((err: HttpErrorResponse) => {
        console.error('🔴 Error en register:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url,
          errorBody: err.error,
        });
        return throwError(() => err);
      })
    );
  }

  /** Cerrar sesión */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = '';
    this.user = null;
    this.router.navigateByUrl('/login');
  }

  /** ¿Hay sesión activa? */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /** Cabeceras con Authorization */
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: this.token ? `Bearer ${this.token}` : '',
    });
  }

  /** Guarda token/usuario en localStorage (solo se usa en login) */
  private saveLocalStorage(resp: LoginResponse): boolean {
    if (resp && resp.access_token) {
      localStorage.setItem('token', resp.access_token);
      if (resp.user) {
        localStorage.setItem('user', JSON.stringify(resp.user));
      }
      this.token = resp.access_token;
      this.user = resp.user ?? null;
      return true;
    }
    return false;
  }
}
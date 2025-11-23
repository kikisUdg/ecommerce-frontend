import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.toastr.error('Necesitas ingresar todos los campos', 'Validación');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (resp: any) => {
        console.log('✅ Login exitoso:', resp);
        this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.error('❌ Error HTTP detectado:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          errorBody: error.error
        });

        if (error.status === 401) {
          this.toastr.error('Credenciales inválidas', 'No autorizado (401)');
        } else if (error.status === 0) {
          this.toastr.error('No se pudo conectar con el servidor', 'Error de conexión');
        } else {
          const msg = (error?.error && (error.error.message || error.error.error)) || 'Ha ocurrido un error';
          this.toastr.error(msg, `Error ${error.status || ''}`.trim());
        }
      }
    });
  }
}
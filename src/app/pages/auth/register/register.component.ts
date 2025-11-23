import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService, RegisterPayload } from '../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  name = '';
  surname = '';
  email = '';
  password = '';
  confirm = '';
  phone = '';
  terms = false;

  loading = false;

  constructor(
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router
  ) {}

  private extractLaravelMessage(err: any): string {
    const errors = err?.error?.errors;
    if (errors && typeof errors === 'object') {
      const first = Object.values(errors)[0] as string[];
      if (Array.isArray(first) && first.length) return first[0];
    }
    // Algunos controladores devuelven {message: "..."}
    return err?.error?.message || 'Error en el registro. Verifica los datos.';
  }

  submit(f: NgForm) {
    if (this.loading) return;

    if (!f.valid) {
      this.toastr.error('Completa los campos obligatorios', 'Validación');
      return;
    }
    if (!this.terms) {
      this.toastr.error('Debes aceptar los términos', 'Validación');
      return;
    }
    if (this.password !== this.confirm) {
      this.toastr.error('Las contraseñas no coinciden', 'Validación');
      return;
    }

    const payload: RegisterPayload = {
      name: this.name.trim(),
      surname: this.surname?.trim() || undefined,
      email: this.email.trim(),
      password: this.password,
      // Si en Laravel activas la regla 'confirmed', esto es útil:
      password_confirmation: this.confirm,
      phone: this.phone?.trim() || undefined,
      // type_user: 2, // opcional, el backend ya lo pone en 2 por defecto
    };

    this.loading = true;

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('✅ Register OK:', res);

        this.toastr.success(
          res?.message ||
            'Registro exitoso. Revisa tu correo para activar tu cuenta.'
        );

        // Opcional: si quieres mandarlo al login después de registrarse:
        // this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error al registrar:', err);
        this.toastr.error(this.extractLaravelMessage(err), 'Registro fallido');
      },
    });
  }
}
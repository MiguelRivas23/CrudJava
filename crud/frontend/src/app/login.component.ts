import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="login">
      <form class="caja" (ngSubmit)="entrar()" #f="ngForm">
        <h1>Iniciar sesión</h1>

        @if (error) {
          <div class="error">{{ error }}</div>
        }

        <label>
          Usuario
          <input name="usuario" [(ngModel)]="usuario" autocomplete="username" required autofocus />
        </label>

        <label>
          Contraseña
          <input
            name="password"
            type="password"
            [(ngModel)]="password"
            autocomplete="current-password"
            required
          />
        </label>

        <button type="submit" [disabled]="f.invalid">Entrar</button>
      </form>
    </main>
  `,
  styles: `
    .login {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .caja {
      width: 100%;
      max-width: 340px;
      background: #fff;
      border: 1px solid #e2e5ea;
      border-radius: 10px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    h1 {
      margin: 0;
      font-size: 1.3rem;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.9rem;
    }
    input {
      padding: 8px 10px;
      border: 1px solid #c7ccd4;
      border-radius: 6px;
      font-size: 0.95rem;
    }
    button {
      padding: 9px 14px;
      border: none;
      border-radius: 6px;
      background: #2563eb;
      color: #fff;
      cursor: pointer;
      font-size: 0.95rem;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error {
      background: #fee2e2;
      color: #991b1b;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.9rem;
    }
  `
})
export class LoginComponent {
  private auth = inject(AuthService);

  @Output() ingreso = new EventEmitter<void>();

  usuario = '';
  password = '';
  error = '';

  entrar(): void {
    this.auth.login(this.usuario, this.password).subscribe({
      next: () => {
        this.error = '';
        this.password = '';
        this.ingreso.emit();
      },
      error: (err) => {
        this.error =
          err.status === 401
            ? 'Usuario o contraseña incorrectos'
            : 'No se pudo conectar con el servidor (¿está corriendo el backend?)';
      }
    });
  }
}

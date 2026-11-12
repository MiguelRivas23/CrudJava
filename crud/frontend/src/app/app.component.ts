import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Persona } from './persona.model';
import { PersonaService } from './persona.service';
import { AuthService } from './auth.service';
import { LoginComponent } from './login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private service = inject(PersonaService);
  auth = inject(AuthService);

  personas: Persona[] = [];
  busqueda = '';
  error = '';

  // Formulario (sirve para crear y editar)
  form: Persona = { nombre: '', edad: null };
  editandoId: number | null = null;

  ngOnInit(): void {
    if (this.auth.logueado()) {
      this.cargar();
    }
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.personas = [];
    this.busqueda = '';
    this.error = '';
    this.cancelar();
  }

  cargar(): void {
    this.service.listar(this.busqueda).subscribe({
      next: (data) => {
        this.personas = data;
        this.error = '';
      },
      error: (err) => {
        // 401: el interceptor ya cerró la sesión y se muestra el login
        if (err.status !== 401) {
          this.error = 'No se pudo conectar con el servidor (¿está corriendo el backend?)';
        }
      }
    });
  }

  buscar(): void {
    this.cargar();
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.cargar();
  }

  guardar(): void {
    this.error = '';

    const operacion =
      this.editandoId === null
        ? this.service.crear(this.form)
        : this.service.actualizar(this.editandoId, this.form);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: (err) => {
        const detalles = err?.error && typeof err.error === 'object' ? Object.values(err.error) : [];
        this.error = detalles.length ? detalles.join(' · ') : 'Error al guardar';
      }
    });
  }

  editar(p: Persona): void {
    this.editandoId = p.id ?? null;
    this.form = { nombre: p.nombre, edad: p.edad };
    this.error = '';
  }

  eliminar(p: Persona): void {
    if (p.id === undefined) return;
    if (!confirm(`¿Eliminar a ${p.nombre}?`)) return;

    this.service.eliminar(p.id).subscribe({
      next: () => this.cargar(),
      error: () => (this.error = 'No se pudo eliminar')
    });
  }

  cancelar(): void {
    this.editandoId = null;
    this.form = { nombre: '', edad: null };
  }
}

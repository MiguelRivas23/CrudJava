import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Departamento } from './departamento.model';
import { DepartamentoService } from './departamento.service';
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
  private service = inject(DepartamentoService);
  auth = inject(AuthService);

  departamentos: Departamento[] = [];
  busqueda = '';
  error = '';

  // Formulario (sirve para crear y editar)
  form: Departamento = this.formVacio();
  editandoId: number | null = null;

  ngOnInit(): void {
    if (this.auth.logueado()) {
      this.cargar();
    }
  }

  private formVacio(): Departamento {
    return { nombre: '', municipios: [{ nombre: '' }] };
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.departamentos = [];
    this.busqueda = '';
    this.error = '';
    this.cancelar();
  }

  cargar(): void {
    this.service.listar(this.busqueda).subscribe({
      next: (data) => {
        this.departamentos = data;
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

  agregarMunicipio(): void {
    this.form.municipios.push({ nombre: '' });
  }

  quitarMunicipio(i: number): void {
    if (this.form.municipios.length > 1) {
      this.form.municipios.splice(i, 1);
    }
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
        if (err.status === 401) return;
        const detalles = err?.error && typeof err.error === 'object' ? Object.values(err.error) : [];
        this.error = detalles.length ? detalles.join(' · ') : 'Error al guardar';
      }
    });
  }

  editar(d: Departamento): void {
    this.editandoId = d.id ?? null;
    // copia para no modificar la fila de la tabla mientras se edita
    this.form = {
      nombre: d.nombre,
      municipios: d.municipios.map((m) => ({ id: m.id, nombre: m.nombre }))
    };
    this.error = '';
  }

  eliminar(d: Departamento): void {
    if (d.id === undefined) return;
    if (!confirm(`¿Eliminar el departamento ${d.nombre} y sus municipios?`)) return;

    this.service.eliminar(d.id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        if (err.status !== 401) this.error = 'No se pudo eliminar';
      }
    });
  }

  cancelar(): void {
    this.editandoId = null;
    this.form = this.formVacio();
  }
}

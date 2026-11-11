import { Injectable, signal } from '@angular/core';

const USUARIO = 'admin';
const PASSWORD = 'pass';
const CLAVE_SESION = 'sesion_activa';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // true si hay sesión iniciada (se conserva al recargar la página, hasta cerrar la pestaña)
  readonly logueado = signal<boolean>(this.leerSesion());

  login(usuario: string, password: string): boolean {
    const ok = usuario === USUARIO && password === PASSWORD;
    if (ok) {
      this.guardarSesion(true);
      this.logueado.set(true);
    }
    return ok;
  }

  logout(): void {
    this.guardarSesion(false);
    this.logueado.set(false);
  }

  private leerSesion(): boolean {
    try {
      return sessionStorage.getItem(CLAVE_SESION) === 'true';
    } catch {
      return false;
    }
  }

  private guardarSesion(valor: boolean): void {
    try {
      if (valor) {
        sessionStorage.setItem(CLAVE_SESION, 'true');
      } else {
        sessionStorage.removeItem(CLAVE_SESION);
      }
    } catch {
      // sessionStorage no disponible: la sesión solo vive en memoria
    }
  }
}

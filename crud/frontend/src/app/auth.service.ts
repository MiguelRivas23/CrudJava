import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  usuario: string;
}

const CLAVE_TOKEN = 'jwt_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  private token: string | null = this.leerToken();

  // true si hay token guardado (se conserva al recargar, hasta cerrar la pestaña)
  readonly logueado = signal<boolean>(this.token !== null);

  login(usuario: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { usuario, password }).pipe(
      tap((resp) => {
        this.token = resp.token;
        this.guardarToken(resp.token);
        this.logueado.set(true);
      })
    );
  }

  logout(): void {
    this.token = null;
    this.guardarToken(null);
    this.logueado.set(false);
  }

  getToken(): string | null {
    return this.token;
  }

  private leerToken(): string | null {
    try {
      return sessionStorage.getItem(CLAVE_TOKEN);
    } catch {
      return null;
    }
  }

  private guardarToken(valor: string | null): void {
    try {
      if (valor) {
        sessionStorage.setItem(CLAVE_TOKEN, valor);
      } else {
        sessionStorage.removeItem(CLAVE_TOKEN);
      }
    } catch {
      // sessionStorage no disponible: el token solo vive en memoria
    }
  }
}

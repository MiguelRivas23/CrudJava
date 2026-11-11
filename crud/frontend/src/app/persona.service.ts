import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from './persona.model';

@Injectable({ providedIn: 'root' })
export class PersonaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/personas';

  listar(nombre?: string): Observable<Persona[]> {
    let params = new HttpParams();
    if (nombre && nombre.trim()) {
      params = params.set('nombre', nombre.trim());
    }
    return this.http.get<Persona[]>(this.apiUrl, { params });
  }

  crear(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona);
  }

  actualizar(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, persona);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

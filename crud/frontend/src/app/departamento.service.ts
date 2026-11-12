import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from './departamento.model';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/departamentos';

  listar(nombre?: string): Observable<Departamento[]> {
    let params = new HttpParams();
    if (nombre && nombre.trim()) {
      params = params.set('nombre', nombre.trim());
    }
    return this.http.get<Departamento[]>(this.apiUrl, { params });
  }

  crear(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.apiUrl, departamento);
  }

  actualizar(id: number, departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.apiUrl}/${id}`, departamento);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

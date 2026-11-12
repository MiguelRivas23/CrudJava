export interface Municipio {
  id?: number;
  nombre: string;
}

export interface Departamento {
  id?: number;
  nombre: string;
  municipios: Municipio[];
}

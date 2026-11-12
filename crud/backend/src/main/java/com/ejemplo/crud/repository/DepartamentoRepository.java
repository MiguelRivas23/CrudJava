package com.ejemplo.crud.repository;

import com.ejemplo.crud.model.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {

    List<Departamento> findByNombreContainingIgnoreCase(String nombre);
}

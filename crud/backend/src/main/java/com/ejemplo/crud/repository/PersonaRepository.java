package com.ejemplo.crud.repository;

import com.ejemplo.crud.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonaRepository extends JpaRepository<Persona, Long> {

    List<Persona> findByNombreContainingIgnoreCase(String nombre);
}

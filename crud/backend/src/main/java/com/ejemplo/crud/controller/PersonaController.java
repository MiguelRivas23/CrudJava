package com.ejemplo.crud.controller;

import com.ejemplo.crud.model.Persona;
import com.ejemplo.crud.repository.PersonaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "http://localhost:4200")
public class PersonaController {

    private final PersonaRepository repository;

    public PersonaController(PersonaRepository repository) {
        this.repository = repository;
    }

    // LISTAR (y BUSCAR por nombre con ?nombre=xxx)
    @GetMapping
    public List<Persona> listar(@RequestParam(required = false) String nombre) {
        if (nombre != null && !nombre.isBlank()) {
            return repository.findByNombreContainingIgnoreCase(nombre.trim());
        }
        return repository.findAll();
    }

    // OBTENER por id
    @GetMapping("/{id}")
    public ResponseEntity<Persona> obtener(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREAR
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Persona crear(@Valid @RequestBody Persona persona) {
        persona.setId(null); // el id lo genera la base de datos
        return repository.save(persona);
    }

    // EDITAR
    @PutMapping("/{id}")
    public ResponseEntity<Persona> actualizar(@PathVariable Long id, @Valid @RequestBody Persona datos) {
        return repository.findById(id)
                .map(existente -> {
                    existente.setNombre(datos.getNombre());
                    existente.setEdad(datos.getEdad());
                    return ResponseEntity.ok(repository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

package com.ejemplo.crud.controller;

import com.ejemplo.crud.model.Departamento;
import com.ejemplo.crud.service.DepartamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departamentos")
public class DepartamentoController {

    private final DepartamentoService service;

    public DepartamentoController(DepartamentoService service) {
        this.service = service;
    }

    // LISTAR (y BUSCAR por nombre con ?nombre=xxx)
    @GetMapping
    public List<Departamento> listar(@RequestParam(required = false) String nombre) {
        return service.listar(nombre);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departamento> obtener(@PathVariable Long id) {
        return service.obtener(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Departamento crear(@Valid @RequestBody Departamento departamento) {
        return service.crear(departamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Departamento> actualizar(@PathVariable Long id,
                                                   @Valid @RequestBody Departamento datos) {
        return service.actualizar(id, datos)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return service.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}

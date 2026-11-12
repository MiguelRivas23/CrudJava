package com.ejemplo.crud.service;

import com.ejemplo.crud.model.Departamento;
import com.ejemplo.crud.model.Municipio;
import com.ejemplo.crud.repository.DepartamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DepartamentoService {

    private final DepartamentoRepository repository;

    public DepartamentoService(DepartamentoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Departamento> listar(String nombre) {
        if (nombre != null && !nombre.isBlank()) {
            return repository.findByNombreContainingIgnoreCase(nombre.trim());
        }
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Departamento> obtener(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public Departamento crear(Departamento departamento) {
        departamento.setId(null);
        for (Municipio m : departamento.getMunicipios()) {
            m.setId(null);
            m.setDepartamento(departamento);
        }
        return repository.save(departamento);
    }

    @Transactional
    public Optional<Departamento> actualizar(Long id, Departamento datos) {
        return repository.findById(id).map(existente -> {
            existente.setNombre(datos.getNombre());

            // Municipios con id existente se actualizan; sin id se crean; los que faltan se eliminan
            Map<Long, Municipio> actuales = new HashMap<>();
            for (Municipio m : existente.getMunicipios()) {
                actuales.put(m.getId(), m);
            }

            List<Municipio> resultado = new ArrayList<>();
            for (Municipio nuevo : datos.getMunicipios()) {
                Municipio destino = (nuevo.getId() != null && actuales.containsKey(nuevo.getId()))
                        ? actuales.get(nuevo.getId())
                        : new Municipio();
                destino.setNombre(nuevo.getNombre());
                destino.setDepartamento(existente);
                resultado.add(destino);
            }

            existente.getMunicipios().clear();
            existente.getMunicipios().addAll(resultado);
            return repository.save(existente);
        });
    }

    @Transactional
    public boolean eliminar(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id); // borra también sus municipios (cascade)
        return true;
    }
}

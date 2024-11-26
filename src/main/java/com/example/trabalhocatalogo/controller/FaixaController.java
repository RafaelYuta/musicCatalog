package com.example.trabalhocatalogo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.trabalhocatalogo.dto.FaixaDTO;
import com.example.trabalhocatalogo.model.Faixa;
import com.example.trabalhocatalogo.repository.FaixaRepository;

@RestController
@RequestMapping("/faixa")
public class FaixaController {
    
    @Autowired
    private FaixaRepository faixaRepository;

    @GetMapping
    public List<FaixaDTO> listarFaixas() {
        return faixaRepository.findAll().stream()
                .map(FaixaDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faixa> listarFaixaPorID(@PathVariable Long id) {
        var faixa = faixaRepository.findById(id);
        if (faixa.isPresent()) {
            return ResponseEntity.ok(faixa.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

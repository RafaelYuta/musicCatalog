package com.example.trabalhocatalogo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.trabalhocatalogo.dto.ArtistaDTO;
import com.example.trabalhocatalogo.model.Artista;
import com.example.trabalhocatalogo.model.Disco;
import com.example.trabalhocatalogo.repository.ArtistaRepository;

@RestController
@RequestMapping("/artista")
public class ArtistaController {
    
    @Autowired
    private ArtistaRepository artistaRepository;

    @GetMapping
    public List<ArtistaDTO> listarArtistas() {
        return artistaRepository.findAll().stream()
                .map(ArtistaDTO::new)
                .collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Artista> listarArtistaID(@PathVariable Long id){
        var artista = artistaRepository.findById(id);
        if (artista.isPresent()) {
            return ResponseEntity.ok(artista.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/criar")
    public Artista criarArtista(@RequestBody Artista artista) {
        return artistaRepository.save(artista);
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Artista> atualizarArtista(@PathVariable Long id, @RequestBody Artista artistaAtualizado) {
        var artistaExistente = artistaRepository.findById(id);
    
        if (artistaExistente.isPresent()) {
            Artista artista = artistaExistente.get();
            artista.setName(artistaAtualizado.getName());
            artistaRepository.save(artista);
            return ResponseEntity.ok(artista);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarArtista(@PathVariable Long id) {
        var artistaOpt = artistaRepository.findById(id);

        if (artistaOpt.isPresent()) {
            Artista artista = artistaOpt.get();

            for (Disco disco : artista.getDiscos()) {
                disco.setArtista(null);
            }

            artistaRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

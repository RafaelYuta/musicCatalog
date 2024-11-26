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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.trabalhocatalogo.dto.GeneroDTO;
import com.example.trabalhocatalogo.model.Artista;
import com.example.trabalhocatalogo.model.Disco;
import com.example.trabalhocatalogo.model.Faixa;
import com.example.trabalhocatalogo.model.Genero;
import com.example.trabalhocatalogo.repository.ArtistaRepository;
import com.example.trabalhocatalogo.repository.DiscoRepository;
import com.example.trabalhocatalogo.repository.FaixaRepository;
import com.example.trabalhocatalogo.repository.GeneroRepository;

@RestController
@RequestMapping("/genero")
public class GeneroController {
    
    @Autowired
    private GeneroRepository generoRepository;

    @Autowired
    private DiscoRepository discoRepository;

    @Autowired
    private ArtistaRepository artistaRepository;

    @Autowired
    private FaixaRepository faixaRepository;

    @GetMapping
    public List<GeneroDTO> listarGeneros() {
        return generoRepository.findAll().stream()
                .map(GeneroDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeneroDTO> listarGeneroID(@PathVariable Long id) {
        var generoOpt = generoRepository.findById(id);
        if (generoOpt.isPresent()) {
            GeneroDTO generoDTO = new GeneroDTO(generoOpt.get());
            return ResponseEntity.ok(generoDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/buscar")
public ResponseEntity<List<GeneroDTO>> buscarGeneros(
        @RequestParam(required = false) String titulo,
        @RequestParam(required = false) String artista,
        @RequestParam(required = false) String generoa) {

    List<Genero> generos = generoRepository.findAll();

    if (titulo != null && !titulo.isEmpty()) {
        generos = generos.stream()
                .filter(genero -> genero.getDiscos().stream()
                        .anyMatch(disco -> disco.getTitulo().toLowerCase().contains(titulo.toLowerCase())))
                .collect(Collectors.toList());
    }

    if (artista != null && !artista.isEmpty()) {
        generos = generos.stream()
                .filter(genero -> genero.getArtistas().stream()
                        .anyMatch(a -> a.getName().toLowerCase().contains(artista.toLowerCase())))
                .collect(Collectors.toList());
    }

    if (generoa != null && !generoa.isEmpty()) {
        generos = generos.stream()
                .filter(g -> g.getGenero().toLowerCase().contains(generoa.toLowerCase()))
                .collect(Collectors.toList());
    }

    if (generos.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    List<GeneroDTO> result = generos.stream().map(GeneroDTO::new).collect(Collectors.toList());
    return ResponseEntity.ok(result);
}

    @PostMapping("/criar")
    public Genero criarGenero(@RequestBody Genero genero){
        return generoRepository.save(genero);
    }

    @PutMapping("atualizar/{id}")
    public ResponseEntity<Void> atualizaGeneroPorID(@RequestBody Genero genero, @PathVariable Long id){

        var generoEntidade = generoRepository.findById(id);

        if (generoEntidade.isPresent()) {

            Genero generoAtualizado = generoEntidade.get();
            generoAtualizado.setGenero(genero.getGenero());
            generoRepository.save(generoAtualizado);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarGenero(@PathVariable Long id) {
        var generoEntity = generoRepository.findById(id);

        if (generoEntity.isPresent()) {
            Genero genero = generoEntity.get();

            for (Disco disco : genero.getDiscos()) {
                disco.getGeneros().remove(genero);
            }

            for (Faixa faixa : genero.getFaixas()) {
                faixa.getGeneros().remove(genero);
            }

            for (Artista artista : genero.getArtistas()) {
                artista.getGeneros().remove(genero);
            }

            generoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{generoId}/vincular-disco/{discoId}")
    public ResponseEntity<Void> vincularGeneroDisco(@PathVariable Long generoId, @PathVariable Long discoId) {
        var generoOpt = generoRepository.findById(generoId);
        var discoOpt = discoRepository.findById(discoId);

        if (generoOpt.isPresent() && discoOpt.isPresent()) {
            Genero genero = generoOpt.get();
            Disco disco = discoOpt.get();

            genero.getDiscos().add(disco);
            generoRepository.save(genero);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{generoId}/vincular-faixa/{faixaId}")
    public ResponseEntity<Void> vincularGeneroFaixa(@PathVariable Long generoId, @PathVariable Long faixaId) {
        var generoOpt = generoRepository.findById(generoId);
        var faixaOpt = faixaRepository.findById(faixaId);

        if (generoOpt.isPresent() && faixaOpt.isPresent()) {
            Genero genero = generoOpt.get();
            Faixa faixa = faixaOpt.get();

            genero.getFaixas().add(faixa);
            generoRepository.save(genero);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{generoId}/vincular-artista/{artistaId}")
    public ResponseEntity<Void> vincularGeneroArtista(@PathVariable Long generoId, @PathVariable Long artistaId) {
        var generoOpt = generoRepository.findById(generoId);
        var artistaOpt = artistaRepository.findById(artistaId);

        if (generoOpt.isPresent() && artistaOpt.isPresent()) {
            Genero genero = generoOpt.get();
            Artista artista = artistaOpt.get();

            genero.getArtistas().add(artista);
            generoRepository.save(genero);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

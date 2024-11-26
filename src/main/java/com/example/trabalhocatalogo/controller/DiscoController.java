package com.example.trabalhocatalogo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.multipart.MultipartFile;

import com.example.trabalhocatalogo.dto.DiscoDTO;
import com.example.trabalhocatalogo.model.Artista;
import com.example.trabalhocatalogo.model.Disco;
import com.example.trabalhocatalogo.model.Faixa;
import com.example.trabalhocatalogo.model.Genero;
import com.example.trabalhocatalogo.repository.ArtistaRepository;
import com.example.trabalhocatalogo.repository.DiscoRepository;
import com.example.trabalhocatalogo.repository.FaixaRepository;

@RestController
@RequestMapping("/disco")
public class DiscoController {
    
    @Autowired
    private DiscoRepository discoRepository;

    @Autowired
    private ArtistaRepository artistaRepository;

    @Autowired
    private FaixaRepository faixaRepository;

    @GetMapping
    public List<DiscoDTO> listarDiscos() {
        return discoRepository.findAll().stream()
                .map(DiscoDTO::new)
                .collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Disco> listarDiscoID(@PathVariable Long id){
        var disco = discoRepository.findById(id);
        if(disco.isPresent()){
            return ResponseEntity.ok(disco.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/criar")
    public ResponseEntity<Disco> criarDisco(
            @RequestParam("titulo") String titulo,
            @RequestParam("ano") int ano,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "faixas", required = false) List<String> faixas) {
        try {
            String imagePath = null;
            if (image != null && !image.isEmpty()) {
                String directory = "uploads/";
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path path = Paths.get(directory + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, image.getBytes());
                imagePath = path.toString();
            }
    
            Disco novoDisco = new Disco();
            novoDisco.setTitulo(titulo);
            novoDisco.setAno(ano);
            novoDisco.setImage(imagePath);
    
            if (faixas != null && !faixas.isEmpty()) {
                List<Faixa> faixaList = faixas.stream()
                        .map(nome -> {
                            Faixa faixa = new Faixa();
                            faixa.setName(nome);
                            faixa.setDisco(novoDisco);
                            return faixa;
                        }).collect(Collectors.toList());
                faixaRepository.saveAll(faixaList);
                novoDisco.setFaixas(faixaList);
            }
    
            Disco salvo = discoRepository.save(novoDisco);
            return ResponseEntity.ok(salvo);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    


    @PutMapping("atualizar/{id}")
    public ResponseEntity<Void> atualizaDiscoPorID(@RequestBody Disco disco, @PathVariable Long id){

        var discoEntidade = discoRepository.findById(id);

        if (discoEntidade.isPresent()) {

            Disco discoAtualizado = discoEntidade.get();
            discoAtualizado.setTitulo(disco.getTitulo());
            discoAtualizado.setAno(disco.getAno());
            discoAtualizado.setImage(disco.getImage());
            discoRepository.save(discoAtualizado);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarDisco(@PathVariable Long id) {
        var discoEntity = discoRepository.findById(id);

        if (discoEntity.isPresent()) {
            Disco disco = discoEntity.get();

            for (Faixa faixa : disco.getFaixas()) {
                faixa.setDisco(null);
            }

            for (Genero genero : disco.getGeneros()) {
                genero.getDiscos().remove(disco);
            }

            discoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{discoId}/vincular-artista/{artistaId}")
    public ResponseEntity<Void> vincularDiscoAoArtista(@PathVariable Long discoId, @PathVariable Long artistaId) {
        var discoA = discoRepository.findById(discoId);
        var artistaA = artistaRepository.findById(artistaId);

        if (discoA.isPresent() && artistaA.isPresent()) {
            Disco disco = discoA.get();
            Artista artista = artistaA.get();

            disco.setArtista(artista);
            discoRepository.save(disco);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/adicionar-faixas")
    public ResponseEntity<Void> adicionarFaixasAoDisco(@PathVariable Long id, @RequestBody List<Faixa> faixas) {
        var discoOpt = discoRepository.findById(id);

        if (discoOpt.isPresent()) {
            Disco disco = discoOpt.get();

            for (Faixa faixa : faixas) {
                faixa.setDisco(disco);
            }

            faixaRepository.saveAll(faixas);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

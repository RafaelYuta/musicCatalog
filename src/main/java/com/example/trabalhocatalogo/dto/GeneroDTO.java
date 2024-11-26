package com.example.trabalhocatalogo.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.trabalhocatalogo.model.Artista;
import com.example.trabalhocatalogo.model.Disco;
import com.example.trabalhocatalogo.model.Faixa;
import com.example.trabalhocatalogo.model.Genero;

public class GeneroDTO {
    private Long id;
    private String genero;
    private List<String> discos;
    private List<String> faixas;
    private List<String> artistas;

    public GeneroDTO(Genero genero) {
        this.id = genero.getId();
        this.genero = genero.getGenero();
        
        this.discos = (genero.getDiscos() != null) 
                ? genero.getDiscos().stream().map(Disco::getTitulo).collect(Collectors.toList()) 
                : new ArrayList<>();
        
        this.faixas = (genero.getFaixas() != null) 
                ? genero.getFaixas().stream().map(Faixa::getName).collect(Collectors.toList()) 
                : new ArrayList<>();
        
        this.artistas = (genero.getArtistas() != null) 
                ? genero.getArtistas().stream().map(Artista::getName).collect(Collectors.toList()) 
                : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public List<String> getDiscos() {
        return discos;
    }

    public void setDiscos(List<String> discos) {
        this.discos = discos;
    }

    public List<String> getFaixas() {
        return faixas;
    }

    public void setFaixas(List<String> faixas) {
        this.faixas = faixas;
    }

    public List<String> getArtistas() {
        return artistas;
    }

    public void setArtistas(List<String> artistas) {
        this.artistas = artistas;
    }

    
}


package com.example.trabalhocatalogo.dto;

import com.example.trabalhocatalogo.model.Artista;
import com.example.trabalhocatalogo.model.Disco;
import com.example.trabalhocatalogo.model.Genero;

import java.util.List;
import java.util.stream.Collectors;

public class ArtistaDTO {
    private Long id;
    private String name;
    private List<String> discos;
    private List<String> generos;

    public ArtistaDTO(Artista artista) {
        this.id = artista.getId();
        this.name = artista.getName();
        this.discos = artista.getDiscos() != null 
                ? artista.getDiscos().stream().map(Disco::getTitulo).collect(Collectors.toList())
                : null;
        this.generos = artista.getGeneros() != null 
                ? artista.getGeneros().stream().map(Genero::getGenero).collect(Collectors.toList())
                : null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getDiscos() {
        return discos;
    }

    public void setDiscos(List<String> discos) {
        this.discos = discos;
    }

    public List<String> getGeneros() {
        return generos;
    }

    public void setGeneros(List<String> generos) {
        this.generos = generos;
    }
}

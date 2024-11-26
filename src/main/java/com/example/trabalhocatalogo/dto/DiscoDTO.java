package com.example.trabalhocatalogo.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.example.trabalhocatalogo.model.Disco;
import com.example.trabalhocatalogo.model.Faixa;
import com.example.trabalhocatalogo.model.Genero;

public class DiscoDTO {
    private Long id;
    private String titulo;
    private int ano;
    private String image;
    private String artista;
    private List<String> faixas;
    private List<String> generos;

    public DiscoDTO(Disco disco) {
        this.id = disco.getId();
        this.titulo = disco.getTitulo();
        this.ano = disco.getAno();
        this.image = disco.getImage();
        this.artista = disco.getArtista() != null ? disco.getArtista().getName() : null;
        this.faixas = disco.getFaixas() != null ? disco.getFaixas().stream().map(Faixa::getName).collect(Collectors.toList()) : null;
        this.generos = disco.getGeneros() != null ? disco.getGeneros().stream().map(Genero::getGenero).collect(Collectors.toList()) : null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public int getAno() {
        return ano;
    }

    public void setAno(int ano) {
        this.ano = ano;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getArtista() {
        return artista;
    }

    public void setArtista(String artista) {
        this.artista = artista;
    }

    public List<String> getFaixas() {
        return faixas;
    }

    public void setFaixas(List<String> faixas) {
        this.faixas = faixas;
    }

    public List<String> getGeneros() {
        return generos;
    }

    public void setGeneros(List<String> generos) {
        this.generos = generos;
    }

    
}


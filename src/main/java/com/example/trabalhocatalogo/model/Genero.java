package com.example.trabalhocatalogo.model;


import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
public class Genero {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String genero;

    @ManyToMany
    @JoinTable(name = "genero_disco",
            joinColumns = @JoinColumn(name = "genero_id"),
            inverseJoinColumns = @JoinColumn(name = "disco_id"))
    private List<Disco> discos;

    @ManyToMany
    @JoinTable(name = "genero_faixa",
            joinColumns = @JoinColumn(name = "genero_id"),
            inverseJoinColumns = @JoinColumn(name = "faixa_id"))
    private List<Faixa> faixas;

    @ManyToMany
    @JoinTable(name = "genero_artista",
            joinColumns = @JoinColumn(name = "genero_id"),
            inverseJoinColumns = @JoinColumn(name = "artista_id"))
    private List<Artista> artistas;

    
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
    public Genero() {
    }
    public Genero(Long id, String genero) {
        this.id = id;
        this.genero = genero;
    }
    public List<Disco> getDiscos() {
        return discos;
    }
    public void setDiscos(List<Disco> discos) {
        this.discos = discos;
    }
    public List<Faixa> getFaixas() {
        return faixas;
    }
    public void setFaixas(List<Faixa> faixas) {
        this.faixas = faixas;
    }
    public List<Artista> getArtistas() {
        return artistas;
    }
    public void setArtistas(List<Artista> artistas) {
        this.artistas = artistas;
    }
    
}

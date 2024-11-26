package com.example.trabalhocatalogo.dto;

import com.example.trabalhocatalogo.model.Faixa;

public class FaixaDTO {
    private Long id;
    private String name;
    private String disco;

    public FaixaDTO(Faixa faixa) {
        this.id = faixa.getId();
        this.name = faixa.getName();
        this.disco = faixa.getDisco() != null ? faixa.getDisco().getTitulo() : null;
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

    public String getDisco() {
        return disco;
    }

    public void setDisco(String disco) {
        this.disco = disco;
    }

    
}


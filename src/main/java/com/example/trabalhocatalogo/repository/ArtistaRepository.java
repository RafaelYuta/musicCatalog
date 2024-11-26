package com.example.trabalhocatalogo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.trabalhocatalogo.model.Artista;

public interface ArtistaRepository extends JpaRepository<Artista, Long>{
    
}

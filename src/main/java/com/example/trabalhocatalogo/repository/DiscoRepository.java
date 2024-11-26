package com.example.trabalhocatalogo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.trabalhocatalogo.model.Disco;

public interface DiscoRepository extends JpaRepository<Disco, Long>{
    
}

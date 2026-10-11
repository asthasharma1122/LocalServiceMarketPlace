package com.localservice.backend.repository;

import com.localservice.backend.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Integer> {

    Optional<Provider> findByUserUserId(Integer userId);
}
package com.localservice.backend.repository;

import com.localservice.backend.entity.Booking;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @EntityGraph(attributePaths = {
            "customer",
            "provider",
            "service"
    })
    List<Booking> findAll();

    @EntityGraph(attributePaths = {
            "customer",
            "provider",
            "service"
    })
    List<Booking> findByCustomerUserId(Integer customerId);

    @EntityGraph(attributePaths = {
            "customer",
            "provider",
            "service"
    })
    List<Booking> findByProviderUserUserId(Integer providerUserId);

    @EntityGraph(attributePaths = {
            "customer",
            "provider",
            "service"
    })
    List<Booking> findByStatus(String status);
}
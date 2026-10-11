
package com.localservice.backend.controller;

import com.localservice.backend.service.BookingService;
import com.localservice.backend.service.dto.BookingRequest;
import com.localservice.backend.service.dto.BookingResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ============================================================
    // CREATE BOOKING
    // ============================================================

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request) {

        BookingResponse booking =
                bookingService.createBooking(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(booking);
    }

    // ============================================================
    // GET ALL BOOKINGS
    // ============================================================

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    // ============================================================
    // GET CUSTOMER BOOKINGS
    // ============================================================

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(
            @PathVariable Integer customerId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByCustomer(customerId)
        );
    }

    // ============================================================
    // GET PROVIDER BOOKINGS
    // ============================================================

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(
            @PathVariable Integer providerId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByProvider(providerId)
        );
    }

    // ============================================================
    // UPDATE BOOKING STATUS
    // ============================================================

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Integer bookingId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                bookingService.updateStatus(
                        bookingId,
                        status
                )
        );
    }
}


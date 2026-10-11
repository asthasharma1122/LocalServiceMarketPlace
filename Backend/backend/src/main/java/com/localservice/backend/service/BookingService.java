package com.localservice.backend.service;

import com.localservice.backend.entity.Booking;
import com.localservice.backend.entity.Provider;
import com.localservice.backend.entity.Service;
import com.localservice.backend.entity.User;
import com.localservice.backend.repository.BookingRepository;
import com.localservice.backend.repository.ProviderRepository;
import com.localservice.backend.repository.ServiceRepository;
import com.localservice.backend.repository.UserRepository;
import com.localservice.backend.service.dto.BookingRequest;
import com.localservice.backend.service.dto.BookingResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ProviderRepository providerRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ServiceRepository serviceRepository,
            ProviderRepository providerRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.providerRepository = providerRepository;
    }


    // =========================
    // CREATE BOOKING
    // =========================

    public BookingResponse createBooking(BookingRequest request) {

        User customer = userRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        Service service = serviceRepository
                .findById(request.getServiceId())
                .orElseThrow(() ->
                        new RuntimeException("Service not found"));

        if (!service.getActive()) {
            throw new RuntimeException("Service is not active");
        }

        if (request.getBookingDate() == null) {
            throw new RuntimeException(
                    "Booking date and time are required"
            );
        }

        /*
         * The services table currently stores the provider's USER ID.
         *
         * Example:
         * services.provider_id = 16
         *
         * But bookings.provider_id references:
         * providers.provider_id = 4
         *
         * Therefore we convert:
         *
         * User ID 16 -> Provider ID 4
         */

        User serviceProvider = service.getProvider();

        if (serviceProvider == null) {
            throw new RuntimeException(
                    "No provider assigned to this service"
            );
        }

        Provider provider = providerRepository
                .findByUserUserId(serviceProvider.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Provider profile not found"
                        ));


        Booking booking = new Booking();

        // Customer
        booking.setCustomer(customer);

        // Correct Provider entity
        booking.setProvider(provider);

        // Selected service
        booking.setService(service);

        // Booking date
        booking.setBookingDate(
                request.getBookingDate()
        );

        // Booking time
        booking.setBookingTime(
                request.getBookingDate().toLocalTime()
        );

        // Address
        booking.setAddress(
                request.getAddress()
        );

        // Notes
        booking.setNotes(
                request.getNotes()
        );

        // Service price
        booking.setTotalPrice(
                service.getPrice()
        );

        // New bookings start as PENDING
        booking.setStatus("PENDING");

        // Creation time
        booking.setCreatedAt(
                LocalDateTime.now()
        );

        Booking savedBooking =
                bookingRepository.save(booking);

        return convertToResponse(savedBooking);
    }


    // =========================
    // CUSTOMER BOOKINGS
    // =========================

    public List<BookingResponse> getBookingsByCustomer(
            Integer customerId) {

        return bookingRepository
                .findByCustomerUserId(customerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // =========================
    // PROVIDER BOOKINGS
    // =========================

    /*
     * The frontend sends the provider's USER ID.
     *
     * Example:
     * Ravi's user ID = 16
     *
     * Booking:
     * provider_id = 4
     *
     * So we search:
     * booking.provider.user.userId = 16
     */

    public List<BookingResponse> getBookingsByProvider(
            Integer providerUserId) {

        return bookingRepository
                .findByProviderUserUserId(providerUserId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // =========================
    // ALL BOOKINGS
    // =========================

    public List<BookingResponse> getAllBookings() {

        return bookingRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // =========================
    // UPDATE BOOKING STATUS
    // =========================

    public BookingResponse updateStatus(
            Integer bookingId,
            String status) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        ));

        booking.setStatus(status);

        Booking updatedBooking =
                bookingRepository.save(booking);

        return convertToResponse(updatedBooking);
    }


    // =========================
    // CONVERT ENTITY TO RESPONSE
    // =========================

    private BookingResponse convertToResponse(
            Booking booking) {

        BookingResponse response =
                new BookingResponse();

        response.setBookingId(
                booking.getBookingId()
        );

        response.setBookingDate(
                booking.getBookingDate()
        );

        response.setCreatedAt(
                booking.getCreatedAt()
        );

        response.setAddress(
                booking.getAddress()
        );

        response.setNotes(
                booking.getNotes()
        );

        response.setStatus(
                booking.getStatus()
        );

        response.setTotalPrice(
                booking.getTotalPrice()
        );


        // =========================
        // CUSTOMER INFORMATION
        // =========================

        if (booking.getCustomer() != null) {

            response.setCustomerId(
                    booking.getCustomer().getUserId()
            );

            response.setCustomerName(
                    booking.getCustomer().getName()
            );
        }


        // =========================
        // SERVICE INFORMATION
        // =========================

        if (booking.getService() != null) {

            response.setServiceId(
                    booking.getService().getServiceId()
            );

            response.setServiceName(
                    booking.getService().getServiceName()
            );

            response.setCategory(
                    booking.getService().getCategory()
            );
        }


        // =========================
        // PROVIDER INFORMATION
        // =========================

        if (booking.getProvider() != null
                && booking.getProvider().getUser() != null) {

            response.setProviderId(
                    booking.getProvider()
                            .getUser()
                            .getUserId()
            );

            response.setProviderName(
                    booking.getProvider()
                            .getUser()
                            .getName()
            );
        }

        return response;
    }
}
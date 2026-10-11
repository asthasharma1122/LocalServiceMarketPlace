
// ============================================================
// LocalServe - Main JavaScript
// ============================================================

const API_BASE_URL = "http://localhost:8080/api";

// ============================================================
// NAVIGATION
// ============================================================

function goToLogin() {
    window.location.href = "login.html";
}

function goToRegister() {
    window.location.href = "register.html";
}

function scrollToServices() {
    const services = document.getElementById("services");

    if (services) {
        services.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// ============================================================
// LOGGED-IN USER
// ============================================================

let loggedInUser = null;

try {
    const storedUser = localStorage.getItem("loggedInUser");

    if (storedUser) {
        loggedInUser = JSON.parse(storedUser);
    }
} catch (error) {
    console.error("Unable to read logged-in user:", error);
    loggedInUser = null;
}

// ============================================================
// LOGOUT
// ============================================================

function logout() {
    localStorage.removeItem("loggedInUser");
    loggedInUser = null;

    window.location.href = "login.html";
}

// ============================================================
// LOGIN
// ============================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Invalid email or password."
                );
            }

            // Save complete user object
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(data)
            );

            loggedInUser = data;

            alert("Login successful!");

            // Redirect according to role
            if (data.role === "PROVIDER") {
                window.location.href = "provider-dashboard.html";
            } else {
                window.location.href = "customer-dashboard.html";
            }

        } catch (error) {
            console.error("Login error:", error);
            alert(error.message);
        }
    });
}

// ============================================================
// REGISTER
// ============================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;
        const location = document.getElementById("location")?.value.trim();
        const role = document.getElementById("role")?.value;

        if (!name || !phone || !email || !password || !location || !role) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        email: email,
                        password: password,
                        location: location,
                        role: role
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Registration failed."
                );
            }

            alert("Registration successful! Please login.");

            window.location.href = "login.html";

        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message);
        }
    });
}

// ============================================================
// POPULATE USER ACCOUNT
// Works for BOTH customer and provider dashboards
// ============================================================

function populateUserAccount() {

    if (!loggedInUser) {
        return;
    }

    // --------------------------------------------------------
    // PROVIDER
    // --------------------------------------------------------

    const providerName =
        document.getElementById("providerName");

    const providerWelcomeName =
        document.getElementById("providerWelcomeName");

    const providerAccountName =
        document.getElementById("providerAccountName");

    const providerAccountEmail =
        document.getElementById("providerAccountEmail");

    const providerAccountPhone =
        document.getElementById("providerAccountPhone");

    const providerAccountLocation =
        document.getElementById("providerAccountLocation");

    if (providerName) {
        providerName.textContent =
            loggedInUser.name || "-";
    }

    if (providerWelcomeName) {
        providerWelcomeName.textContent =
            loggedInUser.name || "Provider";
    }

    if (providerAccountName) {
        providerAccountName.textContent =
            loggedInUser.name || "-";
    }

    if (providerAccountEmail) {
        providerAccountEmail.textContent =
            loggedInUser.email || "-";
    }

    if (providerAccountPhone) {
        providerAccountPhone.textContent =
            loggedInUser.phone || "-";
    }

    if (providerAccountLocation) {
        providerAccountLocation.textContent =
            loggedInUser.location || "-";
    }

    // --------------------------------------------------------
    // CUSTOMER
    // --------------------------------------------------------

    const userName =
        document.getElementById("userName");

    const welcomeName =
        document.getElementById("welcomeName");

    const accountName =
        document.getElementById("accountName");

    const accountEmail =
        document.getElementById("accountEmail");

    const accountPhone =
        document.getElementById("accountPhone");

    const accountLocation =
        document.getElementById("accountLocation");

    const accountRole =
        document.getElementById("accountRole");

    if (userName) {
        userName.textContent =
            loggedInUser.name || "-";
    }

    if (welcomeName) {
        welcomeName.textContent =
            loggedInUser.name || "Customer";
    }

    if (accountName) {
        accountName.textContent =
            loggedInUser.name || "-";
    }

    if (accountEmail) {
        accountEmail.textContent =
            loggedInUser.email || "-";
    }

    if (accountPhone) {
        accountPhone.textContent =
            loggedInUser.phone || "-";
    }

    if (accountLocation) {
        accountLocation.textContent =
            loggedInUser.location || "-";
    }

    if (accountRole) {
        accountRole.textContent =
            loggedInUser.role || "CUSTOMER";
    }
}

// ============================================================
// CUSTOMER SERVICE CATEGORIES
// ============================================================

const serviceCategories = [
    "Home & Property",
    "Beauty & Personal Care",
    "Automotive & Transport",
    "Repairs & Maintenance",
    "Education & Learning",
    "Pets & Animal Care",
    "Events & Occasions",
    "Moving & Delivery",
    "Technology & Digital",
    "Other Services"
];

// ============================================================
// LOAD SERVICES
// ============================================================

async function loadServices() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/services`
        );

        if (!response.ok) {
            throw new Error("Unable to load services.");
        }

        const services = await response.json();

        // Store globally for booking
        window.localServeCustomerServices = services;

        // Customer dashboard
        const customerCategories =
            document.getElementById("customerCategories");

        if (customerCategories) {

            renderCustomerCategories(services);

            return;
        }

        // Generic service grid
        const serviceGrid =
            document.getElementById("serviceGrid");

        if (serviceGrid) {

            renderServiceGrid(
                services,
                serviceGrid
            );
        }

    } catch (error) {

        console.error("Load services error:", error);

        const customerCategories =
            document.getElementById("customerCategories");

        if (customerCategories) {
            customerCategories.innerHTML =
                `<p>Unable to load services.</p>`;
        }

        const serviceGrid =
            document.getElementById("serviceGrid");

        if (serviceGrid) {
            serviceGrid.innerHTML =
                `<p>Unable to load services.</p>`;
        }
    }
}

// ============================================================
// RENDER CUSTOMER CATEGORIES
// ============================================================

function renderCustomerCategories(services) {

    const container =
        document.getElementById("customerCategories");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    serviceCategories.forEach(function (category) {

        const categoryServices =
            services.filter(function (service) {

                const text = (
                    (service.serviceName || "") +
                    " " +
                    (service.category || "")
                ).toLowerCase();

                switch (category) {

                    case "Home & Property":
                        return (
                            text.includes("home") ||
                            text.includes("clean") ||
                            text.includes("plumb") ||
                            text.includes("electric") ||
                            text.includes("carpenter") ||
                            text.includes("ac") ||
                            text.includes("property")
                        );

                    case "Beauty & Personal Care":
                        return (
                            text.includes("beauty") ||
                            text.includes("salon") ||
                            text.includes("hair") ||
                            text.includes("makeup") ||
                            text.includes("spa") ||
                            text.includes("massage")
                        );

                    case "Automotive & Transport":
                        return (
                            text.includes("car") ||
                            text.includes("bike") ||
                            text.includes("auto") ||
                            text.includes("vehicle") ||
                            text.includes("transport") ||
                            text.includes("driver")
                        );

                    case "Repairs & Maintenance":
                        return (
                            text.includes("repair") ||
                            text.includes("maintenance") ||
                            text.includes("mechanic") ||
                            text.includes("appliance") ||
                            text.includes("mobile")
                        );

                    case "Education & Learning":
                        return (
                            text.includes("teacher") ||
                            text.includes("tutor") ||
                            text.includes("education") ||
                            text.includes("course") ||
                            text.includes("tuition")
                        );

                    case "Pets & Animal Care":
                        return (
                            text.includes("pet") ||
                            text.includes("dog") ||
                            text.includes("cat") ||
                            text.includes("animal")
                        );

                    case "Events & Occasions":
                        return (
                            text.includes("event") ||
                            text.includes("wedding") ||
                            text.includes("photograph") ||
                            text.includes("decoration") ||
                            text.includes("catering")
                        );

                    case "Moving & Delivery":
                        return (
                            text.includes("delivery") ||
                            text.includes("moving") ||
                            text.includes("pack") ||
                            text.includes("transport")
                        );

                    case "Technology & Digital":
                        return (
                            text.includes("computer") ||
                            text.includes("laptop") ||
                            text.includes("software") ||
                            text.includes("website") ||
                            text.includes("digital") ||
                            text.includes("tech")
                        );

                    default:
                        return false;
                }
            });

        // Only create category if services exist
        if (categoryServices.length > 0) {

            const categoryDiv =
                document.createElement("div");

            categoryDiv.className =
                "customer-category";

            categoryDiv.innerHTML = `
                <h3>${category}</h3>
                <div class="category-services">
                    ${categoryServices.map(function (service) {
                        return createServiceCard(service);
                    }).join("")}
                </div>
            `;

            container.appendChild(categoryDiv);
        }
    });

    // Services which did not match a category
    const matchedServices = [];

    services.forEach(function (service) {

        const serviceText = (
            (service.serviceName || "") +
            " " +
            (service.category || "")
        ).toLowerCase();

        const matched = serviceCategories.some(function (category) {

            if (category === "Other Services") {
                return false;
            }

            return (
                (category === "Home & Property" &&
                    (
                        serviceText.includes("home") ||
                        serviceText.includes("clean") ||
                        serviceText.includes("plumb") ||
                        serviceText.includes("electric") ||
                        serviceText.includes("carpenter") ||
                        serviceText.includes("ac") ||
                        serviceText.includes("property")
                    )
                ) ||
                (category === "Beauty & Personal Care" &&
                    (
                        serviceText.includes("beauty") ||
                        serviceText.includes("salon") ||
                        serviceText.includes("hair") ||
                        serviceText.includes("makeup") ||
                        serviceText.includes("spa") ||
                        serviceText.includes("massage")
                    )
                ) ||
                (category === "Automotive & Transport" &&
                    (
                        serviceText.includes("car") ||
                        serviceText.includes("bike") ||
                        serviceText.includes("auto") ||
                        serviceText.includes("vehicle") ||
                        serviceText.includes("transport") ||
                        serviceText.includes("driver")
                    )
                ) ||
                (category === "Repairs & Maintenance" &&
                    (
                        serviceText.includes("repair") ||
                        serviceText.includes("maintenance") ||
                        serviceText.includes("mechanic") ||
                        serviceText.includes("appliance") ||
                        serviceText.includes("mobile")
                    )
                ) ||
                (category === "Education & Learning" &&
                    (
                        serviceText.includes("teacher") ||
                        serviceText.includes("tutor") ||
                        serviceText.includes("education") ||
                        serviceText.includes("course") ||
                        serviceText.includes("tuition")
                    )
                ) ||
                (category === "Pets & Animal Care" &&
                    (
                        serviceText.includes("pet") ||
                        serviceText.includes("dog") ||
                        serviceText.includes("cat") ||
                        serviceText.includes("animal")
                    )
                ) ||
                (category === "Events & Occasions" &&
                    (
                        serviceText.includes("event") ||
                        serviceText.includes("wedding") ||
                        serviceText.includes("photograph") ||
                        serviceText.includes("decoration") ||
                        serviceText.includes("catering")
                    )
                ) ||
                (category === "Moving & Delivery" &&
                    (
                        serviceText.includes("delivery") ||
                        serviceText.includes("moving") ||
                        serviceText.includes("pack") ||
                        serviceText.includes("transport")
                    )
                ) ||
                (category === "Technology & Digital" &&
                    (
                        serviceText.includes("computer") ||
                        serviceText.includes("laptop") ||
                        serviceText.includes("software") ||
                        serviceText.includes("website") ||
                        serviceText.includes("digital") ||
                        serviceText.includes("tech")
                    )
                )
            );
        });

        if (!matched) {
            matchedServices.push(service);
        }
    });

    if (matchedServices.length > 0) {

        const otherDiv =
            document.createElement("div");

        otherDiv.className =
            "customer-category";

        otherDiv.innerHTML = `
            <h3>Other Services</h3>
            <div class="category-services">
                ${matchedServices.map(function (service) {
                    return createServiceCard(service);
                }).join("")}
            </div>
        `;

        container.appendChild(otherDiv);
    }

    if (container.innerHTML.trim() === "") {

        container.innerHTML = `
            <p class="empty-message">
                No services are currently available.
            </p>
        `;
    }
}

// ============================================================
// CREATE SERVICE CARD
// ============================================================

function createServiceCard(service) {

    const providerName =
        service.providerName ||
        service.provider?.name ||
        "Local Professional";

    const price =
        service.price !== undefined &&
        service.price !== null
            ? service.price
            : "Contact provider";

    return `
        <div class="homepage-service-card">

            <h4>
                ${escapeHtml(service.serviceName || "Service")}
            </h4>

            <p>
                <strong>Provider:</strong>
                ${escapeHtml(providerName)}
            </p>

            <p>
                <strong>Category:</strong>
                ${escapeHtml(service.category || "-")}
            </p>

            <p>
                <strong>Location:</strong>
                ${escapeHtml(service.location || "-")}
            </p>

            <p>
                <strong>Price:</strong>
                ₹${escapeHtml(String(price))}
            </p>

            <button
                type="button"
                onclick="selectService(${service.serviceId})"
            >
                Book Service
            </button>

        </div>
    `;
}

// ============================================================
// GENERIC SERVICE GRID
// ============================================================

function renderServiceGrid(services, container) {

    if (!container) {
        return;
    }

    if (!services || services.length === 0) {

        container.innerHTML = `
            <p>No services are currently available.</p>
        `;

        return;
    }

    container.innerHTML =
        services.map(function (service) {
            return createServiceCard(service);
        }).join("");
}

// ============================================================
// CUSTOMER CATEGORY OPEN
// ============================================================

function openCustomerCategory(category) {

    const services =
        window.localServeCustomerServices || [];

    if (!services.length) {
        return;
    }

    const filtered =
        services.filter(function (service) {

            const text = (
                (service.serviceName || "") +
                " " +
                (service.category || "")
            ).toLowerCase();

            if (category === "Other Services") {
                return true;
            }

            return text.includes(category.toLowerCase());
        });

    const container =
        document.getElementById("customerCategories");

    if (container) {

        container.innerHTML =
            filtered.length
                ? filtered.map(createServiceCard).join("")
                : "<p>No services found in this category.</p>";
    }
}

// ============================================================
// CUSTOMER BOOKING
// ============================================================

async function selectService(serviceId) {

    if (!loggedInUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    if (loggedInUser.role !== "CUSTOMER") {

        alert("Only customers can book services.");

        return;
    }

    const service =
        findCustomerServiceById(serviceId);

    if (!service) {

        alert("Service not found.");

        return;
    }

    // --------------------------------------------------------
    // DATE + TIME
    // --------------------------------------------------------

    const bookingDate =
        prompt(
            "Enter booking date and time:\n\nFormat: YYYY-MM-DDTHH:MM\nExample: 2026-09-15T14:30"
        );

    if (!bookingDate) {
        return;
    }

    const selectedDate =
        new Date(bookingDate);

    if (isNaN(selectedDate.getTime())) {

        alert(
            "Invalid date/time format.\nUse YYYY-MM-DDTHH:MM"
        );

        return;
    }

    if (selectedDate <= new Date()) {

        alert(
            "Please select a future date and time."
        );

        return;
    }

    // --------------------------------------------------------
    // ADDRESS
    // --------------------------------------------------------

    const address =
        prompt("Enter service address:");

    if (!address || !address.trim()) {

        alert("Address is required.");

        return;
    }

    // --------------------------------------------------------
    // NOTES
    // --------------------------------------------------------

    const notes =
        prompt(
            "Describe your problem or any additional requirements (optional):"
        );

    await createBooking({
        customerId: loggedInUser.userId,
        serviceId: serviceId,
        bookingDate: bookingDate,
        address: address.trim(),
        notes: notes ? notes.trim() : ""
    });
}

// ============================================================
// CREATE BOOKING
// ============================================================

async function createBooking(bookingData) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/bookings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingData)
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Unable to create booking."
            );
        }

        alert("Booking created successfully!");

        // Refresh bookings
        await viewBookings();

    } catch (error) {

        console.error("Booking error:", error);

        alert(error.message);
    }
}

// ============================================================
// FIND CUSTOMER SERVICE
// ============================================================

function findCustomerServiceById(serviceId) {

    const services =
        window.localServeCustomerServices || [];

    return services.find(function (service) {

        return Number(service.serviceId) === Number(serviceId);
    });
}

// ============================================================
// VIEW CUSTOMER BOOKINGS
// ============================================================

async function viewBookings() {

    if (!loggedInUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    const bookingGrid =
        document.getElementById("bookingGrid");

    if (!bookingGrid) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/bookings/customer/${loggedInUser.userId}`
        );

        if (!response.ok) {
            throw new Error("Unable to load bookings.");
        }

        const bookings =
            await response.json();

        if (!bookings || bookings.length === 0) {

            bookingGrid.innerHTML = `
                <div class="empty-message">
                    <h3>No Bookings Yet</h3>
                    <p>You have not booked any services yet.</p>
                </div>
            `;

            return;
        }

        bookingGrid.innerHTML =
            bookings.map(function (booking) {

                const serviceName =
                    booking.serviceName ||
                    booking.service?.serviceName ||
                    "Service";

                const providerName =
                    booking.providerName ||
                    booking.provider?.name ||
                    "Local Professional";

                return `
                    <div class="booking-card">

                        <h3>
                            ${escapeHtml(serviceName)}
                        </h3>

                        <p>
                            <strong>Provider:</strong>
                            ${escapeHtml(providerName)}
                        </p>

                        <p>
                            <strong>Category:</strong>
                            ${escapeHtml(booking.category || "-")}
                        </p>

                        <p>
                            <strong>Date:</strong>
                            ${escapeHtml(booking.bookingDate || "-")}
                        </p>

                        <p>
                            <strong>Address:</strong>
                            ${escapeHtml(booking.address || "-")}
                        </p>

                        <p>
                            <strong>Price:</strong>
                            ₹${escapeHtml(
                                String(
                                    booking.totalPrice ??
                                    booking.totalAmount ??
                                    0
                                )
                            )}
                        </p>

                        <p>
                            <strong>Status:</strong>
                            ${escapeHtml(
                                booking.status || "PENDING"
                            )}
                        </p>

                        ${
                            booking.notes
                                ? `
                                    <p>
                                        <strong>Notes:</strong>
                                        ${escapeHtml(booking.notes)}
                                    </p>
                                  `
                                : ""
                        }

                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("View bookings error:", error);

        bookingGrid.innerHTML = `
            <p>Unable to load bookings.</p>
        `;
    }
}

// ============================================================
// PROVIDER - ADD SERVICE
// ============================================================

const serviceForm =
    document.getElementById("serviceForm");

if (serviceForm) {

    serviceForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (!loggedInUser) {

                alert("Please login first.");

                window.location.href = "login.html";

                return;
            }

            if (loggedInUser.role !== "PROVIDER") {

                alert(
                    "Only providers can add services."
                );

                return;
            }

            const serviceName =
                document.getElementById("serviceName")
                    ?.value.trim();

            const category =
                document.getElementById("category")
                    ?.value.trim();

            const price =
                document.getElementById("price")
                    ?.value;

            const serviceLocation =
                document.getElementById("serviceLocation")
                    ?.value.trim();

            const description =
                document.getElementById("description")
                    ?.value.trim();

            // ------------------------------------------------
            // Only essential fields are required
            // ------------------------------------------------

            if (!serviceName || !category || !price) {

                alert(
                    "Please fill in Service Name, Category and Base Price."
                );

                return;
            }

            if (Number(price) < 0) {

                alert(
                    "Price cannot be negative."
                );

                return;
            }

            try {

                const response = await fetch(
                    `${API_BASE_URL}/services/provider/${loggedInUser.userId}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            serviceName:
                                serviceName,

                            category:
                                category,

                            price:
                                Number(price),

                            location:
                                serviceLocation || "",

                            description:
                                description || ""
                        })
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.error ||
                        "Unable to add service."
                    );
                }

                alert(
                    "Service added successfully!"
                );

                serviceForm.reset();

                await loadProviderServices();

            } catch (error) {

                console.error(
                    "Add service error:",
                    error
                );

                alert(error.message);
            }
        }
    );
}

// ============================================================
// PROVIDER - LOAD SERVICES
// ============================================================

async function loadProviderServices() {

    if (!loggedInUser) {
        return;
    }

    if (loggedInUser.role !== "PROVIDER") {
        return;
    }

    const providerServiceGrid =
        document.getElementById(
            "providerServiceGrid"
        );

    if (!providerServiceGrid) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/services/provider/${loggedInUser.userId}`
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load provider services."
            );
        }

        const services =
            await response.json();

        if (!services || services.length === 0) {

            providerServiceGrid.innerHTML = `
                <div class="empty-message">

                    <h3>
                        No Services Added
                    </h3>

                    <p>
                        You have not added any services yet.
                    </p>

                </div>
            `;

            return;
        }

        providerServiceGrid.innerHTML =
            services.map(function (service) {

                return `
                    <div class="service-card">

                        <h3>
                            ${escapeHtml(
                                service.serviceName ||
                                "Service"
                            )}
                        </h3>

                        <p>
                            <strong>Category:</strong>
                            ${escapeHtml(
                                service.category || "-"
                            )}
                        </p>

                        <p>
                            <strong>Location:</strong>
                            ${escapeHtml(
                                service.location || "-"
                            )}
                        </p>

                        <p>
                            <strong>Price:</strong>
                            ₹${escapeHtml(
                                String(
                                    service.price ?? 0
                                )
                            )}
                        </p>

                        <p>
                            <strong>Description:</strong>
                            ${escapeHtml(
                                service.description ||
                                "No description provided."
                            )}
                        </p>

                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error(
            "Provider services error:",
            error
        );

        providerServiceGrid.innerHTML = `
            <p>
                Unable to load your services.
            </p>
        `;
    }
}

// ============================================================
// PROVIDER - LOAD BOOKINGS
// ============================================================

async function loadProviderBookings() {

    if (!loggedInUser) {
        return;
    }

    if (loggedInUser.role !== "PROVIDER") {
        return;
    }

    const providerBookingGrid =
        document.getElementById(
            "providerBookingGrid"
        );

    if (!providerBookingGrid) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/bookings/provider/${loggedInUser.userId}`
        );

        if (!response.ok) {

            throw new Error(
                "Unable to load booking requests."
            );
        }

        const bookings =
            await response.json();

        if (!bookings || bookings.length === 0) {

            providerBookingGrid.innerHTML = `
                <div class="empty-message">

                    <h3>
                        No Booking Requests
                    </h3>

                    <p>
                        You don't have any customer
                        booking requests yet.
                    </p>

                </div>
            `;

            return;
        }

        providerBookingGrid.innerHTML =
            bookings.map(function (booking) {

                const customerName =
                    booking.customer?.name ||
                    booking.customerName ||
                    "Customer";

                const serviceName =
                    booking.service?.serviceName ||
                    booking.serviceName ||
                    "Service";

                const bookingDate =
                    booking.bookingDate ||
                    "-";

                const bookingTime =
                    booking.bookingTime ||
                    "";

                const address =
                    booking.address ||
                    "-";

                const problem =
                    booking.problemDescription ||
                    booking.problem ||
                    booking.notes ||
                    "";

                const price =
                    booking.totalPrice ??
                    booking.totalAmount ??
                    0;

                const status =
                    booking.status ||
                    "PENDING";

                return `
                    <div class="booking-card">

                        <h3>
                            ${escapeHtml(serviceName)}
                        </h3>

                        <p>
                            <strong>Customer:</strong>
                            ${escapeHtml(customerName)}
                        </p>

                        <p>
                            <strong>Date:</strong>
                            ${escapeHtml(
                                String(bookingDate)
                            )}
                        </p>

                        ${
                            bookingTime
                                ? `
                                    <p>
                                        <strong>Time:</strong>
                                        ${escapeHtml(
                                            String(
                                                bookingTime
                                            )
                                        )}
                                    </p>
                                  `
                                : ""
                        }

                        <p>
                            <strong>Address:</strong>
                            ${escapeHtml(address)}
                        </p>

                        ${
                            problem
                                ? `
                                    <p>
                                        <strong>Problem:</strong>
                                        ${escapeHtml(problem)}
                                    </p>
                                  `
                                : ""
                        }

                        <p>
                            <strong>Price:</strong>
                            ₹${escapeHtml(
                                String(price)
                            )}
                        </p>

                        <p>
                            <strong>Status:</strong>
                            ${escapeHtml(status)}
                        </p>

                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error(
            "Provider bookings error:",
            error
        );

        providerBookingGrid.innerHTML = `
            <p>
                Unable to load booking requests.
            </p>
        `;
    }
}

// ============================================================
// HOMEPAGE SEARCH
// ============================================================

const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const searchValue =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const cards =
                document.querySelectorAll(
                    ".homepage-service-card"
                );

            cards.forEach(function (card) {

                const text =
                    card.textContent
                        .toLowerCase();

                if (
                    !searchValue ||
                    text.includes(searchValue)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";
                }
            });
        }
    );
}

// ============================================================
// ESCAPE HTML
// Prevents service/user text from injecting HTML
// ============================================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Populate customer/provider account information
        populateUserAccount();

        // Customer dashboard
        if (
            document.getElementById(
                "customerCategories"
            )
        ) {

            loadServices();
        }

        // Generic service page
        else if (
            document.getElementById(
                "serviceGrid"
            )
        ) {

            loadServices();
        }

        // Provider services
        if (
            document.getElementById(
                "providerServiceGrid"
            )
        ) {

            loadProviderServices();
        }

        // Provider bookings
        if (
            document.getElementById(
                "providerBookingGrid"
            )
        ) {

            loadProviderBookings();
        }

        // Customer bookings
        if (
            document.getElementById(
                "bookingGrid"
            )
        ) {

            viewBookings();
        }
    }
);


\# Local Service Marketplace — Frontend



\## 📌 Overview



The Local Service Marketplace is a web-based platform that connects customers with local service providers.



The frontend provides separate interfaces for customers and service providers. It communicates with the Spring Boot backend through REST APIs for authentication, services, and booking management.



\---



\## 🛠️ Technologies Used



\- HTML5

\- CSS3

\- JavaScript

\- REST APIs

\- Browser LocalStorage



\---



\## 📂 Frontend Structure



```text

Frontend/

│

├── index.html

├── login.html

├── register.html

├── customer-dashboard.html

├── provider-dashboard.html

├── style.css

├── script.js

└── README.md



✨ Main Features

🔐 User Authentication

Customer registration

Provider registration

User login

Role-based navigation

Login information maintained using LocalStorage

Automatic redirection to the appropriate dashboard

👤 Customer Dashboard



Customers can:



Browse available services

Search for services

Select service categories

View service details

Book services

Select booking date and time

Enter service address

Add booking notes

View their bookings

Track booking status

👨‍🔧 Provider Dashboard



Providers can:



View their services

Add services

Manage service information

View customer booking requests

View booking details

Update booking status





🏠 Service Categories



The platform organizes services into categories such as:



Electrical

Plumbing

Drivers

Gardening

Beauticians

Makeup Artists

🔄 Frontend–Backend Integration



The frontend communicates with the Spring Boot backend using REST APIs.



User

&#x20; │

&#x20; ▼

Frontend

HTML + CSS + JavaScript

&#x20; │

&#x20; │ REST API Requests

&#x20; ▼

Spring Boot Backend

&#x20; │

&#x20; ▼

PostgreSQL Database



The script.js file handles communication between the frontend and backend.



🔑 Authentication Flow

Registration

&#x20;    │

&#x20;    ▼

Spring Boot Backend

&#x20;    │

&#x20;    ▼

User Account Created

&#x20;    │

&#x20;    ▼

Login

&#x20;    │

&#x20;    ▼

Authentication

&#x20;    │

&#x20;    ▼

User Role Identified

&#x20;    │

&#x20;    ├───────────────┐

&#x20;    ▼               ▼

&#x20;Customer         Provider

&#x20;Dashboard        Dashboard





📅 Booking Flow

Customer

&#x20;  │

&#x20;  ▼

Select Service

&#x20;  │

&#x20;  ▼

Enter Date \& Time

&#x20;  │

&#x20;  ▼

Enter Address / Notes

&#x20;  │

&#x20;  ▼

Create Booking

&#x20;  │

&#x20;  ▼

Spring Boot API

&#x20;  │

&#x20;  ▼

PostgreSQL Database

&#x20;  │

&#x20;  ▼

Provider Dashboard

&#x20;  │

&#x20;  ▼

Provider Manages Request







👩‍💻 Project Module



This folder represents the Frontend module of the Local Service Marketplace project.



The complete application consists of:



Frontend

&#x20;   +

Spring Boot Backend

&#x20;   +

PostgreSQL Database


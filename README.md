# HR Management System

A Django REST Framework-based **HR Management System** designed to manage employees, authentication, roles, departments, designations, attendance, and leave requests through secure REST APIs.

## Features

* **JWT Authentication** — Secure login using Access and Refresh Tokens.
* **Role-Based Access Control** — Separate permissions for Admin, HR, and Employee.
* **Employee Management** — Create, view, update, and delete employee records.
* **Department Management** — Create and manage company departments.
* **Designation Management** — Manage designations and associate them with departments.
* **Profile Management** — Employees can manage their personal profile information.
* **Password Management** — Change password, admin password management, and password reset functionality.
* **Forgot Password** — Secure password reset using email-based token verification.
* **Attendance Management** — Mark, view, update, and delete employee attendance records.
* **Leave Management** — Employees can apply for leave with a pending approval workflow.
* **API Testing** — APIs developed and tested using Postman.
* **Data Validation** — Input validation for emails, passwords, roles, and employee information.
* **Secure Password Handling** — Passwords are stored using Django's built-in password hashing system.

## Tech Stack

* **Backend:** Python, Django, Django REST Framework
* **Authentication:** JWT / SimpleJWT
* **Database:** SQLite
* **API Testing:** Postman
* **Version Control:** Git & GitHub

## User Roles

### Admin

* Access all user and employee data
* Manage employees
* Manage departments and designations
* Manage attendance
* Manage leave requests
* Change user passwords
* Update user roles

### HR

* View and manage employee information
* Manage departments and designations
* Manage attendance
* Handle employee leave requests

### Employee

* View their own information
* Update their profile
* Change their password
* Apply for leave
* View their relevant information

## Project Objective

The main objective of this project is to build a practical HR management backend that demonstrates **REST API development, authentication, authorization, database relationships, validation, and role-based access control** using Django REST Framework.

## Future Enhancements

* Leave approval/rejection workflow
* Attendance reports and monthly summaries
* Search, filtering, and pagination
* Email notifications for leave requests
* Employee dashboard
* WhatsApp/email reminders
* Frontend integration with React.js
* Deployment to a cloud platform

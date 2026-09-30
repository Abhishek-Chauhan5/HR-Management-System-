# HR Management System

A **Django REST Framework-based HR Management System** designed to manage employees, authentication, roles, departments, designations, attendance, and leave requests through secure REST APIs.

## 🚀 Project Overview

This project demonstrates the development of a real-world HR management backend using **Django REST Framework**. It includes secure JWT authentication, role-based authorization, employee management, attendance tracking, leave management, password management, and API validation.

## ✨ Key Features

* 🔐 **JWT Authentication** using Access and Refresh Tokens.
* 👥 **Role-Based Access Control** for Admin, HR, and Employee users.
* 👨‍💼 **Employee Management** with Create, Read, Update, and Delete APIs.
* 🏢 **Department Management** with database relationships.
* 💼 **Designation Management** linked with departments.
* 👤 **Profile Management** for employee information.
* 🔑 **Password Management**

  * Change own password
  * Admin password management
  * Forgot password
  * Reset password
* 📅 **Attendance Management**

  * Mark attendance
  * View attendance
  * Update attendance
  * Delete attendance
* 📝 **Leave Management** with employee leave requests and pending status.
* ✅ **API Validation** for usernames, emails, passwords, roles, and employee data.
* 🔒 **Secure Password Storage** using Django's built-in password hashing.
* 🧪 **API Testing** using Postman.

## 👥 User Roles

### Admin

* Manage employees and users
* Manage departments and designations
* Manage attendance and leave
* Manage user roles and passwords
* Access all authorized data

### HR

* Manage employee information
* Manage departments and designations
* Manage attendance
* Handle employee leave requests

### Employee

* View their own information
* Update profile
* Change password
* Apply for leave
* Access their authorized data

## 🛠️ Tech Stack

* **Language:** Python
* **Framework:** Django
* **API:** Django REST Framework
* **Authentication:** SimpleJWT
* **Database:** SQLite
* **API Testing:** Postman
* **Version Control:** Git & GitHub

## 📂 Main Modules

```text
Authentication & JWT
Role-Based Access Control
Employee Management
Profile Management
Department Management
Designation Management
Attendance Management
Leave Management
Password Management
```

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone <your-repository-url>
cd studentapi
```

Create and activate a virtual environment:

```bash
python -m venv myenv
```

Windows:

```bash
myenv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Start the development server:

```bash
python manage.py runserver
```

The API will be available at:

```text
http://127.0.0.1:8000/
```

## 🧪 API Testing

All REST APIs were tested using **Postman**, including authentication, employee management, attendance, departments, designations, and password management.

## 🔮 Future Enhancements

* Leave approval/rejection workflow
* Search, filtering, and pagination
* Attendance reports and monthly summaries
* Email notifications
* Employee dashboard
* WhatsApp/email reminders
* React.js frontend integration
* Cloud deployment

## 🎯 Learning Outcomes

This project provided practical experience with:

* REST API development
* JWT authentication
* Role-based authorization
* CRUD operations
* Django ORM and relationships
* API validation
* Password security
* Postman API testing
* Git and GitHub workflow

---

**Developed by Abhishek Singh Chauhan**

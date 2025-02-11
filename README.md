# Healthcare Management System In Palestine

📌 [View the Project Presentation on Canva](https://www.canva.com/design/DAGehLs9nMg/_Nt1cqJjvR8v2irnmNC4Eg/edit?utm_content=DAGehLs9nMg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

A comprehensive digital platform for healthcare management that bridges the gap between patients, doctors, pharmacies, and laboratories. This project is a graduation project from the Faculty of Engineering at Palestine Technical University (Khadoorie) and is not licensed for public reuse.

### Pictures From the Site

You can view pictures from the site in the [Pictures-From-On-Site folder](./Pictures-From-On-Site).


## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
  - [Front-end Setup](#front-end-setup)
  - [Back-end Setup](#back-end-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License / Disclaimer](#license-disclaimer)

## 🏥 Overview

The Healthcare Digital Management System is designed to revolutionize digital health in Palestine. It provides an integrated solution for appointment scheduling, medical record management, real-time consultations, and seamless pharmacy/laboratory integrations, combining modern web development with healthcare innovation.

## 🚀 Features

- ✅ Appointment Scheduling – Book in-clinic visits or online consultations effortlessly.
- ✅ Digital Medical Records – Securely store and access patient histories, test results, and prescriptions.
- ✅ Doctor & Clinic Management – Tools for doctors to manage schedules, patient records, and clinic operations.
- ✅ Doctor Reports & Prescriptions – Doctors can generate reports in file format with a special header and write prescriptions.
- ✅ Real-time Communication – Chat & video consultations powered by Stream.io and notifications via Pusher.
- ✅ Automated Notifications – Reminders and alerts to keep users informed.

### 🚀 Future Features:
- 🔹 Pharmacy & Laboratory Integration – Electronic prescriptions and lab test requests.
- 🔹 Automate Doctor Account Verification – Integrate data from the medical association to verify doctor credentials.
- 🔹 Implement Social Interaction Features – Allow users to create posts and engage in discussions.
- 🔹 Introduce Medical Webinars and Educational Sessions – Provide users with access to health webinars.
- 🔹 Expand Integration with Insurance Providers – Integrate with government and private insurance companies.
- 🔹 Enhance User Interface – Improve the design for a better experience.
- 🔹 Add a Virtual Assistant Feature – Develop an AI-powered chatbot for scheduling and inquiries.
- 🔹 Improve Electronic Payment Systems – Integrate advanced payment options for consultations.

## 🛠 Technologies

**Front-end:**
- React.js
- Tailwind CSS

**Back-end:**
- Laravel
- MySQL

**Real-time Communication:**
- Stream.io (Chat & Video)
- Pusher (Notifications)
- Vonage
- Email

**Authentication & Security:**
- ID Analyzer (ID verification & secure authentication)

## ⚙️ Installation

### Front-end Setup

1. Clone the repository and navigate to the front-end directory:
    ```bash
    git clone https://github.com/yourusername/healthcare-management-system.git
    cd healthcare-management-system/frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```
   The front-end application will be available at `http://localhost:3000`.

### Back-end Setup

1. Navigate to the back-end directory:
    ```bash
    cd ../backend
    ```

2. Install PHP dependencies using Composer:
    ```bash
    composer install
    ```

3. Copy the example environment file and configure your variables:
    ```bash
    cp .env.example .env
    ```

4. Edit the `.env` file to update your database credentials and other settings.

5. Generate the application key:
    ```bash
    php artisan key:generate
    ```

6. Run the database migrations:
    ```bash
    php artisan migrate
    ```

7. Start the Laravel development server:
    ```bash
    php artisan serve --port=8000
    ```

8. Run the queue worker (for background jobs):
    ```bash
    php artisan queue:work
    ```

9. Run the scheduler (to handle scheduled tasks):
    ```bash
    php artisan schedule:work
    ```
   The back-end API will now be running at `http://localhost:8000`.

---

## 🚀 Running the Application

- **Front-end**: Visit `http://localhost:5174` to use the React application.
- **Back-end API**: Access the API at `http://localhost:8000/api`.

📌 Ensure the front-end is configured with the correct API base URL in case of changes.

---

## 📂 Project Structure


<img width="788" alt="Screenshot 2025-02-11 at 3 39 20 AM" src="https://github.com/user-attachments/assets/56d1f122-21eb-432d-a950-26234250c09d" />

---

## 🤝 Contributing

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Commit your changes with clear messages:
    ```bash
    git commit -am 'Add some feature'
    ```
4. Push to your branch:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Open a Pull Request describing your changes.

---

## ⚠️ License / Disclaimer

❗ **Disclaimer**: This project is a graduation project from the Faculty of Engineering at Palestine Technical University (Khadoorie) and is not licensed for public reuse. All rights are reserved for academic purposes only.

---

🎉 **Enjoy building and enhancing the Healthcare Digital Management System. Let’s transform digital health together!**

# Healthcare Digital Management System

**Presentation:**  
[View the Project Presentation on Canva](https://www.canva.com/design/DAGehLs9nMg/_Nt1cqJjvR8v2irnmNC4Eg/edit?utm_content=DAGehLs9nMg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

A comprehensive digital platform for healthcare management that bridges the gap between patients, doctors, pharmacies, and laboratories. This project is a graduation project from the Faculty of Engineering at Palestine Technical University (Khadoorie) and is not licensed for public reuse.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
  - [Front-end Setup](#front-end-setup)
  - [Back-end Setup](#back-end-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License / Disclaimer](#license--disclaimer)

## Overview

The **Healthcare Digital Management System** is designed to revolutionize digital health in Palestine. By providing an integrated solution for appointment scheduling, medical record management, real-time consultations, and seamless pharmacy/laboratory integrations, this project brings together modern web development with healthcare innovation.

## Features

- **Appointment Scheduling:** Book in-clinic visits or online consultations with ease.
- **Digital Medical Records:** Securely store and access patient histories, test results, and prescriptions.
- **Doctor & Clinic Management:** Tools for doctors to manage schedules, patient records, and clinic operations.
- **Pharmacy & Laboratory Integration:** Seamless electronic prescriptions and lab test requests.
- **Real-time Communication:** Chat and video consultations powered by Stream.io and real-time notifications via Pusher.
- **Automated Notifications:** Reminders and alerts to keep users informed about appointments and updates.

## Technologies

- **Front-end:** React.js, Tailwind CSS
- **Back-end:** Laravel, MySQL
- **Real-time Communication:** Stream.io (for chat & video), Pusher (for notifications)
- **Authentication & Security:** Laravel Analyzer (for ID verification and secure authentication)

## Installation

### Front-end Setup

1. **Clone the repository and navigate to the front-end directory:**

   ```bash
   git clone https://github.com/yourusername/healthcare-management-system.git
   cd healthcare-management-system/frontend
Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm start
The front-end application will be available at http://localhost:3000.

Back-end Setup
Navigate to the back-end directory:

bash
Copy
Edit
cd ../backend
Install PHP dependencies using Composer:

bash
Copy
Edit
composer install
Copy the example environment file and configure your variables:

bash
Copy
Edit
cp .env.example .env
Edit the .env file to update your database credentials and any other settings.

Generate the application key:

bash
Copy
Edit
php artisan key:generate
Run the database migrations:

bash
Copy
Edit
php artisan migrate
Start the Laravel development server on port 8000:

bash
Copy
Edit
php artisan serve --port 8000
Run the queue worker (for background jobs):

bash
Copy
Edit
php artisan queue:work
Run the scheduler (to handle scheduled tasks):

bash
Copy
Edit
php artisan schedule:work
The back-end API will now be running at http://localhost:8000 with the queue and scheduler processes active.

Running the Application
Front-end: Visit http://localhost:3000 to use the React application.
Back-end API: Access the API at http://localhost:8000/api.
Note: Ensure that the front-end environment is configured with the correct API base URL if any changes are made.

Project Structure
pgsql
Copy
Edit
healthcare-management-system/
├── frontend/               # React.js + Tailwind CSS front-end
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md         # (Optional: front-end specific instructions)
├── backend/                # Laravel back-end
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── routes/
│   ├── .env.example
│   ├── composer.json
│   └── README.md         # (Optional: back-end specific instructions)
└── README.md               # This file
Contributing
Contributions are welcome! If you’d like to help improve the project, please follow these steps:

Fork the repository.

Create a new branch for your feature or bug fix:

bash
Copy
Edit
git checkout -b feature/your-feature-name
Commit your changes with clear, descriptive messages:

bash
Copy
Edit
git commit -am 'Add some feature'
Push to your branch:

bash
Copy
Edit
git push origin feature/your-feature-name
Open a Pull Request describing your changes.

License / Disclaimer
Disclaimer: This project is a graduation project from the Faculty of Engineering at Palestine Technical University (Khadoorie) and is not licensed for public reuse. All rights are reserved for academic purposes only.

Enjoy building and enhancing the Healthcare Digital Management System. Let’s transform digital health together!

yaml
Copy
Edit

---

This README now starts with a link to your presentation and provides all the necessary details about y

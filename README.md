Healthcare Digital Management System

📌 View the Project Presentation on Canva

A comprehensive digital platform for healthcare management that bridges the gap between patients, doctors, pharmacies, and laboratories. This project is a graduation project from the Faculty of Engineering at Palestine Technical University (Khadoorie) and is not licensed for public reuse.

📖 Table of Contents

Overview

Features

Technologies

Installation

Front-end Setup

Back-end Setup

Running the Application

Project Structure

Contributing

License / Disclaimer

🏥 Overview

The Healthcare Digital Management System is designed to revolutionize digital health in Palestine. It provides an integrated solution for appointment scheduling, medical record management, real-time consultations, and seamless pharmacy/laboratory integrations, combining modern web development with healthcare innovation.

🚀 Features

✅ Appointment Scheduling – Book in-clinic visits or online consultations effortlessly.✅ Digital Medical Records – Securely store and access patient histories, test results, and prescriptions.✅ Doctor & Clinic Management – Tools for doctors to manage schedules, patient records, and clinic operations.✅ Doctor Reports & Prescriptions – Doctors can generate reports in file format with a special header and write prescriptions.✅ Real-time Communication – Chat & video consultations powered by Stream.io and notifications via Pusher.✅ Automated Notifications – Reminders and alerts to keep users informed.

🚀 Future Features:🔹 Pharmacy & Laboratory Integration – Electronic prescriptions and lab test requests.🔹 Automate Doctor Account Verification – Integrate data from the medical association to verify doctor credentials using their registration numbers.🔹 Implement Social Interaction Features – Allow users to create posts and engage in discussions.🔹 Introduce Medical Webinars and Educational Sessions – Provide users with access to webinars and educational sessions focused on health topics.🔹 Expand Integration with Insurance Providers – Integrate the system with government healthcare and private insurance companies, enabling users to access their benefits.🔹 Enhance User Interface – Improve the system's design for a more efficient and enjoyable user experience.🔹 Add a Virtual Assistant Feature – Develop an AI-powered chatbot to assist users with scheduling appointments, answering medical inquiries, and providing personalized health information.🔹 Improve Electronic Payment Systems – Integrate advanced online payment options, allowing patients to pay for consultations and bookings seamlessly through the website.

🛠 Technologies

Front-end:

React.js

Tailwind CSS

Back-end:

Laravel

MySQL

Real-time Communication:

Stream.io (Chat & Video)

Pusher (Notifications)

Authentication & Security:

Laravel Analyzer (ID verification & secure authentication)

⚙️ Installation

Front-end Setup

Clone the repository and navigate to the front-end directory:

git clone https://github.com/yourusername/healthcare-management-system.git
cd healthcare-management-system/frontend

Install dependencies:

npm install

Start the development server:

npm start

The front-end application will be available at http://localhost:3000.

Back-end Setup

Navigate to the back-end directory:

cd ../backend

Install PHP dependencies using Composer:

composer install

Copy the example environment file and configure your variables:

cp .env.example .env

Edit the .env file to update your database credentials and other settings.

Generate the application key:

php artisan key:generate

Run the database migrations:

php artisan migrate

Start the Laravel development server:

php artisan serve --port=8000

Run the queue worker (for background jobs):

php artisan queue:work

Run the scheduler (to handle scheduled tasks):

php artisan schedule:work

The back-end API will now be running at http://localhost:8000.

🚀 Running the Application

Front-end: Visit http://localhost:3000 to use the React application.

Back-end API: Access the API at http://localhost:8000/api.

📌 Ensure the front-end is configured with the correct API base URL in case of changes.

📂 Project Structure

healthcare-management-system/
├── frontend/  # React.js + Tailwind CSS front-end
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md  # Front-end specific instructions
├── backend/  # Laravel back-end
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── routes/
│   ├── .env.example
│   ├── composer.json
│   └── README.md  # Back-end specific instructions
└── README.md  # This file

🤝 Contributing

We welcome contributions! Follow these steps to contribute:

1️⃣ Fork the repository.2️⃣ Create a new branch for your feature or bug fix:

git checkout -b feature/your-feature-name

3️⃣ Commit your changes with clear messages:

git commit -am 'Add some feature'

4️⃣ Push to your branch:

git push origin feature/your-feature-name

5️⃣ Open a Pull Request describing your changes.

⚠️ License / Disclaimer

❗ Disclaimer: This project is a graduation project from the Faculty of Engineering at Palestine Technical University (Khadoorie) and is not licensed for public reuse. All rights are reserved for academic purposes only.

🎉 Enjoy building and enhancing the Healthcare Digital Management System. Let’s transform digital health together!


# Patient Management System

## Overview

The Patient Management System is a web application designed to help healthcare providers manage patient information efficiently. This system allows for the easy organization, access, and communication of patient data, ensuring streamlined healthcare delivery.

## Features

- **Patient Registration:** Register new patients with their personal and medical 
information.
- **Patient Records:** View and update patient records.
- **Appointment Scheduling:** Schedule and manage patient appointments.
- **Notifications:** Send appointment reminders and notifications via SMS.
- **User Authentication:** Secure login and user management.

## Tech Stack

- **Next.js:** React framework for server-side rendering and generating static websites.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **Appwrite:** Backend server for web, mobile, and flutter developers.
- **Twilio:** Cloud communications platform for sending SMS.

## Installation

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later) or Yarn (v1.x or later)
- Appwrite server (setup and running)
- Twilio account with a verified phone number

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/patient-management-system.git
    cd patient-management-system
    ```

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure environment variables:**

    Create a `.env.local` file in the root of the project and add the following:

    ```env
    NEXT_PUBLIC_APPWRITE_ENDPOINT=https://[YOUR_APPWRITE_ENDPOINT]
    NEXT_PUBLIC_APPWRITE_PROJECT_ID=[YOUR_APPWRITE_PROJECT_ID]
    NEXT_PUBLIC_TWILIO_ACCOUNT_SID=[YOUR_TWILIO_ACCOUNT_SID]
    NEXT_PUBLIC_TWILIO_AUTH_TOKEN=[YOUR_TWILIO_AUTH_TOKEN]
    NEXT_PUBLIC_TWILIO_PHONE_NUMBER=[YOUR_TWILIO_PHONE_NUMBER]
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Patient Registration

1. Navigate to the registration page.
2. Fill out the patient's personal and medical information.
3. Submit the form to add the patient to the system.

### Viewing and Updating Patient Records

1. Navigate to the patient records page.
2. Select a patient to view their details.
3. Edit the information as needed and save the changes.

### Appointment Scheduling

1. Navigate to the appointment scheduling page.
2. Select a patient and choose a date and time for the appointment.
3. Submit the form to schedule the appointment.

### Sending Notifications

1. The system automatically sends SMS reminders for upcoming appointments.
2. Ensure the Twilio account and phone number are correctly configured in the environment variables.

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel.
2. Set up the environment variables in the Vercel dashboard.
3. Deploy the application directly from Vercel.

### Manual Deployment

1. Build the application:

    ```bash
    npm run build
    # or
    yarn build
    ```

2. Start the server:

    ```bash
    npm start
    # or
    yarn start
    ```

3. Access the application at [http://localhost:3000](http://localhost:3000).

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Appwrite](https://appwrite.io/)
- [Twilio](https://www.twilio.com/)

---

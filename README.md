# Cloak Care

## 🤖Overview

Cloak Care is a Patient Management System web application designed to help healthcare providers manage patient information efficiently. This system allows for the easy organization, access, and communication of patient data, ensuring streamlined healthcare delivery.

<img src="./readme/homePic.png"/>

## 🔋Features

- **Patient Registration:** Register new patients with their personal and medical information.
- **Patient Records:** View and update patient records.
- **Appointment Scheduling:** Schedule and manage patient appointments.
- **Notifications:** Send appointment reminders and notifications via SMS.
- **User Authentication:** Secure login and user management.

## ⚙️Tech Stack

- **Next.js:** React framework for server-side rendering and generating static websites.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **Appwrite:** Backend server for web, mobile, and flutter developers.
- **Twilio:** Cloud communications platform for sending SMS.
- **TypeScript:** Typed JavaScript for better code quality and developer experience.
- **Shadcn:** Component library for building accessible and customizable UI.
- **Zod:** TypeScript-first schema declaration and validation library.
- **Sentry:** Application monitoring and error tracking software.
- **React Hook Form:** Performant, flexible, and extensible forms with easy-to-use validation.

## 👨🏾‍💻Installation

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later) or Yarn (v1.x or later)
- Appwrite server (setup and running)
- Twilio account with a verified phone number

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/hollali/cloak_care.git
    cd cloak_care
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
    NEXT_PUBLIC_SENTRY_DSN=[YOUR_SENTRY_DSN]
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🖥️Usage📱

### Patient Registration

1. Navigate to the registration page.
2. Fill out the patient's personal and medical information using the form.
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

## 🚀Deployment🚀

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
- [TypeScript](https://www.typescriptlang.org/)
- [Shadcn](https://shadcn.dev/)
- [Zod](https://zod.dev/)
- [Sentry](https://sentry.io/)
- [React Hook Form](https://react-hook-form.com/)

---
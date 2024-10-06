PROJECT NAME: USER MANAGEMENT INTERFACE;

OVERVIEW:

This project is a full-stack web application designed for user account management and authentication. It offers a range of features, including user login, registration, password reset, and role-based access control. The application uses JWT (JSON Web Tokens) for authentication, providing access and refresh tokens to enhance security. It includes user management capabilities like password validation, role assignment, and more.



FEATURES: 

# User Authentication:
    . User login
    . User can reset password (Forgot Password) and receive a reset link via email

# Normal User Features:
    . Edit profile
    . Change password
    . Deactivate account

# Admin Dashboard:
The application includes an Admin Dashboard, which allows administrators to efficiently manage user accounts. Admins can:

    . View all registered users.
    . Edit any user profile, including updating roles and statuses.
    . Activate or deactivate user accounts.
    . Permanently delete user accounts.
    . Assign roles to users (e.g., promoting a normal user to an admin).

TECHNOLOGIES :-

    1. Frontend: React, Axios
    2. Backend: Node.js, Express
    3. Database: MongoDB, Mongoose
    4. Authentication: JWT (JSON Web Tokens)
    5. Middleware: Express, Mongoose Validation

How to run the project 🚀:

1. Open the Terminal.
2. Clone the repository by running: $ git clone https://github.com/francis-musyoka/-User-Management-Interface- .
3. Ensure that NodeJS and npm are installed on the system.
4. change the diectory to repository name using $ cd -User-Management-Interface-.
5. Install the dependencies for both the frontend and backend $ npm install.
6. To run the project in development mode, execute: npm run dev ; both the frontend and backend.
7. The React project will run on http://localhost:3000 by default. Make sure your backend API is also running.



Environment Variables Setup 🛠️

# Create a .env file in the backend root directory with the following variables:

    PORT=3800
    END_POINT_LINK=<MongoDB Connection String>
    PASSWORD=<Database Password>
    ACCESS_TOKEN_SECRET=<Access Token Secret>
    REFRESH_TOKEN_SECRET=<Refresh Token Secret>
    FORGOT_PASSWORD_TOKEN_SECRET=<Forgot Password Token Secret>
    ACCESS_TOKEN_EXPIRES_IN=300
    REFRESH_TOKEN_EXPIRES_IN=604800
    FORGOT_PASSWORD_TOKEN_EXPIRES_IN=900
    PASSWORDAPP=<App-Specific Password>
    E_MAIL=<Your Email>
    COOKIE_SECURE=true
    COOKIE_HTTP_ONLY=true
    COOKIE_SAME_SITE=Lax

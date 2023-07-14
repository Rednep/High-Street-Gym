# High Street Gym Application 💪📱

Hello and welcome to the repository of the High Street Gym Application, a robust full-stack solution developed to modernize High Street Gym's user experience, facilitating seamless class bookings and enabling users to share their fitness journey via blog posts.

## Backend Tech Stack 🖥️

The backend of our application leans on Node.js and Express to create REST APIs and has several dependencies, such as Express, MySQL2, Swagger (for API documentation), and more. This forms the data layer of the application, handling user data, class bookings, and blog posts.

- **Express**: Building our API endpoints.
- **MySQL2**: Our chosen MySQL client for Node.js, prized for its performance.
- **Swagger UI Express**: Express-served Swagger UI for documenting APIs.
- **bcryptjs**: For hashing passwords securely.
- **CORS**: A Connect/Express middleware package that enables CORS.
- **express-fileupload**: A middleware to handle multipart/form-data, predominantly used for file uploads.
- **express-json-validator-middleware**: A middleware for validating JSON body data.
- **uuid**: For the creation of RFC4122-compliant UUIDs.
- **xml2js**: Converts XML to JavaScript objects.

## Frontend Tech Stack 🌐

On the frontend, we employ React to deliver a dynamic, modular, and user-friendly interface, leveraging libraries like DaisyUI for UI components and Styled Components for more customized component styles.

- **React**: Our chosen JavaScript library for building interactive user interfaces.
- **DaisyUI**: A plugin for Tailwind CSS, offering beautiful UI components.
- **Styled Components**: A library that lets us create CSS in JavaScript while building custom components.
- **Tailwind CSS**: A utility-first CSS framework that allows for fast and flexible creation of custom web interfaces.
- **Vite**: Our go-to build tool for a leaner and faster development experience for modern web projects.

## Showcase & Contact 🏆💌

This project serves as a testament to my abilities as a full-stack developer. Prospective employers interested in discussing this project or any other aspect of my work are enthusiastically encouraged to connect.

## Challenges & Solutions 💡

### State Management 🔄
Managing state across multiple components proved to be a significant challenge during development.

#### Solution 🎯
To effectively manage state across various components, we harnessed the power of the context API.

### Code Maintainability 🔍
As the application evolved and features expanded, the code volume increased, threatening readability.

#### Solution 🎯
To maintain code readability, we ensured a modular approach when creating pages and components by breaking them up into separate files. This resulted in cleaner code and easier readability.

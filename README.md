[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# Countries Explorer App

A full-stack application that integrates with the REST Countries API, built with React, Node.js, Express, and MongoDB.

## Features

- Browse all countries with information about their population, region, languages, etc.
- Search for countries by name
- Filter countries by region
- View detailed information about a specific country
- Toggle between light and dark mode
- User authentication (register/login)
- Save favorite countries (requires authentication)
- Responsive design for all devices

## Tech Stack

### Frontend

- React with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Context API for state management

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## API Endpoints Used

The application integrates with the [REST Countries API](https://restcountries.com/) using the following endpoints:

- GET /all - Retrieve all countries
- GET /name/{name} - Search for a country by name
- GET /region/{region} - Filter countries by region
- GET /alpha/{code} - Get detailed information about a country by its code

## Project Structure

```
.
├── backend/              # Backend codebase
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # API controllers
│   │   ├── middlewares/  # Express middlewares
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── server.js     # Entry point
│   ├── .env.sample       # Environment variables template
│   └── package.json      # Backend dependencies
│
└── frontend/             # Frontend codebase
    ├── public/           # Static files
    ├── src/
    │   ├── api/          # API service functions
    │   ├── components/   # Reusable components
    │   ├── context/      # Context providers
    │   ├── hooks/        # Custom hooks
    │   ├── pages/        # Page components
    │   ├── utils/        # Utility functions
    │   ├── App.jsx       # Root component
    │   └── main.jsx      # Entry point
    ├── .env.sample       # Environment variables template
    └── package.json      # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-IT22320896.git
   ```

2. Set up the backend:

   ```bash
   cd backend
   npm install
   cp .env.sample .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. Set up the frontend:

   ```bash
   cd frontend
   npm install
   cp .env.sample .env
   ```

4. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

5. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Backend

- Deploy the backend to a service like Render or Fly.io
- Set up MongoDB Atlas for the database

### Frontend

- Deploy the frontend to Vercel or Netlify
- Configure environment variables for production

## License

This project is licensed under the MIT License.

## Acknowledgements

- [REST Countries API](https://restcountries.com/) for providing the country data
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend framework
- [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) for the backend
- [MongoDB](https://www.mongodb.com/) for the database

## Contact

Mohamed Mufeez - mufeez45@gmail.com

Project Link: https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-IT22320896.git

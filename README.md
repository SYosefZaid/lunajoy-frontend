# Luna Joy Frontend

This is the frontend application for the Luna Joy Mental Health Progress Tracker. Built with React, TypeScript, and Material-UI.

## Features

- Modern React with TypeScript
- Material-UI components and theming
- Google OAuth integration
- React Query for data fetching
- React Router for navigation
- Responsive design

## Prerequisites

- Node.js (>=20.0.0 <21.0.0)
- npm (>=9.0.0 <10.0.0)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:3001/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## Project Structure

```
src/
  ├── components/    # Reusable components
  ├── context/      # React context providers
  ├── hooks/        # Custom React hooks
  ├── pages/        # Page components
  ├── services/     # API services
  ├── App.tsx       # Main application component
  └── main.tsx      # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

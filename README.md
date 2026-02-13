# LegalMatch Pro - Role-Based Dashboard

A modern, responsive dashboard application built with **React**, **Vite**, and **Tailwind CSS**. This project features role-based access control with distinct layouts and content for Citizens, Lawyers, NGOs, and Administrators.

## 🚀 Features

- **Role-Based Views**: dedicated dashboards for:
  - **Citizen**: Manage requests, view matches, and directory.
  - **Lawyer**: Case management and profile settings.
  - **NGO**: Impact tracking and project management.
  - **Admin**: comprehensive validation queue, system logs, and user management.
- **Responsive Design**: Mobile-friendly sidebar and layouts using Tailwind CSS.
- **Modern UI**: Clean, light-themed interface inspired by professional legal platforms.
- **Routing**: Client-side routing with `react-router-dom`.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd Dashboards
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## ▶️ Usage

### Development Server
Run the app in development mode with hot reloading:
```bash
npm run dev
# or
npm start
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build for Production
Build the app for production to the `dist` folder:
```bash
npm run build
```

### Preview Production Build
Locally preview the production build:
```bash
npm run preview
```

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
│   └── Sidebar.jsx   # Role-based navigation sidebar
├── layouts/          # Layout wrappers
│   └── DashboardLayout.jsx
├── pages/            # Page components for each route
│   ├── AdminDashboard.jsx
│   ├── CitizenDashboard.jsx
│   ├── LawyerDashboard.jsx
│   └── NGODashboard.jsx
├── App.jsx           # Main application component & routing
├── main.jsx          # Application entry point
└── index.css         # Global styles & Tailwind imports
```

## 🔐 Access Control

The application currently simulates role-based access via URL paths:
- `/citizen` - Citizen Dashboard
- `/lawyer` - Lawyer Dashboard
- `/ngo` - NGO Dashboard
- `/admin` - Admin Panel

*Note: Authentication is currently mocked for demonstration purposes.*

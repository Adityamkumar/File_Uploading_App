# Droply - File Sharing App

Droply is a modern, secure, and efficient file-sharing application designed to make storing and sharing files seamless. Built with a robust technology stack, it offers a user-friendly interface for managing your files with ease.

![Droply Demo Image](/frontend/public/demo.png)
*(Result of the application)*

## 🚀 Features

- **User Authentication**: Secure Sign Up, Login, and Logout functionality using JWT.
- **File Upload**: Drag-and-drop or click-to-upload support with real-time progress bars.
- **Dashboard**: A clean, responsive dashboard to view and manage your uploaded files.
- **File Management**:
  - View file details (name, size, upload time).
  - Download files directly.
  - Delete files with a confirmation modal.
- **Dark Mode Support**: Fully responsive design with dark mode aesthetics.
- **Cloud Storage**: seamless integration with **ImageKit** for reliable file storage.

## 🛠️ Technologies Used

### Frontend
- **React.js**: Library for building the user interface.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: For making HTTP requests to the backend.
- **Lucide React**: For beautiful and consistent icons.
- **React Router DOM**: For client-side routing.
- **GSAP & Three.js**: Implemented for advanced animations and visual effects.

### Backend
- **Node.js & Express.js**: Runtime environment and framework for the API.
- **MongoDB & Mongoose**: NoSQL database for storing user and file metadata.
- **ImageKit**: Cloud storage service for handling file uploads.
- **Multer**: Middleware for handling `multipart/form-data`.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Bcrypt**: For password hashing.

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Node.js installed
- MongoDB installed or a MongoDB Atlas URI
- ImageKit account for file storage credentials

### 1. Clone the Repository
```bash
git clone <repository-url>
cd File_Sharing_App
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The app should now be running at `http://localhost:5173`.

## 👨‍💻 Author

Built by ❤️ **Aditya Kumar**.

- **Portfolio**: [Visit My Portfolio](https://aditya-dev-portfolio-iota.vercel.app/) 
- **GitHub**: [Adityamkumar](https://github.com/Adityamkumar)

---

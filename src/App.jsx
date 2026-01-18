import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

// עמודי הרישום והכניסה
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RegisterInfo from './pages/Register/RegisterInfo';

// עמודי הבית
import Home from './pages/Home/Home';
import TodosPage from './pages/Home/TodosPage';
import PostsPage from './pages/Home/PostsPage';
import AlbumsPage from './pages/Home/AlbumsPage';
import PhotoGallery from './components/Albums/PhotoGallery'; // הייבוא מהתיקייה החדשה שצילמת [cite: 7, 27]
import InfoPage from './pages/Home/InfoPage';


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-info" element={<RegisterInfo />} />
          <Route path="/home" element={<Home />}>
            <Route path="todos" element={<TodosPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="info" element={<InfoPage />} />
            <Route path="albums" element={<AlbumsPage />} /> 
            <Route path="albums/:albumId/photos" element={<PhotoGallery />} />
          </Route>

          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

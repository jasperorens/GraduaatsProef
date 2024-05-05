import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from "./Pages/HomePage.jsx";
import ErrorPage from "./Pages/ErrorPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<HomePage />} path="/" />
                <Route element={<ErrorPage />} path="/*" />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

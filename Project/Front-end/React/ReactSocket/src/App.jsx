import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from "./Pages/HomePage.jsx";
import ErrorPage from "./Pages/ErrorPage.jsx";
import { WebSocketProvider } from "./context/WebSocketContext.jsx";

function App() {
    return (
        <BrowserRouter>
            <WebSocketProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/*" element={<ErrorPage />} />
                </Routes>
            </WebSocketProvider>
        </BrowserRouter>
    );
}

export default App;

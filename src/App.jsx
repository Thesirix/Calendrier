import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/login.jsx';
import Landing from './components/body/landing.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* PAGE CONNEXION */}
                <Route path="/" element={<Login />} />

                {/* PAGE PLANNING */}
                <Route path="/landing" element={<Landing />} />
            </Routes>
        </Router>
    );
};

export default App;

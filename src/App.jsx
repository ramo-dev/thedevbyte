import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { account } from '../src/firebase/firebase';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './routes/NotFound';
import Blogs from './routes/Blogs';
import Profile from '../src/components/Profile/Profile';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = account.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });
        return unsubscribe;
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path='/' element={<Blogs/>}/>
                <Route path="/register" element={<Register />} />
                <Route
                    path="/profile"
                    element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;

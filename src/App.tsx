import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import About from './components/about/About';
import NotFound from './components/notFound/NotFound';
import LoadingScreen from "./components/loading/LoadingScreen";
import StartScreen from "./components/start/StartScreen";
import TapScreen from "./components/home/tapScreen/TapScreen";
import HomeScreen from "./components/home/Home";
import LevelScreen from "./components/home/levelScreen/LevelScreen.tsx";
import ProfileScreen from "./components/home/profileScreen/ProfileScreen.tsx";
import TasksScreen from "./components/home/tasksScreen/TasksScreen.tsx";
import { DataProvider } from "./components/DataContext.tsx";
import { RedirectsScreen } from "./components/redirects/RedirectsScreen.tsx";
import { FriendsScreen } from "./components/home/friendsScreen/FriendsScreen.tsx";
import { ToastProvider } from "./components/viewComponents/toast/ToastContext.tsx";
import { CheckScreen } from "./components/loading/CheckScreen.tsx";
import { BoostScreen } from "./components/home/tapScreen/boostScreen/BoostScreen.tsx";
import "./App.css"

const App: React.FC = () => {
    const setAppHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    useEffect(() => {
        setAppHeight();
        window.addEventListener('resize', setAppHeight);
        return () => {
            window.removeEventListener('resize', setAppHeight);
        };
    }, []);

    return (
        <div className="app-container">
            <DataProvider>
                <ToastProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<LoadingScreen />} />
                            <Route path="/loading" element={<LoadingScreen />} />
                            <Route path="/check" element={<CheckScreen />} />
                            <Route path="/boost" element={<BoostScreen />} />
                            <Route path="/start" element={<StartScreen />} />
                            <Route path="/tap" element={<TapScreen />} />
                            <Route path="/friends" element={<FriendsScreen />} />
                            <Route path="/tasks" element={<TasksScreen />} />
                            <Route path="/profile" element={<ProfileScreen />} />
                            <Route path="/home" element={<HomeScreen />}>
                                <Route index element={<Navigate to="tap" />} />
                                <Route path="tap" element={<TapScreen />} />
                                <Route path="friends" element={<FriendsScreen />} />
                                <Route path="tasks" element={<TasksScreen />} />
                                <Route path="profile" element={<ProfileScreen />} />
                            </Route>
                            <Route path="/level" element={<LevelScreen />} />
                            <Route path="/tap" element={<TapScreen />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/not-found" element={<NotFound />} />
                            <Route path="*" element={<NotFound />} />
                            <Route path="/redirects" element={<RedirectsScreen />} />
                        </Routes>
                    </Router>
                </ToastProvider>
            </DataProvider>
        </div>
    );
};

export default App;

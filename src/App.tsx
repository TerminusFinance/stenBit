import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import About from './components/about/About';
import NotFound from './components/notFound/NotFound';
import LoadingScreen from "./components/loading/LoadingScreen";
import StartScreen from "./components/start/StartScreen";
import TapScreen from "./components/home/tapScreen/TapScreen";
import HomeScreen from "./components/home/Home";
import LevelScreen from "./components/home/levelScreen/LevelScreen.tsx";
import ProfileScreen from "./components/home/profileScreen/ProfileScreen.tsx";
import TasksScreen from "./components/home/tasksScreen/TasksScreen.tsx";

const App: React.FC = () => {
    return (
        <Router basename={"/stenBit"}>
            <Routes>
                <Route path="/" element={<LoadingScreen/>}/>
                <Route path="/start" element={<StartScreen/>}/>
                <Route path="/home" element={<HomeScreen/>}>
                    <Route index element={<Navigate to="tap"/>}/>
                    <Route path="tap" element={<TapScreen/>}/>
                    <Route path="friends" element={<div>Friends Screen</div>}/>
                    <Route path="tasks" element={<TasksScreen/>}/>
                    <Route path="profile" element={<ProfileScreen/>}/>
                    <Route path="level" element={<LevelScreen/>}/>
                </Route>
                <Route path="/tap" element={<TapScreen/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/not-found" element={<NotFound/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Router>
    );
};



export default App
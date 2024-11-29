import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CircuitSketch from "Pages/CircuitSketch";



const App: React.FC = () => {
    return (
        <Router basename="/CircuitSketch">
            <Routes>
                <Route path="/" element={<CircuitSketch/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </Router>
    );
};

export default App;
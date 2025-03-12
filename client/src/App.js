import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Form from './components/Form';
import ChatBot from './components/ChatBot';
import './App.css';
import PatientList from './components/PatientsList';
import ReportsList from './components/ReportsList';
import Dashboard from './components/Dashboard'
import PatientReport from './components/PatientReport'
import GoogleTranslate from './components/GoogleTranslate';
import ChatWidget from './components/ChatWidget';

import Admin from './components/Admin';
import MedicalLoadingComponent from './components/MedicalLoadingComponent';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID,setUserID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loginState = sessionStorage.getItem('isLoggedIn');
    if (loginState) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userType');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div>
      <GoogleTranslate/>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/Admin' element={isLoggedIn && sessionStorage.getItem('userType') === 'Admin' ? <Admin /> : <Home />} />
        <Route path='/reports' element={isLoggedIn && (sessionStorage.getItem('userType') === 'Care Taker' || sessionStorage.getItem('userType') ==='doctor')? <PatientList setUserID={setUserID}/> : <Home />} />
        <Route path="/dashboard/:userId" element={isLoggedIn && (sessionStorage.getItem("userType") === "Care Taker" || sessionStorage.getItem("userType") === "doctor") ? ( <Dashboard />) : ( <Home />)}/>
        <Route path="/loading" element={<MedicalLoadingComponent/>}></Route>
        <Route path='/analysis' element={isLoggedIn && (sessionStorage.getItem('userType') === 'Care Taker' || sessionStorage.getItem('userType') ==='doctor')? <PatientReport/> : <Home />} />
        <Route path='/chatbot' element={isLoggedIn && sessionStorage.getItem('userType') === 'doctor' ? <ChatBot /> : <Home />} />
      </Routes>
      <ChatWidget/>
    </div>
  );
};

export default App;

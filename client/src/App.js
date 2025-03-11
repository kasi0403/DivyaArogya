import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Form from './components/Form';
import Profile from './components/Profile';
import ChatBot from './components/ChatBot';
import './App.css';
import Admin from './components/Admin';
import PatientList from './components/PatientsList';
import ReportsList from './components/ReportsList';
import Dashboard from './components/Dashboard'
import ReportsDisplay from './components/ReportsDisplay';
import PatientReport from './components/PatientReport'
import GoogleTranslate from './components/GoogleTranslate';
import ChatWidget from './components/ChatWidget';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        {/* <Route path='/form' element={isLoggedIn && sessionStorage.getItem('userType') === 'Care Taker' ? <Form /> : <Home />} /> */}
        <Route path='/reports' element={isLoggedIn && (sessionStorage.getItem('userType') === 'Care Taker' || sessionStorage.getItem('userType') ==='doctor')? <PatientList /> : <Home />} />
        {/* <Route path='/dashboard/:userId/vitals' element={isLoggedIn && (sessionStorage.getItem('userType') === 'Care Taker' )? <VitalForm/> : <Home />} /> */}
        <Route path='/dashboard/:userId' element={isLoggedIn && (sessionStorage.getItem('userType') === 'Care Taker' || sessionStorage.getItem('userType') ==='doctor')? <Dashboard/> : <Home />} />
        <Route path='/analysis' element={isLoggedIn && (sessionStorage.getItem('userType') === 'Care Taker' || sessionStorage.getItem('userType') ==='doctor')? <PatientReport/> : <Home />} />
        {/* <Route path='/reportsList/:userId' element={isLoggedIn && (sessionStorage.getItem('userType') === 'Care Taker'  || sessionStorage.getItem('userType') ==='doctor')? <ReportsList /> : <Home />} /> */}
        <Route path='/report/:reportId' element={isLoggedIn && (sessionStorage.getItem('userType') === 'Care Taker' || sessionStorage.getItem('userType') ==='doctor') ? <ReportsDisplay/> : <Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/chatbot' element={isLoggedIn && sessionStorage.getItem('userType') === 'doctor' ? <ChatBot /> : <Home />} />
        <Route path='/Admin' element={isLoggedIn && sessionStorage.getItem('userType') === 'admin' ? <Admin /> : <Home />} />
      </Routes>
      <ChatWidget/>
    </div>
  );
};

export default App;
